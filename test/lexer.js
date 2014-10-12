var Lambda = require('../bin/lambda.js');

function testTokens(string, tokens) {
	return function (test) {
		var lexer = new Lambda.Lexer(string);
		tokens.forEach(function (token) {
			test.ok(!lexer.end());
			if (typeof token === 'string') {
				test.ok(lexer.getCurrent() === token);
			} else {
				test.ok(lexer.getCurrent() === token.type);
				test.ok(lexer.getLabel() === token.label);
			}
			lexer.next();
		});
		test.ok(lexer.end());
		test.ok(lexer.getCurrent() === 'end');
		test.done();
	};
}

module.exports.testEmpty = testTokens('', []);
module.exports.testWhiteSpace1 = testTokens(' ', []);
module.exports.testWhiteSpace2 = testTokens('\t', []);
module.exports.testWhiteSpace3 = testTokens('\n', []);
module.exports.testWhiteSpace4 = testTokens(' \t\n', []);

module.exports.testNullKeyword = testTokens('null', ['keyword:null']);
module.exports.testUndefinedKeyword = testTokens('undefined', ['keyword:undefined']);
module.exports.testTrueKeyword = testTokens('true', ['keyword:true']);
module.exports.testFalseKeyword = testTokens('false', ['keyword:false']);
module.exports.testNotKeyword = testTokens('not', ['keyword:not']);
module.exports.testAndKeyword = testTokens('and', ['keyword:and']);
module.exports.testOrKeyword = testTokens('or', ['keyword:or']);
module.exports.testXorKeyword = testTokens('xor', ['keyword:xor']);
module.exports.testFixKeyword = testTokens('fix', ['keyword:fix']);
module.exports.testThisKeyword = testTokens('this', ['keyword:this']);
module.exports.testNewKeyword = testTokens('new', ['keyword:new']);
module.exports.testBoolKeyword = testTokens('bool', ['keyword:bool']);
module.exports.testUnknownKeyword = testTokens('unknown', ['keyword:unknown']);
module.exports.testIntKeyword = testTokens('int', ['keyword:int']);
module.exports.testFloatKeyword = testTokens('float', ['keyword:float']);
module.exports.testStringKeyword = testTokens('string', ['keyword:string']);
module.exports.testRegexKeyword = testTokens('regex', ['keyword:regex']);
module.exports.testLetKeyword = testTokens('let', ['keyword:let']);
module.exports.testInKeyword = testTokens('in', ['keyword:in']);
module.exports.testIfKeyword = testTokens('if', ['keyword:if']);
module.exports.testThenKeyword = testTokens('then', ['keyword:then']);
module.exports.testElseKeyword = testTokens('else', ['keyword:else']);
module.exports.testThrowKeyword = testTokens('throw', ['keyword:throw']);
module.exports.testTryKeyword = testTokens('try', ['keyword:try']);
module.exports.testCatchKeyword = testTokens('catch', ['keyword:catch']);
module.exports.testFinallyKeyword = testTokens('finally', ['keyword:finally']);
module.exports.testErrorKeyword = testTokens('error', ['keyword:error']);
