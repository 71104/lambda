exports.DefaultContext = DefaultContext = {};

DefaultContext.TYPES = Context.EMPTY.addAll({
  'typeof': new LambdaType(new VariableType('T'), StringType.DEFAULT),
  'not': new LambdaType(BooleanType.DEFAULT, BooleanType.DEFAULT),
  'and': new LambdaType(BooleanType.DEFAULT, new LambdaType(BooleanType.DEFAULT, BooleanType.DEFAULT)),
  'or': new LambdaType(BooleanType.DEFAULT, new LambdaType(BooleanType.DEFAULT, BooleanType.DEFAULT)),
  'xor': new LambdaType(BooleanType.DEFAULT, new LambdaType(BooleanType.DEFAULT, BooleanType.DEFAULT)),
  'seq': new LambdaType(UndefinedType.DEFAULT, UnknownType.DEFAULT),
  'range': new LambdaType(NaturalType.DEFAULT, new ListType(NaturalType.DEFAULT)),
  'JavaScript': UndefinedType.DEFAULT
      .extend('UNDEFINED', JSUndefinedType.DEFAULT)
      .extend('NULL', JSNullType.DEFAULT),
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
  '=': Operators.make('='),
  '!=': Operators.make('!='),
  '<': Operators.make('<'),
  '>': Operators.make('>'),
  '<=': Operators.make('<='),
  '>=': Operators.make('>='),
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
  'xor': Closure.fromFunction(function (x, y) {
    if (x.is(BooleanValue) && y.is(BooleanValue)) {
      return new BooleanValue(x.value != y.value);
    } else {
      throw new LambdaRuntimeError();
    }
  }),
  'seq': (new ApplicationNode(FixNode.INSTANCE,
        new LambdaNode('f', null,
          new LambdaNode('x', null,
            new VariableNode('f'))))).evaluate(Context.EMPTY),
  'range': Closure.fromFunction(function (count) {
    if (count.is(NaturalValue)) {
      var values = [];
      for (var i = 0; i < count; i++) {
        values.push(new NaturalValue(i));
      }
      return new ListValue(values);
    } else {
      throw new LambdaRuntimeError();
    }
  }),
  'JavaScript': UndefinedValue.DEFAULT
      .extend('UNDEFINED', JSUndefinedValue.DEFAULT)
      .extend('NULL', JSNullValue.DEFAULT),
});
