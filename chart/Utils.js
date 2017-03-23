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
define(["require", "exports", "./Evented", "lib/d3", "lib/underscore"], function (require, exports, Evented_1, d3) {
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
        // var stringCache={cla:null,font_size:0,length:0,r:{width:0,height:0}} 
        function getStringRect(str, cla, font_size) {
            var d = window.document.createElement("div");
            var p = window.document.createElement("span");
            var r = { width: 0, height: 0 };
            d.style.transform = "translate3d(0, 0, 0)";
            d.style.visibility = "hidden";
            d.className = "getStringRect";
            p.innerHTML = str;
            if (cla) {
                p.className = cla;
            }
            if (font_size) {
                p.style["font-size"] = font_size + "px";
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
            return r;
        }
        Util.getStringRect = getStringRect;
        function CacheAble(fn, keyFn) {
            var _key = function () {
                return arguments2Array(arguments).join("-");
            };
            var cache = {};
            _key = keyFn ? keyFn : _key;
            return function () {
                var args = arguments2Array(arguments);
                if (cache[_key.apply(null, args)]) {
                    return cache[_key.apply(null, args)];
                }
                else {
                    console.log("not cached", args);
                    return cache[_key.apply(null, args)] = fn.apply(null, args);
                }
            };
        }
        Util.CacheAble = CacheAble;
        function arguments2Array(args) {
            var r = [];
            for (var i = 0; i < args.length; ++i) {
                r.push(args[i]);
            }
            return r;
        }
        function enableAutoResize(dom, fn) {
            function getComputedStyle(element, prop) {
                if (element.currentStyle) {
                    return element.currentStyle[prop];
                }
                if (window.getComputedStyle) {
                    return window.getComputedStyle(element, null).getPropertyValue(prop);
                }
                return element.style[prop];
            }
            if (getComputedStyle(dom, 'position') == 'static') {
                dom.style.position = 'relative';
            }
            for (var i = 0; i < dom.childNodes.length; ++i) {
                if (dom.childNodes[i].className == "autoResier") {
                    dom.removeChild(dom.childNodes[i]);
                }
            }
            var oldWidth = dom.offsetWidth, oldHeight = dom.offsetHeight, refId = 0;
            var d1 = window.document.createElement("div");
            var d2 = window.document.createElement("div");
            var d3 = window.document.createElement("div");
            d1.className = "autoResier";
            d1.style = " position: absolute; left: 0; top: 0; right: 0; overflow:hidden; visibility: hidden; bottom: 0; z-index: -1";
            d2.style = "position: absolute; left: 0; top: 0; right: 0; overflow:scroll; bottom: 0; z-index: -1";
            d3.style = "position: absolute; left: 0; top: 0; transition: 0s ;height: 100000px;width:100000px";
            d2.appendChild(d3);
            d1.appendChild(d2);
            dom.appendChild(d1);
            d2.scrollLeft = 100000;
            d2.scrollTop = 100000;
            d2.onscroll = function (e) {
                d2.scrollLeft = 100000;
                d2.scrollTop = 100000;
                if ((dom.offsetHeight != oldHeight || dom.offsetWidth != oldWidth) && refId === 0) {
                    refId = requestAnimationFrame(onresize);
                }
            };
            function onresize() {
                refId = 0;
                if (fn) {
                    fn({ oldHeight: oldHeight, oldWidth: oldWidth, height: dom.offsetHeight, width: dom.offsetWidth });
                }
                oldWidth = dom.offsetWidth, oldHeight = dom.offsetHeight;
            }
        }
        Util.enableAutoResize = enableAutoResize;
    })(Util = exports.Util || (exports.Util = {}));
    var Style = (function (_super) {
        __extends(Style, _super);
        function Style(color, stroke, fillColor, opacity, cls) {
            var _this = _super.call(this) || this;
            _this._font = 14;
            _this._color = "black";
            _this._stroke = 1;
            _this._fillColor = "black";
            _this._opacity = 1;
            _this._lineWidth = 1;
            _this._rx = 2;
            _this._ry = 2;
            _this._visiable = true;
            _this._fontFamily = "arial,sans-serif";
            _this._color = color || _this._color;
            _this._stroke = stroke || _this._stroke;
            _this._fillColor = fillColor || _this._fillColor;
            _this._opacity = opacity || _this._opacity;
            _this._class = cls;
            return _this;
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
        Style.prototype.getColor = function () {
            return this._color;
        };
        Style.prototype.getStroke = function () {
            return this._stroke;
        };
        Style.prototype.getFillColor = function () {
            return this._fillColor;
        };
        Style.prototype.getLineWidth = function () {
            return this._lineWidth;
        };
        Style.prototype.getRx = function () {
            return this._rx;
        };
        Style.prototype.getRy = function () {
            return this._ry;
        };
        Style.prototype.getOpacity = function () {
            return this._opacity;
        };
        Style.prototype.getClass = function () {
            return this._class;
        };
        Style.prototype.setClass = function (c) {
            this._class = c;
            return this;
        };
        Style.prototype.setVisiable = function (v) {
            this._visiable = v;
            return this;
        };
        Style.prototype.getVisiable = function () {
            return this._visiable;
        };
        return Style;
    }(Evented_1.Evented));
    exports.Style = Style;
    var Layout = (function (_super) {
        __extends(Layout, _super);
        function Layout(render) {
            var _this = _super.call(this) || this;
            _this.render = "html";
            _this._w = 0;
            _this._h = 0;
            _this._x = 0;
            _this._y = 0;
            if (render) {
                _this.render = render;
            }
            return _this;
        }
        Layout.prototype.set = function (k, v) {
            var key = "_" + k;
            if (this[key] === v) {
                return this;
            }
            //console.log(this[key],v,this,new Error().stack)
            this[key] = v;
            this.fire("change", { key: key, v: v });
            return this;
        };
        Layout.prototype.setW = function (w) {
            return this.set("w", w);
        };
        Layout.prototype.getW = function () {
            return this._w;
        };
        Layout.prototype.setH = function (h) {
            return this.set("h", h);
        };
        Layout.prototype.getH = function () {
            return this._h;
        };
        Layout.prototype.setNode = function (n) {
            this._node = n;
            return this;
        };
        Layout.prototype.getNode = function () {
            return this._node;
        };
        Layout.prototype.setPosition = function (p) {
            return this.set("p", p);
        };
        Layout.prototype.getPosition = function () {
            return this._p;
        };
        Layout.prototype.setX = function (x) {
            return this.set("x", x);
        };
        Layout.prototype.getX = function () {
            return this._x;
        };
        Layout.prototype.setY = function (y) {
            return this.set("y", y);
        };
        Layout.prototype.getY = function () {
            return this._y;
        };
        return Layout;
    }(Evented_1.Evented));
    exports.Layout = Layout;
    exports.pathGen = function (xScale, yScale, ds, closed) {
        if (ds.length < 1)
            return "M0,0";
        var lineString = "";
        var isStartPoint = true;
        for (var i = 0; i < ds.length; ++i) {
            if (isStartPoint) {
                if (isNaN(ds[i].y)) {
                    isStartPoint = true;
                    continue;
                }
                else {
                    lineString += "M" + xScale(ds[i].x) + "," + yScale(ds[i].y);
                    isStartPoint = false;
                }
            }
            else {
                if (isNaN(ds[i].y)) {
                    isStartPoint = true;
                    continue;
                }
                else {
                    lineString += "L" + xScale(ds[i].x) + "," + yScale(ds[i].y);
                }
            }
        }
        if (closed) {
            lineString += "Z";
        }
        return lineString;
    };
    var HTMLRender = (function () {
        function HTMLRender() {
        }
        HTMLRender.prototype.titleRender = function (e) {
            var div = e.layout.node() ? d3.select(e.layout.node()) : d3.select(e.chart.wrapper.node()).append("div");
            div.style("position", "absolute")
                .style("left", e.layout.x() + "px")
                .style("top", e.layout.y() + "px")
                .style("height", e.layout.h() + "px")
                .style("width", e.layout.w() + "px");
            e.layout.node(div.node());
            div.node().innerHTML = "";
            div.append("p").classed(e.data.class, true).text(e.data.value);
        };
        HTMLRender.prototype.axisRender = function (e, domain, position) {
        };
        HTMLRender.prototype.chartRender = function (e) {
        };
        HTMLRender.prototype.legendRender = function (e) {
            var div = e.layout.node() ? d3.select(e.layout.node()) : d3.select(e.chart.wrapper.node()).append("div");
            div.style("position", "absolute")
                .style("left", e.layout.x() + "px")
                .style("top", e.layout.y() + "px")
                .style("height", e.layout.h() + "px")
                .style("width", e.layout.w() + "px")
                .classed("legend", true);
            e.layout.node(div.node());
            div.node().innerHTML = "";
            div.append("ul").selectAll("li").data(e.data).enter().append("li").append("p").text("hah");
        };
        return HTMLRender;
    }());
    exports.HTMLRender = HTMLRender;
    var CanvasRender = (function () {
        function CanvasRender() {
        }
        CanvasRender.prototype.titleRender = function (e) {
            var div = d3.select(e.chart.wrapper.node()).append("div")
                .style("position", "absolute")
                .style("left", e.layout.x() + "px")
                .style("top", e.layout.y() + "px")
                .style("height", e.layout.h() + "px")
                .style("width", e.layout.w() + "px");
            div.append("p").classed(e.data.class, true).text(e.data.value);
        };
        CanvasRender.prototype.axisRender = function (e, domain, position) {
            var d = d3.select(e.chart.wrapper.node()).append("div")
                .style("position", "absolute")
                .style("left", e.layout.x() + "px")
                .style("top", e.layout.y() + "px")
                .style("height", e.layout.h() + "px")
                .style("width", e.layout.w() + "px");
        };
        CanvasRender.prototype.chartRender = function (e) {
        };
        CanvasRender.prototype.legendRender = function (e) {
        };
        return CanvasRender;
    }());
    exports.CanvasRender = CanvasRender;
});
//# sourceMappingURL=Utils.js.map