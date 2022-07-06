import BaseController from "./BaseController";
import VehicleTypeService from "../services/VehicleTypeService";

export default class VehicleTypeController extends BaseController{
    constructor(){
        super();
        this.vehicleTypeService = new VehicleTypeService();
    }
    
    create = async(req, res) => {
        let data = {};
        try {
            data = await this.vehicleTypeService.create(req);
        } catch(e){
            data = e;
        }
        return res.status(data.statuCode || 500).json(data);
        
    }
}