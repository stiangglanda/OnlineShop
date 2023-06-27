import { db } from './db.js';

export default class Category {
	constructor(id, name) {
		this.id = id;
		this.name = name;
	}

	/**
	 * Lists all Categories.
	 * @returns {Promise<Array<Category>>}
	 */
	static async list() {
		const [rows] = await db.query('SELECT * FROM category');
		return rows.map((row) => new Category(row.id, row.name));
	}

	/**
	 * Finds an Categorie by id.
	 * @returns {Promise<Category>}
	 */
	static async findById(id) {
		const [rows] = await db.query('SELECT * FROM category WHERE id = ?', [id]);
		return new Category(rows[0].id, rows[0].name);
	}

	/**
	 * Finds an Categorie by name.
	 * @returns {Promise<Category>}
	 */
	static async findByName(name) {
		const [rows] = await db.query('SELECT * FROM category WHERE name = ?', [name]);
		return new Category(rows[0].id, rows[0].name);
	}
}
