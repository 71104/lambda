function AbstractValue() {}

AbstractValue.prototype.is = function (Class) {
	return this instanceof Class;
};

AbstractValue.wrap = function (value) {
	switch (typeof value) {
	case 'null':
		return NullValue.INSTANCE;
	case 'undefined':
		return UndefinedValue.INSTANCE;
	case 'boolean':
		return new BooleanValue(value);
	case 'number':
		return new FloatValue(value);
	case 'string':
		return new StringValue(value);
	}
};


function NullValue() {
	AbstractValue.call(this);
}

NullValue.prototype = Object.create(AbstractValue.prototype);

NullValue.prototype.toString = function () {
	return 'null';
};

NullValue.INSTANCE = new NullValue();


function UndefinedValue() {
	AbstractValue.call(this);
}

UndefinedValue.prototype = Object.create(AbstractValue.prototype);

UndefinedValue.prototype.toString = function () {
	return 'undefined';
};

UndefinedValue.INSTANCE = new UndefinedValue();


function BooleanValue(value) {
	AbstractValue.call(this);
	this.value = value;
}

BooleanValue.prototype = Object.create(AbstractValue.prototype);

BooleanValue.prototype.toString = function () {
	if (this.value) {
		return 'true';
	} else {
		return 'false';
	}
};


function IntegerValue(value) {
	AbstractValue.call(this);
	this.value = value;
}

IntegerValue.prototype = Object.create(AbstractValue.prototype);

IntegerValue.prototype.toString = function () {
	return '' + this.value;
};


function FloatValue(value) {
	AbstractValue.call(this);
	this.value = value;
}

FloatValue.prototype = Object.create(AbstractValue.prototype);

FloatValue.prototype.toString = function () {
	return '' + this.value;
};


function StringValue(value) {
	AbstractValue.call(this);
	this.value = value;
}

StringValue.prototype = Object.create(AbstractValue.prototype);

StringValue.prototype.toString = function () {
	return '' + this.value;
};


function ArrayValue() {
	AbstractValue.call(this);
	this.array = [];
}

ArrayValue.prototype = Object.create(AbstractValue.prototype);

ArrayValue.prototype.toString = function () {
	return '[ ' + this.array.map(function (element) {
		return element.toString();
	}).join(', ') + ' ]';
};


function ObjectValue(context) {
	AbstractValue.call(this);
	this.context = context;
}

ObjectValue.prototype = Object.create(AbstractValue.prototype);

ObjectValue.prototype.toString = function () {
	// TODO
	return 'object';
};


function Closure(name, body, context) {
	AbstractValue.call(this);
	this.name = name;
	this.body = body;
	this.context = context.capture(body.getFreeVariables());
}

Closure.prototype = Object.create(AbstractValue.prototype);

Closure.prototype.toString = function () {
	// TODO
	return 'closure';
};
