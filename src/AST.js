function AbstractNode() {}

AbstractNode.prototype.is = function (Class) {
	return this instanceof Class;
};
