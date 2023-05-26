import { db, nextId } from './db.js';
import Address from './address.js';
import bcrypt from 'bcrypt';
import Article from './article.js';

export default class User {
	constructor(id, status, username, firstname, lastname, email, password, balance, address) {
		this.id = id;
		this.status = status;
		this.username = username;
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.password = password;
		this.balance = balance;
		this.address = address;
		this.token = null;
	}

	/**
	 * Lists all users.
	 * @returns {Promise<Array<User>>} A list of users.
	 */
	static async list() {
		const [rows] = await db.query('SELECT * FROM user');
		if (rows.length <= 0) return null;

		const users = [];
		for (const row of rows) {
			const address = await Address.findById(row.address_id);
			users.push(new User(row.id, row.status, row.username, row.firstname, row.lastname, row.email, row.password, row.balance, address));
		}
		return users;
	}

	/**
	 * Finds an Listings by userid.
	 * @param {number} id
	 * @returns {Promise<Array<Article>>}
	 */
	static async getListingsbyUserId(id) {
		const [articles] = await db.query('select * from article where seller_id=? and status=1', [id]);
		let [images] = await db.query('SELECT id, url, article_id FROM image');
		images = images.map((image) => {
			return {
				id: image.id,
				url: image.url,
				article_id: image.article_id
			};
		});

		let [categories] = await db.query('SELECT * FROM category');
		categories = categories.map((category) => {
			return {
				id: category.id,
				name: category.name
			};
		});

		let [article_categories] = await db.query('SELECT * FROM article_category');
		article_categories = article_categories.map((article_category) => {
			return {
				article_id: article_category.article_id,
				category_id: article_category.category_id
			};
		});

		return articles.map((article) => {
			const art_img = images.filter((image) => image.article_id === article.id);
			const art_categories = article_categories.filter((article_category) => article_category.article_id === article.id).map((article_category) => article_category.category_id);
			const cat = categories.filter((category) => art_categories.includes(category.id));
			return new Article(article.id, article.status, article.name, article.description, article.price, article.seller_id, cat, art_img);
		});
	}

	/**
	 * Finds an user by id.
	 * @param {number} id
	 * @returns {Promise<User>|null} The user or null if not found.
	 */
	static async findById(id) {
		const [rows] = await db.query('SELECT * FROM user WHERE id = ?', [id]);
		if (rows.length <= 0) return null;

		const address = await Address.findByUser(rows[0].id);
		return new User(rows[0].id, rows[0].status, rows[0].username, rows[0].firstname, rows[0].lastname, rows[0].email, rows[0].password, rows[0].balance, address);
	}

	/**
	 * Finds an user by their username.
	 * @param {string} username
	 * @returns {Promise<User>|null} The user or null if not found.
	 */
	static async findByUsername(username) {
		const [rows] = await db.query('SELECT * FROM user WHERE username = ?', [username]);
		if (rows.length <= 0) return null;
		const address = await Address.findByUser(rows[0].id);
		return new User(rows[0].id, rows[0].status, rows[0].username, rows[0].firstname, rows[0].lastname, rows[0].email, rows[0].password, rows[0].balance, address);
	}

	/**
	 * Finds an user by their email.
	 * @param {string} email
	 * @returns {Promise<User>|null} The user or null if not found.
	 */
	static async findByEmail(email) {
		const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
		if (rows.length <= 0) return null;
		const address = await Address.findById(rows[0].address_id);
		return new User(rows[0].id, rows[0].status, rows[0].username, rows[0].firstname, rows[0].lastname, rows[0].email, rows[0].password, rows[0].balance, address);
	}

	/**
	 * Saves an user in the database.
	 * @returns {Promise<User>} The saved user.
	 */
	async save() {
		let address_id = null;
		if (Object.keys(this.address).length !== 0) {
			address_id = await Address.findById(this.address.id).id;

			if (!address_id) {
				let new_address = await this.address.save();
				address_id = new_address.id;
			}
		}

		await db.query('INSERT INTO user (id, status, username, firstname, lastname, email, password, balance, address_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
			this.id,
			this.status,
			this.username,
			this.firstname,
			this.lastname,
			this.email,
			this.password,
			this.balance,
			address_id
		]);
		return this;
	}

	/**
	 * Updates an user in the database.
	 * @returns {Promise<User>} The updated user.
	 */
	async update() {
		let address_id = null;
		let address = await Address.findByUser(this.id);
		if (address) address_id = address.id;

		await db.query('UPDATE user SET status = ?, username = ?, firstname = ?, lastname = ?, email = ?, password = ?, balance = ?, address_id = ? WHERE id = ?', [
			this.status,
			this.username,
			this.firstname,
			this.lastname,
			this.email,
			this.password,
			this.balance,
			address_id,
			this.id
		]);
		return this;
	}

	/**
	 * Disables an user in the database.
	 * @returns {Promise<void>}
	 */
	async disable() {
		return await db.query('UPDATE user SET status = 0 WHERE id = ?', [this.id]);
	}
}
