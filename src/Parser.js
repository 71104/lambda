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
			return parseLambda(terminators);
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
					throw new SyntaxError()
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

	this.parse = function () {
		return parseApplication({
			'end': true
		});
	};
}
