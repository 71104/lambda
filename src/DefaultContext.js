exports.DefaultContext = DefaultContext = {};

DefaultContext.TYPES = Context.EMPTY.addAll({
  'typeof': new LambdaType(new VariableType('T'), StringType.DEFAULT),
  'not': new LambdaType(BooleanType.DEFAULT, BooleanType.DEFAULT),
  'and': new LambdaType(BooleanType.DEFAULT, new LambdaType(BooleanType.DEFAULT, BooleanType.DEFAULT)),
  'or': new LambdaType(BooleanType.DEFAULT, new LambdaType(BooleanType.DEFAULT, BooleanType.DEFAULT)),
});

DefaultContext.VALUES = Context.EMPTY.addAll({
  'typeof': Closure.fromFunction(function (value) {
    return new StringValue(characterToString(value.character));
  }),
  '+': Operators.make('+'),
  '-': Operators.make('-'),
  '*': Operators.make('*'),
  '/': Operators.make('/'),
  '%': Operators.make('%'),
  '**': Operators.make('**'),
  'not': Closure.fromFunction(function (x) {
    if (x.is(BooleanValue)) {
      return new BooleanValue(!x.value);
    } else {
      throw new LambdaRuntimeError();
    }
  }),
  'and': Closure.fromFunction(function (x, y) {
    if (x.is(BooleanValue) && y.is(BooleanValue)) {
      return new BooleanValue(x.value && y.value);
    } else {
      throw new LambdaRuntimeError();
    }
  }),
  'or': Closure.fromFunction(function (x, y) {
    if (x.is(BooleanValue) && y.is(BooleanValue)) {
      return new BooleanValue(x.value || y.value);
    } else {
      throw new LambdaRuntimeError();
    }
  }),
});
