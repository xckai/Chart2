define(["require", "exports", "Chart/Flexable"], function (require, exports, Flexable_1) {
    "use strict";
    QUnit.test("formatTranslate", function (assert) {
        assert.deepEqual(Flexable_1.Flexable.formatTranslate("translate(0,0)"), ["0", "0"], "formatTranslate 0 0");
        assert.deepEqual(Flexable_1.Flexable.formatTranslate("translate(-1,0)"), ["-1", "0"], "formatTranslate -1 0");
        assert.deepEqual(Flexable_1.Flexable.formatTranslate("translate()"), ["0", "0"], "formatTranslate ");
        assert.deepEqual(Flexable_1.Flexable.formatTranslate("translate(0)"), ["0", "0"], "formatTranslate 0");
        assert.deepEqual(Flexable_1.Flexable.formatTranslate("translate(10,2)"), ["10", "2"], "formatTranslate 10 2");
    });
});
//# sourceMappingURL=flexable.js.map