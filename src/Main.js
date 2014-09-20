if (process.argv.length > 2) {
	var fs = require('fs');
	var input = fs.readFileSync(process.argv[2], 'ascii');
	try {
		var ast = (new Parser(input)).parse();
		console.log(ast.getType(new Context()));
	} catch (e) {
		console.error(e.message);
		console.error(e.stack);
	}
} else {
	require('repl').start({
		eval: function (input, context, fileName, callback) {
			try {
				var ast = (new Parser(input)).parse();
				console.log(ast.getType(new Context()));
			} catch (e) {
				callback(e);
			}
		}
	});
}
