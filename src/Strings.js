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
  length: Closure.fromFunction(function (value) {
    return new NaturalValue(value.value.length);
  }),
  str: Closure.fromFunction(function (value) {
    return value;
  }),
  startsWith: Closure.fromFunction(function (value, string) {
    return new StringValue(value.value.startsWith(string.value));
  }),
  endsWith: Closure.fromFunction(function (value, string) {
    return new StringValue(value.value.endsWith(string.value));
  }),
  trim: Closure.fromFunction(function (value) {
    return new StringValue(value.value.trim());
  }),
  trimLeft: Closure.fromFunction(function (value) {
    return new StringValue(value.value.trimLeft());
  }),
  trimRight: Closure.fromFunction(function (value) {
    return new StringValue(value.value.trimRight());
  }),
  reverse: Closure.fromFunction(function (value) {
    return new StringValue(value.value.split('').reverse().join(''));
  }),
});
