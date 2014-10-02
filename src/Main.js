var Lambda = require('./lambda.min.js');

if (process.argv.length > 2) {
	var fs = require('fs');
	var input = fs.readFileSync(process.argv[2], 'ascii');
	try {
		var ast = (new Lambda.Parser(input)).parse();
		console.log(ast.getType(new Lambda.Context()).toString());
	} catch (e) {
		console.error(e.message);
		console.error(e.stack);
	}
} else {
	require('repl').start({
		eval: function (input, context, fileName, callback) {
			try {
				var ast = (new Lambda.Parser(input)).parse();
				var type = ast.getType(new Lambda.Context());
				var value = ast.evaluate(new Lambda.Context());
				callback(value + ': ' + type);
			} catch (e) {
				callback(e);
			}
		}
	});
}
