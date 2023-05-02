const Article = require('../models/article.js');

const getArticles = async (req, res) => {
	try {
		const articles = await Article.find();
		res.json(articles);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const createArticle = async (req, res) => {
	const article = new Article({
		name: req.body.name,
		description: req.body.description,
		seller: req.body.seller
	});

	try {
		// TODO: validate data
		const newArticle = article.save();
		res.status(201).json(newArticle);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const getArticle = async (req, res) => {
	res.json(res.article);
};

const updateArticle = async (req, res) => {
	if (req.body.name != null) {
		res.article.name = req.body.name;
	}
	if (req.body.description != null) {
		res.article.description = req.body.description;
	}
	if (req.body.seller != null) {
		res.article.seller = req.body.seller;
	}
	try {
		const updatedArticle = await res.article.save();
		res.json(updatedArticle);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const deleteArticle = async (req, res) => {
	try {
		await res.article.remove();
		res.json({ message: 'Deleted the article' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getArticles,
	createArticle,
	getArticle,
	updateArticle,
	deleteArticle
};
