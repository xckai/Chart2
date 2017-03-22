define(["require", "exports", "lib/d3", "lib/underscore"], function (require, exports, d3) {
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
            this._w = 0;
            this._h = 0;
            this._x = 0;
            this._y = 0;
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