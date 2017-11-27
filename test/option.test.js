import jsc from 'jsverify';
import chai from 'chai';
import Option from '../build/option';

const expect = chai.expect;

describe("the option type", () => {
    describe("the None case", () => {
	it("should not have a value", () => {
	    const none = Option.none();
	    expect(none.hasValue).to.be.false;
	});

	it("should throw a TypeError if user attempts to extract its value", () => {
	    const none = Option.none();
	    expect(none.get).to.throw(TypeError);
	});
    });

    describe("the Some case", () => {
	jsc.property("should have a value", "integer", (x) => {
	    const some = Option.some(x);
	    return some.hasValue;
	});

	jsc.property("should preserve its value", "string", (s) => {
	    const some = Option.some(s);
	    return some.get() === s;
	});
    });

    describe("the fromNullable constructor", () => {
	it("should build a None from null", () => {
	    const option = Option.fromNullable(null);
	    expect(option.hasValue).to.be.false;
	});

	it("should build a Nonee from undefined", () => {
	    const option = Option.fromNullable(undefined);
	    expect(option.hasValue).to.be.false;
	});

	jsc.property(
	    "should build a Some from a non-null value",
	    "number", (x) => {
		const option = Option.fromNullable(x);
		return option.hasValue === true;
	});
    });
});
