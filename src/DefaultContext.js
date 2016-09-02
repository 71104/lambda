function DefaultContext() {
  var hash = Object.create(null);

  hash['**'] = Closure.fromFunction(function (x, y) {
    return new RealValue(Math.pow(x.value, y.value));
  });
  hash['*'] = Closure.fromFunction(function (x, y) {
    return new RealValue(x.value * y.value);
  });
  hash['/'] = Closure.fromFunction(function (x, y) {
    return new RealValue(x.value / y.value);
  });
  hash['%'] = Closure.fromFunction(function (x, y) {
    return new RealValue(x.value % y.value);
  });
  hash['+'] = Closure.fromFunction(function (x, y) {
    return new RealValue(x.value + y.value);
  });
  hash['-'] = Closure.fromFunction(function (x, y) {
    return new RealValue(x.value - y.value);
  });

  Context.call(this, hash);
}

exports.DefaultContext = DefaultContext;
extend(Context, DefaultContext);

DefaultContext.INSTANCE = new DefaultContext();
