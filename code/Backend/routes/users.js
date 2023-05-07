import { Router } from 'express';
const router = Router();
import userCtrl from '../controllers/user.controller.js';

router // /api/users
	.route('/')
	.get(userCtrl.getUsers);

router // /api/users/login
	.route('/login')
	.post(userCtrl.login);

router // api/users/register
	.route('/register')
	.post(userCtrl.register);

router // /api/users/:id
	.route('/:id')
	.get(userCtrl.getUser)
	.put(userCtrl.updateUser)
	.delete(userCtrl.deleteUser);

// TODO: discuss whether to implement this or not
// router // /api/users/:username
// 	.route('/:username')
// 	.get(userCtrl.getUser)
// 	.put(userCtrl.updateUser)
// 	.delete(userCtrl.deleteUser);

export default router;
