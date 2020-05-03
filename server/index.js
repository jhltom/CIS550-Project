// const process = require("process");
const bodyParser = require('body-parser');
const express = require("express");
const routes = require("./routes.js");
const cors = require('cors');

const app = express();
const PORT = 8081;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

/* ---- (ingredients) ---- */
app.get('/ingredients', routes.getAllIngredients);

/* ---- (searchedIngredient) ---- */
app.get('/searchedIngredient/:search', routes.getSearchedIngredient);

/* ---- (cuisine) ---- */
app.get('/cuisines', routes.getAllCuisines);

/* ---- (matched cuisine) ---- */
app.post('/matchedCuisines', routes.getMatchedCuisine);

/* ---- (freq) ---- */
app.get('/freq', routes.getFreq);

/* ---- (cuisine types) ---- */
app.get('/cuisineTypes', routes.getAllCuisineTypes);

/* ---- (cuisine types) ---- */
// app.get('/cuisineTypesFull', routes.getAllCuisineTypesFull);

/* ---- (restaurants with given cuisine) ---- */
app.get('/cuisineRestaurants/:cuisineType/:day', routes.getRestaurantsWithCuisine);

/* ---- (top 5 related cuisine to a given cuisine) ---- */
app.get('/relatedCuisines/:cuisineId', routes.getRelatedCuisines);

/* ---- (restaurants within user-specified distance of user GPS) ---- */
app.post('/restaurantsNearby', routes.getNearbyRestaurants);

/* ---- (cuisines strictly not using selected ingredients) ---- */
app.post('/getCuisinesWithout', routes.getCuisinesMinusIngredients);

// Test endpoint
app.get('/test', routes.test);


const server = app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});


// Cleanup methods on process termination
function exitHandler() {
	console.log("Closing server...");
	server.close(() => {
		console.log("Server closed.");
		console.log("Closing connection pool...");
		routes.cleanup().then(() => {
			console.log("Pool closed.");
			process.exit(0);
		});
	});
}

process.on('SIGTERM', () => {
	console.log("SIGTERM Received.");
	exitHandler();
});
process.on('SIGINT', () => {
	console.log("SIGINT Received.");
	exitHandler();
});
