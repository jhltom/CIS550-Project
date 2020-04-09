// Parse arguments
const args = process.argv.slice(2);

if (args.length < 1) {
	console.log("Directories file is missing.");
	return;
}

// Import libraries
const fs = require('fs');

// Define helper functions
const proc_restaurant = function(r) {
	let info = [
		JSON.stringify(r.name),
		JSON.stringify(r.location.display_address.join(", ")),
		r.location.city,
		r.location.state,
		r.location.zip_code,
		r.coordinates.latitude,
		r.coordinates.longitude,
		r.rating,
		r.review_count
	];

	// Strict checks to avoid falsy (but good) values messing with validity
	let missing = info.filter(function(item) {
		let checkA = item === undefined;
		let checkB = item === null;
		let checkC = item === '';

		return checkA || checkB || checkC;
	}).length;

	if (missing === 0) return info.join(",");
	return "";
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
let r_table = ["businessId,name,address,city,state,postalCode,latitude,longitude,stars,reviewCount"];
let c_table = ["cuisineId,cuisine"];
let s_table = ["businessId,cuisineId"];

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
			// Check for validity
			let processed = proc_restaurant(restaurant);
			if (processed.length === 0) return;
			
			// Create a table entry for this restaurant
			businesses.set(restaurant.id, ++b_id);
			r_table.push(b_id + "," + processed);

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

// Write business mapping to file (for business details query later)
let b_map = Array.from(businesses.keys()).map(function(key) {
	return key + "\t" + businesses.get(key);
}).join("\n") + "\n";

fs.writeFile("mapping.tsv", b_map, function(err) {
	console.log(err ? "ERROR: " + err : "MAPPING DONE");
});

// Write tables to file
fs.writeFile("restaurants.csv", r_table.join("\n") + "\n", function(err) {
	console.log(err ? "ERROR: " + err : "R_TABLE DONE");
});

fs.writeFile("food_categories.csv", c_table.join("\n") + "\n", function(err) {
	console.log(err ? "ERROR: " + err : "C_TABLE DONE");
});

fs.writeFile("serves.csv", s_table.join("\n") + "\n", function(err) {
	console.log(err ? "ERROR: " + err : "S_TABLE DONE");
});
