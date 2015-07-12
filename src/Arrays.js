ArrayValue.prototype.prototype = new Context({
	concat: Closure.unmarshal(function (other) {
		return this.concat(other);
	}),
	indexOf: Closure.unmarshal(function (value) {
		return this.indexOf(value);
	}),
	lastIndexOf: Closure.unmarshal(function (value) {
		return this.lastIndexOf(value);
	}),
	join: Closure.unmarshal(function (glue) {
		return this.join(glue);
	}),
	forEach: Closure.unmarshal(function (callback) {
		this.forEach(function (element) {
			callback(element);
		});
	}),
	some: Closure.unmarshal(function (callback) {
		return this.some(function (element) {
			return callback(element);
		});
	}),
	every: Closure.unmarshal(function (callback) {
		return this.every(function (element) {
			return callback(element);
		});
	}),
	filter: Closure.unmarshal(function (callback) {
		return this.filter(function (element) {
			return callback(element);
		});
	}),
	map: Closure.unmarshal(function (callback) {
		return this.map(function (element) {
			return callback(element);
		});
	}),
	reduce: Closure.unmarshal(function (callback, value) {
		return this.reduce(function (value, element) {
			return callback(value, element);
		}, value);
	}),
	reduceRight: Closure.unmarshal(function (callback, value) {
		return this.reduceRight(function (value, element) {
			return callback(value, element);
		}, value);
	}),
	sort: Closure.unmarshal(function (compare) {
		return this.sort(function (a, b) {
			if (!compare(a, b)) {
				return 1;
			} else if (!compare(b, a)) {
				return -1;
			} else {
				return 0;
			}
		});
	})
});
