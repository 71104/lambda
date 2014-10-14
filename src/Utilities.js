Array.prototype.union = function (other) {
	var hash = {};
	for (var i = 0; i < this.length; i++) {
		hash[this[i]] = true;
	}
	for (var j = 0; j < other.length; j++) {
		hash[other[j]] = true;
	}
	return Object.getOwnPropertyNames(hash);
};
