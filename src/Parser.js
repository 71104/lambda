exports.Parser = function (input) {
	var lexer = new Lexer(input);

	function parseClass0() {
		var node = (function () {
			switch (lexer.token()) {
			case 'keyword:null':
				return new LiteralNode(NullValue.INSTANCE);
			case 'keyword:undefined':
				return new LiteralNode(UndefinedValue.INSTANCE);
			case 'keyword:true':
				return new LiteralNode(BooleanValue.TRUE);
			case 'keyword:false':
				return new LiteralNode(BooleanValue.FALSE);
			case 'integer':
				return new LiteralNode(new IntegerValue(lexer.label()));
			case 'complex':
				return new LiteralNode(new ComplexValue(0, lexer.label()));
			case 'float':
				return new LiteralNode(new FloatValue(lexer.label()));
			case 'string':
				return new LiteralNode(new StringValue(lexer.label()));
			case 'identifier':
			case 'keyword:typeof':
			case 'keyword:not':
			case 'keyword:and':
			case 'keyword:or':
			case 'keyword:xor':
			case 'symbol':
			case 'equal':
			case 'asterisk':
				return new VariableNode(lexer.label());
			case 'keyword:fix':
				return FixNode.INSTANCE;
			case 'keyword:this':
				return ThisNode.INSTANCE;
			case 'keyword:error':
				return ErrorNode.INSTANCE;
			case 'left':
				lexer.next();
				var node = parseClass3({
					'right': true
				});
				if (lexer.token() !== 'right') {
					throw new LambdaSyntaxError();
				}
				return node;
			case 'left-curly':
				lexer.next();
				var expressions = [];
				while (lexer.token() !== 'right-curly') {
					expressions.push(parseClass3({
						'comma': true,
						'right-curly': true
					}));
					if (lexer.token() === 'comma') {
						lexer.next();
					} else if (lexer.token() !== 'right-curly') {
						throw new LambdaSyntaxError();
					}
				}
				return new ArrayLiteralNode(expressions);
			default:
				throw new LambdaSyntaxError();
			}
		}());
		lexer.next();
		return node;
	}

	function parseClass1() {
		var node = parseClass0();
		while (true) {
			switch (lexer.token()) {
			case 'point':
				var token = lexer.next();
				if (token !== 'identifier' && !token.match(/^keyword\:/)) {
					throw new LambdaSyntaxError();
				}
				node = new FieldAccessNode(node, lexer.label());
				lexer.next();
				break;
			case 'left-square':
				lexer.next();
				var index = parseClass3({
					'right-square': true
				});
				if (lexer.token() !== 'right-square') {
					throw new LambdaSyntaxError();
				}
				lexer.next();
				node = new SubscriptNode(node, index);
				break;
			default:
				return node;
			}
		}
	}

	function parseLambdaOrVariable(terminators) {
		var name = lexer.label();
		switch (lexer.next()) {
		case 'comma':
			lexer.next();
			return new LambdaNode(name, parseLambdaPartial(terminators));
		case 'arrow':
			lexer.next();
			return new LambdaNode(name, parseClass3(terminators));
		default:
			var node = new VariableNode(name);
			while (true) {
				switch (lexer.token()) {
				case 'point':
					var token = lexer.next();
					if (token !== 'identifier' && !token.match(/^keyword\:/)) {
						throw new LambdaSyntaxError();
					}
					node = new FieldAccessNode(node, lexer.label());
					lexer.next();
					break;
				case 'left-square':
					lexer.next();
					var index = parseClass3({
						'right-square': true
					});
					if (lexer.token() !== 'right-square') {
						throw new LambdaSyntaxError();
					}
					lexer.next();
					node = new SubscriptNode(node, index);
					break;
				default:
					return node;
				}
			}
		}
	}

	function parseLambdaPartial(terminators) {
		if (lexer.token() !== 'identifier') {
			throw new LambdaSyntaxError();
		} else {
			var name = lexer.label();
			switch (lexer.next()) {
			case 'comma':
				lexer.next();
				return new LambdaNode(name, parseLambdaPartial(terminators));
			case 'arrow':
				lexer.next();
				return new LambdaNode(name, parseClass3(terminators));
			default:
				throw new LambdaSyntaxError();
			}
		}
	}

	function parseLet(terminators) {
		if (lexer.next() !== 'identifier') {
			throw new LambdaSyntaxError();
		} else {
			var names = [lexer.label()];
			while (lexer.next() === 'point') {
				var token = lexer.next();
				if (token !== 'identifier' && !token.match(/^keyword\:/)) {
					throw new LambdaSyntaxError();
				} else {
					names.push(lexer.label());
				}
			}
			if (lexer.token() !== 'equal') {
				throw new LambdaSyntaxError();
			} else {
				lexer.next();
				var expression = parseClass3({
					'comma': true,
					'keyword:in': true
				});
				switch (lexer.token()) {
				case 'comma':
					return new LetNode(names, expression, parseLet(terminators));
				case 'keyword:in':
					lexer.next();
					return new LetNode(names, expression, parseClass3(terminators));
				default:
					throw new LambdaSyntaxError();
				}
			}
		}
	}

	function parseIf(terminators) {
		lexer.next();
		var condition = parseClass3({
			'keyword:then': true
		});
		if (lexer.token() !== 'keyword:then') {
			throw new LambdaSyntaxError();
		} else {
			lexer.next();
			var thenExpression = parseClass3({
				'keyword:else': true
			});
			if (lexer.token() !== 'keyword:else') {
				throw new LambdaSyntaxError();
			} else {
				lexer.next();
				return new IfNode(condition, thenExpression, parseClass3(terminators));
			}
		}
	}

	function parseThrow(terminators) {
		lexer.next();
		return new ThrowNode(parseClass3(terminators));
	}

	function addTerminator(terminators, terminator, callback) {
		if (terminators.hasOwnProperty(terminator)) {
			return callback(terminators);
		} else {
			terminators[terminator] = true;
			try {
				return callback(terminators);
			} finally {
				delete terminators[terminator];
			}
		}
	}

	function parseTry(terminators) {
		lexer.next();
		var tryExpression = parseClass3({
			'keyword:catch': true,
			'keyword:finally': true
		});
		switch (lexer.token()) {
		case 'keyword:catch':
			lexer.next();
			var catchExpression = addTerminator(terminators, 'keyword:finally', parseClass3);
			if (lexer.token() === 'keyword:finally') {
				lexer.next();
				return new TryCatchFinallyNode(tryExpression, catchExpression, parseClass3(terminators));
			} else if (terminators.hasOwnProperty(lexer.token())) {
				return new TryCatchNode(tryExpression, catchExpression);
			}
			throw new LambdaSyntaxError();
		case 'keyword:finally':
			lexer.next();
			return new TryFinallyNode(tryExpression, parseClass3(terminators));
		default:
			throw new LambdaSyntaxError();
		}
	}

	function parseClass2(terminators) {
		switch (lexer.token()) {
		case 'identifier':
			return parseLambdaOrVariable(terminators);
		case 'keyword:let':
			return parseLet(terminators);
		case 'keyword:if':
			return parseIf(terminators);
		case 'keyword:throw':
			return parseThrow(terminators);
		case 'keyword:try':
			return parseTry(terminators);
		default:
			return parseClass1(terminators);
		}
	}

	function parseClass3(terminators) {
		var node = parseClass2(terminators);
		while (!terminators.hasOwnProperty(lexer.token())) {
			node = new ApplicationNode(node, parseClass2(terminators));
		}
		return node;
	}

	this.parse = function () {
		return parseClass3({
			'end': true
		});
	};
};
