import Option from './option';

// --- Base data type ---
const Storage = { };

// --- Storage data type implementation ---
function KeyValueStorage() {
    this.values = new Map();
};

// --- Constructors ---
Storage.make = () => {
    return new KeyValueStorage();
};

// --- Methods ---
KeyValueStorage.prototype.put = function(key, value) {
    if (value !== null && value !== undefined) {
	this.values.set(key, value);
    }
};

KeyValueStorage.prototype.get = function(key) {
    return Option.fromNullable(this.values.get(key));
};

// --- Transactions ---
KeyValueStorage.prototype.openTransaction = function() {
    return new TransactionStorage(this);
}

function TransactionStorage(parent) {
    this.parent = parent;
    this.values = new Map();
}
TransactionStorage.prototype = Object.create(KeyValueStorage.prototype);

KeyValueStorage.prototype.mergeTransaction = function(transaction) {
    this.values = new Map([...this.values, ...transaction.getValues()]);
};

TransactionStorage.prototype.get = function(key) {
    const ownValue = Option.fromNullable(this.values.get(key));
    if (ownValue.hasValue) {
	return ownValue;
    } else {
	return this.parent.get(key);
    }
}

TransactionStorage.prototype.commit = function() {
    this.parent.mergeTransaction(this);
    return this.parent;
}

TransactionStorage.prototype.rollback = function() {
    return this.parent;
}

TransactionStorage.prototype.getValues = function() {
    return this.values;
}

export default Storage;
