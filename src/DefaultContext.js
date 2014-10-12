var DefaultContext = exports.DefaultContext = function () {
	Context.call(this);

	var that = this;

	function registerUnaryOperator(symbol, operator) {
		return that.push(symbol, (new LambdaNode('0', null, new NativeNode(operator, null, ['0']))).evaluate(that));
	}

	function registerBinaryOperator(symbol, operator) {
		return that.push(symbol, (new LambdaNode('0', null, new LambdaNode('1', null, new NativeNode(operator, null, ['0', '1'])))).evaluate(that));
	}

	registerUnaryOperator('not', function (x) {
		if (x instanceof NativeComplexValue) {
			return !x.r && !x.i;
		} else {
			return !x;
		}
	});

	registerUnaryOperator('~', function (x) {
		if (x instanceof NativeComplexValue) {
			throw new MyRuntimeError();
		} else {
			return ~x;
		}
	});

	registerBinaryOperator('+', function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				return new NativeComplexValue(x.r + y.r, x.i + y.i);
			} else {
				return new NativeComplexValue(x.r + y, x.i);
			}
		} else if (y instanceof NativeComplexValue) {
			return new NativeComplexValue(x + y.r, y.i);
		} else {
			return x + y;
		}
	});

	registerBinaryOperator('-', function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				return new NativeComplexValue(x.r - y.r, x.i - y.i);
			} else {
				return new NativeComplexValue(x.r - y, x.i);
			}
		} else if (y instanceof NativeComplexValue) {
			return new NativeComplexValue(x - y.r, y.i);
		} else {
			return x - y;
		}
	});

	registerBinaryOperator('*', function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				return new NativeComplexValue(x.r * y.r - x.i * y.i, x.r * y.i + x.i * y.r);
			} else {
				return new NativeComplexValue(x.r * y, x.i * y);
			}
		} else if (y instanceof NativeComplexValue) {
			return new NativeComplexValue(x * y.r, x * y.i);
		} else {
			return x * y;
		}
	});

	registerBinaryOperator('/', function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				return new NativeComplexValue((x.r * y.r + x.i * y.i) / (y.r * y.r + y.i * y.i), (x.i * y.r - x.r * y.i) / (y.r * y.r + y.i * y.i));
			} else {
				return new NativeComplexValue(x.r / y, x.i / y);
			}
		} else if (y instanceof NativeComplexValue) {
			return new NativeComplexValue(x * y.r / (y.r * y.r + y.i * y.i), -x * y.i / (y.r * y.r + y.i * y.i));
		} else {
			return x / y;
		}
	});

	registerBinaryOperator('%', function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				throw new MyRuntimeError();
			} else {
				throw new MyRuntimeError();
			}
		} else if (y instanceof NativeComplexValue) {
			throw new MyRuntimeError();
		} else {
			return x % y;
		}
	});

	registerBinaryOperator('<', function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				throw new MyRuntimeError();
			} else {
				throw new MyRuntimeError();
			}
		} else if (y instanceof NativeComplexValue) {
			throw new MyRuntimeError();
		} else {
			return x < y;
		}
	});

	registerBinaryOperator('>', function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				throw new MyRuntimeError();
			} else {
				throw new MyRuntimeError();
			}
		} else if (y instanceof NativeComplexValue) {
			throw new MyRuntimeError();
		} else {
			return x > y;
		}
	});

	registerBinaryOperator('&', function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				throw new MyRuntimeError();
			} else {
				throw new MyRuntimeError();
			}
		} else if (y instanceof NativeComplexValue) {
			throw new MyRuntimeError();
		} else {
			return x & y;
		}
	});

	registerBinaryOperator('|', function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				throw new MyRuntimeError();
			} else {
				throw new MyRuntimeError();
			}
		} else if (y instanceof NativeComplexValue) {
			throw new MyRuntimeError();
		} else {
			return x | y;
		}
	});

	registerBinaryOperator('^', function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				throw new MyRuntimeError();
			} else {
				throw new MyRuntimeError();
			}
		} else if (y instanceof NativeComplexValue) {
			throw new MyRuntimeError();
		} else {
			return x ^ y;
		}
	});

	registerBinaryOperator('=', function (x, y) {
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

	registerBinaryOperator('!=', function (x, y) {
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

	registerBinaryOperator('>=', function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				throw new MyRuntimeError();
			} else {
				throw new MyRuntimeError();
			}
		} else if (y instanceof NativeComplexValue) {
			throw new MyRuntimeError();
		} else {
			return x >= y;
		}
	});

	registerBinaryOperator('<=', function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				throw new MyRuntimeError();
			} else {
				throw new MyRuntimeError();
			}
		} else if (y instanceof NativeComplexValue) {
			throw new MyRuntimeError();
		} else {
			return x <= y;
		}
	});

	registerBinaryOperator('**', function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				throw new MyRuntimeError();
			} else {
				throw new MyRuntimeError();
			}
		} else if (y instanceof NativeComplexValue) {
			throw new MyRuntimeError();
		} else {
			return Math.pow(x, y);
		}
	});

	/*jshint ignore: start */

	registerBinaryOperator('and', function (x, y) {
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

	registerBinaryOperator('or', function (x, y) {
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

	registerBinaryOperator('xor', function (x, y) {
		if (x instanceof NativeComplexValue) {
			if (y instanceof NativeComplexValue) {
				return (!!x.r || !!x.i) !== (!!y.r || !!y.i);
			} else {
				return (!!x.r || !!x.i) !== !!y;
			}
		} else if (y instanceof NativeComplexValue) {
			return !!x !== (!!y.r || !!y.i);
		} else {
			return !!x !== !!y;
		}
	});

	/*jshint ignore: end */
};

DefaultContext.prototype = Object.create(Context.prototype);
