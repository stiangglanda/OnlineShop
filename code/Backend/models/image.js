import { db } from './db.js';
import Article from './article.js';

export default class Category {
	constructor(id, url, article) {
		this.id = id;
		this.url = url;
		this.article = article;
	}

	/*
    getImageById,
	deleteImageById,
	getImagesByArticle,
	addImageToArticle,
	updateImageFromArticle,
	deleteImageFromArticle
    */

	/**
	 * Gets an image by the image id.
	 * @returns {Promise<Image>}
	 * @param {number} id
	 */
	static async getImageById(id) {
		const [rows] = await db.query('SELECT * FROM image WHERE id = ?', [id]);
		if (rows.length <= 0) return null; // nothing found

		let article = await Article.findById(rows[0].article_id);
		return new Image(rows[0].id, rows[0].url, article);
	}

	/**
	 * Deletes an image by the image id.
	 * @returns {Promise<Image>}
	 * @param {number} id
	 */
	static async deleteImageById(id) {
		const [rows] = await db.query('DELETE FROM image WHERE id = ?', [id]);
		if (rows.length <= 0) return null; // nothing deleted

		let article = await Article.findById(rows[0].article_id);
		return new Image(rows[0].id, rows[0].url, article);
	}

	/**
	 * Gets all images by the article id.
	 * @returns {Promise<Array<Image>>}
	 * @param {number} id
	 */
	static async getImagesByArticle(id) {
		const [rows] = await db.query('SELECT * FROM image WHERE article_id = ?', [id]);

		let images = [];
		for (let i = 0; i < rows.length; i++) {
			let article = await Article.findById(rows[i].article_id);
			images.push(new Image(rows[i].id, rows[i].url, article));
		}

		return images;
	}

	/**
	 * Adds an image to the article.
	 * @returns {Promise<Image>}
	 * @param {number} article_id
	 * @param {string} url
	 */
	static async addImageToArticle(article_id, url) {
		const [rows] = await db.query('INSERT INTO image (url, article_id) VALUES (?, ?)', [url, article_id]);
		if (rows.length <= 0) return null; // nothing added

		let article = await Article.findById(rows[0].article_id);
		return new Image(rows[0].id, rows[0].url, article);
	}

	/**
	 * Updates an image from the article.
	 * @returns {Promise<Image>}
	 * @param {number} image_id
	 * @param {number} article_id
	 * @param {string} url
	 */
	static async updateImageFromArticle(image_id, url) {
		const [rows] = await db.query('UPDATE image SET url = ? WHERE id = ?', [url, image_id]);
		if (rows.length <= 0) return null; // nothing updated

		let article = await Article.findById(rows[0].article_id);
		return new Image(rows[0].id, rows[0].url, article);
	}

	/**
	 * Deletes an image from the article.
	 * @returns {Promise<Image>}
	 * @param {number} image_id
	 * @param {number} article_id
	 */
	static async deleteImageFromArticle(image_id, article_id) {
		const [rows] = await db.query('DELETE FROM image WHERE id = ? AND article_id = ?', [image_id, article_id]);
		if (rows.length <= 0) return null; // nothing deleted

		let article = await Article.findById(rows[0].article_id);
		return new Image(rows[0].id, rows[0].url, article);
	}
}
