import 'dotenv/config'
import express, { json, urlencoded } from 'express';

import articlesRouter from './routes/articles.js';
import usersRouter from './routes/users.js';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.get('/', function (req, res) {
	res.redirect('/api');
});

app.use('/api/articles', articlesRouter);
app.use('/api/users', usersRouter);


app.listen(3000, function () {
	console.log('Backend at http://localhost:3000');
});
