var Parser = exports.Parser = function (input) {
	this.lexer = new Lexer(input);
};

Parser.prototype.parseInteger = function () {
	return new LiteralNode(new IntegerValue(this.lexer.expect('integer')));
};

Parser.prototype.parseComplex = function () {
	return new LiteralNode(new ComplexValue(0, this.lexer.expect('complex')));
};

Parser.prototype.parseFloat = function () {
	return new LiteralNode(new FloatValue(this.lexer.expect('float')));
};

Parser.prototype.parseString = function () {
	return new LiteralNode(new StringValue(this.lexer.expect('string')));
};

Parser.prototype.parseClass0 = function () {
	switch (this.lexer.token()) {
	case 'keyword:null':
		this.lexer.next();
		return new LiteralNode(NullValue.INSTANCE);
	case 'keyword:undefined':
		this.lexer.next();
		return new LiteralNode(UndefinedValue.INSTANCE);
	case 'keyword:true':
		this.lexer.next();
		return new LiteralNode(BooleanValue.TRUE);
	case 'keyword:false':
		this.lexer.next();
		return new LiteralNode(BooleanValue.FALSE);
	case 'integer':
		return this.parseInteger();
	case 'complex':
		return this.parseComplex();
	case 'float':
		return this.parseFloat();
	case 'string':
		return this.parseString();
	case 'identifier':
	case 'keyword:typeof':
	case 'keyword:not':
	case 'keyword:and':
	case 'keyword:or':
	case 'keyword:xor':
	case 'symbol':
	case 'equal':
	case 'asterisk':
		var label = this.lexer.label();
		this.lexer.next();
		return this.parseVariable(label);
	case 'keyword:fix':
		this.lexer.next();
		return FixNode.INSTANCE;
	case 'keyword:this':
		this.lexer.next();
		return ThisNode.INSTANCE;
	case 'keyword:error':
		this.lexer.next();
		return ErrorNode.INSTANCE;
	case 'left':
		this.lexer.next();
		var node = this.parseClass3(['right']);
		this.lexer.next();
		return node;
	case 'left-curly':
		var expressions = [];
		if (this.lexer.next() !== 'right-curly') {
			expressions.push(this.parseClass3(['comma', 'right-curly']));
			while (this.lexer.token() === 'comma') {
				this.lexer.next();
				expressions.push(this.parseClass3(['comma', 'right-curly']));
			}
		}
		this.lexer.next();
		return new ArrayLiteralNode(expressions);
	default:
		throw new LambdaSyntaxError();
	}
};

Parser.prototype.parseSubscriptOrFieldAccess = function (node) {
	while (true) {
		switch (this.lexer.token()) {
		case 'point':
			var token = this.lexer.next();
			if (token !== 'identifier' && !token.match(/^keyword\:/)) {
				throw new LambdaSyntaxError();
			}
			node = new FieldAccessNode(node, this.lexer.expect(token));
			break;
		case 'left-square':
			this.lexer.next();
			var index = this.parseClass3(['right-square']);
			this.lexer.next();
			node = new SubscriptNode(node, index);
			break;
		default:
			return node;
		}
	}
};

Parser.prototype.parseClass1 = function () {
	return this.parseSubscriptOrFieldAccess(this.parseClass0());
};

Parser.prototype.parseLambdaPartial = function (terminators) {
	var name = this.lexer.expect('identifier');
	switch (this.lexer.token()) {
	case 'comma':
		this.lexer.next();
		return new LambdaNode(name, this.parseLambdaPartial(terminators));
	case 'arrow':
		this.lexer.next();
		return new LambdaNode(name, this.parseClass3(terminators));
	default:
		throw new LambdaSyntaxError();
	}
};

Parser.prototype.parseLambdaOrVariable = function (terminators) {
	var name = this.lexer.label();
	switch (this.lexer.next()) {
	case 'comma':
		this.lexer.next();
		return new LambdaNode(name, this.parseLambdaPartial(terminators));
	case 'arrow':
		this.lexer.next();
		return new LambdaNode(name, this.parseClass3(terminators));
	default:
		return this.parseSubscriptOrFieldAccess(new VariableNode(name));
	}
};

Parser.prototype.parseLetPartial = function (terminators) {
	var names = [this.lexer.expect('identifier')];
	while (this.lexer.token() === 'point') {
		var token = this.lexer.next();
		if (token !== 'identifier' && !token.match(/^keyword\:/)) {
			throw new LambdaSyntaxError();
		} else {
			names.push(this.lexer.expect(token));
		}
	}
	this.lexer.expect('equal');
	var expression = this.parseClass3(['comma', 'keyword:in']);
	switch (this.lexer.token()) {
	case 'comma':
		this.lexer.next();
		return new LetNode(names, expression, this.parseLetPartial(terminators));
	case 'keyword:in':
		this.lexer.next();
		return new LetNode(names, expression, this.parseClass3(terminators));
	default:
		throw new LambdaSyntaxError();
	}
};

Parser.prototype.parseLet = function (terminators) {
	this.lexer.expect('keyword:let');
	return this.parseLetPartial(terminators);
};

Parser.prototype.parseIf = function (terminators) {
	this.lexer.expect('keyword:if');
	var condition = this.parseClass3(['keyword:then']);
	this.lexer.next();
	var thenExpression = this.parseClass3(['keyword:else']);
	this.lexer.next();
	return new IfNode(condition, thenExpression, this.parseClass3(terminators));
};

Parser.prototype.parseThrow = function (terminators) {
	this.lexer.expect('keyword:throw');
	return new ThrowNode(this.parseClass3(terminators));
};

Parser.prototype.parseTry = function (terminators) {
	this.lexer.expect('keyword:try');
	var tryExpression = this.parseClass3(['keyword:catch', 'keyword:finally']);
	switch (this.lexer.token()) {
	case 'keyword:catch':
		this.lexer.next();
		var catchExpression = this.parseClass3(terminators.union(['keyword:finally']));
		if (this.lexer.token() === 'keyword:finally') {
			this.lexer.next();
			return new TryCatchFinallyNode(tryExpression, catchExpression, this.parseClass3(terminators));
		} else if (terminators.contains(this.lexer.token())) {
			return new TryCatchNode(tryExpression, catchExpression);
		}
		throw new LambdaSyntaxError();
	case 'keyword:finally':
		this.lexer.next();
		return new TryFinallyNode(tryExpression, this.parseClass3(terminators));
	default:
		throw new LambdaSyntaxError();
	}
};

Parser.prototype.parseClass2 = function (terminators) {
	switch (this.lexer.token()) {
	case 'identifier':
		return this.parseLambdaOrVariable(terminators);
	case 'keyword:let':
		return this.parseLet(terminators);
	case 'keyword:if':
		return this.parseIf(terminators);
	case 'keyword:throw':
		return this.parseThrow(terminators);
	case 'keyword:try':
		return this.parseTry(terminators);
	default:
		return this.parseClass1(terminators);
	}
};

Parser.prototype.parseClass3 = function (terminators) {
	var node = this.parseClass2(terminators);
	while (!terminators.contains(this.lexer.token())) {
		node = new ApplicationNode(node, this.parseClass2(terminators));
	}
	return node;
};

Parser.prototype.parse = function () {
	return this.parseClass3(['end']);
};
