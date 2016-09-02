function DefaultContext() {
  var hash = Object.create(null);

  ['+', '-', '*', '/', '%', '**'].forEach(function (name) {
    hash[name] = Operators.make(name);
  });

  Context.call(this, hash);
}

exports.DefaultContext = DefaultContext;
extend(Context, DefaultContext);

DefaultContext.INSTANCE = new DefaultContext();
