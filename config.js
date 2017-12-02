var env = process.env.NODE_ENV;
try {
	console.log("***************** USING " + env + " ENVIRONMENT *****************")
	module.exports = require('./app.' + env + '.json');
}
catch (err) {
	console.error("***************** " + env + " ENVIRONMENT NOT FOUND. USING dev ENVIRONMENT *****************");
	module.exports = require('./app.dev.json');
}


