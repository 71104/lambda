var MyInternalError = exports.InternalError = function () {
	return Error.call(this, 'internal error');
};


var MySyntaxError = exports.SyntaxError = function () {
	return Error.call(this, 'syntax error');
};


var MyTypeError = exports.TypeError = function () {
	return Error.call(this, 'type error');
};
