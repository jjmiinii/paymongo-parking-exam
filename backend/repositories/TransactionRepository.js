import BaseRepository from "./BaseRepository";

export default class TransactionRepository extends BaseRepository{
    constructor() {
        super();
    };
   
    getVehicleTransaction = ({ queryParams = {} }) =>{
        return new Promise(async (resolve, reject) => {
            let orders = [['id', 'DESC']];

            if(!queryParams.hasOwnProperty('limit')){
                orders.push([this.db.DetailedTransaction,'id', 'DESC']);
            }

            const transactionInfo = await this.db.Transaction.findOne({
                where: { 
                    ...queryParams.where
                 },
                order: [
                   ...orders
                ],
                include: [{
                    model: this.db.DetailedTransaction,
                    order: [['id', 'DESC']],
                    [queryParams.hasOwnProperty('limit') ? 'limit' : '']:queryParams.hasOwnProperty('limit') ? queryParams.limit : '',
                    include: [this.db.Parking]
                },{
                    model: this.db.Vehicle
                }],
            });
            
            resolve(transactionInfo);
        });
    }
}