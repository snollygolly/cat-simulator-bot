module.exports = {
	newGame: (channel) => {
		const game = {
			id: channel,
			enabled: false,
			active: false,
			time: null,
			last: 1
		};
		return game;
	}
};
