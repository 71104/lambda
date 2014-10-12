var DefaultContext = exports.DefaultContext = function () {
	Context.call(this);

	var that = this;

	function pushUnaryOperator(symbol, operator) {
		return that.push(symbol, (new LambdaNode('0', null, new NativeNode(operator, null, ['0']))).evaluate(that));
	}

	function pushBinaryOperator(symbol, operator) {
		return that.push(symbol, (new LambdaNode('0', null, new LambdaNode('1', null, new NativeNode(operator, null, ['0', '1'])))).evaluate(that));
	}

	pushUnaryOperator('not', function (x) { return !x; });
	pushUnaryOperator('~', function (x) { return ~x; });

	pushBinaryOperator('+', function (x, y) { return x + y; });
	pushBinaryOperator('-', function (x, y) { return x - y; });
	pushBinaryOperator('*', function (x, y) { return x * y; });
	pushBinaryOperator('/', function (x, y) { return x / y; });
	pushBinaryOperator('%', function (x, y) { return x % y; });
	pushBinaryOperator('<', function (x, y) { return x < y; });
	pushBinaryOperator('>', function (x, y) { return x > y; });
	pushBinaryOperator('&', function (x, y) { return x & y; });
	pushBinaryOperator('|', function (x, y) { return x | y; });
	pushBinaryOperator('^', function (x, y) { return x ^ y; });
	pushBinaryOperator('=', function (x, y) { return x === y; });
	pushBinaryOperator('!=', function (x, y) { return x !== y; });
	pushBinaryOperator('>=', function (x, y) { return x >= y; });
	pushBinaryOperator('<=', function (x, y) { return x <= y; });
	pushBinaryOperator('**', function (x, y) { return Math.pow(x, y); });
	pushBinaryOperator('and', function (x, y) { return !!(x && y); });
	pushBinaryOperator('or', function (x, y) { return !!(x || y); });

	/*jshint ignore: start */
	pushBinaryOperator('xor', function (x, y) { return !!x !== !!y; });
	/*jshint ignore: end */
};

DefaultContext.prototype = Object.create(Context.prototype);
