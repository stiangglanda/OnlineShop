//TODO: convert to ES modules
require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', function (req, res) {
	res.redirect('/api');
});

app.use('/api/articles', require('./routes/articles'));

app.listen(3000, function () {
	console.log('Backend at http://localhost:3000');
});
