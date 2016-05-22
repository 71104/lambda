ListType.prototype.context = ListType.prototype.context.addAll({
  // TODO: type everything except length, which is typed by IndexedType
});

ListValue.prototype.context = NativeArrayValue.prototype.context = ListValue.prototype.context.addAll({
  length: LazyValue.unmarshal(function () {
    return this.length;
  }),
  slice: Closure.unmarshal(function (begin, end) {
    if (begin < 0 || begin >= this.length) {
      throw new Error('start index out of bounds: ' + begin + ' (length is ' + this.length + ')');
    } else if (end < 0 || end >= this.length) {
      throw new Error('end index out of bounds: ' + end + ' (length is ' + this.length + ')');
    } else {
      return this.slice(begin, end);
    }
  }),
  append: Closure.unmarshal(function (element) {
    var result = this.slice();
    result.push(element);
    return result;
  }),
  concat: Closure.unmarshal(function (other) {
    var result = this.slice();
    result.push.apply(result, other);
    return result;
  }),
  indexOf: Closure.unmarshal(function (compare) {
    for (var i = 0; i < this.length; i++) {
      if (compare(this[i])) {
        return i;
      }
    }
    return -1;
  }),
  lastIndexOf: Closure.unmarshal(function (compare) {
    for (var i = this.length - 1; i >= 0; i--) {
      if (compare(this[i])) {
        return i;
      }
    }
    return -1;
  }),
  contains: Closure.unmarshal(function (compare) {
    for (var i = 0; i < this.length; i++) {
      if (compare(this[i])) {
        return true;
      }
    }
    return false;
  }),
  unique: Closure.unmarshal(function (compare) {
    var result = [];

    function contains(element) {
      for (var i = 0; i < result.length; i++) {
        if (compare(result[i], element)) {
          return true;
        }
      }
      return false;
    }
    for (var i = 0; i < this.length; i++) {
      if (!contains(this[i])) {
        result.push(this[i]);
      }
    }
    return result;
  }),
  union: Closure.unmarshal(function (other, compare) {
    var result = this.slice();

    function contains(element) {
      for (var i = 0; i < result.length; i++) {
        if (compare(result[i], element)) {
          return true;
        }
      }
      return false;
    }
    for (var i = 0; i < other.length; i++) {
      if (!contains(other[i])) {
        result.push(other[i]);
      }
    }
    return result;
  }),
  join: Closure.unmarshal(function (glue) {
    return this.join(glue);
  }),
  each: Closure.unmarshal(function (callback) {
    this.forEach(function (element) {
      callback(element);
    });
    return this;
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
  reduce: Closure.unmarshal(function (value, callback) {
    return this.reduce(function (value, element) {
      return callback(element, value);
    }, value);
  }),
  reduceRight: Closure.unmarshal(function (value, callback) {
    return this.reduceRight(function (value, element) {
      return callback(element, value);
    }, value);
  }),
  reverse: LazyValue.unmarshal(function () {
    return this.slice().reverse();
  }),
  min: Closure.unmarshal(function (compare) {
    if (this.length) {
      var value = this[0];
      for (var i = 1; i < this.length; i++) {
        if (compare(this[i], value)) {
          value = this[i];
        }
      }
      return value;
    } else {
      throw new Error('cannot find minimum in an empty list');
    }
  }),
  max: Closure.unmarshal(function (compare) {
    if (this.length) {
      var value = this[0];
      for (var i = 1; i < this.length; i++) {
        if (compare(value, this[i])) {
          value = this[i];
        }
      }
      return value;
    } else {
      throw new Error('cannot find maximum in an empty list');
    }
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
  }),
  search: Closure.unmarshal(function (compare) {
    var array = this;
    return (function search(i, j) {
      if (j < i) {
        return -1;
      } else {
        var k = (i + j) >>> 1;
        var result = compare(array[k]);
        if (result < 0) {
          return search(i, k - 1);
        } else if (result > 0) {
          return search(k + 1, j);
        } else {
          return k;
        }
      }
    }(0, array.length - 1));
  })
});
