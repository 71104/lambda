StringType.prototype.context = StringType.prototype.context.addAll({
  substring: new LambdaType(
    NaturalType.INSTANCE,
    new LambdaType(
      NaturalType.INSTANCE,
      StringType.INSTANCE)),
  prefix: new LambdaType(NaturalType.INSTANCE, StringType.INSTANCE),
  suffix: new LambdaType(NaturalType.INSTANCE, StringType.INSTANCE),
  lowerCase: StringType.INSTANCE,
  upperCase: StringType.INSTANCE,
  startsWith: new LambdaType(StringType.INSTANCE, BooleanType.INSTANCE),
  endsWith: new LambdaType(StringType.INSTANCE, BooleanType.INSTANCE),
  trim: StringType.INSTANCE,
  trimLeft: StringType.INSTANCE,
  trimRight: StringType.INSTANCE
});

StringValue.prototype.context = StringValue.prototype.context.addAll({
  length: LazyValue.unmarshal(function () {
    return this.length;
  }),
  substring: Closure.unmarshal(function (index, length) {
    if (index < 0) {
      throw new Error('invalid start index: ' + index);
    } else if (index >= this.length) {
      throw new Error('start index out of bounds: ' + index);
    } else if (length < 0) {
      throw new Error('invalid length: ' + length);
    } else if (length > this.length - index) {
      throw new Error('length out of bounds: ' + length);
    } else {
      return this.substr(index, length);
    }
  }),
  prefix: Closure.unmarshal(function (length) {
    if (length < 0 || length > this.length) {
      throw new Error('length out of bounds: ' + length);
    } else {
      return this.substr(0, length);
    }
  }),
  suffix: Closure.unmarshal(function (length) {
    if (length < 0 || length > this.length) {
      throw new Error('length out of bounds: ' + length);
    } else if (length > 0) {
      return this.substr(-length);
    } else {
      return '';
    }
  }),
  lowerCase: LazyValue.unmarshal(function () {
    return this.toLowerCase();
  }),
  upperCase: LazyValue.unmarshal(function () {
    return this.toUpperCase();
  }),
  startsWith: Closure.unmarshal(function (string) {
    return this.indexOf(string) === 0;
  }),
  endsWith: Closure.unmarshal(function (string) {
    return this.lastIndexOf(string) === string.length;
  }),
  trim: LazyValue.unmarshal(function () {
    return this.trim();
  }),
  trimLeft: LazyValue.unmarshal(function () {
    return this.trimLeft();
  }),
  trimRight: LazyValue.unmarshal(function () {
    return this.trimRight();
  })
});
