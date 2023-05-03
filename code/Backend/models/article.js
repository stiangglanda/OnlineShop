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
	 * Finds all articles.
	 * @returns {Promise<Array<Article>>}
	 */
	static async find() {
		const [rows] = await db.query('SELECT * FROM articles');
		return rows.map((row) => new Article(row.id, row.name, row.description, row.seller));
	}

	/**
	 * Find an article by id.
	 * @returns {Promise<Article>}
	 */

	/**
	 * Saves an article to the database.
	 * @returns {Promise<Article>}
	 */
	static async findById(id) {
		const [rows] = await db.query('SELECT * FROM articles WHERE id = ?', [id]);
		return new Article(rows[0].id, rows[0].name, rows[0].description, rows[0].seller);
	}

	/**
	 * Updates an article in the database.
	 * @returns {Promise<void>}
	 */
	async update() {
		await db.query('UPDATE articles SET name = ?, description = ?, seller_id = ? WHERE id = ?', [this.name, this.description, this.seller, this.id]);
	}

	/**
	 * Deletes an article from the database.
	 * @returns {Promise<void>}
	 */
	async delete() {
		await db.query('DELETE FROM articles WHERE id = ?', [this.id]);
	}
};
