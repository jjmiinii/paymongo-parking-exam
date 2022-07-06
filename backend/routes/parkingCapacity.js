import { Router } from 'express';
import ParkingCapacityController from '../controllers/ParkingCapacityController';

const parkingCapacityController  = new ParkingCapacityController();

const router = Router();

router.post('', parkingCapacityController.create);


 export default router;

