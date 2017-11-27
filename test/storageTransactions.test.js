import jsc from 'jsverify';
import chai from 'chai';
import Storage from '../build/storage';

const expect = chai.expect;

describe("Storage transactions", () => {
    describe("a transaction", () => {
	jsc.property(
	    "should have access to its parent's values",
	    "string & string", (pair) => {
		const key = pair[0];
		const inputValue = pair[1];
		
		const storage = Storage.make();
		storage.put(key, inputValue);
		const transaction = storage.openTransaction();
		const outputValue = transaction.get(key);

		return outputValue.get() === inputValue;
	});

	jsc.property(
	    "should be able to override its parent's values",
	    "number & number & string", (triple) => {
		const key = triple[0];
		const oldValue = triple[1];
		const newValue = triple[2];

		const storage = Storage.make();
		storage.put(key, oldValue);
		const transaction = storage.openTransaction();
		transaction.put(key, newValue);
		const outputValue = transaction.get(key);
		return outputValue.get() === newValue;
	 });

	jsc.property(
	    "should not be able to change its parent's values",
	    "number & string & number", (triple) => {
		const key = triple[0];
		const oldValue = triple[1];
		const newValue = triple[2];

		const storage = Storage.make();
		storage.put(key, oldValue);
		const transaction = storage.openTransaction();
		transaction.put(key, newValue);
		const outputValue = storage.get(key);

		return outputValue.get() === oldValue;
	});

	jsc.property(
	    "should merge with its parent when committed",
	    "string & string & number & number & number", (tuple) => {
		const key = tuple[0];
		const oldValue = tuple[1];
		const newValue = tuple[2];
		
		const newKey = tuple[3];
		const newTransactionValue = tuple[4];

		const storage = Storage.make();
		storage.put(key, oldValue);
		const transaction = storage.openTransaction();
		transaction.put(key, newValue);
		transaction.put(newKey, newTransactionValue);

		const newStorage = transaction.commit();
		const outputValue1 = newStorage.get(key);
		const outputValue2 = newStorage.get(newKey);

		return outputValue1.get() === newValue
		    && outputValue2.get() === newTransactionValue;
	});

	jsc.property(
	    "should not change its parent when rolled back",
	    "string & string & number & number & number", (tuple) => {
		const key = tuple[0];
		const oldValue = tuple[1];
		const newValue = tuple[2];
		
		const newKey = tuple[3];
		const newTransactionValue = tuple[4];

		const storage = Storage.make();
		storage.put(key, oldValue);
		const transaction = storage.openTransaction();
		transaction.put(key, newValue);
		transaction.put(newKey, newTransactionValue);

		const newStorage = transaction.rollback();
		const outputValue1 = newStorage.get(key);
		const outputValue2 = newStorage.get(newKey);

		return outputValue1.get()    === oldValue
		    && outputValue2.hasValue === false;
	});
    });
});
