import BaseRepository from "./BaseRepository";

export default class VehicleTypeCapacityRepository extends BaseRepository{
    constructor() {
        super();
    };
   
    getAllowedVehicleCapacity = ({ vehicleTypeId = 0 }) =>{
        return new Promise(async (resolve, reject) => {
            let allowedParkings = await this.db.VechicleTypeCapacity.findAll({ where :{ vehicleTypeId }, attributes:['capacityId']});
            allowedParkings = this.helper.toArray(allowedParkings, 'capacityId');

            resolve(allowedParkings);
        });
    }

}