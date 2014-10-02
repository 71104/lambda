var Lambda = require('../bin/lambda.js');

function parse(text) {
	return (new Lambda.Parser(text)).parse();
}

module.exports.testUndefined = function (test) {
	var ast = parse('undefined');
	test.ok(ast.is(Lambda.LiteralNode) && ast.value.is(Lambda.UndefinedValue));
	test.done();
};

module.exports.testNull = function (test) {
	var ast = parse('null');
	test.ok(ast.is(Lambda.LiteralNode) && ast.value.is(Lambda.NullValue));
	test.done();
};

module.exports.testTrue = function (test) {
	var ast = parse('true');
	test.ok(
		ast.is(Lambda.LiteralNode) &&
		ast.value.is(Lambda.BooleanValue) &&
		ast.value.value === true
		);
	test.done();
};

module.exports.testFalse= function (test) {
	var ast = parse('false');
	test.ok(
		ast.is(Lambda.LiteralNode) &&
		ast.value.is(Lambda.BooleanValue) &&
		ast.value.value === false
		);
	test.done();
};

module.exports.testInteger = function (test) {
	var ast = parse('1');
	test.ok(
		ast.is(Lambda.LiteralNode) &&
		ast.value.is(Lambda.IntegerValue) &&
		ast.value.value === 1
		);
	test.done();
};

module.exports.testFloat = function (test) {
	var ast = parse('3.14');
	test.ok(
		ast.is(Lambda.LiteralNode) &&
		ast.value.is(Lambda.FloatValue) &&
		ast.value.value === 3.14
		);
	test.done();
};

module.exports.testString = function (test) {
	var ast = parse('\'hello\'');
	test.ok(
		ast.is(Lambda.LiteralNode) &&
		ast.value.is(Lambda.StringValue) &&
		ast.value.value === 'hello'
		);
	test.done();
};

module.exports.testVariable1 = function (test) {
	var ast = parse('x');
	test.ok(ast.is(Lambda.VariableNode) && ast.name === 'x');
	test.done();
};

module.exports.testVariable2 = function (test) {
	var ast = parse('hello');
	test.ok(ast.is(Lambda.VariableNode) && ast.name === 'hello');
	test.done();
};

module.exports.testFix = function (test) {
	var ast = parse('fix');
	test.ok(ast.is(Lambda.FixNode));
	test.done();
};

module.exports.testThis = function (test) {
	var ast = parse('this');
	test.ok(ast.is(Lambda.ThisNode));
	test.done();
};

module.exports.testError = function (test) {
	var ast = parse('error');
	test.ok(ast.is(Lambda.ErrorNode));
	test.done();
};

module.exports.testFieldAccess1 = function (test) {
	var ast = parse('x.x');
	test.ok(
		ast.is(FieldAccessNode) &&
		ast.name === 'x'
		);
	test.done();
};

module.exports.testFieldAccess2 = function (test) {
	var ast = parse('x.y');
	test.ok(
		ast.is(FieldAccessNode) &&
		ast.name === 'y'
		);
	test.done();
};

module.exports.testVariableFieldAccess = function (test) {
	var ast = parse('object.field');
	test.ok(
		ast.is(FieldAccessNode) &&
		ast.left.is(VariableNode) &&
		ast.left.name === 'object' &&
		ast.name === 'field'
		);
	test.done();
};
