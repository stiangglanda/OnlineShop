import { Router } from 'express';
import transactionsCtrl from '../controllers/transactions.controller.js';
const router = Router();

router // /api/transactions
	.route('/')
	.post(transactionsCtrl.createTransaction);

router // /api/transactions
	.route('/buyer/:id')
	.get(transactionsCtrl.getbuyerTransaction);

router // /api/transactions
	.route('/seller/:id')
	.get(transactionsCtrl.getsellerTransaction);

export default router;
