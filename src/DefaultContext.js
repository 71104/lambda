var DefaultContext = {};

exports.DefaultContext = DefaultContext;

DefaultContext.TYPES = Context.EMPTY.addAll({
  'typeof': new LambdaType(new VariableType('T'), StringType.DEFAULT),
  'not': new LambdaType(BooleanType.DEFAULT, BooleanType.DEFAULT),
  'and': new LambdaType(BooleanType.DEFAULT, new LambdaType(BooleanType.DEFAULT, BooleanType.DEFAULT)),
  'or': new LambdaType(BooleanType.DEFAULT, new LambdaType(BooleanType.DEFAULT, BooleanType.DEFAULT)),
  'xor': new LambdaType(BooleanType.DEFAULT, new LambdaType(BooleanType.DEFAULT, BooleanType.DEFAULT)),
  'seq': new LambdaType(UndefinedType.DEFAULT, UnknownType.DEFAULT),
  'range': new LambdaType(NaturalType.DEFAULT, new ListType(NaturalType.DEFAULT)),
  'new': new LambdaType(new LambdaType(UndefinedType.DEFAULT, new VariableType('T')), new VariableType('T')),
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
  '|': Operators.make('|'),
  '^': Operators.make('^'),
  '*': Operators.make('*'),
  '/': Operators.make('/'),
  '%': Operators.make('%'),
  '&': Operators.make('&'),
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
  'and': Operators.make('and'),
  'or': Operators.make('or'),
  'xor': Operators.make('xor'),
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
  'new': Closure.fromFunction(function (constructor) {
    if (constructor.is(Closure)) {
      return constructor.bind(UndefinedValue.DEFAULT);
    } else {
      throw new LambdaRuntimeError('argument of \'new\' must be a closure');
    }
  }),
  'JavaScript': UndefinedValue.DEFAULT
      .extend('UNDEFINED', JSUndefinedValue.DEFAULT)
      .extend('NULL', JSNullValue.DEFAULT),
});
