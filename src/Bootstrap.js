BooleanValue.prototype.context = ObjectValue.prototype.context.addAll({
  str: LazyValue.unmarshal(function () {
    if (this.valueOf()) {
      return 'true';
    } else {
      return 'false';
    }
  })
});

IntegerValue.prototype.context = ObjectValue.prototype.context.addAll({
  str: LazyValue.unmarshal(function () {
    return '' + this;
  })
});

FloatValue.prototype.context = ObjectValue.prototype.context.addAll({
  str: LazyValue.unmarshal(function () {
    return '' + this;
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

Closure.prototype.context = ObjectValue.prototype.context.addAll({
  apply: Closure.unmarshal(function (parameters) {
    return this.apply(null, parameters);
  })
});

ThisNode.INSTANCE = new ThisNode();

ErrorNode.INSTANCE = new ErrorNode();

FixNode.Z_COMBINATOR = (new LambdaNode('f', new ApplicationNode(
  new LambdaNode('x', new ApplicationNode(
    new VariableNode('f'),
    new LambdaNode('v', new ApplicationNode(
      new ApplicationNode(
        new VariableNode('x'),
        new VariableNode('x')
      ),
      new VariableNode('v')
    ))
  )),
  new LambdaNode('x', new ApplicationNode(
    new VariableNode('f'),
    new LambdaNode('v', new ApplicationNode(
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
