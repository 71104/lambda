Closure.prototype.prototype = new Context();

Closure.prototype.prototype = Closure.prototype.prototype.addAll({
    length: LazyValue.unmarshal(function() {
        return this.length;
    }),
    apply: Closure.unmarshal(function(parameters) {
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
