import Parser from './parser';
import Storage from './storage';

function Interpreter() {
    this.storage = Storage.make();
    this.transactionCount = 0;
};

Interpreter.start = () => {
    return new Interpreter();
}

Interpreter.prototype.handleSet = function(setObject) {
    this.storage.put(
	setObject.command.args.key,
	setObject.command.args.value
    );
    return { output: '' };
};

Interpreter.prototype.handleGet = function(getObject) {
    const result = this.storage.get(
	getObject.command.args.key
    );
    if (result.hasValue) {
	return { output: `> ${result.get()}` };
    } else {
	return { output: '> NULL' };
    }
};

Interpreter.prototype.handleSum = function() {
    const result = this.storage.sum();

    return { output: `> ${result}` };
};

Interpreter.prototype.handleBegin = function() {
    this.storage = this.storage.openTransaction();
    this.transactionCount += 1;
    return { output: '' };
};

Interpreter.prototype.handleCommit = function() {
    if (this.transactionCount > 0) {
	this.storage = this.storage.commit();
	this.transactionCount -= 1;
	return { output: '' };
    } else {
	return { output: "COMMIT: There is no open transaction." };
    }
};

Interpreter.prototype.handleRollback = function() {
    if (this.transactionCount > 0) {
	this.storage = this.storage.rollback();
	this.transactionCount -= 1;
	return { output: '' };
    } else {
	return { output: "ROLLBACK: There is no open transaction." };
    }
};

Interpreter.prototype.handleInput = function(input) {
    const parsedObjects = Parser.parseInput(input);
    return parsedObjects.map((object) => {
	if (object.error) {
	    return { output: object.errorMessage };
	} else {
	    switch (object.command.name) {
	    case Parser.commands.SET.name:
		return this.handleSet(object);
	    case Parser.commands.GET.name:
		return this.handleGet(object);
	    case Parser.commands.SUM.name:
		return this.handleSum(object);
	    case Parser.commands.BEGIN.name:
		return this.handleBegin(object);
	    case Parser.commands.COMMIT.name:
		return this.handleCommit(object);
	    case Parser.commands.ROLLBACK.name:
		return this.handleRollback(object);
	    default:
		throw new ReferenceError(`Unparseable entity ${parsedObject}`);
	    }
	}
    });
};
			  

export default Interpreter;
