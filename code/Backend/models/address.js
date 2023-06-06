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
		console.log('Updating address: ' + this.id + ' ' + this.city + ' ' + this.plz + ' ' + this.street + ' ' + this.street_nr);
		let new_city_id;
		let new_street_id;

		// get city / zip combination
		const [city_rows] = await db.query('SELECT * FROM city WHERE name = ? AND plz = ?', [this.city, this.plz]);

		// if the zip / city combination already exists, reuse it
		if (city_rows.length > 0) {
			console.log('Reusing existing city: ' + this.city + ' ' + this.plz);
			new_city_id = city_rows[0].id;
		}
		// if the zip / city combination doesn't exist, create it
		else {
			console.log('Creating new city: ' + this.city + ' ' + this.plz);
			const city_insert = await db.query('INSERT INTO city (name, plz) VALUES (?, ?)', [this.city, this.plz]);
			new_city_id = city_insert[0].insertId;
		}

		// reuse existing street or create new street
		const [street_rows] = await db.query('SELECT * FROM street WHERE name = ?', [this.street]);
		if (street_rows.length > 0) {
			console.log('Reusing existing street: ' + this.street);
			new_street_id = street_rows[0].id;
		} else {
			console.log('Creating new street: ' + this.street);
			const street_insert = await db.query('INSERT INTO street (name) VALUES (?)', [this.street]);
			new_street_id = street_insert[0].insertId;
		}

		// if user has no address yet, create it
		if (!user.address?.id) {
			console.log('Create new address');
			this.id = await nextId('address');
			await db.query('INSERT INTO address (id, city_id, street_id, street_nr) VALUES (?, ?, ?, ?)', [this.id, new_city_id, new_street_id, this.street_nr]);
		} else {
			// if address is shared by multiple users, create a new address
			const [address_rows] = await db.query('SELECT * FROM user WHERE address_id = ?', [this.id]);
			if (address_rows.length > 1) {
				console.log('Address is shared by multiple users, creating new address');
				this.id = await nextId('address');
				await db.query('INSERT INTO address (id, city_id, street_id, street_nr) VALUES (?, ?, ?, ?)', [this.id, new_city_id, new_street_id, this.street_nr]);

				await db.query('UPDATE user SET address_id = ? WHERE id = ?', [this.id, user.id]);
			}
			// if address is only used by one user, check if it can be reused, else update it
			else {
				console.log('Address is only used by one user, checking if it can be reused');
				const [address_rows] = await db.query('SELECT * FROM address WHERE city_id = ? AND street_id = ? AND street_nr = ?', [new_city_id, new_street_id, this.street_nr]);
				if (address_rows.length > 0) {
					console.log('Reusing existing address');
					this.id = address_rows[0].id;

					// check if old address is still used by other users, if not, delete it
					const [old_address_rows] = await db.query('SELECT * FROM user WHERE address_id = ?', [user.address.id]);
					if (old_address_rows.length <= 1) {
						console.log('Address is not used by other users, deleting it');
						await db.query('DELETE FROM address WHERE id = ?', [user.address.id]);
					}
				} else {
					console.log('Updating existing address');
					this.id = user.address.id;
					await db.query('UPDATE address SET city_id = ?, street_id = ?, street_nr = ? WHERE id = ?', [new_city_id, new_street_id, this.street_nr, this.id]);
				}
			}
		}

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
