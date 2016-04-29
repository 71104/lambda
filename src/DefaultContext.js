function DefaultContext() {
  function evaluate(Operator) {
    return (new Operator()).evaluate(Context.EMPTY);
  }

  var seq = (new ApplicationNode(
    FixNode.INSTANCE,
    new LambdaNode('f', null, new LambdaNode('x', null, new VariableNode('f')))
  )).evaluate(Context.EMPTY);

  Context.call(this, {
    'typeof': evaluate(TypeOfOperator),
    'not': evaluate(NotOperator),
    'seq': seq,
    '+': evaluate(PlusOperator),
    '-': evaluate(MinusOperator),
    '*': evaluate(MultiplyOperator),
    '/': evaluate(DivideOperator),
    '**': evaluate(PowerOperator),
    '%': evaluate(ModulusOperator),
    '<': evaluate(LessThanOperator),
    '<=': evaluate(LessThanOrEqualOperator),
    '>': evaluate(GreaterThanOperator),
    '>=': evaluate(GreaterThanOrEqualOperator),
    '<<': evaluate(LeftShiftOperator),
    '>>': evaluate(RightShiftOperator),
    '=': evaluate(ComparisonOperator),
    '!=': evaluate(NegatedComparisonOperator),
    'and': evaluate(AndOperator),
    'or': evaluate(OrOperator),
    'xor': evaluate(XorOperator)
  });
}

exports.DefaultContext = DefaultContext;

DefaultContext.prototype = Object.create(Context.prototype);
