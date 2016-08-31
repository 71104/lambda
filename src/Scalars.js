ComplexType.prototype.context = ComplexType.prototype.context.addAll({
  str: StringType.DEFAULT,
  real: RealType.DEFAULT,
  imaginary: RealType.DEFAULT,
  abs: RealType.DEFAULT,
});

ComplexValue.prototype.context = ComplexValue.prototype.context.addAll({
  str: Closure.fromMethod(function () {
    return this.toString();
  }),
  real: Closure.fromMethod(function () {
    return this.r;
  }),
  imaginary: Closure.fromMethod(function () {
    return this.i;
  }),
  abs: Closure.fromMethod(function () {
    return Math.sqrt(this.r * this.r + this.i * this.i);
  }),
});


RealType.prototype.context = RealType.prototype.context.addAll({
  ceil: IntegerType.DEFAULT,
  floor: IntegerType.DEFAULT,
  round: IntegerType.DEFAULT,
  trunc: IntegerType.DEFAULT,
  sign: IntegerType.DEFAULT,
  sqrt: RealType.DEFAULT,
  cbrt: RealType.DEFAULT,
  exp: RealType.DEFAULT,
  expm1: RealType.DEFAULT,
  log: RealType.DEFAULT,
  log10: RealType.DEFAULT,
  log2: RealType.DEFAULT,
  sin: RealType.DEFAULT,
  cos: RealType.DEFAULT,
  tan: RealType.DEFAULT,
  asin: RealType.DEFAULT,
  acos: RealType.DEFAULT,
  atan: RealType.DEFAULT,
  sinh: RealType.DEFAULT,
  cosh: RealType.DEFAULT,
  tanh: RealType.DEFAULT,
  asinh: RealType.DEFAULT,
  acosh: RealType.DEFAULT,
  atanh: RealType.DEFAULT,
});

function _makeMathFunction(name) {
  return Closure.fromFunction(function (x) {
    return Math[name](x);
  });
}

RealValue.prototype.context = RealValue.prototype.context.addAll({
  real: Closure.fromFunction(function (x) {
    return x;
  }),
  imaginary: Closure.fromMethod(function () {
    return 0;
  }),
  abs: _makeMathFunction('abs'),
  ceil: _makeMathFunction('ceil'),
  floor: _makeMathFunction('floor'),
  round: _makeMathFunction('round'),
  trunc: _makeMathFunction('trunc'),
  sign: _makeMathFunction('sign'),
  sqrt: _makeMathFunction('sqrt'),
  cbrt: _makeMathFunction('cbrt'),
  exp: _makeMathFunction('exp'),
  expm1: _makeMathFunction('expm1'),
  log: _makeMathFunction('log'),
  log10: _makeMathFunction('log10'),
  log2: _makeMathFunction('log2'),
  sin: _makeMathFunction('sin'),
  cos: _makeMathFunction('cos'),
  tan: _makeMathFunction('tan'),
  asin: _makeMathFunction('asin'),
  acos: _makeMathFunction('acos'),
  atan: _makeMathFunction('atan'),
  sinh: _makeMathFunction('sinh'),
  cosh: _makeMathFunction('cosh'),
  tanh: _makeMathFunction('tanh'),
  asinh: _makeMathFunction('asinh'),
  acosh: _makeMathFunction('acosh'),
  atanh: _makeMathFunction('atanh'),
});


IntegerType.prototype.context = IntegerType.prototype.context.addAll({
  abs: NaturalType.DEFAULT,
});


BooleanType.prototype.context = BooleanType.prototype.context.addAll({
  str: StringType.DEFAULT,
});

BooleanValue.prototype.context = BooleanValue.prototype.context.addAll({
  str: Closure.fromMethod(function () {
    return this.toString();
  }),
});
