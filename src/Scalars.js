ComplexType.prototype.context = ComplexType.prototype.context.addAll({
  str: StringType.DEFAULT,
  real: RealType.DEFAULT,
  imaginary: RealType.DEFAULT,
});

ComplexValue.prototype.context = ComplexValue.prototype.context.addAll({
  str: Closure.fromFunction(function () {
    return this.toString();
  }),
  real: Closure.fromFunction(function () {
    return this.r;
  }),
  imaginary: Closure.fromFunction(function () {
    return this.i;
  }),
});


BooleanType.prototype.context = BooleanType.prototype.context.addAll({
  str: StringType.DEFAULT,
});

BooleanValue.prototype.context = BooleanValue.prototype.context.addAll({
  str: Closure.fromFunction(function () {
    return this.toString();
  }),
});
