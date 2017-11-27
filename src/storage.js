import Option from './option';

// --- Base data type ---
const Storage = { };

// --- Storage data type implementation ---
// The sum of all integer values is kept as a data property
// and updated whenever a new integer is inserted.
// A storage with a parent storage is considered a transaction.
function KeyValueStorage(parent) {
    this.parent = parent;
    this.values = new Map();
    if(parent) {
        this.cachedSum = parent.cachedSum;
    } else {
        this.cachedSum = 0;
    }
};

// --- Constructors ---
Storage.make = () => {
    return new KeyValueStorage();
};

// --- Methods ---
// We update the cached sum on value insertion.
KeyValueStorage.prototype.put = function(key, value) {
    if (value !== null && value !== undefined) {
   	    const valueAsInt = parseInt(value);
    	  if (!isNaN(valueAsInt)) {
            this.updateSumCache(key, valueAsInt);
        }
        this.values.set(key, value);
    }
};

KeyValueStorage.prototype.updateSumCache = function(key, intValue) {
    const previous = this.get(key);
    if (previous.hasValue) {
     	  const oldValueAsInt = parseInt(previous.get());
      
  	    if (!isNaN(oldValueAsInt)) {
	    	    this.cachedSum += intValue - oldValueAsInt;
	      } else {
    		    this.cachedSum += intValue;
	      }
	  } else {
      this.cachedSum += intValue;
    }
};

// The "parent" value is used here when a transaction is in effect -
// the transaction is linked to the old storage through it
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
// A transaction is simply a new storage object linked to the previous one.
// If a value is not found in the new storage, it is seeked in the parent.
KeyValueStorage.prototype.openTransaction = function() {
    return new KeyValueStorage(this);
}

KeyValueStorage.prototype.mergeTransaction = function(transaction) {
    this.cachedSum = transaction.cachedSum;
    this.values = new Map([...this.values, ...transaction.getValues()]);
};

// To commit a transaction is simply to merge it with its parent.
KeyValueStorage.prototype.commit = function() {
    this.parent.mergeTransaction(this);
    return this.parent;
}

// And to roll it back is simply to discard it.
KeyValueStorage.prototype.rollback = function() {
    return this.parent;
}

KeyValueStorage.prototype.getValues = function() {
    return this.values;
}

export default Storage;
