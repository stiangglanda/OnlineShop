import Transaction from '../models/transaction.js';
import { nextId } from '../models/db.js';

const createTransaction = async (req, res) => {
	const id = await nextId('transaction');
	console.log(req.body.seller_id);
	const transaction = new Transaction(id, req.body.seller_id, req.body.buyer_id, req.body.article_id, new Date());
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
