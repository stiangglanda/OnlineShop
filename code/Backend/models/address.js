import db from './db.js';

export default class Address {
	constructor(id, city_id, city, plz, street_id, street, street_nr) {
		this.id = id;

		this.city_id = city_id;
		this.city = city;
		this.plz = plz;

		this.street_id = street_id;
		this.street = street;
		this.street_nr = street_nr;
	}

	/**
	 * Finds an addresse of a user.
	 * @returns {Promise<Article>} The user's address.
	 */
	static async findByUser(id) {
		const [rows] = await db.query(
			'SELECT a.id as address_id, c.id as city_id, c.name as city, c.plz, s.id as street_id, s.name as street, a.street_nr FROM address a, street s, city c, user u WHERE a.street_id = s.id AND a.city_id = c.id AND a.id = u.address_id AND u.id = ?',
			[id]
		);
		return new Address(rows[0].address_id, rows[0].city_id, rows[0].city, rows[0].plz, rows[0].street_id, rows[0].street, rows[0].street_nr);
	}

	/**
	 * Gets the next id for a new address.
	 * @returns {number} The next id.
	 */
	static async nextId() {
		const [rows] = await db.query('SELECT MAX(id) AS max_id FROM address');
		return rows[0].max_id + 1;
	}

	/**
	 * Saves an address in the database.
	 * @returns {Promise<Address>} The saved address.
	 */
	async save() {
		// check if city already exists
		const [city_rows] = await db.query('SELECT * FROM city WHERE name = ? AND plz = ?', [this.city, this.plz]);
		if (city_rows.length > 0) {
			this.city_id = city_rows[0].id;
		} else {
			await db.query('INSERT INTO city (id, name, plz) VALUES (?, ?, ?)', [this.city_id, this.city, this.plz]);
		}

		// check if street already exists
		const [street_rows] = await db.query('SELECT * FROM street WHERE name = ?', [this.street]);
		if (street_rows.length > 0) {
			this.street_id = street_rows[0].id;
		} else {
			await db.query('INSERT INTO street (id, name) VALUES (?, ?)', [this.street_id, this.street]);
		}

		// save address
		await db.query('INSERT INTO address (id, city_id, street_id, street_nr) VALUES (?, ?, ?, ?)', [this.id, this.city_id, this.street_id, this.street_nr]);
		return this;
	}

	/**
	 * Updates an address in the database.
	 * @returns {Promise<Address>} The updated address.
	 */
	async update() {
		// check if city already exists, if it does, update it
		const [city_rows] = await db.query('SELECT * FROM city WHERE name = ? AND plz = ?', [this.city, this.plz]);
		if (city_rows.length > 0) {
			await db.query('UPDATE city SET name = ?, plz = ? WHERE id = ?', [this.city, this.plz, this.city_id]);
		} else {
			await db.query('INSERT INTO city (id, name, plz) VALUES (?, ?, ?)', [this.city_id, this.city, this.plz]);
		}

		// check if street already exists, if it does, update it
		const [street_rows] = await db.query('SELECT * FROM street WHERE name = ?', [this.street]);
		if (street_rows.length > 0) {
			await db.query('UPDATE street SET name = ? WHERE id = ?', [this.street, this.street_id]);
		} else {
			await db.query('INSERT INTO street (id, name) VALUES (?, ?)', [this.street_id, this.street]);
		}

		return this;
	}

	/**
	 * Deletes an address from the database.
	 * @returns {Promise<void>}
	 */
	async delete() {
		await db.query('DELETE FROM address WHERE id = ?', [this.id]);
	}
}
