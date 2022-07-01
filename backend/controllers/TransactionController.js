import  db  from '../models/';
import { Op, Sequelize } from 'sequelize';
import _ from 'lodash'
import TransactionService from '../services/TransactionService';

const { 
    Vehicle,
    VehicleType,
    Transaction,
    DetailedTransaction,
    Parking,
    ParkingCapacity,
    ParkingSetting,
    Capacity
} = db;

class TransactionController {
    constructor() {
    };
    create = async (req, res) => {
        const { 
            plateNumber,
            vehicleTypeId,
        } = req.body;

        let vehicle = await Vehicle.findOne({
            where: { plateNumber },
            include: [{
                model: VehicleType
            }],

        });

        if(!vehicle){
            vehicle = await Vehicle.create({
                plateNumber,
                vehicleTypeId
            }, {include: [VehicleType]});

            //tobe deleted
            vehicle = await Vehicle.findOne({
                where: { plateNumber },
                include: [VehicleType]
            });
        }

        const allowedParking = await ParkingSetting.findAll({
            where :{
                vehicleTypeId: vehicleTypeId
            }
        })

        let allowedParkingArray = allowedParking.map(element => element.capacityId);


        const {rows : parkingFloors} = await Parking.findAndCountAll({
            group:['floor'],
            attributes: ['floor']
        });

        // get all occupied parkings
        let occupiedParking = await DetailedTransaction.findAll({
            where: {
                status: 1 //ACTIVE
            },
            attributes:['parkingId'],
            // include: [{
            //     model: Transaction,
            //     include: [Vehicle]
            // }, {
            //     model: Parking
            // }]
        });
        let occupiedParkingArray = [];
        occupiedParking.forEach(element => occupiedParkingArray.push(element.parkingId));

        let floorFound = false;
        let availableParking = [];

        let arrayFloors =[];
        parkingFloors.forEach(element => arrayFloors.push(element.floor));
        arrayFloors =  _.remove(arrayFloors, ((element) =>  element !== req.body.floor));
        arrayFloors.unshift(req.body.floor);

        
        for(let floor of arrayFloors){
            availableParking = await ParkingCapacity.findOne({
                where: {
                    parkingId: { [Op.notIn]: [...occupiedParkingArray] },
                    capacityId: { [Op.in]: [...allowedParkingArray] }
                }, 
                include: [
                    { 
                        model: Parking,
                        where : {
                            floor
                        },
                    },
                    { 
                        model: Capacity
                    }
                ] ,
                order: [ 
                    [Parking, 'distance', 'ASC']
                ]
            })
            if(availableParking){
                floorFound = true;
                break;
            }
        }
        // console.log('tes');
        return res.json(availableParking);

        if(!floorFound){
            return res.status(500).json(1);
        }

        // return res.json({availableParking});
        let transaction = await Transaction.findOne({
            where: { plateNumber },
            order: [ ['createdAt' , 'DESC']],
            include: ['detailed_transactions']
        });

        if(!transaction){
            transaction = await Transaction.create({
                vehicleId: vehicle.id,
                plateNumber: vehicle.plateNumber,
                vehicleDescription: vehicle.vehicle_type.description
            })


            await DetailedTransaction.create({
                transactionId: transaction.id,
                parkingId: availableParking.parkingId,
                fee: 30,
                status: 1 //ACTIVE
            });
        }

        



        return res.status(200).json({transaction});
    }
}
// const TransactionController = {
//     create: async (req, res)  => {
//         const { 
//             plateNumber
//         } = req.body;

//         const vehicle = await Vehicle.findOne({
//             where: {
//                 plateNumber
//             }
//         });



//         return res.status(200).json({vehicle});
//     },
//     read: async (req ,res) => {
//         let vehicleType = await VehicleType.findAll({});

//         console.log(vehicleType)
//         return res.status(200).send(vehicleType);
//     },
//     update: async (req, res)  => {
//         return res.status(200).send('Hello World Update');
//     },
//     delete: async (req, res)  => {
//         return res.status(200).send('Hello World Delete');
//     },
// }
export default TransactionController;