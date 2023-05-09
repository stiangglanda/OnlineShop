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

const getbuyerTransaction = async (req, res) => {
    console.log("aaa")
    const transaction = await Transaction.findBybuyerId(req.params.id);
    return res.status(200).json(transaction);
	// try {
	// } catch (error) {
	// 	return res.status(404).json({ message: 'Could not find this transaction.' });
	// }
};

const getsellerTransaction = async (req, res) => {
	try {
		const transaction = await Transaction.findBysellerId(req.params.id);
		return res.status(200).json(transaction);
	} catch (error) {
		return res.status(404).json({ message: 'Could not find this transaction.' });
	}
};

export default {
	createTransaction,
    getbuyerTransaction,
	getsellerTransaction
};
