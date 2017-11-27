import jsc from 'jsverify';
import chai from 'chai';
import Parser from '../build/parser';

const expect = chai.expect;

describe("the command parser", () => {
    it("should correctly parse the SET command", () => {
	const setCommandObject = [{
	    error: false,
	    command: {
		name: Parser.commands.SET.name,
		args: { key: "foo", value: "bar" }
	    }
	}];

	const parserOutput = Parser.parseInput("set foo bar");

	expect(Parser.parseInput("set foo bar"))
	    .to.deep.equal(setCommandObject);
    });

    it("should correctly parse the GET command", () => {
	const getCommandObject = [{
	    error: false,
	    command: {
		name: Parser.commands.GET.name,
		args: { key: "foo" }
	    }
	}];

	expect(Parser.parseInput(" GEt  foo"))
	    .to.deep.equal(getCommandObject);
    });

    it("should correctly parse the SUM command", () => {
	const sumCommandObject = [{
	    error: false,
	    command: {
		name: Parser.commands.SUM.name
	    }
	}];

	expect(Parser.parseInput("   sUm    "))
	    .to.deep.equal(sumCommandObject);
    });

    it("should correctly parse the BEGIN command", () => {
	const beginCommandObject = [{
	    error: false,
	    command: {
		name: Parser.commands.BEGIN.name
	    }
	}];

	expect(Parser.parseInput("   beGIN    "))
	    .to.deep.equal(beginCommandObject);
    });

    it("should correctly parse the COMMIT command", () => {
	const commitCommandObject = [{
	    error: false,
	    command: {
		name: Parser.commands.COMMIT.name
	    }
	}];

	expect(Parser.parseInput("commit"))
	    .to.deep.equal(commitCommandObject);
    });
    
    it("should correctly parse the ROLLBACK command", () => {
	const rollbackCommandObject = [{
	    error: false,
	    command: {
		name: Parser.commands.ROLLBACK.name
	    }
	}];

	expect(Parser.parseInput("   rollBACK"))
	    .to.deep.equal(rollbackCommandObject);
    });
});

describe("the command parser's errors", () => {
    it("should generate an error when an invalid command is given", () => {
	const result = Parser.parseInput(" do something");
	
	expect(result[0].error).to.be.true;
	expect(result[0].errorMessage).to.not.be.undefined;
    });

    it("should generate an error when it gets the wrong number of args", () => {
	const result = Parser.parseInput("set foo bar baz");
	
	expect(result[0].error).to.be.true;
	expect(result[0].errorMessage).to.not.be.undefined;
    });
});
