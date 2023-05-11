import { createPool } from 'mysql2';

// create db connection
const pool = createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT
});

pool.getConnection(function (err, conn) {
	if (err) {
		console.log('Error connecting to database!');
		console.log(err);
		return;
	}
	console.log(`Connected to database ${pool.config.connectionConfig.database} on port ${pool.config.connectionConfig.port}`);
	pool.releaseConnection(conn);
});

// export db
export default pool.promise();
