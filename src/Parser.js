function Parser(input) {
  this.lexer = new Lexer(input);
}

exports.Parser = Parser;

Parser.prototype.parseInteger = function () {
  return new LiteralNode(new NaturalValue(this.lexer.expect('integer')), NaturalType.DEFAULT);
};

Parser.prototype.parseComplex = function () {
  return new LiteralNode(new ComplexValue(0, this.lexer.expect('complex')), ComplexType.DEFAULT);
};

Parser.prototype.parseReal = function () {
  return new LiteralNode(new RealValue(this.lexer.expect('real')), RealType.DEFAULT);
};

Parser.prototype.parseString = function () {
  return new LiteralNode(new StringValue(this.lexer.expect('string')), StringType.DEFAULT);
};

Parser.prototype.parseVariable = function () {
  var label = this.lexer.label();
  this.lexer.next();
  return new VariableNode(label);
};

Parser.prototype.parseClass0 = function () {
  switch (this.lexer.token()) {
  case 'keyword:undefined':
    this.lexer.next();
    return new LiteralNode(UndefinedValue.DEFAULT, UndefinedType.DEFAULT);
  case 'keyword:true':
    this.lexer.next();
    return new LiteralNode(BooleanValue.TRUE, BooleanType.DEFAULT);
  case 'keyword:false':
    this.lexer.next();
    return new LiteralNode(BooleanValue.FALSE, BooleanType.DEFAULT);
  case 'integer':
    return this.parseInteger();
  case 'complex':
    return this.parseComplex();
  case 'real':
    return this.parseReal();
  case 'string':
    return this.parseString();
  case 'identifier':
  case 'keyword:typeof':
  case 'symbol':
    return this.parseVariable();
  case 'keyword:fix':
    this.lexer.next();
    return FixNode.INSTANCE;
  case 'keyword:error':
    this.lexer.next();
    return ErrorNode.INSTANCE;
  case 'left':
    this.lexer.next();
    var node = this.parseRoot(['right']);
    this.lexer.next();
    return node;
  case 'left-curly':
    this.lexer.next();
    var expressions = [];
    while (this.lexer.token() !== 'right-curly') {
      expressions.push(this.parseRoot(['comma', 'right-curly']));
      if ('comma' === this.lexer.token()) {
        this.lexer.next();
      }
    }
    this.lexer.next();
    return new ListLiteralNode(expressions);
  default:
    throw new LambdaSyntaxError();
  }
};

Parser.prototype.parseSubscriptOrFieldAccess = function (node) {
  while (true) {
    switch (this.lexer.token()) {
    case 'point':
      var token = this.lexer.next();
      if (token !== 'identifier' && !token.match(/^keyword\:/)) {
        throw new LambdaSyntaxError();
      }
      node = new FieldAccessNode(node, this.lexer.expect(token));
      break;
    case 'left-square':
      this.lexer.next();
      var index = this.parseRoot(['right-square']);
      this.lexer.next();
      node = new SubscriptNode(node, index);
      break;
    default:
      return node;
    }
  }
};

Parser.prototype.parseClass1 = function () {
  return this.parseSubscriptOrFieldAccess(this.parseClass0());
};

Parser.prototype.parseTypeClass0 = function () {
  var token = this.lexer.token();
  this.lexer.next();
  switch (token) {
  case 'keyword:undefined':
    return UndefinedType.DEFAULT;
  case 'keyword:bool':
    return BooleanType.DEFAULT;
  case 'keyword:complex':
    return ComplexType.DEFAULT;
  case 'keyword:real':
    return RealType.DEFAULT;
  case 'keyword:integer':
    return IntegerType.DEFAULT;
  case 'keyword:natural':
    return NaturalType.DEFAULT;
  case 'keyword:string':
    return StringType.DEFAULT;
  case 'keyword:unknown':
    return UnknownType.DEFAULT;
  case 'left':
    var type = this.parseTypeClass2();
    this.lexer.expect('right');
    return type;
  default:
    throw new LambdaSyntaxError();
  }
};

Parser.prototype.parseTypeClass1 = function () {
  var type = this.parseTypeClass0();
  while (true) {
    var token = this.lexer.token();
    if ('asterisk' === token) {
      type = new ListType(type);
    } else if ('power' === token) {
      type = new ListType(new ListType(type));
    } else {
      return type;
    }
    this.lexer.next();
  }
};

Parser.prototype.parseTypeClass2 = function () {
  var left = this.parseTypeClass1();
  if (this.lexer.token() !== 'fat-arrow') {
    return left;
  } else {
    this.lexer.next();
    return new LambdaType(left, this.parseTypeClass2());
  }
};

Parser.prototype.parseType = function () {
  return this.parseTypeClass2();
};

Parser.prototype.parseLambdaPartial = function (terminators) {
  var name = this.lexer.expect('identifier');
  var type = function () {
    if (this.lexer.token() !== 'colon') {
      return null;
    } else {
      this.lexer.next();
      return this.parseType(['comma', 'arrow']);
    }
  }.call(this);
  switch (this.lexer.token()) {
  case 'comma':
    this.lexer.next();
    return new LambdaNode(name, type, this.parseLambdaPartial(terminators));
  case 'arrow':
    this.lexer.next();
    return new LambdaNode(name, type, this.parseRoot(terminators));
  default:
    throw new LambdaSyntaxError();
  }
};

Parser.prototype.parseLambda = function (terminators) {
  this.lexer.expect('keyword:fn');
  return this.parseLambdaPartial(terminators);
};

Parser.prototype.parseLetPartial = function (terminators) {
  var names = [this.lexer.expect('identifier')];
  while ('point' === this.lexer.token()) {
    var token = this.lexer.next();
    if (token !== 'identifier' && !token.match(/^keyword\:/)) {
      throw new LambdaSyntaxError();
    } else {
      names.push(this.lexer.expect(token));
    }
  }
  this.lexer.expect('equal');
  var expression = this.parseRoot(['comma', 'keyword:in']);
  switch (this.lexer.token()) {
  case 'comma':
    this.lexer.next();
    return new LetNode(names, expression, this.parseLetPartial(terminators));
  case 'keyword:in':
    this.lexer.next();
    return new LetNode(names, expression, this.parseRoot(terminators));
  default:
    throw new LambdaSyntaxError();
  }
};

Parser.prototype.parseLet = function (terminators) {
  this.lexer.expect('keyword:let');
  return this.parseLetPartial(terminators);
};

Parser.prototype.parseIf = function (terminators) {
  this.lexer.expect('keyword:if');
  var condition = this.parseRoot(['keyword:then']);
  this.lexer.next();
  var thenExpression = this.parseRoot(['keyword:else']);
  this.lexer.next();
  return new IfNode(condition, thenExpression, this.parseRoot(terminators));
};

Parser.prototype.parseThrow = function (terminators) {
  this.lexer.expect('keyword:throw');
  return new ThrowNode(this.parseRoot(terminators));
};

Parser.prototype.parseTry = function (terminators) {
  this.lexer.expect('keyword:try');
  var tryExpression = this.parseRoot(['keyword:catch', 'keyword:finally']);
  switch (this.lexer.token()) {
  case 'keyword:catch':
    this.lexer.next();
    var catchExpression = this.parseRoot(terminators.union('keyword:finally'));
    if ('keyword:finally' === this.lexer.token()) {
      this.lexer.next();
      return new TryCatchFinallyNode(tryExpression, catchExpression, this.parseRoot(terminators));
    } else if (terminators.contains(this.lexer.token())) {
      return new TryCatchNode(tryExpression, catchExpression);
    }
    throw new LambdaSyntaxError();
  case 'keyword:finally':
    this.lexer.next();
    return new TryFinallyNode(tryExpression, this.parseRoot(terminators));
  default:
    throw new LambdaSyntaxError();
  }
};

Parser.prototype.parseClass2 = function (terminators) {
  switch (this.lexer.token()) {
  case 'keyword:fn':
    return this.parseLambda(terminators);
  case 'keyword:let':
    return this.parseLet(terminators);
  case 'keyword:if':
    return this.parseIf(terminators);
  case 'keyword:throw':
    return this.parseThrow(terminators);
  case 'keyword:try':
    return this.parseTry(terminators);
  default:
    return this.parseClass1(terminators);
  }
};

Parser.prototype.parseClass3 = function (terminators) {
  var node = this.parseClass2(terminators);
  while (!terminators.contains(this.lexer.token())) {
    node = new ApplicationNode(node, this.parseClass2(terminators));
  }
  return node;
};

Parser.prototype.parseInfixPower = function (terminators) {
  var left = this.parseClass3(terminators.union('power'));
  if ('power' !== this.lexer.token()) {
    return left;
  } else {
    var partial = new ApplicationNode(new VariableNode('**'), left);
    if (terminators.contains(this.lexer.next())) {
      return partial;
    } else {
      return new ApplicationNode(partial, this.parseClass4(terminators));
    }
  }
};

Parser.prototype.parsePrefixPower = function (terminators) {
  if (terminators.contains(this.lexer.next())) {
    return new VariableNode('**');
  } else {
    var right = this.parseClass3(terminators.union('power'));
    if (terminators.contains(this.lexer.token())) {
      var partial = new ApplicationNode(new VariableNode('**'), new VariableNode('0'));
      return new LambdaNode('0', null, new ApplicationNode(partial, right));
    } else {
      throw new LambdaSyntaxError();
    }
  }
};

Parser.prototype.parseClass4 = function (terminators) {
  if ('power' !== this.lexer.token()) {
    return this.parseInfixPower(terminators.difference('power'));
  } else {
    return this.parsePrefixPower(terminators.difference('power'));
  }
};

Parser.prototype.parseInfixProduct = function (terminators) {
  var node = this.parseClass4(terminators.union('asterisk', 'divide', 'modulus'));
  while (!terminators.contains(this.lexer.token())) {
    var partial = new ApplicationNode(new VariableNode(this.lexer.expect('asterisk', 'divide', 'modulus')), node);
    if (terminators.contains(this.lexer.token())) {
      return partial;
    } else {
      node = new ApplicationNode(partial, this.parseClass4(terminators.union('asterisk', 'divide', 'modulus')));
    }
  }
  return node;
};

Parser.prototype.parsePrefixProduct = function (terminators) {
  var label = this.lexer.label();
  if (terminators.contains(this.lexer.next())) {
    return new VariableNode(label);
  } else {
    var right = this.parseClass4(terminators.union('asterisk', 'divide', 'modulus'));
    if (terminators.contains(this.lexer.token())) {
      var partial = new ApplicationNode(new VariableNode(label), new VariableNode('0'));
      return new LambdaNode('0', null, new ApplicationNode(partial, right));
    } else {
      throw new LambdaSyntaxError();
    }
  }
};

Parser.prototype.parseClass5 = function (terminators) {
  switch (this.lexer.token()) {
  case 'asterisk':
  case 'divide':
  case 'modulus':
    return this.parsePrefixProduct(terminators.difference('asterisk', 'divide', 'modulus'));
  default:
    return this.parseInfixProduct(terminators.difference('asterisk', 'divide', 'modulus'));
  }
};

Parser.prototype.parseInfixSum = function (terminators) {
  var node = this.parseClass5(terminators.union('plus', 'minus'));
  while (!terminators.contains(this.lexer.token())) {
    var partial = new ApplicationNode(new VariableNode(this.lexer.expect('plus', 'minus')), node);
    if (terminators.contains(this.lexer.token())) {
      return partial;
    } else {
      node = new ApplicationNode(partial, this.parseClass5(terminators.union('plus', 'minus')));
    }
  }
  return node;
};

Parser.prototype.parsePrefixSum = function (terminators) {
  var label = this.lexer.label();
  if (terminators.contains(this.lexer.next())) {
    return new VariableNode(label);
  } else {
    var right = this.parseClass5(terminators.union('plus', 'minus'));
    if (terminators.contains(this.lexer.token())) {
      var partial = new ApplicationNode(new VariableNode(label), new VariableNode('0'));
      return new LambdaNode('0', null, new ApplicationNode(partial, right));
    } else {
      throw new LambdaSyntaxError();
    }
  }
};

Parser.prototype.parseClass6 = function (terminators) {
  switch (this.lexer.token()) {
  case 'plus':
  case 'minus':
    return this.parsePrefixSum(terminators.difference('plus', 'minus'));
  default:
    return this.parseInfixSum(terminators.difference('plus', 'minus'));
  }
};

Parser.prototype.parseClass7 = function (terminators) {
  if ('keyword:not' !== this.lexer.token()) {
    return this.parseClass6(terminators);
  } else {
    this.lexer.next();
    return new ApplicationNode(new VariableNode('not'), this.parseClass7(terminators));
  }
};

Parser.prototype.parseInfixAnd = function (terminators) {
  var node = this.parseClass7(terminators.union('keyword:and'));
  while (!terminators.contains(this.lexer.token())) {
    var partial = new ApplicationNode(new VariableNode(this.lexer.expect('keyword:and')), node);
    if (terminators.contains(this.lexer.token())) {
      return partial;
    } else {
      node = new ApplicationNode(partial, this.parseClass7(terminators.union('keyword:and')));
    }
  }
  return node;
};

Parser.prototype.parsePrefixAnd = function (terminators) {
  var label = this.lexer.label();
  if (terminators.contains(this.lexer.next())) {
    return new VariableNode(label);
  } else {
    var right = this.parseClass7(terminators.union('keyword:and'));
    if (terminators.contains(this.lexer.token())) {
      var partial = new ApplicationNode(new VariableNode(label), new VariableNode('0'));
      return new LambdaNode('0', null, new ApplicationNode(partial, right));
    } else {
      throw new LambdaSyntaxError();
    }
  }
};

Parser.prototype.parseClass8 = function (terminators) {
  if ('keyword:and' !== this.lexer.token()) {
    return this.parseInfixAnd(terminators.difference('keyword:and'));
  } else {
    return this.parsePrefixAnd(terminators.difference('keyword:and'));
  }
};

Parser.prototype.parseInfixOr = function (terminators) {
  var node = this.parseClass8(terminators.union('keyword:or', 'keyword:xor'));
  while (!terminators.contains(this.lexer.token())) {
    var partial = new ApplicationNode(new VariableNode(this.lexer.expect('keyword:or', 'keyword:xor')), node);
    if (terminators.contains(this.lexer.token())) {
      return partial;
    } else {
      node = new ApplicationNode(partial, this.parseClass8(terminators.union('keyword:or', 'keyword:xor')));
    }
  }
  return node;
};

Parser.prototype.parsePrefixOr = function (terminators) {
  var label = this.lexer.label();
  if (terminators.contains(this.lexer.next())) {
    return new VariableNode(label);
  } else {
    var right = this.parseClass8(terminators.union('keyword:or', 'keyword:xor'));
    if (terminators.contains(this.lexer.token())) {
      var partial = new ApplicationNode(new VariableNode(label), new VariableNode('0'));
      return new LambdaNode('0', null, new ApplicationNode(partial, right));
    } else {
      throw new LambdaSyntaxError();
    }
  }
};

Parser.prototype.parseClass9 = function (terminators) {
  switch (this.lexer.token()) {
  case 'keyword:or':
  case 'keyword:xor':
    return this.parsePrefixOr(terminators.difference('keyword:or', 'keyword:xor'));
  default:
    return this.parseInfixOr(terminators.difference('keyword:or', 'keyword:xor'));
  }
};

Parser.prototype.parseRoot = function (terminators) {
  return this.parseClass9(terminators);
};

Parser.prototype.parse = function () {
  return this.parseRoot(['end']);
};
