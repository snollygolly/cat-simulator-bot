const common = require("../helpers/common");
const config = require("../data/config.json");
const commandService = require("../services/command");
const co = require("co");
const index = require("../index");
const game = require("./game");

const	randomKitties = () => {
	co(function* co() {
		// prepare the next kitty spawn in milliseconds
		// the current time setting are for min: 8 minutes - max: 30 minutes
		const time = common.getRandomInt(config.min_time, config.max_time);
		setTimeout(randomKitties, time);
		// tell the game we want to spawn a kitty!
		const result = yield game.route(config.irc.nick, config.irc.channels[0], "!spawn");
		if (result === null) {
			// nothing should be said
			return;
		}
		// tell the room there is a kitty nearby
		index.client.say(config.irc.channels[0], result);
	}).catch(onError);

	function onError(err) {
		console.error(err.stack);
		throw new Error(err);
	}
};

module.exports.randomKitties = randomKitties;
