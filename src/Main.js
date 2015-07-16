#!/usr/bin/env node

var lambda = (function () {
	var Lambda = require('./lambda.js');
	var context = new Lambda.DefaultContext();
	return function (input) {
		return (new Lambda.Parser(input)).parse().evaluate(context);
	};
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
			process.stdout.write(lambda(input).toString());
		} catch (e) {
			process.stderr.write(e.toString());
		}
	});
}
