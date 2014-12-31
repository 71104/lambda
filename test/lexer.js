var Lambda = require('../bin/lambda.js');

function testTokens(string, tokens) {
	return function (test) {
		var lexer = new Lambda.Lexer(string);
		tokens.forEach(function (token) {
			test.ok(!lexer.end());
			if (typeof token === 'string') {
				test.ok(lexer.token() === token);
			} else {
				test.ok(lexer.token() === token.type);
				test.ok(lexer.label() === token.label);
			}
			lexer.next();
		});
		test.ok(lexer.end());
		test.ok(lexer.token() === 'end');
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
module.exports.testNotKeyword = testTokens('typeof', ['keyword:typeof']);
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
module.exports.testFloatKeyword = testTokens('complex', ['keyword:complex']);
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
module.exports.testThrowsKeyword = testTokens('throws', ['keyword:throws']);

module.exports.testIdentifier1 = testTokens('a', [{type: 'identifier', label: 'a'}]);
module.exports.testIdentifier2 = testTokens('_', [{type: 'identifier', label: '_'}]);
module.exports.testIdentifier1 = testTokens('bc', [{type: 'identifier', label: 'bc'}]);
module.exports.testIdentifier3 = testTokens('d0', [{type: 'identifier', label: 'd0'}]);
module.exports.testIdentifier4 = testTokens('e_1', [{type: 'identifier', label: 'e_1'}]);
module.exports.testIdentifier5 = testTokens('f2_', [{type: 'identifier', label: 'f2_'}]);
module.exports.testIdentifier6 = testTokens('g3h', [{type: 'identifier', label: 'g3h'}]);
module.exports.testIdentifier7 = testTokens('_null', [{type: 'identifier', label: '_null'}]);
module.exports.testIdentifier8 = testTokens('null0', [{type: 'identifier', label: 'null0'}]);
module.exports.testIdentifier9 = testTokens('nullary', [{type: 'identifier', label: 'nullary'}]);

module.exports.testArrow = testTokens('->', ['arrow']);
module.exports.testFatArrow = testTokens('=>', ['fat-arrow']);
module.exports.testComma = testTokens(',', ['comma']);
module.exports.testPoint = testTokens('.', ['point']);
module.exports.testColon = testTokens(':', ['colon']);
module.exports.testLeft = testTokens('(', ['left']);
module.exports.testRight = testTokens(')', ['right']);
module.exports.testLeftSquare = testTokens('[', ['left-square']);
module.exports.testRightSquare = testTokens(']', ['right-square']);

module.exports.testComplex1 = testTokens('0i', [{type: 'complex', label: 0}]);
module.exports.testComplex2 = testTokens('2i', [{type: 'complex', label: 2}]);
module.exports.testComplex3 = testTokens('489i', [{type: 'complex', label: 489}]);
module.exports.testComplex4 = testTokens('0.0i', [{type: 'complex', label: 0}]);
module.exports.testComplex5 = testTokens('3.14i', [{type: 'complex', label: 3.14}]);
module.exports.testComplex6 = testTokens('10.0i', [{type: 'complex', label: 10}]);
module.exports.testComplex7 = testTokens('578.000i', [{type: 'complex', label: 578}]);
module.exports.testComplex8 = testTokens('214.030i', [{type: 'complex', label: 214.03}]);
module.exports.testComplex9 = testTokens('923.657i', [{type: 'complex', label: 923.657}]);
module.exports.testNonComplex = testTokens('i', [{type: 'identifier', label: 'i'}]);

module.exports.testFloat1 = testTokens('0.0', [{type: 'float', label: 0}]);
module.exports.testFloat2 = testTokens('3.14', [{type: 'float', label: 3.14}]);
module.exports.testFloat3 = testTokens('10.0', [{type: 'float', label: 10}]);
module.exports.testFloat4 = testTokens('578.000', [{type: 'float', label: 578}]);
module.exports.testFloat5 = testTokens('214.030', [{type: 'float', label: 214.03}]);
module.exports.testFloat6 = testTokens('923.657', [{type: 'float', label: 923.657}]);

module.exports.testInteger1 = testTokens('0', [{type: 'integer', label: 0}]);
module.exports.testInteger2 = testTokens('2', [{type: 'integer', label: 2}]);
module.exports.testInteger3 = testTokens('489', [{type: 'integer', label: 489}]);

module.exports.testEmptyString = testTokens('""', [{type: 'string', label: ''}]);
module.exports.testString = testTokens('"hello"', [{type: 'string', label: 'hello'}]);
module.exports.testStringWithEscapes1 = testTokens('"hel\\"lo"', [{type: 'string', label: 'hel"lo'}]);
module.exports.testStringWithEscapes2 = testTokens('"hel\\nlo"', [{type: 'string', label: 'hel\nlo'}]);
module.exports.testStringWithEscapes3 = testTokens('"hel\\\\lo"', [{type: 'string', label: 'hel\\lo'}]);
