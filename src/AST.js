function AbstractNode() {}

AbstractNode.prototype.is = function (Class) {
	return this instanceof Class;
};


function LiteralNode(type, value) {
	AbstractNode.call(this);
	this.type = type;
	this.value = value;
}

LiteralNode.prototype = Object.create(AbstractNode.prototype);

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

VariableNode.prototype = Object.create(AbstractNode.prototype);

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
		var name = this.name;
		return AbstractValue.wrap((function () {
			return this[name];
		}()));
	}
};


function ThisNode() {
	AbstractNode.call(this);
}

ThisNode.prototype = Object.create(AbstractNode.prototype);

ThisNode.prototype.getType = function () {
	// TODO
};

ThisNode.prototype.evaluate = function () {
	// TODO
};

ThisNode.INSTANCE = new ThisNode();


function ErrorNode() {
	VariableNode.call(this, 'error');
}

ErrorNode.prototype = Object.create(VariableNode.prototype);

ErrorNode.INSTANCE = new ErrorNode();


function FieldAccessNode(left, name) {
	AbstractNode.call(this);
	this.left = left;
	this.name = name;
}

FieldAccessNode.prototype = Object.create(AbstractNode.prototype);

FieldAccessNode.prototype.getType = function (context) {
	var left = this.left.getType(context);
	if (left.is(ObjectType) && left.context.has(this.name)) {
		return left.context.top(this.name);
	} else {
		throw new TypeError();
	}
};

FieldAccessNode.prototype.evaluate = function (context) {
	return this.left.evaluate(context).context.top(this.name);
};


function SubscriptNode(expression, index) {
	AbstractNode.call(this);
	this.expression = expression;
	this.index = index;
}

SubscriptNode.prototype = Object.create(AbstractNode.prototype);

SubscriptNode.prototype.getType = function (context) {
	var expression = this.expression.getType(context);
	var index = this.index.getType(context);
	if (expression.is(ArrayType) && index.is(IntegerType)) {
		return expression.subType;
	} else {
		throw new TypeError();
	}
};

SubscriptNode.prototype.evaluate = function (context) {
	return this.expression.evaluate(context).array[this.index.evaluate(context).value];
};


function LambdaNode(name, type, body) {
	AbstractNode.call(this);
	this.name = name;
	this.type = type;
	this.body = body;
}

LambdaNode.prototype = Object.create(AbstractNode.prototype);

LambdaNode.prototype.getType = function (context) {
	if (this.type) {
		return context.augment(this.name, this.type, function (context) {
			return new LambdaType(this.type, this.body.getType(context));
		}, this);
	} else {
		var left = new VariableType(this.name);
		return context.augment(this.name, left, function (context) {
			return new PolymorphicType(this.name, new LambdaType(left, this.body.getType(context)));
		}, this);
	}
};

LambdaNode.prototype.evaluate = function (context) {
	return new Closure(this.name, this.body, context);
};


function ApplicationNode(left, right) {
	AbstractNode.call(this);
	this.left = left;
	this.right = right;
}

ApplicationNode.prototype = Object.create(AbstractNode.prototype);

ApplicationNode.prototype.getType = function (context) {
	var left = this.left.getType(context);
	var right = this.right.getType(context);
	if (left.is(LambdaType) && right.isSubTypeOf(left.left)) {
		return left.right;
	} else {
		throw new TypeError();
	}
};

ApplicationNode.prototype.evaluate = function (context) {
	var left = this.left.evaluate(context);
	var right = this.right.evaluate(context);
	return left.context.augment(left.name, right, function (context) {
		return left.body.evaluate(context);
	});
};


function FixNode() {
	AbstractNode.call(this);
}

FixNode.prototype = Object.create(AbstractNode.prototype);

FixNode.prototype.getType = function () {
	// TODO
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
	))).evaluate(new Context());

FixNode.prototype.evaluate = function () {
	return FixNode.Z_COMBINATOR;
};

FixNode.INSTANCE = new FixNode();


function LetNode(names, expression, body) {
	AbstractNode.call(this);
	this.names = names;
	this.expression = expression;
	this.body = body;
}

LetNode.prototype = Object.create(AbstractNode.prototype);

LetNode.prototype.getType = function (rootContext) {
	var names = this.names;
	var expression = this.expression;
	var body = this.body;
	return (function getType(context, index) {
		if (index < names.length - 1) {
			var type;
			if (context.has(names[index])) {
				type = context.top(names[index]);
				if (type.is(ObjectType)) {
					return getType(type.context, index + 1);
				}
			}
			type = new ObjectType(new Context());
			return context.augment(names[index], type, function () {
				return getType(type.context, index + 1);
			});
		} else if (index < names.length) {
			return context.augment(names[index], expression.getType(rootContext), function () {
				return body.getType(rootContext);
			});
		} else {
			throw new InternalError();
		}
	}(rootContext, 0));
};

LetNode.prototype.evaluate = function (rootContext) {
	var names = this.names;
	var expression = this.expression;
	var body = this.body;
	return (function evaluate(context, index) {
		if (index < names.length - 1) {
			if (context.has(names[index])) {
				return evaluate(context.top(names[index]).context, index + 1);
			} else {
				var value = new ObjectValue(new Context());
				return context.augment(names[index], value, function () {
					return evaluate(value.context, index + 1);
				});
			}
		} else if (index < names.length) {
			return context.augment(names[index], expression.evaluate(rootContext), function () {
				return body.evaluate(rootContext);
			});
		} else {
			throw new InternalError();
		}
	}(rootContext, 0));
};


function IfNode(condition, thenExpression, elseExpression) {
	AbstractNode.call(this);
	this.condition = condition;
	this.thenExpression = thenExpression;
	this.elseExpression = elseExpression;
}

IfNode.prototype = Object.create(AbstractNode.prototype);

IfNode.prototype.getType = function (context) {
	if (this.condition.getType(context).is(BooleanType)) {
		var type1 = this.thenExpression.getType(context);
		var type2 = this.elseExpression.getType(context);
		if (type1.isSubTypeOf(type2)) {
			return type2;
		} else if (type2.isSubTypeOf(type1)) {
			return type1;
		} else {
			throw new TypeError();
		}
	} else {
		throw new TypeError();
	}
};

IfNode.prototype.evaluate = function (context) {
	if (this.condition.evaluate(context).value) {
		return this.thenExpression.evaluate(context);
	} else {
		return this.elseExpression.evaluate(context);
	}
};


function ThrowNode(expression) {
	AbstractNode.call(this);
	this.expression = expression;
}

ThrowNode.prototype = Object.create(AbstractNode.prototype);

ThrowNode.prototype.getType = function () {
	// TODO
};

ThrowNode.prototype.evaluate = function (context) {
	throw this.expression.evaluate(context);
};


function TryCatchNode(tryExpression, catchExpression) {
	AbstractNode.call(this);
	this.tryExpression = tryExpression;
	this.catchExpression = catchExpression;
}

TryCatchNode.prototype = Object.create(AbstractNode.prototype);

TryCatchNode.prototype.getType = function (context) {
	var tryExpression = tryExpression.getType(context);
	var catchExpression = catchExpression.getType(context);
	if (catchExpression.isSubTypeOf(tryExpression)) {
		return tryExpression;
	} else if (tryExpression.isSubTypeOf(catchExpression)) {
		return catchExpression;
	} else {
		throw new TypeError();
	}
};

TryCatchNode.prototype.evaluate = function (context) {
	try {
		return this.tryExpression.evaluate(context);
	} catch (e) {
		return this.catchExpression.evaluate(context);
	}
};


function TryFinallyNode(tryExpression, finallyExpression) {
	AbstractNode.call(this);
	this.tryExpression = tryExpression;
	this.finallyExpression = finallyExpression;
}

TryFinallyNode.prototype = Object.create(AbstractNode.prototype);

TryFinallyNode.prototype.getType = function (context) {
	var type = this.tryExpression.getType(context);
	this.finallyExpression.getType(context);
	return type;
};

TryFinallyNode.prototype.evaluate = function (context) {
	try {
		return this.tryExpression.evaluate(context);
	} finally {
		this.finallyExpression.evaluate(context);
	}
};


function TryCatchFinallyNode(tryExpression, catchExpression, finallyExpression) {
	AbstractNode.call(this);
	this.tryExpression = tryExpression;
	this.catchExpression = catchExpression;
	this.finallyExpression = finallyExpression;
}

TryCatchFinallyNode.prototype = Object.create(AbstractNode.prototype);

TryCatchFinallyNode.prototype.getType = function (context) {
	var tryExpression = tryExpression.getType(context);
	var catchExpression = catchExpression.getType(context);
	this.finallyExpression.getType(context);
	if (catchExpression.isSubTypeOf(tryExpression)) {
		return tryExpression;
	} else if (tryExpression.isSubTypeOf(catchExpression)) {
		return catchExpression;
	} else {
		throw new TypeError();
	}
};

TryCatchFinallyNode.prototype.evaluate = function (context) {
	try {
		return this.tryExpression.evaluate(context);
	} catch (e) {
		return this.catchExpression.evaluate(context);
	} finally {
		this.finallyExpression.evaluate(context);
	}
};
