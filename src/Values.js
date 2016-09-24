function AbstractValue() {}

exports.AbstractValue = AbstractValue;

AbstractValue.prototype.is = function (Class) {
  return this instanceof Class;
};

AbstractValue.prototype._setContext = function (context) {
  var constructor = this.constructor;
  var Value = function () {
    constructor.apply(this, arguments);
  };
  extend(constructor, Value);
  Value.prototype.context = context;
  return Value;
};

AbstractValue.prototype._extend = function (name, value) {
  return this._setContext(this.context.add(name, value));
};

AbstractValue.prototype.bind = function () {
  return this;
};


function UndefinedValue() {
  AbstractValue.call(this);
}

exports.UndefinedValue = UndefinedValue;
extend(AbstractValue, UndefinedValue);

UndefinedValue.prototype.character = Character.UNDEFINED;
UndefinedValue.prototype.context = Context.EMPTY;

UndefinedValue.prototype.toString = function () {
  return 'undefined';
};

UndefinedValue.prototype.extend = function (name, value) {
  return new (this._extend(name, value))();
};

UndefinedValue.prototype.marshal = function () {
  return this.context.toObject();
};

UndefinedValue.DEFAULT = new UndefinedValue();

UndefinedValue.fromContext = function (context) {
  return new (UndefinedValue.DEFAULT._setContext(context))();
};


function NativeComplexValue(real, imaginary) {
  this.r = +real;
  this.i = +imaginary;
}

exports.NativeComplexValue = NativeComplexValue;

NativeComplexValue.prototype.toString = function () {
  if (this.i < 0) {
    return this.r + '' + this.i + 'i';
  } else {
    return this.r + '+' + this.i + 'i';
  }
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

ComplexValue.prototype.character = Character.COMPLEX;

ComplexValue.prototype.toString = function () {
  if (this.imaginary < 0) {
    return this.real + '' + this.imaginary + 'i';
  } else {
    return this.real + '+' + this.imaginary + 'i';
  }
};

ComplexValue.prototype.extend = function (name, value) {
  return new (this._extend(name, value))(this.real, this.imaginary);
};

ComplexValue.prototype.marshal = function () {
  return new NativeComplexValue(this.real, this.imaginary);
};


function RealValue(value) {
  value = +value;
  ComplexValue.call(this, value, 0);
  this.value = value;
}

exports.RealValue = RealValue;
extend(ComplexValue, RealValue);

RealValue.prototype.character = Character.REAL;

RealValue.prototype.toString = function () {
  return '' + this.value;
};

RealValue.prototype.extend = function (name, value) {
  return new (this._extend(name, value))(this.value);
};

RealValue.prototype.marshal = function () {
  return this.value;
};


function IntegerValue(value) {
  RealValue.call(this, ~~value);
}

exports.IntegerValue = IntegerValue;
extend(RealValue, IntegerValue);

IntegerValue.prototype.character = Character.INTEGER;

IntegerValue.prototype.toString = function () {
  return '' + this.value;
};

IntegerValue.prototype.extend = function (name, value) {
  return new (this._extend(name, value))(this.value);
};

IntegerValue.prototype.marshal = function () {
  return this.value;
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

NaturalValue.prototype.character = Character.NATURAL;

NaturalValue.prototype.toString = function () {
  return '' + this.value;
};

NaturalValue.prototype.extend = function (name, value) {
  return new (this._extend(name, value))(this.value);
};

NaturalValue.prototype.marshal = function () {
  return this.value;
};


function BooleanValue(value) {
  value = !!value;
  UndefinedValue.call(this);
  this.value = value;
}

exports.BooleanValue = BooleanValue;
extend(UndefinedValue, BooleanValue);

BooleanValue.prototype.character = Character.BOOLEAN;

BooleanValue.prototype.toString = function () {
  if (this.value) {
    return 'true';
  } else {
    return 'false';
  }
};

BooleanValue.prototype.extend = function (name, value) {
  return new (this._extend(name, value))(this.value);
};

BooleanValue.prototype.marshal = function () {
  return this.value;
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

StringValue.prototype.character = Character.STRING;

StringValue.prototype.toString = function () {
  return '\'' + this.value
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
      .replace(/\'/g, '\\\'') + '\'';
};

StringValue.prototype.extend = function (name, value) {
  return new (this._extend(name, value))(this.value);
};

StringValue.prototype.marshal = function () {
  return this.value;
};

StringValue.prototype.getLength = function () {
  return this.value.length;
};

StringValue.prototype.lookup = function (index) {
  if (index < 0 || index >= this.value.length) {
    throw new LambdaRuntimeError('index ' + index + ' out of bounds for string ' + this.toString());
  }
  return new StringValue(this.value[index]);
};


function AbstractListValue() {
  IndexedValue.call(this);
}

exports.AbstractListValue = AbstractListValue;
extend(IndexedValue, AbstractListValue);


function ListValue(values) {
  AbstractListValue.call(this);
  this.values = values;
}

exports.ListValue = ListValue;
extend(AbstractListValue, ListValue);

ListValue.prototype.character = Character.LIST;

ListValue.prototype.toString = function () {
  return '{ ' + this.values.map(function (value) {
    return value.toString();
  }).join(', ') + ' }';
};

ListValue.prototype.extend = function (name, value) {
  return new (this._extend(name, value))(this.values);
};

ListValue.prototype.marshal = function () {
  return this.values.map(function (value) {
    return value.marshal();
  });
};

ListValue.prototype.getLength = function () {
  return this.values.length;
};

ListValue.prototype.lookup = function (index) {
  if (index < 0 || index >= this.values.length) {
    throw new LambdaRuntimeError('index ' + index + ' out of bounds');
  }
  return this.values[index];
};

ListValue.prototype.forceList = function () {
  return this;
};


function NativeArrayValue(array) {
  AbstractListValue.call(this);
  this.array = array;
}

exports.NativeArrayValue = NativeArrayValue;
extend(AbstractListValue, NativeArrayValue);

NativeArrayValue.prototype.character = Character.LIST;

NativeArrayValue.prototype.toString = function () {
  return '{' + this.array.map(function (value) {
    return AbstractValue.unmarshal(value).toString();
  }).join(', ') + '}';
};

NativeArrayValue.prototype.extend = function () {
  return new (this._extend(name, value))(this.array);
};

NativeArrayValue.prototype.marshal = function () {
  return this.array;
};

NativeArrayValue.prototype.getLength = function () {
  return this.array.length;
};

NativeArrayValue.prototype.lookup = function (index) {
  if (index < 0 || index >= this.array.length) {
    throw new LambdaRuntimeError('index ' + index + ' out of bounds');
  }
  return AbstractValue.unmarshal(this.array[index]);
};

NativeArrayValue.prototype.forceList = function () {
  return new ListValue(this.array.map(function (value) {
    return AbstractValue.unmarshal(value);
  }));
};


function Closure(lambda, capture) {
  UndefinedValue.call(this);
  this.lambda = lambda;
  this.capture = capture;
}

exports.Closure = Closure;
extend(UndefinedValue, Closure);

Closure.prototype.character = Character.LAMBDA;

Closure.prototype.toString = function () {
  return 'closure';
};

Closure.prototype.extend = function (name, value) {
  return new (this._extend(name, value))(this.lambda, this.capture);
};

Closure.prototype.getLength = function () {
  var length = 0;
  for (var node = this.lambda; node.is(LambdaNode); node = node.body) {
    length++;
  }
  return length;
};

Closure.prototype.bind = function (value) {
  return this.lambda.body.evaluate(this.capture.add(this.lambda.name, value));
};

Closure.prototype.apply = function () {
  var value = this;
  for (var i = 0; i < arguments.length; i++) {
    if (value.is(Closure)) {
      value = value.bind(arguments[i]);
    } else {
      throw new LambdaRuntimeError('not a closure');
    }
  }
  return value;
};

Closure.prototype.marshal = function () {
  var node = this.lambda;
  var context = this.capture;
  var length = this.getLength();
  var hasThis = 'this' === this.lambda.name;
  return arity(length - !!hasThis, function () {
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
          } catch (error) {
            if (error instanceof LambdaUserError) {
              throw error.value.marshal();
            } else {
              throw error;
            }
          }
        }()).marshal();
      }
    }(node, context, 0));
  });
};

Closure.fromFunction = function (nativeFunction) {
  return new Closure((function makeLambda(index, names) {
    if (index < nativeFunction.length) {
      var name = '' + index;
      names.push(name);
      return new LambdaNode(name, UndefinedType.DEFAULT, makeLambda(index + 1, names));
    } else {
      return new SemiNativeNode(nativeFunction, names);
    }
  }(0, [])), Context.EMPTY);
};

Closure.unmarshal = function (value) {
  return new Closure(
      new LambdaNode('this', null,
        new LambdaNode('arguments', new ListType(UndefinedType.DEFAULT),
          new NativeNode(function (parameters) {
            return value.apply(this, parameters);
          }, ['this', 'arguments']))), Context.EMPTY);
};


function JSUndefinedValue() {
  AbstractValue.call(this);
}

exports.JSUndefinedValue = JSUndefinedValue;
extend(AbstractValue, JSUndefinedValue);

JSUndefinedValue.prototype.character = Character.JS.UNDEFINED;

JSUndefinedValue.prototype.toString = function () {
  return 'JavaScript.UNDEFINED';
};

JSUndefinedValue.prototype.extend = function (name, value) {
  return new (this._extend(name, value))();
};

JSUndefinedValue.prototype.marshal = function () {};

JSUndefinedValue.DEFAULT = new JSUndefinedValue();


function JSNullValue() {
  AbstractValue.call(this);
}

exports.JSNullValue = JSNullValue;
extend(AbstractValue, JSNullValue);

JSNullValue.prototype.character = Character.JS.NULL;

JSNullValue.prototype.toString = function () {
  return 'JavaScript.NULL';
};

JSNullValue.prototype.extend = function (name, value) {
  return new (this._extend(name, value))();
};

JSNullValue.prototype.marshal = function () {
  return null;
};

JSNullValue.DEFAULT = new JSNullValue();


AbstractValue.unmarshal = function (value) {
  switch (typeof value) {
  case 'undefined':
    return JSUndefinedValue.DEFAULT;
  case 'boolean':
    return new BooleanValue(value);
  case 'number':
    if (value % 1) {
      return new RealValue(value);
    } else if (value < 0) {
      return new IntegerValue(~~value);
    } else {
      return new NaturalValue(~~value);
    }
  case 'string':
    return new StringValue(value);
  case 'function':
    return Closure.unmarshal(value);
  case 'object':
    if (null === value) {
      return JSNullValue.DEFAULT;
    } else if (value instanceof Boolean || value instanceof Number || value instanceof String) {
      return AbstractValue.unmarshal(value.valueOf());
    } else if (Array.isArray(value)) {
      return new NativeArrayValue(value);
    } else if (value instanceof NativeComplexValue) {
      return new ComplexValue(value.r, value.i);
    } else {
      return UndefinedValue.fromContext(new NativeContext(value));
    }
  default:
    throw new LambdaInternalError();
  }
};

AbstractValue.getGlobal = function (name) {
  return AbstractValue.unmarshal(function () {
    if (name in this) {
      try {
        return this[name];
      } catch (error) {
        throw new LambdaRuntimeError('unknown variable \'' + name + '\'');
      }
    } else {
      throw new LambdaRuntimeError('unknown variable \'' + name + '\'');
    }
  }());
};
