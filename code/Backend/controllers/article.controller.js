import Article from '../models/article.js';
import { nextId } from '../models/db.js';

const getArticles = async (req, res) => {
	const filters = req.query;
	if (Object.keys(filters).length == 0) {
		try {
			const articles = await Article.list();
			res.status(200).json(articles);
		} catch (error) {
			res.status(404).json({ message: 'There is no articles.' });
		}
	} else {
		try {
			const articles = await Article.listFiltered(filters.category, filters.priceFrom, filters.priceTo);
			res.status(200).json(articles);
		} catch (error) {
			res.status(404).json({ message: 'There is no articles.' });
		}
	}
};

const getFilteredArticles = async (req, res) => {
	try {
		const articles = await Article.listFiltered(req.params.category, req.params.priceFrom, req.params.priceTo);
		res.status(200).json(articles);
	} catch (error) {
		res.status(404).json({ message: 'There are no articles.' });
	}
};

const createArticle = async (req, res) => {
	const id = await nextId('article');
	const { name, description, price, seller_id, categories, images } = req.body || null;

	const article = new Article(id, 1, name, description, Math.abs(price), seller_id, categories, images);
	//TODO validation
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
		const { status, name, description, price, seller_id } = req.body || null;

		if (status) article.status = status;
		if (name) article.name = name;
		if (description) article.description = description;
		if (price) article.price = price;
		if (seller_id) article.seller_id = seller_id;

		const updatedArticle = await article.update();
		res.status(200).json(updatedArticle);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// deletes an article from the database
const disableArticle = async (req, res) => {
	try {
		const article = await Article.findById(req.params.id);
		await article.disable();
		res.status(200).json({ message: `The article ${article.id} has been disabled.` });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export default {
	getArticles,
	getFilteredArticles,
	createArticle,
	getArticle,
	updateArticle,
	disableArticle
};
