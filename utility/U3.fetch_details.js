// Parse arguments
const args = process.argv.slice(2);

// Import libraries
const fs = require('fs');
const env = require('dotenv');
const fetch = require('node-fetch');

// Configure environment
env.config({path: "Z1.project.env"});

// Read in mapping file
let mapping = new Map();
let file = fs.readFileSync(args[0], "utf8");
let lines = file.trim().split("\n");
lines.forEach(function(line) {
	let info = line.split("\t");
	mapping.set(parseInt(info[1]), info[0]);
});

// Define query parameters here (change as needed)
let start = 1;
let limit = 1000;

// Query API
(async () => {
	// Build request
	const base_url = "https://api.yelp.com/v3/businesses/";
	const options = {
		method: "GET",
		headers: {
			"Authorization": "Bearer " + process.env['API_KEY'],
			"Connection": "keep-alive"
		}
	}

	let results = [];

	// Keep querying until cap or end is reached
	while (limit--) {
		let full_url = base_url + mapping.get(start);
		let response = await fetch(full_url, options);
		let json = await response.json();
		results.push(json);
		start++;
	}

	fs.writeFile("details.json", JSON.stringify({restaurants: results}) + "\n", function(err) {
		console.log(err ? "ERROR: " + err : "DONE");
	});
})();
