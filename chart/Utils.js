define(["require", "exports", "lib/underscore"], function (require, exports) {
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
        function getStringRect(str, cla) {
            var d = window.document.createElement("div");
            var p = window.document.createElement("span");
            var r = { width: 0, height: 0 };
            d.style.transform = "translate3d(0, 0, 0)";
            d.style.visibility = "hidden";
            p.innerHTML = str;
            if (cla) {
                p.className = cla;
            }
            if (!str) {
                return r;
            }
            p.style.display = "inline-block";
            d.appendChild(p);
            window.document.body.appendChild(d);
            var rec = p.getBoundingClientRect();
            r.width = rec.width;
            r.height = rec.height;
            d.remove();
            console.log(r);
            return r;
        }
        Util.getStringRect = getStringRect;
    })(Util = exports.Util || (exports.Util = {}));
    var Style = (function () {
        function Style(color, stroke, fillColor, opacity) {
            this.color = "black";
            this.stroke = 1;
            this.fillColor = "black";
            this.opacity = 1;
            this.color = color;
            this.stroke = stroke;
            this.fillColor = fillColor;
            this.opacity = opacity;
        }
        return Style;
    }());
    exports.Style = Style;
});
//# sourceMappingURL=Utils.js.map