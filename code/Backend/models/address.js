import { db, nextId } from './db.js';
import User from './user.js';

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
		let address_id = await nextId('address');
		await db.query('INSERT INTO address (id, city_id, street_id, street_nr) VALUES (?, ?, ?, ?)', [address_id, city_id, street_id, this.street_nr]);
		return this;
	}

	/**
	 * Updates an address in the database.
	 * @param {User} user The user whose address should be updated.
	 * @returns {Promise<Address>} The updated address.
	 */
	async update(user) {
		let new_city_id;
		let new_street_id;

		// get city / zip combination
		// if the zip / city combination already exists, reuse it
		// if the zip / city combination doesn't exist, create it and use the new id
		const [city_rows] = await db.query('SELECT * FROM city WHERE name = ? AND plz = ?', [this.city, this.plz]);
		if (city_rows.length > 0) {
			new_city_id = city_rows[0].id;
		} else {
			const city_insert = await db.query('INSERT INTO city (name, plz) VALUES (?, ?)', [this.city, this.plz]);
			new_city_id = city_insert[0].insertId;
		}

		// get street
		// if the street already exists, reuse it
		// if the street doesn't exist, create it and use the new id
		const [street_rows] = await db.query('SELECT * FROM street WHERE name = ?', [this.street]);
		if (street_rows.length > 0) {
			new_street_id = street_rows[0].id;
		} else {
			const street_insert = await db.query('INSERT INTO street (name) VALUES (?)', [this.street]);
			new_street_id = street_insert[0].insertId;
		}

		// find address to update
		// if the users current address id is null, create a new address

		// else update the existing address with the new values
		if (user.address == null || {}) {
			let new_address_id = await nextId('address');

			await db.query('INSERT INTO address (id, city_id, street_id, street_nr) VALUES (?, ?, ?, ?)', [new_address_id, new_city_id, new_street_id, this.street_nr]);
			await db.query('UPDATE user SET address_id = ? WHERE id = ?', [new_address_id, user.id]);
			this.id = new_address_id;
		} else {
			let cur_address_id = user.address.id; // 7

			await db.query('UPDATE address a, user u SET a.city_id = ?, a.street_id = ?, a.street_nr = ? WHERE a.id = u.address_id AND u.id = ?', [
				new_city_id,
				new_street_id,
				this.street_nr,
				user.id
			]);

			this.id = cur_address_id;
		}

		// // if user has no address yet
		// if (!user.address?.id) {
		// 	this.id = await nextId('address');

		// 	await db.query('INSERT INTO address (id, city_id, street_id, street_nr) VALUES (?, ?, ?, ?)', [this.id, new_city_id, new_street_id, this.street_nr]);
		// 	await db.query('UPDATE user SET address_id = ? WHERE id = ?', [this.id, user.id]);
		// } else {
		// 	// if address is shared by multiple users, create a new address
		// 	const [address_rows] = await db.query('SELECT * FROM user WHERE address_id = ?', [this.id]);
		// 	if (address_rows.length > 1) {
		// 		this.id = await nextId('address');
		// 		await db.query('INSERT INTO address (id, city_id, street_id, street_nr) VALUES (?, ?, ?, ?)', [this.id, new_city_id, new_street_id, this.street_nr]);

		// 		await db.query('UPDATE user SET address_id = ? WHERE id = ?', [this.id, user.id]);
		// 	}
		// 	// if address is only used by one user, check if it can be reused, else update it
		// 	else {
		// 		const [address_rows] = await db.query('SELECT * FROM address WHERE city_id = ? AND street_id = ? AND street_nr = ?', [new_city_id, new_street_id, this.street_nr]);
		// 		if (address_rows.length > 0) {
		// 			this.id = address_rows[0].id;
		// 		} else {
		// 			this.id = user.address.id;
		// 			await db.query('UPDATE address SET city_id = ?, street_id = ?, street_nr = ? WHERE id = ?', [new_city_id, new_street_id, this.street_nr, this.id]);
		// 			await db.query('UPDATE user SET address_id = ? WHERE id = ?', [this.id, user.id]);
		// 		}
		// 	}
		// }

		// delete unused cities
		await db.query('DELETE FROM city WHERE id NOT IN (SELECT DISTINCT city_id FROM address)');

		// delete unused streets
		await db.query('DELETE FROM street WHERE id NOT IN (SELECT DISTINCT street_id FROM address)');

		//delete unused addresses
		await db.query('DELETE FROM address WHERE id NOT IN (SELECT DISTINCT address_id FROM user)');

		// get and return updated address
		return await Address.findById(this.id);
	}

	/**
	 * Deletes an address from the database.
	 * @returns {Promise<void>}
	 */
	async delete() {
		await db.query('DELETE FROM address WHERE id = ?', [this.id]);
	}
}
