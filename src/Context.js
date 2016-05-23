function Context(hash) {
  this._hash = hash || Object.create(null);
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

Context.prototype.names = function () {
  var names = [];
  for (var name in this._hash) {
    // jshint forin: false
    names.push(name);
  }
  return names;
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
  return new Context(hash);
};

Context.prototype.addAll = function (hash) {
  var child = Object.create(this._hash);
  for (var name in hash) {
    if (hash.hasOwnProperty(name)) {
      child[name] = hash[name];
    }
  }
  return new Context(child);
};

Context.prototype.extend = function (context) {
  var child = Object.create(this._hash);
  context.forEach(function (name, value) {
    child[name] = value;
  });
  return new Context(child);
};

Context.EMPTY = new Context();


function NativeContext(object) {
  this.object = object;
}

exports.NativeContext = NativeContext;

NativeContext.prototype.has = function (name) {
  return name in this.object;
};

NativeContext.prototype.top = function (name) {
  return AbstractValue.unmarshal(this.object[name]);
};

NativeContext.prototype.names = function () {
  var names = [];
  for (var name in this.object) {
    // jshint forin: false
    names.push(name);
  }
  return names;
};

NativeContext.prototype.forEach = function (callback, context) {
  for (var name in this.object) {
    // jshint forin: false
    callback.call(context, name, AbstractValue.unmarshal(this.object[name]));
  }
};

NativeContext.prototype.add = function (name, value) {
  var object = Object.create(this.object);
  object[name] = value.marshal();
  return new NativeContext(object);
};

NativeContext.prototype.addAll = function (hash) {
  var child = Object.create(this.object);
  for (var name in hash) {
    if (hash.hasOwnProperty(name)) {
      child[name] = hash[name].marshal();
    }
  }
  return new NativeContext(child);
};

NativeContext.prototype.extend = function (context) {
  var child = Object.create(this.object);
  context.forEach(function (name, value) {
    child[name] = value;
  });
  return new NativeContext(child);
};
