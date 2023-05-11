import { Router } from 'express';
import transactionsCtrl from '../controllers/transaction.controller.js';
const router = Router();

router // /api/transaction
	.route('/')
	.post(transactionsCtrl.createTransaction);

router // /api/transaction/buyer/:id
	.route('/buyer/:id')
	.get(transactionsCtrl.getBuyerTransaction);

router // /api/transaction/seller/:id
	.route('/seller/:id')
	.get(transactionsCtrl.getSellerTransaction);

export default router;
