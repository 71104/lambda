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
    return getGlobalValue(this.name);
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
  if (left.context.has(this.name)) {
    return left.context.top(this.name);
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


function LambdaNode(name, type, body) {
  AbstractNode.call(this);
  this.name = name;
  this.type = type || new VariableType(name);
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
  return new ClosureType(this.type, this.body.getType(context.add(this.name, this.type)));
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
  if (left.is(ClosureType) && right.isSubTypeOf(left.left)) {
    if (left.left.is(VariableType)) {
      return left.right.instance(left.left.name, right);
    } else if (right.isSubTypeOf(left.left)) {
      return left.right;
    } else {
      throw new LambdaTypeError();
    }
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
  AbstractNode.call(this);
  if (names.length < 1) {
    throw new LambdaInternalError();
  }
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

LetNode.prototype.evaluate = function (context) {
  var rootContext = context;
  return this.body.evaluate(function augment(context, index) {
    var name = this.names[index];
    if (index < this.names.length - 1) {
      if (context.has(name)) {
        var value = context.top(name);
        return context.add(name, value.clone(augment.call(this, value.context, index + 1)));
      } else {
        return context.add(name, UndefinedValue.fromContext(augment.call(this, Context.EMPTY, index + 1)));
      }
    } else {
      return context.add(name, this.expression.evaluate(rootContext));
    }
  }.call(this, context, 0));
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
