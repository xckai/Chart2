define(["require", "exports"], function (require, exports) {
    "use strict";
    var Test = (function () {
        function Test(str) {
            this.str = str;
        }
        ;
        Test.prototype.getStr = function () {
            return "hello world " + this.str;
        };
        return Test;
    }());
    exports.Test = Test;
});
//# sourceMappingURL=test.js.map