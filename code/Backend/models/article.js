const db = require('./db');

module.exports = class Article {
	constructor(id, name, description, price, seller) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.price = price;
		this.seller = seller;
	}

	/**
	 * Lists all articles.
	 * @returns {Promise<Array<Article>>}
	 */
	static async list() {
		const [rows] = await db.query('SELECT * FROM articles');
		return rows.map((row) => new Article(row.id, row.name, row.description, row.price, row.seller));
	}

	/**
	 * Finds an article by id.
	 * @returns {Promise<Article>}
	 */
	static async findById(id) {
		const [rows] = await db.query('SELECT * FROM articles WHERE id = ?', [id]);
		return new Article(rows[0].id, rows[0].name, rows[0].description, rows[0].price, rows[0].seller);
	}

	/**
	 * Gets the next id for a new article.
	 * @returns {number}
	 */
	static async nextId() {
		const [rows] = await db.query('SELECT MAX(id) AS max_id FROM articles');
		return rows[0].max_id + 1;
	}

	/**
	 * Saves an article in the database.
	 * @returns {Promise<Article>}
	 */
	async save() {
		const [result] = await db.query('INSERT INTO articles (name, description, price, seller_id) VALUES (?, ?, ?, ?)', [this.name, this.description, this.price, this.seller]);
		this.id = result.insertId;
		return this;
	}

	/**
	 * Updates an article in the database.
	 * @returns {Promise<void>}
	 */
	async update() {
		await db.query('UPDATE articles SET name = ?, description = ?, price = ?, seller_id = ? WHERE id = ?', [this.name, this.description, this.price, this.seller, this.id]);
	}

	/**
	 * Deletes an article from the database.
	 * @returns {Promise<void>}
	 */
	async delete() {
		await db.query('DELETE FROM articles WHERE id = ?', [this.id]);
	}
};
