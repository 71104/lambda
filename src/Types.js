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

AbstractType.prototype.bindThis = function () {
  return this;
};

AbstractType.prototype.replace = function () {
  return this;
};

// TODO: find a better name
AbstractType.mergeContexts = function (context1, context2) {
  var hash = Object.create(null);
  context1.names().intersection(context2.names()).forEach(function (name) {
    hash[name] = context1.top(name).union(context2.top(name));
  });
  return new Context(hash);
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
  var result = new UndefinedType();
  result.context = context;
  return result;
};

UndefinedType.prototype.isSubTypeOf = function (type) {
  return type === this ||
    type.is(UndefinedType) &&
    this instanceof type.constructor &&
    type.context.every(function (name, value) {
      return this.context.has(name) && this.context.top(name).isSubTypeOf(value);
    }, this);
};

UndefinedType.prototype.union = function (type) {
  if (this === type || type.is(UnknownType)) {
    return this;
  } else if (type.is(UndefinedType)) {
    if (type.isSubTypeOf(this)) {
      return this;
    } else if (this.isSubTypeOf(type)) {
      return type;
    } else {
      var root = UndefinedType.INSTANCE;
      return root.clone(AbstractType.mergeContexts(root.context, type.context));
    }
  } else {
    throw new LambdaTypeError();
  }
};

UndefinedType.INSTANCE = new UndefinedType();


function UnknownType() {
  UndefinedType.call(this);
}

exports.UnknownType = UnknownType;
extend(UndefinedType, UnknownType);

UnknownType.prototype.toString = function () {
  return 'unknown';
};

UnknownType.prototype.clone = function (context) {
  var result = new UnknownType();
  result.context = context;
  return result;
};

UnknownType.prototype.isSubTypeOf = function (type) {
  if (type.is(UnknownType)) {
    return this === type || this.context.every(function (name, value) {
      return type.context.has(name) && value.isSubTypeOf(type.context.top(name));
    });
  } else {
    return true;
  }
};

UnknownType.prototype.union = function (type) {
  if (type.is(UnknownType)) {
    var hash = Object.create(null);
    this.context.forEach(function (name, type) {
      hash[name] = type;
    });
    type.context.forEach(function (name, type) {
      hash[name] = type;
    });
    return UnknownType.INSTANCE.clone(new Context(hash));
  } else {
    return type;
  }
};

UnknownType.INSTANCE = new UnknownType();


function IndexedType(inner) {
  UndefinedType.call(this);
  this.inner = inner;
}

exports.IndexedType = IndexedType;
extend(UndefinedType, IndexedType);

IndexedType.prototype.isSubTypeOf = function (type) {
  return this === type ||
    UndefinedType.prototype.isSubTypeOf.call(this, type) &&
    (!type.is(IndexedType) || this.inner.isSubTypeOf(type.inner));
};

IndexedType.prototype.replace = function (name, type) {
  return new IndexedType(this.inner.replace(name, type));
};


function BooleanType() {
  UndefinedType.call(this);
}

exports.BooleanType = BooleanType;
extend(UndefinedType, BooleanType);

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
extend(UndefinedType, ComplexType);

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
extend(ComplexType, RealType);

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
extend(RealType, IntegerType);

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
extend(IntegerType, NaturalType);

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
extend(IndexedType, StringType);

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
extend(UndefinedType, LambdaType);

LambdaType.prototype.toString = function () {
  return '(' + this.left + ' => ' + this.right + ')';
};

LambdaType.prototype.clone = function (context) {
  var result = new LambdaType(this.left, this.right);
  result.context = context;
  return result;
};

LambdaType.prototype.isSubTypeOf = function (type) {
  return this === type ||
    UndefinedType.prototype.isSubTypeOf.call(this, type) &&
    (!type.is(LambdaType) ||
      type.left.isSubTypeOf(this.left) &&
      this.right.isSubTypeOf(type.right));
};

LambdaType.prototype.bindThis = function (type) {
  if (type.isSubTypeOf(this.left)) {
    return this.right;
  } else {
    throw new LambdaTypeError();
  }
};

LambdaType.prototype.replace = function (name, type) {
  return new LambdaType(
    this.left.replace(name, type),
    this.right.replace(name, type));
};


function ListType(inner) {
  IndexedType.call(this, inner);
}

exports.ListType = ListType;
extend(IndexedType, ListType);

ListType.prototype.toString = function () {
  return this.inner + '*';
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
extend(AbstractType, VariableType);

VariableType.prototype.toString = function () {
  return this.name;
};

VariableType.prototype.replace = function (name, type) {
  if (name !== this.name) {
    return this;
  } else {
    return type;
  }
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

ForEachType.prototype.bindThis = function (type) {
  var inner = this.inner.replace(this.name, type);
  if (inner.is(LambdaType)) {
    if (type.isSubTypeOf(inner.left)) {
      return inner.right;
    } else {
      throw new LambdaTypeError();
    }
  } else {
    return inner;
  }
};

ForEachType.prototype.replace = function (name, type) {
  if (name !== this.name) {
    return new ForEachType(name, this.inner.replace(name, type));
  } else {
    return this.inner.replace(name, type);
  }
};
