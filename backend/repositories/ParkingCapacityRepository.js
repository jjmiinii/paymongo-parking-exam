import BaseRepository from "./BaseRepository";

export default class ParkingCapacityRepository extends BaseRepository{
    constructor() {
        super();
    };
   
    getAvailableParking = ({ occupiedParkings, allowedParkings, floor }) =>{
        return new Promise(async (resolve, reject) => {
            const availableParking = await this.db.ParkingCapacity.findOne({
                where: {
                    parkingId: { [this.Op.notIn]: [...occupiedParkings] },
                    capacityId: { [this.Op.in]: [...allowedParkings] }
                }, 
                include: [{ 
                    model: this.db.Parking,
                    where : { floor }
                },{ 
                    model: this.db.Capacity 
                }],
                order: [ [this.db.Parking, 'distance', 'ASC'] ]
            })
            resolve(availableParking);
        });
    }

}