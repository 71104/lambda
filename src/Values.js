function AbstractValue() {}

exports.AbstractValue = AbstractValue;

AbstractValue.prototype.is = function (Class) {
  return this instanceof Class;
};

AbstractValue.prototype.isAny = function () {
  for (var i = 0; i < arguments.length; i++) {
    if (this instanceof arguments[i]) {
      return true;
    }
  }
  return false;
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
UndefinedValue.prototype.native = false;

UndefinedValue.prototype.type = 'undefined';

UndefinedValue.prototype.toString = function () {
  return 'undefined';
};

UndefinedValue.prototype.clone = function (context) {
  var result = new UndefinedValue();
  result.context = context;
  return result;
};

UndefinedValue.prototype.extend = function (hash) {
  return this.clone(this.context.addAll(hash));
};

UndefinedValue.prototype.marshal = function () {
  if (this.native) {
    return this.context.object;
  } else {
    var object = {};
    this.context.forEach(function (name, value) {
      object[name] = value.marshal();
    });
    return object;
  }
};

UndefinedValue.INSTANCE = new UndefinedValue();

UndefinedValue.unmarshal = function (object) {
  var value = new UndefinedValue();
  value.context = new NativeContext(object);
  value.native = true;
  return value;
};


function BooleanValue(value) {
  UndefinedValue.call(this);
  this.value = !!value;
}

exports.BooleanValue = BooleanValue;
extend(UndefinedValue, BooleanValue);

BooleanValue.prototype.type = 'bool';

BooleanValue.prototype.toString = function () {
  if (this.value) {
    return 'true';
  } else {
    return 'false';
  }
};

BooleanValue.prototype.clone = function (context) {
  var result = new BooleanValue(this.value);
  result.context = context;
  return result;
};

BooleanValue.prototype.marshal = function () {
  return this.value;
};

BooleanValue.TRUE = new BooleanValue(true);
BooleanValue.FALSE = new BooleanValue(false);

BooleanValue.unmarshal = function (value) {
  if (value) {
    return BooleanValue.TRUE;
  } else {
    return BooleanValue.FALSE;
  }
};


function NativeComplexValue(real, imaginary) {
  this.r = real;
  this.i = imaginary;
}

NativeComplexValue.prototype.toString = function () {
  if (this.i < 0) {
    return this.r + '-' + -this.i + 'i';
  } else {
    return this.r + '+' + this.i + 'i';
  }
};


function ComplexValue(real, imaginary) {
  UndefinedValue.call(this);
  this.real = real * 1;
  this.imaginary = imaginary * 1;
}

exports.ComplexValue = ComplexValue;
extend(UndefinedValue, ComplexValue);

ComplexValue.prototype.type = 'complex';

ComplexValue.prototype.toString = function () {
  if (this.imaginary < 0) {
    return this.real + '-' + -this.imaginary + 'i';
  } else {
    return this.real + '+' + this.imaginary + 'i';
  }
};

ComplexValue.prototype.clone = function (context) {
  var result = new ComplexValue(this.real, this.imaginary);
  result.context = context;
  return result;
};

ComplexValue.prototype.marshal = function () {
  return new NativeComplexValue(this.real, this.imaginary);
};


function RealValue(value) {
  ComplexValue.call(this, value * 1, 0);
  this.value = this.real;
}

exports.RealValue = RealValue;
extend(ComplexValue, RealValue);

RealValue.prototype.type = 'real';

RealValue.prototype.toString = function () {
  return '' + this.value;
};

RealValue.prototype.clone = function (context) {
  var result = new RealValue(this.value);
  result.context = context;
  return result;
};

RealValue.prototype.marshal = function () {
  return this.value;
};


function IntegerValue(value) {
  RealValue.call(this, ~~value);
}

exports.IntegerValue = IntegerValue;
extend(RealValue, IntegerValue);

IntegerValue.prototype.type = 'integer';

IntegerValue.prototype.toString = function () {
  return '' + this.value;
};

IntegerValue.prototype.clone = function (context) {
  var result = new IntegerValue(this.value);
  result.context = context;
  return result;
};

IntegerValue.prototype.marshal = function () {
  return this.value;
};


function NaturalValue(value) {
  IntegerValue.call(this, ~~value);
  if (this.value < 0) {
    throw new LambdaInternalError();
  }
}

exports.NaturalValue = NaturalValue;
extend(IntegerValue, NaturalValue);

NaturalValue.prototype.type = 'natural';

NaturalValue.prototype.toString = function () {
  return '' + this.value;
};

NaturalValue.prototype.clone = function (context) {
  var result = new NaturalValue(this.value);
  result.context = context;
  return result;
};

NaturalValue.prototype.marshal = function () {
  return this.value;
};


function Closure(lambda, capture) {
  UndefinedValue.call(this);
  this.lambda = lambda;
  this.capture = capture;
  this.context = this.context.add('length', new NaturalValue(this.getLength()));
}

exports.Closure = Closure;
extend(UndefinedValue, Closure);

Closure.prototype.type = 'closure';

Closure.prototype.toString = function () {
  return 'closure';
};

Closure.prototype.clone = function (context) {
  var result = new Closure(this.lambda, this.capture);
  result.context = context;
  return result;
};

Closure.prototype.bindThis = function (value) {
  return this.lambda.body.evaluate(this.capture.add(this.lambda.name, value));
};

Closure.prototype.marshal = function () {
  var node = this.lambda;
  var context = this.capture;
  var length = this.getLength();
  var hasThis = this.lambda.name === 'this';
  return arity(length - !hasThis, function () {
    var values = [].slice.call(arguments);
    if (hasThis) {
      values.unshift(this);
    }
    return (function augment(node, context, index) {
      if (index < length) {
        return augment(node.body, context.add(node.name, AbstractValue.unmarshal(values[index])), index + 1);
      } else {
        return (function () {
          try {
            return node.evaluate(context);
          } catch (e) {
            if (e instanceof LambdaUserError) {
              throw e.value.marshal();
            } else {
              throw e;
            }
          }
        }()).marshal();
      }
    }(node, context, 0));
  });
};

Closure.unmarshal = function (value, extraArgument) {
  var minLength = 1 + !!extraArgument;
  return new Closure((function makeLambda(index, names) {
    if (index < Math.max(value.length + 1, minLength)) {
      var name = '' + index;
      names.push(name);
      return new LambdaNode(name, UndefinedType.INSTANCE, makeLambda(index + 1, names));
    } else {
      return new NativeNode(value, names);
    }
  }(0, [])), Context.EMPTY);
};

Closure.prototype.getLength = function () {
  var length = 1;
  for (var node = this.lambda.body; node.is(LambdaNode) && node.name !== 'this'; node = node.body) {
    length++;
  }
  return length;
};


function StringValue(value) {
  UndefinedValue.call(this);
  this.value = '' + value;
}

exports.StringValue = StringValue;
extend(UndefinedValue, StringValue);

StringValue.prototype.type = 'string';

StringValue.prototype.toString = function () {
  return '\"' + this.value.replace(/\\/g, '\\\\').replace(/\"/g, '\\\"') + '\"';
};

StringValue.prototype.clone = function (context) {
  var result = new StringValue(this.value);
  result.context = context;
  return result;
};

StringValue.prototype.marshal = function () {
  return this.value;
};


function ListValue(values) {
  UndefinedValue.call(this);
  this.values = values || [];
}

exports.ListValue = ListValue;
extend(UndefinedValue, ListValue);

ListValue.prototype.type = 'list';

ListValue.prototype.toString = function () {
  return '{ ' + this.values.map(function (element) {
    return element.toString();
  }).join(', ') + ' }';
};

ListValue.prototype.getValues = function () {
  return this.values;
};

ListValue.prototype.clone = function (context) {
  var result = new ListValue(this.values);
  result.context = context;
  return result;
};

ListValue.prototype.marshal = function () {
  return this.values.map(function (value) {
    return value.marshal();
  });
};


function NativeArrayValue(array) {
  UndefinedValue.call(this);
  this.values = array;
}

exports.NativeArrayValue = NativeArrayValue;
extend(UndefinedValue, NativeArrayValue);

NativeArrayValue.prototype.type = 'list';

NativeArrayValue.prototype.toString = function () {
  return '{ ' + this.values.map(function (element) {
    return AbstractValue.unmarshal(element).toString();
  }).join(', ') + ' }';
};

NativeArrayValue.prototype.getValues = function () {
  return this.values.map(function (value) {
    return AbstractValue.unmarshal(value);
  });
};

NativeArrayValue.prototype.clone = function (context) {
  var result = new NativeArrayValue(this.values);
  result.context = context;
  return result;
};

NativeArrayValue.prototype.marshal = function () {
  return this.values;
};


function UnknownValue() {
  AbstractValue.call(this);
}

exports.UnknownValue = UnknownValue;
extend(AbstractValue, UnknownValue);

UnknownValue.prototype.type = 'unknown';

UnknownValue.prototype.toString = function () {
  return 'unknown';
};

UnknownValue.prototype.marshal = function () {
  throw new LambdaInternalError();
};

UnknownValue.INSTANCE = new UnknownValue();


function JSUndefinedValue() {
  AbstractValue.call(this);
}

exports.JSUndefinedValue = JSUndefinedValue;
extend(AbstractValue, JSUndefinedValue);

JSUndefinedValue.prototype.type = 'JavaScript.UNDEFINED';

JSUndefinedValue.prototype.toString = function () {
  return 'JavaScript.UNDEFINED';
};

JSUndefinedValue.prototype.marshal = function () {};

JSUndefinedValue.INSTANCE = new JSUndefinedValue();


function JSNullValue() {
  AbstractValue.call(this);
}

exports.JSNullValue = JSNullValue;
extend(AbstractValue, JSNullValue);

JSNullValue.prototype.type = 'JavaScript.NULL';

JSNullValue.prototype.toString = function () {
  return 'JavaScript.NULL';
};

JSNullValue.prototype.marshal = function () {
  return null;
};

JSNullValue.INSTANCE = new JSNullValue();


AbstractValue.unmarshal = function (value) {
  switch (typeof value) {
  case 'undefined':
    return JSUndefinedValue.INSTANCE;
  case 'boolean':
    return BooleanValue.unmarshal(value);
  case 'number':
    if (value % 1) {
      return new RealValue(value);
    } else if (value < 0) {
      return new IntegerValue(~~value);
    } else {
      return new NaturalValue(~~value);
    }
    break;
  case 'string':
    return new StringValue(value);
  case 'function':
    return Closure.unmarshal(value, true);
  case 'object':
    if (value === null) {
      return JSNullValue.INSTANCE;
    } else if (value instanceof Boolean || value instanceof Number || value instanceof String) {
      return AbstractValue.unmarshal(value.valueOf());
    } else if (Array.isArray(value)) {
      return new NativeArrayValue(value);
    } else if (value instanceof NativeComplexValue) {
      return new ComplexValue(value.r, value.i);
    } else {
      return UndefinedValue.unmarshal(value);
    }
    break;
  }
};

AbstractValue.getGlobal = function (name, Error) {
  return AbstractValue.unmarshal(getGlobalValue(name, Error));
};
