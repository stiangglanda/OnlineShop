import { Router } from 'express';
import articleCtrl from '../controllers/article.controller.js';
const router = Router();

router // /api/articles
	.route('/')
	.get(articleCtrl.getArticles)
	.post(articleCtrl.createArticle);

router // /api/articles/:id
	.route('/:id')
	.get(articleCtrl.getArticle)
	.put(articleCtrl.updateArticle)
	.delete(articleCtrl.deleteArticle);

export default router;
