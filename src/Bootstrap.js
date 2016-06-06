IndexedType.prototype.context = IndexedType.prototype.context.addAll({
  length: NaturalType.INSTANCE
});

BooleanType.prototype.context = BooleanType.prototype.context.addAll({
  str: StringType.INSTANCE
});

BooleanValue.prototype.context = BooleanValue.prototype.context.addAll({
  str: Closure.unmarshal(function () {
    if (this.valueOf()) {
      return 'true';
    } else {
      return 'false';
    }
  })
});

ComplexType.prototype.context = ComplexType.prototype.context.addAll({
  real: RealType.INSTANCE,
  imaginary: RealType.INSTANCE,
  str: StringType.INSTANCE
});

ComplexValue.prototype.context = ComplexValue.prototype.context.addAll({
  real: Closure.unmarshal(function () {
    return this.r;
  }),
  imaginary: Closure.unmarshal(function () {
    return this.i;
  }),
  str: Closure.unmarshal(function () {
    return this.toString();
  })
});

RealType.prototype.context = RealType.prototype.context.addAll({
  str: StringType.INSTANCE
});

RealValue.prototype.context = RealValue.prototype.context.addAll({
  str: Closure.unmarshal(function () {
    return '' + this;
  })
});

IntegerType.prototype.context = IntegerType.prototype.context.addAll({
  str: StringType.INSTANCE
});

IntegerValue.prototype.context = IntegerValue.prototype.context.addAll({
  str: Closure.unmarshal(function () {
    return '' + this;
  })
});

NaturalType.prototype.context = NaturalType.prototype.context.addAll({
  str: StringType.INSTANCE
});

NaturalValue.prototype.context = NaturalValue.prototype.context.addAll({
  str: Closure.unmarshal(function () {
    return '' + this;
  })
});

Closure.prototype.context = Closure.prototype.context.addAll({
  apply: Closure.unmarshal(function (parameters) {
    return this.apply(null, parameters);
  })
});

ErrorNode.INSTANCE = new ErrorNode();

FixNode.TYPE = new ForEachType('T', new LambdaType(
  new LambdaType(
    new VariableType('T'),
    new VariableType('T')
  ),
  new VariableType('T')
));

FixNode.Z_COMBINATOR = (new LambdaNode('f', null, new ApplicationNode(
  new LambdaNode('x', null, new ApplicationNode(
    new VariableNode('f'),
    new LambdaNode('v', null, new ApplicationNode(
      new ApplicationNode(
        new VariableNode('x'),
        new VariableNode('x')
      ),
      new VariableNode('v')
    ))
  )),
  new LambdaNode('x', null, new ApplicationNode(
    new VariableNode('f'),
    new LambdaNode('v', null, new ApplicationNode(
      new ApplicationNode(
        new VariableNode('x'),
        new VariableNode('x')
      ),
      new VariableNode('v')
    ))
  ))
))).evaluate(Context.EMPTY);

FixNode.INSTANCE = new FixNode();

DefaultContext.INSTANCE = new DefaultContext();
