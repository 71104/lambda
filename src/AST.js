var AbstractNode = exports.AbstractNode = function () {};

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


var LiteralNode = exports.LiteralNode = function (value) {
	AbstractNode.call(this);
	this.value = value;
};

LiteralNode.prototype = Object.create(AbstractNode.prototype);

LiteralNode.prototype.getFreeVariables = function () {
	return [];
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


var ArrayLiteralNode = exports.ArrayLiteralNode = function (expressions) {
	AbstractNode.call(this);
	this.expressions = expressions;
};

ArrayLiteralNode.prototype = Object.create(AbstractNode.prototype);

ArrayLiteralNode.prototype.getFreeVariables = function () {
	var names = [];
	this.expressions.forEach(function (expression) {
		names = names.union(expression.getFreeVariables());
	});
	return names;
};

ArrayLiteralNode.prototype.evaluate = function (context) {
	return new ArrayValue(this.expressions.map(function (expression) {
		return expression.evaluate(context);
	}));
};

ArrayLiteralNode.prototype.compileExpression = function () {
	return '[' + this.expressions.map(function (expression) {
		return expression.compileExpression();
	}).join(',') + ']';
};

ArrayLiteralNode.prototype.compileStatement = function () {
	return 'return[' + this.expressions.map(function (expression) {
		return expression.compileExpression();
	}) + '];';
};


var VariableNode = exports.VariableNode = function (name) {
	AbstractNode.call(this);
	this.name = name;
};

VariableNode.prototype = Object.create(AbstractNode.prototype);

VariableNode.prototype.getFreeVariables = function () {
	return [this.name];
};

VariableNode.prototype.evaluate = function (context) {
	if (context.has(this.name)) {
		return context.top(this.name);
	} else {
		var evil = eval;
		return AbstractValue.unmarshal(evil('this')[this.name]);
	}
};

VariableNode.prototype.compileExpression = function () {
	return this.name;
};

VariableNode.prototype.compileStatement = function () {
	return 'return ' + this.name + ';';
};


var ThisNode = exports.ThisNode = function () {
	AbstractNode.call(this);
};

ThisNode.prototype = Object.create(AbstractNode.prototype);

ThisNode.prototype.getFreeVariables = function () {
	return ['this'];
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

ThisNode.INSTANCE = new ThisNode();


var ErrorNode = exports.ErrorNode = function () {
	AbstractNode.call(this);
};

ErrorNode.prototype = Object.create(AbstractNode.prototype);

ErrorNode.prototype.getFreeVariables = function () {
	return ['error'];
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

ErrorNode.INSTANCE = new ErrorNode();


var FieldAccessNode = exports.FieldAccessNode = function (left, name) {
	AbstractNode.call(this);
	this.left = left;
	this.name = name;
};

FieldAccessNode.prototype = Object.create(AbstractNode.prototype);

FieldAccessNode.prototype.getFreeVariables = function () {
	return this.left.getFreeVariables();
};

FieldAccessNode.prototype.evaluate = function (context) {
	var left = this.left.evaluate(context);
	if (left.is(ObjectValue)) {
		if (left.context.has(this.name)) {
			return left.context.top(this.name);
		} else {
			return UndefinedValue.INSTANCE;
		}
	} else if (left.isAny(ComplexValue, StringValue, ArrayValue, Closure) && left.prototype.has(this.name)) {
		return left.prototype.top(this.name);
	}
	throw new LambdaRuntimeError();
};

FieldAccessNode.prototype.compileExpression = function () {
	return '(' + this.left.compileExpression() + ').' + this.name;
};

FieldAccessNode.prototype.compileStatement = function () {
	return 'return(' + this.left.compileExpression() + ').' + this.name + ';';
};


var SubscriptNode = exports.SubscriptNode = function (expression, index) {
	AbstractNode.call(this);
	this.expression = expression;
	this.index = index;
};

SubscriptNode.prototype = Object.create(AbstractNode.prototype);

SubscriptNode.prototype.getFreeVariables = function () {
	return this.expression.getFreeVariables().union(this.index.getFreeVariables());
};

SubscriptNode.prototype.evaluate = function (context) {
	var value = this.expression.evaluate(context);
	if (value.isAny(ArrayValue, StringValue)) {
		var index = this.index.evaluate(context);
		if (index.is(IntegerValue)) {
			if (value.is(ArrayValue)) {
				if (index.value >= 0 && index.value < value.array.length) {
					return value.array[index.value];
				}
			} else if (value.is(StringValue)) {
				if (index.value >= 0 && index.value < value.value.length) {
					return value.value[index.value];
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


var LambdaNode = exports.LambdaNode = function (name, body) {
	AbstractNode.call(this);
	this.name = name;
	this.body = body;
};

LambdaNode.prototype = Object.create(AbstractNode.prototype);

LambdaNode.prototype.getFreeVariables = function () {
	return this.body.getFreeVariables().filter(function (name) {
		return name !== this.name;
	}, this);
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


var ApplicationNode = exports.ApplicationNode = function (left, right) {
	AbstractNode.call(this);
	this.left = left;
	this.right = right;
};

ApplicationNode.prototype = Object.create(AbstractNode.prototype);

ApplicationNode.prototype.getFreeVariables = function () {
	return this.left.getFreeVariables().union(this.right.getFreeVariables());
};

ApplicationNode.prototype.evaluate = function (context) {
	var left = this.left.evaluate(context);
	if (left.is(Closure)) {
		return left.lambda.body.evaluate(left.context.add(left.lambda.name, this.right.evaluate(context)));
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


var FixNode = exports.FixNode = function () {
	AbstractNode.call(this);
};

FixNode.prototype = Object.create(AbstractNode.prototype);

FixNode.prototype.getFreeVariables = function () {
	return [];
};

FixNode.Z_COMBINATOR = (new LambdaNode('f', new ApplicationNode(
	new LambdaNode('x', new ApplicationNode(
		new VariableNode('f'),
		new LambdaNode('v', new ApplicationNode(
			new ApplicationNode(
				new VariableNode('x'),
				new VariableNode('x')
				),
			new VariableNode('v')
			))
		)),
	new LambdaNode('x', new ApplicationNode(
		new VariableNode('f'),
		new LambdaNode('v', new ApplicationNode(
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

FixNode.prototype.compileExpression = function () {
	return 'function fix(f){return function(v){return f(fix(f))(v);};}';
};

FixNode.prototype.compileStatement = function () {
	return 'return function fix(f){return function(v){return f(fix(f))(v);};};';
};

FixNode.INSTANCE = new FixNode();


var LetNode = exports.LetNode = function (names, expression, body) {
	AbstractNode.call(this);
	this.names = names;
	this.expression = expression;
	this.body = body;
};

LetNode.prototype = Object.create(AbstractNode.prototype);

LetNode.prototype.getFreeVariables = function () {
	return this.expression.getFreeVariables().union(this.body.getFreeVariables().filter(function (name) {
		return name !== this.names[0];
	}, this));
};

LetNode.prototype.evaluate = function (context) {
	var names = this.names;
	var value = this.expression.evaluate(context);
	return this.body.evaluate((function augment(context, index) {
		if (index < names.length - 1) {
			var name = names[index];
			if (context.has(name) && context.top(name).is(ObjectValue)) {
				return context.add(name, new ObjectValue(augment(context.top(name).context, index + 1)));
			} else {
				return context.add(name, new ObjectValue(augment(new Context(), index + 1)));
			}
		} else if (index < names.length) {
			return context.add(names[index], value);
		} else {
			throw new LambdaInternalError();
		}
	}(context, 0)));
};

LetNode.prototype.compileExpression = function () {
	if (this.names.length > 1) {
		// TODO
	} else {
		return '(function(' + this.name + '){' + this.body.compileStatement() + '}(' + this.expression.compileExpression() + '))';
	}
};

LetNode.prototype.compileStatement = function () {
	if (this.names.length > 1) {
		// TODO
	} else {
		return 'var ' + this.name + '=' + this.expression.compileExpression() + ';' + this.body.compileStatement();
	}
};


var IfNode = exports.IfNode = function (condition, thenExpression, elseExpression) {
	AbstractNode.call(this);
	this.condition = condition;
	this.thenExpression = thenExpression;
	this.elseExpression = elseExpression;
};

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


var ThrowNode = exports.ThrowNode = function (expression) {
	AbstractNode.call(this);
	this.expression = expression;
};

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


var TryCatchNode = exports.TryCatchNode = function (tryExpression, catchExpression) {
	AbstractNode.call(this);
	this.tryExpression = tryExpression;
	this.catchExpression = catchExpression;
};

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


var TryFinallyNode = exports.TryFinallyNode = function (tryExpression, finallyExpression) {
	AbstractNode.call(this);
	this.tryExpression = tryExpression;
	this.finallyExpression = finallyExpression;
};

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


var TryCatchFinallyNode = exports.TryCatchFinallyNode = function (tryExpression, catchExpression, finallyExpression) {
	AbstractNode.call(this);
	this.tryExpression = tryExpression;
	this.catchExpression = catchExpression;
	this.finallyExpression = finallyExpression;
};

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

TryCatchFinallyNode.prototype.compileExpression = function () {
	return 'try{' + this.tryExpression.compileStatement() +
		'}catch(error){' + this.catchExpression.compileStatement() +
		'}finally{' + this.finallyExpression.compileStatement() + '}';
};


var NativeNode = exports.NativeNode = function (nativeFunction, thisArgument, argumentNames) {
	AbstractNode.call(this);
	this.nativeFunction = nativeFunction;
	this.thisArgument = thisArgument;
	this.argumentNames = argumentNames;
};

NativeNode.prototype = Object.create(AbstractNode.prototype);

NativeNode.prototype.getFreeVariables = function () {
	return this.argumentNames;
};

NativeNode.prototype.evaluate = function (context) {
	try {
		return AbstractValue.unmarshal(this.nativeFunction.apply(this.thisArgument, this.argumentNames.map(function (name) {
			if (context.has(name)) {
				return context.top(name).marshal();
			} else {
				throw new LambdaInternalError();
			}
		})));
	} catch (e) {
		throw new LambdaUserError(AbstractValue.unmarshal(e));
	}
};


var SemiNativeNode = exports.SemiNativeNode = function (overloads, ariety) {
	AbstractNode.call(this);
	this.overloads = overloads;
	this.argumentNames = [];
	for (var i = 0; i < ariety; i++) {
		this.argumentNames.push('' + i);
	}
};

SemiNativeNode.prototype = Object.create(AbstractNode.prototype);

SemiNativeNode.prototype.getFreeVariables = function () {
	return this.argumentNames;
};

SemiNativeNode.prototype.evaluate = function (context) {
	var argumentValues = this.argumentNames.map(function (name) {
		if (context.has(name)) {
			return context.top(name);
		} else {
			throw new LambdaInternalError();
		}
	});
	var overload = this.overloads;
	argumentValues.forEach(function (argument) {
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
	return overload.apply(null, argumentValues);
};


var UnaryOperatorNode = exports.UnaryOperatorNode = function (overloads) {
	LambdaNode.call(this, '0', new SemiNativeNode(overloads, 1));
};

UnaryOperatorNode.prototype = Object.create(LambdaNode.prototype);


var BinaryOperatorNode = exports.BinaryOperatorNode = function (overloads) {
	LambdaNode.call(this, '0', new LambdaNode('1', new SemiNativeNode(overloads, 2)));
};

BinaryOperatorNode.prototype = Object.create(LambdaNode.prototype);
