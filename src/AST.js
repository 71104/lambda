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


function LetNode(name, expression, body) {
	AbstractNode.call(this);
	this.name = name;
	this.expression = expression;
	this.body = body;
}

LetNode.prototype.getType = function (context) {
	return context.augment(this.name, this.expression.getType(context), function (context) {
		return this.body.getType(context);
	}, this);
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
