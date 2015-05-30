Array.prototype.union = function (other) {
	var prefix = 'SET ';
	var hash = {};
	for (var i = 0; i < this.length; i++) {
		hash[prefix + this[i]] = true;
	}
	for (var j = 0; j < other.length; j++) {
		hash[prefix + other[j]] = true;
	}
	return Object.keys(hash).filter(function (key) {
		return key.substr(0, prefix.length) === prefix;
	}).map(function (key) {
		return key.substr(prefix.length);
	});
};
