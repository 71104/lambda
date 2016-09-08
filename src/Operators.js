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
  return new ListValue(x.forceList().values.concat(y.forceList().values));
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

Operators._define('-', Character.NATURAL, Character.NATURAL, Character.INTEGER, function (x, y) {
  return new IntegerValue(x.value - y.value);
});


Operators._define('*', Character.COMPLEX, Character.COMPLEX, Character.COMPLEX, function (x, y) {
  return new ComplexValue(
    x.real * y.real - x.imaginary * y.imaginary,
    x.real * y.imaginary + y.real * x.imaginary);
});

Operators._define('*', Character.COMPLEX, Character.REAL, Character.COMPLEX, function (x, y) {
  return new ComplexValue(x.real * y.value, x.imaginary * y.value);
});

Operators._define('*', Character.COMPLEX, Character.INTEGER, Character.COMPLEX, function (x, y) {
  return new ComplexValue(x.real * y.value, x.imaginary * y.value);
});

Operators._define('*', Character.COMPLEX, Character.NATURAL, Character.COMPLEX, function (x, y) {
  return new ComplexValue(x.real * y.value, x.imaginary * y.value);
});

Operators._define('*', Character.REAL, Character.COMPLEX, Character.COMPLEX, function (x, y) {
  return new ComplexValue(x.value * y.real, x.value * y.imaginary);
});

Operators._define('*', Character.REAL, Character.REAL, Character.REAL, function (x, y) {
  return new RealValue(x.value * y.value);
});

Operators._define('*', Character.REAL, Character.INTEGER, Character.REAL, function (x, y) {
  return new RealValue(x.value * y.value);
});

Operators._define('*', Character.REAL, Character.NATURAL, Character.REAL, function (x, y) {
  return new RealValue(x.value * y.value);
});

Operators._define('*', Character.INTEGER, Character.COMPLEX, Character.COMPLEX, function (x, y) {
  return new ComplexValue(x.value * y.real, x.value * y.imaginary);
});

Operators._define('*', Character.INTEGER, Character.REAL, Character.REAL, function (x, y) {
  return new RealValue(x.value * y.value);
});

Operators._define('*', Character.INTEGER, Character.INTEGER, Character.INTEGER, function (x, y) {
  return new IntegerValue(x.value * y.value);
});

Operators._define('*', Character.INTEGER, Character.NATURAL, Character.INTEGER, function (x, y) {
  return new IntegerValue(x.value * y.value);
});

Operators._define('*', Character.NATURAL, Character.COMPLEX, Character.COMPLEX, function (x, y) {
  return new ComplexValue(x.value * y.real, x.value * y.imaginary);
});

Operators._define('*', Character.NATURAL, Character.REAL, Character.REAL, function (x, y) {
  return new RealValue(x.value * y.value);
});

Operators._define('*', Character.NATURAL, Character.INTEGER, Character.INTEGER, function (x, y) {
  return new IntegerValue(x.value * y.value);
});

Operators._define('*', Character.NATURAL, Character.NATURAL, Character.NATURAL, function (x, y) {
  return new NaturalValue(x.value * y.value);
});


Operators._define('/', Character.COMPLEX, Character.COMPLEX, Character.COMPLEX, function (x, y) {
  return new ComplexValue(
    (x.real * y.real + x.imaginary * y.imaginary) / (y.real * y.real + y.imaginary * y.imaginary),
    (x.imaginary * y.real - x.real * y.imaginary) / (y.real * y.real + y.imaginary * y.imaginary));
});

Operators._define('/', Character.COMPLEX, Character.REAL, Character.COMPLEX, function (x, y) {
  return new ComplexValue(x.real / y.value, x.imaginary / y.value);
});

Operators._define('/', Character.COMPLEX, Character.INTEGER, Character.COMPLEX, function (x, y) {
  return new ComplexValue(x.real / y.value, x.imaginary / y.value);
});

Operators._define('/', Character.COMPLEX, Character.NATURAL, Character.COMPLEX, function (x, y) {
  return new ComplexValue(x.real / y.value, x.imaginary / y.value);
});

Operators._define('/', Character.REAL, Character.COMPLEX, Character.COMPLEX, function (x, y) {
  return new ComplexValue(
    x.value * y.real / (y.real * y.real + y.imaginary * y.imaginary),
    -x.value * y.imaginary / (y.real * y.real + y.imaginary * y.imaginary));
});

Operators._define('/', Character.REAL, Character.REAL, Character.REAL, function (x, y) {
  return new RealValue(x.value / y.value);
});

Operators._define('/', Character.REAL, Character.INTEGER, Character.REAL, function (x, y) {
  return new RealValue(x.value / y.value);
});

Operators._define('/', Character.REAL, Character.NATURAL, Character.REAL, function (x, y) {
  return new RealValue(x.value / y.value);
});

Operators._define('/', Character.INTEGER, Character.COMPLEX, Character.COMPLEX, function (x, y) {
  return new ComplexValue(
    x.value * y.real / (y.real * y.real + y.imaginary * y.imaginary),
    -x.value * y.imaginary / (y.real * y.real + y.imaginary * y.imaginary));
});

Operators._define('/', Character.INTEGER, Character.REAL, Character.REAL, function (x, y) {
  return new RealValue(x.value / y.value);
});

Operators._define('/', Character.INTEGER, Character.INTEGER, Character.REAL, function (x, y) {
  return new RealValue(x.value / y.value);
});

Operators._define('/', Character.INTEGER, Character.NATURAL, Character.REAL, function (x, y) {
  return new RealValue(x.value / y.value);
});

Operators._define('/', Character.NATURAL, Character.COMPLEX, Character.COMPLEX, function (x, y) {
  return new ComplexValue(
    x.value * y.real / (y.real * y.real + y.imaginary * y.imaginary),
    -x.value * y.imaginary / (y.real * y.real + y.imaginary * y.imaginary));
});

Operators._define('/', Character.NATURAL, Character.REAL, Character.REAL, function (x, y) {
  return new RealValue(x.value / y.value);
});

Operators._define('/', Character.NATURAL, Character.INTEGER, Character.REAL, function (x, y) {
  return new RealValue(x.value / y.value);
});

Operators._define('/', Character.NATURAL, Character.NATURAL, Character.REAL, function (x, y) {
  return new RealValue(x.value / y.value);
});


Operators._define('%', Character.REAL, Character.REAL, Character.REAL, function (x, y) {
  return new RealValue(x.value % y.value);
});

Operators._define('%', Character.REAL, Character.INTEGER, Character.REAL, function (x, y) {
  return new RealValue(x.value % y.value);
});

Operators._define('%', Character.REAL, Character.NATURAL, Character.REAL, function (x, y) {
  return new RealValue(x.value % y.value);
});

Operators._define('%', Character.INTEGER, Character.REAL, Character.REAL, function (x, y) {
  return new RealValue(x.value % y.value);
});

Operators._define('%', Character.INTEGER, Character.INTEGER, Character.INTEGER, function (x, y) {
  return new IntegerValue(x.value % y.value);
});

Operators._define('%', Character.INTEGER, Character.NATURAL, Character.INTEGER, function (x, y) {
  return new IntegerValue(x.value % y.value);
});

Operators._define('%', Character.NATURAL, Character.REAL, Character.REAL, function (x, y) {
  return new RealValue(x.value % y.value);
});

Operators._define('%', Character.NATURAL, Character.INTEGER, Character.NATURAL, function (x, y) {
  return new NaturalValue(x.value % y.value);
});

Operators._define('%', Character.NATURAL, Character.NATURAL, Character.NATURAL, function (x, y) {
  return new NaturalValue(x.value % y.value);
});


Operators._define('**', Character.REAL, Character.REAL, Character.REAL, function (x, y) {
  return new RealValue(Math.pow(x.value, y.value));
});

Operators._define('**', Character.REAL, Character.INTEGER, Character.REAL, function (x, y) {
  return new RealValue(Math.pow(x.value, y.value));
});

Operators._define('**', Character.REAL, Character.NATURAL, Character.REAL, function (x, y) {
  return new RealValue(Math.pow(x.value, y.value));
});

Operators._define('**', Character.INTEGER, Character.REAL, Character.REAL, function (x, y) {
  return new RealValue(Math.pow(x.value, y.value));
});

Operators._define('**', Character.INTEGER, Character.INTEGER, Character.REAL, function (x, y) {
  return new RealValue(Math.pow(x.value, y.value));
});

Operators._define('**', Character.INTEGER, Character.NATURAL, Character.INTEGER, function (x, y) {
  return new IntegerValue(Math.pow(x.value, y.value));
});

Operators._define('**', Character.NATURAL, Character.REAL, Character.REAL, function (x, y) {
  return new RealValue(Math.pow(x.value, y.value));
});

Operators._define('**', Character.NATURAL, Character.INTEGER, Character.REAL, function (x, y) {
  return new RealValue(Math.pow(x.value, y.value));
});

Operators._define('**', Character.NATURAL, Character.NATURAL, Character.NATURAL, function (x, y) {
  return new NaturalValue(Math.pow(x.value, y.value));
});


Operators._define('=', Character.COMPLEX, Character.COMPLEX, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.real === y.real && x.imaginary === y.imaginary);
});

Operators._define('=', Character.COMPLEX, Character.REAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.real === y.value && !x.imaginary);
});

Operators._define('=', Character.COMPLEX, Character.INTEGER, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.real === y.value && !x.imaginary);
});

Operators._define('=', Character.COMPLEX, Character.NATURAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.real === y.value && !x.imaginary);
});

Operators._define('=', Character.REAL, Character.COMPLEX, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value === y.real && !y.imaginary);
});

Operators._define('=', Character.REAL, Character.REAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value === y.value);
});

Operators._define('=', Character.REAL, Character.INTEGER, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value === y.value);
});

Operators._define('=', Character.REAL, Character.NATURAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value === y.value);
});

Operators._define('=', Character.INTEGER, Character.COMPLEX, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value === y.real && !y.imaginary);
});

Operators._define('=', Character.INTEGER, Character.REAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value === y.value);
});

Operators._define('=', Character.INTEGER, Character.INTEGER, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value === y.value);
});

Operators._define('=', Character.INTEGER, Character.NATURAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value === y.value);
});

Operators._define('=', Character.NATURAL, Character.COMPLEX, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value === y.real && !y.imaginary);
});

Operators._define('=', Character.NATURAL, Character.REAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value === y.value);
});

Operators._define('=', Character.NATURAL, Character.INTEGER, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value === y.value);
});

Operators._define('=', Character.NATURAL, Character.NATURAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value === y.value);
});

Operators._define('=', Character.BOOLEAN, Character.BOOLEAN, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value === y.value);
});

Operators._define('=', Character.STRING, Character.STRING, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value === y.value);
});

Operators._define('=', Character.LIST, Character.LIST, Character.BOOLEAN, function (x, y) {
  var length = x.getLength();
  if (length !== y.getLength()) {
    return BooleanValue.FALSE;
  } else {
    for (var i = 0; i < x.length; i++) {
      var operator = Operators.select('=', x.lookup(i).character, y.lookup(i).character);
      if (!operator.handler(x.lookup(i), y.lookup(i)).value) {
        return BooleanValue.FALSE;
      }
    }
    return BooleanValue.TRUE;
  }
});


Operators._define('!=', Character.COMPLEX, Character.COMPLEX, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.real !== y.real || x.imaginary !== y.imaginary);
});

Operators._define('!=', Character.COMPLEX, Character.REAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.real !== y.value || !!x.imaginary);
});

Operators._define('!=', Character.COMPLEX, Character.INTEGER, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.real !== y.value || !!x.imaginary);
});

Operators._define('!=', Character.COMPLEX, Character.NATURAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.real !== y.value || !!x.imaginary);
});

Operators._define('!=', Character.REAL, Character.COMPLEX, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value !== y.real || !!y.imaginary);
});

Operators._define('!=', Character.REAL, Character.REAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value !== y.value);
});

Operators._define('!=', Character.REAL, Character.INTEGER, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value !== y.value);
});

Operators._define('!=', Character.REAL, Character.NATURAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value !== y.value);
});

Operators._define('!=', Character.INTEGER, Character.COMPLEX, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value !== y.real || !!y.imaginary);
});

Operators._define('!=', Character.INTEGER, Character.REAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value !== y.value);
});

Operators._define('!=', Character.INTEGER, Character.INTEGER, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value !== y.value);
});

Operators._define('!=', Character.INTEGER, Character.NATURAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value !== y.value);
});

Operators._define('!=', Character.NATURAL, Character.COMPLEX, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value !== y.real || !!y.imaginary);
});

Operators._define('!=', Character.NATURAL, Character.REAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value !== y.value);
});

Operators._define('!=', Character.NATURAL, Character.INTEGER, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value !== y.value);
});

Operators._define('!=', Character.NATURAL, Character.NATURAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value !== y.value);
});

Operators._define('!=', Character.BOOLEAN, Character.BOOLEAN, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value !== y.value);
});

Operators._define('!=', Character.STRING, Character.STRING, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value !== y.value);
});

Operators._define('!=', Character.LIST, Character.LIST, Character.BOOLEAN, function (x, y) {
  var length = x.getLength();
  if (length !== y.getLength()) {
    return BooleanValue.TRUE;
  } else {
    for (var i = 0; i < length; i++) {
      var operator = Operators.select('!=', x.lookup(i).character, y.lookup(i).character);
      if (operator.handler(x.lookup(i), y.lookup(i)).value) {
        return BooleanValue.TRUE;
      }
    }
    return BooleanValue.FALSE;
  }
});


Operators._define('<', Character.REAL, Character.REAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value < y.value);
});

Operators._define('<', Character.REAL, Character.INTEGER, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value < y.value);
});

Operators._define('<', Character.REAL, Character.NATURAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value < y.value);
});

Operators._define('<', Character.INTEGER, Character.REAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value < y.value);
});

Operators._define('<', Character.INTEGER, Character.INTEGER, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value < y.value);
});

Operators._define('<', Character.INTEGER, Character.NATURAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value < y.value);
});

Operators._define('<', Character.NATURAL, Character.REAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value < y.value);
});

Operators._define('<', Character.NATURAL, Character.INTEGER, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value < y.value);
});

Operators._define('<', Character.NATURAL, Character.NATURAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value < y.value);
});

Operators._define('<', Character.BOOLEAN, Character.BOOLEAN, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value < y.value);
});

Operators._define('<', Character.STRING, Character.STRING, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value < y.value);
});


Operators._define('>', Character.REAL, Character.REAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value > y.value);
});

Operators._define('>', Character.REAL, Character.INTEGER, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value > y.value);
});

Operators._define('>', Character.REAL, Character.NATURAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value > y.value);
});

Operators._define('>', Character.INTEGER, Character.REAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value > y.value);
});

Operators._define('>', Character.INTEGER, Character.INTEGER, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value > y.value);
});

Operators._define('>', Character.INTEGER, Character.NATURAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value > y.value);
});

Operators._define('>', Character.NATURAL, Character.REAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value > y.value);
});

Operators._define('>', Character.NATURAL, Character.INTEGER, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value > y.value);
});

Operators._define('>', Character.NATURAL, Character.NATURAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value > y.value);
});

Operators._define('>', Character.BOOLEAN, Character.BOOLEAN, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value > y.value);
});

Operators._define('>', Character.STRING, Character.STRING, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value > y.value);
});


Operators._define('<=', Character.REAL, Character.REAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value <= y.value);
});

Operators._define('<=', Character.REAL, Character.INTEGER, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value <= y.value);
});

Operators._define('<=', Character.REAL, Character.NATURAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value <= y.value);
});

Operators._define('<=', Character.INTEGER, Character.REAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value <= y.value);
});

Operators._define('<=', Character.INTEGER, Character.INTEGER, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value <= y.value);
});

Operators._define('<=', Character.INTEGER, Character.NATURAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value <= y.value);
});

Operators._define('<=', Character.NATURAL, Character.REAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value <= y.value);
});

Operators._define('<=', Character.NATURAL, Character.INTEGER, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value <= y.value);
});

Operators._define('<=', Character.NATURAL, Character.NATURAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value <= y.value);
});

Operators._define('<=', Character.BOOLEAN, Character.BOOLEAN, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value <= y.value);
});

Operators._define('<=', Character.STRING, Character.STRING, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value <= y.value);
});


Operators._define('>=', Character.REAL, Character.REAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value >= y.value);
});

Operators._define('>=', Character.REAL, Character.INTEGER, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value >= y.value);
});

Operators._define('>=', Character.REAL, Character.NATURAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value >= y.value);
});

Operators._define('>=', Character.INTEGER, Character.REAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value >= y.value);
});

Operators._define('>=', Character.INTEGER, Character.INTEGER, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value >= y.value);
});

Operators._define('>=', Character.INTEGER, Character.NATURAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value >= y.value);
});

Operators._define('>=', Character.NATURAL, Character.REAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value >= y.value);
});

Operators._define('>=', Character.NATURAL, Character.INTEGER, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value >= y.value);
});

Operators._define('>=', Character.NATURAL, Character.NATURAL, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value >= y.value);
});

Operators._define('>=', Character.BOOLEAN, Character.BOOLEAN, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value >= y.value);
});

Operators._define('>=', Character.STRING, Character.STRING, Character.BOOLEAN, function (x, y) {
  return new BooleanValue(x.value >= y.value);
});
