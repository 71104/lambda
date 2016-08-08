function UndefinedType() {}

exports.UndefinedType = UndefinedType;

UndefinedType.prototype.is = function (Class) {
  return this instanceof Class;
};

UndefinedType.prototype.isProper = function (Class) {
  return this.constructor === Class;
};

UndefinedType.prototype.context = Context.EMPTY;


function ComplexType() {
  UndefinedType.call(this);
}

exports.ComplexType = ComplexType;
extend(UndefinedType, ComplexType);
