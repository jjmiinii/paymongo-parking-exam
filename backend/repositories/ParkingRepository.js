import BaseRepository from "./BaseRepository";

export default class ParkingRepository extends BaseRepository{
    constructor() {
        super();
    };
   
    getParkingFloors = ({ plateNumber = ''}) =>{
        return new Promise(async (resolve, reject) => {
            const parkingFloors = await this.db.Parking.findAll({ group:['floor'], attributes: ['floor'] });
            resolve(parkingFloors);
        });
    }

}