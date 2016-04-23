StringType.prototype.context = new Context({
  length: UnsignedIntegerType.INSTANCE,
  substring: new LambdaType(
    UnsignedIntegerType.INSTANCE,
    new LambdaType(
      UnsignedIntegerType.INSTANCE,
      StringType.INSTANCE)),
  prefix: new LambdaType(UnsignedIntegerType.INSTANCE, StringType.INSTANCE),
  suffix: new LambdaType(UnsignedIntegerType.INSTANCE, StringType.INSTANCE)
    // TODO
});

StringValue.prototype.context = ObjectValue.prototype.context.addAll({
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
