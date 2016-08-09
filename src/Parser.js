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
    return new LiteralNode(UndefinedValue.INSTANCE, UndefinedType.DEFAULT);
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
  case 'keyword:not':
  case 'keyword:and':
  case 'keyword:or':
  case 'keyword:xor':
  case 'symbol':
  case 'equal':
  case 'asterisk':
    return this.parseVariable();
  case 'keyword:fix':
    this.lexer.next();
    return FixNode.INSTANCE;
  case 'keyword:error':
    this.lexer.next();
    return ErrorNode.INSTANCE;
  case 'left':
    this.lexer.next();
    var node = this.parseClass3(['right']);
    this.lexer.next();
    return node;
  case 'left-curly':
    this.lexer.next();
    var expressions = [];
    while (this.lexer.token() !== 'right-curly') {
      expressions.push(this.parseClass3(['comma', 'right-curly']));
      if (this.lexer.token() === 'comma') {
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
      var index = this.parseClass3(['right-square']);
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
    var label = this.lexer.label();
    if (token === 'asterisk') {
      type = new ListType(type);
    } else if (token === 'symbol' && label === '**') {
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
    return new LambdaNode(name, type, this.parseClass3(terminators));
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
  while (this.lexer.token() === 'point') {
    var token = this.lexer.next();
    if (token !== 'identifier' && !token.match(/^keyword\:/)) {
      throw new LambdaSyntaxError();
    } else {
      names.push(this.lexer.expect(token));
    }
  }
  this.lexer.expect('equal');
  var expression = this.parseClass3(['comma', 'keyword:in']);
  switch (this.lexer.token()) {
  case 'comma':
    this.lexer.next();
    return new LetNode(names, expression, this.parseLetPartial(terminators));
  case 'keyword:in':
    this.lexer.next();
    return new LetNode(names, expression, this.parseClass3(terminators));
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
  var condition = this.parseClass3(['keyword:then']);
  this.lexer.next();
  var thenExpression = this.parseClass3(['keyword:else']);
  this.lexer.next();
  return new IfNode(condition, thenExpression, this.parseClass3(terminators));
};

Parser.prototype.parseThrow = function (terminators) {
  this.lexer.expect('keyword:throw');
  return new ThrowNode(this.parseClass3(terminators));
};

Parser.prototype.parseTry = function (terminators) {
  this.lexer.expect('keyword:try');
  var tryExpression = this.parseClass3(['keyword:catch', 'keyword:finally']);
  switch (this.lexer.token()) {
  case 'keyword:catch':
    this.lexer.next();
    var catchExpression = this.parseClass3(terminators.union(['keyword:finally']));
    if (this.lexer.token() === 'keyword:finally') {
      this.lexer.next();
      return new TryCatchFinallyNode(tryExpression, catchExpression, this.parseClass3(terminators));
    } else if (terminators.contains(this.lexer.token())) {
      return new TryCatchNode(tryExpression, catchExpression);
    }
    throw new LambdaSyntaxError();
  case 'keyword:finally':
    this.lexer.next();
    return new TryFinallyNode(tryExpression, this.parseClass3(terminators));
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

Parser.prototype.parse = function () {
  return this.parseClass3(['end']);
};
