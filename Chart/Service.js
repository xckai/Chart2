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
        define(["require", "exports", "lib/underscore"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseClass = (function () {
        function BaseClass() {
            var _this = this;
            this.setConfig = function (obj) {
                var self = _this;
                _(obj).chain().keys().each(function (v, k) {
                    self[k] = v;
                });
            };
        }
        return BaseClass;
    }());
    exports.BaseClass = BaseClass;
    function stringTemplate(str) {
        return _.template(str, { interpolate: /\{(.+?)\}/g });
    }
    function curry(f) {
        var arity = f.length;
        return function f1() {
            var args = Array.prototype.slice.call(arguments, 0);
            if (args.length < arity) {
                var f2 = function () {
                    var args2 = Array.prototype.slice.call(arguments, 0); // parameters of returned curry func
                    return f1.apply(null, args.concat(args2)); // compose the parameters for origin func f
                };
                return f2;
            }
            else {
                return f.apply(null, args); //all parameters are provided call the origin function
            }
        };
    }
    ;
    function d3Transform(chain) {
        var transforms = [];
        if (chain !== undefined) {
            transforms.push(chain);
        }
        function push(kind, args) {
            var n = args.length;
            transforms.push(function () {
                return kind + '(' + (n == 1 && typeof args[0] == 'function'
                    ? args[0].apply(this, arr(arguments)) : args) + ')';
            });
        }
        ;
        function arr(args) {
            return Array.prototype.slice.call(args);
        }
        var my = function () {
            var that = this, args = arr(arguments);
            return transforms.map(function (f) {
                return f.apply(that, args);
            }).join(' ');
        };
        ['translate', 'rotate', 'scale', 'matrix', 'skewX', 'skewY'].forEach(function (t) {
            my[t] = function () {
                push(t, arr(arguments));
                return my;
            };
        });
        return my;
    }
    ;
    var Service = (function (_super) {
        __extends(Service, _super);
        function Service() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Service;
    }(BaseClass));
    Service.stringTemplate = stringTemplate;
    Service.curry = curry;
    Service.d3Transform = d3Transform;
    exports.Service = Service;
});
//# sourceMappingURL=Service.js.map