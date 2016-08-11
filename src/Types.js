function UndefinedType() {}

exports.UndefinedType = UndefinedType;

UndefinedType.prototype.is = function (Class) {
  return this instanceof Class;
};

UndefinedType.prototype.isProper = function (Class) {
  return this.constructor === Class;
};

UndefinedType.prototype.isProperlyAny = function () {
  for (var i = 0; i < arguments.length; i++) {
    return true;
  }
  return false;
};

UndefinedType.prototype.context = Context.EMPTY;

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
  return type.isProper(UndefinedType) &&
      (type === UndefinedType.DEFAULT || this.isSubPrototypeOf(type));
};


function ComplexType() {
  UndefinedType.call(this);
}

exports.ComplexType = ComplexType;
extend(UndefinedType, ComplexType);

ComplexType.prototype.clone = function (context) {
  var type = new ComplexType();
  type.context = context;
  return type;
};

ComplexType.DEFAULT = new ComplexType();

ComplexType.prototype.isSubTypeOf = function (type) {
  return type.isProperlyAny(ComplexType, UndefinedType) &&
      (type === ComplexType.DEFAULT || this.isSubPrototypeOf(type));
};


function RealType() {
  ComplexType.call(this);
}

exports.RealType = RealType;
extend(ComplexType, RealType);

RealType.prototype.clone = function (context) {
  var type = new RealType();
  type.context = context;
  return type;
};

RealType.DEFAULT = new RealType();

RealType.prototype.isSubTypeOf = function (type) {
  return type.isProperlyAny(RealType, ComplexType, UndefinedType) &&
      (type === RealType.DEFAULT || this.isSubPrototypeOf(type));
};


function IntegerType() {
  RealType.call(this);
}

exports.IntegerType = IntegerType;
extend(RealType, IntegerType);

IntegerType.prototype.clone = function (context) {
  var type = new IntegerType();
  type.context = context;
  return type;
};

IntegerType.DEFAULT = new IntegerType();

IntegerType.prototype.isSubTypeOf = function (type) {
  return type.isProperlyAny(IntegerType, RealType, ComplexType, UndefinedType) &&
      (type === IntegerType.DEFAULT || this.isSubPrototypeOf(type));
};


function NaturalType() {
  IntegerType.call(this);
}

exports.NaturalType = NaturalType;
extend(IntegerType, NaturalType);

NaturalType.prototype.clone = function (context) {
  var type = new NaturalType();
  type.context = context;
  return type;
};

NaturalType.DEFAULT = new NaturalType();

NaturalType.prototype.isSubTypeOf = function (type) {
  return type.isProperlyAny(NaturalType, IntegerType, RealType, ComplexType, UndefinedType) &&
      (type === NaturalType.DEFAULT || this.isSubPrototypeOf(type));
};


function BooleanType() {
  UndefinedType.call(this);
}

exports.BooleanType = BooleanType;
extend(UndefinedType, BooleanType);

BooleanType.prototype.clone = function (context) {
  var type = new BooleanType();
  type.context = context;
  return type;
};

BooleanType.DEFAULT = new BooleanType();

BooleanType.prototype.isSubTypeOf = function (type) {
  return type.isProperlyAny(BooleanType, UndefinedType) &&
      (type === BooleanType.DEFAULT || this.isSubPrototypeOf(type));
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

StringType.prototype.clone = function (context) {
  var type = new StringType();
  type.context = context;
  return type;
};

StringType.DEFAULT = new StringType();

StringType.prototype.isSubTypeOf = function () {
  // TODO
};


function ListType(inner) {
  IndexedType.call(this, inner);
}

exports.ListType = ListType;
extend(IndexedType, ListType);

ListType.prototype.clone = function (context) {
  var type = new ListType(this.inner);
  type.context = context;
  return type;
};

ListType.prototype.isSubTypeOf = function () {
  // TODO
};


function ClosureType(left, right) {
  UndefinedType.call(this);
  this.left = left;
  this.right = right;
}

exports.ClosureType = ClosureType;
extend(UndefinedType, ClosureType);

ClosureType.prototype.clone = function (context) {
  var type = new ClosureType(this.left, this.right);
  type.context = context;
  return type;
};

ClosureType.prototype.isSubTypeOf = function () {
  // TODO
};


function UnknownType() {
  UndefinedType.call(this);
}

exports.UnknownType = UnknownType;
extend(UndefinedType, UnknownType);

UnknownType.prototype.clone = function (context) {
  var type = new UnknownType();
  type.context = context;
  return type;
};

UnknownType.DEFAULT = new UnknownType();

UnknownType.prototype.isSubTypeOf = function (type) {
  return !type.isProper(UnknownType) || this === UnknownType.DEFAULT ||
      type !== UnknownType.DEFAULT && this.context.keys().every(function (key) {
        return type.context.has(key) && this.context.top(key).isSubTypeOf(type.context.top(key));
      }, this);
};
