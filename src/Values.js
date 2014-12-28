var AbstractValue = exports.AbstractValue = function () {};

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


var NullValue = exports.NullValue = function () {
	AbstractValue.call(this);
};

NullValue.prototype = Object.create(AbstractValue.prototype);

NullValue.prototype.toString = function () {
	return 'null';
};

NullValue.prototype.marshal = function () {
	return null;
};

NullValue.INSTANCE = new NullValue();


var UndefinedValue = exports.UndefinedValue = function () {
	AbstractValue.call(this);
};

UndefinedValue.prototype = Object.create(AbstractValue.prototype);

UndefinedValue.prototype.toString = function () {
	return 'undefined';
};

UndefinedValue.prototype.marshal = function () {};

UndefinedValue.INSTANCE = new UndefinedValue();


var BooleanValue = exports.BooleanValue = function (value) {
	AbstractValue.call(this);
	this.value = !!value;
};

BooleanValue.prototype = Object.create(AbstractValue.prototype);

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


var IntegerValue = exports.IntegerValue = function (value) {
	AbstractValue.call(this);
	this.value = ~~value;
};

IntegerValue.prototype = Object.create(AbstractValue.prototype);

IntegerValue.prototype.toString = function () {
	return '' + this.value;
};

IntegerValue.prototype.marshal = function () {
	return this.value;
};


var FloatValue = exports.FloatValue = function (value) {
	AbstractValue.call(this);
	this.value = value * 1;
};

FloatValue.prototype = Object.create(AbstractValue.prototype);

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


var ComplexValue = exports.ComplexValue = function (real, imaginary) {
	AbstractValue.call(this);
	this.real = real * 1;
	this.imaginary = imaginary * 1;
};

ComplexValue.prototype = Object.create(AbstractValue.prototype);

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


var Closure = exports.Closure = function (lambda, context) {
	AbstractValue.call(this);
	this.lambda = lambda;
	this.context = context;
};

Closure.prototype = Object.create(AbstractValue.prototype);


var StringValue = exports.StringValue = function (value) {
	AbstractValue.call(this);
	this.value = '' + value;
	this.prototype = new Context({
		length: new IntegerValue(value.length)
	});
};

StringValue.prototype = Object.create(AbstractValue.prototype);

StringValue.prototype.toString = function () {
	return this.value;
};

StringValue.prototype.marshal = function () {
	return this.value;
};


var ArrayValue = exports.ArrayValue = function (array) {
	AbstractValue.call(this);
	this.array = array || [];
	this.prototype = new Context({
		length: new IntegerValue(array.length),
		concat: Closure.unmarshal(function (other) {
			return array.map(function (value) {
				return value.marshal();
			}).concat(other);
		}),
		join: Closure.unmarshal(function (glue) {
			return array.map(function (value) {
				return value.marshal();
			}).join(glue);
		}),
		forEach: Closure.unmarshal(function (callback) {
			for (var i = 0; i < array.length; i++) {
				callback(array[i].marshal());
			}
		}),
		some: Closure.unmarshal(function (callback) {
			for (var i = 0; i < array.length; i++) {
				if (callback(array[i].marshal())) {
					return true;
				}
			}
			return false;
		}),
		every: Closure.unmarshal(function (callback) {
			for (var i = 0; i < array.length; i++) {
				if (!callback(array[i].marshal())) {
					return false;
				}
			}
			return true;
		}),
		map: Closure.unmarshal(function (callback) {
			var result = [];
			for (var i = 0; i < array.length; i++) {
				result.push(callback(array[i].marshal()));
			}
			return result;
		}),
		reduce: Closure.unmarshal(function (callback, value) {
			for (var i = 0; i < array.length; i++) {
				value = callback(value, array[i].marshal());
			}
			return value;
		})
	});
};

ArrayValue.prototype = Object.create(AbstractValue.prototype);

ArrayValue.prototype.toString = function () {
	return '[ ' + this.array.map(function (element) {
		return element.toString();
	}).join(', ') + ' ]';
};

ArrayValue.prototype.marshal = function () {
	return this.array.map(function (value) {
		return value.marshal();
	});
};


var ObjectValue = exports.ObjectValue = function (context) {
	AbstractValue.call(this);
	this.context = context;
};

ObjectValue.prototype = Object.create(AbstractValue.prototype);

ObjectValue.prototype.toString = function () {
	// TODO
	return 'object';
};

ObjectValue.prototype.marshal = function () {
	var object = {};
	this.context.forEach(function (name, value) {
		object[name] = value.marshal();
	});
	return object;
};


AbstractValue.unmarshal = function (value) {
	switch (typeof value) {
	case 'undefined':
		return UndefinedValue.INSTANCE;
	case 'boolean':
		return new BooleanValue(value);
	case 'number':
		return new FloatValue(value);
	case 'string':
		return new StringValue(value);
	case 'function':
		return Closure.unmarshal(value);
	case 'object':
		if (value === null) {
			return NullValue.INSTANCE;
		} else if (Array.isArray(value)) {
			return new ArrayValue(value.map(function (element) {
				return AbstractValue.unmarshal(element);
			}));
		} else if (value instanceof NativeComplexValue) {
			return new ComplexValue(value.r, value.i);
		} else {
			var hash = {};
			for (var key in value) {
				/*jshint forin: false */
				hash[key] = AbstractValue.unmarshal(value[key]);
			}
			return new ObjectValue(new Context(hash));
		}
	}
};
