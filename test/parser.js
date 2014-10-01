var Lambda = require('./../bin/lambda.min.js');

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
