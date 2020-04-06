// Parse arguments
const args = process.argv.slice(2);

if (args.length < 1) {
	console.log("Directories file is missing.");
	return;
}

// Import libraries
const fs = require('fs');

// Define helper functions
const proc_restaurant = function(id, r) {
	return [
		id,
		JSON.stringify(r.name),
		JSON.stringify(r.location.display_address.join(", ")),
		r.location.city,
		r.location.zip_code,
		r.coordinates.latitude,
		r.coordinates.longitude,
		r.rating,
		r.review_count
	].join(",");
}

// Process all provided json files
let file = fs.readFileSync(args[0], "utf8");
let dirs = file.trim().split("\n");

// Assign ids as we go
let businesses = new Map();
let categories = new Map();

let b_id = 0;
let c_id = 0;

// Store table data
let r_table = [];
let c_table = [];
let s_table = [];

dirs.forEach(function(dir) {
	let json;

	try {
		json = JSON.parse(fs.readFileSync(dir, "utf8"));
	} catch (e) {
		console.log("JSON FORMAT ERROR: " + e);
		return;
	}

	let restaurants = json.restaurants;

	restaurants.forEach(function(restaurant) {
		// Business ids should not be repeated
		if (!businesses.has(restaurant.id)) {
			// Create a table entry for this restaurant
			businesses.set(restaurant.id, ++b_id);
			r_table.push(proc_restaurant(b_id, restaurant));

			// Examine categories for restaurant
			let cats = restaurant.categories;

			cats.forEach(function(cat) {
				// Category ids can be repeated
				if (!categories.has(cat.alias)) {
					categories.set(cat.alias, ++c_id);
					c_table.push(c_id + "," + JSON.stringify(cat.title));
					s_table.push(b_id + "," + c_id);
				} else {
					s_table.push(b_id + "," + categories.get(cat.alias));
				}
			});
		} else {
			console.log("DUPLICATED BUSINESS: " + restaurant.name);
		}
	});
});


fs.writeFile("restaurants.csv", r_table.join("\n") + "\n", function(err) {
	console.log(err ? "ERROR: " + err : "R_TABLE DONE");
});

fs.writeFile("food_categories.csv", c_table.join("\n") + "\n", function(err) {
	console.log(err ? "ERROR: " + err : "C_TABLE DONE");
});

fs.writeFile("serves.csv", s_table.join("\n") + "\n", function(err) {
	console.log(err ? "ERROR: " + err : "S_TABLE DONE");
});
