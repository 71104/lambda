var Lambda = require('../bin/lambda.js');

function parse(text) {
  return (new Lambda.Parser(text)).parse();
}

module.exports.testUndefined = function (test) {
  var ast = parse('undefined');
  test.ok(ast.is(Lambda.LiteralNode));
  test.ok(ast.value.is(Lambda.UndefinedValue));
  test.done();
};

module.exports.testNull = function (test) {
  var ast = parse('null');
  test.ok(ast.is(Lambda.LiteralNode));
  test.ok(ast.value.is(Lambda.NullValue));
  test.done();
};

module.exports.testTrue = function (test) {
  var ast = parse('true');
  test.ok(ast.is(Lambda.LiteralNode));
  test.ok(ast.value.is(Lambda.BooleanValue));
  test.ok(ast.value.value === true);
  test.done();
};

module.exports.testFalse = function (test) {
  var ast = parse('false');
  test.ok(ast.is(Lambda.LiteralNode));
  test.ok(ast.value.is(Lambda.BooleanValue));
  test.ok(ast.value.value === false);
  test.done();
};

module.exports.testInteger = function (test) {
  var ast = parse('1');
  test.ok(ast.is(Lambda.LiteralNode));
  test.ok(ast.value.is(Lambda.NaturalValue));
  test.ok(ast.value.value === 1);
  test.done();
};

module.exports.testComplex = function (test) {
  var ast = parse('3i');
  test.ok(ast.is(Lambda.LiteralNode));
  test.ok(ast.value.is(Lambda.ComplexValue));
  test.ok(ast.value.real === 0);
  test.ok(ast.value.imaginary === 3);
  test.done();
};

module.exports.testReal = function (test) {
  var ast = parse('3.14');
  test.ok(ast.is(Lambda.LiteralNode));
  test.ok(ast.value.is(Lambda.RealValue));
  test.ok(ast.value.value === 3.14);
  test.done();
};

module.exports.testString = function (test) {
  var ast = parse('"hello"');
  test.ok(ast.is(Lambda.LiteralNode));
  test.ok(ast.value.is(Lambda.StringValue));
  test.ok(ast.value.value === 'hello');
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

module.exports.testVariable3 = function (test) {
  var ast = parse('+');
  test.ok(ast.is(Lambda.VariableNode));
  test.ok(ast.name === '+');
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

module.exports.testFieldAccess3 = function (test) {
  var ast = parse('x.then');
  test.ok(ast.is(Lambda.FieldAccessNode));
  test.ok(ast.name === 'then');
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

module.exports.testArray1 = function (test) {
  var ast = parse('{}');
  test.ok(ast.is(Lambda.ArrayLiteralNode));
  test.ok(ast.expressions.length === 0);
  test.done();
};

module.exports.testArray2 = function (test) {
  var ast = parse('{x}');
  test.ok(ast.is(Lambda.ArrayLiteralNode));
  test.ok(ast.expressions.length === 1);
  test.ok(ast.expressions[0].is(Lambda.VariableNode));
  test.ok(ast.expressions[0].name === 'x');
  test.done();
};

module.exports.testArray3 = function (test) {
  var ast = parse('{y, z}');
  test.ok(ast.is(Lambda.ArrayLiteralNode));
  test.ok(ast.expressions.length === 2);
  test.ok(ast.expressions[0].is(Lambda.VariableNode));
  test.ok(ast.expressions[0].name === 'y');
  test.ok(ast.expressions[1].is(Lambda.VariableNode));
  test.ok(ast.expressions[1].name === 'z');
  test.done();
};

module.exports.testArrayWithTrailingComma1 = function (test) {
  var ast = parse('{0, }');
  test.ok(ast.is(Lambda.ArrayLiteralNode));
  test.ok(ast.expressions.length === 1);
  test.ok(ast.expressions[0].is(Lambda.LiteralNode));
  test.ok(ast.expressions[0].value.value === 0);
  test.done();
};

module.exports.testArrayWithTrailingComma2 = function (test) {
  var ast = parse('{1, 2, }');
  test.ok(ast.is(Lambda.ArrayLiteralNode));
  test.ok(ast.expressions.length === 2);
  test.ok(ast.expressions[0].is(Lambda.LiteralNode));
  test.ok(ast.expressions[0].value.value === 1);
  test.ok(ast.expressions[1].is(Lambda.LiteralNode));
  test.ok(ast.expressions[1].value.value === 2);
  test.done();
};

module.exports.testSubscript1 = function (test) {
  var ast = parse('x[0]');
  test.ok(ast.is(Lambda.SubscriptNode));
  test.ok(ast.expression.is(Lambda.VariableNode));
  test.ok(ast.expression.name === 'x');
  test.ok(ast.index.is(Lambda.LiteralNode));
  test.done();
};

module.exports.testSubscript2 = function (test) {
  var ast = parse('0[x]');
  test.ok(ast.is(Lambda.SubscriptNode));
  test.ok(ast.expression.is(Lambda.LiteralNode));
  test.ok(ast.index.is(Lambda.VariableNode));
  test.ok(ast.index.name === 'x');
  test.done();
};

module.exports.testPolymorphicLambda1 = function (test) {
  var ast = parse('fn x -> y');
  test.ok(ast.is(Lambda.LambdaNode));
  test.ok(ast.name === 'x');
  test.ok(ast.body.is(Lambda.VariableNode));
  test.ok(ast.body.name === 'y');
  test.done();
};

module.exports.testPolymorphicLambda2 = function (test) {
  var ast = parse('fn y -> x');
  test.ok(ast.is(Lambda.LambdaNode));
  test.ok(ast.name === 'y');
  test.ok(ast.body.is(Lambda.VariableNode));
  test.ok(ast.body.name === 'x');
  test.done();
};

module.exports.testMultiplePolymorphicLambda1 = function (test) {
  var ast = parse('fn x, y -> 0');
  test.ok(ast.is(Lambda.LambdaNode));
  test.ok(ast.name === 'x');
  test.ok(ast.body.is(Lambda.LambdaNode));
  test.ok(ast.body.name === 'y');
  test.ok(ast.body.body.is(Lambda.LiteralNode));
  test.ok(ast.body.body.value.is(Lambda.NaturalValue));
  test.ok(ast.body.body.value.value === 0);
  test.done();
};

module.exports.testMultiplePolymorphicLambda2 = function (test) {
  var ast = parse('fn y, x -> false');
  test.ok(ast.is(Lambda.LambdaNode));
  test.ok(ast.name === 'y');
  test.ok(ast.body.is(Lambda.LambdaNode));
  test.ok(ast.body.name === 'x');
  test.ok(ast.body.body.is(Lambda.LiteralNode));
  test.ok(ast.body.body.value.is(Lambda.BooleanValue));
  test.ok(ast.body.body.value.value === false);
  test.done();
};

module.exports.testIf1 = function (test) {
  var ast = parse('if x then y else z');
  test.ok(ast.is(Lambda.IfNode));
  test.ok(ast.condition.is(Lambda.VariableNode));
  test.ok(ast.condition.name === 'x');
  test.ok(ast.thenExpression.is(Lambda.VariableNode));
  test.ok(ast.thenExpression.name === 'y');
  test.ok(ast.elseExpression.is(Lambda.VariableNode));
  test.ok(ast.elseExpression.name === 'z');
  test.done();
};

module.exports.testIf2 = function (test) {
  var ast = parse('if 0 then 5i else "hello"');
  test.ok(ast.is(Lambda.IfNode));
  test.ok(ast.condition.is(Lambda.LiteralNode));
  test.ok(ast.condition.value.is(Lambda.NaturalValue));
  test.ok(ast.condition.value.value === 0);
  test.ok(ast.thenExpression.is(Lambda.LiteralNode));
  test.ok(ast.thenExpression.value.is(Lambda.ComplexValue));
  test.ok(ast.thenExpression.value.real === 0);
  test.ok(ast.thenExpression.value.imaginary === 5);
  test.ok(ast.elseExpression.is(Lambda.LiteralNode));
  test.ok(ast.elseExpression.value.is(Lambda.StringValue));
  test.ok(ast.elseExpression.value.value === 'hello');
  test.done();
};

module.exports.testNestedIfs = function (test) {
  var ast = parse('if if a then b else c then if d then e else f else if g then h else i');
  test.ok(ast.is(Lambda.IfNode));
  test.ok(ast.condition.is(Lambda.IfNode));
  test.ok(ast.condition.condition.is(Lambda.VariableNode));
  test.ok(ast.condition.condition.name === 'a');
  test.ok(ast.condition.thenExpression.is(Lambda.VariableNode));
  test.ok(ast.condition.thenExpression.name === 'b');
  test.ok(ast.condition.elseExpression.is(Lambda.VariableNode));
  test.ok(ast.condition.elseExpression.name === 'c');
  test.ok(ast.thenExpression.is(Lambda.IfNode));
  test.ok(ast.thenExpression.condition.is(Lambda.VariableNode));
  test.ok(ast.thenExpression.condition.name === 'd');
  test.ok(ast.thenExpression.thenExpression.is(Lambda.VariableNode));
  test.ok(ast.thenExpression.thenExpression.name === 'e');
  test.ok(ast.thenExpression.elseExpression.is(Lambda.VariableNode));
  test.ok(ast.thenExpression.elseExpression.name === 'f');
  test.ok(ast.elseExpression.is(Lambda.IfNode));
  test.ok(ast.elseExpression.condition.is(Lambda.VariableNode));
  test.ok(ast.elseExpression.condition.name === 'g');
  test.ok(ast.elseExpression.thenExpression.is(Lambda.VariableNode));
  test.ok(ast.elseExpression.thenExpression.name === 'h');
  test.ok(ast.elseExpression.elseExpression.is(Lambda.VariableNode));
  test.ok(ast.elseExpression.elseExpression.name === 'i');
  test.done();
};

module.exports.testApplication1 = function (test) {
  var ast = parse('x y');
  test.ok(ast.is(Lambda.ApplicationNode));
  test.ok(ast.left.is(Lambda.VariableNode));
  test.ok(ast.left.name === 'x');
  test.ok(ast.right.is(Lambda.VariableNode));
  test.ok(ast.right.name === 'y');
  test.done();
};

module.exports.testApplication2 = function (test) {
  var ast = parse('y x');
  test.ok(ast.is(Lambda.ApplicationNode));
  test.ok(ast.left.is(Lambda.VariableNode));
  test.ok(ast.left.name === 'y');
  test.ok(ast.right.is(Lambda.VariableNode));
  test.ok(ast.right.name === 'x');
  test.done();
};
