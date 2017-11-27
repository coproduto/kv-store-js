import Option from './option';

// --- Base data type ---
const Storage = { };

// --- Storage data type implementation ---
function KeyValueStorage(parent) {
    this.parent = parent;
    this.values = new Map();
    this.cachedSum = 0;
};

// --- Constructors ---
Storage.make = () => {
    return new KeyValueStorage();
};

// --- Methods ---
KeyValueStorage.prototype.put = function(key, value) {
    if (value !== null && value !== undefined) {
	const valueAsInt = parseInt(value);
	if (valueAsInt && !isNaN(valueAsInt)) {
	    const oldValueAsInt = parseInt(this.get(key));
	    if (oldValueAsInt && !isNaN(oldValueAsInt)) {
		this.cachedSum += valueAsInt - oldValueAsInt;
	    } else {
		this.cachedSum += valueAsInt;
	    }
	}
	this.values.set(key, value);
    }
};

KeyValueStorage.prototype.get = function(key) {
    const ownValue = Option.fromNullable(this.values.get(key));
    if (ownValue.hasValue) {
	return ownValue;
    } else if (this.parent) {
	return this.parent.get(key);
    } else {
	return Option.none();
    }
};

KeyValueStorage.prototype.sum = function() {
    return this.cachedSum;
};

// --- Transactions ---
KeyValueStorage.prototype.openTransaction = function() {
    return new KeyValueStorage(this);
}

KeyValueStorage.prototype.mergeTransaction = function(transaction) {
    this.values = new Map([...this.values, ...transaction.getValues()]);
};

KeyValueStorage.prototype.commit = function() {
    this.parent.mergeTransaction(this);
    return this.parent;
}

 KeyValueStorage.prototype.rollback = function() {
    return this.parent;
}

KeyValueStorage.prototype.getValues = function() {
    return this.values;
}

export default Storage;
