import { db } from './db.js';
import User from '../models/user.js';

export default class Transaction {
	constructor(id, seller_id, buyer_id, article_id, created) {
		this.id = id;
		this.seller_id = seller_id; // TODO: convert to User object
		this.buyer_id = buyer_id; // TODO: convert to User object
		this.article_id = article_id; // TODO: convert to User object
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
	 * Finds a Transaction by buyer username.
	 * @returns {Promise<Transaction>}
	 */
	static async findBybuyerUsername(username) {
		let user = await User.findByUsername(username);
		if (!user) return null;

		const [rows] = await db.query('select * from transaction where buyer_id=?', [user.id]);
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
	 * Finds a Transaction by seller username.
	 * @returns {Promise<Transaction>}
	 */
	static async findBysellerUsername(username) {
		let user = await User.findByUsername(username);
		if (!user) return null;

		const [rows] = await db.query('select * from transaction where seller_id=?', [user.id]);
		return rows.map((row) => new Transaction(row.id, row.seller_id, row.buyer_id, row.article_id, row.created));
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
