import { nextId } from '../models/db.js';
import User from '../models/user.js';
import Address from '../models/address.js';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

// get all users from the database
const getUsers = async (req, res) => {
	const users = await User.list();
	if (users) return res.status(200).json(users);
	res.status(500).json({ message: 'There is no users.' });
};

// register a new user
const register = async (req, res) => {
	try {
		let { username, firstname, lastname, email, password, city, street, plz, street_nr } = req.body;
		// check if all required fields are provided
		if (!username || !firstname || !lastname || !email || !password) {
			return res.status(400).json({ message: 'Not all required fields were provided.' });
		}

		// check if user already exists
		if (await User.findByEmail(email)) {
			return res.status(400).json({ message: 'This user already exists.' });
		}

		// validate username
		let usernameRegex = /^[a-zA-Z0-9-_.]+$/;
		if (!usernameRegex.test(username)) {
			return res.status(400).json({ message: 'Username can only contain letters, numbers, dashes, underscores and dots.' });
		} else if (username.length > 30) {
			return res.status(400).json({ message: 'Username can not be longer than 30 characters.' });
		}

		// validate password
		if (password.length > 65000) {
			return res.status(400).json({ message: 'Password can not be longer than 65000 characters.' });
		} else if (password.length < 4) {
			return res.status(400).json({ message: 'Password must be at least 4 characters long.' });
		}

		// validate length of fields
		if (firstname.length > 50) {
			return res.status(400).json({ message: 'Firstname can not be longer than 50 characters.' });
		}
		if (lastname.length > 50) {
			return res.status(400).json({ message: 'Lastname can not be longer than 50 characters.' });
		}
		if (email.length > 50) {
			return res.status(400).json({ message: 'Email can not be longer than 50 characters.' });
		}
		if (city && city.length > 50) {
			return res.status(400).json({ message: 'City name can not be longer than 50 characters.' });
		}
		if (street && street.length > 50) {
			return res.status(400).json({ message: 'Street name can not be longer than 50 characters.' });
		}
		if (plz && plz.length > 10) {
			return res.status(400).json({ message: 'PLZ can not be longer than 10 characters.' });
		}
		if (street_nr && street_nr.length > 10) {
			return res.status(400).json({ message: 'Street number can not be longer than 10 characters.' });
		}

		// check if username is taken
		if (await User.findByUsername(username)) {
			return res.status(400).json({ message: 'This username is already taken.' });
		}

		// hash password & create new user
		const hashedPassword = await hash(password, 10);

		const user_id = await nextId('user');
		let user;

		if (!city && !street && !plz && !street_nr) {
			user = new User(user_id, 1, username, firstname, lastname, email, hashedPassword, 0, {});
			await user.save();
		} else {
			let address = new Address(await nextId('address'), city, plz, street, street_nr);
			address = await address.save();

			user = new User(user_id, 1, username, firstname, lastname, email, hashedPassword, 0, address);
			await user.save();
		}

		// respond with user
		res.status(201).json(user);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const login = async (req, res) => {
	try {
		const { emailOrUsername, password } = req.body;
		let user = null;

		// provide all needed fields
		if (!emailOrUsername || !password) {
			return res.status(400).json({ message: 'Not all fields were provided.' });
		}

		// find user, using email or username
		user = (await User.findByEmail(emailOrUsername)) || (await User.findByUsername(emailOrUsername));

		if (!user || user.status === 0) {
			return res.status(404).json({ message: 'This user does not exist.' });
		}

		// check if password is correct
		if (!(await compare(password, user.password))) {
			return res.status(401).json({ message: 'Password is incorrect.' });
		}

		// TODO: save token to session
		const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
		user.token = token;

		res.status(200).json(user);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// get a user from the database
const getUser = async (req, res) => {
	// attempt to find user using id
	let user = await User.findById(req.params.id);
	if (user) return res.status(200).json(user);

	// attempt to find user using username
	user = await User.findByUsername(req.params.id);
	if (user) return res.status(200).json(user);

	// attempt to find user using email
	user = await User.findByEmail(req.params.id);
	if (user) return res.status(200).json(user);

	// no user found, return error
	return res.status(404).json({ message: 'Could not find this user.' });
};

// updates an user in the database
const updateUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { status, username, firstname, lastname, email, password, balance, address } = req.body;

		if (username) {
			// check if username is already taken
			if (await User.findByUsername(username)) {
				return res.status(400).json({ message: 'This username is already taken.' });
			}
			user.username = username;
		}

		if (email) {
			// check if email is already taken
			if (await User.findByEmail(email)) {
				return res.status(400).json({ message: 'This email is already in use.' });
			}
			user.email = email;
		}

		if (password) {
			// check if password is already hashed
			if (password.length !== 60) {
				user.password = await hash(password, 10);
			} else {
				user.password = password;
			}
		}

		if (address) {
			const { plz, city, street, street_nr } = address;

			if (user.address) {
				if (plz) user.address.plz = plz;
				if (city) user.address.city = city;
				if (street) user.address.street = street;
				if (street_nr) user.address.street_nr = street_nr;
			} else {
				const newAddress = new Address(await nextId('address'), city, plz, street, street_nr);
				await newAddress.save();
				user.address = newAddress;
			}

			this.address = await user.address.update();
		}

		if (status) user.status = status;
		if (firstname) user.firstname = firstname;
		if (lastname) user.lastname = lastname;
		if (balance) user.balance = Math.abs(balance);

		const updatedUser = await user.update();
		res.status(200).json(updatedUser);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// disable an user in the database
const disableUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		await user.disable();
		res.status(200).json({ message: `The user ${user.id} has been disabled.` });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export default {
	getUsers,
	register,
	login,
	getUser,
	updateUser,
	disableUser
};
