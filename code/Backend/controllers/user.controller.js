const User = require('../models/user.js');
const bcrypt = require('bcrypt');

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
		const { username, firstname, lastname, email, password, balance, token } = req.body;
		const id = await User.nextId();		
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User(id, username, firstname, lastname, email, hashedPassword, balance, token);
		await user.save();
		res.status(201).json(user);
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
		const user = await User.findById(req.params.id);
		await user.delete();
		res.status(200).json({ message: `The user ${user.id} has been deleted.` });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	getUsers,
	createUser: register,
	getUser,
	updateUser,
	deleteUser
};
