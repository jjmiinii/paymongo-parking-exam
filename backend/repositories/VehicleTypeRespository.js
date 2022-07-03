import BaseRepository from "./BaseRepository";

export default class VehicleTypeRepository extends BaseRepository{
    constructor() {
        super();
    };
   
    getVehicleType = ({ vehicleTypeId = 0 }) =>{
        return new Promise(async (resolve, reject) => {
            const vehicleType = await this.db.VehicleType.findOne({ where: { id: vehicleTypeId }});
            resolve(vehicleType);
        });
    }

}