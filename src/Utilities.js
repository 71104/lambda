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
