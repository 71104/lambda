function AbstractValue() {}

exports.AbstractValue = AbstractValue;

AbstractValue.prototype.is = function (Class) {
	return this instanceof Class;
};

AbstractValue.prototype.isAny = function () {
	for (var i = 0; i < arguments.length; i++) {
		if (this instanceof arguments[i]) {
			return true;
		}
	}
	return false;
};

AbstractValue.prototype.bindThis = function () {
	return this;
};


function UndefinedValue() {
	AbstractValue.call(this);
}

exports.UndefinedValue = UndefinedValue;

UndefinedValue.prototype = Object.create(AbstractValue.prototype);

UndefinedValue.prototype.type = 'undefined';

UndefinedValue.prototype.toString = function () {
	return 'undefined';
};

UndefinedValue.prototype.marshal = function () {};

UndefinedValue.INSTANCE = new UndefinedValue();


function NullValue() {
	AbstractValue.call(this);
}

exports.NullValue = NullValue;

NullValue.prototype = Object.create(AbstractValue.prototype);

NullValue.prototype.type = 'null';

NullValue.prototype.toString = function () {
	return 'null';
};

NullValue.prototype.marshal = function () {
	return null;
};

NullValue.INSTANCE = new NullValue();


function BooleanValue(value) {
	AbstractValue.call(this);
	this.value = !!value;
}

exports.BooleanValue = BooleanValue;

BooleanValue.prototype = Object.create(AbstractValue.prototype);

BooleanValue.prototype.type = 'bool';

BooleanValue.prototype.toString = function () {
	if (this.value) {
		return 'true';
	} else {
		return 'false';
	}
};

BooleanValue.prototype.marshal = function () {
	return this.value;
};

BooleanValue.TRUE = new BooleanValue(true);
BooleanValue.FALSE = new BooleanValue(false);

BooleanValue.unmarshal = function (value) {
	if (value) {
		return BooleanValue.TRUE;
	} else {
		return BooleanValue.FALSE;
	}
};


function IntegerValue(value) {
	AbstractValue.call(this);
	this.value = ~~value;
}

exports.IntegerValue = IntegerValue;

IntegerValue.prototype = Object.create(AbstractValue.prototype);

IntegerValue.prototype.type = 'int';

IntegerValue.prototype.toString = function () {
	return '' + this.value;
};

IntegerValue.prototype.marshal = function () {
	return this.value;
};


function FloatValue(value) {
	AbstractValue.call(this);
	this.value = value * 1;
}

exports.FloatValue = FloatValue;

FloatValue.prototype = Object.create(AbstractValue.prototype);

FloatValue.prototype.type = 'float';

FloatValue.prototype.toString = function () {
	return '' + this.value;
};

FloatValue.prototype.marshal = function () {
	return this.value;
};


function NativeComplexValue(real, imaginary) {
	this.r = real;
	this.i = imaginary;
}

NativeComplexValue.prototype.toString = function () {
	if (this.i < 0) {
		return this.r + '-' + -this.i + 'i';
	} else {
		return this.r + '+' + this.i + 'i';
	}
};


function ComplexValue(real, imaginary) {
	AbstractValue.call(this);
	real = real * 1;
	imaginary = imaginary * 1;
	this.real = real;
	this.imaginary = imaginary;
	this.prototype = new Context({
		real: new FloatValue(real),
		imaginary: new FloatValue(imaginary)
	});
}

exports.ComplexValue = ComplexValue;

ComplexValue.prototype = Object.create(AbstractValue.prototype);

ComplexValue.prototype.type = 'complex';

ComplexValue.prototype.toString = function () {
	if (this.imaginary < 0) {
		return this.real + '-' + -this.imaginary + 'i';
	} else {
		return this.real + '+' + this.imaginary + 'i';
	}
};

ComplexValue.prototype.marshal = function () {
	return new NativeComplexValue(this.real, this.imaginary);
};


function Closure(lambda, context) {
	AbstractValue.call(this);
	this.lambda = lambda;
	this.context = context;
}

exports.Closure = Closure;

Closure.prototype = Object.create(AbstractValue.prototype);

Closure.prototype.type = 'closure';

Closure.prototype.toString = function () {
	return 'closure';
};

Closure.prototype.bindThis = function (value) {
	return new Closure(this.lambda, this.context.add('this', value));
};

Closure.prototype.marshal = function () {
	var length = 0;
	for (var node = this.lambda; node.is(LambdaNode); node = node.body) {
		length++;
	}
	node = this.lambda;
	var context = this.context;
	return function () {
		var values = arguments;
		return (function augment(node, context, index) {
			if (index < length) {
				return augment(node.body, context.add(node.name, AbstractValue.unmarshal(values[index])), index + 1);
			} else {
				return (function () {
					try {
						return node.evaluate(context);
					} catch (e) {
						if (e instanceof LambdaUserError) {
							throw e.value.marshal();
						} else {
							throw e;
						}
					}
				}()).marshal();
			}
		}(node, context, 0));
	};
};

Closure.unmarshal = function (value, context) {
	return new Closure((function makeLambda(index, names) {
		if (index < Math.max(value.length, 1)) {
			var name = '' + index;
			names.push(name);
			return new LambdaNode(name, makeLambda(index + 1, names));
		} else {
			return new NativeNode(value, names);
		}
	}(0, [])), context || Context.EMPTY);
};

Closure.prototype.getLength = function () {
	var length = 0;
	for (var node = this.lambda; node.is(LambdaNode); node = node.body) {
		length++;
	}
	return length;
};


function LazyValue(expression, context) {
	AbstractValue.call(this);
	this.expression = expression;
	this.context = context;
}

exports.LazyValue = LazyValue;

LazyValue.prototype = Object.create(AbstractValue.prototype);

LazyValue.prototype.type = 'lazy';

LazyValue.prototype.toString = function () {
	return 'lazy';
};

LazyValue.prototype.bindThis = function (value) {
	return new LazyValue(this.expression, this.context.add('this', value));
};

LazyValue.prototype.marshal = function () {
	var node = this.expression;
	var context = this.context;
	return function () {
		return (function () {
			try {
				return node.evaluate(context);
			} catch (e) {
				if (e instanceof LambdaUserError) {
					throw e.value.marshal();
				} else {
					throw e;
				}
			}
		}()).marshal();
	};
};

LazyValue.unmarshal = function (value, context) {
	return new LazyValue(new NativeNode(value, []), context || Context.EMPTY);
};

LazyValue.evaluate = function (value) {
	if (value.is(LazyValue)) {
		return value.expression.evaluate(value.context);
	} else {
		return value;
	}
};


function StringValue(value) {
	AbstractValue.call(this);
	this.value = '' + value;
}

exports.StringValue = StringValue;

StringValue.prototype = Object.create(AbstractValue.prototype);

StringValue.prototype.type = 'string';

StringValue.prototype.toString = function () {
	return '\"' + this.value.replace(/\\/g, '\\\\').replace(/\"/g, '\\\"') + '\"';
};

StringValue.prototype.marshal = function () {
	return this.value;
};


function ArrayValue(array) {
	AbstractValue.call(this);
	this.array = array = array || [];
}

exports.ArrayValue = ArrayValue;

ArrayValue.prototype = Object.create(AbstractValue.prototype);

ArrayValue.prototype.type = 'array';

ArrayValue.prototype.toString = function () {
	return '{ ' + this.array.map(function (element) {
		return element.toString();
	}).join(', ') + ' }';
};

ArrayValue.prototype.marshal = function () {
	return this.array.map(function (value) {
		return value.marshal();
	});
};


function NativeArrayValue(array) {
	AbstractValue.call(this);
	this.array = array;
}

exports.NativeArrayValue = NativeArrayValue;

NativeArrayValue.prototype = Object.create(AbstractValue.prototype);

NativeArrayValue.prototype.type = 'array';

NativeArrayValue.prototype.toString = function () {
	return '{ ' + this.array.map(function (element) {
		return AbstractValue.unmarshal(element).toString();
	}).join(', ') + ' }';
};

NativeArrayValue.prototype.marshal = function () {
	return this.array;
};


function ObjectValue(context) {
	AbstractValue.call(this);
	this.context = context || Context.EMPTY;
}

exports.ObjectValue = ObjectValue;

ObjectValue.prototype = Object.create(AbstractValue.prototype);

ObjectValue.prototype.type = 'object';

ObjectValue.prototype.toString = function () {
	return 'object';
};

ObjectValue.prototype.marshal = function () {
	var object = {};
	this.context.forEach(function (name, value) {
		object[name] = value.marshal();
	});
	return object;
};


function NativeContext(object) {
	this.object = object;
}

exports.NativeContext = NativeContext;

NativeContext.prototype.has = function (name) {
	return name in this.object;
};

NativeContext.prototype.top = function (name) {
	return AbstractValue.unmarshal(this.object[name]);
};

NativeContext.prototype.add = function (name, value) {
	function NativeObject() {}
	NativeObject.prototype = this.object;
	var object = new NativeObject();
	object[name] = value.marshal();
	return new NativeContext(object);
};


function NativeObjectValue(context) {
	AbstractValue.call(this);
	this.context = context;
}

exports.NativeObjectValue = NativeObjectValue;

NativeObjectValue.prototype = Object.create(AbstractValue.prototype);

NativeObjectValue.prototype.type = 'object';

NativeObjectValue.prototype.toString = function () {
	return 'object';
};

NativeObjectValue.prototype.marshal = function () {
	return this.context.object;
};


AbstractValue.unmarshal = function (value) {
	switch (typeof value) {
	case 'undefined':
		return UndefinedValue.INSTANCE;
	case 'boolean':
		return BooleanValue.unmarshal(value);
	case 'number':
		if (value % 1) {
			return new FloatValue(value);
		} else {
			return new IntegerValue(~~value);
		}
		break;
	case 'string':
		return new StringValue(value);
	case 'function':
		return Closure.unmarshal(value);
	case 'object':
		if (value === null) {
			return NullValue.INSTANCE;
		} else if (Array.isArray(value)) {
			return new NativeArrayValue(value);
		} else if (value instanceof NativeComplexValue) {
			return new ComplexValue(value.r, value.i);
		} else {
			return new NativeObjectValue(new NativeContext(value));
		}
		break;
	}
};
