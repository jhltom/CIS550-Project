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

// functinos to be called in index.js
module.exports={
    getAllIngredients: getAllIngredients,
    getAllCuisines: getAllCuisines,
    getMatchedCuisine: getMatchedCuisine
}