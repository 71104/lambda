function TypeOfOperator() {
  UnaryOperatorNode.call(this, {
    '.*': function (x) {
      return new StringValue(x.type);
    }
  });
}

exports.TypeOfOperator = TypeOfOperator;

TypeOfOperator.prototype = Object.create(UnaryOperatorNode.prototype);


function NotOperator() {
  UnaryOperatorNode.call(this, {
    'bool': function (x) {
      return BooleanValue.unmarshal(!x.value);
    },
    'natural|integer': function (x) {
      return new IntegerValue(~x.value);
    }
  });
}

exports.NotOperator = NotOperator;

NotOperator.prototype = Object.create(UnaryOperatorNode.prototype);


function PlusOperator() {
  BinaryOperatorNode.call(this, {
    'natural': {
      'natural': function (x, y) {
        return new NaturalValue(x.value + y.value);
      },
      'integer': function (x, y) {
        return new IntegerValue(x.value + y.value);
      },
      'real': function (x, y) {
        return new RealValue(x.value + y.value);
      },
      'complex': function (x, y) {
        return new ComplexValue(x.value + y.real, y.imaginary);
      }
    },
    'integer': {
      'natural|integer': function (x, y) {
        return new IntegerValue(x.value + y.value);
      },
      'real': function (x, y) {
        return new RealValue(x.value + y.value);
      },
      'complex': function (x, y) {
        return new ComplexValue(x.value + y.real, y.imaginary);
      }
    },
    'real': {
      'natural|integer|real': function (x, y) {
        return new RealValue(x.value + y.value);
      },
      'complex': function (x, y) {
        return new ComplexValue(x.value + y.real, y.imaginary);
      }
    },
    'complex': {
      'natural|integer|real': function (x, y) {
        return new ComplexValue(x.real + y.value, x.imaginary);
      },
      'complex': function (x, y) {
        return new ComplexValue(x.real + y.real, x.imaginary + y.imaginary);
      }
    },
    'string': {
      'string': function (x, y) {
        return new StringValue(x.value + y.value);
      }
    },
    'list': {
      'list': function (x, y) {
        return new ListValue(x.getValues().concat(y.getValues()));
      }
    }
  });
}

exports.PlusOperator = PlusOperator;

PlusOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function MinusOperator() {
  BinaryOperatorNode.call(this, {
    'natural': {
      'natural|integer': function (x, y) {
        return new IntegerValue(x.value - y.value);
      },
      'real': function (x, y) {
        return new RealValue(x.value - y.value);
      },
      'complex': function (x, y) {
        return new ComplexValue(x.value - y.real, -y.imaginary);
      }
    },
    'integer': {
      'natural|integer': function (x, y) {
        return new IntegerValue(x.value - y.value);
      },
      'real': function (x, y) {
        return new RealValue(x.value - y.value);
      },
      'complex': function (x, y) {
        return new ComplexValue(x.value - y.real, -y.imaginary);
      }
    },
    'real': {
      'natural|integer|real': function (x, y) {
        return new RealValue(x.value - y.value);
      },
      'complex': function (x, y) {
        return new ComplexValue(x.value - y.real, -y.imaginary);
      }
    },
    'complex': {
      'natural|integer|real': function (x, y) {
        return new ComplexValue(x.real - y.value, x.imaginary);
      },
      'complex': function (x, y) {
        return new ComplexValue(x.real - y.real, x.imaginary - y.imaginary);
      }
    }
  });
}

exports.MinusOperator = MinusOperator;

MinusOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function MultiplyOperator() {
  BinaryOperatorNode.call(this, {
    'natural': {
      'natural': function (x, y) {
        return new NaturalValue(x.value * y.value);
      },
      'integer': function (x, y) {
        return new IntegerValue(x.value * y.value);
      },
      'real': function (x, y) {
        return new RealValue(x.value * y.value);
      },
      'complex': function (x, y) {
        return new ComplexValue(x.value * y.real, x.value * y.imaginary);
      }
    },
    'integer': {
      'natural|integer': function (x, y) {
        return new IntegerValue(x.value * y.value);
      },
      'real': function (x, y) {
        return new RealValue(x.value * y.value);
      },
      'complex': function (x, y) {
        return new ComplexValue(x.value * y.real, x.value * y.imaginary);
      }
    },
    'real': {
      'natural|integer|real': function (x, y) {
        return new RealValue(x.value * y.value);
      },
      'complex': function (x, y) {
        return new ComplexValue(x.value * y.real, x.value * y.imaginary);
      }
    },
    'complex': {
      'natural|integer|real': function (x, y) {
        return new ComplexValue(x.real * y.value, x.imaginary * y.value);
      },
      'complex': function (x, y) {
        return new ComplexValue(
          x.real * y.real - x.imaginary * y.imaginary,
          x.real * y.imaginary + x.imaginary * y.real
        );
      }
    }
  });
}

exports.MultiplyOperator = MultiplyOperator;

MultiplyOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function DivideOperator() {
  BinaryOperatorNode.call(this, {
    'natural|integer|real': {
      'natural|integer|real': function (x, y) {
        return new RealValue(x.value / y.value);
      },
      'complex': function (x, y) {
        return new ComplexValue(
          x.value * y.real / (y.real * y.real + y.imaginary * y.imaginary),
          x.value * y.imaginary / (y.real * y.real + y.imaginary * y.imaginary)
        );
      }
    },
    'complex': {
      'natural|integer|real': function (x, y) {
        return new ComplexValue(x.real / y.value, x.imaginary / y.value);
      },
      'complex': function (x, y) {
        return new ComplexValue(
          (x.real * y.imaginary + x.imaginary * y.real) / (y.real * y.real + y.imaginary * y.imaginary),
          (x.imaginary * y.real - x.real * y.imaginary) / (y.real * y.real + y.imaginary * y.imaginary)
        );
      }
    }
  });
}

exports.DivideOperator = DivideOperator;

DivideOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function PowerOperator() {
  BinaryOperatorNode.call(this, {
    'natural': {
      'natural': function (x, y) {
        return new NaturalValue(Math.pow(x.value, y.value));
      },
      'integer|real': function (x, y) {
        return new RealValue(Math.pow(x.value, y.value));
      }
    },
    'integer': {
      'natural': function (x, y) {
        return new IntegerValue(Math.pow(x.value, y.value));
      },
      'integer|real': function (x, y) {
        return new RealValue(Math.pow(x.value, y.value));
      }
    },
    'real': {
      'natural|integer|real': function (x, y) {
        return new RealValue(Math.pow(x.value, y.value));
      }
    }
  });
}

exports.PowerOperator = PowerOperator;

PowerOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function ModulusOperator() {
  BinaryOperatorNode.call(this, {
    'natural': {
      'natural|integer': function (x, y) {
        return new NaturalValue(x.value % y.value);
      },
      'real': function (x, y) {
        return new RealValue(x.value % y.value);
      }
    },
    'integer': {
      'natural|integer': function (x, y) {
        return new IntegerValue(x.value % y.value);
      },
      'real': function (x, y) {
        return new RealValue(x.value % y.value);
      }
    },
    'real': {
      'natural|integer|real': function (x, y) {
        return new RealValue(x.value % y.value);
      }
    }
  });
}

exports.ModulusOperator = ModulusOperator;

ModulusOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function LessThanOperator() {
  BinaryOperatorNode.call(this, {
    'bool': {
      'bool': function (x, y) {
        return BooleanValue.unmarshal(!x.value && y.value);
      }
    },
    'natural|integer|real': {
      'natural|integer|real': function (x, y) {
        return BooleanValue.unmarshal(x.value < y.value);
      }
    },
    'string': {
      'string': function (x, y) {
        return BooleanValue.unmarshal(x.value < y.value);
      }
    }
  });
}

exports.LessThanOperator = LessThanOperator;

LessThanOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function LessThanOrEqualOperator() {
  BinaryOperatorNode.call(this, {
    'bool': {
      'bool': function (x, y) {
        return BooleanValue.unmarshal(!x.value || y.value);
      }
    },
    'natural|integer|real': {
      'natural|integer|real': function (x, y) {
        return BooleanValue.unmarshal(x.value <= y.value);
      }
    },
    'string': {
      'string': function (x, y) {
        return BooleanValue.unmarshal(x.value <= y.value);
      }
    }
  });
}

exports.LessThanOrEqualOperator = LessThanOrEqualOperator;

LessThanOrEqualOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function GreaterThanOperator() {
  BinaryOperatorNode.call(this, {
    'bool': {
      'bool': function (x, y) {
        return BooleanValue.unmarshal(x.value && !y.value);
      }
    },
    'natural|integer|real': {
      'natural|integer|real': function (x, y) {
        return BooleanValue.unmarshal(x.value > y.value);
      }
    },
    'string': {
      'string': function (x, y) {
        return BooleanValue.unmarshal(x.value > y.value);
      }
    }
  });
}

exports.GreaterThanOperator = GreaterThanOperator;

GreaterThanOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function GreaterThanOrEqualOperator() {
  BinaryOperatorNode.call(this, {
    'bool': {
      'bool': function (x, y) {
        return BooleanValue.unmarshal(x.value || !y.value);
      }
    },
    'natural|integer|real': {
      'natural|integer|real': function (x, y) {
        return BooleanValue.unmarshal(x.value >= y.value);
      }
    },
    'string': {
      'string': function (x, y) {
        return BooleanValue.unmarshal(x.value >= y.value);
      }
    }
  });
}

exports.GreaterThanOrEqualOperator = GreaterThanOrEqualOperator;

GreaterThanOrEqualOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function LeftShiftOperator() {
  BinaryOperatorNode.call(this, {
    'natural': {
      'natural': function (x, y) {
        return new NaturalValue(x.value << y.value);
      }
    },
    'integer': {
      'natural': function (x, y) {
        return new IntegerValue(x.value << y.value);
      }
    }
  });
}

exports.LeftShiftOperator = LeftShiftOperator;

LeftShiftOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function RightShiftOperator() {
  BinaryOperatorNode.call(this, {
    'natural': {
      'natural': function (x, y) {
        return new NaturalValue(x.value >>> y.value);
      }
    },
    'integer': {
      'natural': function (x, y) {
        return new IntegerValue(x.value >> y.value);
      }
    }
  });
}

exports.RightShiftOperator = RightShiftOperator;

RightShiftOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function ComparisonOperator() {
  BinaryOperatorNode.call(this, {
    'undefined': {
      'undefined': function () {
        return BooleanValue.TRUE;
      },
      'bool|natural|integer|real|complex|string|closure|list': function () {
        return BooleanValue.FALSE;
      }
    },
    'bool': {
      'undefined': function () {
        return BooleanValue.FALSE;
      },
      'bool': function (x, y) {
        return BooleanValue.unmarshal(x.value === y.value);
      }
    },
    'natural|integer|real': {
      'undefined': function () {
        return BooleanValue.FALSE;
      },
      'natural|integer|real': function (x, y) {
        return BooleanValue.unmarshal(x.value === y.value);
      },
      'complex': function (x, y) {
        return BooleanValue.unmarshal(x.value === y.real && !y.imaginary);
      }
    },
    'complex': {
      'undefined': function () {
        return BooleanValue.FALSE;
      },
      'natural|integer|real': function (x, y) {
        return BooleanValue.unmarshal(!x.imaginary && x.real === y.value);
      },
      'complex': function (x, y) {
        return BooleanValue.unmarshal(x.real === y.real && x.imaginary === y.imaginary);
      }
    },
    'string': {
      'undefined': function () {
        return BooleanValue.FALSE;
      },
      'string': function (x, y) {
        return BooleanValue.unmarshal(x.value === y.value);
      }
    },
    'closure': {
      'undefined': function () {
        return BooleanValue.FALSE;
      }
    },
    'list': {
      'undefined': function () {
        return BooleanValue.FALSE;
      },
      'list': function (x, y) {
        var xValues = x.getValues();
        var yValues = y.getValues();
        if (xValues.length !== yValues.length) {
          return BooleanValue.FALSE;
        } else {
          for (var i = 0; i < xValues.length; i++) {
            // TODO
            throw new LambdaInternalError();
          }
          return BooleanValue.TRUE;
        }
      }
    }
  });
}

exports.ComparisonOperator = ComparisonOperator;

ComparisonOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function NegatedComparisonOperator() {
  BinaryOperatorNode.call(this, {
    'undefined': {
      'undefined': function () {
        return BooleanValue.FALSE;
      },
      'bool|natural|integer|real|complex|string|closure|list': function () {
        return BooleanValue.TRUE;
      }
    },
    'bool': {
      'undefined': function () {
        return BooleanValue.TRUE;
      },
      'bool': function (x, y) {
        return BooleanValue.unmarshal(x.value !== y.value);
      }
    },
    'natural|integer|real': {
      'undefined': function () {
        return BooleanValue.TRUE;
      },
      'natural|integer|real': function (x, y) {
        return BooleanValue.unmarshal(x.value !== y.value);
      },
      'complex': function (x, y) {
        return BooleanValue.unmarshal(x.value !== y.real || !!y.imaginary);
      }
    },
    'complex': {
      'undefined': function () {
        return BooleanValue.TRUE;
      },
      'natural|integer|real': function (x, y) {
        return BooleanValue.unmarshal(!!x.imaginary || x.real !== y.value);
      },
      'complex': function (x, y) {
        return BooleanValue.unmarshal(x.real !== y.real || x.imaginary !== y.imaginary);
      }
    },
    'string': {
      'undefined': function () {
        return BooleanValue.TRUE;
      },
      'string': function (x, y) {
        return BooleanValue.unmarshal(x.value !== y.value);
      }
    },
    'closure': {
      'undefined': function () {
        return BooleanValue.TRUE;
      }
    },
    'list': {
      'undefined': function () {
        return BooleanValue.TRUE;
      },
      'list': function (x, y) {
        var xValues = x.getValues();
        var yValues = y.getValues();
        if (xValues.length !== yValues.length) {
          return BooleanValue.TRUE;
        } else {
          for (var i = 0; i < xValues.length; i++) {
            // TODO
            throw new LambdaInternalError();
          }
          return BooleanValue.FALSE;
        }
      }
    }
  });
}

exports.NegatedComparisonOperator = NegatedComparisonOperator;

NegatedComparisonOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function AndOperator() {
  BinaryOperatorNode.call(this, {
    'bool': {
      'bool': function (x, y) {
        return BooleanValue.unmarshal(x.value && y.value);
      }
    },
    'natural|integer': {
      'natural|integer': function (x, y) {
        return new IntegerValue(x.value & y.value);
      }
    }
  });
}

exports.AndOperator = AndOperator;

AndOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function OrOperator() {
  BinaryOperatorNode.call(this, {
    'bool': {
      'bool': function (x, y) {
        return BooleanValue.unmarshal(x.value || y.value);
      }
    },
    'natural|integer': {
      'natural|integer': function (x, y) {
        return new IntegerValue(x.value | y.value);
      }
    }
  });
}

exports.OrOperator = OrOperator;

OrOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function XorOperator() {
  BinaryOperatorNode.call(this, {
    'bool': {
      'bool': function (x, y) {
        return BooleanValue.unmarshal(x.value !== y.value);
      }
    },
    'natural|integer': {
      'natural|integer': function (x, y) {
        return new IntegerValue(x.value ^ y.value);
      }
    }
  });
}

exports.XorOperator = XorOperator;

XorOperator.prototype = Object.create(BinaryOperatorNode.prototype);
