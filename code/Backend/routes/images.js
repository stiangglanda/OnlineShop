import { Router } from 'express';
import imageCtrl from '../controllers/image.controller.js';
const router = Router();

router // /api/images/:image_id
	.route('/:image_id')
	.get(imageCtrl.getImageById)
	.delete(imageCtrl.deleteImageById);

router // /api/images/article/:article_id
	.route('/article/:article_id')
	.get(imageCtrl.getImagesByArticle)
	.post(imageCtrl.addImageToArticle)
	.put(imageCtrl.updateImageFromArticle)
	.delete(imageCtrl.deleteImageFromArticle);

export default router;
