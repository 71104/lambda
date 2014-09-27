function AbstractNode() {}

AbstractNode.prototype.is = function (Class) {
	return this instanceof Class;
};


function LiteralNode(type, value) {
	AbstractNode.call(this);
	this.type = type;
	this.value = value;
}

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
		// TODO
	}
};


function FieldAccessNode(left, name) {
	AbstractNode.call(this);
	this.left = left;
	this.name = name;
}

FieldAccessNode.prototype.getType = function (context) {
	var left = this.left.getType(context);
	if (left.is(ObjectType) && left.context.has(this.name)) {
		return left.context.top(this.name);
	} else {
		throw new TypeError();
	}
};

FieldAccessNode.prototype.evaluate = function (context) {
	return this.left.evaluate(context)[this.name];
};


function ProjectionNode(name) {
	AbstractNode.call(this);
	this.name = name;
}

ProjectionNode.prototype.getType = function () {
	// TODO
};

ProjectionNode.prototype.evaluate = function () {
	var name = this.name;
	return function (object) {
		return object[name];
	};
};


function LambdaNode(name, type, body) {
	AbstractNode.call(this);
	this.name = name;
	this.type = type;
	this.body = body;
}

LambdaNode.prototype.getType = function (context) {
	return context.augment(this.name, this.type, function (context) {
		if (this.type.is(VariableType)) {
			return new PolimorphicType(this.name, new LambdaType(this.type, this.body.getType(context)));
		} else {
			return new LambdaType(this.type, this.body.getType(context));
		}
	}, this);
};

LambdaNode.prototype.evaluate = function (context) {
	var name = this.name;
	var body = this.body;
	return function (value) {
		return context.augment(name, value, function (context) {
			return body.evaluate(context);
		});
	};
};


function ApplicationNode(left, right) {
	AbstractNode.call(this);
	this.left = left;
	this.right = right;
}

ApplicationNode.prototype.getType = function (context) {
	var left = this.left.getType(context);
	if (left.is(LambdaType)) {
		var right = this.right.getType(context);
		if (right.isSubTypeOf(left.left)) {
			return left.right;
		} else {
			throw new TypeError();
		}
	} else if (left.is(UnknownType)) {
		return UnknownType.INSTANCE;
	} else {
		throw new TypeError();
	}
};

ApplicationNode.prototype.evaluate = function () {
	// TODO
};


function FixNode() {
	AbstractNode.call(this);
}

FixNode.prototype.getType = function () {
	// TODO
};

FixNode.prototype.evaluate = function () {
	return function (f) {
		(function (x) {
			return f(function (v) {
				return x(x)(v);
			});
		})(function (x) {
			return f(function (v) {
				return x(x)(v);
			});
		});
	};
};

FixNode.INSTANCE = new FixNode();


function LetNode(names, expression, body) {
	AbstractNode.call(this);
	this.names = names;
	this.expression = expression;
	this.body = body;
}

LetNode.prototype.getType = function (rootContext) {
	var names = this.names;
	var expression = this.expression;
	var body = this.body;
	return (function augment(context, index) {
		if (index < names.length - 1) {
			var type;
			if (context.has(names[index])) {
				type = context.top(names[index]);
				if (type.is(ObjectType)) {
					return augment(type.context, index + 1);
				}
			}
			type = new ObjectType(new Context());
			return context.augment(names[index], type, function () {
				return augment(type.context, index + 1);
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

LetNode.prototype.evaluate = function () {
	// TODO
};


function IfNode(condition, thenExpression, elseExpression) {
	AbstractNode.call(this);
	this.condition = condition;
	this.thenExpression = thenExpression;
	this.elseExpression = elseExpression;
}

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
	if (this.condition.evaluate(context)) {
		return this.thenExpression.evaluate(context);
	} else {
		return this.elseExpression.evaluate(context);
	}
};


function ThrowNode(expression) {
	AbstractNode.call(this);
	this.expression = expression;
}

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
