function Parser(input) {
	var lexer = new Lexer(input);

	function parseApplication(terminators) {
		var node = parseStatement(terminators);
		while (!terminators.hasOwnProperty(lexer.getCurrent())) {
			node = new ApplicationNode(node, parseStatement(terminators));
		}
		return node;
	}

	function parseStatement(terminators) {
		switch (lexer.getCurrent()) {
		case 'keyword:let':
			return parseLet(terminators);
		case 'keyword:if':
			return parseIf(terminators);
		case 'keyword:throw':
			return parseThrow(terminators);
		case 'keyword:try':
			return parseTry(terminators);
		default:
			return parseLambdaOrValue(terminators);
		}
	}

	function parseLet(terminators) {
		lexer.next();
		return parseLetPartial(terminators);
	}

	function parseLetPartial(terminators) {
		if (lexer.getCurrent() !== 'identifier') {
			throw new SyntaxError();
		} else {
			var names = [lexer.getLabel()];
			while (lexer.next() === 'point') {
				if (lexer.next() !== 'identifier') {
					throw new SyntaxError();
				} else {
					names.push(lexer.getLabel());
				}
			}
			if (lexer.getCurrent() !== 'equal') {
				throw new SyntaxError();
			} else {
				lexer.next();
				var expression = parseApplication({
					'comma': true,
					'keyword:in': true
				});
				switch (lexer.getCurrent()) {
				case 'comma':
					return new LetNode(names, expression, parseLetPartial(terminators));
				case 'keyword:in':
					return new LetNode(names, expression, parseApplication(terminators));
				default:
					throw new SyntaxError();
				}
			}
		}
	}

	function parseIf(terminators) {
		lexer.next();
		var condition = parseApplication({
			'keyword:then': true
		});
		if (lexer.getCurrent() !== 'keyword:then') {
			throw new SyntaxError();
		} else {
			lexer.next();
			var thenExpression = parseApplication({
				'keyword:else': true
			});
			if (lexer.getCurrent() !== 'keyword:else') {
				throw new SyntaxError();
			} else {
				lexer.next();
				var elseExpression = parseApplication(terminators);
				return new IfNode(condition, thenExpression, elseExpression);
			}
		}
	}

	function parseLambdaOrValue(terminators) {
		if (lexer.getCurrent() !== 'identifier') {
			return parseValue();
		} else {
			var name = lexer.getLabel();
			switch (lexer.next()) {
			case 'colon':
				lexer.next();
				var type = parseArrowType({
					'comma': true,
					'arrow': true
				});
				switch (lexer.getCurrent()) {
				case 'comma':
					lexer.next();
					return new LambdaNode(name, type, parseLambdaPartial(terminators));
				case 'arrow':
					lexer.next();
					return new LambdaNode(name, type, parseApplication(terminators));
				default:
					throw new SyntaxError();
				}
			case 'comma':
				lexer.next();
				return new LambdaNode(name, new VariableType(name), parseLambdaPartial(terminators));
			case 'arrow':
				lexer.next();
				return new LambdaNode(name, new VariableType(name), parseApplication(terminators));
			default:
				return new VariableNode(name);
			}
		}
	}

	function parseLambdaPartial(terminators) {
		if (lexer.getCurrent() !== 'identifier') {
			throw new SyntaxError();
		} else {
			var name = lexer.getLabel();
			switch (lexer.next()) {
			case 'colon':
				lexer.next();
				var type = parseArrowType({
					'comma': true,
					'arrow': true
				});
				switch (lexer.getCurrent()) {
				case 'comma':
					lexer.next();
					return new LambdaNode(name, type, parseLambdaPartial(terminators));
				case 'arrow':
					lexer.next();
					return new LambdaNode(name, type, parseApplication(terminators));
				default:
					throw new SyntaxError();
				}
			case 'comma':
				lexer.next();
				return new LambdaNode(name, new VariableType(name), parseLambdaPartial(terminators));
			case 'arrow':
				lexer.next();
				return new LambdaNode(name, new VariableType(name), parseApplication(terminators));
			default:
				throw new SyntaxError();
			}
		}
	}

	function parseArrowType(terminators) {
		var left = parseCompoundType();
		if (terminators.hasOwnProperty(lexer.getCurrent())) {
			return left;
		} else if (lexer.getCurrent() !== 'arrow') {
			throw new SyntaxError();
		} else {
			lexer.next();
			return new LambdaType(left, parseArrowType(terminators));
		}
	}

	function parseCompoundType() {
		return (function compound(type) {
			if (lexer.getCurrent() === 'asterisk') {
				lexer.next();
				return compound(new ArrayType(type));
			} else if (lexer.getCurrent() === 'questionmark') {
				lexer.next();
				return compound(new NullableType(type));
			} else {
				return type;
			}
		}(parsePrimitiveType()));
	}

	function parsePrimitiveType() {
		switch (lexer.getCurrent()) {
		case 'keyword:null':
			return NullType.INSTANCE;
		case 'keyword:void':
			return VoidType.INSTANCE;
		case 'keyword:unknown':
			return UnknownType.INSTANCE;
		case 'keyword:bool':
			return BooleanType.INSTANCE;
		case 'keyword:int':
			return IntegerType.INSTANCE;
		case 'keyword:float':
			return FloatType.INSTANCE;
		case 'keyword:string':
			return StringType.INSTANCE;
		case 'keyword:regex':
			return RegexType.INSTANCE;
		case 'left':
			lexer.next();
			var type = parseArrowType({
				'right': true
			});
			if (lexer.getCurrent() !== 'right') {
				throw new SyntaxError();
			}
			lexer.next();
			return type;
		default:
			throw new SyntaxError();
		}
	}

	function parseValue() {
		var node = (function () {
			switch (lexer.getCurrent()) {
			case 'symbol':
			case 'asterisk':
			case 'equal':
				return new VariableNode(lexer.getLabel());
			case 'keyword:fix':
				return FixNode.INSTANCE;
			case 'keyword:null':
				return new LiteralNode(BooleanType.INSTANCE, null);
			case 'keyword:undefined':
				return new LiteralNode(VoidType.INSTANCE);
			case 'keyword:true':
				return new LiteralNode(BooleanType.INSTANCE, true);
			case 'keyword:false':
				return new LiteralNode(BooleanType.INSTANCE, false);
			case 'integer':
				return new LiteralNode(IntegerType.INSTANCE, lexer.getLabel());
			case 'float':
				return new LiteralNode(FloatType.INSTANCE, lexer.getLabel());
			case 'string':
				return new LiteralNode(StringType.INSTANCE, lexer.getLabel());
			case 'left':
				lexer.next();
				var node = parseApplication({
					'right': true
				});
				if (lexer.getCurrent() !== 'right') {
					throw new SyntaxError();
				}
				lexer.next();
				return node;
			default:
				throw new SyntaxError();
			}
		}());
		lexer.next();
		return node;
	}

	this.parse = function () {
		return parseApplication({
			'end': true
		});
	};
}
