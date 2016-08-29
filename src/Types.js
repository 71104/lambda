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
  if (type.isSubTypeOf(inner.left)) {
    return inner.right;
  } else {
    throw new LambdaTypeError();
  }
};


function PrototypedType() {
  AbstractType.call(this);
}

exports.PrototypedType = PrototypedType;
extend(AbstractType, PrototypedType);

PrototypedType.prototype.context = Context.EMPTY;
PrototypedType.prototype.hasDefaultPrototype = true;

PrototypedType.prototype._setContext = function (context) {
  var constructor = this.constructor;
  var SubType = function () {
    constructor.apply(this, arguments);
  };
  extend(constructor, SubType);
  SubType.prototype.context = context;
  SubType.prototype.hasDefaultPrototype = false;
  return SubType;
};

PrototypedType.prototype._extend = function (name, type) {
  return this._setContext(this.context.add(name, type));
};

PrototypedType.prototype.isSubPrototypeOf = function (type) {
  return type.context.keys().every(function (key) {
    return this.context.has(key) && this.context.top(key).isSubTypeOf(type.context.top(key));
  }, this);
};

PrototypedType.prototype.isSubTypeOf = function (type) {
  return this.is(type.constructor) && (type.hasDefaultPrototype || this.isSubPrototypeOf(type));
};

PrototypedType.merge = function (type1, type2) {
  if (type1.is(type2.constructor)) {
    return type2.setContext(type1.context.intersection(type2.context, PrototypedType.merge));
  } else if (type2.is(type1.constructor)) {
    return type1.setContext(type1.context.intersection(type2.context, PrototypedType.merge));
  } else {
    throw new LambdaTypeError();
  }
};

PrototypedType.prototype.merge = function (type) {
  return PrototypedType.merge(this, type);
};


function UndefinedType() {
  PrototypedType.call(this);
}

exports.UndefinedType = UndefinedType;
extend(PrototypedType, UndefinedType);

UndefinedType.prototype.toString = function () {
  return 'undefined';
};

UndefinedType.prototype.setContext = function (context) {
  return new (this._setContext(context))();
};

UndefinedType.prototype.extend = function (name, type) {
  return new (this._extend(name, type))();
};

UndefinedType.DEFAULT = new UndefinedType();

UndefinedType.prototype.instance = function () {
  return this;
};

UndefinedType.fromContext = function (context) {
  return UndefinedType.DEFAULT.setContext(context);
};


function UnknownType() {
  UndefinedType.call(this);
}

exports.UnknownType = UnknownType;
extend(UndefinedType, UnknownType);

UnknownType.prototype.toString = function () {
  return 'unknown';
};

UnknownType.DEFAULT = new UnknownType();

UnknownType.prototype.isSubPrototypeOf = function (type) {
  return this.context.keys().every(function (key) {
    if (type.context.has(key)) {
      return this.context.top(key).isSubTypeOf(type.context.top(key));
    } else if (type.is(UnknownType)) {
      return this.context.top(key).isSubTypeOf(UnknownType.DEFAULT);
    } else {
      return false;
    }
  }, this);
};

UnknownType.prototype.isSubTypeOf = function (type) {
  return this.hasDefaultPrototype || this.isSubPrototypeOf(type);
};

UnknownType.prototype.merge = function (type) {
  if (type.is(UnknownType)) {
    return this.setContext(this.context.union(type.context, PrototypedType.merge));
  } else {
    return type.setContext(this.context.intersection(type.context, PrototypedType.merge));
  }
};


function VariableType(name) {
  UndefinedType.call(this);
  this.name = name;
}

exports.VariableType = VariableType;
extend(UndefinedType, VariableType);

VariableType.prototype.toString = function () {
  return this.name;
};

VariableType.prototype.setContext = function (context) {
  return new (this._setContext(context))(this.name);
};

VariableType.prototype.extend = function (name, type) {
  return new (this._extend(name, type))(this.name);
};

VariableType.prototype.isSubPrototypeOf = function (type) {
  return this.context.keys().every(function (key) {
    if (type.context.has(key)) {
      return this.context.top(key).isSubTypeOf(type.context.top(key));
    } else {
      // TODO
      return false;
    }
  }, this);
};

VariableType.prototype.isSubTypeOf = function (type) {
  return UndefinedType.prototype.isSubTypeOf.call(this, type) &&
    (!type.is(VariableType) || type.name === this.name);
};

VariableType.prototype.merge = function () {
  // TODO
  return UnknownType.DEFAULT;
};

VariableType.prototype.instance = function (name, type) {
  if (this.name !== name) {
    return this;
  } else {
    return type;
  }
};


function ComplexType() {
  UndefinedType.call(this);
}

exports.ComplexType = ComplexType;
extend(UndefinedType, ComplexType);

ComplexType.prototype.toString = function () {
  return 'complex';
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

RealType.DEFAULT = new RealType();


function IntegerType() {
  RealType.call(this);
}

exports.IntegerType = IntegerType;
extend(RealType, IntegerType);

IntegerType.prototype.toString = function () {
  return 'integer';
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

NaturalType.DEFAULT = new NaturalType();


function BooleanType() {
  UndefinedType.call(this);
}

exports.BooleanType = BooleanType;
extend(UndefinedType, BooleanType);

BooleanType.prototype.toString = function () {
  return 'boolean';
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

StringType.DEFAULT = new StringType(true);


function ListType(inner) {
  IndexedType.call(this, inner);
}

exports.ListType = ListType;
extend(IndexedType, ListType);

ListType.prototype.toString = function () {
  return '(' + this.inner.toString() + ')*';
};

ListType.prototype.setContext = function (context) {
  return new (this._setContext(context))(this.inner);
};

ListType.prototype.extend = function (name, type) {
  return new (this._extend(name, type))(this.inner);
};

ListType.prototype.isSubTypeOf = function (type) {
  return UndefinedType.prototype.isSubTypeOf.call(this, type) &&
    (!type.is(IndexedType) || this.inner.isSubTypeOf(type.inner));
};

ListType.prototype.instance = function (name, type) {
  return new (this._setContext(this.context))(this.inner.instance(name, type));
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

LambdaType.prototype.setContext = function (context) {
  return new (this._setContext(context))(this.left, this.right);
};

LambdaType.prototype.extend = function (name, type) {
  return new (this._extend(name, type))(this.left, this.right);
};

LambdaType.prototype.isSubTypeOf = function () {
  return UndefinedType.prototype.isSubTypeOf.call(this, type) && (!type.is(LambdaType) ||
    type.left.isSubTypeOf(this.left) && this.right.isSubTypeOf(type.right));
};

LambdaType.prototype.instance = function (name, type) {
  return new (this._setContext(this.context))(this.left.instance(name, type), this.right.instance(name, type));
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
