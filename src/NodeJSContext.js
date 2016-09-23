var NodeJSContext = {};

exports.NodeJSContext = NodeJSContext;

NodeJSContext.TYPES = DefaultContext.TYPES.addAll({
  'module': UnknownType.DEFAULT,
  'require': new LambdaType(StringType.DEFAULT, UnknownType.DEFAULT),
});

NodeJSContext.VALUES = DefaultContext.VALUES.addAll({
  'module': AbstractValue.unmarshal(module),
  'require': Closure.fromFunction(function (name) {
    if (name.is(StringValue)) {
      return AbstractValue.unmarshal(require(name.value));
    } else {
      throw new LambdaRuntimeError('argument of \'require\' must be a string');
    }
  }),
});
