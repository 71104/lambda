function AbstractType() {}

exports.AbstractType = AbstractType;

AbstractType.prototype.is = function (Class) {
  return this instanceof Class;
};

AbstractType.prototype.bindThis = function () {
  return this;
};


function ForEachType(name, inner) {
  AbstractType.call(this);
  this.name = name;
  this.inner = inner;
}

exports.ForEachType = ForEachType;
extend(AbstractType, ForEachType);

ForEachType.prototype.toString = function () {
  return this.inner.toString();
};

ForEachType.prototype.instance = function (name, type) {
  if (this.name !== name) {
    return new ForEachType(this.name, this.inner.instance(name, type));
  } else {
    return this;
  }
};

ForEachType.prototype.bindThis = function (type) {
  var inner = this.inner.instance(this.name, type);
  if (inner.isSubTypeOf(inner.left)) {
    return inner.right;
  } else {
    throw new LambdaTypeError();
  }
};


function ContextType() {
  AbstractType.call(this);
}

exports.ContextType = ContextType;
extend(AbstractType, ContextType);

ContextType.prototype.context = Context.EMPTY;
ContextType.prototype.hasDefaultPrototype = true;

ContextType.prototype.isSubPrototypeOf = function (type) {
  return type.context.keys().every(function (key) {
    return this.context.has(key) && this.context.top(key).isSubTypeOf(type.context.top(key));
  }, this);
};

ContextType.prototype.isSubTypeOf = function (type) {
  return this.is(type.constructor) && (type.hasDefaultPrototype || this.isSubPrototypeOf(type));
};

ContextType.merge = function (type1, type2) {
  if (type1.is(type2.constructor)) {
    return type2.clone(type1.context.intersection(type2.context, ContextType.merge));
  } else if (type2.is(type1.constructor)) {
    return type1.clone(type1.context.intersection(type2.context, ContextType.merge));
  } else {
    throw new LambdaTypeError();
  }
};

ContextType.prototype.merge = function (type) {
  return ContextType.merge(this, type);
};


function VariableType(name) {
  ContextType.call(this);
  this.name = name;
}

exports.VariableType = VariableType;
extend(ContextType, VariableType);

VariableType.prototype.toString = function () {
  return this.name;
};

VariableType.prototype.instance = function (name, type) {
  if (this.name !== name) {
    return this;
  } else {
    return type;
  }
};


function UndefinedType() {
  ContextType.call(this);
}

exports.UndefinedType = UndefinedType;
extend(ContextType, UndefinedType);

UndefinedType.prototype.toString = function () {
  return 'undefined';
};

UndefinedType.prototype.clone = function (context) {
  var type = new UndefinedType();
  type.context = context;
  return type;
};

UndefinedType.DEFAULT = new UndefinedType();

UndefinedType.prototype.instance = function () {
  return this;
};

UndefinedType.fromContext = function (context) {
  return UndefinedType.DEFAULT.clone(context);
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

StringType.DEFAULT = new StringType(true);


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

ListType.prototype.isSubTypeOf = function (type) {
  return UndefinedType.prototype.isSubTypeOf.call(this, type) &&
    (!type.is(IndexedType) || this.inner.isSubTypeOf(type.inner));
};

ListType.prototype.instance = function (name, type) {
  var result = new ListType(this.inner.instance(name, type));
  result.context = this.context;
  return result;
};


function LambdaType(left, right) {
  UndefinedType.call(this);
  this.left = left;
  this.right = right;
}

exports.LambdaType = LambdaType;
extend(UndefinedType, LambdaType);

LambdaType.prototype.toString = function () {
  return '(' + this.left.toString() + ') => (' + this.right.toString() + ')';
};

LambdaType.prototype.clone = function (context) {
  var type = new LambdaType(this.left, this.right);
  type.context = context;
  return type;
};

LambdaType.prototype.isSubTypeOf = function () {
  return UndefinedType.prototype.isSubTypeOf.call(this, type) && (!type.is(LambdaType) ||
    type.left.isSubTypeOf(this.left) && this.right.isSubTypeOf(type.right));
};

LambdaType.prototype.instance = function (name, type) {
  var result = new LambdaType(this.left.instance(name, type), this.right.instance(name, type));
  result.context = this.context;
  return result;
};

LambdaType.prototype.bindThis = function (type) {
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

UnknownType.prototype.merge = function (type) {
  if (type.is(UnknownType)) {
    return this.clone(this.context.union(type.context, ContextType.merge));
  } else {
    return type.clone(this.context.intersection(type.context, ContextType.merge));
  }
};
