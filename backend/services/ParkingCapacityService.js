import BaseService from './BaseService';
import ParkingRepository from '../repositories/ParkingRepository';
import CapacityRepository from '../repositories/CapacityRepository';
import ParkingCapacityRepository from '../repositories/ParkingCapacityRepository';

export default class ParkingCapacityService extends BaseService{
    constructor() {
        super();
        this.parkingRepository = new ParkingRepository();
        this.capacityRepository = new CapacityRepository();
        this.parkingCapacityRepository = new ParkingCapacityRepository();
    };
  
    create = (req) => {
        return new Promise(async (resolve, reject) => {
            const { 
                size,
                floor,
                distance,
                description
            }=req.body
            try {
                let parking = await this.parkingRepository.readOne({
                    queryParams: { floor, distance },
                    Model: this.db.Parking
                })

                if(!parking){
                    parking = await this.parkingRepository.create({
                        body: {
                            floor,
                            distance
                        },
                        Model: this.db.Parking
                    })
                }

                let capacity = await this.capacityRepository.readOne({
                    queryParams: { description, size },
                    Model: this.db.Capacity
                })
                
                if(!capacity){
                    capacity = await this.capacityRepository.create({
                        body: {
                            description,
                            size
                        },
                        Model: this.db.Capacity
                    })
                }

                const isParkingCapacityExist = await this.parkingCapacityRepository.readOne({
                    queryParams: {
                        parkingId: parking.id,
                        capacityId: capacity.id
                    },
                    Model: this.db.ParkingCapacity
                })

                if(isParkingCapacityExist){
                    throw({statusCode: 400, message:'Parking capacity already exist!'});
                }
                

                const parkingCapacity = await this.parkingCapacityRepository.create({
                    body:{
                        parkingId: parking.id,
                        capacityId: capacity.id
                    }, 
                    Model: this.db.ParkingCapacity
                });
                


                
                resolve({statusCode: 200, parkingCapacity});
            } catch(e) {
                console.log(e);
                reject(e)
            }
        });
    }


}