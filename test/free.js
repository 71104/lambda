var Lambda = require('../bin/lambda.js');

function isSubSet(set1, set2) {
	return set1.every(function (element1) {
		return set2.some(function (element2) {
			return element1 === element2;
		});
	});
}

function matchSets(set1, set2) {
	return isSubSet(set1, set2) && isSubSet(set2, set1);
}

function testSet(expression, variables) {
	return function (test) {
		var ast = (new Lambda.Parser(expression)).parse();
		test.ok(matchSets(ast.getFreeVariables(), variables));
		test.done();
	};
}

module.exports.testUndefinedLiteral = testSet('undefined', []);
module.exports.testNullLiteral = testSet('null', []);
module.exports.testTrueLiteral = testSet('true', []);
module.exports.testFalseLiteral = testSet('false', []);
module.exports.testIntegerLiteral = testSet('123', []);
module.exports.testFloatLiteral = testSet('3.14', []);
module.exports.testComplexLiteral = testSet('5i', []);
module.exports.testStringLiteral = testSet('\'hello\'', []);

module.exports.testVariable = testSet('blahblah', ['blahblah']);
module.exports.testFix = testSet('fix', []);
module.exports.testThis = testSet('this', ['this']);
module.exports.testError = testSet('error', ['error']);

module.exports.testField1 = testSet('x.y', ['x']);
module.exports.testField2 = testSet('x.y.z', ['x']);
module.exports.testSubscript = testSet('x[y]', ['x', 'y']);
module.exports.testLambda1 = testSet('x -> x', []);
module.exports.testLambda2 = testSet('x -> y', ['y']);
module.exports.testLambda3 = testSet('x, y -> x', []);
module.exports.testLambda4 = testSet('x, y -> y', []);
module.exports.testLambda5 = testSet('x, y -> z', ['z']);
