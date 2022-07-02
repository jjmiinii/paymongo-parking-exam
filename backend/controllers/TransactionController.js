import _ from 'lodash'
import { Op } from 'sequelize';
import moment from 'moment';
import  db  from '../models/';
import helper from '../Utils/helpers';

const { 
    Vehicle,
    VehicleType,
    Transaction,
    DetailedTransaction,
    Parking,
    ParkingCapacity,
    ParkingSetting,
    Capacity,
    sequelize
} = db;

const DATE_TIME_NOW = new Date().toISOString();

class TransactionController {
    constructor() {
        
    };
    floorPriorization = (floors, entryFloor) =>{
        const floorList = helper.toArray(floors, 'floor');
        let  remainingFloors =  _.remove(floorList, (floor =>  floor !== entryFloor));
        remainingFloors.unshift(entryFloor);
        return remainingFloors;
    }
    create = async (req, res) => {
        const { 
            plateNumber,
            vehicleTypeId,
        } = req.body;
        let seqTransaction = await sequelize.transaction();
        try {
            const transactionInfo = await Transaction.findOne({
                where: { plateNumber },
                order: [ ['id' , 'DESC']],
                include: [{
                    model: DetailedTransaction,
                    limit: 1,
                    order: [ ['id' , 'DESC']],
                }],
            });

            //check parking status is still ACTIVE
            if(transactionInfo && transactionInfo.detailed_transactions[0].status === 1){
                throw ({statusCode: 400, message: 'Vehicle is still in park!'})
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
            let allowedParkings = await ParkingSetting.findAll({ where :{ vehicleTypeId }, attributes:['capacityId']}); 
            allowedParkings = helper.toArray(allowedParkings, 'capacityId');
    
    
            // get all occupied parkings
            //1:ACTIVE, 2:COMPLETED
            let occupiedParkings = await DetailedTransaction.findAll({ where: { status: 1 }, attributes:['parkingId'] });

            //convert to array
            occupiedParkings = helper.toArray(occupiedParkings, 'parkingId');
            const parkingFloors = await Parking.findAll({ group:['floor'], attributes: ['floor'] });

            //set entry floor in first
            const floors = this.floorPriorization(parkingFloors, req.body.floor)
    
            let availableParking = [];
            //find parking with the nearest possible from entry point
            for(let floor of floors){
                availableParking = await ParkingCapacity.findOne({
                    where: {
                        parkingId: { [Op.notIn]: [...occupiedParkings] },
                        capacityId: { [Op.in]: [...allowedParkings] }
                    }, 
                    include: [{ 
                        model: Parking,
                        where : { floor }
                    },{ 
                        model: Capacity 
                    }],
                    order: [ [Parking, 'distance', 'ASC'] ]
                })
                //stop if floor found
                if(availableParking) break;
            }
    
            if(!availableParking){
                throw ({statusCode: 404, message: 'No available Parking!'})
            }

            //get the hour of the vehicle when park again
            if(transactionInfo && transactionInfo.detailed_transactions[0].entryExitDateTime){
                const parkingDurationInMinutes = helper.getParkDurationInMinutes({startDate: transactionInfo.detailed_transactions[0].entryExitDateTime, endDate: DATE_TIME_NOW})
                if(parkingDurationInMinutes < 60){
                    await DetailedTransaction.create({
                        transactionId: transactionInfo.id,
                        parkingId: availableParking.parkingId,
                        fee: 0,
                        status: 1
                    },{  transaction: seqTransaction });
                }
            } else {
                let [transaction, transactionCreated] = await Transaction.findOrCreate({
                    where: { plateNumber },
                    defaults: {
                        vehicleId: vehicle.id,
                        plateNumber: vehicle.plateNumber,
                    },
                    order: [ ['createdAt' , 'DESC']],
                    include: [{
                        model: DetailedTransaction,
                        limit: 1,
                        order: [ ['dateTime' , 'DESC']],
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

            await seqTransaction.commit();
            const data = await Transaction.findOne({
                where: { plateNumber },
                order: [ ['createdAt' , 'DESC']],
                include: [{
                    model: DetailedTransaction,
                    include: [Parking]
                },{
                    model: Vehicle
                }]
            });
            
            return res.status(200).json({ data, statusCode: 200});
        } catch (e) {
            console.log(e);
            await seqTransaction.rollback();
            return res.status(e.statusCode || 500).json({ ...e })
        }
    } 
}
export default TransactionController;