const config = require("./data/config.json");

const log = require("./helpers/common").log;
const game = require("./controllers/game");

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
// declare the first random spawn time
let time = randomRange(config.min_time, config.max_time);
// randomly spawn the kitties!
const randomKitties = () => {
	co(function* co() {
		// prepare the next kitty spawn in milliseconds
		// the current time setting are for min: 8 minutes - max: 30 minutes
		time = randomRange(config.min_time, config.max_time);
		setTimeout(randomKitties, time);
		// tell the game we want to spawn a kitty!
		const result = yield game.route(config.irc.nick, config.irc.channels[0], "!spawn");
		if (result === null) {
			// nothing should be said
			return;
		}
		// tell the room there is a kitty nearby
		client.say(config.irc.channels[0], result);
	}).catch(onError);
};
// prepare the first kitty to spawn in 20 seconds
setTimeout(randomKitties, time);

// handle the random number for spawn time
function randomRange(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

process.on("SIGINT", () => {
	log.info("Kitty is going to sleep...");
	client.disconnect("Nap time!");
	process.exit();
});
