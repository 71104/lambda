var Parser = exports.Parser = function (input) {
	var lexer = new Lexer(input);

	function parseBasicType() {
		var type = (function () {
			switch (lexer.getCurrent()) {
			case 'keyword:null':
				return NullType.INSTANCE;
			case 'keyword:undefined':
				return UndefinedType.INSTANCE;
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
			case 'identifier':
				return new VariableType(lexer.getLabel());
			case 'left':
				lexer.next();
				var type = parseType();
				if (lexer.getCurrent() !== 'right') {
					throw new MySyntaxError();
				}
				return type;
			default:
				throw new MySyntaxError();
			}
		}());
		lexer.next();
		return type;
	}

	function parseArrayType() {
		var type = parseBasicType();
		while (lexer.getCurrent() === 'asterisk') {
			type = new ArrayType(type);
			lexer.next();
		}
		return type;
	}

	function parseType() {
		var left = parseArrayType();
		if (lexer.getCurrent() !== 'fat-arrow') {
			return left;
		} else {
			lexer.next();
			return new LambdaType(left, parseType());
		}
	}

	function parseClass0() {
		var node = (function () {
			switch (lexer.getCurrent()) {
			case 'keyword:null':
				return new LiteralNode(NullType.INSTANCE, NullValue.INSTANCE);
			case 'keyword:undefined':
				return new LiteralNode(UndefinedType.INSTANCE, UndefinedValue.INSTANCE);
			case 'keyword:true':
				return new LiteralNode(BooleanType.INSTANCE, new BooleanValue(true));
			case 'keyword:false':
				return new LiteralNode(BooleanType.INSTANCE, new BooleanValue(false));
			case 'integer':
				return new LiteralNode(IntegerType.INSTANCE, new IntegerValue(lexer.getLabel()));
			case 'float':
				return new LiteralNode(FloatType.INSTANCE, new FloatValue(lexer.getLabel()));
			case 'string':
				return new LiteralNode(StringType.INSTANCE, new StringValue(lexer.getLabel()));
			case 'identifier':
			case 'keyword:not':
			case 'keyword:and':
			case 'keyword:or':
			case 'keyword:xor':
			case 'symbol':
			case 'equal':
			case 'asterisk':
				return new VariableNode(lexer.getLabel());
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
				if (lexer.getCurrent() !== 'right') {
					throw new MySyntaxError();
				}
				return node;
			default:
				throw new MySyntaxError();
			}
		}());
		lexer.next();
		return node;
	}

	function parseClass1() {
		var node = parseClass0();
		while (true) {
			switch (lexer.getCurrent()) {
			case 'point':
				if (lexer.next() !== 'identifier') {
					throw new MySyntaxError();
				}
				node = new FieldAccessNode(node, lexer.getLabel());
				lexer.next();
				break;
			case 'left-square':
				lexer.next();
				var index = parseClass3({
					'right-square': true
				});
				if (lexer.getCurrent() !== 'right-square') {
					throw new MySyntaxError();
				}
				lexer.next();
				node = new SubscriptNode(node, index);
				break;
			default:
				return node;
			}
		}
	}

	function parseClass2(terminators) {
		var node = parseClass1();
		while (!terminators.hasOwnProperty(lexer.getCurrent())) {
			node = new ApplicationNode(node, parseClass1());
		}
		return node;
	}

	function parseClass3(terminators) {
		switch (lexer.getCurrent()) {
		case 'identifier':
			return parseLambda(terminators);
		case 'keyword:let':
			return parseLet(terminators);
		case 'keyword:if':
			return parseIf(terminators);
		case 'keyword:throw':
			return parseThrow(terminators);
		case 'keyword:try':
			return parseTry(terminators);
		default:
			return parseClass2(terminators);
		}
	}

	function parseLambda(terminators) {
		var name = lexer.getLabel();
		switch (lexer.next()) {
		case 'colon':
			lexer.next();
			var type = parseType();
			switch (lexer.getCurrent()) {
			case 'comma':
				lexer.next();
				return new LambdaNode(name, type, parseLambdaPartial(terminators));
			case 'arrow':
				lexer.next();
				return new LambdaNode(name, type, parseClass3(terminators));
			default:
				throw new MySyntaxError();
			}
			break;
		case 'comma':
			lexer.next();
			return new LambdaNode(name, null, parseLambdaPartial(terminators));
		case 'arrow':
			lexer.next();
			return new LambdaNode(name, null, parseClass3(terminators));
		default:
			var node = new VariableNode(name);
			while (!terminators.hasOwnProperty(lexer.getCurrent())) {
				node = new ApplicationNode(node, parseClass1());
			}
			return node;
		}
	}

	function parseLambdaPartial(terminators) {
		if (lexer.getCurrent() !== 'identifier') {
			throw new MySyntaxError();
		} else {
			var name = lexer.getLabel();
			switch (lexer.next()) {
			case 'colon':
				lexer.next();
				var type = parseType();
				switch (lexer.getCurrent()) {
				case 'comma':
					lexer.next();
					return new LambdaNode(name, type, parseLambdaPartial(terminators));
				case 'arrow':
					lexer.next();
					return new LambdaNode(name, type, parseClass3(terminators));
				default:
					throw new MySyntaxError();
				}
				break;
			case 'comma':
				lexer.next();
				return new LambdaNode(name, null, parseLambdaPartial(terminators));
			case 'arrow':
				lexer.next();
				return new LambdaNode(name, null, parseClass3(terminators));
			default:
				throw new MySyntaxError();
			}
		}
	}

	function parseLet(terminators) {
		if (lexer.next() !== 'identifier') {
			throw new MySyntaxError();
		} else {
			var names = [lexer.getLabel()];
			while (lexer.next() === 'point') {
				if (lexer.next() !== 'identifier') {
					throw new MySyntaxError();
				} else {
					names.push(lexer.getLabel());
				}
			}
			if (lexer.getCurrent() !== 'equal') {
				throw new MySyntaxError();
			} else {
				lexer.next();
				var expression = parseClass3({
					'comma': true,
					'keyword:in': true
				});
				switch (lexer.getCurrent()) {
				case 'comma':
					return new LetNode(names, expression, parseLet(terminators));
				case 'keyword:in':
					lexer.next();
					return new LetNode(names, expression, parseClass3(terminators));
				default:
					throw new MySyntaxError();
				}
			}
		}
	}

	function parseIf(terminators) {
		lexer.next();
		var condition = parseClass3({
			'keyword:then': true
		});
		if (lexer.getCurrent() !== 'keyword:then') {
			throw new MySyntaxError();
		} else {
			lexer.next();
			var thenExpression = parseClass3({
				'keyword:else': true
			});
			if (lexer.getCurrent() !== 'keyword:else') {
				throw new MySyntaxError();
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
			callback(terminators);
		} else {
			terminators[terminator] = true;
			try {
				callback(terminators);
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
		switch (lexer.getCurrent()) {
		case 'keyword:catch':
			lexer.next();
			var catchExpression = addTerminator(terminators, 'keyword:catch', parseClass3);
			if (lexer.getCurrent() === 'keyword:finally') {
				return new TryCatchFinallyNode(tryExpression, catchExpression, parseClass3(terminators));
			} else if (terminators.hasOwnProperty(lexer.getCurrent())) {
				return new TryCatchNode(tryExpression, catchExpression);
			}
			throw new MySyntaxError();
		case 'keyword:finally':
			lexer.next();
			return new TryFinallyNode(tryExpression, parseClass3(terminators));
		default:
			throw new MySyntaxError();
		}
	}

	this.parse = function () {
		return parseClass3({
			'end': true
		});
	};
};
