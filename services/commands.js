const config = require("../data/config.json");
const dialog = require("../data/dialog.json");

module.exports = {
	action: (json, sender, message) => {
		// first strip off the command character
		message.split("").shift().join("");
		// check to see if this is a command we handle
		if (commands.hasOwnProperty(message) !== true) {
			// this isn't a valid command we handle
			return null;
		}
		return commands[message];
	}
};

const commands = {
	about: function showAbout(json, sender, message) {
		return {
			reply: `${dialog.about.message} - Version: ${dialog.about.version}`
		};
	},
	start: function startGame(json, sender, message) {
		if (json.game.enabled === true) {
			// can't start a game if it's already started
			return null;
		}
		return {
			game_enabled: true,
			reply: "Kitties have been spotted nearby, maybe you could try calling them?"
		};
	},
	stop: function stopGame(json, sender, message) {
		if (json.game.enabled === false) {
			// can't stop a game if it's already stopped
			return null;
		}
		return {
			game_enabled: false,
			reply: "All the kitties are asleep, calling them will be no use."
		};
	}
};
