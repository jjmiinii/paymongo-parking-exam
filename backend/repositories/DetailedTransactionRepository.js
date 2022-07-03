import BaseRepository from "./BaseRepository";

export default class DetailedTransactionRepository extends BaseRepository{
    constructor() {
        super();
    };
   
    getOccupiedParkings = () =>{
        return new Promise(async (resolve, reject) => {
            let occupiedParkings = await this.db.DetailedTransaction.findAll({ where: { status: 1 }, attributes:['parkingId'] });
            occupiedParkings = this.helper.toArray(occupiedParkings, 'parkingId');

            resolve(transactionInfo);
        });
    }

}