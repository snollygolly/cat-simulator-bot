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

// handle random numbers for spawn times
module.exports.getRandomRange = function getRandomRange(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
};

module.exports.color = {
	control: `${String.fromCharCode(3)}`,
	red: `${String.fromCharCode(3)}4`,
	grey: `${String.fromCharCode(3)}14`
};
