function Context(hash) {
  this._hash = hash || Object.create(null);
}

exports.Context = Context;

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

Context.prototype.add = function (name, value) {
  var hash = Object.create(this._hash);
  hash[name] = this._marshal(value);
  return new Context(hash);
};

Context.prototype.addAll = function (map) {
  var hash = Object.create(this._hash);
  for (var key in map) {
    if (map.hasOwnProperty(key)) {
      hash[key] = this._marshal(map[key]);
    }
  }
  return new Context(hash);
};

Context.EMPTY = new Context;


function NativeContext(object) {
  Context.call(this, object);
}

exports.NativeContext = NativeContext;
extend(Context, NativeContext);

NativeContext.prototype._marshal = function (value) {
  return value.marshal();
};

NativeContext.prototype._unmarshal = function (value) {
  return AbstractValue.unmarshal(value);
};
