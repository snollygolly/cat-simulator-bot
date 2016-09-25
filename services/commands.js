const config = require("../data/config.json");

module.exports = {
	handle: (json, sender, message) => {
		// first strip off the command character
		message.split("").shift().join("");
		// check to see if this is a command we handle
		if (commands.hasOwnProperty(message) !== true) {
			// this isn't a valid command we handle
			return false;
		}

	}
};

const commands = {
	start: function startGame(json, sender, message) {
		return false;
	},
	stop: function stopGame(json, sender, message) {
		return false;
	}
};
