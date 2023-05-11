import User from '../models/user.js';
import { hash } from 'bcrypt';

// get all users from the database
const getUsers = async (req, res) => {
	try {
		const users = await list();
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: 'There is no users.' });
	}
};

// register a new user
const register = async (req, res) => {
	try {
		const { username, firstname, lastname, email, password, balance, token } = req.body;

		// check if all required fields are provided
		if (!username || !firstname || !lastname || !email || !password || !balance || !token) {
			return res.status(400).json({ message: 'Please provide all required fields.' });
		}

		// check if user already exists
		if (await User.findByEmail(email)) {
			return res.status(400).json({ message: 'This user already exists.' });
		}

		// hash password
		const hashedPassword = await hash(password, 10);

		// create new user
		const user = new User(await User.nextId(), username, firstname, lastname, email, hashedPassword, balance, token);
		await user.save();

		// respond with user
		res.status(201).json(user);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// login an user
const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: 'Please provide all required fields.' });
		}

		const user = await User.findByEmail(email);
		if (!user) {
			return res.status(400).json({ message: 'This user does not exist.' });
		}

		// check if password is correct
		if (!(await compare(password, user.password))) {
			return res.status(400).json({ message: 'Password is incorrect.' });
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
		const user = await findById(req.params.id);
		return res.status(200).json(user);
	} catch (error) {
		return res.status(404).json({ message: 'Could not find this user.' });
	}
};

// updates an user in the database
const updateUser = async (req, res) => {
	try {
		const user = await findById(req.params.id);
		const { username, firstname, lastname, email, password, balance, token } = req.body;

		if (username) user.username = username;
		if (firstname) user.firstname = firstname;
		if (lastname) user.lastname = lastname;
		if (email) user.email = email;
		if (password) user.password = password;
		if (balance) user.balance = balance;
		if (token) user.token = token;

		const updatedUser = user.update();
		res.status(200).json(updatedUser);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// deletes an user from the database
const deleteUser = async (req, res) => {
	try {
		const user = await findById(req.params.id);
		await user.delete();
		res.status(200).json({ message: `The user ${user.id} has been deleted.` });
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
	deleteUser
};