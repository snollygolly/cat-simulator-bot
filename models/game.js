module.exports = {
	newGame: (channel) => {
		const game = {
			id: channel,
			enabled: false,
			active: 0,
			time: null,
			last: 1
		};
		return game;
	}
};
