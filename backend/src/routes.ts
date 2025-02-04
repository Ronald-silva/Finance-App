import { Router } from 'express';
import { TransactionController } from './controllers/TransactionController';

const router = Router();
const transactionController = new TransactionController();

router.get('/transactions', transactionController.index);
router.post('/transactions', transactionController.create);
router.delete('/transactions/:id', transactionController.delete);
router.put('/transactions/:id', transactionController.update);

export { router }; 