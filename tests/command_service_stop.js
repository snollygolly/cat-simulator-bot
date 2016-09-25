const config = require("../data/config.json");

const expect = require("chai").expect;

const routerService = require("../services/router");
const commandService = require("../services/command");
const modificationService = require("../services/modification");

const gameModel = require("../models/game");

const testCommand = "stop";
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
		handler	= routerService.getHandler(sender, rcpt, message);
		modFunction = handler.action(json, sender, rcpt, message);
		mod = modFunction(json, sender, rcpt, message);
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
		expect(mod).to.have.property("game_enabled");
		return done();
	});

	it("mod properties should be of the correct types", (done) => {
		expect(mod.reply).to.be.a("string");
		expect(mod.game_enabled).to.be.a("boolean");
		return done();
	});

	it("mod properties should have correct values", (done) => {
		const testMod = commandService.commands[testCommand](json, sender, rcpt, testCommand);
		expect(mod.reply).to.equal(testMod.reply);
		expect(mod.game_enabled).to.equal(false);
		return done();
	});

	it("mod should correctly apply to game", (done) => {
		expect(newGame.enabled).to.equal(mod.game_enabled);
		return done();
	});
});
