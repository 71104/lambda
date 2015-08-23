function Context(hash) {
	this.hash = Object.create(null);
	if (hash) {
		for (var name in hash) {
			if (hash.hasOwnProperty(name)) {
				this.hash[name] = hash[name];
			}
		}
	}
}

exports.Context = Context;

Context.prototype.has = function (name) {
	return name in this.hash;
};

Context.prototype.top = function (name) {
	if (name in this.hash) {
		return this.hash[name];
	} else {
		throw new LambdaInternalError();
	}
};

Context.prototype.forEach = function (callback, context) {
	for (var name in this.hash) {
		callback.call(context, name, this.hash[name]);
	}
};

Context.prototype.add = function (name, value) {
	var hash = Object.create(this.hash);
	hash[name] = value;
	var context = new Context();
	context.hash = hash;
	return context;
};

Context.prototype.addAll = function (hash) {
	var child = Object.create(this.hash);
	for (var name in hash) {
		if (hash.hasOwnProperty(name)) {
			child[name] = hash[name];
		}
	}
	var context = new Context();
	context.hash = child;
	return context;
};

Context.EMPTY = new Context();
