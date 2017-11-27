const commands = Object.create({} , {
    SET:      { enumerable: true, value: { name: 'SET',      argCount: 2 }},
    GET:      { enumerable: true, value: { name: 'GET',      argCount: 1 }},
    SUM:      { enumerable: true, value: { name: 'SUM',      argCount: 0 }},
    BEGIN:    { enumerable: true, value: { name: 'BEGIN',    argCount: 0 }},
    COMMIT:   { enumerable: true, value: { name: 'COMMIT',   argCount: 0 }},
    ROLLBACK: { enumerable: true, value: { name: 'ROLLBACK', argCount: 0 }}
});

const commandError = (commandName) => ({
    error: true,
    errorMessage: `${commandName} is not a valid command.`
});

const argumentError = (commandName, argumentNumber) => ({
    error: true,
    errorMessage: `${commandName} expects ${commands[commandName].argCount} `
    + `arguments, but ${argumentNumber} were provided.`
});

const setCommand = (key, value) => ({
    error: false,
    command: {
	name: commands.SET.name,
	args: { key, value }
    }
});

const getCommand = (key) => ({
    error: false,
    command: {
	name: commands.GET.name,
	args: { key }
    }
});

const sumCommand = () => ({
    error: false,
    command: { name: commands.SUM.name }
});

const beginCommand = () => ({
    error: false,
    command: { name: commands.BEGIN.name }
});

const commitCommand = () => ({
    error: false,
    command: { name: commands.COMMIT.name }
});

const rollbackCommand = () => ({
    error: false,
    command: { name: commands.ROLLBACK.name }
});

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

const validateCommand = (commandString, args) => {
    const command = commands[commandString];
    const argumentCount = args.length;
    if (argumentCount !== command.argCount) {
	return argumentError(commandString, argumentCount);
    } else {
	return buildCommandObject(commandString, args);
    }
};

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

const parseInput = (input) => {
    const lines = input.split('\n');
    return lines.map(parseLine);
};

export default {
    commands,
    parseInput
};
