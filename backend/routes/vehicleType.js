import { Router } from 'express';
import VehicleTypeController from '../controllers/VehicleTypeController';

const vehicleTypeController  = new VehicleTypeController();

const router = Router();

router.post('', vehicleTypeController.create);


 export default router;

