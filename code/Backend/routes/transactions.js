import { Router } from 'express';
import transactionsCtrl from '../controllers/transactions.controller.js';
import articleCtr from '../controllers/article.controller.js';
const router = Router();

router // /api/transactions
	.route('/')
    .get(articleCtr.getArticles)
	.post(transactionsCtrl.createTransaction);

router // /api/transactions
	.route('/buyer/:id')
	.get(transactionsCtrl.getbuyerTransaction);

router // /api/transactions
	.route('/seller/:id')
	.get(transactionsCtrl.getsellerTransaction);

export default router;
