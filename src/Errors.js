var LambdaError = exports.LambdaError = function (description) {
	this.error = new Error(description);
};

LambdaError.prototype.toString = function () {
	return this.error.toString();
};


var LambdaInternalError = exports.InternalError = function () {
	LambdaError.call(this, 'internal error');
};

LambdaInternalError.prototype = Object.create(LambdaError.prototype);


var LambdaSyntaxError = exports.SyntaxError = function () {
	LambdaError.call(this, 'syntax error');
};

LambdaSyntaxError.prototype = Object.create(LambdaError.prototype);


var LambdaTypeError = exports.TypeError = function () {
	LambdaError.call(this, 'type error');
};

LambdaTypeError.prototype = Object.create(LambdaError.prototype);


var LambdaRuntimeError = exports.RuntimeError = function () {
	LambdaError.call(this, 'runtime error');
};

LambdaRuntimeError.prototype = Object.create(LambdaError.prototype);


var LambdaUserError = exports.UserError = function (value) {
	LambdaError.call(this, 'user error: ' + value);
	this.value = value;
};

LambdaUserError.prototype = Object.create(LambdaError.prototype);
