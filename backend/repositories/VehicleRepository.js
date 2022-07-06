import BaseRepository from "./BaseRepository";

export default class VehicleRepository extends BaseRepository{
    constructor() {
        super();
    };
   
    // getVehicleTransaction = ({ queryParams = {}}) =>{
    //     return new Promise(async (resolve, reject) => {
    //         const vehicleType = await VehicleType.findOne({ where: { id: queryParams.vehicleTypeId }});
    //         resolve(vehicleType);
    //     });
    // }

}