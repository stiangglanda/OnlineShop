import { db } from './db.js';

export default class Article {
	constructor(id, status, name, description, price, seller_id) {
		this.id = id;
		this.status = status;
		this.name = name;
		this.description = description;
		this.price = price;
		this.seller_id = seller_id;
	}

	/**
	 * Lists all enabled articles.
	 * @returns {Promise<Array<Article>>} The articles.
	 */
	static async list() {
		const [rows] = await db.query('SELECT * FROM article WHERE status = 1');
		return rows.map((row) => new Article(row.id, row.status, row.name, row.description, row.price, row.seller_id));
	}

	/**
	 * Finds an article by id.
	 * @returns {Promise<Article>} The article.
	 */
	static async findById(id) {
		const [articles] = await db.query('SELECT * FROM article WHERE id = ?', [id]);
		return new Article(articles[0].id, articles[0].status, articles[0].name, articles[0].description, articles[0].price, articles[0].seller_id);
	}

	/**
	 * Saves an article in the database.
	 * @returns {Promise<Article>} The saved article.
	 */
	async save() {
		await db.query('INSERT INTO article (id, status, name, description, price, seller_id) VALUES (?, ?, ?, ?, ?, ?)', [
			this.id,
			this.status,
			this.name,
			this.description,
			this.price,
			this.seller_id
		]);
		return this;
	}

	/**
	 * Updates an article in the database.
	 * @returns {Promise<Article>} The updated article.
	 */
	async update() {
		await db.query('UPDATE article SET name = ?, status = ?, description = ?, price = ?, seller_id = ? WHERE id = ?', [
			this.name,
			this.status,
			this.description,
			this.price,
			this.seller_id,
			this.id
		]);
		return this;
	}

	/**
	 * Disables an article in the database.
	 * @returns {Promise<void>}
	 */
	async disable() {
		return await db.query('UPDATE article SET status = 0 WHERE id = ?', [this.id]);
	}
}
