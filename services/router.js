const log = require("../helpers/common").log;

const commands = require("./commands");
const calls = require("./calls");

module.exports = {
	handle: (sender, rcpt, message) => {
		// check for commands
		if (/^\!\w+/i.test(message) === true) {
			// this is a command
			log.info("hit commands handle");
			return commands.handle;
		}
		// check for calls
		if (/.?here kitty.?/i.test(message) === true) {
			// this is a call
			log.info("hit calls handle");
			return calls.handle;
		}
		return null;
	}
};
