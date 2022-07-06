import { Router } from 'express';
import ParkingController from '../controllers/ParkingController';

const parkingController  = new ParkingController();

const router = Router();

router.post('', parkingController.create);


 export default router;

