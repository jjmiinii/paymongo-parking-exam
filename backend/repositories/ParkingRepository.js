import BaseRepository from "./BaseRepository";

export default class ParkingRepository extends BaseRepository{
    constructor() {
        super();
    };
   
    getParkingEntryPoint = () =>{
        return new Promise(async (resolve, reject) => {
            const entryPoints = await this.db.Parking.findAll({ group:['entryPoint'], attributes: ['entryPoint'] });
            resolve(entryPoints);
        });
    }

}