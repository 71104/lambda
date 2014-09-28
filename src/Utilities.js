Array.prototype.union = function (other) {
	var array = this.concat(other);
	return array.filter(function (element) {
		return this.indexOf(element) < 0;
	}, array);
};
