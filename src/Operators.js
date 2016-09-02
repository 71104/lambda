var Operators = {
  _table: Object.create(null),
};

Operators._define = function (name, left, right, result, handler) {
  if (!(name in Operators._table)) {
    Operators._table[name] = Object.create(null);
  }
  if (!(left in Operators._table[name])) {
    Operators._table[name][left] = Object.create(null);
  }
  if (right in Operators._table[name][left]) {
    throw new LambdaInternalError();
  } else {
    Operators._table[name][left][right] = {
      type: result,
      handler: handler,
    };
  }
};

Operators.select = function (name, left, right) {
  if (name in Operators._table &&
      left in Operators._table[name] &&
      right in Operators._table[name][left])
  {
    return Operators._table[name][left][right];
  } else {
    throw new LambdaRuntimeError();
  }
};

Operators.make = function (name) {
  return Closure.fromFunction(function (x, y) {
    return Operators.select(name, x.character, y.character).handler(x, y);
  });
};


Operators._define('+', Character.COMPLEX, Character.COMPLEX, Character.COMPLEX, function (x, y) {
  return new ComplexValue(x.real + y.real, x.imaginary + y.imaginary);
});

Operators._define('+', Character.COMPLEX, Character.REAL, Character.COMPLEX, function (x, y) {
  return new ComplexValue(x.real + y.value, x.imaginary);
});

Operators._define('+', Character.COMPLEX, Character.INTEGER, Character.COMPLEX, function (x, y) {
  return new ComplexValue(x.real + y.value, x.imaginary);
});

Operators._define('+', Character.COMPLEX, Character.NATURAL, Character.COMPLEX, function (x, y) {
  return new ComplexValue(x.real + y.value, x.imaginary);
});

Operators._define('+', Character.REAL, Character.COMPLEX, Character.COMPLEX, function (x, y) {
  return new ComplexValue(x.value + y.real, y.imaginary);
});

Operators._define('+', Character.REAL, Character.REAL, Character.REAL, function (x, y) {
  return new RealValue(x.value + y.value);
});

Operators._define('+', Character.REAL, Character.INTEGER, Character.REAL, function (x, y) {
  return new RealValue(x.value + y.value);
});

Operators._define('+', Character.REAL, Character.NATURAL, Character.REAL, function (x, y) {
  return new RealValue(x.value + y.value);
});

Operators._define('+', Character.INTEGER, Character.COMPLEX, Character.COMPLEX, function (x, y) {
  return new ComplexValue(x.value + y.real, y.imaginary);
});

Operators._define('+', Character.INTEGER, Character.REAL, Character.REAL, function (x, y) {
  return new RealValue(x.value + y.value);
});

Operators._define('+', Character.INTEGER, Character.INTEGER, Character.INTEGER, function (x, y) {
  return new IntegerValue(x.value + y.value);
});

Operators._define('+', Character.INTEGER, Character.NATURAL, Character.INTEGER, function (x, y) {
  return new IntegerValue(x.value + y.value);
});

Operators._define('+', Character.NATURAL, Character.COMPLEX, Character.COMPLEX, function (x, y) {
  return new ComplexValue(x.value + y.real, y.imaginary);
});

Operators._define('+', Character.NATURAL, Character.REAL, Character.REAL, function (x, y) {
  return new RealValue(x.value + y.value);
});

Operators._define('+', Character.NATURAL, Character.INTEGER, Character.INTEGER, function (x, y) {
  return new IntegerValue(x.value + y.value);
});

Operators._define('+', Character.NATURAL, Character.NATURAL, Character.NATURAL, function (x, y) {
  return new NaturalValue(x.value + y.value);
});

Operators._define('+', Character.STRING, Character.STRING, Character.STRING, function (x, y) {
  return new StringValue(x.value + y.value);
});

Operators._define('+', Character.LIST, Character.LIST, Character.LIST, function (x, y) {
  return new ListValue(x.values.concat(y.values));
});


Operators._define('-', Character.COMPLEX, Character.COMPLEX, Character.COMPLEX, function (x, y) {
  return new ComplexValue(x.real - y.real, x.imaginary - y.imaginary);
});

Operators._define('-', Character.COMPLEX, Character.REAL, Character.COMPLEX, function (x, y) {
  return new ComplexValue(x.real - y.value, x.imaginary);
});

Operators._define('-', Character.COMPLEX, Character.INTEGER, Character.COMPLEX, function (x, y) {
  return new ComplexValue(x.real - y.value, x.imaginary);
});

Operators._define('-', Character.COMPLEX, Character.NATURAL, Character.COMPLEX, function (x, y) {
  return new ComplexValue(x.real - y.value, x.imaginary);
});

Operators._define('-', Character.REAL, Character.COMPLEX, Character.COMPLEX, function (x, y) {
  return new ComplexValue(x.value - y.real, -y.imaginary);
});

Operators._define('-', Character.REAL, Character.REAL, Character.REAL, function (x, y) {
  return new RealValue(x.value - y.value);
});

Operators._define('-', Character.REAL, Character.INTEGER, Character.REAL, function (x, y) {
  return new RealValue(x.value - y.value);
});

Operators._define('-', Character.REAL, Character.NATURAL, Character.REAL, function (x, y) {
  return new RealValue(x.value - y.value);
});

Operators._define('-', Character.INTEGER, Character.COMPLEX, Character.COMPLEX, function (x, y) {
  return new ComplexValue(x.value - y.real, -y.imaginary);
});

Operators._define('-', Character.INTEGER, Character.REAL, Character.REAL, function (x, y) {
  return new RealValue(x.value - y.value);
});

Operators._define('-', Character.INTEGER, Character.INTEGER, Character.INTEGER, function (x, y) {
  return new IntegerValue(x.value - y.value);
});

Operators._define('-', Character.INTEGER, Character.NATURAL, Character.INTEGER, function (x, y) {
  return new IntegerValue(x.value - y.value);
});

Operators._define('-', Character.NATURAL, Character.COMPLEX, Character.COMPLEX, function (x, y) {
  return new ComplexValue(x.value - y.real, -y.imaginary);
});

Operators._define('-', Character.NATURAL, Character.REAL, Character.REAL, function (x, y) {
  return new RealValue(x.value - y.value);
});

Operators._define('-', Character.NATURAL, Character.INTEGER, Character.INTEGER, function (x, y) {
  return new IntegerValue(x.value - y.value);
});

Operators._define('-', Character.NATURAL, Character.NATURAL, Character.NATURAL, function (x, y) {
  return new NaturalValue(x.value - y.value);
});


// TODO other operators
