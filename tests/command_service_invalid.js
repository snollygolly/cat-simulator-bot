const config = require("../data/config.json");

const expect = require("chai").expect;

const routerService = require("../services/router");
const commandsService = require("../services/commands");

const gameModel = require("../models/game");

const sender = "test";
const rcpt = "#testchannel";
const message = `${config.command_character}testcommand`;

let handler;
let json;
let mod;

describe("Commands Service - Invalid Command", () => {
	before(() => {
		json = {
			game: gameModel.newGame(rcpt)
		};
		handler	= routerService.getHandler(sender, rcpt, message);
		mod = handler.action(json, sender, rcpt, message);
	});

	it("mod should be a null", (done) => {
		expect(mod).to.not.be.an("undefined");
		expect(mod).to.be.equal(null);
		return done();
	});
});
