const config = require("../data/config.json");

const expect = require("chai").expect;

const routerService = require("../services/router");

const sender = "test";
const rcpt = "#testchannel";

const message = {
	normal: "This is a test message",
	command: `${config.command_character}about`,
	call: "here kitty!"
};

let handler;

describe("Router Service - Null Route", () => {
	before(() => {
		handler = routerService.getHandler(sender, rcpt, message.normal);
	});

	it("handler should be an object", (done) => {
		expect(handler).to.not.be.an("undefined");
		expect(handler).to.be.an("object");
		return done();
	});

	it("handler should have correct properties", (done) => {
		expect(handler).to.have.property("type");
		expect(handler).to.not.have.property("action");
		return done();
	});

	it("game properties should have correct values", (done) => {
		expect(handler.type).to.equal(null);
		return done();
	});
});

describe("Router Service - Command Route", () => {
	before(() => {
		handler = routerService.getHandler(sender, rcpt, message.command);
	});

	it("handler should be an object", (done) => {
		expect(handler).to.not.be.an("undefined");
		expect(handler).to.be.an("object");
		return done();
	});

	it("handler should have correct properties", (done) => {
		expect(handler).to.have.property("type");
		expect(handler).to.have.property("action");
		return done();
	});

	it("game properties should have correct values", (done) => {
		expect(handler.type).to.equal("commands");
		expect(handler.action).to.be.a("function");
		return done();
	});
});

describe("Router Service - Calls Route", () => {
	before(() => {
		handler = routerService.getHandler(sender, rcpt, message.call);
	});

	it("handler should be an object", (done) => {
		expect(handler).to.not.be.an("undefined");
		expect(handler).to.be.an("object");
		return done();
	});

	it("handler should have correct properties", (done) => {
		expect(handler).to.have.property("type");
		expect(handler).to.have.property("action");
		return done();
	});

	it("game properties should have correct values", (done) => {
		expect(handler.type).to.equal("calls");
		expect(handler.action).to.be.a("function");
		return done();
	});
});
