var MyInternalError = exports.InternalError = function () {
	return Error.call(this, 'internal error');
};


var MySyntaxError = exports.SyntaxError = function () {
	return Error.call(this, 'syntax error');
};


var MyTypeError = exports.TypeError = function () {
	return Error.call(this, 'type error');
};


var MyRuntimeError = exports.RuntimeError = function () {
	return Error.call(this, 'runtime error');
};


var MyUserError = exports.UserError = function (value) {
	var error = Error.call(this, 'user error');
	error.value = value;
	return error;
};
