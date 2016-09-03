exports.DefaultContext = DefaultContext = {};

DefaultContext.TYPES = Context.EMPTY.addAll({
  'typeof': new LambdaType(new VariableType('T'), StringType.DEFAULT),
});

DefaultContext.VALUES = Context.EMPTY.addAll({
  'typeof': Closure.fromFunction(function (value) {
    return new StringValue(characterToString(value.character));
  }),
});
