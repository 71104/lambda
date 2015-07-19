var FixNode = exports.FixNode = function () {
	AbstractNode.call(this);
};

FixNode.prototype = Object.create(AbstractNode.prototype);

FixNode.prototype.getFreeVariables = function () {
	return [];
};

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

FixNode.prototype.evaluate = function () {
	return FixNode.Z_COMBINATOR;
};

FixNode.prototype.compileExpression = function () {
	return 'function fix(f){return function(v){return f(fix(f))(v);};}';
};

FixNode.prototype.compileStatement = function () {
	return 'return function fix(f){return function(v){return f(fix(f))(v);};};';
};

FixNode.INSTANCE = new FixNode();
