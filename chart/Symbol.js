var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Utils_1 = require("./Utils");
    var Symbol = (function () {
        function Symbol(x, y, w, h) {
            var _this = this;
            this.data = {};
            this.setStyle = function (s) {
                _this.style = new Utils_1.Style();
                s.clone(s);
                _this.style.on("change", _this.render, _this);
                return _this;
            };
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            //this.style.on("change",this.render)
        }
        Symbol.prototype.isInsharp = function (mx, my) {
            return Math.abs(mx - this.x) < this.w && Math.abs(my - this.y) < this.h;
        };
        Symbol.prototype.setRender = function (fn) {
            this._render = fn;
            return this;
        };
        Symbol.prototype.render = function (isRedraw) {
            if (isRedraw) {
                this.node = null;
            }
            if (this._render) {
                this._render();
            }
        };
        return Symbol;
    }());
    exports.Symbol = Symbol;
    var Circle = (function (_super) {
        __extends(Circle, _super);
        function Circle(cx, cy, rx, ry) {
            var _this = _super.call(this, cx, cy, rx, ry) || this;
            _this.rx = rx;
            _this.ry = ry;
            _this.type = "circle";
            return _this;
        }
        Circle.prototype.render = function () { };
        return Circle;
    }(Symbol));
    exports.Circle = Circle;
    var Line = (function (_super) {
        __extends(Line, _super);
        function Line(d) {
            var _this = _super.call(this) || this;
            _this.type = "line";
            _this.d = d;
            _this.z_index = 10;
            return _this;
        }
        Line.prototype.isInsharp = function (mx, my) {
            return false;
        };
        return Line;
    }(Symbol));
    exports.Line = Line;
    var Bar = (function (_super) {
        __extends(Bar, _super);
        function Bar(x, y, w, h) {
            var _this = _super.call(this, x, y, w, h) || this;
            _this.type = "bar";
            _this.z_index = 5;
            return _this;
        }
        Bar.prototype.isInsharp = function (mx, my) {
            return mx - this.x <= this.w && mx - this.x >= 0 && my - this.y <= this.h && my - this.y >= 0;
        };
        return Bar;
    }(Symbol));
    exports.Bar = Bar;
});
//# sourceMappingURL=Symbol.js.map