const express = require("express");
const routes = requre("./routes.js");

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
