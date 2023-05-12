import bcrypt from 'bcrypt';
import db from './db.js';

export default class User {
	constructor(id, status, username, firstname, lastname, email, password, balance, address_id, token) {
		this.id = id;
		this.status = status;
		this.username = username;
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.password = password;
		this.balance = balance;
		this.address_id = address_id;
		this.token = token;
	}

	/**
	 * Lists all users.
	 * @returns {Promise<Array<User>>}
	 */
	static async list() {
		const [rows] = await db.query('SELECT * FROM user');
		return rows.map((row) => new User(row.id, row.status, row.username, row.firstname, row.lastname, row.email, row.password, row.balance, row.address_id, row.token));
	}

	/**
	 * Finds an user by id.
	 * @param {number} id
	 * @returns {Promise<User>}
	 */
	static async findById(id) {
		const [rows] = await db.query('SELECT * FROM user WHERE id = ?', [id]);
		return new User(rows[0].id, rows[0].status, rows[0].username, rows[0].firstname, rows[0].lastname, rows[0].email, rows[0].password, rows[0].balance, rows[0].address_id, rows[0].token) || null;
	}

	/**
	 * Finds an user by their username.
	 * @param {string} username
	 * @returns {Promise<User>}
	 */
	static async findByUsername(username) {
		const [rows] = await db.query('SELECT * FROM user WHERE username = ?', [username]);
		return new User(rows[0].id, rows[0].status, rows[0].username, rows[0].firstname, rows[0].lastname, rows[0].email, rows[0].password, rows[0].balance, rows[0].address_id, rows[0].token) || null;
	}

	/**
	 * Finds an user by their email.
	 * @param {string} email
	 * @returns {Promise<User>}
	 */
	static async findByEmail(email) {
		const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
		return new User(rows[0].id, rows[0].status, rows[0].username, rows[0].firstname, rows[0].lastname, rows[0].email, rows[0].password, rows[0].balance, rows[0].address_id, rows[0].token) || null;
	}

	/**
	 * Gets the next id for a new user.
	 * @returns {number}
	 */
	static async nextId() {
		const [rows] = await db.query('SELECT MAX(id) AS max_id FROM user');
		return rows[0].max_id + 1;
	}

	/**
	 * Saves an user in the database.
	 * @returns {Promise<User>}
	 */
	async save() {
		await db.query('INSERT INTO user (id, status, username, firstname, lastname, email, password, balance, address_id, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
			this.id,
			this.status,
			this.username,
			this.firstname,
			this.lastname,
			this.email,
			this.password,
			this.balance,
			this.address_id,
			this.token
		]);
		return this;
	}

	/**
	 * Updates an user in the database.
	 * @returns {Promise<User>} The updated user.
	 */
	async update() {
		await db.query('UPDATE user SET status = ?, username = ?, firstname = ?, lastname = ?, email = ?, password = ?, balance = ?, address_id = ?, token = ? WHERE id = ?', [
			this.status,
			this.username,
			this.firstname,
			this.lastname,
			this.email,
			this.password,
			this.balance,
			this.address_id,
			this.token,
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
