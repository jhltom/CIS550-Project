// const process = require("process");
const express = require("express");
const routes = require("./routes.js");

const app = express();
const PORT = 8081;

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});

/* ---- (ingredients) ---- */
app.get('/ingredients', routes.getAllIngredients);

/* ---- (cuisine) ---- */
app.get('/cuisines', routes.getAllCuisines);

/* ---- (matched cuisine) ---- */
app.get('/cuisines/:cuisine', routes.getMatchedCuisine);

/* ---- (cuisine types) ---- */
app.get('/cuisineTypes', routes.getAllCuisineTypes);

// Test endpoint
app.get('/test', routes.test);

// Define other endpoints here



// Cleanup methods on process termination
// process.on('SIGINT', routes.cleanup);
// process.on('SIGTERM', routes.cleanup);
