ListType.prototype.context = ListType.prototype.context.addAll({
  length: NaturalType.DEFAULT,

  head: new LambdaType(
      new ListType(
          new VariableType('T')),
      new VariableType('T')),

  tail: new LambdaType(
      new ListType(
          new VariableType('T')),
      new ListType(
          new VariableType('T'))),

  reverse: new LambdaType(
    new ListType(
      new VariableType('T')),
    new ListType(
      new VariableType('T'))),

  sort: new LambdaType(
    new ListType(
      new VariableType('T')),
    new LambdaType(
      new LambdaType(
        new VariableType('T'),
        new LambdaType(
          new VariableType('T'), BooleanType.DEFAULT)),
      new ListType(
        new VariableType('T')))),

  each: new LambdaType(
      new ListType(
          new VariableType('T')),
      new LambdaType(
          new LambdaType(
              new VariableType('T'), UndefinedType.DEFAULT),
          UndefinedType.DEFAULT)),

  some: new LambdaType(
      new ListType(
          new VariableType('T')),
      new LambdaType(
          new LambdaType(
              new VariableType('T'), BooleanType.DEFAULT),
          BooleanType.DEFAULT)),

  every: new LambdaType(
      new ListType(
          new VariableType('T')),
      new LambdaType(
          new LambdaType(
              new VariableType('T'), BooleanType.DEFAULT),
          BooleanType.DEFAULT)),

  filter: new LambdaType(
      new ListType(
        new VariableType('T')),
      new LambdaType(
        new LambdaType(
          new VariableType('T'), BooleanType.DEFAULT),
        new ListType(
          new VariableType('T')))),

  map: new LambdaType(
    new ListType(
      new VariableType('A')),
    new LambdaType(
      new LambdaType(
        new VariableType('A'),
        new VariableType('B')),
      new ListType(
        new VariableType('B')))),

  reduce: new LambdaType(
      new ListType(
        new VariableType('A')),
      new LambdaType(
        new VariableType('B'),
        new LambdaType(
          new LambdaType(
            new LambdaType(
              new VariableType('B'),
              new VariableType('A')),
            new VariableType('B')),
          new VariableType('B')))),

  join: new LambdaType(
      new ListType(StringType.DEFAULT),
      new LambdaType(StringType.DEFAULT, StringType.DEFAULT)),

  min: new LambdaType(
      new ListType(
        new VariableType('T')),
      new VariableType('T')),

  max: new LambdaType(
      new ListType(
        new VariableType('T')),
      new VariableType('T')),

});


ListValue.prototype.context = ListValue.prototype.context.addAll({
  length: Closure.fromFunction(function (list) {
    return new NaturalValue(list.values.length);
  }),
  head: Closure.fromFunction(function (list) {
    if (list.values.length) {
      return list.values[0];
    } else {
      throw new LambdaRuntimeError();
    }
  }),
  tail: Closure.fromFunction(function (list) {
    if (list.values.length) {
      return new ListValue(list.values.slice(1));
    } else {
      throw new LambdaRuntimeError();
    }
  }),
  reverse: Closure.fromFunction(function (list) {
    return new ListValue(list.values.reverse());
  }),
  sort: Closure.fromFunction(function (list, lambda) {
    if (!lambda.is(Closure)) {
      throw new LambdaRuntimeError();
    }
    var compare = function (a, b) {
      var result = lambda.apply(a, b);
      if (result.is(BooleanValue)) {
        return result.value;
      } else {
        throw new LambdaRuntimeError();
      }
    };
    return new ListValue(list.values.sort(function (a, b) {
      if (!compare(a, b)) {
        return 1;
      } else if (!compare(b, a)) {
        return -1;
      } else {
        return 0;
      }
    }));
  }),
  each: Closure.fromFunction(function (list, callback) {
    if (callback.is(Closure)) {
      list.values.forEach(function (element) {
        callback.apply(element);
      });
      return UndefinedValue.DEFAULT;
    } else {
      throw new LambdaRuntimeError();
    }
  }),
  some: Closure.fromFunction(function (list, callback) {
    if (callback.is(Closure)) {
      return new BooleanValue(list.values.some(function (element) {
        var result = callback.apply(element);
        if (result.is(BooleanValue)) {
          return result.value;
        } else {
          throw new LambdaRuntimeError();
        }
      }));
    } else {
      throw new LambdaRuntimeError();
    }
  }),
  every: Closure.fromFunction(function (list, callback) {
    if (callback.is(Closure)) {
      return new BooleanValue(list.values.every(function (element) {
        var result = callback.apply(element);
        if (result.is(BooleanValue)) {
          return result.value;
        } else {
          throw new LambdaRuntimeError();
        }
      }));
    } else {
      throw new LambdaRuntimeError();
    }
  }),
  filter: Closure.fromFunction(function (list, callback) {
    if (callback.is(Closure)) {
      return new ListValue(list.values.filter(function (element) {
        var result = callback.apply(element);
        if (result.is(BooleanValue)) {
          return result.value;
        } else {
          throw new LambdaRuntimeError();
        }
      }));
    } else {
      throw new LambdaRuntimeError();
    }
  }),
  map: Closure.fromFunction(function (list, callback) {
    if (callback.is(Closure)) {
      return new ListValue(list.values.map(function (element) {
        return callback.apply(element);
      }));
    } else {
      throw new LambdaRuntimeError();
    }
  }),
  reduce: Closure.fromFunction(function (list, initialValue, callback) {
    if (callback.is(Closure)) {
      return list.values.reduce(function (previousValue, currentValue) {
        var partial = callback.apply(previousValue);
        if (partial.is(Closure)) {
          return partial.apply(currentValue);
        } else {
          throw new LambdaRuntimeError();
        }
      }, initialValue);
    } else {
      throw new LambdaRuntimeError();
    }
  }),
  join: Closure.fromFunction(function (list, glue) {
    if (glue.is(StringValue)) {
      return new StringValue(list.values.map(function (value) {
        if (value.is(StringValue)) {
          return value.value;
        } else {
          throw new LambdaRuntimeError();
        }
      }).join(glue.value));
    } else {
      throw new LambdaRuntimeError();
    }
  }),
  min: Closure.fromFunction(function (list) {
    if (list.values.length) {
      var value = list.values[0];
      for (var i = 1; i < list.values.length; i++) {
        var operator = Operators.select('<', list.values[i].character, value.character);
        if (operator.handler(list.values[i], value).value) {
          value = list.values[i];
        }
      }
      return value;
    } else {
      throw new LambdaRuntimeError();
    }
  }),
  max: Closure.fromFunction(function (list) {
    if (list.values.length) {
      var value = list.values[0];
      for (var i = 1; i < list.values.length; i++) {
        var operator = Operators.select('>', list.values[i].character, value.character);
        if (operator.handler(list.values[i], value).value) {
          value = list.values[i];
        }
      }
      return value;
    } else {
      throw new LambdaRuntimeError();
    }
  }),
});
