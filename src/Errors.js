var LambdaError = exports.Error = function (message) {
	this.message = Error(message).toString();
};

LambdaError.prototype = Object.create(Error.prototype);

LambdaError.prototype.toString = function () {
	return this.message;
};


var LambdaInternalError = exports.InternalError = function () {
	LambdaError.call(this, 'internal error');
};

LambdaInternalError.prototype = Object.create(LambdaError.prototype);


var LambdaSyntaxError = exports.SyntaxError = function () {
	LambdaError.call(this, 'syntax error');
};

LambdaSyntaxError.prototype = Object.create(LambdaError.prototype);


var LambdaRuntimeError = exports.RuntimeError = function () {
	LambdaError.call(this, 'runtime error');
};

LambdaRuntimeError.prototype = Object.create(LambdaError.prototype);


var LambdaUserError = exports.UserError = function (value) {
	LambdaError.call(this, 'user error: ' + value.toString());
	this.value = value;
};

LambdaUserError.prototype = Object.create(LambdaError.prototype);
