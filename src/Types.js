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


function UnknownType() {
  AbstractType.call(this);
}

exports.UnknownType = UnknownType;

UnknownType.prototype = Object.create(AbstractType.prototype);

UnknownType.prototype.toString = function () {
  return 'unknown';
};

UnknownType.prototype.isSubTypeOf = function () {
  return true;
};

UnknownType.INSTANCE = new UnknownType();


function UndefinedType() {
  AbstractType.call(this);
}

exports.UndefinedType = UndefinedType;

UndefinedType.prototype = Object.create(AbstractType.prototype);

UndefinedType.prototype.context = Context.EMPTY;

UndefinedType.prototype.toString = function () {
  return 'undefined';
};

UndefinedType.prototype.clone = function (context) {
  var result = new UndefinedType();
  result.context = context;
  return result;
};

UndefinedType.prototype.isSubTypeOf = function (type) {
  return type instanceof UndefinedType &&
    this instanceof type.constructor &&
    type.context.names().every(function (name) {
      return this.context.has(name) && this.context.top(name).isSubTypeOf(type.context.top(name));
    }, this);
};

UndefinedType.INSTANCE = new UndefinedType();


function IndexedType(inner) {
  UndefinedType.call(this);
  this.inner = inner;
}

exports.IndexedType = IndexedType;

IndexedType.prototype = Object.create(UndefinedType.prototype);

IndexedType.prototype.isSubTypeOf = function (type) {
  return UndefinedType.prototype.isSubTypeOf.call(this, type) &&
    this.inner.isSubTypeOf(type);
};


function BooleanType() {
  UndefinedType.call(this);
}

exports.BooleanType = BooleanType;

BooleanType.prototype = Object.create(UndefinedType.prototype);

BooleanType.prototype.toString = function () {
  return 'bool';
};

BooleanType.prototype.clone = function (context) {
  var result = new BooleanType();
  result.context = context;
  return result;
};

BooleanType.INSTANCE = new BooleanType();


function ComplexType() {
  UndefinedType.call(this);
}

exports.ComplexType = ComplexType;

ComplexType.prototype = Object.create(UndefinedType.prototype);

ComplexType.prototype.toString = function () {
  return 'complex';
};

ComplexType.prototype.clone = function (context) {
  var result = new ComplexType();
  result.context = context;
  return result;
};

ComplexType.INSTANCE = new ComplexType();


function RealType() {
  ComplexType.call(this);
}

exports.RealType = RealType;

RealType.prototype = Object.create(ComplexType.prototype);

RealType.prototype.toString = function () {
  return 'real';
};

RealType.prototype.clone = function (context) {
  var result = new RealType();
  result.context = context;
  return result;
};

RealType.INSTANCE = new RealType();


function IntegerType() {
  RealType.call(this);
}

exports.IntegerType = IntegerType;

IntegerType.prototype = Object.create(RealType.prototype);

IntegerType.prototype.toString = function () {
  return 'integer';
};

IntegerType.prototype.clone = function (context) {
  var result = new IntegerType();
  result.context = context;
  return result;
};

IntegerType.INSTANCE = new IntegerType();


function NaturalType() {
  IntegerType.call(this);
}

exports.NaturalType = NaturalType;

NaturalType.prototype = Object.create(IntegerType.prototype);

NaturalType.prototype.toString = function () {
  return 'natural';
};

NaturalType.prototype.clone = function (context) {
  var result = new NaturalType();
  result.context = context;
  return result;
};

NaturalType.INSTANCE = new NaturalType();


function StringType(selfReference) {
  IndexedType.call(this, selfReference ? this : StringType.INSTANCE);
}

exports.StringType = StringType;

StringType.prototype = Object.create(IndexedType.prototype);

StringType.prototype.toString = function () {
  return 'string';
};

StringType.prototype.clone = function (context) {
  var result = new StringType();
  result.context = context;
  return result;
};

StringType.INSTANCE = new StringType(true);


function LambdaType(left, right) {
  UndefinedType.call(this);
  this.left = left;
  this.right = right;
}

exports.LambdaType = LambdaType;

LambdaType.prototype = Object.create(UndefinedType.prototype);

LambdaType.prototype.toString = function () {
  return '(' + this.left + ') -> (' + this.right + ')';
};

LambdaType.prototype.clone = function (context) {
  var result = new LambdaType(this.left, this.right);
  result.context = context;
  return result;
};

LambdaType.prototype.isSubTypeOf = function (type) {
  return UndefinedType.prototype.isSubTypeOf.call(this, type) &&
    type.left.isSubTypeOf(this.left) &&
    this.right.isSubTypeOf(type.right);
};


function ListType(inner) {
  IndexedType.call(this, inner);
}

exports.ListType = ListType;

ListType.prototype = Object.create(IndexedType.prototype);

ListType.prototype.toString = function () {
  return '(' + this.inner + ')*';
};

ListType.prototype.clone = function (context) {
  var result = new ListType(this.inner);
  result.context = context;
  return result;
};


function VariableType(name) {
  AbstractType.call(this);
  this.name = name;
}

exports.VariableType = VariableType;

VariableType.prototype = Object.create(AbstractType.prototype);

VariableType.prototype.toString = function () {
  return this.name;
};


function ForEachType(name, inner) {
  AbstractType.call(this);
  this.name = name;
  this.inner = inner;
}

exports.ForEachType = ForEachType;

ForEachType.prototype = Object.create(AbstractType.prototype);

ForEachType.prototype.toString = function () {
  return this.name + ' => ' + this.inner;
};
