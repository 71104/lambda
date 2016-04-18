ComplexValue.prototype.prototype = new Context({
    real: LazyValue.unmarshal(function() {
        return this.r;
    }),
    imaginary: LazyValue.unmarshal(function() {
        return this.i;
    }),
});
