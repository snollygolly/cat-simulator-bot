const config = require("../data/config.json");

const expect = require("chai").expect;
const moment = require("moment");

const routerService = require("../services/router");
const commandService = require("../services/command");
const modificationService = require("../services/modification");

const gameModel = require("../models/game");

const testCommand = "pet";
const sender = "test";
const rcpt = "#testchannel";
const message = `${config.command_character}${testCommand}`;

let handler;
let json;
let newGame;
let modFunction;
let mod;

describe(`Commands Service - '${message}' Command`, () => {
	before(() => {
		json = {
			game: gameModel.newGame(rcpt)
		};
		// manually start game
		json.game.enabled = true;
		// manually spawn the cat
		json.game.active = true;
		handler	= routerService.getHandler(sender, rcpt, message);
		modFunction = handler.action(json, sender, rcpt, message);
		mod = modFunction(json, sender, rcpt, message, true);
		newGame = modificationService.handleGameMod(Object.assign({}, json.game), mod);
	});

	it("mod should be the correct function", (done) => {
		expect(modFunction).to.be.a("function");
		expect(modFunction.name).to.equal(testCommand);
		return done();
	});

	it("mod should be an object", (done) => {
		expect(mod).to.not.be.an("undefined");
		expect(mod).to.be.an("object");
		return done();
	});

	it("mod should have correct properties", (done) => {
		expect(mod).to.have.property("reply");
		expect(mod).to.have.property("game_active");
		expect(mod).to.have.property("game_time");
		return done();
	});

	it("mod properties should be of the correct types", (done) => {
		expect(mod.reply).to.be.a("string");
		expect(mod.game_active).to.be.a("boolean");
		expect(mod.game_time).to.be.a("null");
		return done();
	});

	it("mod properties should have correct values", (done) => {
		const testMod = commandService.commands[testCommand](json, sender, rcpt, testCommand, true);
		expect(mod.reply).to.equal(testMod.reply);
		expect(mod.game_active).to.equal(false);
		expect(mod.game_time).to.equal(null);
		return done();
	});

	it("mod should correctly apply to game", (done) => {
		expect(newGame.active).to.equal(mod.game_active);
		expect(newGame.time).to.equal(mod.game_time);
		return done();
	});
});
