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
			reply: `${dialog.about.message} ${common.color.grey}[Version: ${dialog.about.version}]`
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
			reply: `${randomGreeting} ${common.color.red}${randomFace}`
		};
	},
	pet: function pet(json, sender, rcpt, message, test = false) {
		if (json.game.enabled !== true || json.game.active !== true) {
			// can't spawn a cat if the game is stopped or hunt is already on
			return null;
		}
		// get reply
		const reply = getReply(json, sender, rcpt, message, test);
		// get score
		return {
			game_active: false,
			game_time: null,
			player_score: reply.points,
			reply: `${reply.message} ${common.color.grey}[${sender} replied in ${reply.time} seconds and got ${reply.points} ${reply.plural}]`
		};
	}
};

const getReply = (json, sender, rcpt, message, test = false) => {
	const command = message.substring(1);
	const dialogAction = dialog.action[command];
	const randomReply = dialogAction[common.getRandomInt(0, dialogAction.length - 1, test)];
	const adjustedScore = getScore(randomReply.points, json.game, test);
	const pluralizedPoints = (adjustedScore === 1) ? "point" : "points";
	return {
		message: randomReply.message.replace("[PLAYER]", sender),
		points: adjustedScore.points,
		plural: pluralizedPoints,
		time: adjustedScore.time
	};
};

const getScore = (base, game, test = false) => {
	let time;
	if (test === true) {
		time = moment(game.time).add("1", "second").valueOf();
	} else {
		time = moment(new Date()).valueOf();
	}
	const maxTime = 5;
	const timeElapsed = (time - moment(game.time).valueOf()) / 1000;
	let percOff = timeElapsed / maxTime;
	if (percOff > 1) {
		percOff = 1;
	}
	const pointsOff = base * percOff;
	const finalScore = Math.round((base - pointsOff) + base);
	return {
		points: finalScore,
		time: Math.round(timeElapsed * 100) / 100
	};
};

module.exports.commands = commands;
module.exports.getReply = getReply;
module.exports.getScore = getScore;
