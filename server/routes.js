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
	const query = `SELECT DISTINCT ingredient from ingredients WHERE rownum <= 1000`;

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
	const query = `SELECT distinct dishes.cuisine FROM dishes`;

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

	const selectedIngredients = req.params.ingredients;
	console.log(selectedIngredients);

	// Define query here
	const query = `
		SELECT DISTINCT d.cuisine, COUNT(d.dishid) as freq
		FROM Dishes d
		WHERE EXISTS(
			SELECT * 
			FROM MadeOf m2 JOIN Ingredients i ON m2.ingredientId = i.id
			WHERE i.ingredient like '${selectedIngredients}' AND  d.dishId = m2.dishId
		)
		GROUP BY d.cuisine
		ORDER BY freq DESC
	`;
	console.log(query);

	// console.log(req.body);
	// console.log(JSON.parse(req.body));
	// const selectedIngredients = req.params.data;
	// let subquery = ``;
	// for(i = 0; i < selectedIngredients.length; i++){
	// 	if(i > 0){
	// 		subquery += 'AND';
	// 	}
	// 	subquery += `
	// 		WHERE EXISTS(
	// 			SELECT * 
	// 			FROM MadeOf m2 JOIN Ingredients i ON m2.ingredientId = i.id
	// 			WHERE i.ingredient like '%${inputIngredients}%' AND  d.dishId = m2.dishId
	// 		)
	// 	`;
		
	// }

	// // Define query here
	// const query = `
	// 	SELECT DISTINCT d.cuisine, COUNT(d.dishid) as freq
	// 	FROM Dishes d
	// 	'%${subquery}%'
	// 	GROUP BY d.cuisine
	// 	ORDER BY freq DESC;
	// `;

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
	const day = req.params.day;
	const query = `
		WITH Temp AS(
			SELECT r.businessId, r.name, r.address, r.state
			FROM Restaurants r 
			JOIN Serve s ON r.businessId = s.businessId
			JOIN CuisineType f ON f.cuisineId = s.cuisineId
			WHERE f.cuisine = '${cuisineType}'
		),
		Hours AS(
			SELECT *
			FROM OpenHours
			WHERE day = '${day}'
		)
		SELECT *
		FROM Temp r JOIN Hours h ON r.businessId = h.businessId
		ORDER BY r.name
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

/* ---- (top 5 related cuisine to a given cuisine) ---- */
async function getRelatedCuisines(req, res) {
	const cuisineId = req.params.cuisineId;

	// Add some validation later

	const query = `
		WITH reference AS (
			SELECT DISTINCT ingredientId
			FROM CuisineType ct
			JOIN Dishes d ON ct.cuisine = d.cuisine
			JOIN MadeOf mo ON mo.dishId = d.dishId
			WHERE ct.cuisineId = ${cuisineId}
		), refMembership AS (
			SELECT DISTINCT ct.cuisine AS cuisine, ingredientId
			FROM CuisineType ct
			JOIN Dishes d ON ct.cuisine = d.cuisine
			JOIN MadeOf mo ON mo.dishId = d.dishId
			WHERE ingredientId IN (
				SELECT * FROM reference
			)
			AND ct.cuisineId != ${cuisineId}
		), memberCounts AS (
			SELECT cuisine, COUNT(*) AS count
			FROM refMembership
			GROUP BY cuisine
			ORDER BY count DESC
		) SELECT *
		FROM memberCounts
		WHERE ROWNUM <= 5
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

/* ---- (restaurants within user-specified distance of user GPS) ---- */
async function getNearbyRestaurants(req, res) {
	const data = req.body.data;
	const userLng = data.lng;
	const userLat = data.lat;
	const radius = data.radius;
	const selectedIds = data.selection;

	let query;

	if (selectedIds.length) {
		query = `
			WITH filtered AS (
				SELECT businessId as id
				FROM Serve
				WHERE cuisineId IN(${selectedIds.join(",")})
			), dist AS (
				SELECT businessId AS id, name, address, latitude,
				longitude, stars, reviewcount,
				(3959 * ACOS(COS(${userLat} * 0.01745329251) * COS(latitude * 0.01745329251) * COS((longitude - ${userLng}) * 0.01745329251) + SIN(${userLat} * 0.01745329251) * SIN(latitude * 0.01745329251))) AS distance
				FROM Restaurants
				WHERE businessId IN (
					SELECT *
					FROM filtered
				)
			) SELECT id, name, address, latitude, longitude, stars, reviewcount, distance
			FROM dist
			WHERE distance <= ${radius}
			ORDER BY distance
		`;
	} else {
		query = `
			WITH dist AS (
				SELECT businessId AS id, name, address, latitude,
				longitude, stars, reviewcount,
				(3959 * ACOS(COS(${userLat} * 0.01745329251) * COS(latitude * 0.01745329251) * COS((longitude - ${userLng}) * 0.01745329251) + SIN(${userLat} * 0.01745329251) * SIN(latitude * 0.01745329251))) AS distance
				FROM Restaurants
			) SELECT id, name, address, latitude, longitude, stars, reviewcount, distance
			FROM dist
			WHERE distance <= ${radius}
			ORDER BY distance
		`;
	}

	// console.log("QUERY: " + query);

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

/* ---- (cuisines strictly not using selected ingredients) ---- */
async function getCuisinesMinusIngredients(req, res) {
	const data = req.body.data;
	const ingredientIds = data.selection;

	const query = `
		WITH cimap AS (
			SELECT DISTINCT ct.cuisine, ingredientId
			FROM CuisineType ct
			JOIN Dishes d ON ct.cuisine = d.cuisine
			JOIN MadeOf mo ON mo.dishId = d.dishId
		) SELECT DISTINCT cuisine
		FROM cimap c
		WHERE NOT EXISTS (
			SELECT *
			FROM cimap
			WHERE cuisine = c.cuisine
			AND ingredientId IN (${ingredientIds.join(",")})
		)
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

// Cleanup function
async function cleanup() {
	if (pool) await pool.close();
	return;
}


// Export functions to be used elsewhere serverside
module.exports = {
	test: test,
	cleanup: cleanup,
    getAllIngredients: getAllIngredients,
    getAllCuisines: getAllCuisines,
	getMatchedCuisine: getMatchedCuisine,
	getAllCuisineTypes: getAllCuisineTypes,
	getRestaurantsWithCuisine: getRestaurantsWithCuisine,
	getRelatedCuisines: getRelatedCuisines,
	getNearbyRestaurants: getNearbyRestaurants,
	getCuisinesMinusIngredients: getCuisinesMinusIngredients,
}
