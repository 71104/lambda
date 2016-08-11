function AbstractType() {}

exports.AbstractType = AbstractType;

AbstractType.prototype.is = function (Class) {
  return this instanceof Class;
};

AbstractType.prototype.bindThis = function () {
  return this;
};


function VariableType(name) {
  AbstractType.call(this);
  this.name = name;
}

exports.VariableType = VariableType;
extend(AbstractType, VariableType);

VariableType.prototype.toString = function () {
  return this.name;
};


function UndefinedType() {
  AbstractType.call(this);
}

exports.UndefinedType = UndefinedType;
extend(AbstractType, UndefinedType);

UndefinedType.prototype.context = Context.EMPTY;

UndefinedType.prototype.toString = function () {
  return 'undefined';
};

UndefinedType.prototype.clone = function (context) {
  var type = new UndefinedType();
  type.context = context;
  return type;
};

UndefinedType.prototype.isSubPrototypeOf = function (type) {
  return type.context.keys().every(function (key) {
    return this.context.has(key) && this.context.top(key).isSubTypeOf(type.context.top(key));
  }, this);
};

UndefinedType.DEFAULT = new UndefinedType();

UndefinedType.prototype.isSubTypeOf = function (type) {
  return this.is(type.constructor) && (type === UndefinedType.DEFAULT || this.isSubPrototypeOf(type));
};

UndefinedType.prototype.instance = function () {
  return this;
};


function ComplexType() {
  UndefinedType.call(this);
}

exports.ComplexType = ComplexType;
extend(UndefinedType, ComplexType);

ComplexType.prototype.toString = function () {
  return 'complex';
};

ComplexType.prototype.clone = function (context) {
  var type = new ComplexType();
  type.context = context;
  return type;
};

ComplexType.DEFAULT = new ComplexType();

ComplexType.prototype.isSubTypeOf = function (type) {
  return this.is(type.constructor) && (type === ComplexType.DEFAULT || this.isSubPrototypeOf(type));
};

ComplexType.prototype.instance = function () {
  return this;
};


function RealType() {
  ComplexType.call(this);
}

exports.RealType = RealType;
extend(ComplexType, RealType);

RealType.prototype.toString = function () {
  return 'real';
};

RealType.prototype.clone = function (context) {
  var type = new RealType();
  type.context = context;
  return type;
};

RealType.DEFAULT = new RealType();

RealType.prototype.isSubTypeOf = function (type) {
  return this.is(type.constructor) && (type === RealType.DEFAULT || this.isSubPrototypeOf(type));
};

RealType.prototype.instance = function () {
  return this;
};


function IntegerType() {
  RealType.call(this);
}

exports.IntegerType = IntegerType;
extend(RealType, IntegerType);

IntegerType.prototype.toString = function () {
  return 'integer';
};

IntegerType.prototype.clone = function (context) {
  var type = new IntegerType();
  type.context = context;
  return type;
};

IntegerType.DEFAULT = new IntegerType();

IntegerType.prototype.isSubTypeOf = function (type) {
  return this.is(type.constructor) && (type === IntegerType.DEFAULT || this.isSubPrototypeOf(type));
};

IntegerType.prototype.instance = function () {
  return this;
};


function NaturalType() {
  IntegerType.call(this);
}

exports.NaturalType = NaturalType;
extend(IntegerType, NaturalType);

NaturalType.prototype.toString = function () {
  return 'natural';
};

NaturalType.prototype.clone = function (context) {
  var type = new NaturalType();
  type.context = context;
  return type;
};

NaturalType.DEFAULT = new NaturalType();

NaturalType.prototype.isSubTypeOf = function (type) {
  return this.is(type.constructor) && (type === NaturalType.DEFAULT || this.isSubPrototypeOf(type));
};

NaturalType.prototype.instance = function () {
  return this;
};


function BooleanType() {
  UndefinedType.call(this);
}

exports.BooleanType = BooleanType;
extend(UndefinedType, BooleanType);

BooleanType.prototype.toString = function () {
  return 'boolean';
};

BooleanType.prototype.clone = function (context) {
  var type = new BooleanType();
  type.context = context;
  return type;
};

BooleanType.DEFAULT = new BooleanType();

BooleanType.prototype.isSubTypeOf = function (type) {
  return this.is(type.constructor) && (type === BooleanType.DEFAULT || this.isSubPrototypeOf(type));
};

BooleanType.prototype.instance = function () {
  return this;
};


function IndexedType(inner) {
  UndefinedType.call(this);
  this.inner = inner;
}

exports.IndexedType = IndexedType;
extend(UndefinedType, IndexedType);


function StringType(selfReference) {
  if (selfReference) {
    IndexedType.call(this, this);
  } else {
    IndexedType.call(this, StringType.DEFAULT);
  }
}

exports.StringType = StringType;
extend(IndexedType, StringType);

StringType.prototype.toString = function () {
  return 'string';
};

StringType.prototype.clone = function (context) {
  var type = new StringType();
  type.context = context;
  return type;
};

StringType.DEFAULT = new StringType();

StringType.prototype.isSubTypeOf = function (type) {
  return this.is(type.constructor) && (type === StringType.DEFAULT || this.isSubPrototypeOf(type));
};

StringType.prototype.instance = function () {
  return this;
};


function ListType(inner) {
  IndexedType.call(this, inner);
}

exports.ListType = ListType;
extend(IndexedType, ListType);

ListType.prototype.toString = function () {
  return '(' + this.inner.toString() + ')*';
};

ListType.prototype.clone = function (context) {
  var type = new ListType(this.inner);
  type.context = context;
  return type;
};

ListType.prototype.isSubTypeOf = function () {
  // TODO
};

ListType.prototype.instance = function (name, type) {
  var result = new ListType(this.inner.instance(name, type));
  result.context = this.context;
  return result;
};


function ClosureType(left, right) {
  UndefinedType.call(this);
  this.left = left;
  this.right = right;
}

exports.ClosureType = ClosureType;
extend(UndefinedType, ClosureType);

ClosureType.prototype.toString = function () {
  return '(' + this.left.toString() + ') => (' + this.right.toString() + ')';
};

ClosureType.prototype.clone = function (context) {
  var type = new ClosureType(this.left, this.right);
  type.context = context;
  return type;
};

ClosureType.prototype.isSubTypeOf = function () {
  // TODO
};

ClosureType.prototype.instance = function (name, type) {
  var result = new Closure(this.left.instance(name, type), this.right.instance(name, type));
  result.context = this.context;
  return result;
};

ClosureType.prototype.bindThis = function (type) {
  if (this.left.is(VariableType)) {
    return this.right.instance(this.left.name, type);
  } else if (type.isSubTypeOf(this.left)) {
    return this.right;
  } else {
    throw new LambdaTypeError();
  }
};


function UnknownType() {
  UndefinedType.call(this);
}

exports.UnknownType = UnknownType;
extend(UndefinedType, UnknownType);

UnknownType.prototype.toString = function () {
  return 'unknown';
};

UnknownType.prototype.clone = function (context) {
  var type = new UnknownType();
  type.context = context;
  return type;
};

UnknownType.DEFAULT = new UnknownType();

UnknownType.prototype.isSubTypeOf = function (type) {
  return !type.is(UnknownType) || this === UnknownType.DEFAULT ||
      type !== UnknownType.DEFAULT && this.context.keys().every(function (key) {
        return type.context.has(key) && this.context.top(key).isSubTypeOf(type.context.top(key));
      }, this);
};

UnknownType.prototype.instance = function () {
  return this;
};
