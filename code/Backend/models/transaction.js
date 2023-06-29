import { db } from './db.js';
import User from '../models/user.js';
import Article from './article.js';

export default class Transaction {
	constructor(id, seller, buyer, article, created) {
		this.id = id;
		this.seller = seller;
		this.buyer = buyer;
		this.article = article;
		this.created = created;
	}

	/**
	 * Finds a Transaction by buyer id.
	 * @returns {Promise<Transaction>}
	 */
	static async list() {
		const [rows] = await db.query('select * from transaction');

		let result = rows.map(async (transaction) => {

			let seller = await User.findById(transaction.seller_id);
			let buyer = await User.findById(transaction.buyer_id);
			let article = await Article.findById(transaction.article_id);

			return new Transaction(transaction.id, seller, buyer, article, transaction.created);
		});
		
		return Promise.all(result);
	}

	/**
	 * Finds a Transaction by buyer id.
	 * @returns {Promise<Transaction>}
	 */
	static async findBybuyerId(id) {
		const [rows] = await db.query('select * from transaction where buyer_id=?', [id]);
		let result = rows.map(async (transaction) => {

			let seller = await User.findById(transaction.seller_id);
			let buyer = await User.findById(transaction.buyer_id);
			let article = await Article.findById(transaction.article_id);

			return new Transaction(transaction.id, seller, buyer, article, transaction.created);
		});
		
		return Promise.all(result);
	}

	/**
	 * Finds a Transaction by buyer username.
	 * @returns {Promise<Transaction>}
	 */
	static async findBybuyerUsername(username) {
		let user = await User.findByUsername(username);
		if (!user) return null;

		const [rows] = await db.query('select * from transaction where buyer_id=?', [user.id]);


		let result = rows.map(async (transaction) => {

			let seller = await User.findById(transaction.seller_id);
			let buyer = await User.findById(transaction.buyer_id);
			let article = await Article.findById(transaction.article_id);

			return new Transaction(transaction.id, seller, buyer, article, transaction.created);
		});
		
		return Promise.all(result);
	}

	/**
	 * Finds a Transaction by seller id.
	 * @returns {Promise<Transaction>}
	 */
	static async findBysellerId(id) {
		const [rows] = await db.query('select * from transaction where seller_id=?', [id]);

		let result = rows.map(async (transaction) => {

			let seller = await User.findById(transaction.seller_id);
			let buyer = await User.findById(transaction.buyer_id);
			let article = await Article.findById(transaction.article_id);

			return new Transaction(transaction.id, seller, buyer, article, transaction.created);
		});
		
		return Promise.all(result);
	}

	/**
	 * Finds a Transaction by seller username.
	 * @returns {Promise<Transaction>}
	 */
	static async findBysellerUsername(username) {
		let user = await User.findByUsername(username);
		if (!user) return null;

		const [rows] = await db.query('select * from transaction where seller_id=?', [user.id]);
		let result = rows.map(async (transaction) => {

			let seller = await User.findById(transaction.seller_id);
			let buyer = await User.findById(transaction.buyer_id);
			let article = await Article.findById(transaction.article_id);

			return new Transaction(transaction.id, seller, buyer, article, transaction.created);
		});
		
		return Promise.all(result);
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
