function TypeOfOperator() {
	UnaryOperatorNode.call(this, {
		'.*': function (x) {
			return new StringValue(x.type);
		}
	});
}

exports.TypeOfOperator = TypeOfOperator;

TypeOfOperator.prototype = Object.create(UnaryOperatorNode.prototype);


function LogicalNotOperator() {
	UnaryOperatorNode.call(this, {
		'bool': function (x) {
			return BooleanValue.unmarshal(!x.value);
		}
	});
}

exports.LogicalNotOperator = LogicalNotOperator;

LogicalNotOperator.prototype = Object.create(UnaryOperatorNode.prototype);


function BitwiseNotOperator() {
	UnaryOperatorNode.call(this, {
		'int': function (x) {
			return new IntegerValue(~x.value);
		}
	});
}

exports.BitwiseNotOperator = BitwiseNotOperator;

BitwiseNotOperator.prototype = Object.create(UnaryOperatorNode.prototype);


function PlusOperator() {
	BinaryOperatorNode.call(this, {
		'undefined': {
			'string': function (x, y) {
				return new StringValue('undefined' + y.value);
			}
		},
		'null': {
			'string': function (x, y) {
				return new StringValue('null' + y.value);
			}
		},
		'bool': {
			'bool': function (x, y) {
				return BooleanValue.unmarshal(x.value, y.value);
			},
			'string': function (x, y) {
				if (x.value) {
					return new StringValue('true' + y.value);
				} else {
					return new StringValue('false' + y.value);
				}
			}
		},
		'int': {
			'int': function (x, y) {
				return new IntegerValue(x.value + y.value);
			},
			'float': function (x, y) {
				return new FloatValue(x.value + y.value);
			},
			'complex': function (x, y) {
				return new ComplexValue(x.value + y.real, y.imaginary);
			},
			'string': function (x, y) {
				return new StringValue(('' + x.value) + y.value);
			}
		},
		'float': {
			'int|float': function (x, y) {
				return new FloatValue(x.value + y.value);
			},
			'complex': function (x, y) {
				return new ComplexValue(x.value + y.real, y.imaginary);
			},
			'string': function (x, y) {
				return new StringValue(('' + x.value) + y.value);
			}
		},
		'complex': {
			'int|float': function (x, y) {
				return new ComplexValue(x.real + y.value, x.imaginary);
			},
			'complex': function (x, y) {
				return new ComplexValue(x.real + y.real, x.imaginary + y.imaginary);
			},
			'string': function (x, y) {
				return new StringValue(x.toString() + y.value);
			}
		},
		'string': {
			'undefined': function (x) {
				return new StringValue(x.value + 'undefined');
			},
			'null': function (x) {
				return new StringValue(x.value + 'null');
			},
			'bool': function (x, y) {
				if (y.value) {
					return new StringValue(x.value + 'true');
				} else {
					return new StringValue(x.value + 'false');
				}
			},
			'int|float': function (x, y) {
				return new StringValue(x.value + y.value);
			},
			'complex': function (x, y) {
				return new StringValue(x.value + y.toString());
			},
			'string': function (x, y) {
				return new StringValue(x.value + y.value);
			}
		},
		'array': {
			'array': function (x, y) {
				return new ArrayValue(x.array.concat(y.array));
			}
		}
	});
}

exports.PlusOperator = PlusOperator;

PlusOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function MinusOperator() {
	BinaryOperatorNode.call(this, {
		'bool': {
			'bool': function (x, y) {
				return BooleanValue.unmarshal(x.value && !y.value);
			}
		},
		'int': {
			'int': function (x, y) {
				return new IntegerValue(x.value - y.value);
			},
			'float': function (x, y) {
				return new FloatValue(x.value - y.value);
			},
			'complex': function (x, y) {
				return new ComplexValue(x.value - y.real, -y.imaginary);
			}
		},
		'float': {
			'int|float': function (x, y) {
				return new FloatValue(x.value - y.value);
			},
			'complex': function (x, y) {
				return new ComplexValue(x.value - y.real, -y.imaginary);
			}
		},
		'complex': {
			'int|float': function (x, y) {
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
		'bool': {
			'bool': function (x, y) {
				return BooleanValue.unmarshal(x.value && y.value);
			}
		},
		'int': {
			'int': function (x, y) {
				return new IntegerValue(x.value * y.value);
			},
			'float': function (x, y) {
				return new FloatValue(x.value * y.value);
			},
			'complex': function (x, y) {
				return new ComplexValue(x.value * y.real, x.value * y.imaginary);
			}
		},
		'float': {
			'int|float': function (x, y) {
				return new FloatValue(x.value * y.value);
			},
			'complex': function (x, y) {
				return new ComplexValue(x.value * y.real, x.value * y.imaginary);
			}
		},
		'complex': {
			'int|float': function (x, y) {
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
		'int': {
			'int': function (x, y) {
				var value = x.value / y.value;
				if (value < 0) {
					return new IntegerValue(Math.ceil(value));
				} else {
					return new IntegerValue(Math.floor(value));
				}
			},
			'float': function (x, y) {
				return new FloatValue(x.value / y.value);
			},
			'complex': function (x, y) {
				return new ComplexValue(
					x.value * y.real / (y.real * y.real + y.imaginary * y.imaginary),
					x.value * y.imaginary / (y.real * y.real + y.imaginary * y.imaginary)
					);
			}
		},
		'float': {
			'int|float': function (x, y) {
				return new FloatValue(x.value / y.value);
			},
			'complex': function (x, y) {
				return new ComplexValue(
					x.value * y.real / (y.real * y.real + y.imaginary * y.imaginary),
					x.value * y.imaginary / (y.real * y.real + y.imaginary * y.imaginary)
					);
			}
		},
		'complex': {
			'int|float': function (x, y) {
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
		'int': {
			'int': function (x, y) {
				return new IntegerValue(Math.pow(x.value, y.value));
			},
			'float': function (x, y) {
				return new FloatValue(Math.pow(x.value, y.value));
			}
		},
		'float': {
			'int|float': function (x, y) {
				return new FloatValue(Math.pow(x.value, y.value));
			}
		}
	});
}

exports.PowerOperator = PowerOperator;

PowerOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function ModulusOperator() {
	BinaryOperatorNode.call(this, {
		'int': {
			'int': function (x, y) {
				return new IntegerValue(x.value % y.value);
			},
			'float': function (x, y) {
				return new FloatValue(x.value % y.value);
			}
		},
		'float': {
			'int|float': function (x, y) {
				return new FloatValue(x.value % y.value);
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
		'int|float': {
			'int|float': function (x, y) {
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
		'int|float': {
			'int|float': function (x, y) {
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
		'int|float': {
			'int|float': function (x, y) {
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
		'int|float': {
			'int|float': function (x, y) {
				return BooleanValue.unmarshal(x.value >= y.value);
			}
		}
	});
}

exports.GreaterThanOrEqualOperator = GreaterThanOrEqualOperator;

GreaterThanOrEqualOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function BitwiseAndOperator() {
	BinaryOperatorNode.call(this, {
		'int': {
			'int': function (x, y) {
				return new IntegerValue(x.value & y.value);
			}
		}
	});
}

exports.BitwiseAndOperator = BitwiseAndOperator;

BitwiseAndOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function BitwiseOrOperator() {
	BinaryOperatorNode.call(this, {
		'int': {
			'int': function (x, y) {
				return new IntegerValue(x.value | y.value);
			}
		}
	});
}

exports.BitwiseOrOperator = BitwiseOrOperator;

BitwiseOrOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function BitwiseXorOperator() {
	BinaryOperatorNode.call(this, {
		'int': {
			'int': function (x, y) {
				return new IntegerValue(x.value ^ y.value);
			}
		}
	});
}

exports.BitwiseXorOperator = BitwiseXorOperator;

BitwiseXorOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function LeftShiftOperator() {
	BinaryOperatorNode.call(this, {
		'int': {
			'int': function (x, y) {
				return new IntegerValue(x.value << y.value);
			}
		}
	});
}

exports.LeftShiftOperator = LeftShiftOperator;

LeftShiftOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function RightShiftOperator() {
	BinaryOperatorNode.call(this, {
		'int': {
			'int': function (x, y) {
				return new IntegerValue(x.value >> y.value);
			}
		}
	});
}

exports.RightShiftOperator = RightShiftOperator;

RightShiftOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function UnsignedRightShiftOperator() {
	BinaryOperatorNode.call(this, {
		'int': {
			'int': function (x, y) {
				return new IntegerValue(x.value >>> y.value);
			}
		}
	});
}

exports.UnsignedRightShiftOperator = UnsignedRightShiftOperator;

UnsignedRightShiftOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function ComparisonOperator() {
	BinaryOperatorNode.call(this, {
		'undefined': {
			'undefined': function () {
				return BooleanValue.TRUE;
			},
			'string': function () {
				return BooleanValue.FALSE;
			},
			'closure': function () {
				return BooleanValue.FALSE;
			},
			'array': function () {
				return BooleanValue.FALSE;
			},
			'object': function () {
				return BooleanValue.FALSE;
			}
		},
		'null': {
			'null': function () {
				return BooleanValue.TRUE;
			},
			'string': function () {
				return BooleanValue.FALSE;
			},
			'closure': function () {
				return BooleanValue.FALSE;
			},
			'array': function () {
				return BooleanValue.FALSE;
			},
			'object': function () {
				return BooleanValue.FALSE;
			}
		},
		'bool': {
			'bool': function (x, y) {
				return BooleanValue.unmarshal(x.value === y.value);
			}
		},
		'int|float': {
			'int|float': function (x, y) {
				return BooleanValue.unmarshal(x.value === y.value);
			},
			'complex': function (x, y) {
				return BooleanValue.unmarshal(x.value === y.real && !y.imaginary);
			}
		},
		'complex': {
			'int|float': function (x, y) {
				return BooleanValue.unmarshal(!x.imaginary && x.real === y.value);
			},
			'complex': function (x, y) {
				return BooleanValue.unmarshal(x.real === y.real && x.imaginary === y.imaginary);
			}
		},
		'string': {
			'undefined|null': function () {
				return BooleanValue.FALSE;
			},
			'string': function (x, y) {
				return BooleanValue.unmarshal(x.value === y.value);
			}
		},
		'array': {
			'undefined|null': function () {
				return BooleanValue.FALSE;
			},
			'array': function (x, y) {
				if (x.array.length !== y.array.length) {
					return BooleanValue.FALSE;
				} else {
					for (var i = 0; i < x.array.length; i++) {
						// TODO
					}
					return true;
				}
			}
		},
		'object': {
			'undefined|null': function () {
				return BooleanValue.FALSE;
			},
			'object': function () {
				// TODO
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
			'string': function () {
				return BooleanValue.TRUE;
			},
			'closure': function () {
				return BooleanValue.TRUE;
			},
			'array': function () {
				return BooleanValue.TRUE;
			},
			'object': function () {
				return BooleanValue.TRUE;
			}
		},
		'null': {
			'null': function () {
				return BooleanValue.FALSE;
			},
			'string': function () {
				return BooleanValue.TRUE;
			},
			'closure': function () {
				return BooleanValue.TRUE;
			},
			'array': function () {
				return BooleanValue.TRUE;
			},
			'object': function () {
				return BooleanValue.TRUE;
			}
		},
		'bool': {
			'bool': function (x, y) {
				return BooleanValue.unmarshal(x.value !== y.value);
			}
		},
		'int|float': {
			'int|float': function (x, y) {
				return BooleanValue.unmarshal(x.value !== y.value);
			},
			'complex': function (x, y) {
				return BooleanValue.unmarshal(x.value !== y.real || !!y.imaginary);
			}
		},
		'complex': {
			'int|float': function (x, y) {
				return BooleanValue.unmarshal(!!x.imaginary || x.real !== y.value);
			},
			'complex': function (x, y) {
				return BooleanValue.unmarshal(x.real !== y.real || x.imaginary !== y.imaginary);
			}
		},
		'string': {
			'undefined|null': function () {
				return BooleanValue.TRUE;
			},
			'string': function (x, y) {
				return BooleanValue.unmarshal(x.value !== y.value);
			}
		},
		'array': {
			'undefined|null': function () {
				return BooleanValue.TRUE;
			},
			'array': function (x, y) {
				if (x.array.length !== y.array.length) {
					return BooleanValue.TRUE;
				} else {
					for (var i = 0; i < x.array.length; i++) {
						// TODO
					}
					return false;
				}
			}
		},
		'object': {
			'undefined|null': function () {
				return BooleanValue.TRUE;
			},
			'object': function () {
				// TODO
			}
		}
	});
}

exports.NegatedComparisonOperator = NegatedComparisonOperator;

NegatedComparisonOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function LogicalAndOperator() {
	BinaryOperatorNode.call(this, {
		'bool': {
			'bool': function (x, y) {
				return BooleanValue.unmarshal(x.value && y.value);
			}
		}
	});
}

exports.LogicalAndOperator = LogicalAndOperator;

LogicalAndOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function LogicalOrOperator() {
	BinaryOperatorNode.call(this, {
		'bool': {
			'bool': function (x, y) {
				return BooleanValue.unmarshal(x.value || y.value);
			}
		}
	});
}

exports.LogicalOrOperator = LogicalOrOperator;

LogicalOrOperator.prototype = Object.create(BinaryOperatorNode.prototype);


function LogicalXorOperator() {
	BinaryOperatorNode.call(this, {
		'bool': {
			'bool': function (x, y) {
				return BooleanValue.unmarshal(x.value !== y.value);
			}
		}
	});
}

exports.LogicalXorOperator = LogicalXorOperator;

LogicalXorOperator.prototype = Object.create(BinaryOperatorNode.prototype);
