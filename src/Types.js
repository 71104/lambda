function AbstractType() {}

exports.AbstractType = AbstractType;

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


function UndefinedType() {
  AbstractType.call(this);
}

UndefinedType.prototype = Object.create(AbstractType.prototype);

UndefinedType.prototype.toString = function () {
  return 'undefined';
};

UndefinedType.prototype.isSubTypeOf = function () {
  return false;
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


function PrototypedType() {
  AbstractType.call(this);
}

PrototypedType.prototype = Object.create(AbstractType.prototype);

PrototypedType.prototype.context = Context.EMPTY;

PrototypedType.prototype.isSubTypeOf = function (type) {
  if (type.is(PrototypedType)) {
    return type.context.names().every(function (name) {
      return this.context.has(name) &&
        this.context.top(name).isSubTypeOf(type.context.top(name));
    }, this);
  } else {
    return false;
  }
};


function IndexedType(inner) {
  PrototypedType.call(this);
  this.inner = inner;
}

IndexedType.prototype = Object.create(PrototypedType.prototype);

IndexedType.prototype.isSubTypeOf = function (type) {
  if (type.is(IndexedType)) {
    return type.context.names().every(function (name) {
      return this.context.has(name) &&
        this.context.top(name).isSubTypeOf(type.context.top(name));
    }, this);
  } else {
    return false;
  }
};


function ObjectType(context) {
  PrototypedType.call(this);
  this.context = context;
}

ObjectType.prototype = Object.create(PrototypedType.prototype);

ObjectType.prototype.toString = function () {
  return 'object';
};

ObjectType.prototype.isSubTypeOf = function (type) {
  if (type.is(ObjectType)) {
    return PrototypedType.prototype.isSubTypeOf.call(this, type);
  } else {
    return type.isAny(UndefinedType);
  }
};


function NullType() {
  AbstractType.call(this);
}

NullType.prototype = Object.create(NullType.prototype);

NullType.prototype.toString = function () {
  return 'null';
};

NullType.prototype.isSubTypeOf = function (type) {
  return type.is(ObjectType);
};

NullType.INSTANCE = new NullType();


function BooleanType() {
  PrototypedType.call(this);
}

BooleanType.prototype = Object.create(PrototypedType.prototype);

BooleanType.prototype.toString = function () {
  return 'bool';
};

BooleanType.prototype.isSubTypeOf = function (type) {
  return type.isAny(BooleanType, UndefinedType) ||
    PrototypedType.prototype.isSubTypeOf.call(this, type);
};

BooleanType.INSTANCE = new BooleanType();


function ComplexType() {
  PrototypedType.call(this);
}

ComplexType.prototype = Object.create(PrototypedType.prototype);

ComplexType.prototype.toString = function () {
  return 'complex';
};

ComplexType.prototype.isSubTypeOf = function (type) {
  return type.isAny(ComplexType, UndefinedType) ||
    PrototypedType.prototype.isSubTypeOf.call(this, type);
};

ComplexType.INSTANCE = new ComplexType();


function RealType() {
  PrototypedType.call(this);
}

RealType.prototype = Object.create(PrototypedType.prototype);

RealType.prototype.toString = function () {
  return 'real';
};

RealType.prototype.isSubTypeOf = function (type) {
  return type.isAny(RealType, ComplexType, UndefinedType) ||
    PrototypedType.prototype.isSubTypeOf.call(this, type);
};

RealType.INSTANCE = new RealType();


function IntegerType() {
  PrototypedType.call(this);
}

IntegerType.prototype = Object.create(PrototypedType.prototype);

IntegerType.prototype.toString = function () {
  return 'integer';
};

IntegerType.prototype.isSubTypeOf = function (type) {
  return type.isAny(IntegerType, RealType, ComplexType, UndefinedType) ||
    PrototypedType.prototype.isSubTypeOf.call(this, type);
};

IntegerType.INSTANCE = new IntegerType();


function NaturalType() {
  PrototypedType.call(this);
}

NaturalType.prototype = Object.create(PrototypedType.prototype);

NaturalType.prototype.toString = function () {
  return 'natural';
};

NaturalType.prototype.isSubTypeOf = function (type) {
  return type.isAny(NaturalType, IntegerType, RealType, ComplexType, UndefinedType) ||
    PrototypedType.prototype.isSubTypeOf.call(this, type);
};

NaturalType.INSTANCE = new NaturalType();


function StringType() {
  IndexedType.call(this);
}

StringType.prototype = Object.create(IndexedType.prototype);

StringType.prototype.toString = function () {
  return 'string';
};

StringType.prototype.isSubTypeOf = function (type) {
  return type.isAny(StringType, UndefinedType) ||
    IndexedType.prototype.isSubTypeOf.call(this, type);
};

StringType.INSTANCE = new StringType();


function LambdaType(left, right) {
  PrototypedType.call(this);
  this.left = left;
  this.right = right;
}

LambdaType.prototype = Object.create(PrototypedType.prototype);

LambdaType.prototype.toString = function () {
  return '(' + this.left + ') -> (' + this.right + ')';
};

LambdaType.prototype.isSubTypeOf = function (type) {
  if (type.is(LambdaType)) {
    return type.left.isSubTypeOf(this.left) && this.right.isSubTypeOf(type.right);
  } else {
    return PrototypedType.prototype.isSubTypeOf.call(this, type);
  }
};


function ArrayType(inner) {
  PrototypedType.call(this);
  this.inner = inner;
}

ArrayType.prototype = Object.create(PrototypedType.prototype);

ArrayType.prototype.toString = function () {
  return '(' + this.inner + ')*';
};

ArrayType.prototype.isSubTypeOf = function (type) {
  if (type.is(ArrayType)) {
    return this.inner.isSubTypeOf(type.inner);
  } else {
    return IndexedType.prototype.isSubTypeOf.call(this, type);
  }
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
