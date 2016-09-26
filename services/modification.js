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
		return false;
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
