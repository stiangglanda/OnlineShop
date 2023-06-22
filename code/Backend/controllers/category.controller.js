import Categorie from '../models/category.js';

const getCategories = async (req, res) => {
	try {
		const categories = await Categorie.list();
		res.json(categories);
	} catch (error) {
		res.status(500).json({ message: 'There are no categories.' });
	}
};

const getCategorie = async (req, res) => {
	try {
		const categorie = await Categorie.findById(req.params.id);
		return res.status(200).json(categorie);
	} catch (error) {
		return res.status(404).json({ message: 'Could not find this category.' });
	}
};

export default {
	getCategories,
	getCategorie
};
