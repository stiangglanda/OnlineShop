import User from '../models/user.js';
import { hash, compare } from 'bcrypt';

// get all users from the database
const getUsers = async (req, res) => {
	try {
		const users = await User.list();
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: 'There is no users.' });
	}
};

// register a new user
const register = async (req, res) => {
	try {
		let { username, firstname, lastname, email, password, balance, address_id, token } = req.body || null;

		// check if all required fields are provided
		if (!username || !firstname || !lastname || !email || !password || !balance) {
			return res.status(400).json({ message: 'Not all fields were provided.' });
		}

		// check if user already exists
		if (await User.findByEmail(email)) {
			return res.status(400).json({ message: 'This user already exists.' });
		}

		// hash password
		const hashedPassword = await hash(password, 10);

		// create new user
		const user = new User(await User.nextId(), 1, username, firstname, lastname, email, hashedPassword, balance, address_id, token);
		await user.save();

		// respond with user
		res.status(201).json(user);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: 'Please provide all required fields.' });
		}

		const user = await User.findByEmail(email);
		if (!user || user.status === 0) {
			return res.status(404).json({ message: 'This user does not exist.' });
		}

		// check if password is correct
		if (!(await compare(password, user.password))) {
			return res.status(401).json({ message: 'Password is incorrect.' });
		}

		// respond with user
		res.status(200).json(user);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// get a user from the database
const getUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		return res.status(200).json(user);
	} catch (error) {
		return res.status(404).json({ message: 'Could not find this user.' });
	}
};

// updates an user in the database
const updateUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { status, username, firstname, lastname, email, password, balance, address_id, token } = req.body; // address

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
			// hash password
			const hashedPassword = await hash(password, 10);
			user.password = hashedPassword;
		}

		if (status) user.status = status;
		if (firstname) user.firstname = firstname;
		if (lastname) user.lastname = lastname;
		if (balance) user.balance = balance * -1;
		if (address_id) user.address_id = address_id;
		if (token) user.token = token;

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
