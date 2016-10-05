const config = require("../data/config.json");

const expect = require("chai").expect;
const moment = require("moment");

const routerService = require("../services/router");
const commandService = require("../services/command");
const modificationService = require("../services/modification");

const gameModel = require("../models/game");
const playerModel = require("../models/player");

const testCommand = "pickup";
const sender = "test";
const rcpt = "#testchannel";
const message = `${config.command_character}${testCommand}`;

let handler;
let json;
let newGame;
let newPlayer;
let modFunction;
let mod;

describe(`Commands Service - '${message}' Command`, () => {
	before(() => {
		json = {
			game: gameModel.newGame(rcpt),
			player: playerModel.newPlayer(sender)
		};
		// manually start game
		json.game.enabled = true;
		json.game = modificationService.handleGameMod(Object.assign({}, json.game), {
			game_active: true,
			game_time: moment(new Date()).valueOf()
		});
		handler	= routerService.getHandler(sender, rcpt, message);
		modFunction = handler.action(json, sender, rcpt, message);
		// use test command because it gets filtered in the mod function
		mod = modFunction(json, sender, rcpt, message, true);
		// apply the modifications
		newGame = modificationService.handleGameMod(Object.assign({}, json.game), mod);
		newPlayer = modificationService.handlePlayerMod(Object.assign({}, json.player), mod, "#room");
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
		const testMod = commandService.commands[testCommand](json, sender, rcpt, message, true);
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

	it("mod should correctly apply to player", (done) => {
		expect(newPlayer.score).to.be.an("array");
		expect(newPlayer.score.length).to.equal(1);
		expect(newPlayer.score).to.equal(json.player.score);
		expect(newPlayer.score[0]["score"]).to.equal(mod.player_score);
		expect(newPlayer.score[0]["room"]).to.equal("#room");
		return done();
	});
});
