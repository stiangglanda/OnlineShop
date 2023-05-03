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
	 * Saves an article to the database.
	 * @returns {Promise<Article>}
	 */
	async save() {
		const [rows] = await db.query('INSERT INTO articles (name, description, price, seller_id) VALUES (?, ?, ?, ?)', [this.name, this.description, this.price, this.seller]);
		this.id = rows[0].id;
		return this;
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
