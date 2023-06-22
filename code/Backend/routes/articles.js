import { Router } from 'express';
import articleCtrl from '../controllers/article.controller.js';
const router = Router();

router // /api/articles
	.route('/')
	.get(articleCtrl.getArticles)
	.post(articleCtrl.createArticle);

router // /api/articles
	.route('/search/:articleName')
	.get(articleCtrl.findByName())

router // /api/articles/:id
	.route('/:id')
	.get(articleCtrl.getArticle)
	.put(articleCtrl.updateArticle)
	.delete(articleCtrl.disableArticle);

router // /api/articles/:id
	.route('/:category/:priceFrom&:priceTo')
	.get(articleCtrl.getFilteredArticles)

export default router;
