define(["require", "exports", "lib/underscore"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Util;
    (function (Util) {
        function isEndWith(s, ed) {
            var ss = s.toString();
            var matcher = new RegExp(ed + "$");
            return matcher.test(ss);
        }
        Util.isEndWith = isEndWith;
        function isBeginWith(s, bs) {
            var ss = s.toString();
            var matcher = new RegExp("^" + bs);
            return matcher.test(ss);
        }
        Util.isBeginWith = isBeginWith;
        function isContaint(s, ss) {
            var matcher = new RegExp(ss);
            return matcher.test(s.toString());
        }
        Util.isContaint = isContaint;
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
            this._font = 14;
            this.color = "black";
            this.stroke = 1;
            this.fillColor = "black";
            this.opacity = 1;
            this.lineWidth = 1;
            this.rx = 2;
            this.ry = 2;
            this.fontFamily = "arial,sans-serif";
            this.color = color || this.color;
            this.stroke = stroke || this.stroke;
            this.fillColor = fillColor || this.fillColor;
            this.opacity = opacity || this.opacity;
        }
        Object.defineProperty(Style.prototype, "font", {
            get: function () {
                return this._font;
            },
            set: function (f) {
                if (!isNaN(f)) {
                    this._font = f;
                }
                if (Util.isEndWith(f, "px")) {
                    this._font = parseFloat(f);
                }
                if (Util.isEndWith(f, "em") || Util.isEndWith(f, "rem")) {
                    var font = window.getComputedStyle(document.body).getPropertyValue('font-size') || 16;
                    this._font = parseFloat(f) * parseFloat(font);
                }
            },
            enumerable: true,
            configurable: true
        });
        return Style;
    }());
    exports.Style = Style;
    var Layout = (function () {
        function Layout(render) {
            this.render = "html";
            if (render) {
                this.render = render;
            }
        }
        Layout.prototype.w = function (v) {
            return v !== undefined ? (this._w = v, this) : this._w;
        };
        Layout.prototype.h = function (v) {
            return v !== undefined ? (this._h = v, this) : this._h;
        };
        Layout.prototype.node = function (v) {
            return v !== undefined ? (this._node = v, this) : this._node;
        };
        Layout.prototype.x = function (v) {
            return v !== undefined ? (this._x = v, this) : this._x;
        };
        Layout.prototype.y = function (v) {
            return v !== undefined ? (this._y = v, this) : this._y;
        };
        Layout.prototype.position = function (p) {
            return p !== undefined ? (this._p = p, this) : this._p;
        };
        return Layout;
    }());
    exports.Layout = Layout;
});
//# sourceMappingURL=Utils.js.map