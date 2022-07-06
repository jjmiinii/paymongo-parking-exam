import db from '../models/'
import BaseService from './BaseService';
import ParkingRepository from '../repositories/ParkingRepository';
import TransactionRepository from '../repositories/TransactionRepository'
import VehicleTypeRepository from '../repositories/VehicleTypeRespository';
import CapacityRateRepository from '../repositories/CapacityRateRepository';
import ParkingCapacityRepository from '../repositories/ParkingCapacityRepository';
import VehicleTypeCapacityRepository from '../repositories/VehicleTypeCapacityRepository';
import DetailedTransactionRepository from '../repositories/DetailedTransactionRepository';

const { 
    Vehicle,
    sequelize,
    Transaction,
    DetailedTransaction,
} = db;

const FLAT_RATE = 40;
const DEFAULT_HOURS = 3;
const PER_DAY_RATE = 5000;
const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;

export default class TransactionService extends BaseService{
    constructor() {
        super();
        this.parkingRepository = new ParkingRepository();
        this.transactionRepository = new TransactionRepository();
        this.vehicleTypeRepository = new VehicleTypeRepository();
        this.capacityRateRepository = new CapacityRateRepository();
        this.parkingCapacityRepository = new ParkingCapacityRepository();
        this.vehicleTypeCapacityRepository = new VehicleTypeCapacityRepository();
        this.detailedTransactionRepository = new DetailedTransactionRepository();
    };
    
    entryPointPriorization = (enrtyPoints = [], entryFloor = '') =>{
        const entryPointList = this.helper.toArray(enrtyPoints, 'entryPoint');
        let  remainingEnrtyPoints =  this._.remove(entryPointList, (ep =>  ep !== entryFloor));
        remainingEnrtyPoints.unshift(entryFloor);
        return remainingEnrtyPoints;
    }

    getCurrentParkingFee = ({ totalHourDuration = 0, parkingRate = 0, previousFee = 0 }) => {
        let currentFee = 0;

        //parking is less than or equal to flat rate hours
        if(totalHourDuration <= DEFAULT_HOURS){
            currentFee = FLAT_RATE;
        //parking is more the flat rate hours
        } else if(totalHourDuration < HOURS_PER_DAY){
            const totalRemainingHours = totalHourDuration - DEFAULT_HOURS;
            currentFee = (totalRemainingHours * parkingRate) + FLAT_RATE
        //parking more than 23 hours
        } else {
            const daysParked        =   Math.trunc(totalHourDuration / HOURS_PER_DAY);
            const daysParkedFee     =   daysParked * PER_DAY_RATE;
            const remainingHours    =   totalHourDuration - (daysParked * HOURS_PER_DAY);
            const remainingHoursFee =   remainingHours * parkingRate;

            currentFee = daysParkedFee + remainingHoursFee;
        }

        currentFee = currentFee - previousFee;

        return currentFee;
    }

    enterParking = (req) => {
        return new Promise(async (resolve, reject) => {
            const { 
                plateNumber,
                vehicleTypeId,
            } = req.body;

            //initialize transaction
            const seqTransaction = await sequelize.transaction();
            try {
                const transactionInfo = await this.transactionRepository.getVehicleTransaction({ queryParams: {
                    where: {
                        plateNumber
                    },
                    limit: 1
                } });
                
                //check parking status if still ACTIVE
                if(transactionInfo && transactionInfo.detailed_transactions[0].status === 1){
                    throw ({statusCode: 400, message: 'Vehicle is still in park!'});
                }
                
                const vehicleType = await this.vehicleTypeRepository.getVehicleType({ 
                    queryParams : { vehicleTypeId }
                });

                if(!vehicleType){
                    throw({ statusCode: 404, message: 'Type of vechicle cannot be found'});
                }
                
                const [ vehicle, vehicleCreated ] = await Vehicle.findOrCreate({ 
                    where: { plateNumber },
                    defaults: {
                        plateNumber,
                        vehicleTypeId
                    },
                    transaction: seqTransaction
                });

                //get vehicle allowed parking type ex. S - SP, MP, LP 
                const allowedParkings = await this.vehicleTypeCapacityRepository.getAllowedVehicleCapacity({ 
                    queryParams: { vehicleTypeId } 
                });

                if(this._.isEmpty(allowedParkings)){
                    throw({ statusCode: 400, message: 'Vehicle type is not allowed!'});
                }

                // get all occupied parkings
                //1:ACTIVE, 2:COMPLETED
                const occupiedParkings = await this.detailedTransactionRepository.getOccupiedParkings();

                //get parking entry point
                const parkingEntryPoint = await this.parkingRepository.getParkingEntryPoint();

                //set entry floor in first
                const entryPoints = this.entryPointPriorization(parkingEntryPoint, req.body.entryPoint);


               
                let availableParking = [];
                //find parking with the nearest possible from entry point
                for(let entryPoint of entryPoints){
                    availableParking = await this.parkingCapacityRepository.getAvailableParking({
                        queryParams: {
                            occupiedParkings,
                            allowedParkings,
                            entryPoint
                        }
                    });
                    //stop if floor found
                    if(availableParking) break;
                }
               
                if(!availableParking){
                    throw ({statusCode: 404, message: 'No available Parking!'});
                }

                //check if has previous transaction
                if(transactionInfo && !this._.isEmpty(transactionInfo.detailed_transactions) && transactionInfo.detailed_transactions[0].status === 2){
                    const now = new Date();
                    //get the minutes of the vehicle when park again
                    const parkingDurationInMinutes = this.helper.getDateDiffInMinutes({
                        startDate: transactionInfo.detailed_transactions[0].createdAt,
                        endDate: now
                    });
                    //if vehicle park again before 1 hour, create slave transaction
                    if(parkingDurationInMinutes < MINUTES_PER_HOUR){
                        await DetailedTransaction.create({
                            transactionId: transactionInfo.id,
                            parkingId: availableParking.parkingId,
                            fee: 0,
                            duration: 0,
                            status: 1
                        },{  transaction: seqTransaction });
                    }
                    //create master with slave transaction
                } else {
                    const transaction = await Transaction.create({
                            vehicleId: vehicle.id,
                            plateNumber: vehicle.plateNumber,
                        },{transaction: seqTransaction});

                    if(transaction){
                        await DetailedTransaction.create({
                            transactionId: transaction.id,
                            parkingId: availableParking.parkingId,
                            fee: 0,
                            duration: 0,
                            status: 1
                        },{  transaction: seqTransaction });
                    }
                }

                //commit transaction
                await seqTransaction.commit();
                
                //display latest data
                const data = await this.transactionRepository.getVehicleTransaction({ queryParams: {
                    where: { plateNumber }
                }});
                
                resolve({ data, statusCode: 200});
            } catch(error) {
                console.log(error);
                //roll back
                await seqTransaction.rollback();
                reject(error);
            }
        })
    }
    exitParking = (req) => {
        return new Promise(async (resolve, reject) => {
            const { 
                plateNumber,
            } = req.body;

            try {
                const previousTransaction = await this.transactionRepository.getVehicleTransaction({
                    queryParams: {
                        where: { plateNumber }
                    }
                 });

                if(!previousTransaction || this._.isEmpty(previousTransaction.detailed_transactions)){
                    reject({ statusCode: 404, message: 'No transaction found!'});
                }

                if(previousTransaction.detailed_transactions[0].status === 2){
                    reject({ statusCode: 400, message: 'Transaction already completed'});
                }

                const now = new Date();
                    //get the Hours of the vehicle when park again
                const currentHourDuration = this.helper.getDateDiffInHours({
                    startDate: previousTransaction.detailed_transactions[0].createdAt,
                    endDate: now
                });

                const parkingId = previousTransaction.detailed_transactions[0].parkingId;
                const capacity = await this.parkingCapacityRepository.readOne({ queryParams: {
                    parkingId,
                }, Model: this.db.ParkingCapacity
                })

                const capacityRate = await this.capacityRateRepository.getCapacityRate({ 
                    queryParams: {
                        where : {
                            capacityId: capacity.capacityId
                        }
                    }
                })

                //get parameters for computation 
                const previousDetailedTransaction = previousTransaction.detailed_transactions;
                const previousHourDuration = this._.sumBy(previousDetailedTransaction, (dt => dt.duration)) 
                const previousFee = this._.sumBy(previousDetailedTransaction, (dt => dt.fee))
                const totalHourDuration = previousHourDuration + currentHourDuration
                const currentParkingFee = this.getCurrentParkingFee({ totalHourDuration, parkingRate: capacityRate.rate.amount, previousFee })

                //update previosu transaction status
                await DetailedTransaction.update({
                    status: 2
                },{
                    where: {
                        id: previousDetailedTransaction[0].id
                    }
                })

                // create detailed transaction
                await DetailedTransaction.create({
                    status: 2,
                    parkingId,
                    fee: currentParkingFee,
                    duration: currentHourDuration,
                    transactionId: previousTransaction.id,
                })

                const data = await this.transactionRepository.getVehicleTransaction({ queryParams: {
                    where: { plateNumber }
                }});
                
                resolve({ data, statusCode: 200 });
            } catch(e) {
                console.log(e);
                reject(e);
            } 
        });
    }


}