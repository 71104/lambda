var AbstractType = exports.AbstractType = function () {};

AbstractType.prototype.is = function (Class) {
	return this instanceof Class;
};


var UndefinedType = exports.UndefinedType = function () {
	AbstractType.call(this);
};

UndefinedType.prototype = Object.create(AbstractType.prototype);

UndefinedType.prototype.toString = function () {
	return 'undefined';
};

UndefinedType.prototype.isSubTypeOf = function (type) {
	return type.is(UndefinedType);
};

UndefinedType.INSTANCE = new UndefinedType();


var UnknownType = exports.UnknownType = function () {
	AbstractType.call(this);
};

UnknownType.prototype = Object.create(AbstractType.prototype);

UnknownType.prototype.toString = function () {
	return 'unknown';
};

UnknownType.prototype.isSubTypeOf = function () {
	return true;
};

UnknownType.INSTANCE = new UnknownType();


var NullType = exports.NullType = function () {
	AbstractType.call(this);
};

NullType.prototype = Object.create(AbstractType.prototype);

NullType.prototype.toString = function () {
	return 'null';
};

NullType.prototype.isSubTypeOf = function (type) {
	return type.is(UndefinedType) || type.is(NullType);
};

NullType.INSTANCE = new NullType();


var BooleanType = exports.BooleanType = function () {
	AbstractType.call(this);
};

BooleanType.prototype = Object.create(AbstractType.prototype);

BooleanType.prototype.toString = function () {
	return 'bool';
};

BooleanType.prototype.isSubTypeOf = function (type) {
	return type.is(UndefinedType) || type.is(BooleanType);
};

BooleanType.INSTANCE = new BooleanType();


var ComplexType = exports.ComplexType = function () {
	AbstractType.call(this);
};

ComplexType.prototype = Object.create(AbstractType.prototype);

ComplexType.prototype.toString = function () {
	return 'complex';
};

ComplexType.prototype.isSubTypeOf = function (type) {
	return type.is(UndefinedType) || type.is(ComplexType);
};

ComplexType.INSTANCE = new ComplexType();


var FloatType = exports.FloatType = function () {
	AbstractType.call(this);
};

FloatType.prototype = Object.create(AbstractType.prototype);

FloatType.prototype.toString = function () {
	return 'float';
};

FloatType.prototype.isSubTypeOf = function (type) {
	return type.is(UndefinedType) || type.is(FloatType) || type.is(ComplexType);
};

FloatType.INSTANCE = new FloatType();


var IntegerType = exports.IntegerType = function () {
	AbstractType.call(this);
};

IntegerType.prototype = Object.create(AbstractType.prototype);

IntegerType.prototype.toString = function () {
	return 'int';
};

IntegerType.prototype.isSubTypeOf = function (type) {
	return type.is(UndefinedType) ||
		type.is(IntegerType) ||
		type.is(FloatType) ||
		type.is(ComplexType);
};

IntegerType.INSTANCE = new IntegerType();


var StringType = exports.StringType = function () {
	AbstractType.call(this);
};

StringType.prototype = Object.create(AbstractType.prototype);

StringType.prototype.toString = function () {
	return 'string';
};

StringType.prototype.isSubTypeOf = function (type) {
	return type.is(UndefinedType) || type.is(StringType);
};

StringType.INSTANCE = new StringType();


var RegexType = exports.RegexType = function () {
	AbstractType.call(this);
};

RegexType.prototype = Object.create(AbstractType.prototype);

RegexType.prototype.toString = function () {
	return 'regex';
};

RegexType.prototype.isSubTypeOf = function (type) {
	return type.is(UndefinedType) || type.is(RegexType);
};

RegexType.INSTANCE = new RegexType();


var ArrayType = exports.ArrayType = function (subType) {
	AbstractType.call(this);
	this.subType = subType;
};

ArrayType.prototype = Object.create(AbstractType.prototype);

ArrayType.prototype.toString = function () {
	return this.subType + '*';
};

ArrayType.prototype.isSubTypeOf = function (type) {
	return type.is(UndefinedType) || type.is(ArrayType) && this.subType.isSubTypeOf(type.subType);
};


var ObjectType = exports.ObjectType = function (context) {
	AbstractType.call(this);
	this.context = context;
};

ObjectType.prototype = Object.create(AbstractType.prototype);

ObjectType.prototype.toString = function () {
	// TODO
	return 'object';
};

ObjectType.prototype.isSubTypeOf = function (type) {
	return type.is(UndefinedType) ||
		type.is(ObjectType) && type.context.forEach(function (name, subType) {
			return this.context.has(name) && this.context.get(name).isSubTypeOf(subType);
		}, this);
};


var LambdaType = exports.LambdaType = function (left, right, thrown) {
	AbstractType.call(this);
	this.left = left;
	this.right = right;
	this.thrown = thrown;
};

LambdaType.prototype = Object.create(AbstractType.prototype);

LambdaType.prototype.toString = function () {
	var argumentTypes = [];
	var type = this;
	while (type.is(LambdaType)) {
		argumentTypes.push(type.left);
		type = type.right;
	}
	var result;
	if (argumentTypes.length > 1) {
		result = '(' + argumentTypes.join(', ') + ') => ' + type;
	} else {
		result = argumentTypes.join(', ') + ' => ' + type;
	}
	if (this.thrown.length > 0) {
		return result + ' throws ' + this.thrown.join(', ');
	} else {
		return result;
	}
};

LambdaType.prototype.isSubTypeOf = function (type) {
	return type.is(UndefinedType) ||
		type.is(LambdaType) &&
		type.left.isSubTypeOf(this.left) &&
		this.right.isSubTypeOf(type.right);
};


var VariableType = exports.VariableType = function (name) {
	AbstractType.call(this);
	this.name = name;
};

VariableType.prototype = Object.create(AbstractType.prototype);

VariableType.prototype.toString = function () {
	return this.name;
};

VariableType.prototype.isSubTypeOf = function () {
	// TODO
};


var PolymorphicType = exports.PolymorphicType = function (name, subType) {
	AbstractType.call(this);
	this.name = name;
	this.subType = subType;
};

PolymorphicType.prototype = Object.create(AbstractType.prototype);

PolymorphicType.prototype.toString = function () {
	// TODO
};

PolymorphicType.prototype.isSubTypeOf = function () {
	// TODO
};


var TypeResult = exports.TypeResult = function (type, thrownTypes) {
	this.type = type;
	this.thrownTypes = thrownTypes;
};

TypeResult.prototype.toString = function () {
	if (this.thrownTypes.length > 0) {
		return this.type + ' throws ' + this.thrownTypes.join(', ');
	} else {
		return this.type.toString();
	}
};
