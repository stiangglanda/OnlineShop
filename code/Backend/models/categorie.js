import db from './db.js';

export default class Categorie {
	constructor(id, name) {
		this.id = id;
		this.name = name;
	}

	/**
	 * Lists all Categories.
	 * @returns {Promise<Array<Categorie>>}
	 */
	static async list() {
		const [rows] = await db.query('SELECT * FROM categories');
		return rows.map((row) => new Categorie(row.id, row.name));
	}

	/**
	 * Finds an Categorie by id.
	 * @returns {Promise<Categorie>}
	 */
	static async findById(id) {
		const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
		return new Categorie(rows[0].id, rows[0].name);
	}
}