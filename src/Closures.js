Closure.prototype.type = 'closure';

Closure.prototype.toString = function () {
	return 'closure';
};

Closure.prototype.marshal = function () {
	var length = 0;
	for (var node = this.lambda; node.is(LambdaNode); node = node.body) {
		length++;
	}
	node = this.lambda;
	var context = this.context;
	return function () {
		var values = arguments;
		return (function augment(node, context, index) {
			if (index < length) {
				return augment(node.body, context.add(node.name, AbstractValue.unmarshal(values[index])), index + 1);
			} else {
				return node.evaluate(context).marshal();
			}
		}(node, context, 0));
	};
};

Closure.unmarshal = function (value, context) {
	return new Closure((function makeLambda(index, names) {
		if (index < Math.max(value.length, 1)) {
			var name = '' + index;
			names.push(name);
			return new LambdaNode(name, makeLambda(index + 1, names));
		} else {
			return new NativeNode(value, null, names);
		}
	}(0, [])), context || new Context());
};
