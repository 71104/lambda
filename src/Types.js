function AbstractType() {}

AbstractType.prototype.is = function (Class) {
	return this instanceof Class;
};


function VoidType() {
	AbstractType.call(this);
}

VoidType.prototype.isSubTypeOf = function (type) {
	return type.is(VoidType);
};

VoidType.INSTANCE = new VoidType();


function UnknownType() {
	AbstractType.call(this);
}

UnknownType.prototype.isSubTypeOf = function () {
	return true;
};

UnknownType.INSTANCE = new UnknownType();


function BooleanType() {
	AbstractType.call(this);
}

BooleanType.prototype.isSubTypeOf = function (type) {
	return type.is(VoidType) ||
		type.is(BooleanType) ||
		type.is(NullableType) &&
		this.isSubTypeOf(type.subType);
};

BooleanType.INSTANCE = new BooleanType();


function FloatType() {
	AbstractType.call(this);
}

FloatType.prototype.isSubTypeOf = function (type) {
	return type.is(VoidType) ||
		type.is(FloatType) ||
		type.is(NullableType) &&
		this.isSubTypeOf(type.subType);
};

FloatType.INSTANCE = new FloatType();


function IntegerType() {
	AbstractType.call(this);
}

IntegerType.prototype.isSubTypeOf = function (type) {
	return type.is(VoidType) ||
		type.is(IntegerType) ||
		type.is(FloatType) ||
		type.is(NullableType) &&
		this.isSubTypeOf(type.subType);
};

IntegerType.INSTANCE = new IntegerType();


function StringType() {
	AbstractType.call(this);
}

StringType.prototype.isSubTypeOf = function (type) {
	return type.is(VoidType) ||
		type.is(StringType) ||
		type.is(NullableType) &&
		this.isSubTypeOf(type.subType);
};

StringType.INSTANCE = new StringType();


function RegexType() {
	AbstractType.call(this);
}

RegexType.prototype.isSubTypeOf = function (type) {
	return type.is(VoidType) ||
		type.is(RegexType) ||
		type.is(NullableType) &&
		this.isSubTypeOf(type.subType);
};

RegexType.INSTANCE = new RegexType();


function ArrayType(subType) {
	AbstractType.call(this);
	this.subType = subType;
}

ArrayType.prototype.isSubTypeOf = function (type) {
	return type.is(VoidType) ||
		type.is(ArrayType) && this.subType.isSubTypeOf(type.subType) ||
		type.is(NullableType) && this.isSubTypeOf(type.subType);
};


function ObjectType(context) {
	AbstractType.call(this);
	this.context = context;
}

ObjectType.prototype.isSubTypeOf = function (type) {
	return type.is(VoidType) ||
		type.is(ObjectType) && type.context.forEach(function (name, subType) {
			return this.context.has(name) && this.context.get(name).isSubTypeOf(subType);
		}, this) ||
		type.is(NullableType) && this.isSubTypeOf(type.subType);
};


function NullableType(subType) {
	AbstractType.call(this);
	this.subType = subType;
}

NullableType.prototype.isSubTypeOf = function (type) {
	return type.is(VoidType) ||
		type.is(NullableType) &&
		this.subType.isSubTypeOf(type.subType);
};


function LambdaType(left, right) {
	AbstractType.call(this);
	this.left = left;
	this.right = right;
}

LambdaType.prototype.isSubTypeOf = function (type) {
	return type.is(VoidType) ||
		type.is(LambdaType) && type.left.isSubTypeOf(this.left) && this.right.isSubTypeOf(type.right) ||
		type.is(NullableType) && this.isSubTypeOf(type.subType);
};
