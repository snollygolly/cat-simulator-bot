const config = require("../data/config.json");

const expect = require("chai").expect;

const routerService = require("../services/router");
const commandService = require("../services/command");
const modificationService = require("../services/modification");

const gameModel = require("../models/game");

const testCommand = "scores";
const sender = "test";
const rcpt = "#testchannel";
const message = `${config.command_character}${testCommand}`;
const viewMock = require("./mocks/view_score.json");

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
		expect(modFunction.name).to.equal(testCommand);
		return done();
	});

	it("mod should be an object", (done) => {
		expect(mod).to.not.be.an("undefined");
		expect(mod).to.be.an("object");
		return done();
	});

	it("mod should have correct properties", (done) => {
		expect(mod).to.have.property("transform");
		expect(mod).to.have.property("display");
		expect(mod).to.have.property("view_name");
		return done();
	});

	it("mod properties should be of the correct types", (done) => {
		expect(mod.transform).to.be.a("function");
		expect(mod.display).to.be.a("function");
		expect(mod.view_name).to.be.a("string");
		return done();
	});

	it("mod properties should have correct values", (done) => {
		const testMod = commandService.commands[testCommand](json, sender, rcpt, testCommand);
		const newView = modificationService.handleViewMod(viewMock.input, testMod);
		const sortedArr = testMod.transform(viewMock.input);
		expect(mod.view_name).to.equal("listing/scores");
		expect(sortedArr).to.deep.equal(viewMock.output);
		const formattedReply = testMod.display(sortedArr);
		expect(formattedReply).to.equal(newView.reply);
		return done();
	});
});
