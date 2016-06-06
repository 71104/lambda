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
module.exports.testTrueLiteral = testSet('true', []);
module.exports.testFalseLiteral = testSet('false', []);
module.exports.testIntegerLiteral = testSet('123', []);
module.exports.testRealLiteral = testSet('3.14', []);
module.exports.testComplexLiteral = testSet('5i', []);
module.exports.testStringLiteral = testSet('"hello"', []);

module.exports.testArray1 = testSet('{}', []);
module.exports.testArray2 = testSet('{0}', []);
module.exports.testArray3 = testSet('{0, 1}', []);
module.exports.testArray4 = testSet('{x}', ['x']);
module.exports.testArray5 = testSet('{x, y}', ['x', 'y']);

module.exports.testVariable = testSet('blahblah', ['blahblah']);
module.exports.testFix = testSet('fix', []);
module.exports.testError = testSet('error', ['error']);

module.exports.testField1 = testSet('x.y', ['x']);
module.exports.testField2 = testSet('x.y.z', ['x']);
module.exports.testSubscript = testSet('x[y]', ['x', 'y']);
module.exports.testLambda1 = testSet('fn x -> x', []);
module.exports.testLambda2 = testSet('fn x -> y', ['y']);
module.exports.testLambda3 = testSet('fn x, y -> x', []);
module.exports.testLambda4 = testSet('fn x, y -> y', []);
module.exports.testLambda5 = testSet('fn x, y -> z', ['z']);
module.exports.testApplication = testSet('x y', ['x', 'y']);
module.exports.testLet1 = testSet('let x = y in z', ['y', 'z']);
module.exports.testLet2 = testSet('let x = y in x', ['y']);
module.exports.testLet3 = testSet('let x = x in y', ['x', 'y']);
module.exports.testIf = testSet('if x then y else z', ['x', 'y', 'z']);
module.exports.testThrow = testSet('throw x', ['x']);
module.exports.testTryCatch1 = testSet('try x catch y', ['x', 'y']);
module.exports.testTryCatch2 = testSet('try x catch error', ['x']);
module.exports.testTryCatch3 = testSet('try error catch x', ['error', 'x']);
