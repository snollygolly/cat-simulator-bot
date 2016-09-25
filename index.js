const config = require("./data/config.json");

const irc = require("irc");

const client = new irc.Client(config.irc.server, config.irc.nick, {
	userName: "CatSim",
	realName: "Hyper Realistic Cat Simulation",
	channels: config.irc.channels,
	floodProtection: true
});

client.addListener("message", (from, to, message) => {
	console.log(`from: ${from} => to: ${to} [${message}]`);
});

client.addListener("pm", (from, message) => {
	console.log(`from: ${from} => to: ME [${message}]`);
});

client.addListener("error", (message) => {
	console.log("error: ", message);
});
