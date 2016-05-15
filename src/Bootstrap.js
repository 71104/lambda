IndexedType.prototype.context = new Context({
  length: NaturalType.INSTANCE
});

BooleanValue.prototype.context = ObjectValue.prototype.context.addAll({
  str: LazyValue.unmarshal(function () {
    if (this.valueOf()) {
      return 'true';
    } else {
      return 'false';
    }
  })
});

ComplexValue.prototype.context = ObjectValue.prototype.context.addAll({
  real: LazyValue.unmarshal(function () {
    return this.r;
  }),
  imaginary: LazyValue.unmarshal(function () {
    return this.i;
  }),
  str: LazyValue.unmarshal(function () {
    return this.toString();
  })
});

RealValue.prototype.context = ObjectValue.prototype.context.addAll({
  str: LazyValue.unmarshal(function () {
    return '' + this;
  })
});

IntegerValue.prototype.context = ObjectValue.prototype.context.addAll({
  str: LazyValue.unmarshal(function () {
    return '' + this;
  })
});

NaturalValue.prototype.context = ObjectValue.prototype.context.addAll({
  str: LazyValue.unmarshal(function () {
    return '' + this;
  })
});

Closure.prototype.context = ObjectValue.prototype.context.addAll({
  apply: Closure.unmarshal(function (parameters) {
    return this.apply(null, parameters);
  })
});

ThisNode.INSTANCE = new ThisNode();

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
