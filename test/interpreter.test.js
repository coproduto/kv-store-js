import jsc from 'jsverify';
import chai from 'chai';
import Parser from '../build/src/parser';
import Interpreter from '../build/src/interpreter';

const expect = chai.expect;

describe("the command interpreter", () => {
    it("should write into storage on SET", () => {
	const setCommandObject = {
	    error: false,
	    command: {
		name: Parser.commands.SET.name,
		args: { key: 'foo', value: 'bar' }
	    }
	};

	const getCommandObject = {
	    error: false,
	    command: {
		name: Parser.commands.GET.name,
		args: { key: 'foo' }
	    }
	};

	const interpreter = Interpreter.start();
	interpreter.handleSet(setCommandObject);

	expect(interpreter.handleGet(getCommandObject).output)
	    .to.equal('> bar');
    });

    it("should get the correct sum on SUM", () => {
	const setCommandObject = {
	    error: false,
	    command: {
		name: Parser.commands.SET.name,
		args: { key: 'foo', value: 10 } 
	    }
	};

	const sumCommandObject = {
	    error: false,
	    command: {
		name: Parser.commands.SUM.name,
	    }
	};

	const interpreter = Interpreter.start();
	interpreter.handleSet(setCommandObject);
	expect(interpreter.handleSum(sumCommandObject).output)
	    .to.equal('> 10');
    });
});
