import BaseController from "./BaseController";
import ParkingService from "../services/ParkingService.";

export default class ParkingController extends BaseController{
    constructor(){
        super();
        this.parkingService = new ParkingService();
    }
    
    create = async(req, res) => {
        let data = {};
        try {
            data = await this.parkingService.create(req);
        } catch(e){
            data = e;
        }
        return res.status(data.statuCode || 500).json(data);
        
    }
}