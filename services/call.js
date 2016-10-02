const config = require("../data/config.json");

const commandService = require("./command");

const moment = require("moment");

module.exports = {
	action: (json, sender, rcpt, message) => {
		return calls["spawn"];
	}
};

const calls = {
	spawn: function spawn(json, sender, rcpt, message, test = false) {
		const nextCall = moment(json.game.last).add(config.spawn_delay, "minutes").valueOf();
		const nowCall = moment(new Date()).valueOf();
		if (nowCall >= nextCall) {
			// there has been a valid delay
			return commandService.commands["spawn"](json, sender, rcpt, message, test);
		}
		return null;
	}
};

module.exports.calls = calls;
