function FixNode() {
	AbstractNode.call(this);
}

exports.FixNode = FixNode;

FixNode.prototype = Object.create(AbstractNode.prototype);

FixNode.prototype.getFreeVariables = function () {
	return [];
};

FixNode.prototype.evaluate = function () {
	return FixNode.Z_COMBINATOR;
};

FixNode.prototype.compileExpression = function () {
	return 'function fix(f){return function(v){return f(fix(f))(v);};}';
};

FixNode.prototype.compileStatement = function () {
	return 'return function fix(f){return function(v){return f(fix(f))(v);};};';
};
