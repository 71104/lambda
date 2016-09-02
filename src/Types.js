function AbstractType() {}

exports.AbstractType = AbstractType;

AbstractType.prototype.is = function (Class) {
  return this instanceof Class;
};

AbstractType.prototype.bind = function () {
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

ForEachType.prototype.bind = function (type) {
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
  return this.isSubCharacterOf(type) && (type.hasDefaultPrototype || this.isSubPrototypeOf(type));
};

PrototypedType.merge = function (type1, type2) {
  if (type1.isSubCharacterOf(type2)) {
    return type2.setContext(type1.context.intersection(type2.context, PrototypedType.merge));
  } else if (type2.isSubCharacterOf(type1)) {
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

UndefinedType.prototype.character = Character.UNDEFINED;

UndefinedType.prototype.toString = function () {
  return 'undefined';
};

UndefinedType.prototype.setContext = function (context) {
  return new (this._setContext(context))();
};

UndefinedType.prototype.extend = function (name, type) {
  return new (this._extend(name, type))();
};

UndefinedType.prototype.isSubCharacterOf = function (type) {
  return Character.UNDEFINED === type.character;
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

UnknownType.prototype.character = Character.UNKNOWN;

UnknownType.prototype.toString = function () {
  return 'unknown';
};

UnknownType.DEFAULT = new UnknownType();

UnknownType.prototype.isSubCharacterOf = function () {
  return true;
};

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

VariableType.prototype.isSubCharacterOf = function () {
  // TODO
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

ComplexType.prototype.character = Character.COMPLEX;

ComplexType.prototype.toString = function () {
  return 'complex';
};

ComplexType.prototype.isSubCharacterOf = function (type) {
  return Character.UNDEFINED === type.character ||
    Character.COMPLEX === type.character;
};

ComplexType.DEFAULT = new ComplexType();


function RealType() {
  ComplexType.call(this);
}

exports.RealType = RealType;
extend(ComplexType, RealType);

RealType.prototype.character = Character.REAL;

RealType.prototype.toString = function () {
  return 'real';
};

RealType.prototype.isSubCharacterOf = function (type) {
  return Character.UNDEFINED === type.character ||
    Character.COMPLEX === type.character ||
    Character.REAL === type.character;
};

RealType.DEFAULT = new RealType();


function IntegerType() {
  RealType.call(this);
}

exports.IntegerType = IntegerType;
extend(RealType, IntegerType);

IntegerType.prototype.character = Character.INTEGER;

IntegerType.prototype.toString = function () {
  return 'integer';
};

IntegerType.prototype.isSubCharacterOf = function (type) {
  return Character.UNDEFINED === type.character ||
    Character.COMPLEX === type.character ||
    Character.REAL === type.character ||
    Character.INTEGER === type.character;
};

IntegerType.DEFAULT = new IntegerType();


function NaturalType() {
  IntegerType.call(this);
}

exports.NaturalType = NaturalType;
extend(IntegerType, NaturalType);

NaturalType.prototype.character = Character.NATURAL;

NaturalType.prototype.toString = function () {
  return 'natural';
};

NaturalType.prototype.isSubCharacterOf = function (type) {
  return Character.UNDEFINED === type.character ||
    Character.COMPLEX === type.character ||
    Character.REAL === type.character ||
    Character.INTEGER === type.character ||
    Character.NATURAL === type.character;
};

NaturalType.DEFAULT = new NaturalType();


function BooleanType() {
  UndefinedType.call(this);
}

exports.BooleanType = BooleanType;
extend(UndefinedType, BooleanType);

BooleanType.prototype.character = Character.BOOLEAN;

BooleanType.prototype.toString = function () {
  return 'boolean';
};

BooleanType.prototype.isSubCharacterOf = function (type) {
  return Character.UNDEFINED === type.character ||
    Character.BOOLEAN === type.character;
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

StringType.prototype.character = Character.STRING;

StringType.prototype.toString = function () {
  return 'string';
};

StringType.prototype.isSubCharacterOf = function (type) {
  return Character.UNDEFINED === type.character ||
    Character.STRING === type.character;
};

StringType.DEFAULT = new StringType(true);


function ListType(inner) {
  IndexedType.call(this, inner);
}

exports.ListType = ListType;
extend(IndexedType, ListType);

ListType.prototype.character = Character.LIST;

ListType.prototype.toString = function () {
  return '(' + this.inner.toString() + ')*';
};

ListType.prototype.setContext = function (context) {
  return new (this._setContext(context))(this.inner);
};

ListType.prototype.extend = function (name, type) {
  return new (this._extend(name, type))(this.inner);
};

ListType.prototype.isSubCharacterOf = function (type) {
  return Character.UNDEFINED === type.character ||
    Character.LIST === type.character;
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

LambdaType.prototype.character = Character.LAMBDA;

LambdaType.prototype.toString = function () {
  return '(' + this.left.toString() + ') => (' + this.right.toString() + ')';
};

LambdaType.prototype.setContext = function (context) {
  return new (this._setContext(context))(this.left, this.right);
};

LambdaType.prototype.extend = function (name, type) {
  return new (this._extend(name, type))(this.left, this.right);
};

LambdaType.prototype.isSubCharacterOf = function (type) {
  return Character.UNDEFINED === type.character ||
    Character.LAMBDA === type.character;
};

LambdaType.prototype.isSubTypeOf = function () {
  return UndefinedType.prototype.isSubTypeOf.call(this, type) && (!type.is(LambdaType) ||
    type.left.isSubTypeOf(this.left) && this.right.isSubTypeOf(type.right));
};

LambdaType.prototype.instance = function (name, type) {
  return new (this._setContext(this.context))(this.left.instance(name, type), this.right.instance(name, type));
};

LambdaType.prototype.bind = function (type) {
  if (this.left.is(VariableType)) {
    return this.right.instance(this.left.name, type);
  } else if (type.isSubTypeOf(this.left)) {
    return this.right;
  } else {
    throw new LambdaTypeError();
  }
};
