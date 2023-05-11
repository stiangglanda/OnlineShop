import db from './db.js';

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
		const [rows] = await db.query('SELECT * FROM article WHERE id = ?', [id]);
		return new Article(rows[0].id, rows[0].status, rows[0].name, rows[0].description, rows[0].price, rows[0].seller_id);
	}

	/**
	 * Gets the next id for a new article.
	 * @returns {Promise<number>} The next id.
	 */
	static async nextId() {
		const [rows] = await db.query('SELECT MAX(id) AS max_id FROM article');
		return rows[0].max_id + 1;
	}

	/**
	 * Saves an article in the database.
	 * @returns {Promise<Article>} The saved article.
	 */
	async save() {
		await db.query('INSERT INTO article (id, status, name, description, price, seller_id) VALUES (?, ?, ?, ?, ?, ?)', [this.id, this.status, this.name, this.description, this.price, this.seller_id]);
		return this;
	}

	/**
	 * Updates an article in the database.
	 * @returns {Promise<Article>} The updated article.
	 */
	async update() {
		await db.query('UPDATE article SET name = ?, status = ?, description = ?, price = ?, seller_id = ? WHERE id = ?', [this.name, this.status, this.description, this.price, this.seller_id, this.id]);
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
