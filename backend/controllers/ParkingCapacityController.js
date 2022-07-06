import BaseController from "./BaseController";
import ParkingCapacityService from "../services/ParkingCapacityService";

export default class ParkingCapacityController extends BaseController{
    constructor(){
        super();
        this.parkingCapacityService = new ParkingCapacityService();
    }
    
    create = async(req, res) => {
        let data = {};
        try {
            data = await this.parkingCapacityService.create(req);
        } catch(e){
            data = e;
        }
        return res.status(data.statuCode || 500).json(data);
        
    }
}