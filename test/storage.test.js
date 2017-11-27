import jsc from 'jsverify';
import chai from 'chai';
import Storage from '../build/storage';

const expect = chai.expect;

describe("the storage module", () => {
    describe("PUT and GET operations", () => {
	jsc.property(
	    "can retrieve integers by integer keys",
	    "integer & integer", (pair) => {
		const storage = Storage.make();
		const key = pair[0];
		const inputValue = pair[1];
		storage.put(key, inputValue);
		const outputValue = storage.get(key);

		
		return outputValue.get() === inputValue;
	});
    });
});
