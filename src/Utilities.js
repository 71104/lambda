function extend(BaseClass, DerivedClass) {
  DerivedClass.prototype = Object.create(BaseClass.prototype);
  DerivedClass.prototype.constructor = DerivedClass;
}

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

function getGlobalValue(name, ErrorClass) {
  if (name in this) {
    try {
      return this[name];
    } catch (e) {
      throw new ErrorClass();
    }
  } else {
    throw new ErrorClass();
  }
}

function arity(length, nativeFunction) {
  // jshint evil: true
  return (new Function('f', 'return function (' + Array.apply(null, Array(length)).map(function (_, index) {
    return '_' + index;
  }).join(',') + ') { return f.apply(this, arguments); }'))(nativeFunction);
}
