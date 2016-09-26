const bunyan = require("bunyan");
const log = bunyan.createLogger({
	name: "CatSim"
});

module.exports = {
	log: log
};

module.exports.getRandomInt = function getRandomInt(min, max, test = false) {
	if (test === true) {
		return min;
	}
	return Math.floor(Math.random() * (max - min + 1)) + min;
};
