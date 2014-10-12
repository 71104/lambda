var Lambda = require('../bin/lambda.js');

function createLexer(text) {
	return new Lambda.Lexer(text);
}

module.exports.testEmpty = function (test) {
	var lexer = createLexer('');
	test.ok(lexer.end());
	test.done();
};

module.exports.testWhiteSpace = function (test) {
	var lexer = createLexer('');
	test.ok(lexer.end());
	test.done();
};


function testKeyword(keyword) {
	return function (test) {
		var lexer = createLexer(keyword);
		test.ok(lexer.getCurrent() === 'keyword:' + keyword);
		test.ok(lexer.getLabel() === keyword);
		test.ok(lexer.next() === 'end');
		test.done();
	};
}

module.exports.testNullKeyword = testKeyword('null');
module.exports.testUndefinedKeyword = testKeyword('undefined');
module.exports.testTrueKeyword = testKeyword('true');
module.exports.testFalseKeyword = testKeyword('false');
module.exports.testNotKeyword = testKeyword('not');
module.exports.testAndKeyword = testKeyword('and');
module.exports.testOrKeyword = testKeyword('or');
module.exports.testXorKeyword = testKeyword('xor');
module.exports.testFixKeyword = testKeyword('fix');
module.exports.testThisKeyword = testKeyword('this');
module.exports.testNewKeyword = testKeyword('new');
module.exports.testBoolKeyword = testKeyword('bool');
module.exports.testUnknownKeyword = testKeyword('unknown');
module.exports.testIntKeyword = testKeyword('int');
module.exports.testFloatKeyword = testKeyword('float');
module.exports.testStringKeyword = testKeyword('string');
module.exports.testRegexKeyword = testKeyword('regex');
module.exports.testLetKeyword = testKeyword('let');
module.exports.testInKeyword = testKeyword('in');
module.exports.testIfKeyword = testKeyword('if');
module.exports.testThenKeyword = testKeyword('then');
module.exports.testElseKeyword = testKeyword('else');
module.exports.testThrowKeyword = testKeyword('throw');
module.exports.testTryKeyword = testKeyword('try');
module.exports.testCatchKeyword = testKeyword('catch');
module.exports.testFinallyKeyword = testKeyword('finally');
module.exports.testErrorKeyword = testKeyword('error');
