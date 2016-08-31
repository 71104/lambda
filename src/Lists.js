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
          new VariableType('T')),
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
  length: Closure.fromMethod(function () {
    return this.length;
  }),
  reverse: Closure.fromMethod(function () {
    return this.reverse();
  }),
  sort: Closure.fromMethod(function (compare) {
    return this.sort(function (a, b) {
      if (!compare(a, b)) {
        return 1;
      } else if (!compare(b, a)) {
        return -1;
      } else {
        return 0;
      }
    });
  }),
  map: Closure.fromMethod(function (callback) {
    return this.map(function (element) {
      return callback(element);
    });
  }),
  filter: Closure.fromMethod(function (callback) {
    return this.filter(function (element) {
      return callback(element);
    });
  }),
});
