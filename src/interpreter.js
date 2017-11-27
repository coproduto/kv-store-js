import Parser from './parser';
import Storage from './storage';

// --- Instantiation ---
// The constructor function should not be used directly.
// Use Interpreter.start instead.
function Interpreter() {
    this.storage = Storage.make();
    this.transactionCount = 0;
};

// Creates a new interpreter.
Interpreter.start = () => {
    return new Interpreter();
}

// --Command handling --
// All of the handlers delegate to the storage module (src/storage.js).
// The data they receive comes from the command parser (src/parser.js).

// Every command object has an "error" field of Boolean value.
// If the "error" field is set to true, the object has an "errorMessage"
// of String value. Otherwise, it has a "command" field whose value
// is an object with fields "name" and "args" (the latter only if
// the command takes arguments).

// The format for each command is specified in the command parser's file.

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

// The following two handlers use `transactionCount`
// in order to determine whether the user is in a transaction.
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
	return { output: "COMMIT: Not in a transaction." };
    }
};

Interpreter.prototype.handleRollback = function() {
    if (this.transactionCount > 0) {
	this.storage = this.storage.rollback();
	this.transactionCount -= 1;
	return { output: '' };
    } else {
	return { output: "ROLLBACK: Not in a transaction." };
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
