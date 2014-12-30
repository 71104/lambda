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
	name = Context.PREFIX + name;
	return this.hash.hasOwnProperty(name);
};

Context.prototype.top = function (name) {
	name = Context.PREFIX + name;
	if (this.hash.hasOwnProperty(name)) {
		return this.hash[name];
	} else {
		throw new LambdaInternalError();
	}
};

Context.prototype.forEach = function (callback, context) {
	for (var name in this.hash) {
		if (this.hash.hasOwnProperty(name)) {
			callback.call(context || null, name.substr(Context.PREFIX.length), this.hash[name]);
		}
	}
};

Context.prototype.add = function (newName, value) {
	var hash = {};
	for (var name in this.hash) {
		if (this.hash.hasOwnProperty(name)) {
			hash[name] = this.hash[name];
		}
	}
	hash[Context.PREFIX + newName] = value;
	var context = new Context();
	context.hash = hash;
	return context;
};
