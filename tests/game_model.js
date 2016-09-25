const expect = require("chai").expect;

const gameModel = require("../models/game");

const channel = "#testchannel";

let game;

describe("Game Model - New Game", () => {
	before(() => {
		game = gameModel.newGame(channel);
	});

	it("game should be an object", (done) => {
		expect(game).to.not.be.an("undefined");
		expect(game).to.be.an("object");
		return done();
	});

	it("game should have correct properties", (done) => {
		expect(game).to.have.property("id");
		expect(game).to.have.property("enabled");
		expect(game).to.have.property("active");
		expect(game).to.have.property("time");
		expect(game).to.have.property("last");
		return done();
	});

	it("game properties should have correct values", (done) => {
		expect(game.id).to.equal(channel);
		expect(game.enabled).to.equal(false);
		expect(game.active).to.equal(false);
		expect(game.time).to.equal(null);
		expect(game.last).to.equal(1);
		return done();
	});
});
