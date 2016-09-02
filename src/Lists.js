ListType.prototype.context = ListType.prototype.context.addAll({
  length: NaturalType.DEFAULT,

  reverse: new ForEachType('T',
    new LambdaType(
      new ListType(
        new VariableType('T')),
      new ListType(
        new VariableType('T')))),

  sort: new ForEachType('T',
    new LambdaType(
      new ListType(
        new VariableType('T')),
      new LambdaType(
        new LambdaType(
          new VariableType('T'),
          new LambdaType(
            new VariableType('T'), BooleanType.DEFAULT)),
        new ListType(
          new VariableType('T'))))),

  map: new ForEachType('A',
      new ForEachType('B',
        new LambdaType(
          new ListType(
            new VariableType('A')),
          new LambdaType(
            new LambdaType(
              new VariableType('A'),
              new VariableType('B')),
            new ListType(
              new VariableType('B')))))),

  filter: new ForEachType('T',
      new LambdaType(
        new ListType(
          new VariableType('T')),
        new LambdaType(
          new LambdaType(
            new VariableType('T'), BooleanType.DEFAULT),
          new ListType(
            new VariableType('T'))))),

});


ListValue.prototype.context = ListValue.prototype.context.addAll({
  length: Closure.fromFunction(function (list) {
    return new NaturalValue(list.values.length);
  }),
  reverse: Closure.fromFunction(function (list) {
    return new ListValue(list.values.reverse());
  }),
  sort: Closure.fromFunction(function (list, lambda) {
    var compare = function (a, b) {
      var result = lambda.apply(a, b);
      if (result.is(BooleanValue)) {
        return result.value;
      } else {
        throw new LambdaRuntimeError();
      }
    };
    return new ListValue(list.values.sort(function (a, b) {
      if (!compare(a, b)) {
        return 1;
      } else if (!compare(b, a)) {
        return -1;
      } else {
        return 0;
      }
    }));
  }),
  map: Closure.fromFunction(function (list, callback) {
    return new ListValue(list.values.map(function (element) {
      return callback.apply(element);
    }));
  }),
  filter: Closure.fromFunction(function (list, callback) {
    return new ListValue(list.values.filter(function (element) {
      var result = callback.apply(element);
      if (result.is(BooleanValue)) {
        return result.value;
      } else {
        throw new LambdaRuntimeError();
      }
    }));
  }),
});
