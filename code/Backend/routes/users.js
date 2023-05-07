const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');

router // /api/users
	.route('/')
	.get(userCtrl.getUsers)
	.post(userCtrl.createUser);

router // /api/users/:id
	.route('/:id')
	.get(userCtrl.getUser)
	.put(userCtrl.updateUser)
	.delete(userCtrl.deleteUser);

module.exports = router;
