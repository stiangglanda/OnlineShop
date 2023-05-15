import 'dotenv/config';
import express, { json, urlencoded } from 'express';

import articlesRouter from './routes/articles.js';
import usersRouter from './routes/users.js';
import transactionsRouter from './routes/transactions.js';
import categoriesRouter from './routes/categories.js';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(json());

// redirect to /api/ when accessing /
app.get('/', (req, res) => {
	res.redirect('/api/');
});

app.use('/api/articles', articlesRouter);
app.use('/api/users', usersRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/categories', categoriesRouter);

app.use('/api', function (req, res) {
	// get routes from file directory
	let routes = path.join(__dirname, 'routes');
	routes = fs.readdirSync(routes);

	// remove .js from route names
	routes = routes.map((route) => {
		return route.replace('.js', '');
	});

	let html = '<h1>API Routes</h1>';
	html += '<ul>';
	routes.forEach((route) => {
		html += `<li><a href="/api/${route}">/api/${route}</a></li>`;
	});
	html += '</ul>';

	res.send(html);
});

app.listen(3000, function () {
	console.log('Backend at http://localhost:3000');
});
