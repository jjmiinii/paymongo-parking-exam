import BaseService from './BaseService';
import ParkingRepository from '../repositories/ParkingRepository';

export default class ParkingService extends BaseService{
    constructor() {
        super();
        this.parkingRepository = new ParkingRepository();
    };
  
    create = (req) => {
        return new Promise(async (resolve, reject) => {
            const { floor, distance }=req.body
            try {
                const isParkingExist = await this.parkingRepository.readOne({
                    queryParams: { floor, distance },
                    Model: this.db.Parking
                })

                if(isParkingExist) throw({statusCode:400 , message: 'Parking already exist!'});
                
                const parking = await this.parkingRepository.create({
                    body: {
                        floor,
                        distance
                    },
                    Model: this.db.Parking
                })
                
                resolve({statusCode: 200, parking});
            } catch(e) {
                console.log(e);
                reject(e)
            }
        });
    }


}