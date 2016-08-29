function AbstractNode() {}

exports.AbstractNode = AbstractNode;


function LiteralNode(value, type) {
  AbstractNode.call(this);
  this.value = value;
  this.type = type;
}

exports.LiteralNode = LiteralNode;
extend(AbstractNode, LiteralNode);

LiteralNode.prototype.getFreeVariables = function () {
  return [];
};

LiteralNode.prototype.getType = function () {
  return this.type;
};

LiteralNode.prototype.evaluate = function () {
  return this.value;
};


function ListLiteralNode(expressions) {
  AbstractNode.call(this);
  this.expressions = expressions;
}

exports.ListLiteralNode = ListLiteralNode;
extend(AbstractNode, ListLiteralNode);

ListLiteralNode.prototype.getFreeVariables = function () {
  return this.expressions.reduce(function (names, expression) {
    return names.union(expression.getFreeVariables());
  }, []);
};

ListLiteralNode.prototype.getType = function (context) {
  return new ListType(this.expressions.map(function (expression) {
    return expression.getType(context);
  }).reduce(function (result, type) {
    return result.merge(type);
  }, UnknownType.DEFAULT));
};

ListLiteralNode.prototype.evaluate = function (context) {
  return new ListValue(this.expressions.map(function (expression) {
    return expression.evaluate(context);
  }));
};


function VariableNode(name) {
  AbstractNode.call(this);
  this.name = name;
}

exports.VariableNode = VariableNode;
extend(AbstractNode, VariableNode);

VariableNode.prototype.getFreeVariables = function () {
  return [this.name];
};

VariableNode.prototype.getType = function (context) {
  if (context.has(this.name)) {
    return context.top(this.name);
  } else {
    return UnknownType.DEFAULT;
  }
};

VariableNode.prototype.evaluate = function (context) {
  if (context.has(this.name)) {
    return context.top(this.name);
  } else {
    return AbstractValue.getGlobal(this.name);
  }
};


function ErrorNode() {
  AbstractNode.call(this);
}

exports.ErrorNode = ErrorNode;
extend(AbstractNode, ErrorNode);

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


function FieldAccessNode(left, name) {
  AbstractNode.call(this);
  this.left = left;
  this.name = name;
}

exports.FieldAccessNode = FieldAccessNode;
extend(AbstractNode, FieldAccessNode);

FieldAccessNode.prototype.getFreeVariables = function () {
  return this.left.getFreeVariables();
};

FieldAccessNode.prototype.getType = function (context) {
  var left = this.left.getType(context);
  if (left.is(UnknownType)) {
    if (left.context.has(this.name)) {
      return left.context.top(this.name).bindThis(left);
    } else {
      return UnknownType.DEFAULT;
    }
  } else if (left.context.has(this.name)) {
    return left.context.top(this.name).bindThis(left);
  } else {
    throw new LambdaTypeError();
  }
};

FieldAccessNode.prototype.evaluate = function (context) {
  var left = this.left.evaluate(context);
  if (left.context.has(this.name)) {
    return left.context.top(this.name).bindThis(left);
  } else {
    throw new LambdaRuntimeError();
  }
};


function SubscriptNode(expression, index) {
  AbstractNode.call(this);
  this.expression = expression;
  this.index = index;
}

exports.SubscriptNode = SubscriptNode;
extend(AbstractNode, SubscriptNode);

SubscriptNode.prototype.getFreeVariables = function () {
  return this.expression.getFreeVariables().union(this.index.getFreeVariables());
};

SubscriptNode.prototype.getType = function (context) {
  var expression = this.expression.getType(context);
  var index = this.index.getType(context);
  if (index.isSubTypeOf(IntegerType.DEFAULT)) {
    if (expression.is(IndexedType)) {
      return expression.inner;
    } else if (expression.is(UnknownType)) {
      return UnknownType.INSTANCE;
    } else {
      throw new LambdaTypeError();
    }
  } else {
    throw new LambdaTypeError();
  }
};

SubscriptNode.prototype.evaluate = function (context) {
  var value = this.expression.evaluate(context);
  var index = this.index.evaluate(context);
  if (value.is(IndexedValue) && index.is(IntegerValue)) {
    return value.lookup(index.value);
  } else {
    throw new LambdaRuntimeError();
  }
};


function LambdaNode(name, type, body) {
  AbstractNode.call(this);
  this.name = name;
  this.type = type;
  this.body = body;
}

exports.LambdaNode = LambdaNode;
extend(AbstractNode, LambdaNode);

LambdaNode.prototype.getFreeVariables = function () {
  return this.body.getFreeVariables().filter(function (name) {
    return name === this.name;
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


function ApplicationNode(left, right) {
  AbstractNode.call(this);
  this.left = left;
  this.right = right;
}

exports.ApplicationNode = ApplicationNode;
extend(AbstractNode, ApplicationNode);

ApplicationNode.prototype.getFreeVariables = function () {
  return this.left.getFreeVariables().union(this.right.getFreeVariables());
};

ApplicationNode.prototype.getType = function (context) {
  var left = this.left.getType(context);
  var right = this.right.getType(context);
  if (left.is(ForEachType)) {
    left = left.inner.instance(left.name, right);
  }
  if (left.is(LambdaType) && right.isSubTypeOf(left.left)) {
    return left.right;
  } else if (left.is(UnknownType)) {
    return UnknownType.DEFAULT;
  } else {
    throw new LambdaTypeError();
  }
};

ApplicationNode.prototype.evaluate = function (context) {
  var left = this.left.evaluate(context);
  var right = this.right.evaluate(context);
  if (left.is(Closure)) {
    return left.lambda.body.evaluate(left.capture.add(left.lambda.name, right));
  } else {
    throw new LambdaRuntimeError();
  }
};


function LetNode(names, expression, body) {
  if (names.length < 1) {
    throw new LambdaInternalError();
  }
  AbstractNode.call(this);
  this.names = names;
  this.expression = expression;
  this.body = body;
}

exports.LetNode = LetNode;
extend(AbstractNode, LetNode);

LetNode.prototype.getFreeVariables = function () {
  return this.body.getFreeVariables().filter(function (name) {
    return name !== this.names[0];
  }, this);
};

LetNode.prototype.getType = function (context) {
  var rootContext = context;
  var global = function extend(type, index) {
    var name = this.names[index];
    if (index < this.names.length - 1) {
      if (type.context.has(name)) {
        return type.extend(name, extend.call(this, type.context.top(name), index + 1));
      } else {
        return type.extend(name, extend.call(this, UndefinedType.DEFAULT, index + 1));
      }
    } else {
      return type.extend(name, this.expression.getType(rootContext));
    }
  }.call(this, UndefinedType.fromContext(context), 0);
  return this.body.getType(global.context);
};

LetNode.prototype.evaluate = function (context) {
  var rootContext = context;
  var global = function extend(value, index) {
    var name = this.names[index];
    if (index < this.names.length - 1) {
      if (value.context.has(name)) {
        return value.extend(name, extend.call(this, value.context.top(name), index + 1));
      } else {
        return value.extend(name, extend.call(this, UndefinedValue.DEFAULT, index + 1));
      }
    } else {
      return value.extend(name, this.expression.evaluate(rootContext));
    }
  }.call(this, UndefinedValue.fromContext(context), 0);
  return this.body.evaluate(global.context);
};


function FixNode() {
  AbstractNode.call(this);
}

exports.FixNode = FixNode;
extend(AbstractNode, FixNode);

FixNode.prototype.getFreeVariables = function () {
  return [];
};

FixNode.TYPE = new ForEachType('T', new LambdaType(
  new LambdaType(
    new VariableType('T'),
    new VariableType('T')
  ),
  new VariableType('T')
));

FixNode.prototype.getType = function () {
  return FixNode.TYPE;
};

FixNode.Z_COMBINATOR = (new LambdaNode('f', null, new ApplicationNode(
  new LambdaNode('x', null, new ApplicationNode(
    new VariableNode('f'),
    new LambdaNode('v', null, new ApplicationNode(
      new ApplicationNode(
        new VariableNode('x'),
        new VariableNode('x')
      ),
      new VariableNode('v')
    ))
  )),
  new LambdaNode('x', null, new ApplicationNode(
    new VariableNode('f'),
    new LambdaNode('v', null, new ApplicationNode(
      new ApplicationNode(
        new VariableNode('x'),
        new VariableNode('x')
      ),
      new VariableNode('v')
    ))
  ))
))).evaluate(Context.EMPTY);

FixNode.prototype.evaluate = function () {
  return FixNode.Z_COMBINATOR;
};

FixNode.INSTANCE = new FixNode();


function IfNode(condition, thenExpression, elseExpression) {
  AbstractNode.call(this);
  this.condition = condition;
  this.thenExpression = thenExpression;
  this.elseExpression = elseExpression;
}

exports.IfNode = IfNode;
extend(AbstractNode, IfNode);

IfNode.prototype.getFreeVariables = function () {
  return this.condition.getFreeVariables()
    .union(this.thenExpression.getFreeVariables())
    .union(this.elseExpression.getFreeVariables());
};

IfNode.prototype.getType = function (context) {
  var condition = this.condition.getType(context);
  if (condition.isSubTypeOf(BooleanType.DEFAULT)) {
    return this.thenExpression.getType(context).merge(this.elseExpression.getType(context));
  } else {
    throw new LambdaTypeError();
  }
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


function ThrowNode(expression) {
  AbstractNode.call(this);
  this.expression = expression;
}

exports.ThrowNode = ThrowNode;
extend(AbstractNode, ThrowNode);

ThrowNode.prototype.getFreeVariables = function () {
  return this.expression.getFreeVariables();
};

ThrowNode.prototype.getType = function () {
  // TODO
};

ThrowNode.prototype.evaluate = function (context) {
  throw new LambdaUserError(this.expression.evaluate(context));
};


function TryCatchNode(tryExpression, catchExpression) {
  AbstractNode.call(this);
  this.tryExpression = tryExpression;
  this.catchExpression = catchExpression;
}

exports.TryCatchNode = TryCatchNode;
extend(AbstractNode, TryCatchNode);

TryCatchNode.prototype.getFreeVariables = function () {
  return this.tryExpression.getFreeVariables().union(
      this.catchExpression().getFreeVariables().filter(function (name) {
        return 'error' !== name;
      }));
};

TryCatchNode.prototype.getType = function () {
  // TODO
};

TryCatchNode.prototype.evaluate = function (context) {
  try {
    return this.tryExpression.evaluate(context);
  } catch (error) {
    if (error instanceof LambdaUserError) {
      return this.catchExpression.evaluate(context.add('error', error.value));
    } else {
      throw error;
    }
  }
};


function TryFinallyNode(tryExpression, finallyExpression) {
  AbstractNode.call(this);
  this.tryExpression = tryExpression;
  this.finallyExpression = finallyExpression;
}

exports.TryFinallyNode = TryFinallyNode;
extend(AbstractNode, TryFinallyNode);

TryFinallyNode.prototype.getFreeVariables = function () {
  return this.tryExpression.getFreeVariables().union(
      this.finallyExpression.getFreeVariables());
};

TryFinallyNode.prototype.getType = function () {
  // TODO
};

TryFinallyNode.prototype.evaluate = function (context) {
  try {
    return this.tryExpression.evaluate(context);
  } catch (error) {
    return UndefinedValue.DEFAULT;
  } finally {
    this.finallyExpression.evaluate(context);
  }
};


function TryCatchFinallyNode(tryExpression, catchExpression, finallyExpression) {
  AbstractValue.call(this);
  this.tryExpression = tryExpression;
  this.catchExpression = catchExpression;
  this.finallyExpression = finallyExpression;
}

exports.TryCatchFinallyNode = TryCatchFinallyNode;
extend(AbstractNode, TryCatchFinallyNode);

TryCatchFinallyNode.prototype.getFreeVariables = function () {
  return this.tryExpression.getFreeVariables()
    .union(this.catchExpression.getFreeVariables().filter(function (name) {
      return 'error' !== name;
    }))
    .union(this.finallyExpression.getFreeVariables());
};

TryCatchFinallyNode.prototype.getType = function () {
  // TODO
};

TryCatchFinallyNode.prototype.evaluate = function (context) {
  try {
    return this.tryExpression.evaluate(context);
  } catch (error) {
    if (error instanceof LambdaUserError) {
      return this.catchExpression.evaluate(context.add('error', error.value));
    } else {
      throw error;
    }
  } finally {
    this.finallyExpression.evaluate(context);
  }
};


function NativeNode(nativeFunction, argumentNames) {
  AbstractNode.call(this);
  this.nativeFunction = nativeFunction;
  this.argumentNames = argumentNames;
}

exports.NativeNode = NativeNode;
extend(AbstractNode, NativeNode);

NativeNode.prototype.getFreeVariables = function () {
  return this.argumentNames;
};

NativeNode.prototype.getType = function () {
  return UnknownType.DEFAULT;
};

NativeNode.prototype.evaluate = function (context) {
  var argumentValues = this.argumentNames.map(function (name) {
    if (context.has(name)) {
      return context.top(name).marshal();
    } else {
      throw new LambdaInternalError();
    }
  });
  var thisValue = argumentValues.shift();
  return AbstractValue.unmarshal(function () {
    try {
      return this.nativeFunction.apply(thisValue, argumentValues);
    } catch (error) {
      if (error instanceof LambdaError) {
        throw error;
      } else {
        throw new LambdaUserError(AbstractValue.unmarshal(error));
      }
    }
  }.call(this));
};
