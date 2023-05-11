import Transaction from '../models/transaction.js';

const createTransaction = async (req, res) => {
	const id = await Transaction.nextId();
	const transaction = new Transaction(id, req.body.seller, req.body.buyer, req.body.article);
	try {
		res.status(201).json(await transaction.save());
	} catch (error) {
		res.status(400).json({ message: `Could not create the transaction: ${error.message}` });
	}
};

const getBuyerTransaction = async (req, res) => {
	try {
		const transaction = await Transaction.findBybuyerId(req.params.id);
		return res.status(200).json(transaction);
	} catch (error) {
		return res.status(404).json({ message: 'Could not find this transaction.' });
	}
};

const getSellerTransaction = async (req, res) => {
	console.log('aaaa');
	try {
		const transaction = await Transaction.findBysellerId(req.params.id);
		return res.status(200).json(transaction);
	} catch (error) {
		return res.status(404).json({ message: 'Could not find this transaction.' });
	}
};

const getTransactions = async (req, res) => {
	try {
		const transactions = await Transaction.list();
		return res.status(200).json(transactions);
	} catch (error) {
		return res.status(404).json({ message: 'Could not find any transaction.' });
	}
};

export default {
	createTransaction,
	getBuyerTransaction,
	getSellerTransaction,
	getTransactions
};
