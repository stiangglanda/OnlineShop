import { Router } from 'express';
import transactionsCtrl from '../controllers/transactions.controller.js';
const router = Router();

router // /api/trans
	.route('/')
	.post(transactionsCtrl.createTransaction);

router // /api/trans/buyer/:id
	.route('/buyer/:id')
	.get(transactionsCtrl.getbuyerTransaction);

router // /api/trans/seller/:id
	.route('/seller/:id')
	.get(transactionsCtrl.getsellerTransaction);

export default router;
