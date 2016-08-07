function LambdaError(message) {
  this._error = Error(message);
  this.message = message;
}

exports.Error = LambdaError;

LambdaError.prototype.toString = function () {
  return this.message;
};


function LambdaInternalError() {
  LambdaError.call(this, 'internal error');
}

exports.InternalError = LambdaInternalError;
extend(LambdaError, LambdaInternalError);


function LambdaSyntaxError() {
  LambdaError.call(this, 'syntax error');
}

exports.SyntaxError = LambdaSyntaxError;
extend(LambdaError, LambdaSyntaxError);


function LambdaTypeError() {
  LambdaError.call(this, 'type error');
}

exports.TypeError = LambdaTypeError;
extend(LambdaError, LambdaTypeError);


function LambdaRuntimeError() {
  LambdaError.call(this, 'runtime error');
}

exports.RuntimeError = LambdaRuntimeError;
extend(LambdaError, LambdaRuntimeError);


function LambdaUserError(value) {
  LambdaError.call(this, 'user error: ' + value.toString());
  this.value = value;
}

exports.UserError = LambdaUserError;
extend(LambdaError, LambdaUserError);
