import { Router } from 'express';
import transactionsCtrl from '../controllers/transaction.controller.js';
const router = Router();

router // /api/transaction
	.route('/')
	.post(transactionsCtrl.createTransaction);

router // /api/transaction/buyer/:username
	.route('/buyer/:username')
	.get(transactionsCtrl.getBuyerTransaction);

router // /api/transaction/seller/:username
	.route('/seller/:username')
	.get(transactionsCtrl.getSellerTransaction);

export default router;
