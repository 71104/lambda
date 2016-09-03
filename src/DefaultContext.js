exports.DefaultContext = DefaultContext = {};

DefaultContext.TYPES = Context.EMPTY.addAll({
  'typeof': new LambdaType(new VariableType('T'), StringType.DEFAULT),
  'not': new LambdaType(BooleanType.DEFAULT, BooleanType.DEFAULT),
});

DefaultContext.VALUES = Context.EMPTY.addAll({
  'typeof': Closure.fromFunction(function (value) {
    return new StringValue(characterToString(value.character));
  }),
  'not': Closure.fromFunction(function (x) {
    if (x.is(BooleanValue)) {
      return new BooleanValue(!x.value);
    } else {
      throw new LambdaRuntimeError();
    }
  }),
  '+': Operators.make('+'),
  '-': Operators.make('-'),
  '*': Operators.make('*'),
  '/': Operators.make('/'),
  '%': Operators.make('%'),
  '**': Operators.make('**'),
});
