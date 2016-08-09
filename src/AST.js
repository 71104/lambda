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
    return UnknownType.INSTANCE;
  }
};

VariableNode.prototype.evaluate = function (context) {
  if (context.has(this.name)) {
    return context.top(this.name);
  } else {
    return getGlobalValue(this.name);
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
    return left.context.top(this.name);
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
  return new ClosureType(this.type, this.body.getType(context.add(this.name, this.type)));
};

LambdaNode,prototype.evaluate = function (context) {
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
    return left.right;
  } else {
    throw new LambdaTypeError();
  }
};

ApplicationNode.prototype.evaluate = function (context) {
  var left = this.left.evaluate(context);
  var right = this.right.evaluate(context);
  if (left.is(Closure)) {
    return left.lambda.body.evaluate(left.capture.add(left.name, right));
  } else {
    throw new LambdaRuntimeError();
  }
};
