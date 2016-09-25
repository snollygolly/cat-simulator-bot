const log = require("../helpers/common").log;

const command = require("./command");
const call = require("./call");

module.exports = {
	getHandler: (sender, rcpt, message) => {
		// check for commands
		if (/^\!\w+/i.test(message) === true) {
			// this is a command
			return {
				type: "command",
				action: command.action
			};
		}
		// check for calls
		if (/.?here kitty.?/i.test(message) === true) {
			// this is a call
			return {
				type: "call",
				action: call.action
			};
		}
		return {
			type: null
		};
	}
};
