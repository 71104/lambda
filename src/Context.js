function Context(hash) {
  this._hash = Object.create(null);
  if (hash) {
    for (var name in hash) {
      if (hash.hasOwnProperty(name)) {
        this._hash[name] = hash[name];
      }
    }
  }
}

exports.Context = Context;

Context.prototype.has = function (name) {
  return name in this._hash;
};

Context.prototype.top = function (name) {
  if (name in this._hash) {
    return this._hash[name];
  } else {
    throw new LambdaInternalError();
  }
};

Context.prototype.forEach = function (callback, context) {
  for (var name in this._hash) {
    // jshint forin: false
    callback.call(context, name, this._hash[name]);
  }
};

Context.prototype.add = function (name, value) {
  var hash = Object.create(this._hash);
  hash[name] = value;
  var context = new Context();
  context._hash = hash;
  return context;
};

Context.prototype.addAll = function (hash) {
  var child = Object.create(this._hash);
  for (var name in hash) {
    if (hash.hasOwnProperty(name)) {
      child[name] = hash[name];
    }
  }
  var context = new Context();
  context._hash = child;
  return context;
};

Context.prototype.extend = function (context) {
  var child = Object.create(this._hash);
  for (var name in context._hash) {
    // jshint forin: false
    child[name] = context._hash[name];
  }
  var result = new Context();
  result._hash = child;
  return result;
};

Context.EMPTY = new Context();
