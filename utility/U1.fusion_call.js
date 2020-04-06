// Import libraries
const fs = require('fs');
const env = require('dotenv');
const fetch = require('node-fetch');

// Configure environment
env.config({path: "Z1.project.env"});

// Define query parameters here (change as needed)
const city = "San%20Francisco%2C%20CA";
const rad = 40000;		// Max allowed by API
const lim = 50;			// Max allowed by API
const sort = "rating";	// Yelp adjusted rating
const cat = 1;			// Price category 1,2,3,4
const cap = 1000;		// Max allowed by API

// Query API
(async () => {
	let params = {
		term: "restaurants",
		location: city,
		radius: rad,
		limit: lim,
		offset: 0,
		sort_by: sort,
		price: cat
	}

	// Build request
	const base_url = "https://api.yelp.com/v3/businesses/search";
	const options = {
		method: "GET",
		headers: {
			"Authorization": "Bearer " + process.env['API_KEY'],
			"Connection": "keep-alive"
		}
	}

	let results = [];
	let flagged = false;
	let page = 0;

	// Keep querying until cap or end is reached
	while (results.length < cap && !flagged) {
		let query = Object.keys(params).map(function(key) {
			return key + "=" + params[key];
		}).join("&");

		let full_url = base_url + "?" + query;

		let response = await fetch(full_url, options);
		let json = await response.json();

		console.log(`Page ${++page}\t:\t${json.businesses.length} results`);

		flagged = json.businesses.length != lim;
		results = results.concat(json.businesses);
		params.offset += lim;
	}

	fs.writeFile("results.json", JSON.stringify({restaurants: results}) + "\n", function(err) {
		console.log(err ? "ERROR: " + err : "DONE");
	});
})();
