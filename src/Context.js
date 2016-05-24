function Context(hash) {
  this._hash = hash || Object.create(null);
}

exports.Context = Context;

Context.prototype._CLASS = Context;

Context.prototype._marshal = function (value) {
  return value;
};

Context.prototype._unmarshal = function (value) {
  return value;
};

Context.prototype.has = function (name) {
  return name in this._hash;
};

Context.prototype.top = function (name) {
  return this._unmarshal(this._hash[name]);
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
    callback.call(context, name, this._unmarshal(this._hash[name]));
  }
};

Context.prototype.add = function (name, value) {
  var hash = Object.create(this._hash);
  hash[name] = this._marshal(value);
  return new this._CLASS(hash);
};

Context.prototype.addAll = function (hash) {
  var child = Object.create(this._hash);
  for (var name in hash) {
    if (hash.hasOwnProperty(name)) {
      child[name] = this._marshal(hash[name]);
    }
  }
  return new this._CLASS(child);
};

Context.prototype.extend = function (context) {
  var child = Object.create(this._hash);
  context.forEach(function (name, value) {
    child[name] = this._marshal(value);
  }, this);
  return new this._CLASS(child);
};

Context.EMPTY = new Context();


function NativeContext(object) {
  Context.call(this, object);
  this.object = object;
}

exports.NativeContext = NativeContext;

NativeContext.prototype = Object.create(Context.prototype);

NativeContext.prototype._CLASS = NativeContext;

NativeContext.prototype._marshal = function (value) {
  return value.marshal();
};

NativeContext.prototype._unmarshal = function (value) {
  return AbstractValue.unmarshal(value);
};

NativeContext.prototype.marshal = function () {
  return this.object;
};
