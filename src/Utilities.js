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
