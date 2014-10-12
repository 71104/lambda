Closure.prototype = Object.create(AbstractValue.prototype);

Closure.prototype.toString = function () {
	// TODO
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
				return context.augment(node.name, AbstractValue.unmarshal(values[index]), function (context) {
					return augment(node.body, context, index + 1);
				});
			} else {
				return node.evaluate(context);
			}
		}(node, context, 0));
	};
};

Closure.unmarshal = function (value) {
	return new Closure((function makeLambda(index, names) {
		if (index < Math.max(value.length, 1)) {
			var name = '' + index;
			names.push(name);
			return new LambdaNode(name, UndefinedType.INSTANCE, makeLambda(index + 1, names));
		} else {
			// TODO configure `this` correctly
			return new NativeNode(value, null, names);
		}
	}(0, [])), new Context());
};
