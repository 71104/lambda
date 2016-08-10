function DefaultContext() {
  Context.call(this);
}

exports.DefaultContext = DefaultContext;
extend(Context, DefaultContext);

DefaultContext.INSTANCE = new DefaultContext();
