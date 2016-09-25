const log = require("../helpers/common").log;
const db = require("../helpers/db");
const router = require("../services/router");
const modifications = require("../services/modifications");

const playerModel = require("../models/player");
const gameModel = require("../models/game");

module.exports = {
	route: (sender, rcpt, message) => {
		const handler = router.getHandler(sender, rcpt, message);
		if (handler.type === null) {
			log.info("message didn't match router patterns");
			return false;
		}
		co(function* co() {
			// build the reference object we'll pass around
			const json = {
				game: null,
				player: null
			};
			// get the game info from the database
			json.game = yield db.getDocument(rcpt, "cat-games");
			if (json.game.error === true) {
				// something went wrong, probably no game
				// TODO: make this smarter
				// make a game
				json.game  = gameModel.newGame(rcpt);
			}
			// call the route returned by the router
			// get back a "modification" object that controls how the
			// game and player objects are manipulated
			const mod = handler.action(json, sender, message);
			log.info("mod", mod);
			// next see if a reply is even required
			if (mod.reply === null) {
				// no reply is needed = no db writes are needed
				log.info("no reply needed, returning");
				return false;
			}
			// next check if modifications are needed to the game object
			if (mod.game !== null) {
				log.info("needs game mod");
				json.game = modifications.handleGameMod(json.game, mod);
				json.game = yield db.saveDocument(json.game, "cat-games");
			}
			// next check if modifications are needed to the player object
			if (mod.player !== null) {
				log.info("needs player mod");
				// some action is needed on the player object, first fetch it
				json.player = yield db.getDocument(sender, "cat-players");
				if (json.player.error === true) {
					// something went wrong, probably no game
					// TODO: make this smarter
					// make a game
					json.player = playerModel.newPlayer(sender);
				}
				// actually perform the player action now
				json.player = modifications.handlePlayerMod(json.player, mod);
				json.player = yield db.saveDocument(json.player, "cat-players");
			}
			// process reply
			log.info(`returning reply: ${mod.reply}`);
			return mod.reply;
		}).catch(onerror);
	}

};


function onError(err) {
	console.error(err.stack);
	throw new Error(err);
}
