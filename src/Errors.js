function LambdaError(message) {
  this.message = Error(message).toString();
}

exports.Error = LambdaError;

LambdaError.prototype = Object.create(Error.prototype);

LambdaError.prototype.toString = function () {
  return this.message;
};


function LambdaInternalError() {
  LambdaError.call(this, 'internal error');
}

exports.InternalError = LambdaInternalError;

LambdaInternalError.prototype = Object.create(LambdaError.prototype);


function LambdaSyntaxError() {
  LambdaError.call(this, 'syntax error');
}

exports.SyntaxError = LambdaSyntaxError;

LambdaSyntaxError.prototype = Object.create(LambdaError.prototype);


function LambdaRuntimeError() {
  LambdaError.call(this, 'runtime error');
}

exports.RuntimeError = LambdaRuntimeError;

LambdaRuntimeError.prototype = Object.create(LambdaError.prototype);


function LambdaUserError(value) {
  LambdaError.call(this, 'user error: ' + value.toString());
  this.value = value;
}

exports.UserError = LambdaUserError;

LambdaUserError.prototype = Object.create(LambdaError.prototype);
