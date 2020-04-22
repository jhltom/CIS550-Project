// const process = require("process");
const express = require("express");
const routes = require("./routes.js");

const app = express();
const PORT = 8081;

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});


// Test endpoint
app.get('/test', routes.test);

// Define other endpoints here



// Cleanup methods on process termination
// process.on('SIGINT', routes.cleanup);
// process.on('SIGTERM', routes.cleanup);
