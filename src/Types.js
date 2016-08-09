function UndefinedType() {}

exports.UndefinedType = UndefinedType;

UndefinedType.prototype.is = function (Class) {
  return this instanceof Class;
};

UndefinedType.prototype.isProper = function (Class) {
  return this.constructor === Class;
};

UndefinedType.prototype.context = Context.EMPTY;

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

ComplexType.DEFAULT = new ComplexType();

ComplexType.prototype.isSubTypeOf = function (type) {
  return (type.isProper(ComplexType) || type.isProper(UndefinedType)) &&
      (type === ComplexType.DEFAULT || this.isSubPrototypeOf(type));
};


function RealType() {
  ComplexType.call(this);
}

exports.RealType = RealType;
extend(ComplexType, RealType);

RealType.DEFAULT = new RealType();


function IntegerType() {
  RealType.call(this);
}

exports.IntegerType = IntegerType;
extend(RealType, IntegerType);

IntegerType.DEFAULT = new IntegerType();


function NaturalType() {
  IntegerType.call(this);
}

exports.NaturalType = NaturalType;
extend(IntegerType, NaturalType);

NaturalType.DEFAULT = new NaturalType();


function BooleanType() {
  UndefinedType.call(this);
}

exports.BooleanType = BooleanType;
extend(UndefinedType, BooleanType);

BooleanType.DEFAULT = new BooleanType();


function IndexedType() {
  UndefinedType.call(this);
}

exports.IndexedType = IndexedType;
extend(UndefinedType, IndexedType);


function StringType() {
  IndexedType.call(this);
}

exports.StringType = StringType;
extend(IndexedType, StringType);

StringType.DEFAULT = new StringType();


function ListType(inner) {
  IndexedType.call(this);
  this.inner = inner;
}

exports.ListType = ListType;
extend(IndexedType, ListType);


function ClosureType(left, right) {
  UndefinedType.call(this);
  this.left = left;
  this.right = right;
}

exports.Closure = Closure;
extend(UndefinedType, Closure);


function UnknownType() {
  UndefinedType.call(this);
}

exports.UnknownType = UnknownType;
extend(UndefinedType, UnknownType);

UnknownType.DEFAULT = new UnknownType();
