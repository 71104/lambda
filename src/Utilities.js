Array.prototype.contains = function () {
	return this.indexOf.apply(this, arguments) >= 0;
};

Array.prototype.unique = function () {
	var array = [];
	for (var i = 0; i < this.length; i++) {
		if (array.indexOf(this[i]) < 0) {
			array.push(this[i]);
		}
	}
	return array;
};

Array.prototype.union = function () {
	return this.concat.apply(this, arguments).unique();
};


function getAllPropertyNames(object) {
	var names = [];
	while (object) {
		names = names.union(Object.getOwnPropertyNames(object));
		object = Object.getPrototypeOf(object);
	}
	return names;
}


function Dictionary() {
	this.entries = [];
}

Dictionary.prototype.has = function (key) {
	return this.entries.some(function (entry) {
		return entry.key === key;
	});
};

Dictionary.prototype.get = function (key) {
	return this.entries.reduce(function (result, entry) {
		if (entry.key !== key) {
			return result;
		} else {
			return entry.value;
		}
	}, undefined);
};

Dictionary.prototype.put = function (key, value) {
	this.entries.push({
		key: key,
		value: value
	});
	return this;
};

Dictionary.prototype.erase = function (key) {
	this.entries = this.entries.filter(function (entry) {
		return entry.key !== key;
	});
	return this;
};
