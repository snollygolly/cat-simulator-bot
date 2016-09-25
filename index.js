const config = require("./data/config.json");

const log = require("./helpers/common").log;
const game = require("./controllers/game");

const irc = require("irc");

const client = new irc.Client(config.irc.server, config.irc.nick, {
	userName: "CatSim",
	realName: "Hyper Realistic Cat Simulation",
	channels: config.irc.channels,
	floodProtection: true
});
log.info("Waking up the kitty...");

client.addListener("join", (channel, nick, message) => {
	log.info(`Joined ${channel} with ${nick}`);
});

client.addListener("message", (sender, rcpt, message) => {
	log.debug(`sender: ${sender} => rcpt: ${rcpt} [${message}]`);
	const result = game.route(sender, rcpt, message);
	Client.say(rcpt, result);
});

client.addListener("pm", (sender, message) => {
	log.debug(`sender: ${sender} => rcpt: ME [${message}]`);
	const result = game.route(sender, "me", message);
});

client.addListener("error", (message) => {
	log.error(message);
});

process.on("SIGINT", () => {
	client.disconnect("Nap time!");
	process.exit();
});
