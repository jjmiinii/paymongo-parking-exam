import BaseRepository from "./BaseRepository";

export default class VehicleTypeCapacityRepository extends BaseRepository{
    constructor() {
        super();
    };
   
    getAllowedVehicleCapacity = ({ queryParams = {} }) =>{
        return new Promise(async (resolve, reject) => {
            let allowedParkings = await this.db.VechicleTypeCapacity.findAll({
                where :{ vehicleTypeId: queryParams.vehicleTypeId },
                attributes:['capacityId']
            });
            allowedParkings = this.helper.toArray(allowedParkings, 'capacityId');            
            resolve(allowedParkings);
        });
    }

}