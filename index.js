import Interpreter from './src/interpreter';
import readline from 'readline';

const interpreter = Interpreter.start();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const handleOpenTransactions = () => {
    if (interpreter.transactionCount > 0) {
	do {
	    process.stdout.write(
		'There are open transactions. Do you really wish to exit? (y/n) '
	    );
	    let input = readline().trim().toUpperCase();
	    if (input !== 'Y' && input !== 'N') {
		console.log('Please enter y or n.');
	    }
	} while (input !== 'Y' && input !== 'N')

	if (input === 'Y') {
	    process.exit();
	}
    }
};

process.on('SIGINT', handleOpenTransactions);

rl.setPrompt('$> ');
rl.prompt();
rl.on('line', (line) => {
    let result = interpreter.handleInput(line);
    console.log(result);
    if (result.output) {
	console.log(result.output);
    }
    rl.prompt();
}).on('close', handleOpenTransactions);





