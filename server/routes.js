const oracle = require("oracledb");
const config = require("./dbconfig.js");

// Overwite oracle default pool max of 4 to 10;
oracle.poolMax = 10;
let pool;

// Async function to initialize connection pool
async function initPool() {
	try {
		pool = await oracle.createPool(config);
		console.log("Connection pool created.");
		return pool;
	} catch (e) {
		console.log("Pool creation failed.");
	}
}

// Async function to return singleton connection pool
async function getPool() {
	if (pool) return pool;

	pool = await initPool();
	return pool;
}

// Template function
async function test(req, res) {
	// Define query here
	const query = `SELECT * FROM Restaurants WHERE ROWNUM < 2`;

	// Keep connection in wider scope
	let connection;

	try {
		// Get connection pool
		let pool = await getPool();

		// Obtain single connection from pool
		connection = await pool.getConnection();

		// Query the db
		let result = await connection.execute(query);

		// Send response
		console.log("Result: ", result);
		res.json(result);

	} catch (e) {
		console.log(e);

	} finally {
		if (connection) {
			try {
				// Close connection and return it to the pool
				await connection.close();
			} catch(e) {
				console.log("Failed to close connection");
			}
		}
	}
}

// Cleanup function
async function cleanup() {
	console.log("NOT IMPLEMENTED YET");
}


// Export functions to be used elsewhere serverside
module.exports = {
	test: test
}
