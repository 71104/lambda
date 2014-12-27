var DefaultContext = exports.DefaultContext = function () {
	Context.call(this);

	var that = this;

	function registerUnaryOperator(symbol, Operator) {
		return that.hash[symbol] = new LambdaNode('x', new Operator()).evaluate(that);
	}

	function registerBinaryOperator(symbol, Operator) {
		return that.hash[symbol] = new LambdaNode('x', new LambdaNode('y', new Operator())).evaluate(that);
	}

	registerUnaryOperator('not', LogicalNotOperator);
	registerUnaryOperator('~', BitwiseNotOperator);
	registerBinaryOperator('+', PlusOperator);
	registerBinaryOperator('-', MinusOperator);
	registerBinaryOperator('*', MultiplyOperator);
	registerBinaryOperator('/', DivideOperator);
	registerBinaryOperator('**', PowerOperator);
	registerBinaryOperator('%', ModulusOperator);
	registerBinaryOperator('<', LessThanOperator);
	registerBinaryOperator('<=', LessThanOrEqualOperator);
	registerBinaryOperator('>', GreaterThanOperator);
	registerBinaryOperator('>=', GreaterThanOrEqualOperator);
	registerBinaryOperator('&', BitwiseAndOperator);
	registerBinaryOperator('|', BitwiseOrOperator);
	registerBinaryOperator('^', BitwiseXorOperator);
	registerBinaryOperator('<<', LeftShiftOperator);
	registerBinaryOperator('>>', RightShiftOperator);
	registerBinaryOperator('>>>', UnsignedRightShiftOperator);
	registerBinaryOperator('=', ComparisonOperator);
	registerBinaryOperator('!=', NegatedComparisonOperator);
	registerBinaryOperator('and', LogicalAndOperator);
	registerBinaryOperator('or', LogicalOrOperator);
	registerBinaryOperator('xor', LogicalXorOperator);
};

DefaultContext.prototype = Object.create(Context.prototype);
