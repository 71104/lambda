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


RealType.prototype.context = RealType.prototype.context.addAll({
  abs: RealType.DEFAULT,
  ceil: IntegerType.DEFAULT,
  floor: IntegerType.DEFAULT,
  round: IntegerType.DEFAULT,
  trunc: IntegerType.DEFAULT,
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
});

function _makeMathFunction(name) {
  return Closure.fromFunction(function () {
    return Math[name](this);
  });
}

RealValue.prototype.context = RealValue.prototype.context.addAll({
  abs: _makeMathFunction('abs'),
  ceil: _makeMathFunction('ceil'),
  floor: _makeMathFunction('floor'),
  round: _makeMathFunction('round'),
  trunc: _makeMathFunction('trunc'),
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
});


BooleanType.prototype.context = BooleanType.prototype.context.addAll({
  str: StringType.DEFAULT,
});

BooleanValue.prototype.context = BooleanValue.prototype.context.addAll({
  str: Closure.fromFunction(function () {
    return this.toString();
  }),
});
