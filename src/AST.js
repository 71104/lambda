function AbstractNode() {}

exports.AbstractNode = AbstractNode;

AbstractNode.prototype.is = function (Class) {
  return this instanceof Class;
};

AbstractNode.prototype.isAny = function () {
  for (var i = 0; i < arguments.length; i++) {
    if (this instanceof arguments[i]) {
      return true;
    }
  }
  return false;
};

AbstractNode.prototype.compile = function () {
  return '(function(){"use strict";' + this.compileStatement() + '}());';
};


function LiteralNode(value, type) {
  AbstractNode.call(this);
  this.value = value;
  this.type = type;
}

exports.LiteralNode = LiteralNode;

LiteralNode.prototype = Object.create(AbstractNode.prototype);

LiteralNode.prototype.getFreeVariables = function () {
  return [];
};

LiteralNode.prototype.getType = function () {
  return this.type;
};

LiteralNode.prototype.evaluate = function () {
  return this.value;
};

LiteralNode.prototype.compileExpression = function () {
  return JSON.stringify(this.value.marshal());
};

LiteralNode.prototype.compileStatement = function () {
  return 'return ' + JSON.stringify(this.value.marshal()) + ';';
};


function ListLiteralNode(expressions) {
  AbstractNode.call(this);
  this.expressions = expressions;
}

exports.ListLiteralNode = ListLiteralNode;

ListLiteralNode.prototype = Object.create(AbstractNode.prototype);

ListLiteralNode.prototype.getFreeVariables = function () {
  var names = [];
  this.expressions.forEach(function (expression) {
    names = names.union(expression.getFreeVariables());
  });
  return names;
};

ListLiteralNode.prototype.evaluate = function (context) {
  return new ListValue(this.expressions.map(function (expression) {
    return expression.evaluate(context);
  }));
};

ListLiteralNode.prototype.compileExpression = function () {
  return '[' + this.expressions.map(function (expression) {
    return expression.compileExpression();
  }).join(',') + ']';
};

ListLiteralNode.prototype.compileStatement = function () {
  return 'return[' + this.expressions.map(function (expression) {
    return expression.compileExpression();
  }).join(',') + '];';
};


function VariableNode(name) {
  AbstractNode.call(this);
  this.name = name;
}

exports.VariableNode = VariableNode;

VariableNode.prototype = Object.create(AbstractNode.prototype);

VariableNode.prototype.getFreeVariables = function () {
  return [this.name];
};

VariableNode.prototype.getType = function (context) {
  if (context.hash(this.name)) {
    return context.top(this.name);
  } else {
    return UnknownType.INSTANCE;
  }
};

VariableNode.prototype.evaluate = function (context) {
  if (context.has(this.name)) {
    return LazyValue.evaluate(context.top(this.name));
  } else {
    return LazyValue.evaluate(AbstractValue.unmarshal(getGlobalValue(this.name, LambdaRuntimeError)));
  }
};

VariableNode.prototype.compileExpression = function () {
  return this.name;
};

VariableNode.prototype.compileStatement = function () {
  return 'return ' + this.name + ';';
};


function FixNode() {
  AbstractNode.call(this);
}

exports.FixNode = FixNode;

FixNode.prototype = Object.create(AbstractNode.prototype);

FixNode.prototype.getFreeVariables = function () {
  return [];
};

FixNode.prototype.getType = function () {
  return FixNode.TYPE;
};

FixNode.prototype.evaluate = function () {
  return FixNode.Z_COMBINATOR;
};

FixNode.prototype.compileExpression = function () {
  return 'function fix(f){return function(v){return f(fix(f))(v);};}';
};

FixNode.prototype.compileStatement = function () {
  return 'return function fix(f){return function(v){return f(fix(f))(v);};};';
};


function ThisNode() {
  AbstractNode.call(this);
}

exports.ThisNode = ThisNode;

ThisNode.prototype = Object.create(AbstractNode.prototype);

ThisNode.prototype.getFreeVariables = function () {
  return ['this'];
};

ThisNode.prototype.getType = function (context) {
  if (context.has('this')) {
    return context.top('this');
  } else {
    throw new LambdaTypeError();
  }
};

ThisNode.prototype.evaluate = function (context) {
  if (context.has('this')) {
    return context.top('this');
  } else {
    throw new LambdaRuntimeError();
  }
};

ThisNode.prototype.compileExpression = function () {
  return 'this';
};

ThisNode.prototype.compileStatement = function () {
  return 'return this;';
};


function ErrorNode() {
  AbstractNode.call(this);
}

exports.ErrorNode = ErrorNode;

ErrorNode.prototype = Object.create(AbstractNode.prototype);

ErrorNode.prototype.getFreeVariables = function () {
  return ['error'];
};

ErrorNode.prototype.getType = function (context) {
  if (context.has('error')) {
    return context.top('error');
  } else {
    throw new LambdaTypeError();
  }
};

ErrorNode.prototype.evaluate = function (context) {
  if (context.has('error')) {
    return context.top('error');
  } else {
    throw new LambdaRuntimeError();
  }
};

ErrorNode.prototype.compileExpression = function () {
  return 'error';
};

ErrorNode.prototype.compileStatement = function () {
  return 'return error;';
};


function FieldAccessNode(left, name) {
  AbstractNode.call(this);
  this.left = left;
  this.name = name;
}

exports.FieldAccessNode = FieldAccessNode;

FieldAccessNode.prototype = Object.create(AbstractNode.prototype);

FieldAccessNode.prototype.getFreeVariables = function () {
  return this.left.getFreeVariables();
};

FieldAccessNode.prototype.getType = function (context) {
  var left = this.left.getType(context);
  if (left.is(PrototypedType) && left.context.has(this.name)) {
    return left.context.top(this.name);
  } else {
    throw new LambdaTypeError();
  }
};

FieldAccessNode.prototype.evaluate = function (context) {
  var left = LazyValue.evaluate(this.left.evaluate(context));
  if (left.isAny(ObjectValue, NativeObjectValue) && left.context.has(this.name)) {
    return LazyValue.evaluate(left.context.top(this.name).bindThis(left));
  } else {
    throw new LambdaRuntimeError();
  }
};

FieldAccessNode.prototype.compileExpression = function () {
  return '(' + this.left.compileExpression() + ').' + this.name;
};

FieldAccessNode.prototype.compileStatement = function () {
  return 'return(' + this.left.compileExpression() + ').' + this.name + ';';
};


function SubscriptNode(expression, index) {
  AbstractNode.call(this);
  this.expression = expression;
  this.index = index;
}

exports.SubscriptNode = SubscriptNode;

SubscriptNode.prototype = Object.create(AbstractNode.prototype);

SubscriptNode.prototype.getFreeVariables = function () {
  return this.expression.getFreeVariables().union(this.index.getFreeVariables());
};

SubscriptNode.prototype.getType = function (context) {
  if (this.index.getType(context).isSubTypeOf(IntegerType.INSTANCE)) {
    var expression = this.expression.getType(context);
    if (expression.is(IndexedType)) {
      return expression.inner;
    } else {
      throw new LambdaTypeError();
    }
  } else {
    throw new LambdaTypeError();
  }
};

SubscriptNode.prototype.evaluate = function (context) {
  var value = LazyValue.evaluate(this.expression.evaluate(context));
  if (value.isAny(ListValue, NativeArrayValue, StringValue)) {
    var index = this.index.evaluate(context);
    if (index.is(IntegerValue)) {
      if (value.is(ListValue)) {
        if (index.value >= 0 && index.value < value.values.length) {
          return LazyValue.evaluate(value.values[index.value]);
        }
      } else if (value.is(NativeArrayValue)) {
        if (index.value >= 0 && index.value < value.values.length) {
          return LazyValue.evaluate(AbstractValue.unmarshal(value.values[index.value]));
        }
      } else if (value.is(StringValue)) {
        if (index.value >= 0 && index.value < value.value.length) {
          return LazyValue.evaluate(value.value[index.value]);
        }
      }
    }
  }
  throw new LambdaRuntimeError();
};

SubscriptNode.prototype.compileExpression = function () {
  return '(' + this.expression.compileExpression() + ')[' + this.index.compileExpression() + ']';
};

SubscriptNode.prototype.compileStatement = function () {
  return 'return(' + this.expression.compileExpression() + ')[' + this.index.compileExpression() + '];';
};


function LambdaNode(name, type, body) {
  AbstractNode.call(this);
  this.name = name;
  this.type = type;
  this.body = body;
}

exports.LambdaNode = LambdaNode;

LambdaNode.prototype = Object.create(AbstractNode.prototype);

LambdaNode.prototype.getFreeVariables = function () {
  return this.body.getFreeVariables().filter(function (name) {
    return name !== this.name;
  }, this);
};

LambdaNode.prototype.getType = function (context) {
  if (this.type) {
    return new LambdaType(this.type, this.body.getType(context.add(this.name, this.type)));
  } else {
    var left = new VariableType(this.name);
    return new ForEachType(this.name, new LambdaType(left, this.body.getType(context.add(this.name, left))));
  }
};

LambdaNode.prototype.evaluate = function (context) {
  return new Closure(this, context);
};

LambdaNode.prototype.compileExpression = function () {
  return 'function(' + this.name + '){' + this.body.compileStatement() + '}';
};

LambdaNode.prototype.compileStatement = function () {
  return 'return function(' + this.name + '){' + this.body.compileStatement() + '};';
};


function LazyNode(expression) {
  AbstractNode.call(this);
  this.expression = expression;
}

exports.LazyNode = LazyNode;

LazyNode.prototype = Object.create(AbstractNode.prototype);

LazyNode.prototype.getFreeVariables = function () {
  return this.expression.getFreeVariables();
};

LazyNode.prototype.getType = function (context) {
  return this.expression.getType(context);
};

LazyNode.prototype.evaluate = function (context) {
  return new LazyValue(this.expression, context);
};

LazyNode.prototype.compileExpression = function () {
  return 'function(){' + this.expression.compileStatement() + '}';
};

LazyNode.prototype.compileStatement = function () {
  return 'return function(){' + this.expression.compileStatement() + '}';
};


function ApplicationNode(left, right) {
  AbstractNode.call(this);
  this.left = left;
  this.right = right;
}

exports.ApplicationNode = ApplicationNode;

ApplicationNode.prototype = Object.create(AbstractNode.prototype);

ApplicationNode.prototype.getFreeVariables = function () {
  return this.left.getFreeVariables().union(this.right.getFreeVariables());
};

ApplicationNode.prototype.evaluate = function (context) {
  var left = this.left.evaluate(context);
  if (left.is(Closure)) {
    return left.lambda.body.evaluate(left.capture.add(left.lambda.name, this.right.evaluate(context)));
  } else {
    throw new LambdaRuntimeError();
  }
};

ApplicationNode.prototype.compileExpression = function () {
  return '(' + this.left.compileExpression() + ')(' + this.right.compileExpression() + ')';
};

ApplicationNode.prototype.compileStatement = function () {
  return 'return(' + this.left.compileExpression() + ')(' + this.right.compileExpression() + ');';
};


function LetNode(names, expression, body) {
  AbstractNode.call(this);
  this.names = names;
  this.expression = expression;
  this.body = body;
}

exports.LetNode = LetNode;

LetNode.prototype = Object.create(AbstractNode.prototype);

LetNode.prototype.getFreeVariables = function () {
  return this.expression.getFreeVariables().union(this.body.getFreeVariables().filter(function (name) {
    return name !== this.names[0];
  }, this));
};

LetNode.prototype.getType = function (context) {
  var names = this.names;
  var expression = this.expression.getType(context);
  return this.body.getType(function augment(context, index) {
    if (index < names.length - 1) {
      var name = names[index];
      if (context.has(name)) {
        var object = context.top(name);
        if (object.is(PrototypedType)) {
          return context.add(name, new ObjectType(augment(object.context, index + 1)));
        } else {
          return context.add(name, new ObjectType(augment(Context.EMPTY, index + 1)));
        }
      } else {
        return augment(context.add(name, UnknownType.INSTANCE), index);
      }
    } else if (index < names.length) {
      return context.add(names[index], expression);
    } else {
      throw new LambdaInternalError();
    }
  }(context, 0));
};

LetNode.prototype.evaluate = function (context) {
  var names = this.names;
  var value = this.expression.evaluate(context);
  return this.body.evaluate(function augment(context, index) {
    if (index < names.length - 1) {
      var name = names[index];
      if (context.has(name)) {
        var object = context.top(name);
        if (object.is(ObjectValue)) {
          return context.add(name, new ObjectValue(augment(object.context, index + 1)));
        } else if (object.is(NativeObjectValue)) {
          return context.add(name, new NativeObjectValue(augment(object.context, index + 1)));
        } else {
          return context.add(name, new ObjectValue(augment(Context.EMPTY, index + 1)));
        }
      } else {
        return augment(context.add(name, (function () {
          try {
            return AbstractValue.unmarshal(getGlobalValue(name, Error));
          } catch (e) {
            return new ObjectValue(Context.EMPTY);
          }
        }())), index);
      }
    } else if (index < names.length) {
      return context.add(names[index], value);
    } else {
      throw new LambdaInternalError();
    }
  }(context, 0));
};

LetNode.prototype.compileExpression = function () {
  if (this.names.length > 1) {
    // XXX not implemented yet
    throw new LambdaInternalError();
  } else {
    return '(function(' + this.names[0] + '){' + this.body.compileStatement() + '}(' + this.expression.compileExpression() + '))';
  }
};

LetNode.prototype.compileStatement = function () {
  if (this.names.length > 1) {
    // XXX not implemented yet
    throw new LambdaInternalError();
  } else {
    return 'var ' + this.names[0] + '=' + this.expression.compileExpression() + ';' + this.body.compileStatement();
  }
};


function IfNode(condition, thenExpression, elseExpression) {
  AbstractNode.call(this);
  this.condition = condition;
  this.thenExpression = thenExpression;
  this.elseExpression = elseExpression;
}

exports.IfNode = IfNode;

IfNode.prototype = Object.create(AbstractNode.prototype);

IfNode.prototype.getFreeVariables = function () {
  return this.condition.getFreeVariables()
    .union(this.thenExpression.getFreeVariables())
    .union(this.elseExpression.getFreeVariables());
};

IfNode.prototype.evaluate = function (context) {
  var condition = this.condition.evaluate(context);
  if (condition.is(BooleanValue)) {
    if (condition.value) {
      return this.thenExpression.evaluate(context);
    } else {
      return this.elseExpression.evaluate(context);
    }
  } else {
    throw new LambdaRuntimeError();
  }
};

IfNode.prototype.compileExpression = function () {
  return '(' + this.condition.compileExpression() + ')?(' + this.thenExpression.compileExpression() + '):(' + this.elseExpression.compileExpression() + ')';
};

IfNode.prototype.compileStatement = function () {
  return 'if(' + this.condition.compileExpression() + '){' + this.thenExpression.compileStatement() + '}else{' + this.elseExpression.compileStatement() + '}';
};


function ThrowNode(expression) {
  AbstractNode.call(this);
  this.expression = expression;
}

exports.ThrowNode = ThrowNode;

ThrowNode.prototype = Object.create(AbstractNode.prototype);

ThrowNode.prototype.getFreeVariables = function () {
  return this.expression.getFreeVariables();
};

ThrowNode.prototype.evaluate = function (context) {
  throw new LambdaUserError(this.expression.evaluate(context));
};

ThrowNode.prototype.compileExpression = function () {
  return '(function(){throw ' + this.expression.compileExpression() + ';}())';
};

ThrowNode.prototype.compileStatement = function () {
  return 'throw ' + this.expression.compileExpression() + ';';
};


function TryCatchNode(tryExpression, catchExpression) {
  AbstractNode.call(this);
  this.tryExpression = tryExpression;
  this.catchExpression = catchExpression;
}

exports.TryCatchNode = TryCatchNode;

TryCatchNode.prototype = Object.create(AbstractNode.prototype);

TryCatchNode.prototype.getFreeVariables = function () {
  return this.tryExpression.getFreeVariables()
    .union(this.catchExpression.getFreeVariables().filter(function (name) {
      return name !== 'error';
    }));
};

TryCatchNode.prototype.evaluate = function (context) {
  try {
    return this.tryExpression.evaluate(context);
  } catch (e) {
    if (e instanceof LambdaUserError) {
      return this.catchExpression.evaluate(context.add('error', e.value));
    } else {
      throw e;
    }
  }
};

TryCatchNode.prototype.compileExpression = function () {
  return '(function(){try{' + this.tryExpression.compileStatement() + '}catch(error){' + this.catchExpression.compileStatement() + '}}())';
};

TryCatchNode.prototype.compileStatement = function () {
  return 'try{' + this.tryExpression.compileStatement() + '}catch(error){' + this.catchExpression.compileStatement() + '}';
};


function TryFinallyNode(tryExpression, finallyExpression) {
  AbstractNode.call(this);
  this.tryExpression = tryExpression;
  this.finallyExpression = finallyExpression;
}

exports.TryFinallyNode = TryFinallyNode;

TryFinallyNode.prototype = Object.create(AbstractNode.prototype);

TryFinallyNode.prototype.getFreeVariables = function () {
  return this.tryExpression.getFreeVariables()
    .union(this.finallyExpression.getFreeVariables());
};

TryFinallyNode.prototype.evaluate = function (context) {
  try {
    return this.tryExpression.evaluate(context);
  } finally {
    this.finallyExpression.evaluate(context);
  }
};

TryFinallyNode.prototype.compileExpression = function () {
  return '(function(){try{' + this.tryExpression.compileStatement() + '}finally{' + this.finallyExpression.compileStatement() + '}}())';
};

TryFinallyNode.prototype.compileStatement = function () {
  return 'try{' + this.tryExpression.compileStatement() + '}finally{' + this.finallyExpression.compileStatement() + '}';
};


function TryCatchFinallyNode(tryExpression, catchExpression, finallyExpression) {
  AbstractNode.call(this);
  this.tryExpression = tryExpression;
  this.catchExpression = catchExpression;
  this.finallyExpression = finallyExpression;
}

exports.TryCatchFinallyNode = TryCatchFinallyNode;

TryCatchFinallyNode.prototype = Object.create(AbstractNode.prototype);

TryCatchFinallyNode.prototype.getFreeVariables = function () {
  return this.tryExpression.getFreeVariables()
    .union(this.catchExpression.getFreeVariables().filter(function (name) {
      return name !== 'error';
    }))
    .union(this.finallyExpression.getFreeVariables());
};

TryCatchFinallyNode.prototype.evaluate = function (context) {
  try {
    return this.tryExpression.evaluate(context);
  } catch (e) {
    if (e instanceof LambdaUserError) {
      return this.catchExpression.evaluate(context.add('error', e.value));
    } else {
      throw e;
    }
  } finally {
    this.finallyExpression.evaluate(context);
  }
};

TryCatchFinallyNode.prototype.compileExpression = function () {
  return '(function(){try{' + this.tryExpression.compileStatement() +
    '}catch(error){' + this.catchExpression.compileStatement() +
    '}finally{' + this.finallyExpression.compileStatement() + '}}())';
};

TryCatchFinallyNode.prototype.compileStatement = function () {
  return 'try{' + this.tryExpression.compileStatement() +
    '}catch(error){' + this.catchExpression.compileStatement() +
    '}finally{' + this.finallyExpression.compileStatement() + '}';
};


function NativeNode(nativeFunction, argumentNames) {
  AbstractNode.call(this);
  this.nativeFunction = nativeFunction;
  this.argumentNames = argumentNames;
}

exports.NativeNode = NativeNode;

NativeNode.prototype = Object.create(AbstractNode.prototype);

NativeNode.prototype.getFreeVariables = function () {
  return this.argumentNames;
};

NativeNode.prototype.evaluate = function (context) {
  var thisValue = (function () {
    if (context.has('this')) {
      return context.top('this').marshal();
    } else {
      return null;
    }
  }());
  var argumentValues = this.argumentNames.map(function (name) {
    if (context.has(name)) {
      return context.top(name).marshal();
    } else {
      throw new LambdaInternalError();
    }
  });
  return AbstractValue.unmarshal(function () {
    try {
      return this.nativeFunction.apply(thisValue, argumentValues);
    } catch (e) {
      if (e instanceof LambdaError) {
        throw e;
      } else {
        throw new LambdaUserError(AbstractValue.unmarshal(e));
      }
    }
  }.call(this));
};


function SemiNativeNode(evaluator, ariety) {
  AbstractNode.call(this);
  this.evaluator = evaluator;
  this.argumentNames = [];
  for (var i = 0; i < ariety; i++) {
    this.argumentNames.push('' + i);
  }
}

exports.SemiNativeNode = SemiNativeNode;

SemiNativeNode.prototype = Object.create(AbstractNode.prototype);

SemiNativeNode.prototype.getFreeVariables = function () {
  return this.argumentNames;
};

SemiNativeNode.prototype.evaluate = function (context) {
  var thisValue = (function () {
    if (context.has('this')) {
      return context.top('this');
    } else {
      return null;
    }
  }());
  var argumentValues = this.argumentNames.map(function (name) {
    if (context.has(name)) {
      return context.top(name);
    } else {
      throw new LambdaInternalError();
    }
  });
  return this.evaluator.apply(thisValue, argumentValues);
};


function OperatorNode(overloads, ariety) {
  SemiNativeNode.call(this, function () {
    var overload = overloads;
    [].forEach.call(arguments, function (argument) {
      for (var key in overload) {
        if (overload.hasOwnProperty(key)) {
          if ((new RegExp('^(' + key + ')$')).test(argument.type)) {
            overload = overload[key];
            return;
          }
        }
      }
      throw new LambdaRuntimeError();
    });
    return overload.apply(null, arguments);
  }, ariety);
}

exports.OperatorNode = OperatorNode;

OperatorNode.prototype = Object.create(SemiNativeNode.prototype);


// TODO: operators are not completely polymorphic, they must be typed correctly.

function UnaryOperatorNode(overloads) {
  LambdaNode.call(this, '0', null, new OperatorNode(overloads, 1));
}

exports.UnaryOperatorNode = UnaryOperatorNode;

UnaryOperatorNode.prototype = Object.create(LambdaNode.prototype);


function BinaryOperatorNode(overloads) {
  LambdaNode.call(this, '0', null, new LambdaNode('1', null, new OperatorNode(overloads, 2)));
}

exports.BinaryOperatorNode = BinaryOperatorNode;

BinaryOperatorNode.prototype = Object.create(LambdaNode.prototype);
