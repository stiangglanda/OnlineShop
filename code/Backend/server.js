import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';

import articlesRouter from './routes/articles.js';
import usersRouter from './routes/users.js';
import transactionsRouter from './routes/transactions.js';
import categoriesRouter from './routes/categories.js';
import imagesRouter from './routes/images.js';

const app = express();

app.use(json());
app.use(cors());

// redirect to /api/ when accessing /
app.get('/', (req, res) => {
	res.redirect('/api/');
});

app.use('/api/articles', articlesRouter);
app.use('/api/users', usersRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/images', imagesRouter);

app.listen(3000, function () {
	console.log('Backend at http://localhost:3000');
});
