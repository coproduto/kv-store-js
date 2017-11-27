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

export default Storage;
