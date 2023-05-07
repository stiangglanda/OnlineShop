import Article from '../models/article.js';

const getArticles = async (req, res) => {
	try {
		const articles = await Article.list();
		res.json(articles);
	} catch (error) {
		res.status(500).json({ message: 'There is no articles.' });
	}
};

const createArticle = async (req, res) => {
	const id = await Article.nextId();
	const article = new Article(id, req.body.name, req.body.description, req.body.price, req.body.seller);
	try {
		res.status(201).json(await article.save());
	} catch (error) {
		res.status(400).json({ message: `Could not create the article: ${error.message}` });
	}
};

const getArticle = async (req, res) => {
	try {
		const article = await Article.findById(req.params.id);
		return res.status(200).json(article);
	} catch (error) {
		return res.status(404).json({ message: 'Could not find this article.' });
	}
};

// updates an article in the database
const updateArticle = async (req, res) => {
	try {
		const article = await Article.findById(req.params.id);
		const { name, description, price, seller } = req.body;

		if (name) article.name = name;
		if (description) article.description = description;
		if (price) article.price = price;
		if (seller) article.seller = seller;

		const updatedArticle = article.update();
		res.status(200).json(updatedArticle);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// deletes an article from the database
const deleteArticle = async (req, res) => {
	try {
		const article = await Article.findById(req.params.id);
		await article.delete();
		res.status(200).json({ message: `The article ${article.id} has been deleted.` });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export default {
	getArticles,
	createArticle,
	getArticle,
	updateArticle,
	deleteArticle
};
