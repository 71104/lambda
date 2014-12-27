var Context = exports.Context = function () {
	this.names = {};
};

Context.prototype.has = function (name) {
	return this.names.hasOwnProperty(name);
};

Context.prototype.top = function (name) {
	if (this.names.hasOwnProperty(name)) {
		var stack = this.names[name];
		if (stack.length > 0) {
			return stack[stack.length - 1];
		} else {
			throw new LambdaInternalError();
		}
	} else {
		throw new Error();
	}
};

Context.prototype.forEach = function (callback, context) {
	for (var name in this.names) {
		if (this.names.hasOwnProperty(name)) {
			var stack = this.names[name];
			if (stack.length > 0) {
				if (callback.call(context || null, name, stack[stack.length - 1]) === false) {
					return false;
				}
			} else {
				throw new LambdaInternalError();
			}
		}
	}
	return true;
};

Context.prototype.push = function (name, value) {
	if (!this.names.hasOwnProperty(name)) {
		this.names[name] = [];
	}
	this.names[name].push(value);
};

Context.prototype.pop = function (name) {
	if (this.names.hasOwnProperty(name)) {
		this.names[name].pop();
		if (!this.names[name].length) {
			delete this.names[name];
		}
	} else {
		throw new LambdaInternalError();
	}
};

Context.prototype.augment = function (name, value, callback, context) {
	this.push(name, value);
	try {
		return callback.call(context || null, this);
	} finally {
		this.pop(name);
	}
};

Context.prototype.capture = function (names) {
	var context = new Context();
	(names || this).forEach(function (name) {
		context.push(name, this.top(name));
	}, this);
	return context;
};
