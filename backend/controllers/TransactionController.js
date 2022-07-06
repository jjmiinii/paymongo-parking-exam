import BaseController from "./BaseController";
import transactionService from "../services/TransactionService";

export default class TransactionController extends BaseController{
    constructor() {
        super();
        this.transactionService = new transactionService();
    };

    /**
     * Handle vehicle parking from entrance
     * Allocate vehicle in to the nearest possible parkin from entrance
     * 
     * @author Danielle Aian Anicete
     * @param  {} req
     * @param  {} res
     * @param  {} next
     * 
     * @returns 200 if the transaction is successful
    */
    
    park = async (req, res) =>{
        let data = {};
        try {
            data = await this.transactionService.enterParking(req);
        } catch(e) {
            data = e;
        }
        
        return res.status(data.statusCode || 500).json({ ...data })   
    }

    unPark = async (req, res) =>{
        let data = {};
        try {
            data = await this.transactionService.exitParking(req);
        } catch(e) {
            data = e;
        }
        
        return res.status(data.statusCode || 500).json({ ...data })   
    }
}