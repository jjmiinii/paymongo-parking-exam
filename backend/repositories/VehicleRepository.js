import BaseRepository from "./BaseRepository";

export default class VehicleRepository extends BaseRepository{
    constructor() {
        super();
    };
   
    getVehicleTransaction = ({ plateNumber = ''}) =>{
        return new Promise(async (resolve, reject) => {
            const vehicleType = await VehicleType.findOne({ where: { id: vehicleTypeId }});
            resolve(vehicleType);
        });
    }

}