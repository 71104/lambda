function AbstractType() {}

exports.AbstractType = AbstractType;

AbstractType.prototype.context = Context.EMPTY;

AbstractType.prototype.is = function (Class) {
  return this instanceof Class;
};

AbstractType.prototype.isAny = function () {
  for (var i = 0; i < arguments.length; i++) {
    if (this instanceof arguments[i]) {
      return true;
    }
  }
  return false;
};

AbstractType.prototype.isSubTypeOf = function (type) {
  return type.context.names().every(function (name) {
    return this.context.has(name) && this.context.top(name).isSubTypeOf(type.context.top(name));
  }, this);
};


function UndefinedType() {
  AbstractType.call(this);
}

UndefinedType.prototype = Object.create(AbstractType.prototype);

UndefinedType.prototype.toString = function () {
  return 'undefined';
};

UndefinedType.prototype.isSubTypeOf = function (type) {
  return type.is(UndefinedType) &&
    AbstractType.prototype.isSubTypeOf.call(this, type);
};

UndefinedType.INSTANCE = new UndefinedType();


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


function IndexedType(inner) {
  AbstractType.call(this);
  this.inner = inner;
}

IndexedType.prototype = Object.create(AbstractType.prototype);

IndexedType.prototype.isSubTypeOf = function (type) {
  if (type.is(IndexedType)) {
    return this.inner.isSubTypeOf(type.inner) &&
      AbstractType.prototype.isSubTypeOf.call(this, type);
  } else {
    return type.is(UndefinedType) &&
      AbstractType.prototype.isSubTypeOf.call(this, type);
  }
};


function BooleanType() {
  AbstractType.call(this);
}

BooleanType.prototype = Object.create(AbstractType.prototype);

BooleanType.prototype.toString = function () {
  return 'bool';
};

BooleanType.prototype.isSubTypeOf = function (type) {
  return type.isAny(BooleanType, UndefinedType) &&
    AbstractType.prototype.isSubTypeOf.call(this, type);
};

BooleanType.INSTANCE = new BooleanType();


function ComplexType() {
  AbstractType.call(this);
}

ComplexType.prototype = Object.create(AbstractType.prototype);

ComplexType.prototype.toString = function () {
  return 'complex';
};

ComplexType.prototype.isSubTypeOf = function (type) {
  return type.isAny(ComplexType, UndefinedType) &&
    AbstractType.prototype.isSubTypeOf.call(this, type);
};

ComplexType.INSTANCE = new ComplexType();


function RealType() {
  AbstractType.call(this);
}

RealType.prototype = Object.create(AbstractType.prototype);

RealType.prototype.toString = function () {
  return 'real';
};

RealType.prototype.isSubTypeOf = function (type) {
  return type.isAny(RealType, ComplexType, UndefinedType) &&
    AbstractType.prototype.isSubTypeOf.call(this, type);
};

RealType.INSTANCE = new RealType();


function IntegerType() {
  AbstractType.call(this);
}

IntegerType.prototype = Object.create(AbstractType.prototype);

IntegerType.prototype.toString = function () {
  return 'integer';
};

IntegerType.prototype.isSubTypeOf = function (type) {
  return type.isAny(IntegerType, RealType, ComplexType, UndefinedType) &&
    AbstractType.prototype.isSubTypeOf.call(this, type);
};

IntegerType.INSTANCE = new IntegerType();


function NaturalType() {
  AbstractType.call(this);
}

NaturalType.prototype = Object.create(AbstractType.prototype);

NaturalType.prototype.toString = function () {
  return 'natural';
};

NaturalType.prototype.isSubTypeOf = function (type) {
  return type.isAny(NaturalType, IntegerType, RealType, ComplexType, UndefinedType) &&
    AbstractType.prototype.isSubTypeOf.call(this, type);
};

NaturalType.INSTANCE = new NaturalType();


function StringType(selfReference) {
  IndexedType.call(this, selfReference ? this : StringType.INSTANCE);
}

StringType.prototype = Object.create(IndexedType.prototype);

StringType.prototype.toString = function () {
  return 'string';
};

StringType.prototype.isSubTypeOf = function (type) {
  return type.isAny(StringType, UndefinedType) &&
    IndexedType.prototype.isSubTypeOf.call(this, type);
};

StringType.INSTANCE = new StringType(true);


function LambdaType(left, right) {
  AbstractType.call(this);
  this.left = left;
  this.right = right;
}

LambdaType.prototype = Object.create(AbstractType.prototype);

LambdaType.prototype.toString = function () {
  return '(' + this.left + ') -> (' + this.right + ')';
};

LambdaType.prototype.isSubTypeOf = function (type) {
  if (type.is(LambdaType)) {
    return type.left.isSubTypeOf(this.left) && this.right.isSubTypeOf(type.right) &&
      AbstractType.prototype.isSubTypeOf.call(this, type);
  } else {
    return type.is(UndefinedType) &&
      AbstractType.prototype.isSubTypeOf.call(this, type);
  }
};


function ListType(inner) {
  IndexedType.call(this, inner);
}

ListType.prototype = Object.create(IndexedType.prototype);

ListType.prototype.toString = function () {
  return '(' + this.inner + ')*';
};

ListType.prototype.isSubTypeOf = function (type) {
  return type.isAny(ListType, UndefinedType) &&
    IndexedType.prototype.isSubTypeOf.call(this, type);
};


function VariableType(name) {
  AbstractType.call(this);
  this.name = name;
}

VariableType.prototype = Object.create(AbstractType.prototype);

VariableType.prototype.toString = function () {
  return this.name;
};


function ForEachType(name, inner) {
  AbstractType.call(this);
  this.name = name;
  this.inner = inner;
}

ForEachType.prototype = Object.create(AbstractType.prototype);

ForEachType.prototype.toString = function () {
  return this.name + ' => ' + this.inner;
};
