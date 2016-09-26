const config = require("../data/config.json");
const dialog = require("../data/dialog.json");

const moment = require("moment");

const common = require("../helpers/common");

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
	},
	spawn: function spawn(json, sender, rcpt, message, test = false) {
		if (json.game.enabled !== true) {
			// can't spawn a cat if the name is stopped
			return null;
		}
		if (json.game.active === true) {
			// can't spawn a cat if one is already spawned
			return null;
		}
		// get a shorthand for right now
		const nowMoment = moment(new Date()).valueOf();
		// build the cat message
		const randomFace = dialog.display.face[common.getRandomInt(0, dialog.display.face.length - 1, test)];
		const randomGreeting = dialog.display.greeting[common.getRandomInt(0, dialog.display.greeting.length - 1, test)];
		return {
			game_active: true,
			game_time: nowMoment,
			game_last: nowMoment,
			reply: `${randomGreeting} ${randomFace}`
		};
	},
	pet: function pet(json, sender, rcpt, message, test = false) {
		if (json.game.enabled !== true) {
			// can't spawn a cat if the name is stopped
			return null;
		}
		if (json.game.active !== true) {
			// can't pet a cat if it's not active
			return null;
		}
		// get reply
		const randomReply = dialog.action.pet[common.getRandomInt(0, dialog.action.pet.length - 1, test)];
		const replacedReply = randomReply.message.replace("[PLAYER]", sender);
		return {
			game_active: false,
			game_time: null,
			reply: `${replacedReply}`
		};
	}
};

module.exports.commands = commands;
