const log = require("../helpers/common").log;

const commands = require("./commands");
const calls = require("./calls");

module.exports = {
	getHandler: (sender, rcpt, message) => {
		// check for commands
		if (/^\!\w+/i.test(message) === true) {
			// this is a command
			return {
				type: "commands",
				action: commands.action
			};
		}
		// check for calls
		if (/.?here kitty.?/i.test(message) === true) {
			// this is a call
			return {
				type: "calls",
				action: calls.action
			};
		}
		return {
			type: null
		};
	}
};
