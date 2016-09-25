const bunyan = require("bunyan");
const log = bunyan.createLogger({
	name: "CatSim"
});

module.exports = {
	log: log
};
