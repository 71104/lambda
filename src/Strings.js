StringType.prototype.context = StringType.prototype.context.addAll({
  length: NaturalType.DEFAULT,
  str: StringType.DEFAULT,
  startsWith: new LambdaType(StringType.DEFAULT, new LambdaType(StringType.DEFAULT, BooleanType.DEFAULT)),
  endsWith: new LambdaType(StringType.DEFAULT, new LambdaType(StringType.DEFAULT, BooleanType.DEFAULT)),
  trim: new LambdaType(StringType.DEFAULT, StringType.DEFAULT),
  trimLeft: new LambdaType(StringType.DEFAULT, StringType.DEFAULT),
  trimRight: new LambdaType(StringType.DEFAULT, StringType.DEFAULT),
});

StringValue.prototype.context = StringValue.prototype.context.addAll({
  length: Closure.fromFunction(function () {
    return this.length;
  }),
  str: Closure.fromFunction(function () {
    return this.toString();
  }),
  startsWith: Closure.fromFunction(function (string) {
    return this.startsWith(string);
  }),
  endsWith: Closure.fromFunction(function (string) {
    return this.endsWith(string);
  }),
  trim: Closure.fromFunction(function () {
    return this.trim();
  }),
  trimLeft: Closure.fromFunction(function () {
    return this.trimLeft();
  }),
  trimRight: Closure.fromFunction(function () {
    return this.trimRight();
  }),
});
