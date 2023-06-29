import Article from '../models/article.js';
import User from '../models/user.js';
import { nextId } from '../models/db.js';

const getArticles = async (req, res) => {
	const filters = req.query;
	// If there are no filters, return all articles
	if (Object.keys(filters).length == 0) {
		try {
			const articles = await Article.list();
			res.status(200).json(articles);
		} catch (error) {
			res.status(404).json({ message: 'There are no articles.' });
		}
	} else {
		// Otherwise, apply the filters and return the articles
		try {
			const articles = await Article.listFiltered(filters.category, filters.priceFrom, filters.priceTo);

			res.status(200).json(articles);
		} catch (error) {
			res.status(404).json({ message: 'There are no articles.' });
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

const searchArticle = async (req, res) => {
	try {
		const articles = await Article.findByName(req.params.articleName);
		if (articles.length == 0) {
			return res.status(404).json({ message: 'There are no articles.' });
		}

		res.status(200).json(articles);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const createArticle = async (req, res) => {
	const { name, description, price, seller_id, categories, images } = req.body || null;

	if (name.length > 150) {
		return res.status(400).json({ message: `Article name exeeded the max length(150)` });
	}

	if (description.length > 2000) {
		return res.status(400).json({ message: `Article description exeeded the max length(2000)` });
	}

	const id = await nextId('article');

	let seller = await User.findById(seller_id);
	const article = new Article(id, 1, name, description, Math.abs(price), seller, categories, images);

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
		const { name, description, price } = req.body;

		if (name) article.name = name;
		if (description) article.description = description;
		if (price) article.price = price;

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
	createArticle,
	getArticle,
	getFilteredArticles,
	searchArticle,
	updateArticle,
	disableArticle
};
