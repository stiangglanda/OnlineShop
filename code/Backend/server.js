//TODO: convert to ES modules
require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

const publicDir = path.join(__dirname, 'public');
const viewsDir = path.join(__dirname, 'views');

app.set('views', viewsDir);
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(publicDir));

app.get('/', function (req, res) {
	res.redirect('/api');
});

app.route('/api').get(function (req, res) {
	res.render('index');
});

app.use('/api/articles', require('./routes/articles'));

app.listen(3000, function () {
	console.log('Backend at http://localhost:3000');
});
