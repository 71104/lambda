var LambdaInternalError = exports.InternalError = function () {
	return Error.call(this, 'internal error');
};


var LambdaSyntaxError = exports.SyntaxError = function () {
	return Error.call(this, 'syntax error');
};


var LambdaTypeError = exports.TypeError = function () {
	return Error.call(this, 'type error');
};


var LambdaRuntimeError = exports.RuntimeError = function () {
	return Error.call(this, 'runtime error');
};


var LambdaUserError = exports.UserError = function (value) {
	this.value = value;
};

LambdaUserError.prototype.toString = function () {
	return 'User error: ' + this.value.toString();
};
