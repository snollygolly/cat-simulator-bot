const config = require("./data/config.json");

const log = require("./helpers/common").log;
const game = require("./controllers/game");

const common = require("./helpers/common");
const randomize = require("./controllers/randomKitties");

const co = require("co");
const irc = require("irc");

const client = new irc.Client(config.irc.server, config.irc.nick, {
	userName: "CatSim",
	realName: "Hyper Realistic Cat Simulation",
	channels: config.irc.channels,
	floodProtection: true
});
log.info("Waking up the kitty...");

client.addListener("registered", (message) => {
	log.info(`Connected to ${config.irc.server}`);
	client.say("NICKSERV", `identify ${config.irc.password}`);
});

client.addListener("join", (channel, nick, message) => {
	log.info(`Joined ${channel} with ${nick}`);
});

client.addListener("message", (sender, rcpt, message) => {
	co(function* co() {
		const result = yield game.route(sender, rcpt, message);
		if (result === null) {
			// nothing should be said
			return;
		}
		log.info(`Saying: '${result}' to ${rcpt}`);
		client.say(rcpt, result);
	}).catch(onError);
});

client.addListener("pm", (sender, message) => {
	// TODO: handle PMs
	return;
	co(function* co() {
		const result = yield game.route(sender, rcpt, message);
		if (result === null) {
			// nothing should be said
			return;
		}
		log.info(`Saying: '${result}' to ${rcpt}`);
		client.say(rcpt, result);
	}).catch(onError);

});

client.addListener("error", (message) => {
	log.error(message);
});

function onError(err) {
	console.error(err.stack);
	throw new Error(err);
}

// prepare the first kitty to spawn randomly
const time = common.getRandomInt(config.min_time, config.max_time);
setTimeout(() => {
	randomize.randomKitties();
}, time);
// common.getRandomInt(config.min_time, config.max_time));

process.on("SIGINT", () => {
	log.info("Kitty is going to sleep...");
	client.disconnect("Nap time!");
	process.exit();
});

module.exports.client = client;
