var DefaultContext = exports.DefaultContext = function () {
	var emptyContext = new Context();

	function unaryOperator(Operator) {
		return new LambdaNode('x', new Operator()).evaluate(emptyContext);
	}

	function binaryOperator(Operator) {
		return new LambdaNode('x', new LambdaNode('y', new Operator())).evaluate(emptyContext);
	}

	Context.call(this, {
		'not': unaryOperator(LogicalNotOperator),
		'~': unaryOperator(BitwiseNotOperator),
		'+': binaryOperator(PlusOperator),
		'-': binaryOperator(MinusOperator),
		'*': binaryOperator(MultiplyOperator),
		'/': binaryOperator(DivideOperator),
		'**': binaryOperator(PowerOperator),
		'%': binaryOperator(ModulusOperator),
		'<': binaryOperator(LessThanOperator),
		'<=': binaryOperator(LessThanOrEqualOperator),
		'>': binaryOperator(GreaterThanOperator),
		'>=': binaryOperator(GreaterThanOrEqualOperator),
		'&': binaryOperator(BitwiseAndOperator),
		'|': binaryOperator(BitwiseOrOperator),
		'^': binaryOperator(BitwiseXorOperator),
		'<<': binaryOperator(LeftShiftOperator),
		'>>': binaryOperator(RightShiftOperator),
		'>>>': binaryOperator(UnsignedRightShiftOperator),
		'=': binaryOperator(ComparisonOperator),
		'!=': binaryOperator(NegatedComparisonOperator),
		'and': binaryOperator(LogicalAndOperator),
		'or': binaryOperator(LogicalOrOperator),
		'xor': binaryOperator(LogicalXorOperator)
	});
};

DefaultContext.prototype = Object.create(Context.prototype);
