var Lambda = require('../bin/lambda.js');

module.exports.testMarshalUndefined = function (test) {
	test.ok(typeof Lambda.UndefinedValue.INSTANCE.marshal() === 'undefined');
	test.done();
};

module.exports.testMarshalNull = function (test) {
	test.ok(Lambda.NullValue.INSTANCE.marshal() === null);
	test.done();
};

module.exports.testMarshalTrue = function (test) {
	test.ok(Lambda.BooleanValue.TRUE.marshal() === true);
	test.done();
};

module.exports.testMarshalTrue = function (test) {
	test.ok(Lambda.BooleanValue.FALSE.marshal() === false);
	test.done();
};

module.exports.testMarshalInteger1 = function (test) {
	test.ok((new Lambda.IntegerValue(0)).marshal() === 0);
	test.done();
};

module.exports.testMarshalInteger2 = function (test) {
	test.ok((new Lambda.IntegerValue(100)).marshal() === 100);
	test.done();
};

module.exports.testMarshalComplex = function (test) {
	var value = (new Lambda.ComplexValue(12, 34)).marshal();
	test.ok(value.r === 12);
	test.ok(value.i === 34);
	test.done();
};

module.exports.testMarshalFloat = function (test) {
	test.ok((new Lambda.FloatValue(12.34)).marshal() === 12.34);
	test.done();
};

module.exports.testMarshalString1 = function (test) {
	test.ok((new Lambda.StringValue('')).marshal() === '');
	test.done();
};

module.exports.testMarshalString2 = function (test) {
	test.ok((new Lambda.StringValue('hello')).marshal() === 'hello');
	test.done();
};

module.exports.testMarshalString3 = function (test) {
	test.ok((new Lambda.StringValue('"hel\nlo\'')).marshal() === '"hel\nlo\'');
	test.done();
};

module.exports.testMarshalClosure1 = function (test) {
	var ast = new Lambda.LambdaNode('x', new Lambda.LiteralNode(Lambda.NullValue.INSTANCE));
	var value = (new Lambda.Closure(ast, new Lambda.Context())).marshal();
	test.ok(typeof value === 'function');
	test.ok(value(null) === null);
	test.ok(value(123.456) === null);
	test.done();
};

module.exports.testMarshalClosure2 = function (test) {
	var ast = new Lambda.LambdaNode('x', new Lambda.VariableNode('x'));
	var value = (new Lambda.Closure(ast, new Lambda.Context())).marshal();
	test.ok(typeof value === 'function');
	test.ok(value(null) === null);
	test.ok(value(123.456) === 123.456);
	test.done();
};

module.exports.testMarshalEmptyArray = function (test) {
	var value = (new Lambda.ArrayValue([])).marshal();
	test.ok(Array.isArray(value));
	test.ok(value.length === 0);
	test.done();
};

module.exports.testMarshalArray1 = function (test) {
	var value = (new Lambda.ArrayValue([new Lambda.IntegerValue(0)])).marshal();
	test.ok(Array.isArray(value));
	test.ok(value.length === 1);
	test.ok(value[0] === 0);
	test.done();
};

module.exports.testMarshalArray2 = function (test) {
	var value = (new Lambda.ArrayValue([
		Lambda.NullValue.INSTANCE,
		new Lambda.StringValue('hello')
	])).marshal();
	test.ok(Array.isArray(value));
	test.ok(value.length === 2);
	test.ok(value[0] === null);
	test.ok(value[1] === 'hello');
	test.done();
};

module.exports.testMarshalEmptyObject = function (test) {
	var value = (new Lambda.ObjectValue(new Lambda.Context())).marshal();
	test.ok(typeof value === 'object' && value !== null);
	for (var key in value) {
		test.ok(false);
	}
	test.done();
};

// TODO test more object marshaling, including nested objects and arrays

module.exports.testUnmarshalUndefined = function (test) {
	test.ok(Lambda.AbstractValue.unmarshal().is(Lambda.UndefinedValue));
	test.done();
};

module.exports.testUnmarshalNull = function (test) {
	test.ok(Lambda.AbstractValue.unmarshal(null).is(Lambda.NullValue));
	test.done();
};

module.exports.testUnmarshalTrue = function (test) {
	var value = Lambda.AbstractValue.unmarshal(true);
	test.ok(value.is(Lambda.BooleanValue));
	test.ok(value.value === true);
	test.done();
};

module.exports.testUnmarshalTrue = function (test) {
	var value = Lambda.AbstractValue.unmarshal(false);
	test.ok(value.is(Lambda.BooleanValue));
	test.ok(value.value === false);
	test.done();
};

/**
 * XXX unmarshalling whole number produce FloatValue's, see bug #7
 */
/*
module.exports.testUnmarshalInteger1 = function (test) {
	var value = Lambda.AbstractValue.unmarshal(0);
	test.ok(value.is(Lambda.IntegerValue));
	test.ok(value.value === 0);
	test.done();
};

module.exports.testUnmarshalInteger2 = function (test) {
	var value = Lambda.AbstractValue.unmarshal(4321);
	test.ok(value.is(Lambda.IntegerValue));
	test.ok(value.value === 4321);
	test.done();
};
*/

module.exports.testUnmarshalComplex1 = function (test) {
	var value = Lambda.AbstractValue.unmarshal((new Lambda.ComplexValue(0, 0)).marshal());
	test.ok(value.is(Lambda.ComplexValue));
	test.ok(value.real === 0);
	test.ok(value.imaginary === 0);
	test.done();
};

module.exports.testUnmarshalComplex2 = function (test) {
	var value = Lambda.AbstractValue.unmarshal((new Lambda.ComplexValue(1.2, 2.3)).marshal());
	test.ok(value.is(Lambda.ComplexValue));
	test.ok(value.real === 1.2);
	test.ok(value.imaginary === 2.3);
	test.done();
};

module.exports.testUnmarshalFloat1 = function (test) {
	var value = Lambda.AbstractValue.unmarshal(43.21);
	test.ok(value.is(Lambda.FloatValue));
	test.ok(value.value === 43.21);
	test.done();
};

module.exports.testUnmarshalFloat2 = function (test) {
	var value = Lambda.AbstractValue.unmarshal(12.34);
	test.ok(value.is(Lambda.FloatValue));
	test.ok(value.value === 12.34);
	test.done();
};

module.exports.testUnmarshalEmptyString = function (test) {
	var value = Lambda.AbstractValue.unmarshal('');
	test.ok(value.is(Lambda.StringValue));
	test.ok(value.value === '');
	test.done();
};

module.exports.testUnmarshalString1 = function (test) {
	var value = Lambda.AbstractValue.unmarshal('hello');
	test.ok(value.is(Lambda.StringValue));
	test.ok(value.value === 'hello');
	test.done();
};

module.exports.testUnmarshalString2 = function (test) {
	var value = Lambda.AbstractValue.unmarshal('"hel\nlo\'');
	test.ok(value.is(Lambda.StringValue));
	test.ok(value.value === '"hel\nlo\'');
	test.done();
};

module.exports.testUnmarshalNoArgFunction = function (test) {
	var value = Lambda.AbstractValue.unmarshal(function () {});
	test.ok(value.is(Lambda.Closure));
	test.ok(value.lambda.body.is(Lambda.NativeNode));
	test.done();
};

module.exports.testUnmarshalOneArgFunction = function (test) {
	var value = Lambda.AbstractValue.unmarshal(function (x) {});
	test.ok(value.is(Lambda.Closure));
	test.ok(value.lambda.is(Lambda.LambdaNode));
	test.ok(value.lambda.body.is(Lambda.NativeNode));
	test.done();
};

module.exports.testUnmarshalTwoArgFunction = function (test) {
	var value = Lambda.AbstractValue.unmarshal(function (x, y) {});
	test.ok(value.is(Lambda.Closure));
	test.ok(value.lambda.is(Lambda.LambdaNode));
	test.ok(value.lambda.body.is(Lambda.LambdaNode));
	test.ok(value.lambda.body.body.is(Lambda.NativeNode));
	test.done();
};

module.exports.testUnmarshalEmptyArray = function (test) {
	var value = Lambda.AbstractValue.unmarshal([]);
	test.ok(value.is(Lambda.ArrayValue));
	test.ok(value.array.length === 0);
	test.done();
};

// TODO test more array and object unmarshalling, including nesting and recursion
