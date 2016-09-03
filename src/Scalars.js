ComplexType.prototype.context = ComplexType.prototype.context.addAll({
  str: StringType.DEFAULT,
  real: RealType.DEFAULT,
  imaginary: RealType.DEFAULT,
  abs: RealType.DEFAULT,
});

ComplexValue.prototype.context = ComplexValue.prototype.context.addAll({
  str: Closure.fromFunction(function (value) {
    return new StringValue(value.toString());
  }),
  real: Closure.fromFunction(function (value) {
    return new RealValue(value.real);
  }),
  imaginary: Closure.fromFunction(function (value) {
    return new RealValue(value.imaginary);
  }),
  abs: Closure.fromFunction(function (value) {
    return new RealValue(Math.sqrt(value.real * value.real + value.imaginary * value.imaginary));
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

function _makeRealMathFunction(name) {
  return Closure.fromFunction(function (value) {
    return new RealValue(Math[name](value.value));
  });
}

function _makeIntegerMathFunction(name) {
  return Closure.fromFunction(function (value) {
    return new IntegerValue(Math[name](value.value));
  });
}

function _makeNaturalMathFunction(name) {
  return Closure.fromFunction(function (value) {
    return new NaturalValue(Math[name](value.value));
  });
}

RealValue.prototype.context = RealValue.prototype.context.addAll({
  abs: _makeRealMathFunction('abs'),
  ceil: _makeIntegerMathFunction('ceil'),
  floor: _makeIntegerMathFunction('floor'),
  round: _makeIntegerMathFunction('round'),
  trunc: _makeIntegerMathFunction('trunc'),
  sign: _makeIntegerMathFunction('sign'),
  sqrt: _makeRealMathFunction('sqrt'),
  cbrt: _makeRealMathFunction('cbrt'),
  exp: _makeRealMathFunction('exp'),
  expm1: _makeRealMathFunction('expm1'),
  log: _makeRealMathFunction('log'),
  log10: _makeRealMathFunction('log10'),
  log2: _makeRealMathFunction('log2'),
  sin: _makeRealMathFunction('sin'),
  cos: _makeRealMathFunction('cos'),
  tan: _makeRealMathFunction('tan'),
  asin: _makeRealMathFunction('asin'),
  acos: _makeRealMathFunction('acos'),
  atan: _makeRealMathFunction('atan'),
  sinh: _makeRealMathFunction('sinh'),
  cosh: _makeRealMathFunction('cosh'),
  tanh: _makeRealMathFunction('tanh'),
  asinh: _makeRealMathFunction('asinh'),
  acosh: _makeRealMathFunction('acosh'),
  atanh: _makeRealMathFunction('atanh'),
});


IntegerType.prototype.context = IntegerType.prototype.context.addAll({
  abs: NaturalType.DEFAULT,
});

IntegerValue.prototype.context = IntegerValue.prototype.context.addAll({
  abs: _makeNaturalMathFunction('abs'),
});


BooleanType.prototype.context = BooleanType.prototype.context.addAll({
  str: StringType.DEFAULT,
});

BooleanValue.prototype.context = BooleanValue.prototype.context.addAll({
  str: Closure.fromFunction(function (value) {
    return new StringValue(value.toString());
  }),
});
