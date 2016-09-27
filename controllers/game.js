const log = require("../helpers/common").log;
const db = require("../helpers/db");
const router = require("../services/router");
const modification = require("../services/modification");

const playerModel = require("../models/player");
const gameModel = require("../models/game");

module.exports = {
	route: function* route(sender, rcpt, message) {
		const handler = router.getHandler(sender, rcpt, message);
		if (handler.type === null) {
			log.info("message didn't match router patterns");
			return null;
		}
		// build the reference object we'll pass around
		const json = {
			game: null,
			player: null,
			view: null
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
		const modFunction = handler.action(json, sender, rcpt, message);
		// next see if a reply is even required
		if (modFunction === null) {
			// no reply is needed = no db writes are needed
			log.info("got null mod function, returning");
			return null;
		}
		log.info(`Performing action [${modFunction.name}]`);
		const mod = modFunction(json, sender, rcpt, message);
		// see if the mod was successful
		if (mod === null) {
			// no reply is needed = no db writes are needed
			log.info("got null mod, returning");
			return null;
		}
		// next check if modifications are needed to the view object
		// primarily used to call views and filter results
		if (modification.needsViewMod(mod) === true) {
			log.info(`Applying modification to view [${mod.view_name}]`);
			json.view = yield db.runView("listing/scores", null, "cat-players");
			json.view = modification.handleViewMod(json.view.results, mod);
			// mod should always attach a reply to view
			mod.reply = json.view.reply;
		}
		// next check if modifications are needed to the game object
		if (modification.needsGameMod(mod) === true) {
			log.info(`Applying modification to game [${rcpt}]`);
			json.game = modification.handleGameMod(json.game, mod);
			json.game = yield db.saveDocument(json.game, "cat-games");
		}
		// next check if modifications are needed to the player object
		if (modification.needsPlayerMod(mod) === true) {
			log.info(`Applying modification to player [${sender}]`);
			// some action is needed on the player object, first fetch it
			json.player = yield db.getDocument(sender, "cat-players");
			if (json.player.error === true) {
				// something went wrong, probably no game
				// TODO: make this smarter
				// make a game
				json.player = playerModel.newPlayer(sender);
			}
			// actually perform the player action now
			json.player = modification.handlePlayerMod(json.player, mod);
			json.player = yield db.saveDocument(json.player, "cat-players");
		}
		// process reply
		if (mod.reply === null) {
			// no reply is needed = no db writes are needed
			log.info("got null reply, returning");
			return null;
		}
		return mod.reply;
	}
};
