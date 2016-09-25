const config = require("../data/config.json");

const expect = require("chai").expect;

const routerService = require("../services/router");
const commandsService = require("../services/commands");

const gameModel = require("../models/game");

const testCommand = "about";
const sender = "test";
const rcpt = "#testchannel";
const message = `${config.command_character}${testCommand}`;

let handler;
let json;
let modFunction;
let mod;

describe(`Commands Service - '${message}' Command`, () => {
	before(() => {
		json = {
			game: gameModel.newGame(rcpt)
		};
		handler	= routerService.getHandler(sender, rcpt, message);
		modFunction = handler.action(json, sender, rcpt, message);
		mod = modFunction(json, sender, rcpt, message);
	});

	it("mod should be the correct function", (done) => {
		expect(modFunction).to.be.a("function");
		expect(modFunction.name).to.equal("about");
		return done();
	});

	it("mod should be an object", (done) => {
		expect(mod).to.not.be.an("undefined");
		expect(mod).to.be.an("object");
		return done();
	});

	it("mod should have correct properties", (done) => {
		expect(mod).to.have.property("reply");
		return done();
	});

	it("mod properties should be of the correct types", (done) => {
		expect(mod.reply).to.be.a("string");
		return done();
	});

	it("mod properties should have correct values", (done) => {
		const testMod = commandsService.commands[testCommand](json, sender, rcpt, testCommand);
		expect(mod.reply).to.equal(testMod.reply);
		return done();
	});
});
