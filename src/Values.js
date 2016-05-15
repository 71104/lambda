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


function LazyValue(expression, context) {
  AbstractValue.call(this);
  this.expression = expression;
  this.context = context;
}

exports.LazyValue = LazyValue;

LazyValue.prototype = Object.create(AbstractValue.prototype);

LazyValue.prototype.type = 'lazy';

LazyValue.prototype.toString = function () {
  return 'lazy';
};

LazyValue.prototype.bindThis = function (value) {
  return new LazyValue(this.expression, this.context.add('this', value));
};

LazyValue.prototype.marshal = function () {
  var node = this.expression;
  var context = this.context;
  return function () {
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
  };
};

LazyValue.unmarshal = function (value, context) {
  return new LazyValue(new NativeNode(value, []), context || Context.EMPTY);
};

LazyValue.evaluate = function (value) {
  if (value.is(LazyValue)) {
    return value.expression.evaluate(value.context);
  } else {
    return value;
  }
};


function UndefinedValue() {
  AbstractValue.call(this);
}

exports.UndefinedValue = UndefinedValue;

UndefinedValue.prototype = Object.create(AbstractValue.prototype);

UndefinedValue.prototype.type = 'undefined';

UndefinedValue.prototype.toString = function () {
  return 'undefined';
};

UndefinedValue.prototype.marshal = function () {};

UndefinedValue.INSTANCE = new UndefinedValue();


function ObjectValue(context) {
  AbstractValue.call(this);
  if (context) {
    this.context = this.context.extend(context);
  }
}

exports.ObjectValue = ObjectValue;

ObjectValue.prototype = Object.create(AbstractValue.prototype);

ObjectValue.prototype.type = 'object';

ObjectValue.prototype.context = Context.EMPTY;

ObjectValue.prototype.toString = function () {
  return 'object';
};

ObjectValue.prototype.marshal = function () {
  var object = {};
  this.context.forEach(function (name, value) {
    object[name] = value.marshal();
  });
  return object;
};


function NativeObjectValue(context) {
  AbstractValue.call(this);
  this.context = context;
}

exports.NativeObjectValue = NativeObjectValue;

NativeObjectValue.prototype = Object.create(AbstractValue.prototype);

NativeObjectValue.prototype.type = 'object';

NativeObjectValue.prototype.toString = function () {
  return 'object';
};

NativeObjectValue.prototype.marshal = function () {
  return this.context.object;
};


function NullValue() {
  AbstractValue.call(this);
}

exports.NullValue = NullValue;

NullValue.prototype = Object.create(AbstractValue.prototype);

NullValue.prototype.type = 'null';

NullValue.prototype.toString = function () {
  return 'null';
};

NullValue.prototype.marshal = function () {
  return null;
};

NullValue.INSTANCE = new NullValue();


function BooleanValue(value) {
  ObjectValue.call(this);
  this.value = !!value;
}

exports.BooleanValue = BooleanValue;

BooleanValue.prototype = Object.create(ObjectValue.prototype);

BooleanValue.prototype.type = 'bool';

BooleanValue.prototype.toString = function () {
  if (this.value) {
    return 'true';
  } else {
    return 'false';
  }
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
  ObjectValue.call(this);
  this.real = real * 1;
  this.imaginary = imaginary * 1;
}

exports.ComplexValue = ComplexValue;

ComplexValue.prototype = Object.create(ObjectValue.prototype);

ComplexValue.prototype.type = 'complex';

ComplexValue.prototype.toString = function () {
  if (this.imaginary < 0) {
    return this.real + '-' + -this.imaginary + 'i';
  } else {
    return this.real + '+' + this.imaginary + 'i';
  }
};

ComplexValue.prototype.marshal = function () {
  return new NativeComplexValue(this.real, this.imaginary);
};


function RealValue(value) {
  ObjectValue.call(this);
  this.value = value * 1;
}

exports.RealValue = RealValue;

RealValue.prototype = Object.create(ComplexValue.prototype);

RealValue.prototype.type = 'real';

RealValue.prototype.toString = function () {
  return '' + this.value;
};

RealValue.prototype.marshal = function () {
  return this.value;
};


function IntegerValue(value) {
  ObjectValue.call(this);
  this.value = ~~value;
}

exports.IntegerValue = IntegerValue;

IntegerValue.prototype = Object.create(RealValue.prototype);

IntegerValue.prototype.type = 'integer';

IntegerValue.prototype.toString = function () {
  return '' + this.value;
};

IntegerValue.prototype.marshal = function () {
  return this.value;
};


function NaturalValue(value) {
  ObjectValue.call(this);
  this.value = ~~value;
  if (this.value < 0) {
    throw new LambdaInternalError();
  }
}

exports.NaturalValue = NaturalValue;

NaturalValue.prototype = Object.create(IntegerValue.prototype);

NaturalValue.prototype.type = 'natural';

NaturalValue.prototype.toString = function () {
  return '' + this.value;
};

NaturalValue.prototype.marshal = function () {
  return this.value;
};


function Closure(lambda, context) {
  ObjectValue.call(this);
  this.lambda = lambda;
  this.capture = context;
  this.context = this.context.add('length', new IntegerValue(this.getLength()));
}

exports.Closure = Closure;

Closure.prototype = Object.create(ObjectValue.prototype);

Closure.prototype.type = 'closure';

Closure.prototype.toString = function () {
  return 'closure';
};

Closure.prototype.bindThis = function (value) {
  return new Closure(this.lambda, this.capture.add('this', value));
};

Closure.prototype.marshal = function () {
  var length = 0;
  for (var node = this.lambda; node.is(LambdaNode); node = node.body) {
    length++;
  }
  node = this.lambda;
  var context = this.capture;
  return function () {
    var values = arguments;
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
  };
};

Closure.unmarshal = function (value, context) {
  return new Closure((function makeLambda(index, names) {
    if (index < Math.max(value.length, 1)) {
      var name = '' + index;
      names.push(name);
      return new LambdaNode(name, UndefinedType.INSTANCE, makeLambda(index + 1, names));
    } else {
      return new NativeNode(value, names);
    }
  }(0, [])), context || Context.EMPTY);
};

Closure.prototype.getLength = function () {
  var length = 0;
  for (var node = this.lambda; node.is(LambdaNode); node = node.body) {
    length++;
  }
  return length;
};


function StringValue(value) {
  ObjectValue.call(this);
  this.value = '' + value;
}

exports.StringValue = StringValue;

StringValue.prototype = Object.create(ObjectValue.prototype);

StringValue.prototype.type = 'string';

StringValue.prototype.toString = function () {
  return '\"' + this.value.replace(/\\/g, '\\\\').replace(/\"/g, '\\\"') + '\"';
};

StringValue.prototype.marshal = function () {
  return this.value;
};


function ArrayValue(array) {
  ObjectValue.call(this);
  this.array = array = array || [];
}

exports.ArrayValue = ArrayValue;

ArrayValue.prototype = Object.create(ObjectValue.prototype);

ArrayValue.prototype.type = 'array';

ArrayValue.prototype.toString = function () {
  return '{ ' + this.array.map(function (element) {
    return element.toString();
  }).join(', ') + ' }';
};

ArrayValue.prototype.marshal = function () {
  return this.array.map(function (value) {
    return value.marshal();
  });
};


function NativeArrayValue(array) {
  ObjectValue.call(this);
  this.array = array;
}

exports.NativeArrayValue = NativeArrayValue;

NativeArrayValue.prototype = Object.create(ObjectValue.prototype);

NativeArrayValue.prototype.type = 'array';

NativeArrayValue.prototype.toString = function () {
  return '{ ' + this.array.map(function (element) {
    return AbstractValue.unmarshal(element).toString();
  }).join(', ') + ' }';
};

NativeArrayValue.prototype.marshal = function () {
  return this.array;
};


AbstractValue.unmarshal = function (value) {
  switch (typeof value) {
  case 'undefined':
    return UndefinedValue.INSTANCE;
  case 'boolean':
    return BooleanValue.unmarshal(value);
  case 'number':
    if (value % 1) {
      return new RealValue(value);
    } else {
      return new IntegerValue(~~value);
    }
    break;
  case 'string':
    return new StringValue(value);
  case 'function':
    return Closure.unmarshal(value);
  case 'object':
    if (value === null) {
      return NullValue.INSTANCE;
    } else if (Array.isArray(value)) {
      return new NativeArrayValue(value);
    } else if (value instanceof NativeComplexValue) {
      return new ComplexValue(value.r, value.i);
    } else {
      return new NativeObjectValue(new NativeContext(value));
    }
    break;
  }
};
