// const process = require("process");
const express = require("express");
const routes = require("./routes.js");
const cors = require('cors');

const app = express();
const PORT = 8081;

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

/* ---- (ingredients) ---- */
app.get('/ingredients', routes.getAllIngredients);

/* ---- (cuisine) ---- */
app.get('/cuisines', routes.getAllCuisines);

/* ---- (matched cuisine) ---- */
app.get('/cuisines/:cuisine', routes.getMatchedCuisine);

/* ---- (cuisine types) ---- */
app.get('/cuisineTypes', routes.getAllCuisineTypes);

/* ---- (restaurants with given cuisine) ---- */
app.get('/cuisineRestaurants/:cuisineType/:day', routes.getRestaurantsWithCuisine);

// Test endpoint
app.get('/test', routes.test);


app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});

// Cleanup methods on process termination
// process.on('SIGINT', routes.cleanup);
// process.on('SIGTERM', routes.cleanup);
