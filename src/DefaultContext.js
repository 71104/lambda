var DefaultContext = exports.DefaultContext = function () {
	var emptyContext = new Context();

	function evaluate(Operator) {
		return (new Operator()).evaluate(emptyContext);
	}

	Context.call(this, {
		'typeof': evaluate(TypeOfOperator),
		'not': evaluate(LogicalNotOperator),
		'~': evaluate(BitwiseNotOperator),
		'+': evaluate(PlusOperator),
		'-': evaluate(MinusOperator),
		'*': evaluate(MultiplyOperator),
		'/': evaluate(DivideOperator),
		'**': evaluate(PowerOperator),
		'%': evaluate(ModulusOperator),
		'<': evaluate(LessThanOperator),
		'<=': evaluate(LessThanOrEqualOperator),
		'>': evaluate(GreaterThanOperator),
		'>=': evaluate(GreaterThanOrEqualOperator),
		'&': evaluate(BitwiseAndOperator),
		'|': evaluate(BitwiseOrOperator),
		'^': evaluate(BitwiseXorOperator),
		'<<': evaluate(LeftShiftOperator),
		'>>': evaluate(RightShiftOperator),
		'>>>': evaluate(UnsignedRightShiftOperator),
		'=': evaluate(ComparisonOperator),
		'!=': evaluate(NegatedComparisonOperator),
		'and': evaluate(LogicalAndOperator),
		'or': evaluate(LogicalOrOperator),
		'xor': evaluate(LogicalXorOperator)
	});
};

DefaultContext.prototype = Object.create(Context.prototype);
