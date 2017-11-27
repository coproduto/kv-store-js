import Interpreter from './src/interpreter';
import readline from 'readline';

const interpreter = Interpreter.start();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Shows a prompt and waits for user input.
// The actual processing is done by the interpreter (src/interpreter.js)
const startCLI = () => {
    rl.setPrompt('$> ');
    rl.prompt();
    rl.on('line', (line) => {
	const results = interpreter.handleInput(line);
	results.forEach((result) => {
	    if (result.output) {
		console.log(result.output);
	    }
	});
	rl.prompt();
    });
};

startCLI();






