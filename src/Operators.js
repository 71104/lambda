function TypeOfOperator() {
  UnaryOperatorNode.call(this, {
    '.*': function (x) {
      return new StringValue(x.type);
    }
  });
}

exports.TypeOfOperator = TypeOfOperator;
extend(UnaryOperatorNode, TypeOfOperator);


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
extend(UnaryOperatorNode, NotOperator);


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
extend(BinaryOperatorNode, PlusOperator);


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
extend(BinaryOperatorNode, MinusOperator);


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
extend(BinaryOperatorNode, MultiplyOperator);


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
extend(BinaryOperatorNode, DivideOperator);


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
extend(BinaryOperatorNode, PowerOperator);


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
extend(BinaryOperatorNode, ModulusOperator);


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
extend(BinaryOperatorNode, LessThanOperator);


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
extend(BinaryOperatorNode, LessThanOrEqualOperator);


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
extend(BinaryOperatorNode, GreaterThanOperator);


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
extend(BinaryOperatorNode, GreaterThanOrEqualOperator);


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
extend(BinaryOperatorNode, LeftShiftOperator);


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
extend(BinaryOperatorNode, RightShiftOperator);


function ComparisonOperator() {
  BinaryOperatorNode.call(this, {
    'bool': {
      'bool': function (x, y) {
        return BooleanValue.unmarshal(x.value === y.value);
      }
    },
    'natural|integer|real': {
      'natural|integer|real': function (x, y) {
        return BooleanValue.unmarshal(x.value === y.value);
      },
      'complex': function (x, y) {
        return BooleanValue.unmarshal(x.value === y.real && !y.imaginary);
      }
    },
    'complex': {
      'natural|integer|real': function (x, y) {
        return BooleanValue.unmarshal(!x.imaginary && x.real === y.value);
      },
      'complex': function (x, y) {
        return BooleanValue.unmarshal(x.real === y.real && x.imaginary === y.imaginary);
      }
    },
    'string': {
      'string': function (x, y) {
        return BooleanValue.unmarshal(x.value === y.value);
      }
    },
    'list': {
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
extend(BinaryOperatorNode, ComparisonOperator);


function NegatedComparisonOperator() {
  BinaryOperatorNode.call(this, {
    'bool': {
      'bool': function (x, y) {
        return BooleanValue.unmarshal(x.value !== y.value);
      }
    },
    'natural|integer|real': {
      'natural|integer|real': function (x, y) {
        return BooleanValue.unmarshal(x.value !== y.value);
      },
      'complex': function (x, y) {
        return BooleanValue.unmarshal(x.value !== y.real || !!y.imaginary);
      }
    },
    'complex': {
      'natural|integer|real': function (x, y) {
        return BooleanValue.unmarshal(!!x.imaginary || x.real !== y.value);
      },
      'complex': function (x, y) {
        return BooleanValue.unmarshal(x.real !== y.real || x.imaginary !== y.imaginary);
      }
    },
    'string': {
      'string': function (x, y) {
        return BooleanValue.unmarshal(x.value !== y.value);
      }
    },
    'list': {
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
extend(BinaryOperatorNode, NegatedComparisonOperator);


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
extend(BinaryOperatorNode, AndOperator);


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
extend(BinaryOperatorNode, OrOperator);


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
extend(BinaryOperatorNode, XorOperator);
