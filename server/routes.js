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
function getAllIngredients(req, res){
  var query = `
    SELECT DISTINCT ingredient from ingredients;
  `;
  connection.query(query, function(err, rows, fields){
      if(err) console.log(err);
      else{
          res.json(rows);
      }
  });
};

/* ---- (cuisine) ---- */
function getAllCuisines(req, res){
  var query =`
    SELECT distinct dishes.cuisine FROM dishes;
  `;
  connection.query(query, function(err, rows, fields){
    if(err) console.log(err);
    else{
        res.json(rows);
    }
  });
};

/* ---- (matched cuisine) ---- */
function getMatchedCuisine(req, res){
    var inputIngredients = req.params.ingredients;
    var query = `
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
    connection.query(query, function(err, rows, fields){
        if(err) console.log(err);
        else{
            res.json(rows);
        }
     });
}

/* ---- (cuisine types) ---- */
async function getAllCuisineTypes(req, res) {
	// Define query here
	const query = `SELECT cuisine FROM CuisineType`;

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
	test: test,
    getAllIngredients: getAllIngredients,
    getAllCuisines: getAllCuisines,
		getMatchedCuisine: getMatchedCuisine,
	getAllCuisineTypes: getAllCuisineTypes,
}
