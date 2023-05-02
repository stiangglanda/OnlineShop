const express = require('express');
const router = express.Router();
const articleCtrl = require('../controllers/article.controller');

router // /api/articles
	.route('/')
	.get(articleCtrl.getArticles)
	.post(articleCtrl.createArticle);

router // /api/articles/:id
	.route('/:id')
	.get(articleCtrl.getArticle)
	.put(articleCtrl.updateArticle)
	.delete(articleCtrl.deleteArticle);

module.exports = router;
