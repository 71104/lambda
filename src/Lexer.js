function Lexer(input) {
  var offset = 0;
  var line = 0;
  var column = 0;

  var token, label; // eslint-disable-line init-declarations

  function match(re) {
    var result = re.exec(input);
    if (result) {
      label = result[0];
      input = input.substr(label.length);
      offset += label.length;
      line += (label.match(/\n/g) || []).length;
      var i = label.lastIndexOf('\n');
      if (i < 0) {
        column += label.length;
      } else {
        column = label.length - 1 - i;
      }
      return true;
    } else {
      return false;
    }
  }

  var keywords = [
    'undefined',
    'true',
    'false',
    'not',
    'and',
    'or',
    'xor',
    'fix',
    'boolean',
    'unknown',
    'natural',
    'integer',
    'real',
    'complex',
    'string',
    'regex',
    'fn',
    'let',
    'in',
    'if',
    'then',
    'else',
    'throw',
    'try',
    'catch',
    'finally',
    'error',
    'throws'
  ];

  function next() {
    if (match(/^(\s|(#.*\n))+/)) {
      return next();
    } else if (match(/^[A-Za-z_\$][A-Za-z0-9_\$]*/)) {
      if (!keywords.contains(label)) {
        return token = 'identifier';
      } else {
        return token = 'keyword:' + label;
      }
    } else if (match(/^\-\>/)) {
      return token = 'arrow';
    } else if (match(/^\=\>/)) {
      return token = 'fat-arrow';
    } else if (match(/^\,/)) {
      return token = 'comma';
    } else if (match(/^\./)) {
      return token = 'point';
    } else if (match(/^\:/)) {
      return token = 'colon';
    } else if (match(/^\(/)) {
      return token = 'left';
    } else if (match(/^\)/)) {
      return token = 'right';
    } else if (match(/^\[/)) {
      return token = 'left-square';
    } else if (match(/^\]/)) {
      return token = 'right-square';
    } else if (match(/^\{/)) {
      return token = 'left-curly';
    } else if (match(/^\}/)) {
      return token = 'right-curly';
    } else if (match(/^(0|[1-9][0-9]*)(\.[0-9]+)?i\b/)) {
      label = parseFloat(label);
      return token = 'complex';
    } else if (match(/^(0|[1-9][0-9]*)\.[0-9]+\b/)) {
      label = parseFloat(label);
      return token = 'real';
    } else if (match(/^0[xX][0-9a-fA-F]+\b/)) {
      label = parseInt(label, 16);
      return token = 'integer';
    } else if (match(/^0[0-7]*\b/)) {
      label = parseInt(label, 8);
      return token = 'integer';
    } else if (match(/^(0|[1-9][0-9]*)\b/)) {
      label = parseInt(label, 10);
      return token = 'integer';
    } else if (match(/^\"([^"\\]|\\\\|\\["bfnrtv])*\"/)) {
      label = label
        .replace(/^\"|\"$/g, '')
        .replace(/\\\\/g, '\\')
        .replace(/\\\"/g, '\"')
        .replace(/\\b/g, '\b')
        .replace(/\\f/g, '\f')
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\v/g, '\v');
      return token = 'string';
    } else if (match(/^\'([^'\\]|\\\\|\\['bfnrtv])*\'/)) {
      label = label
        .replace(/^\'|\'$/g, '')
        .replace(/\\\\/g, '\\')
        .replace(/\\\'/g, '\'')
        .replace(/\\b/g, '\b')
        .replace(/\\f/g, '\f')
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\v/g, '\v');
      return token = 'string';
    } else if (match(/^(<<|>>|<\=|>\=)/)) {
      return token = 'symbol';
    } else if (match(/^\*\*/)) {
      return token = 'power';
    } else if (match(/^(<|>)/)) {
      return token = 'symbol';
    } else if (match(/^\*/)) {
      return token = 'asterisk';
    } else if (match(/^\//)) {
      return token = 'divide';
    } else if (match(/^\%/)) {
      return token = 'modulus';
    } else if (match(/^(\+|\-)/)) {
      return token = 'sum';
    } else if (match(/^\=/)) {
      return token = 'equal';
    } else if (match(/^\!\=/)) {
      return token = 'not-equal';
    } else if (/^$/.test(input)) {
      label = null;
      return token = 'end';
    } else {
      throw new LambdaSyntaxError();
    }
  }

  next();

  this.next = next;

  this.offset = function () {
    return offset;
  };

  this.coordinates = function () {
    return {
      offset: offset,
      line: line,
      column: column
    };
  };

  this.token = function () {
    return token;
  };

  this.end = function () {
    return 'end' === token;
  };

  this.label = function () {
    return label;
  };

  this.expect = function () {
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] === token) {
        var currentLabel = label;
        next();
        return currentLabel;
      }
    }
    throw new LambdaSyntaxError();
  };
}

exports.Lexer = Lexer;
