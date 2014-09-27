function AbstractType() {}

AbstractType.prototype.is = function (Class) {
	return this instanceof Class;
};


function NullType() {
	AbstractType.call(this);
}

NullType.prototype = Object.create(AbstractType.prototype);

NullType.prototype.toString = function () {
	return 'null';
};

NullType.prototype.isSubTypeOf = function (type) {
	return type.is(VoidType) ||
		type.is(NullType);
};


function VoidType() {
	AbstractType.call(this);
}

VoidType.prototype = Object.create(AbstractType.prototype);

VoidType.prototype.toString = function () {
	return 'void';
};

VoidType.prototype.isSubTypeOf = function (type) {
	return type.is(VoidType);
};

VoidType.INSTANCE = new VoidType();


function UnknownType() {
	AbstractType.call(this);
}

UnknownType.prototype = Object.create(AbstractType.prototype);

UnknownType.prototype.toString = function () {
	return 'unknown';
};

UnknownType.prototype.isSubTypeOf = function () {
	return true;
};

UnknownType.INSTANCE = new UnknownType();


function BooleanType() {
	AbstractType.call(this);
}

BooleanType.prototype = Object.create(AbstractType.prototype);

BooleanType.prototype.toString = function () {
	return 'bool';
};

BooleanType.prototype.isSubTypeOf = function (type) {
	return type.is(VoidType) ||
		type.is(BooleanType);
};

BooleanType.INSTANCE = new BooleanType();


function FloatType() {
	AbstractType.call(this);
}

FloatType.prototype = Object.create(AbstractType.prototype);

FloatType.prototype.toString = function () {
	return 'float';
};

FloatType.prototype.isSubTypeOf = function (type) {
	return type.is(VoidType) ||
		type.is(FloatType);
};

FloatType.INSTANCE = new FloatType();


function IntegerType() {
	AbstractType.call(this);
}

IntegerType.prototype = Object.create(AbstractType.prototype);

IntegerType.prototype.toString = function () {
	return 'int';
};

IntegerType.prototype.isSubTypeOf = function (type) {
	return type.is(VoidType) ||
		type.is(IntegerType) ||
		type.is(FloatType);
};

IntegerType.INSTANCE = new IntegerType();


function StringType() {
	AbstractType.call(this);
}

StringType.prototype = Object.create(AbstractType.prototype);

StringType.prototype.toString = function () {
	return 'string';
};

StringType.prototype.isSubTypeOf = function (type) {
	return type.is(VoidType) ||
		type.is(StringType);
};

StringType.INSTANCE = new StringType();


function RegexType() {
	AbstractType.call(this);
}

RegexType.prototype = Object.create(AbstractType.prototype);

RegexType.prototype.toString = function () {
	return 'regex';
};

RegexType.prototype.isSubTypeOf = function (type) {
	return type.is(VoidType) ||
		type.is(RegexType);
};

RegexType.INSTANCE = new RegexType();


function ArrayType(subType) {
	AbstractType.call(this);
	this.subType = subType;
}

ArrayType.prototype = Object.create(AbstractType.prototype);

ArrayType.prototype.toString = function () {
	return this.subType + '*';
};

ArrayType.prototype.isSubTypeOf = function (type) {
	return type.is(VoidType) ||
		type.is(ArrayType) && this.subType.isSubTypeOf(type.subType);
};


function ObjectType(context) {
	AbstractType.call(this);
	this.context = context;
}

ObjectType.prototype = Object.create(AbstractType.prototype);

ObjectType.prototype.toString = function () {
	// TODO
	return 'object';
};

ObjectType.prototype.isSubTypeOf = function (type) {
	return type.is(VoidType) ||
		type.is(ObjectType) && type.context.forEach(function (name, subType) {
			return this.context.has(name) && this.context.get(name).isSubTypeOf(subType);
		}, this);
};


function LambdaType(left, right) {
	AbstractType.call(this);
	this.left = left;
	this.right = right;
}

LambdaType.prototype = Object.create(AbstractType.prototype);

LambdaType.prototype.toString = function () {
	var argumentTypes = [];
	var type = this;
	while (type.is(LambdaType)) {
		argumentTypes.push(type.left);
		type = type.right;
	}
	return '(' + argumentTypes.join(', ') + ') -> ' + type;
};

LambdaType.prototype.isSubTypeOf = function (type) {
	return type.is(VoidType) ||
		type.is(LambdaType) &&
		type.left.isSubTypeOf(this.left) &&
		this.right.isSubTypeOf(type.right);
};


function VariableType(name) {
	AbstractType.call(this);
	this.name = name;
}

VariableType.prototype = Object.create(AbstractType.prototype);

VariableType.prototype.toString = function () {
	return this.name;
};

VariableType.prototype.isSubTypeOf = function () {
	// TODO
};


function PolimorphicType(name, subType) {
	AbstractType.call(this);
	this.name = name;
	this.subType = subType;
}

PolimorphicType.prototype = Object.create(AbstractType.prototype);

PolimorphicType.prototype.toString = function () {
	// TODO
};

PolimorphicType.prototype.isSubTypeOf = function () {
	// TODO
};
