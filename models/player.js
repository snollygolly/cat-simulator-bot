module.exports = {
	newPlayer: (nick) => {
		const player = {
			id: nick,
			nick: nick,
			score: [],
			charm: {
				name: "none",
				type: "point",
				effect: 0
			}
		};
		return player;
	}
};
