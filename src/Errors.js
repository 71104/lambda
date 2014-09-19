function InternalError() {
	return Error.call(this, 'internal error');
}


function SyntaxError() {
	return Error.call(this, 'syntax error');
}


function TypeError() {
	return Error.call(this, 'type error');
}
