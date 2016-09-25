const config = require("../data/config.json");
const dialog = require("../data/dialog.json");

module.exports = {
	action: (json, sender, rcpt, message) => {
		// first strip off the command character
		const command = message.substring(1);
		// check to see if this is a command we handle
		if (commands.hasOwnProperty(command) !== true) {
			// this isn't a valid command we handle
			return null;
		}
		return commands[command];
	}
};

const commands = {
	about: function about(json, sender, rcpt, message) {
		return {
			reply: `${dialog.about.message} - Version: ${dialog.about.version}`
		};
	},
	start: function start(json, sender, rcpt, message) {
		if (json.game.enabled === true) {
			// can't start a game if it's already started
			return null;
		}
		return {
			game_enabled: true,
			reply: "Kitties have been spotted nearby, maybe you could try calling them?"
		};
	},
	stop: function stop(json, sender, rcpt, message) {
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

module.exports.commands = commands;
