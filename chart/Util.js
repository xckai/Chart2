(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "lib/underscore"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Util;
    (function (Util) {
        function max(nums) {
            var n = Number.MIN_VALUE;
            nums.forEach(function (num) {
                n = isNaN(num) ? n : n > num ? n : num;
            });
            n = n == Number.MIN_VALUE ? 0 : n;
            return n;
        }
        Util.max = max;
        function min(ns) {
            var n = Number.MAX_VALUE;
            ns.forEach(function (num) {
                n = isNaN(num) ? n : n < num ? n : num;
            });
            n = n == Number.MAX_VALUE ? 0 : n;
            return n;
        }
        Util.min = min;
    })(Util = exports.Util || (exports.Util = {}));
});
//# sourceMappingURL=Util.js.map