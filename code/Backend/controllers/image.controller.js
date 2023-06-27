import Image from '../models/image.js';

const getImageById = async (req, res) => {
	try {
		const image = await Image.findById(req.params.image_id);
		res.json(image);
	} catch (error) {
		res.status(500).json({ message: 'There are no images.' });
	}
};

const deleteImageById = async (req, res) => {
	try {
		const image = await Image.deleteById(req.params.image_id);
		res.json(image);
	} catch (error) {
		res.status(500).json({ message: 'There are no images.' });
	}
};

const getImagesByArticle = async (req, res) => {
	try {
		const images = await Image.findByArticleId(req.params.article_id);
		res.json(images);
	} catch (error) {
		res.status(500).json({ message: 'There are no images.' });
	}
};

const addImageToArticle = async (req, res) => {
	try {
		const image = await Image.addImageToArticle(req.params.article_id);
		res.json(image);
	} catch (error) {
		res.status(500).json({ message: 'There are no images.' });
	}
};

const updateImageFromArticle = async (req, res) => {
	try {
		const image = await Image.updateImageFromArticle(req.params.article_id);
		res.json(image);
	} catch (error) {
		res.status(500).json({ message: 'There are no images.' });
	}
};

const deleteImageFromArticle = async (req, res) => {
	try {
		const image = await Image.deleteImageFromArticle(req.params.article_id);
		res.json(image);
	} catch (error) {
		res.status(500).json({ message: 'There are no images.' });
	}
};

export default {
	getImageById,
	deleteImageById,
	getImagesByArticle,
	addImageToArticle,
	updateImageFromArticle,
	deleteImageFromArticle
};
