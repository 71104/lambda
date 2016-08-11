function AbstractValue() {}

exports.AbstractValue = AbstractValue;

AbstractValue.prototype.is = function (Class) {
  return this instanceof Class;
};

AbstractValue.prototype.bindThis = function () {
  return this;
};


function UndefinedValue() {
  AbstractValue.call(this);
}

exports.UndefinedValue = UndefinedValue;
extend(AbstractValue, UndefinedValue);

UndefinedValue.prototype.context = Context.EMPTY;

UndefinedValue.prototype.toString = function () {
  return 'undefined';
};

UndefinedValue.prototype._clone = function () {
  return new UndefinedValue();
};

UndefinedValue.prototype.clone = function (context) {
  var value = this._clone();
  value.context = context;
  return value;
};

UndefinedValue.DEFAULT = new UndefinedValue();

UndefinedValue.fromContext = function (context) {
  return UndefinedValue.DEFAULT.clone(context);
};


function ComplexValue(real, imaginary) {
  real = +real;
  imaginary = +imaginary;
  UndefinedValue.call(this);
  this.real = real;
  this.imaginary = imaginary;
}

exports.ComplexValue = ComplexValue;
extend(UndefinedValue, ComplexValue);

ComplexValue.prototype.toString = function () {
  if (this.imaginary < 0) {
    return this.real + '' + this.imaginary + 'i';
  } else {
    return this.real + '+' + this.imaginary + 'i';
  }
};

ComplexValue.prototype._clone = function () {
  return new ComplexValue(this.real, this.imaginary);
};


function RealValue(value) {
  value = +value;
  ComplexValue.call(this, value, 0);
  this.value = value;
}

exports.RealValue = RealValue;
extend(ComplexValue, RealValue);

RealValue.prototype.toString = function () {
  return '' + this.value;
};

RealValue.prototype._clone = function () {
  return new RealValue(this.value);
};


function IntegerValue(value) {
  RealValue.call(this, ~~value);
}

exports.IntegerValue = IntegerValue;
extend(RealValue, IntegerValue);

IntegerValue.prototype.toString = function () {
  return '' + this.value;
};

IntegerValue.prototype._clone = function () {
  return new IntegerValue(this.value);
};


function NaturalValue(value) {
  value = ~~value;
  if (value < 0) {
    throw new LambdaInternalError();
  }
  IntegerValue.call(this, value);
}

exports.NaturalValue = NaturalValue;
extend(IntegerValue, NaturalValue);

NaturalValue.prototype.toString = function () {
  return '' + this.value;
};

NaturalValue.prototype._clone = function () {
  return new NaturalValue(this.value);
};


function BooleanValue(value) {
  value = !!value;
  UndefinedValue.call(this);
  this.value = value;
}

exports.BooleanValue = BooleanValue;
extend(UndefinedValue, BooleanValue);

BooleanValue.prototype.toString = function () {
  if (this.value) {
    return 'true';
  } else {
    return 'false';
  }
};

BooleanValue.prototype._clone = function () {
  return new BooleanValue(this.value);
};

BooleanValue.TRUE = new BooleanValue(true);
BooleanValue.FALSE = new BooleanValue(false);


function IndexedValue() {
  UndefinedValue.call(this);
}

exports.IndexedValue = IndexedValue;
extend(UndefinedValue, IndexedValue);


function StringValue(value) {
  value = '' + value;
  IndexedValue.call(this);
  this.value = value;
}

exports.StringValue = StringValue;
extend(IndexedValue, StringValue);

StringValue.prototype.toString = function () {
  return this.value;
};

StringValue.prototype._clone = function () {
  return new StringValue(this.value);
};

StringValue.prototype.lookup = function (index) {
  if (index < 0 || index >= this.value.length) {
    throw new LambdaRuntimeError();
  }
  return new StringValue(this.value[index]);
};


function ListValue(values) {
  IndexedValue.call(this);
  this.values = values;
}

exports.ListValue = ListValue;
extend(IndexedValue, ListValue);

ListValue.prototype.toString = function () {
  return '{ ' + this.values.map(function (value) {
    return value.toString();
  }).join(', ') + ' }';
};

ListValue.prototype._clone = function () {
  return new ListValue(this.values);
};

ListValue.prototype.lookup = function (index) {
  if (index < 0 || index >= this.values.length) {
    throw new LambdaRuntimeError();
  }
  return this.values[index];
};


function Closure(lambda, capture) {
  UndefinedValue.call(this);
  this.lambda = lambda;
  this.capture = capture;
}

exports.Closure = Closure;
extend(UndefinedValue, Closure);

Closure.prototype.toString = function () {
  return 'closure';
};

Closure.prototype._clone = function () {
  return new Closure(this.lambda, this.capture);
};

Closure.prototype.bindThis = function (value) {
  return this.lambda.body.evaluate(this.capture.add(this.lambda.name, value));
};
