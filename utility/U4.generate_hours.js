// Parse arguments
const args = process.argv.slice(2);

if (args.length < 2) {
	console.log("Required input files(2) are missing: <mapping file> <details file>");
	return;
}

// Import libraries
const fs = require('fs');

// Read in mapping file
let mapping = new Map();
let file = fs.readFileSync(args[0], "utf8");
let lines = file.trim().split("\n");
lines.forEach(function(line) {
	let info = line.split("\t");
	mapping.set(info[0], parseInt(info[1]));
});

// Process all provided json files
let details = fs.readFileSync(args[1], "utf8");
let dirs = details.trim().split("\n");

// Store table data
let h_table = [];

// Define day mapping
let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Define helper functions
const conv_time = function(time) {
	let conv = [time.slice(0, 2), time.slice(2), "00"].join(":");
	return JSON.stringify(conv);
}

let noHours = 0;

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
		if (!mapping.has(restaurant.id)) {
			// These are previous request failures, or something is seriously wrong
			console.log("FATAL");
			console.log(restaurant.id || restaurant.error.code);
		} else {
			let b_id = mapping.get(restaurant.id);
			let hours = restaurant.hours ? restaurant.hours[0].open : [];

			if (!hours.length) noHours++;

			hours.forEach(function(hour) {
				let always_open = 0;
				let carryover;

				// Open 24 hours
				if (hour.is_overnight && hour.start === '0000' && hour.end === '0000') {
					always_open = 1;
				} else if (hour.is_overnight) { // Not 24 hours, but overnight
					carryover = hour.end;
					hour.end = '2359';
				} else if (hour.end === '0000') { // Not overnight, but ends at midnight
					hour.end = '2359';
				}

				h_table.push(
					[
						b_id,
						days[hour.day],
						conv_time(hour.start),
						conv_time(hour.end),
						always_open
					].join(",")
				);

				// If carryover exists, create new row with incremented day and modified times
				if (carryover) {
					h_table.push(
						[
							b_id,
							days[(hour.day + 1) % 7],
							conv_time('0000'),
							conv_time(carryover),
							always_open
						].join(",")
					);
				}
			});

			// This is to make sure that we've covered everything
			mapping.delete(restaurant.id);
		}
	});
});

// Make sure we've covered everything
console.log({flag: mapping.size, noHours: noHours});

// Write hours table to file
fs.writeFile("open_hours.csv", h_table.join("\n") + "\n", function(err) {
	console.log(err ? "ERROR: " + err : "H_TABLE DONE");
});
