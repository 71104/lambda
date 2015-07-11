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


var UndefinedValue = exports.UndefinedValue = function () {
	AbstractValue.call(this);
};

UndefinedValue.prototype = Object.create(AbstractValue.prototype);

UndefinedValue.prototype.type = 'undefined';

UndefinedValue.prototype.toString = function () {
	return 'undefined';
};

UndefinedValue.prototype.marshal = function () {};

UndefinedValue.INSTANCE = new UndefinedValue();


var NullValue = exports.NullValue = function () {
	AbstractValue.call(this);
};

NullValue.prototype = Object.create(AbstractValue.prototype);

NullValue.prototype.type = 'null';

NullValue.prototype.toString = function () {
	return 'null';
};

NullValue.prototype.marshal = function () {
	return null;
};

NullValue.INSTANCE = new NullValue();


var BooleanValue = exports.BooleanValue = function (value) {
	AbstractValue.call(this);
	this.value = !!value;
};

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


var IntegerValue = exports.IntegerValue = function (value) {
	AbstractValue.call(this);
	this.value = ~~value;
};

IntegerValue.prototype = Object.create(AbstractValue.prototype);

IntegerValue.prototype.type = 'int';

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


var ComplexValue = exports.ComplexValue = function (real, imaginary) {
	AbstractValue.call(this);
	real = real * 1;
	imaginary = imaginary * 1;
	this.real = real;
	this.imaginary = imaginary;
	this.prototype = new Context({
		real: new FloatValue(real),
		imaginary: new FloatValue(imaginary)
	});
};

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

StringValue.prototype.type = 'string';

StringValue.prototype.toString = function () {
	return '\"' + this.value.replace(/\\/g, '\\\\').replace(/\"/g, '\\\"') + '\"';
};

StringValue.prototype.marshal = function () {
	return this.value;
};


var ArrayValue = exports.ArrayValue = function (array) {
	AbstractValue.call(this);
	this.array = array = array || [];
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
		filter: Closure.unmarshal(function (callback) {
			var result = [];
			for (var i = 0; i < array.length; i++) {
				var value = array[i].marshal();
				if (callback(value)) {
					result.push(value);
				}
			}
			return result;
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
		}),
		reduceRight: Closure.unmarshal(function (callback, value) {
			for (var i = array.length - 1; i >= 0; i--) {
				value = callback(value, array[i].marshal());
			}
			return value;
		}),
		sort: Closure.unmarshal(function (compare) {
			return array.map(function (element) {
				return element.marshal();
			}).sort(function (a, b) {
				if (!compare(a, b)) {
					return 1;
				} else if (!compare(b, a)) {
					return -1;
				} else {
					return 0;
				}
			});
		})
	});
};

ArrayValue.prototype = Object.create(AbstractValue.prototype);

ArrayValue.prototype.type = 'array';

ArrayValue.prototype.toString = function () {
	return '{ ' + this.array.map(function (element) {
		return element.toString();
	}).join(', ') + ' }';
};

ArrayValue.prototype.marshal = function (dictionary) {
	if (!dictionary) {
		dictionary = new Dictionary();
	}
	if (dictionary.has(this)) {
		return dictionary.get(this);
	} else {
		var marshalled = [];
		dictionary.put(this, marshalled);
		this.array.forEach(function (value) {
			marshalled.push(value.marshal(dictionary));
		});
		return marshalled;
	}
};

ArrayValue.unmarshal = function (value, dictionary) {
	if (!dictionary) {
		dictionary = new Dictionary();
	}
	if (dictionary.has(value)) {
		return dictionary.get(value);
	} else {
		var unmarshalled = new ArrayValue();
		dictionary.put(value, unmarshalled);
		unmarshalled.array = value.map(function (element) {
			return AbstractValue.unmarshal(element, dictionary);
		});
		return unmarshalled;
	}
};


var ObjectValue = exports.ObjectValue = function (context) {
	AbstractValue.call(this);
	this.context = context;
};

ObjectValue.prototype = Object.create(AbstractValue.prototype);

ObjectValue.prototype.type = 'object';

ObjectValue.prototype.toString = function () {
	// TODO
	return 'object';
};

ObjectValue.prototype.marshal = function (dictionary) {
	if (!dictionary) {
		dictionary = new Dictionary();
	}
	if (dictionary.has(this)) {
		return dictionary.get(this);
	} else {
		var object = {};
		dictionary.put(this, object);
		this.context.forEach(function (name, value) {
			object[name] = value.marshal(dictionary);
		});
		return object;
	}
};

ObjectValue.unmarshal = function (value, dictionary) {
	if (!dictionary) {
		dictionary = new Dictionary();
	}
	if (dictionary.has(value)) {
		return dictionary.get(value);
	} else {
		var unmarshalled = new ObjectValue(new Context());
		dictionary.put(value, unmarshalled);
		Object.getOwnPropertyNames(value).union(Object.keys(value)).forEach(function (name) {
			unmarshalled.context.overwrite(name, AbstractValue.unmarshal(value[name], dictionary));
		});
		return unmarshalled;
	}
};


AbstractValue.unmarshal = function (value, dictionary) {
	if (!dictionary) {
		dictionary = new Dictionary();
	}
	switch (typeof value) {
	case 'undefined':
		return UndefinedValue.INSTANCE;
	case 'boolean':
		return BooleanValue.unmarshal(value);
	case 'number':
		return new FloatValue(value);
	case 'string':
		return new StringValue(value);
	case 'function':
		return Closure.unmarshal(value);
	case 'object':
		if (value === null) {
			return NullValue.INSTANCE;
		} else if (dictionary.has(value)) {
			return dictionary.get(value);
		} else if (Array.isArray(value)) {
			return ArrayValue.unmarshal(value, dictionary);
		} else if (value instanceof NativeComplexValue) {
			return new ComplexValue(value.r, value.i);
		} else {
			return ObjectValue.unmarshal(value, dictionary);
		}
	}
};
