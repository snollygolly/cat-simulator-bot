module.exports = {
	newPlayer: (nick) => {
		const player = {
			nick: nick,
			score: 0,
			charm: {
				name: "none",
				type: "point",
				effect: 0
			}
		};
		return player;
	}
};
