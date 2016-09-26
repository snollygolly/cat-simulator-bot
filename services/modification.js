module.exports = {
	handleGameMod: (game, mod) => {
		for (const prop in game) {
			if (mod.hasOwnProperty(`game_${prop}`) === true) {
				// the prop in the mod we're checking exists in the main object, replace it
				game[prop] = mod[`game_${prop}`];
			}
		}
		return game;
	},
	handlePlayerMod: (player, mod) => {
		for (const prop in player) {
			if (mod.hasOwnProperty(`player_${prop}`) === true) {
				// check for score
				if (prop === "score") {
					// this prop goes to score, so add to existing score, not overwrite
					player[prop] += mod[`player_${prop}`];
				} else {
					// the prop in the mod we're checking exists in the main object, replace it
					player[prop] = mod[`player_${prop}`];
				}
			}
		}
		return player;
	},
	needsGameMod: (mod) => {
		for (const prop in mod) {
			if (prop.indexOf("game_") !== -1) {
				return true;
			}
		}
		return false;
	},
	needsPlayerMod: (mod) => {
		for (const prop in mod) {
			if (prop.indexOf("player_") !== -1) {
				return true;
			}
		}
		return false;
	}
};
