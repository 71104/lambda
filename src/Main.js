#!/usr/bin/env node

var compile = false;

for (var i = 2; i < process.argv.length; i++) {
	var arg = process.argv[i];
	if (arg.substr(0, 1) !== '-') {
		process.exit(1);
	}
	if (arg.indexOf('c') > 0) {
		compile = true;
	}
}

var lambda = (function () {
	var Lambda = require('./lambda.js');
	if (compile) {
		return function (input) {
			return (new Lambda.Parser(input)).parse().compile();
		};
	} else {
		var context = Lambda.DefaultContext.INSTANCE.add('require', Lambda.AbstractValue.unmarshal(require));
		return function (input) {
			return (new Lambda.Parser(input)).parse().evaluate(context);
		};
	}
}());

if (process.stdin.isTTY) {
	require('repl').start({
		eval: function (input, context, fileName, callback) {
			try {
				callback(lambda(input).toString());
			} catch (e) {
				callback(e);
			}
		}
	});
} else {
	process.stdin.setEncoding('ascii');

	var input = '';

	process.stdin.on('data', function (text) {
		input += text;
	}).on('end', function () {
		try {
			process.stdout.write(lambda(input).toString() + '\n');
		} catch (e) {
			process.stderr.write(e.toString() + '\n');
		}
	});
}
