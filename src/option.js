// --- Base data type ---
function Option() { };

// --- Option data type implementation ---
function Some(value) {
    this.value = value;
}
Some.prototype = Object.create(Option.prototype);

function None(value) { };
None.prototype = Object.create(Option.prototype);

// --- Constructors ---
Option.some = (value) => {
    return new Some(value);
};

Option.none = () => {
    return new None();
};

Option.fromNullable = (value) => {
    if (value === null) {
	return Option.none();
    } else {
	return Option.some(value);
    }
};

// --- Predicates ---
Option.prototype.hasValue = false;
Some.prototype.hasValue = true;

// --- Methods ---
Option.prototype.get = function() {
    throw new TypeError("Can't extract value from Option.none.");
};
Some.prototype.get = function() {
    return this.value;
};

export default Option;
