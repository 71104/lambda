ListType.prototype.context = ListType.prototype.context.addAll({
  length: NaturalType.DEFAULT,
});

ListValue.prototype.context = ListValue.prototype.context.addAll({
  length: Closure.fromFunction(function () {
    return this.length;
  }),
});
