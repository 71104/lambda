function DefaultContext() {
  function evaluate(Operator) {
    return (new Operator()).evaluate(Context.EMPTY);
  }

  var seq = (new ApplicationNode(
    FixNode.INSTANCE,
    new LambdaNode('f', null, new LambdaNode('x', null, new VariableNode('f')))
  )).evaluate(Context.EMPTY);

  var hash = Object.create(null);
  hash.typeof = evaluate(TypeOfOperator);
  hash.not = evaluate(NotOperator);
  hash.seq = seq;
  hash['+'] = evaluate(PlusOperator);
  hash['-'] = evaluate(MinusOperator);
  hash['*'] = evaluate(MultiplyOperator);
  hash['/'] = evaluate(DivideOperator);
  hash['**'] = evaluate(PowerOperator);
  hash['%'] = evaluate(ModulusOperator);
  hash['<'] = evaluate(LessThanOperator);
  hash['<='] = evaluate(LessThanOrEqualOperator);
  hash['>'] = evaluate(GreaterThanOperator);
  hash['>='] = evaluate(GreaterThanOrEqualOperator);
  hash['<<'] = evaluate(LeftShiftOperator);
  hash['>>'] = evaluate(RightShiftOperator);
  hash['='] = evaluate(ComparisonOperator);
  hash['!='] = evaluate(NegatedComparisonOperator);
  hash.and = evaluate(AndOperator);
  hash.or = evaluate(OrOperator);
  hash.xor = evaluate(XorOperator);

  Context.call(this, hash);
}

exports.DefaultContext = DefaultContext;

DefaultContext.prototype = Object.create(Context.prototype);
