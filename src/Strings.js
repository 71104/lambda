StringType.prototype.context = StringType.prototype.context.addAll({
  length: NaturalType.DEFAULT,
  str: StringType.DEFAULT,
  startsWith: new LambdaType(StringType.DEFAULT, new LambdaType(StringType.DEFAULT, BooleanType.DEFAULT)),
  endsWith: new LambdaType(StringType.DEFAULT, new LambdaType(StringType.DEFAULT, BooleanType.DEFAULT)),
  trim: new LambdaType(StringType.DEFAULT, StringType.DEFAULT),
  trimLeft: new LambdaType(StringType.DEFAULT, StringType.DEFAULT),
  trimRight: new LambdaType(StringType.DEFAULT, StringType.DEFAULT),
  reverse: new LambdaType(StringType.DEFAULT, StringType.DEFAULT),
});

StringValue.prototype.context = StringValue.prototype.context.addAll({
  length: Closure.fromMethod(function () {
    return this.length;
  }),
  str: Closure.fromMethod(function () {
    return this.toString();
  }),
  startsWith: Closure.fromMethod(function (string) {
    return this.startsWith(string);
  }),
  endsWith: Closure.fromMethod(function (string) {
    return this.endsWith(string);
  }),
  trim: Closure.fromMethod(function () {
    return this.trim();
  }),
  trimLeft: Closure.fromMethod(function () {
    return this.trimLeft();
  }),
  trimRight: Closure.fromMethod(function () {
    return this.trimRight();
  }),
  reverse: Closure.fromMethod(function () {
    return this.split('').reverse().join('');
  }),
});
