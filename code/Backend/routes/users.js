import { Router } from 'express';
const router = Router();
import userCtrl from '../controllers/user.controller.js';

router // /api/users
	.route('/')
	.get(userCtrl.getUsers)
	.post(userCtrl.createUser);

router // /api/users/:id
	.route('/:id')
	.get(userCtrl.getUser)
	.put(userCtrl.updateUser)
	.delete(userCtrl.deleteUser);

export default router;
