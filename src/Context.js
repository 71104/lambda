var Context = exports.Context = function (hash) {
	this.hash = hash || {};
};

Context.prototype.has = function (name) {
	return this.hash.hasOwnProperty(name);
};

Context.prototype.top = function (name) {
	if (this.hash.hasOwnProperty(name)) {
		return this.hash[name];
	} else {
		throw new LambdaInternalError();
	}
};

Context.prototype.forEach = function (callback, context) {
	for (var name in this.hash) {
		if (this.hash.hasOwnProperty(name)) {
			callback.call(context || null, name, this.hash[name]);
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
	hash[newName] = value;
	return new Context(hash);
};
