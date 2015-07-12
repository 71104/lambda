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

AbstractValue.prototype.bindThis = function () {
	return this;
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
	this.prototype = this.prototype.add('length', new IntegerValue(this.getLength()));
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
	this.prototype = this.prototype.add('length', new IntegerValue(array.length));
};

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

ArrayValue.unmarshal = function (value) {
	return new ArrayValue(value.map(function (element) {
		return AbstractValue.unmarshal(element);
	}));
};


var ObjectValue = exports.ObjectValue = function (context) {
	AbstractValue.call(this);
	this.context = context;
};

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


var NativeContext = exports.NativeContext = function (object) {
	this.object = object;
};

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


var NativeObjectValue = exports.NativeObjectValue = function (context) {
	AbstractValue.call(this);
	this.context = context;
};

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
		return new FloatValue(value);
	case 'string':
		return new StringValue(value);
	case 'function':
		return Closure.unmarshal(value);
	case 'object':
		if (value === null) {
			return NullValue.INSTANCE;
		} else if (Array.isArray(value)) {
			return ArrayValue.unmarshal(value);
		} else if (value instanceof NativeComplexValue) {
			return new ComplexValue(value.r, value.i);
		} else {
			return new NativeObjectValue(new NativeContext(value));
		}
	}
};
