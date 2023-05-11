import bcrypt from 'bcrypt';
import db from './db.js';

export default class User {
	constructor(id, username, firstname, lastname, email, password, balance, token) {
		this.id = id;
		this.username = username;
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.password = password;
		this.balance = balance;
		this.token = token;
	}

	/**
	 * Lists all users.
	 * @returns {Promise<Array<User>>}
	 */
	static async list() {
		const [rows] = await db.query('SELECT * FROM user');
		return rows.map((row) => new User(row.id, row.username, row.firstname, row.lastname, row.email, row.password, row.balance, row.token));
	}

	/**
	 * Finds an user by id.
	 * @returns {Promise<User>}
	 */
	static async findById(id) {
		const [rows] = await db.query('SELECT * FROM user WHERE id = ?', [id]);
		return new User(rows[0].id, rows[0].username, rows[0].firstname, rows[0].lastname, rows[0].email, rows[0].password, rows[0].balance, rows[0].token);
	}

	/**
	 * Finds an user by their email.
	 * @returns {Promise<User>}
	 */
	static async findByEmail(email) {
		const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
		return new User(rows[0].id, rows[0].username, rows[0].firstname, rows[0].lastname, rows[0].email, rows[0].password, rows[0].balance, rows[0].token);
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
		await db.query('INSERT INTO user (id, username, firstname, lastname, email, password, balance, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
			this.id,
			this.username,
			this.firstname,
			this.lastname,
			this.email,
			this.password,
			this.balance,
			this.token
		]);
		return this;
	}

	/**
	 * Updates an user in the database.
	 * @returns {User} The updated user.
	 */
	async update() {
		await db.query('UPDATE user SET username = ?, firstname = ?, lastname = ?, email = ?, password = ?, balance = ?, token = ? WHERE id = ?', [
			this.username,
			this.firstname,
			this.lastname,
			this.email,
			this.password,
			this.balance,
			this.token,
			this.id
		]);
		return this;
	}

	/**
	 * Deletes an user from the database.
	 * @returns {Promise<void>}
	 */
	async delete() {
		return await db.query('DELETE FROM user WHERE id = ?', [this.id]);
	}
}
