var Context = exports.Context = function (hash) {
	this.hash = {};
	if (hash) {
		for (var name in hash) {
			if (hash.hasOwnProperty(name)) {
				this.hash[Context.PREFIX + name] = hash[name];
			}
		}
	}
};

Context.PREFIX = 'LAMBDA ';

Context.prototype.has = function (name) {
	return (Context.PREFIX + name) in this.hash;
};

Context.prototype.top = function (name) {
	name = Context.PREFIX + name;
	if (name in this.hash) {
		return this.hash[name];
	} else {
		throw new LambdaInternalError();
	}
};

Context.prototype.forEach = function (callback, context) {
	for (var name in this.hash) {
		if (name.substr(0, Context.PREFIX.length) === Context.PREFIX) {
			callback.call(context || null, name.substr(Context.PREFIX.length), this.hash[name]);
		}
	}
};

Context.prototype.add = function (name, value) {
	function Hash() {}
	Hash.prototype = this.hash;
	var hash = new Hash();
	hash[Context.PREFIX + name] = value;
	var context = new Context();
	context.hash = hash;
	return context;
};

Context.EMPTY = new Context();
