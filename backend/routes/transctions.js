import { Router } from 'express';
import bodyParser from 'body-parser';
import TransactionController from '../controllers/TransactionController';

const transactionController  = new TransactionController();

const router = Router();

// // parse application/json
// app.use(bodyParser.json())

 //transaction routes
//  router.get('/', TransactionController.read);
 router.post('/', transactionController.create);
 //router.put('/:id', TransactionController.update);
 //router.delete('/:id', TransactionController.delete);

 export default router;

