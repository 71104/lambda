#!/usr/bin/env node

var compile = false;
var nodejs = false;

for (var i = 2; i < process.argv.length; i++) {
  var arg = process.argv[i];
  if (arg.substr(0, 1) !== '-') {
    process.exit(1);
  }
  if (arg.indexOf('c') >= 0) {
    compile = true;
  }
  if (arg.indexOf('n') >= 0) {
    nodejs = true;
  }
}

var lambda = (function () {
  var Lambda = require('./lambda.js');
  if (compile) {
    return function (input) {
      return Lambda.parse(input).compile();
    };
  } else {
    var context = Lambda.DefaultContext;
    if (nodejs) {
      context = Lambda.NodeJSContext;
    }
    return function (input) {
      var ast = Lambda.parse(input);
      // var type = ast.getType(context.TYPES);
      var value = ast.evaluate(context.VALUES);
      // return value.toString() + ': ' + type.toString();
      return value.toString();
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
