import Transaction from '../models/transaction.js';
import { nextId } from '../models/db.js';
import User from '../models/user.js';
import Article from '../models/article.js';

const createTransaction = async (req, res) => {
	let seller = await User.findById(req.body.seller_id);
	let buyer = await User.findById(req.body.buyer_id);
	let article = await Article.findById(req.body.article_id);

	const transaction = new Transaction(null, seller, buyer, article, new Date());
	try {
		res.status(201).json(await transaction.save());
	} catch (error) {
		res.status(400).json({ message: `Could not create the transaction: ${error.message}` });
	}
};

const getBuyerTransaction = async (req, res) => {
	try {
		const transaction = await Transaction.findBybuyerUsername(req.params.username);
		return res.status(200).json(transaction);
	} catch (error) {
		return res.status(404).json({ message: 'Could not find this transaction.' });
	}
};

const getSellerTransaction = async (req, res) => {
	try {
		const transaction = await Transaction.findBysellerUsername(req.params.username);
		return res.status(200).json(transaction);
	} catch (error) {
		return res.status(404).json({ message: 'Could not find this transaction.' });
	}
};

export default {
	createTransaction,
	getBuyerTransaction,
	getSellerTransaction
};
