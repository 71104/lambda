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


function LambdaNode(name, type, body) {
	AbstractNode.call(this);
	this.name = name;
	this.type = type;
	this.body = body;
}

LambdaNode.prototype.getType = function () {
	// TODO
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


function FixNode() {
	AbstractNode.call(this);
}

FixNode.prototype.getType = function () {
	// TODO
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
