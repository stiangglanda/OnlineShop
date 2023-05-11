import db from './db.js';

export default class Transaction {
	constructor(id, seller_id, buyer_id, article_id, created) {
		this.id = id;
		this.seller_id = seller_id;
		this.buyer_id = buyer_id;
		this.article_id = article_id;
		this.created = created;
	}

	/**
	 * Finds a Transaction by buyer id.
	 * @returns {Promise<Transaction>}
	 */
	static async list() {
		const [rows] = await db.query('select * from transaction');
		return rows.map((row) => new Transaction(row.id, row.seller_id, row.buyer_id, row.article_id, row.created));
	}

	/**
	 * Finds a Transaction by buyer id.
	 * @returns {Promise<Transaction>}
	 */
	static async findBybuyerId(id) {
		const [rows] = await db.query('select * from transaction where buyer_id=?', [id]);
		return rows.map((row) => new Transaction(row.id, row.seller_id, row.buyer_id, row.article_id, row.created));
	}

	/**
	 * Finds a Transaction by seller id.
	 * @returns {Promise<Transaction>}
	 */
	static async findBysellerId(id) {
		const [rows] = await db.query('select * from transaction where seller_id=?', [id]);
		return rows.map((row) => new Transaction(row.id, row.seller_id, row.buyer_id, row.article_id, row.created));
	}

	/**
	 * Gets the next id for a new Transaction.
	 * @returns {number}
	 */
	static async nextId() {
		const [rows] = await db.query('SELECT MAX(id) AS max_id FROM transaction');
		return rows[0].max_id + 1;
	}

	/**
	 * Saves a Transaction in the database.
	 * @returns {Promise<Transaction>}
	 */
	async save() {
		await db.query('insert into transaction(id, seller_id, buyer_id, article_id, created) values(?, ?, ?, ?, ?)', [this.id, this.seller_id, this.buyer_id, this.article_id, this.created]);
		return this;
	}
}