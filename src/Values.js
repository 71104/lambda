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

NullValue.INSTANCE = new NullValue();


var UndefinedValue = exports.UndefinedValue = function () {
	AbstractValue.call(this);
};

UndefinedValue.prototype = Object.create(AbstractValue.prototype);

UndefinedValue.prototype.toString = function () {
	return 'undefined';
};

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


var IntegerValue = exports.IntegerValue = function (value) {
	AbstractValue.call(this);
	this.value = value;
};

IntegerValue.prototype = Object.create(AbstractValue.prototype);

IntegerValue.prototype.toString = function () {
	return '' + this.value;
};


var FloatValue = exports.FloatValue = function (value) {
	AbstractValue.call(this);
	this.value = value;
};

FloatValue.prototype = Object.create(AbstractValue.prototype);

FloatValue.prototype.toString = function () {
	return '' + this.value;
};


var StringValue = exports.StringValue = function (value) {
	AbstractValue.call(this);
	this.value = value;
};

StringValue.prototype = Object.create(AbstractValue.prototype);

StringValue.prototype.toString = function () {
	return '' + this.value;
};


var ArrayValue = exports.ArrayValue = function () {
	AbstractValue.call(this);
	this.array = [];
};

ArrayValue.prototype = Object.create(AbstractValue.prototype);

ArrayValue.prototype.toString = function () {
	return '[ ' + this.array.map(function (element) {
		return element.toString();
	}).join(', ') + ' ]';
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


var Closure = exports.Closure = function (name, body, context) {
	AbstractValue.call(this);
	this.name = name;
	this.body = body;
	this.context = context;
};

Closure.prototype = Object.create(AbstractValue.prototype);

Closure.prototype.toString = function () {
	// TODO
	return 'closure';
};


AbstractValue.wrap = function (value) {
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
		// TODO
		break;
	case 'object':
		if (value === null) {
			return NullValue.INSTANCE;
		} else if (Array.isArray(value)) {
			var result = new ArrayValue();
			result.array = value.map(function (element) {
				return AbstractValue.wrap(element);
			});
			return result;
		} else {
			var context = new Context();
			for (var key in value) {
				if (value.hasOwnProperty(key)) {
					context.push(key, AbstractValue.wrap(value[key]));
				}
			}
			return new ObjectValue(context);
		}
	}
};
