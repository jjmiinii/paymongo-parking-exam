import BaseRepository from "./BaseRepository";

export default class VehicleTypeRepository extends BaseRepository{
    constructor() {
        super();
    };
   
    getVehicleType = ({ queryParams = {} }) =>{
        return new Promise(async (resolve, reject) => {
            const vehicleType = await this.db.VehicleType.findOne({ where: { id: queryParams.vehicleTypeId }});
            resolve(vehicleType);
        });
    }

}