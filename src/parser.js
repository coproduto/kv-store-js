// The following immutable table serves as a contract for all the modules which
// deal with command handling. Every function which deals with commands
// must use the command names specified here.
const commands = Object.create({} , {
    SET:      { enumerable: true, value: { name: 'SET',      argCount: 2 }},
    GET:      { enumerable: true, value: { name: 'GET',      argCount: 1 }},
    SUM:      { enumerable: true, value: { name: 'SUM',      argCount: 0 }},
    BEGIN:    { enumerable: true, value: { name: 'BEGIN',    argCount: 0 }},
    COMMIT:   { enumerable: true, value: { name: 'COMMIT',   argCount: 0 }},
    ROLLBACK: { enumerable: true, value: { name: 'ROLLBACK', argCount: 0 }}
});

// --- Error handling ---
// A command object which represents an error has its "error" field set to
// true and an errorMessage field.
const commandError = (commandName) => ({
    error: true,
    errorMessage: `${commandName} is not a valid command.`
});

const argumentError = (commandName, argumentNumber) => ({
    error: true,
    errorMessage: `${commandName} expects ${commands[commandName].argCount} `
    + `arguments, but ${argumentNumber} were provided.`
});

// --- Command object constructors ---
// A command object which represents a well-formed command has its "error"
// field set to false and a command field which contains its name and arguments,
// if applicable.

// SET -> arguments: key, value
const setCommand = (key, value) => ({
    error: false,
    command: {
	name: commands.SET.name,
	args: { key, value }
    }
});

// GET -> arguments: key
const getCommand = (key) => ({
    error: false,
    command: {
	name: commands.GET.name,
	args: { key }
    }
});

// SUM -> no arguments
const sumCommand = () => ({
    error: false,
    command: { name: commands.SUM.name }
});

// BEGIN -> no arguments
const beginCommand = () => ({
    error: false,
    command: { name: commands.BEGIN.name }
});

// COMMIT -> no arguments
const commitCommand = () => ({
    error: false,
    command: { name: commands.COMMIT.name }
});

// ROLLBACK -> no arguments
const rollbackCommand = () => ({
    error: false,
    command: { name: commands.ROLLBACK.name }
});

// here we dispatch to the appropriate constructor based on the command
const buildCommandObject = (commandName, args) => {
    switch (commandName) {
    case commands.SET.name:
	return setCommand(args[0], args[1]);
    case commands.GET.name:
	return getCommand(args[0]);
    case commands.SUM.name:
	return sumCommand();
    case commands.BEGIN.name:
	return beginCommand();
    case commands.COMMIT.name:
	return commitCommand();
    case commands.ROLLBACK.name:
	return rollbackCommand();
    default:
	throw new ReferenceError(`Unknown command name ${commandName}`);
    }
};

// --- Text parsing ---
// checks if the command is well-formed
const validateCommand = (commandString, args) => {
    const command = commands[commandString];
    const argumentCount = args.length;
    if (argumentCount !== command.argCount) {
	return argumentError(commandString, argumentCount);
    } else {
	return buildCommandObject(commandString, args);
    }
};

// checks if a line of text starts with a valid command
const parseLine = (line) => {
    const trimmed = line.trim();
    const words = line.split(/\s+/).filter(s => s.length > 0);
    const command = words[0].toUpperCase();
    if (!(command in commands)) {
	return commandError(command);
    } else {
	return validateCommand(command, words.slice(1));
    }
};

// splits input into lines and attempts to construct a valid command
// from each
const parseInput = (input) => {
    const lines = input.split('\n');
    return lines.map(parseLine);
};

export default {
    commands,
    parseInput
};
