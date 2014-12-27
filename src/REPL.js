var Lambda = require('./lambda.js');

require('repl').start({
	eval: function (input, context, fileName, callback) {
		try {
			var ast = (new Lambda.Parser(input)).parse();
			var value = ast.evaluate(new Lambda.DefaultContext());
			callback(value.toString());
		} catch (e) {
			callback(e);
		}
	}
});
