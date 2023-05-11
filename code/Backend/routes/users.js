import { Router } from 'express';
const router = Router();
import userCtrl from '../controllers/user.controller.js';

router // /api/users
	.route('/')
	.get(userCtrl.getUsers);

router // /api/users/auth
	.route('/auth')
	.get(userCtrl.login)
	.post(userCtrl.register);

router // /api/users/:id
	.route('/:id')
	.get(userCtrl.getUser)
	.put(userCtrl.updateUser)
	.delete(userCtrl.disableUser);

export default router;
