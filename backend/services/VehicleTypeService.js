import BaseService from './BaseService';
import VehicleTypeRepository from '../repositories/VehicleTypeRespository';

export default class VehicleTypeService extends BaseService{
    constructor() {
        super();
        this.vehicleTypeRepository = new VehicleTypeRepository();
    };
  
    create = (req) => {
        return new Promise(async (resolve, reject) => {
            const { description, size }=req.body
            try {
                const isVehicleTypeExist = await this.vehicleTypeRepository.readOne({
                    queryParams: { size },
                    Model: this.db.VehicleType
                })

                if(isVehicleTypeExist) throw({statusCode:400 , message: 'Vehicle type already exist!'});
                
                const vehicleType = await this.vehicleTypeRepository.create({
                    body: {
                        description,
                        size
                    },
                    Model: this.db.VehicleType
                })
                
                resolve({statusCode: 200, vehicleType});
            } catch(e) {
                console.log(e);
                reject(e)
            }
        });
    }


}