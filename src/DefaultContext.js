function DefaultContext() {
  var hash = Object.create(null);

  ['+', '-', '*', '/', '%', '**'].forEach(function (name) {
    hash[name] = Operators.make(name);
  });

  hash.typeof = Closure.fromFunction(function (value) {
    return new StringValue(characterToString(value.character));
  });

  Context.call(this, hash);
}

exports.DefaultContext = DefaultContext;
extend(Context, DefaultContext);

DefaultContext.INSTANCE = new DefaultContext();
