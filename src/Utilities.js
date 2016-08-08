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

Array.prototype.intersection = function () {
  var arrays = [].slice(arguments);
  return this.filter(function (value) {
    return arrays.every(function (array) {
      return array.contains(value);
    });
  });
};

function getGlobalValue(name) {
  if (name in this) {
    try {
      return this[name];
    } catch (e) {
      throw new LambdaRuntimeError();
    }
  } else {
    throw new LambdaRuntimeError();
  }
}
