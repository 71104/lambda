var Lambda = require('./lambda.js');

if (process.argv.length > 2) {
	var fs = require('fs');
	var input = fs.readFileSync(process.argv[2], 'ascii');
	try {
		var ast = (new Lambda.Parser(input)).parse();
		ast.getType(new Lambda.DefaultContext());
		fs.writeFileSync(process.argv[2].replace(/(\.[A-Za-z0-9_-]*)?$/, '.js'), ast.compileStatement(), 'ascii');
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
				var value = ast.evaluate(new Lambda.DefaultContext());
				callback(value + ': ' + type);
			} catch (e) {
				callback(e);
			}
		}
	});
}
