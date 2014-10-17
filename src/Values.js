var AbstractValue = exports.AbstractValue = function () {};

AbstractValue.prototype.is = function (Class) {
	return this instanceof Class;
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
	this.value = value;
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
	this.value = value;
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
	this.value = value;
};

FloatValue.prototype = Object.create(AbstractValue.prototype);

FloatValue.prototype.toString = function () {
	return '' + this.value;
};

FloatValue.prototype.marshal = function () {
	return this.value;
};


var ComplexValue = exports.ComplexValue = function (real, imaginary) {
	AbstractValue.call(this);
	this.real = real;
	this.imaginary = imaginary;
};

ComplexValue.prototype = Object.create(AbstractValue.prototype);

ComplexValue.prototype.toString = function () {
	if (this.imaginary < 0) {
		return this.real + '-' + -this.imaginary + 'i';
	} else {
		return this.real + '+' + this.imaginary + 'i';
	}
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

ComplexValue.prototype.marshal = function () {
	return new NativeComplexValue(this.real, this.imaginary);
};


var StringValue = exports.StringValue = function (value) {
	AbstractValue.call(this);
	this.value = value;
};

StringValue.prototype = Object.create(AbstractValue.prototype);

StringValue.prototype.toString = function () {
	return '' + this.value;
};

StringValue.prototype.marshal = function () {
	return this.value;
};


var ArrayValue = exports.ArrayValue = function (array) {
	AbstractValue.call(this);
	this.array = array || [];
};

ArrayValue.prototype = Object.create(AbstractValue.prototype);

ArrayValue.prototype.toString = function () {
	if (this.array.length > 0) {
		return '[ ' + this.array.map(function (element) {
			return element.toString();
		}).join(', ') + ' ]';
	} else {
		return '[]';
	}
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


var Closure = exports.Closure = function (lambda, context) {
	AbstractValue.call(this);
	this.lambda = lambda;
	this.context = context;
};

Closure.prototype = Object.create(AbstractValue.prototype);


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
			var result = new ArrayValue();
			result.array = value.map(function (element) {
				return AbstractValue.unmarshal(element);
			});
			return result;
		} else if (value instanceof NativeComplexValue) {
			return new ComplexValue(value.r, value.i);
		} else {
			var context = new Context();
			for (var key in value) {
				if (value.hasOwnProperty(key)) {
					context.push(key, AbstractValue.unmarshal(value[key]));
				}
			}
			return new ObjectValue(context);
		}
	}
};
