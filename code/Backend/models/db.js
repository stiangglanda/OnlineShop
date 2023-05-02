const mysql = require('mysql2');

// create db connection
const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT
});

pool.getConnection(function (err, conn) {
	if (err) {
		console.log('Error connecting to database!');
		return;
	}
	console.log(`Connected to database ${pool.config.connectionConfig.database} on port ${pool.config.connectionConfig.port}`);
	pool.releaseConnection(conn);
});

// export db
module.exports = pool.promise();
