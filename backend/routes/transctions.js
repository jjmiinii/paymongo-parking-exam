import { Router } from 'express';
import TransactionController from '../controllers/TransactionController';
import TransactionValidation from '../middlewares/validations/TransactionValidation';

const transactionController  = new TransactionController();
const transactionValidation = new TransactionValidation();

const router = Router();

router.post('/enter', transactionValidation.validatePark, transactionController.park);
router.post('/exit', transactionValidation.validateUnPark, transactionController.unPark);


 export default router;

