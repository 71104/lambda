var Lambda = require('../bin/lambda.js');

function parse(text) {
	return (new Lambda.Parser(text)).parse();
}

module.exports.testUndefined = function (test) {
	var ast = parse('undefined');
	test.ok(ast.is(Lambda.LiteralNode));
	test.ok(ast.value.is(Lambda.UndefinedValue));
	test.ok(ast.type.is(Lambda.UndefinedType));
	test.done();
};

module.exports.testNull = function (test) {
	var ast = parse('null');
	test.ok(ast.is(Lambda.LiteralNode));
	test.ok(ast.value.is(Lambda.NullValue));
	test.ok(ast.type.is(Lambda.NullType));
	test.done();
};

module.exports.testTrue = function (test) {
	var ast = parse('true');
	test.ok(ast.is(Lambda.LiteralNode));
	test.ok(ast.value.is(Lambda.BooleanValue));
	test.ok(ast.value.value === true);
	test.ok(ast.type.is(Lambda.BooleanType));
	test.done();
};

module.exports.testFalse= function (test) {
	var ast = parse('false');
	test.ok(ast.is(Lambda.LiteralNode));
	test.ok(ast.value.is(Lambda.BooleanValue));
	test.ok(ast.value.value === false);
	test.ok(ast.type.is(Lambda.BooleanType));
	test.done();
};

module.exports.testInteger = function (test) {
	var ast = parse('1');
	test.ok(ast.is(Lambda.LiteralNode));
	test.ok(ast.value.is(Lambda.IntegerValue));
	test.ok(ast.value.value === 1);
	test.ok(ast.type.is(Lambda.IntegerType));
	test.done();
};

module.exports.testFloat = function (test) {
	var ast = parse('3.14');
	test.ok(ast.is(Lambda.LiteralNode));
	test.ok(ast.value.is(Lambda.FloatValue));
	test.ok(ast.value.value === 3.14);
	test.ok(ast.type.is(Lambda.FloatType));
	test.done();
};

module.exports.testString = function (test) {
	var ast = parse('\'hello\'');
	test.ok(ast.is(Lambda.LiteralNode));
	test.ok(ast.value.is(Lambda.StringValue));
	test.ok(ast.value.value === 'hello');
	test.ok(ast.type.is(Lambda.StringType));
	test.done();
};

module.exports.testStringWithEscapes = function (test) {
	var ast = parse('\'hel\\nlo\'');
	test.ok(ast.is(Lambda.LiteralNode));
	test.ok(ast.value.is(Lambda.StringValue));
	test.ok(ast.value.value === 'hel\nlo');
	test.ok(ast.type.is(Lambda.StringType));
	test.done();
};

module.exports.testVariable1 = function (test) {
	var ast = parse('x');
	test.ok(ast.is(Lambda.VariableNode));
	test.ok(ast.name === 'x');
	test.done();
};

module.exports.testVariable2 = function (test) {
	var ast = parse('hello');
	test.ok(ast.is(Lambda.VariableNode));
	test.ok(ast.name === 'hello');
	test.done();
};

module.exports.testFix = function (test) {
	var ast = parse('fix');
	test.ok(ast.is(Lambda.FixNode));
	test.done();
};

module.exports.testError = function (test) {
	var ast = parse('error');
	test.ok(ast.is(Lambda.ErrorNode));
	test.done();
};

module.exports.testFieldAccess1 = function (test) {
	var ast = parse('x.x');
	test.ok(ast.is(Lambda.FieldAccessNode));
	test.ok(ast.name === 'x');
	test.done();
};

module.exports.testFieldAccess2 = function (test) {
	var ast = parse('x.y');
	test.ok(ast.is(Lambda.FieldAccessNode));
	test.ok(ast.name === 'y');
	test.done();
};

module.exports.testVariableFieldAccess = function (test) {
	var ast = parse('object.field');
	test.ok(ast.is(Lambda.FieldAccessNode));
	test.ok(ast.left.is(Lambda.VariableNode));
	test.ok(ast.left.name === 'object');
	test.ok(ast.name === 'field');
	test.done();
};
