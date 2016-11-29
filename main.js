define(["require", "exports", "test"], function (require, exports, test_1) {
    "use strict";
    require.config({
        path: {
            "require": "",
            "exports": "",
            "backbone": "backbone"
        }
    });
    var t = new test_1.Test("a");
    document.body.innerHTML = t.getStr();
});
//# sourceMappingURL=main.js.map