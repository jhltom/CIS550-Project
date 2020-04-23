const oracle = require("oracledb");
const config = require("./dbconfig.js");

// Overwite oracle default pool max of 4 to 10;
oracle.poolMax = 10;
let pool;

// Async function to initialize connection pool
async function initPool() {
	console.log(oracle)
	console.log(config)
	try {
		pool = await oracle.createPool(config);
		console.log("Connection pool created.");
		return pool;
	} catch (e) {
		console.log("Pool creation failed.",  e);
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


/* ---- (ingredients) ---- */
async function getAllIngredients(req, res) {
	// Define query here
	const query = `SELECT DISTINCT ingredient from ingredients;`;

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

/* ---- (cuisine) ---- */
async function getAllCuisines(req, res) {
	// Define query here
	const query = `SELECT distinct dishes.cuisine FROM dishes;`;

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

/* ---- (matched cuisine) ---- */
async function getMatchedCuisine(req, res) {
	// Define query here
	const query = `
		SELECT DISTINCT d.cuisine, COUNT(d.dishid) as freq
		FROM Dishes d
		WHERE EXISTS(
			SELECT * 
			FROM MadeOf m2 JOIN Ingredients i ON m2.ingredientId = i.id
			WHERE i.ingredient like '%${inputIngredients}%' AND  d.dishId = m2.dishId
		)
		GROUP BY d.cuisine
		ORDER BY freq DESC;
	`;

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

/* ---- (cuisine types) ---- */
async function getAllCuisineTypes(req, res) {

	const query = `SELECT cuisine FROM CuisineType`;
	let connection;

	try {
		let pool = await getPool();
		connection = await pool.getConnection();
		let result = await connection.execute(query);
		// console.log("Result: ", result);
		res.json(result);
	} catch (e) {
		console.log(e);
	} finally {
		if (connection) {
			try {
				await connection.close();
			} catch(e) {
				console.log("Failed to close connection");
			}
		}
	}
}

/* ---- (restaurants with given cuisine) ---- */
async function getRestaurantsWithCuisine(req, res) {

	const cuisineType = req.params.cuisineType;
	const query = `
		SELECT r.businessId, r.name, r.address
		FROM Restaurants r 
		JOIN Serve s ON r.businessId = s.businessId
		JOIN CuisineType f ON f.cuisineId = s.cuisineId
		WHERE f.cuisine = '${cuisineType}'
	`;
	let connection;

	try {
		let pool = await getPool();
		connection = await pool.getConnection();
		let result = await connection.execute(query);
		console.log("Result: ", result);
		res.json(result);
	} catch (e) {
		console.log(e);
	} finally {
		if (connection) {
			try {
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
	test: test,
    getAllIngredients: getAllIngredients,
    getAllCuisines: getAllCuisines,
	getMatchedCuisine: getMatchedCuisine,
	getAllCuisineTypes: getAllCuisineTypes,
	getRestaurantsWithCuisine: getRestaurantsWithCuisine,
}
