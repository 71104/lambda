function Parser(input) {
	var lexer = new Lexer(input);

	function parseApplication(terminator) {
		var node = parseStatement();
		while (lexer.getCurrent() !== terminator) {
			node = new ApplicationNode(node, parseStatement());
		}
		return node;
	}

	function parseStatement() {
		// TODO
	}

	this.parse = function () {
		return parseApplication('end');
	};
}
