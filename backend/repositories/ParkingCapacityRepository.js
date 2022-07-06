import BaseRepository from "./BaseRepository";

export default class ParkingCapacityRepository extends BaseRepository{
    constructor() {
        super();
    };
   
    getAvailableParking = ({ queryParams = {} }) =>{
        return new Promise(async (resolve, reject) => {
            const availableParking = await this.db.ParkingCapacity.findOne({
                where: {
                    capacityId: { [this.Op.in]: [...queryParams.allowedParkings] },
                    parkingId: { [this.Op.notIn]: queryParams.occupiedParkings}
                }, 
                include: [{ 
                    model: this.db.Parking,
                    where : { entryPoint: queryParams.entryPoint }
                },{ 
                    model: this.db.Capacity 
                }],
                order: [ [this.db.Parking, 'distance', 'ASC'] ]
            })
            resolve(availableParking);
        });
    }

}