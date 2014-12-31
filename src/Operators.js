var TypeOfOperator = exports.TypeOfOperator = function () {
	UnaryOperatorNode.call(this, {
		'undefined': function () {
			return 'undefined';
		},
		'null': function () {
			return 'null';
		},
		'bool': function () {
			return 'bool';
		},
		'int': function () {
			return 'int';
		},
		'float': function () {
			return 'float';
		},
		'complex': function () {
			return 'complex';
		},
		'string': function () {
			return 'string';
		},
		'array': function () {
			return 'array';
		},
		'object': function () {
			return 'object';
		}
	});
};

TypeOfOperator.prototype = Object.create(UnaryOperatorNode.prototype);


var LogicalNotOperator = exports.LogicalNotOperator = function () {
	UnaryOperatorNode.call(this, {
		'bool': function (x) {
			return !x;
		}
	});
};

LogicalNotOperator.prototype = Object.create(UnaryOperatorNode.prototype);


var BitwiseNotOperator = exports.BitwiseNotOperator = function () {
	UnaryOperatorNode.call(this, {
		'int': function (x) {
			return ~x;
		}
	});
};

BitwiseNotOperator.prototype = Object.create(UnaryOperatorNode.prototype);


var PlusOperator = exports.PlusOperator = function () {
	BinaryOperatorNode.call(this, function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				return new NativeComplexValue(x.r + y.r, x.i + y.i);
			} else if (typeof y === 'string') {
				return x.toString() + y;
			} else {
				return new NativeComplexValue(x.r + ~~y, x.i);
			}
		} else if (y instanceof NativeComplexValue) {
			if (typeof x === 'string') {
				return x + y.toString();
			} else {
				return new NativeComplexValue(~~x + y.r, y.i);
			}
		} else {
			return x + y;
		}
	});
};

PlusOperator.prototype = Object.create(BinaryOperatorNode.prototype);


var MinusOperator = exports.MinusOperator = function () {
	BinaryOperatorNode.call(this, function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				return new NativeComplexValue(x.r - y.r, x.i - y.i);
			} else {
				return new NativeComplexValue(x.r - ~~y, x.i);
			}
		} else if (y instanceof NativeComplexValue) {
			return new NativeComplexValue(~~x - y.r, -y.i);
		} else {
			return x - y;
		}
	});
};

MinusOperator.prototype = Object.create(BinaryOperatorNode.prototype);


var MultiplyOperator = exports.MultiplyOperator = function () {
	BinaryOperatorNode.call(this, function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				return new NativeComplexValue(x.r * y.r - x.i * y.i, x.r * y.i + x.i * y.r);
			} else {
				return new NativeComplexValue(x.r * ~~y, x.i * ~~y);
			}
		} else if (y instanceof NativeComplexValue) {
			return new NativeComplexValue(~~x * y.r, ~~x * y.i);
		} else {
			return x * y;
		}
	});
};

MultiplyOperator.prototype = Object.create(BinaryOperatorNode.prototype);


var DivideOperator = exports.DivideOperator = function () {
	BinaryOperatorNode.call(this, function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				return new NativeComplexValue((x.r * y.r + x.i * y.i) / (y.r * y.r + y.i * y.i), (x.i * y.r - x.r * y.i) / (y.r * y.r + y.i * y.i));
			} else {
				return new NativeComplexValue(x.r / ~~y, x.i / ~~y);
			}
		} else if (y instanceof NativeComplexValue) {
			return new NativeComplexValue(~~x * y.r / (y.r * y.r + y.i * y.i), ~~x * y.i / (y.r * y.r + y.i * y.i));
		} else {
			return x / y;
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
