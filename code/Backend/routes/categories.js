import { Router } from 'express';
import categoriesCtrl from '../controllers/category.controller.js';
const router = Router();

router // /api/categories
	.route('/')
	.get(categoriesCtrl.getCategories)

router // /api/categories/:id
	.route('/:id')
	.get(categoriesCtrl.getCategorie)

export default router;
