import { Router } from 'express';
import TodoController from '../controllers/TodoController';

const router = Router();

 //todo routes
 router.get('/', TodoController.read);
 router.post('/', TodoController.create);
 router.put('/:id', TodoController.update);
 router.delete('/:id', TodoController.delete);

 export default router;

