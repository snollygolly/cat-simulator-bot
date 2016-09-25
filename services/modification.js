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
	}
};
