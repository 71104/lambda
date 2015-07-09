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

Array.prototype.union = function (other) {
	return this.concat(other).unique();
};


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
