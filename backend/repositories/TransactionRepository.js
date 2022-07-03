import BaseRepository from "./BaseRepository";

export default class TransactionRepository extends BaseRepository{
    constructor() {
        super();
    };
   
    getVehicleTransaction = ({ plateNumber = '' }) =>{
        return new Promise(async (resolve, reject) => {
            const transactionInfo = await this.db.Transaction.findOne({
                where: { plateNumber },
                order: [ ['id' , 'DESC']],
                include: [{
                    model: this.db.DetailedTransaction,
                    limit: 1,
                    order: [ ['id' , 'DESC']],
                }],
            });

            resolve(transactionInfo);
        });
    }
    getVehicleLatestCompleteDetailedTransaction = ({ plateNumber = '' }) =>{
        return new Promise(async (resolve, reject) => {
            const transaction = await this.db.Transaction.findOne({
                where: { plateNumber },
                order: [ ['id' , 'DESC']],
                include: [{
                    model: this.db.DetailedTransaction,
                    include: [this.db.Parking]
                },{
                    model: this.db.Vehicle
                }]
            });
        resolve(transaction);
        });
    }



}