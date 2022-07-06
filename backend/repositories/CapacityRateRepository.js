import BaseRepository from "./BaseRepository";

export default class CapacityRateRepository extends BaseRepository{
    constructor() {
        super();
    };
   
    getCapacityRate = ({ queryParams }) =>{
        return new Promise(async (resolve, reject) => {
            const capacityRate = await this.db.CapacityRate.findOne({
               where :{
                ...queryParams.where
               },
               include: [this.db.Rate]
            });

            resolve(capacityRate);
        });
    }

}