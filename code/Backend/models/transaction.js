import db from './db.js';

export default class Transaction {
	constructor(id, seller_id, buyer_id, article_id) {
		this.id = id;
		this.seller_id = seller_id;
		this.buyer_id = buyer_id;
		this.article_id = article_id;
	}

	/**
	 * Finds a Transaction by buyer id.
	 * @returns {Promise<Transaction>}
	 */
	static async findBybuyerId(id) {
		const [rows] = await db.query('select * from transactions where buyer_id=?', [id]);
		return rows.map((row) => new Transaction(row.id, row.seller_id, row.buyer_id, row.article_id));
	}

	/**
	 * Finds a Transaction by seller id.
	 * @returns {Promise<Transaction>}
	 */
	static async findBysellerId(id) {
		const [rows] = await db.query('select * from transactions where seller_id=?', [id]);
		return rows.map((row) => new Transaction(row.id, row.seller_id, row.buyer_id, row.article_id));
	}

	/**
	 * Gets the next id for a new Transaction.
	 * @returns {number}
	 */
	static async nextId() {
		const [rows] = await db.query('SELECT MAX(id) AS max_id FROM transactions');
		return rows[0].max_id + 1;
	}

	/**
	 * Saves a Transaction in the database.
	 * @returns {Promise<Article>}
	 */
	async save() {
		await db.query('insert into transactions(id, seller_id, buyer_id, article_id) values(?, ?, ?, ?)', [this.id, this.seller_id, this.buyer_id, this.article_id]);
		return this;
	}
}
