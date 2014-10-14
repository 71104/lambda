var AbstractNode = exports.AbstractNode = function () {};

AbstractNode.prototype.is = function (Class) {
	return this instanceof Class;
};


var LiteralNode = exports.LiteralNode = function (type, value) {
	AbstractNode.call(this);
	this.type = type;
	this.value = value;
};

LiteralNode.prototype = Object.create(AbstractNode.prototype);

LiteralNode.prototype.getType = function () {
	return new TypeResult(this.type, []);
};

LiteralNode.prototype.getFreeVariables = function () {
	return [];
};

LiteralNode.prototype.evaluate = function () {
	return this.value;
};

LiteralNode.prototype.compileExpression = function () {
	return JSON.stringify(this.value);
};

LiteralNode.prototype.compileStatement = function () {
	return 'return ' + JSON.stringify(this.value) + ';';
};


var ArrayLiteralNode = exports.ArrayLiteralNode = function (expressions) {
	AbstractNode.call(this);
	this.expressions = expressions;
};

ArrayLiteralNode.prototype = Object.create(AbstractValue.prototype);

ArrayLiteralNode.prototype.getType = function (context) {
	if (this.expressions.length > 0) {
		var result = this.expressions[0].getType(context);
		for (var i = 1; i < this.expressions.length; i++) {
			var nextResult = this.expressions[i].getType(context);
			if (result.type.isSubTypeOf(nextResult.type)) {
				result.type = nextResult.type;
			} else if (!nextResult.type.isSubTypeOf(result.type)) {
				throw new LambdaTypeError();
			}
			result.thrownTypes.push.apply(result.thrownTypes, nextResult.thrownTypes);
		}
		result.type = new ArrayType(result.type);
		return result;
	} else {
		return new TypeResult(new ArrayType(UndefinedType.INSTANCE), []);
	}
};

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
		return expression.compile();
	}).join(',') + ']';
};

ArrayLiteralNode.prototype.compileStatement = function () {
	return 'return[' + this.expressions.map(function (expression) {
		return expression.compile();
	}).join(',') + '];';
};


var VariableNode = exports.VariableNode = function (name) {
	AbstractNode.call(this);
	this.name = name;
};

VariableNode.prototype = Object.create(AbstractNode.prototype);

VariableNode.prototype.getType = function (context) {
	if (context.has(this.name)) {
		return new TypeResult(context.top(this.name), []);
	} else {
		return new TypeResult(UnknownType.INSTANCE, []);
	}
};

VariableNode.prototype.getFreeVariables = function () {
	return [this.name];
};

VariableNode.prototype.evaluate = function (context) {
	if (context.has(this.name)) {
		return context.top(this.name);
	} else {
		var name = this.name;
		return AbstractValue.unmarshal((function () {
			return this[name];
		}()));
	}
};

VariableNode.prototype.compileExpression = function () {
	return this.name;
};

VariableNode.prototype.compileStatement = function () {
	return 'return ' + this.name + ';';
};


var ErrorNode = exports.ErrorNode = function () {
	VariableNode.call(this, 'error');
};

ErrorNode.prototype = Object.create(VariableNode.prototype);

ErrorNode.prototype.getType = function (context) {
	if (context.has('error')) {
		return new TypeResult(context.top('error'), []);
	} else {
		throw new LambdaTypeError();
	}
};

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

FieldAccessNode.prototype.getType = function (context) {
	var left = this.left.getType(context);
	if (left.type.is(ObjectType) && left.type.context.has(this.name)) {
		return new TypeResult(left.type.context.top(this.name), left.thrownTypes);
	} else if (left.type.is(UnknownType)) {
		return new TypeResult(UnknownType.INSTANCE, left.thrownTypes);
	} else {
		throw new LambdaTypeError();
	}
};

FieldAccessNode.prototype.getFreeVariables = function () {
	return this.left.getFreeVariables();
};

FieldAccessNode.prototype.evaluate = function (context) {
	var left = this.left.evaluate(context);
	if (left.is(ObjectValue)) {
		if (left.context.has(this.name)) {
			return left.context.top(this.name);
		}
	}
	throw new LambdaRuntimeError();
};

FieldAccessNode.prototype.compileExpression = function () {
	return '(' + this.left.compile() + ').' + this.name;
};

FieldAccessNode.prototype.compileStatement = function () {
	return 'return(' + this.left.compile() + ').' + this.name + ';';
};


var SubscriptNode = exports.SubscriptNode = function (expression, index) {
	AbstractNode.call(this);
	this.expression = expression;
	this.index = index;
};

SubscriptNode.prototype = Object.create(AbstractNode.prototype);

SubscriptNode.prototype.getType = function (context) {
	var expression = this.expression.getType(context);
	var index = this.index.getType(context);
	if (index.type.isSubTypeOf(IntegerType.INSTANCE)) {
		if (expression.type.is(ArrayType)) {
			return new TypeResult(expression.type, expression.thrownTypes.concat(index.thrownTypes));
		} else if (expression.type.is(UnknownType)) {
			return new TypeResult(UnknownType.INSTANCE, expression.thrownTypes.concat(index.thrownTypes));
		}
	}
	throw new LambdaTypeError();
};

SubscriptNode.prototype.getFreeVariables = function () {
	return this.expression.getFreeVariables();
};

SubscriptNode.prototype.evaluate = function (context) {
	var value = this.expression.evaluate(context);
	if (value.is(ArrayValue)) {
		var index = this.index.evaluate(context);
		if (index.is(IntegerValue)) {
			return value.array[index.value];
		}
	}
	throw new LambdaRuntimeError();
};

SubscriptNode.prototype.compileExpression = function () {
	return '(' + this.expression.compile() + ')[' + this.index.compile() + ']';
};

SubscriptNode.prototype.compileStatement = function () {
	return 'return(' + this.expression.compile() + ')[' + this.index.compile() + '];';
};


var LambdaNode = exports.LambdaNode = function (name, type, body) {
	AbstractNode.call(this);
	this.name = name;
	this.type = type;
	this.body = body;
};

LambdaNode.prototype = Object.create(AbstractNode.prototype);

LambdaNode.prototype.getType = function (context) {
	var left = this.type || new VariableType(this.name);
	return context.augment(this.name, left, function (context) {
		var body = this.body.getType(context);
		return new TypeResult(new LambdaType(left, body.type, body.thrownTypes), []);
	}, this);
};

LambdaNode.prototype.getFreeVariables = function () {
	return this.body.getFreeVariables().filter(function (name) {
		return name !== this.name;
	}, this);
};

LambdaNode.prototype.evaluate = function (context) {
	return new Closure(this, context.capture(this.getFreeVariables()));
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

ApplicationNode.prototype.getType = function (context) {
	var left = this.left.getType(context);
	var right = this.right.getType(context);
	if (left.type.is(LambdaType) && right.type.isSubTypeOf(left.type.left)) {
		return new TypeResult(left.type.right, left.thrownTypes.concat(right.thrownTypes));
	} else if (left.type.is(UnknownType)) {
		return new TypeResult(UnknownType.INSTANCE, left.thrownTypes.concat(right.thrownTypes));
	} else {
		throw new LambdaTypeError();
	}
};

ApplicationNode.prototype.getFreeVariables = function () {
	return this.left.getFreeVariables().union(this.right.getFreeVariables());
};

ApplicationNode.prototype.evaluate = function (context) {
	var left = this.left.evaluate(context);
	if (left.is(Closure)) {
		var lambda = left.lambda;
		return left.context.augment(lambda.name, this.right.evaluate(context), function (context) {
			return lambda.body.evaluate(context);
		});
	} else {
		throw new LambdaRuntimeError();
	}
};

ApplicationNode.prototype.compileExpression = function () {
	return '(' + this.left.compile() + ')(' + this.right.compile() + ')';
};

ApplicationNode.prototype.compileStatement = function () {
	return 'return(' + this.left.compile() + ')(' + this.right.compile() + ');';
};


var FixNode = exports.FixNode = function () {
	AbstractNode.call(this);
};

FixNode.prototype = Object.create(AbstractNode.prototype);

FixNode.prototype.getType = function () {
	// TODO
};

FixNode.prototype.getFreeVariables = function () {
	return [];
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

FixNode.COMPILED_Z_COMBINATOR = 'function(f){return(function(x){return f(function(v){return x(x)(v)})}(function(x){return f(function(v){return x(x)(v)})}))}';

FixNode.prototype.compileExpression = function () {
	return FixNode.COMPILED_Z_COMBINATOR;
};

FixNode.prototype.compileStatement = function () {
	return 'return ' + FixNode.COMPILED_Z_COMBINATOR + ';';
};

FixNode.INSTANCE = new FixNode();


var LetNode = exports.LetNode = function (names, expression, body) {
	AbstractNode.call(this);
	this.names = names;
	this.expression = expression;
	this.body = body;
};

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
			var expressionResult = expression.getType(rootContext);
			return context.augment(names[index], expressionResult.type, function () {
				var bodyResult = body.getType(rootContext);
				return new TypeResult(bodyResult.type, expressionResult.thrownTypes.concat(bodyResult.thrownTypes));
			});
		} else {
			throw new LambdaInternalError();
		}
	}(rootContext, 0));
};

LetNode.prototype.getFreeVariables = function () {
	return this.expression.getFreeVariables().union(this.body.getFreeVariables().filter(function (name) {
		return name !== this.names[0];
	}, this));
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
			throw new LambdaInternalError();
		}
	}(rootContext, 0));
};

LetNode.prototype.compileExpression = function () {
	if (this.names.length > 1) {
		// TODO
	} else {
		return '(function(' + this.names[0] + '){' + this.body.compileStatement() + '}(' + this.expression.compileExpression() + '))';
	}
};

LetNode.prototype.compileStatement = function () {
	if (this.names.length > 1) {
		// TODO
	} else {
		return 'var ' + this.names[0] + '=' + this.expression.compileExpression() + ';' + this.body.compileStatement();
	}
};


var IfNode = exports.IfNode = function (condition, thenExpression, elseExpression) {
	AbstractNode.call(this);
	this.condition = condition;
	this.thenExpression = thenExpression;
	this.elseExpression = elseExpression;
};

IfNode.prototype = Object.create(AbstractNode.prototype);

IfNode.prototype.getType = function (context) {
	var condition = this.condition.getType(context);
	if (condition.type.isSubTypeOf(BooleanType.INSTANCE)) {
		var type1 = this.thenExpression.getType(context);
		var type2 = this.elseExpression.getType(context);
		var thrownTypes = condition.thrownTypes.concat(type1.thrownTypes).concat(type2.thrownTypes);
		if (type1.type.isSubTypeOf(type2.type)) {
			return new TypeResult(type2.type, thrownTypes);
		} else if (type2.type.isSubTypeOf(type1.type)) {
			return new TypeResult(type1.type, thrownTypes);
		}
	}
	throw new LambdaTypeError();
};

IfNode.prototype.getFreeVariables = function () {
	return this.condition.getFreeVariables()
		.union(this.thenExpression.getFreeVariables())
		.union(this.elseExpression.getFreeVariables());
};

IfNode.prototype.evaluate = function (context) {
	var condition = this.condition.evaluate(context).marshal();
	if (condition instanceof NativeComplexValue) {
		if (condition.r || condition.i) {
			return this.thenExpression.evaluate(context);
		} else {
			return this.elseExpression.evaluate(context);
		}
	} else if (condition) {
		return this.thenExpression.evaluate(context);
	} else {
		return this.elseExpression.evaluate(context);
	}
};

IfNode.prototype.compileExpression = function () {
	return '(function(){if(' + this.condition.compileExpression() + '){' +
		this.thenExpression.compileStatement() + '}else{' +
		this.elseExpression.compileStatement() + '}}())';
};

IfNode.prototype.compileStatement = function () {
	return 'if(' + this.condition.compileExpression() + '){' +
		this.thenExpression.compileStatement() + '}else{' +
		this.elseExpression.compileStatement() + '}';
};


var ThrowNode = exports.ThrowNode = function (expression) {
	AbstractNode.call(this);
	this.expression = expression;
};

ThrowNode.prototype = Object.create(AbstractNode.prototype);

ThrowNode.prototype.getType = function (context) {
	var expression = this.expression.getType(context);
	return new TypeResult(UnknownType.INSTANCE, expression.thrownTypes.concat([expression.type]));
};

ThrowNode.prototype.getFreeVariables = function () {
	return this.expression.getFreeVariables();
};

ThrowNode.prototype.evaluate = function (context) {
	throw new LambdaUserError(this.expression.evaluate(context));
};

ThrowNode.prototype.compileExpression = function () {
	return '(function(){throw ' + this.expression.compileExpression() + '}())';
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

TryCatchNode.prototype.getType = function (context) {
	var tryResult = this.tryExpression.getType(context);
	if (tryResult.thrownTypes.length > 0) {
		var errorType = tryResult.thrownTypes[0];
		for (var i = 1; i < tryResult.thrownTypes.length; i++) {
			if (errorType.isSubTypeOf(tryResult.thrownTypes[i])) {
				errorType = tryResult.thrownTypes[i];
			} else if (!tryResult.thrownTypes[i].isSubTypeOf(errorType)) {
				errorType = UndefinedType.INSTANCE;
				break;
			}
		}
		return context.augment('error', errorType, function (context) {
			var catchResult = this.catchExpression.getType(context);
			if (catchResult.type.isSubTypeOf(tryResult.type)) {
				return new TypeResult(tryResult.type, catchResult.thrownTypes);
			} else if (tryResult.type.isSubTypeOf(catchResult.type)) {
				return catchResult;
			} else {
				throw new LambdaTypeError();
			}
		}, this);
	} else {
		throw new LambdaTypeError();
	}
};

TryCatchNode.prototype.getFreeVariables = function () {
	return this.tryExpression.getFreeVariables()
		.union(this.catchExpression.getFreeVariables());
};

TryCatchNode.prototype.evaluate = function (context) {
	try {
		return this.tryExpression.evaluate(context);
	} catch (e) {
		if (e instanceof LambdaUserError) {
			return context.augment('error', e.value, function (context) {
				return this.catchExpression.evaluate(context);
			}, this);
		} else {
			throw e;
		}
	}
};

TryCatchNode.prototype.compileExpression = function () {
	return '(function(){try{' + this.tryExpression.compileStatement() + '}catch(error){' +
		this.catchExpression.compileStatement() + '}}())';
};

TryCatchNode.prototype.compileStatement = function () {
	return 'try{' + this.tryExpression.compileStatement() + '}catch(error){' +
		this.catchExpression.compileStatement() + '}';
};


var TryFinallyNode = exports.TryFinallyNode = function (tryExpression, finallyExpression) {
	AbstractNode.call(this);
	this.tryExpression = tryExpression;
	this.finallyExpression = finallyExpression;
};

TryFinallyNode.prototype = Object.create(AbstractNode.prototype);

TryFinallyNode.prototype.getType = function (context) {
	var tryResult = this.tryExpression.getType(context);
	var finallyResult = this.finallyExpression.getType(context);
	return new TypeResult(tryResult.type, tryResult.thrownTypes.concat(finallyResult.thrownTypes));
};

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
	return '(function(){try{' + this.tryExpression.compileStatement() + '}catch(error){' +
		this.catchExpression.compileStatement() + '}}())';
};


var TryCatchFinallyNode = exports.TryCatchFinallyNode = function (tryExpression, catchExpression, finallyExpression) {
	AbstractNode.call(this);
	this.tryExpression = tryExpression;
	this.catchExpression = catchExpression;
	this.finallyExpression = finallyExpression;
};

TryCatchFinallyNode.prototype = Object.create(AbstractNode.prototype);

TryCatchFinallyNode.prototype.getType = function (context) {
	var tryResult = this.tryExpression.getType(context);
	if (tryResult.thrownTypes.length > 0) {
		var errorType = tryResult.thrownTypes[0];
		for (var i = 1; i < tryResult.thrownTypes.length; i++) {
			if (errorType.isSubTypeOf(tryResult.thrownTypes[i])) {
				errorType = tryResult.thrownTypes[i];
			} else if (!tryResult.thrownTypes[i].isSubTypeOf(errorType)) {
				errorType = UndefinedType.INSTANCE;
				break;
			}
		}
		var finallyResult = this.finallyExpression.getType(context);
		return context.augment('error', errorType, function (context) {
			var catchResult = this.catchExpression.getType(context);
			if (catchResult.type.isSubTypeOf(tryResult.type)) {
				return new TypeResult(tryResult.type, catchResult.thrownTypes.concat(finallyResult.thrownTypes));
			} else if (tryResult.type.isSubTypeOf(catchResult.type)) {
				return new TypeResult(catchResult.type, catchResult.thrownTypes.concat(finallyResult.thrownTypes));
			} else {
				throw new LambdaTypeError();
			}
		}, this);
	} else {
		throw new LambdaTypeError();
	}
};

TryCatchFinallyNode.prototype.getFreeVariables = function () {
	return this.tryExpression.getFreeVariables()
		.union(this.catchExpression.getFreeVariables())
		.union(this.finallyExpression.getFreeVariables());
};

TryCatchFinallyNode.prototype.evaluate = function (context) {
	try {
		return this.tryExpression.evaluate(context);
	} catch (e) {
		if (e instanceof LambdaUserError) {
			return context.augment('error', e.value, function (context) {
				return this.catchExpression.evaluate(context);
			}, this);
		} else {
			throw e;
		}
	} finally {
		this.finallyExpression.evaluate(context);
	}
};

TryCatchFinallyNode.prototype.compileExpression = function () {
	return '(function(){try{' + this.tryExpression.compileStatement() + '}catch(error){' +
		this.catchExpression.compileStatement() + '}finally{' +
		this.finallyExpression.compileStatement() + '}}())';
};


var NativeNode = exports.NativeNode = function (nativeFunction, thisArgument, argumentNames) {
	AbstractNode.call(this);
	this.nativeFunction = nativeFunction;
	this.thisArgument = thisArgument;
	this.argumentNames = argumentNames;
};

NativeNode.prototype = Object.create(AbstractNode.prototype);

NativeNode.prototype.getType = function () {
	return new TypeResult(UnknownType.INSTANCE, [UnknownType.INSTANCE]);
};

NativeNode.prototype.getFreeVariables = function () {
	return this.argumentNames;
};

NativeNode.prototype.evaluate = function (context) {
	return AbstractValue.unmarshal(this.nativeFunction.apply(this.thisArgument, this.argumentNames.map(function (name) {
		return context.top(name).marshal();
	})));
};
