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
let list = [];
lines.forEach(function(line) {
	let info = line.split("\t");
	mapping.set(info[0], parseInt(info[1]));
	list.push(info[0]);
});

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
	let count = 0;

	// Keep querying until cap or end is reached
	while (list.length) {
		let item = list.pop();
		let full_url = base_url + item;
		let response = await fetch(full_url, options);
		let json = await response.json();
		results.push(json);
		console.log(`Query ${++count}`);
	}

	fs.writeFile("exceptions.json", JSON.stringify({restaurants: results}) + "\n", function(err) {
		console.log(err ? "ERROR: " + err : "DONE");
	});
})();
