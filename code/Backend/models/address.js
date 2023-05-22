import { db, nextId } from './db.js';

export default class Address {
	constructor(id, city, plz, street, street_nr) {
		this.id = id;
		this.city = city;
		this.plz = plz;
		this.street = street;
		this.street_nr = street_nr;
	}

	/**
	 * Finds an address by its id.
	 * @param {number} id The address's id.
	 * @returns {Promise<Address>|null} The address or null if not found.
	 */
	static async findById(id) {
		const [rows] = await db.query(
			`SELECT a.id as address_id, c.name as city, c.plz, s.name as street, a.street_nr
			   FROM address a, street s, city c
			  WHERE a.street_id = s.id
			    AND a.city_id = c.id
				AND a.id = ?`,
			[id]
		);

		if (rows.length <= 0) return null;
		return new Address(rows[0].address_id, rows[0].city, rows[0].plz, rows[0].street, rows[0].street_nr);
	}

	/**
	 * Finds an addresse of a user.
	 * @param {number} user_id The user's id.
	 * @returns {Promise<Article>} The user's address.
	 */
	static async findByUser(user_id) {
		const [rows] = await db.query(
			`SELECT a.id as address_id, c.name as city, c.plz, s.name as street, a.street_nr
			   FROM address a, street s, city c, user u
			  WHERE a.street_id = s.id
			    AND a.city_id = c.id
				AND a.id = u.address_id
				AND u.id = ?`,
			[user_id]
		);
		if (rows.length <= 0) return null;
		return new Address(rows[0].address_id, rows[0].city, rows[0].plz, rows[0].street, rows[0].street_nr);
	}

	/**
	 * Saves an address in the database.
	 * @returns {Promise<Address>} The saved address.
	 */
	async save() {
		let city_id;
		let street_id;

		// check if city already exists, if it doesn't, create it
		const [city_rows] = await db.query('SELECT * FROM city WHERE name = ? AND plz = ?', [this.city, this.plz]);
		if (city_rows.length <= 0) {
			const city_insert = await db.query('INSERT INTO city (name, plz) VALUES (?, ?)', [this.city, this.plz]);
			city_id = city_insert[0].insertId;
		} else {
			city_id = city_rows[0].id;
		}

		// check if street already exists, if it doesn't, create it
		const [street_rows] = await db.query('SELECT * FROM street WHERE name = ?', [this.street]);
		if (street_rows.length <= 0) {
			const street_insert = await db.query('INSERT INTO street (name) VALUES (?)', [this.street]);
			street_id = street_insert[0].insertId;
		} else {
			street_id = street_rows[0].id;
		}

		// check if address already exists, if it does, return it
		const [address_rows] = await db.query('SELECT * FROM address WHERE city_id = ? AND street_id = ? AND street_nr = ?', [city_id, street_id, this.street_nr]);
		if (address_rows.length > 0) {
			return new Address(address_rows[0].id, this.city, this.plz, this.street, this.street_nr);
		}
		
		// insert address
		await db.query('INSERT INTO address (id, city_id, street_id, street_nr) VALUES (?, ?, ?, ?)', [this.address_id, city_id, street_id, this.street_nr]);
		return this;
	}

	/**
	 * Updates an address in the database.
	 * @returns {Promise<Address>} The updated address.
	 */
	async update() {
		// check if city already exists, if it does, update it
		const [city_rows] = await db.query('SELECT * FROM city WHERE name = ? AND plz = ?', [this.city, this.plz]);
		if (city_rows.length >= 0) {
			await db.query('UPDATE city SET name = ?, plz = ? WHERE id = ?', [this.city, this.plz, city_rows[0].id]);
		} else {
			await db.query('INSERT INTO city (id, name, plz) VALUES (?, ?, ?)', [this.address_id, this.city, this.plz]);
		}

		// check if street already exists, if it does, update it
		const [street_rows] = await db.query('SELECT * FROM street WHERE name = ?', [this.street]);
		if (street_rows.length > 0) {
			await db.query('UPDATE street SET name = ? WHERE id = ?', [this.street, street_rows[0].id]);
		} else {
			await db.query('INSERT INTO street (id, name) VALUES (?, ?)', [await nextId('street'), this.street]);
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
