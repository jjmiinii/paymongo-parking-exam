import db from '../models/'
import BaseService from './BaseService';
import ParkingRepository from '../repositories/ParkingRepository';
import TransactionRepository from '../repositories/TransactionRepository';
import VehicleTypeRepository from '../repositories/VehicleTypeRespository';
import ParkingCapacityRepository from '../repositories/ParkingCapacityRepository';
import VehicleTypeCapacityRepository from '../repositories/VehicleTypeCapacityRepository';
import DetailedTransactionRepository from '../repositories/DetailedTransactionRepository';

const { 
    Vehicle,
    Transaction,
    DetailedTransaction,
    Parking,
    sequelize
} = db;

export default class TransactionService extends BaseService{
    constructor() {
        super();
        this.ParkingRepository = new ParkingRepository();
        this.TransactionRepository = new TransactionRepository();
        this.VehicleTypeRepository = new VehicleTypeRepository();
        this.ParkingCapacityRepository = new ParkingCapacityRepository();
        this.VehicleTypeCapacityRepository = new VehicleTypeCapacityRepository();
        this.DetailedTransactionRepository = new DetailedTransactionRepository();
    };
    
    entryPointPriorization = (floors = [], entryFloor = '') =>{
        const floorList = this.helper.toArray(floors, 'floor');
        let  remainingFloors =  this._.remove(floorList, (floor =>  floor !== entryFloor));
        remainingFloors.unshift(entryFloor);
        return remainingFloors;
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
                const transactionInfo = await this.TransactionRepository.getVehicleTransaction({ plateNumber });

                //check parking status if still ACTIVE
                if(transactionInfo && transactionInfo.detailed_transactions[0].status === 1){
                    throw ({statusCode: 400, message: 'Vehicle is still in park!'});
                }
                
                const vehicleType = await this.VehicleTypeRepository.getVehicleType({ vehicleTypeId });

                if(!vehicleType){
                    throw({ statusCode: 400, message: 'Type of vechicle cannot be found'});
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
                const allowedParkings = await this.VehicleTypeCapacityRepository.getAllowedVehicleCapacity({ vehicleTypeId });

                if(this._.isEmpty(allowedParkings)){
                    throw({ statusCode: 400, message: 'Vehicle type is not allowed!'});
                }

                // get all occupied parkings
                //1:ACTIVE, 2:COMPLETED
                const occupiedParkings = await this.DetailedTransactionRepository.getOccupiedParkings();

                //get parking floors
                const parkingFloors = await this.ParkingRepository.getParkingFloors();

                //set entry floor in first
                const floors = this.entryPointPriorization(parkingFloors, req.body.floor)

                let availableParking = [];
                //find parking with the nearest possible from entry point
                for(let floor of floors){
                    availableParking = await this.ParkingCapacityRepository({ occupiedParkings, allowedParkings, floor})
                    //stop if floor found
                    if(availableParking) break;
                }

                if(!availableParking){
                    throw ({statusCode: 404, message: 'No available Parking!'})
                }

                //check if has previous transaction
                if(transactionInfo && transactionInfo.detailed_transactions[0].entryExitDateTime){
                    const now = new Date().toISOString();
                    //get the minutes of the vehicle when park again
                    const parkingDurationInMinutes = this.helper.getParkDurationInMinutes({startDate: transactionInfo.detailed_transactions[0].entryExitDateTime, endDate: now})
                    //if vehicle park again before 1 hour, create slave transaction
                    if(parkingDurationInMinutes < 60){
                        await DetailedTransaction.create({
                            transactionId: transactionInfo.id,
                            parkingId: availableParking.parkingId,
                            fee: 0,
                            status: 1
                        },{  transaction: seqTransaction });
                    }
                    //create master with slave transaction
                } else {
                    let [transaction, transactionCreated] = await Transaction.findOrCreate({
                        where: { plateNumber },
                        defaults: {
                            vehicleId: vehicle.id,
                            plateNumber: vehicle.plateNumber,
                        },
                        order: [ ['id' , 'DESC']],
                        include: [{
                            model: DetailedTransaction,
                            limit: 1,
                            order: [ ['id' , 'DESC']],
                            include: [Parking],
                        }, {
                            model: Vehicle
                        }],
                        transaction: seqTransaction
                    });

                    if(transactionCreated){
                        await DetailedTransaction.create({
                            transactionId: transaction.id,
                            parkingId: availableParking.parkingId,
                            fee: 0,
                            status: 1
                        },{  transaction: seqTransaction });
                    }
                }

                //commit transaction
                await seqTransaction.commit();
                
                //display latest data
                const data = await this.TransactionRepository.getVehicleLatestCompleteDetailedTransaction({ plateNumber });
                
                resolve({ data, statusCode: 200});
            } catch(error) {
                console.log(error);
                //roll back
                await seqTransaction.rollback();
                reject(error);
            }
        })
    }
}