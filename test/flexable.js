(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "Chart/Flexable"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Flexable_1 = require("Chart/Flexable");
    QUnit.test("formatTranslate", function (assert) {
        assert.deepEqual(Flexable_1.formatTranslate("translate(0,0)"), ["0", "0"], "formatTranslate 0 0");
        assert.deepEqual(Flexable_1.formatTranslate("translate(-1,0)"), ["-1", "0"], "formatTranslate -1 0");
        assert.deepEqual(Flexable_1.formatTranslate("translate()"), ["0", "0"], "formatTranslate ");
        assert.deepEqual(Flexable_1.formatTranslate("translate(0)"), ["0", "0"], "formatTranslate 0");
        assert.deepEqual(Flexable_1.formatTranslate("translate(10,2)"), ["10", "2"], "formatTranslate 10 2");
    });
});
//# sourceMappingURL=flexable.js.map