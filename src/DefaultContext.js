function DefaultContext() {
  var hash = Object.create(null);

  hash['**'] = Closure.fromFunction(function (x, y) {
    return Math.pow(x, y);
  });
  hash['*'] = Closure.fromFunction(function (x, y) {
    return x * y;
  });
  hash['/'] = Closure.fromFunction(function (x, y) {
    return x / y;
  });
  hash['%'] = Closure.fromFunction(function (x, y) {
    return x % y;
  });
  hash['+'] = Closure.fromFunction(function (x, y) {
    return x + y;
  });
  hash['-'] = Closure.fromFunction(function (x, y) {
    return x - y;
  });

  Context.call(this, hash);
}

exports.DefaultContext = DefaultContext;
extend(Context, DefaultContext);

DefaultContext.INSTANCE = new DefaultContext();
