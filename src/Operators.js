var TypeOfOperator = exports.TypeOfOperator = function () {
	UnaryOperatorNode.call(this, {
		'.*': function (x) {
			return new StringValue(x.type);
		}
	});
};

TypeOfOperator.prototype = Object.create(UnaryOperatorNode.prototype);


var LogicalNotOperator = exports.LogicalNotOperator = function () {
	UnaryOperatorNode.call(this, {
		'bool': function (x) {
			return new BooleanValue(!x);
		}
	});
};

LogicalNotOperator.prototype = Object.create(UnaryOperatorNode.prototype);


var BitwiseNotOperator = exports.BitwiseNotOperator = function () {
	UnaryOperatorNode.call(this, {
		'int': function (x) {
			return new IntegerValue(~x);
		}
	});
};

BitwiseNotOperator.prototype = Object.create(UnaryOperatorNode.prototype);


var PlusOperator = exports.PlusOperator = function () {
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
				return new BooleanValue(x.value, y.value);
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
};

PlusOperator.prototype = Object.create(BinaryOperatorNode.prototype);


var MinusOperator = exports.MinusOperator = function () {
	BinaryOperatorNode.call(this, {
		'bool': {
			'bool': function (x, y) {
				return new BooleanValue(x.value && !y.value);
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
};

MinusOperator.prototype = Object.create(BinaryOperatorNode.prototype);


var MultiplyOperator = exports.MultiplyOperator = function () {
	BinaryOperatorNode.call(this, {
		'bool': {
			'bool': function (x, y) {
				return new BooleanValue(x.value && y.value);
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
};

MultiplyOperator.prototype = Object.create(BinaryOperatorNode.prototype);


var DivideOperator = exports.DivideOperator = function () {
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
};

DivideOperator.prototype = Object.create(BinaryOperatorNode.prototype);


var PowerOperator = exports.PowerOperator = function () {
	BinaryOperatorNode.call(this, function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				throw new LambdaRuntimeError();
			} else {
				throw new LambdaRuntimeError();
			}
		} else if (y instanceof NativeComplexValue) {
			throw new LambdaRuntimeError();
		} else {
			return Math.pow(x, y);
		}
	});
};

PowerOperator.prototype = Object.create(BinaryOperatorNode.prototype);


var ModulusOperator = exports.ModulusOperator = function () {
	BinaryOperatorNode.call(this, function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				throw new LambdaRuntimeError();
			} else {
				throw new LambdaRuntimeError();
			}
		} else if (y instanceof NativeComplexValue) {
			throw new LambdaRuntimeError();
		} else {
			return x % y;
		}
	});
};

ModulusOperator.prototype = Object.create(BinaryOperatorNode.prototype);


var LessThanOperator = exports.LessThanOperator = function () {
	BinaryOperatorNode.call(this, function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				throw new LambdaRuntimeError();
			} else {
				throw new LambdaRuntimeError();
			}
		} else if (y instanceof NativeComplexValue) {
			throw new LambdaRuntimeError();
		} else {
			return x < y;
		}
	});
};

LessThanOperator.prototype = Object.create(BinaryOperatorNode.prototype);


var LessThanOrEqualOperator = exports.LessThanOrEqualOperator = function () {
	BinaryOperatorNode.call(this, function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				throw new LambdaRuntimeError();
			} else {
				throw new LambdaRuntimeError();
			}
		} else if (y instanceof NativeComplexValue) {
			throw new LambdaRuntimeError();
		} else {
			return x <= y;
		}
	});
};

LessThanOrEqualOperator.prototype = Object.create(BinaryOperatorNode.prototype);


var GreaterThanOperator = exports.GreaterThanOperator = function () {
	BinaryOperatorNode.call(this, function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				throw new LambdaRuntimeError();
			} else {
				throw new LambdaRuntimeError();
			}
		} else if (y instanceof NativeComplexValue) {
			throw new LambdaRuntimeError();
		} else {
			return x > y;
		}
	});
};

GreaterThanOperator.prototype = Object.create(BinaryOperatorNode.prototype);


var GreaterThanOrEqualOperator = exports.GreaterThanOrEqualOperator = function () {
	BinaryOperatorNode.call(this, function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				throw new LambdaRuntimeError();
			} else {
				throw new LambdaRuntimeError();
			}
		} else if (y instanceof NativeComplexValue) {
			throw new LambdaRuntimeError();
		} else {
			return x >= y;
		}
	});
};

GreaterThanOrEqualOperator.prototype = Object.create(BinaryOperatorNode.prototype);


var BitwiseAndOperator = exports.BitwiseAndOperator = function () {
	BinaryOperatorNode.call(this, function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				throw new LambdaRuntimeError();
			} else {
				throw new LambdaRuntimeError();
			}
		} else if (y instanceof NativeComplexValue) {
			throw new LambdaRuntimeError();
		} else {
			return x & y;
		}
	});
};

BitwiseAndOperator.prototype = Object.create(BinaryOperatorNode.prototype);


var BitwiseOrOperator = exports.BitwiseOrOperator = function () {
	BinaryOperatorNode.call(this, function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				throw new LambdaRuntimeError();
			} else {
				throw new LambdaRuntimeError();
			}
		} else if (y instanceof NativeComplexValue) {
			throw new LambdaRuntimeError();
		} else {
			return x | y;
		}
	});
};

BitwiseOrOperator.prototype = Object.create(BinaryOperatorNode.prototype);


var BitwiseXorOperator = exports.BitwiseXorOperator = function () {
	BinaryOperatorNode.call(this, function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				throw new LambdaRuntimeError();
			} else {
				throw new LambdaRuntimeError();
			}
		} else if (y instanceof NativeComplexValue) {
			throw new LambdaRuntimeError();
		} else {
			return x ^ y;
		}
	});
};

BitwiseXorOperator.prototype = Object.create(BinaryOperatorNode.prototype);


var LeftShiftOperator = exports.LeftShiftOperator = function () {
	BinaryOperatorNode.call(this, function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				throw new LambdaRuntimeError();
			} else {
				throw new LambdaRuntimeError();
			}
		} else if (y instanceof NativeComplexValue) {
			throw new LambdaRuntimeError();
		} else {
			return x << y;
		}
	});
};

LeftShiftOperator.prototype = Object.create(BinaryOperatorNode.prototype);


var RightShiftOperator = exports.RightShiftOperator = function () {
	BinaryOperatorNode.call(this, function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				throw new LambdaRuntimeError();
			} else {
				throw new LambdaRuntimeError();
			}
		} else if (y instanceof NativeComplexValue) {
			throw new LambdaRuntimeError();
		} else {
			return x >> y;
		}
	});
};

RightShiftOperator.prototype = Object.create(BinaryOperatorNode.prototype);


var UnsignedRightShiftOperator = exports.UnsignedRightShiftOperator = function () {
	BinaryOperatorNode.call(this, function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				throw new LambdaRuntimeError();
			} else {
				throw new LambdaRuntimeError();
			}
		} else if (y instanceof NativeComplexValue) {
			throw new LambdaRuntimeError();
		} else {
			return x >>> y;
		}
	});
};

UnsignedRightShiftOperator.prototype = Object.create(BinaryOperatorNode.prototype);


var ComparisonOperator = exports.ComparisonOperator = function () {
	BinaryOperatorNode.call(this, function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				return x.r === y.r && x.i === y.i;
			} else {
				return x.r === y && !x.i;
			}
		} else if (y instanceof NativeComplexValue) {
			return x === y.r && !y.i;
		} else {
			return x === y;
		}
	});
};

ComparisonOperator.prototype = Object.create(BinaryOperatorNode.prototype);


var NegatedComparisonOperator = exports.NegatedComparisonOperator = function () {
	BinaryOperatorNode.call(this, function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				return x.r !== y.r || x.i !== y.i;
			} else {
				return x.r !== y || !!x.i;
			}
		} else if (y instanceof NativeComplexValue) {
			return x !== y.r || !!y.i;
		} else {
			return x !== y;
		}
	});
};

NegatedComparisonOperator.prototype = Object.create(BinaryOperatorNode.prototype);


var LogicalAndOperator = exports.LogicalAndOperator = function () {
	BinaryOperatorNode.call(this, function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				return (!!x.r || !!x.i) && (!!y.r || !!y.i);
			} else {
				return (!!x.r || !!x.i) && !!y;
			}
		} else if (y instanceof NativeComplexValue) {
			return !!x && (!!y.r || !!y.i);
		} else {
			return !!x && !!y;
		}
	});
};

LogicalAndOperator.prototype = Object.create(BinaryOperatorNode.prototype);


var LogicalOrOperator = exports.LogicalOrOperator = function () {
	BinaryOperatorNode.call(this, function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				return !!x.r || !!x.i || !!y.r || !!y.i;
			} else {
				return !!x.r || !!x.i || !!y;
			}
		} else if (y instanceof NativeComplexValue) {
			return !!x || !!y.r || !!y.i;
		} else {
			return !!x || !!y;
		}
	});
};

LogicalOrOperator.prototype = Object.create(BinaryOperatorNode.prototype);


var LogicalXorOperator = exports.LogicalXorOperator = function () {
	BinaryOperatorNode.call(this, function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				return (!!x.r || !!x.i) !== (!!y.r || !!y.i);
			} else {
/*jshint ignore:start */
				return (!!x.r || !!x.i) !== !!y;
/*jshint ignore:end */
			}
		} else if (y instanceof NativeComplexValue) {
/*jshint ignore:start */
			return !!x !== (!!y.r || !!y.i);
/*jshint ignore:end */
		} else {
/*jshint ignore:start */
			return !!x !== !!y;
/*jshint ignore:end */
		}
	});
};

LogicalXorOperator.prototype = Object.create(BinaryOperatorNode.prototype);
