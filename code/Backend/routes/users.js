import { Router } from 'express';
const router = Router();
import userCtrl from '../controllers/user.controller.js';

router // /api/users
	.route('/')
	.get(userCtrl.getUsers);

router // /api/users/register
	.route('/register')
	.post(userCtrl.register);

router // /api/users/login
	.route('/login')
	.post(userCtrl.login)

router // /api/users/:id/listings
	.route('/:username/listings')
	.get(userCtrl.getUserListings)	

router // /api/users/:id
	.route('/:id')
	.get(userCtrl.getUser)
	.put(userCtrl.updateUser)
	.delete(userCtrl.disableUser);

export default router;
