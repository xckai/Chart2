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
        define(["require", "exports", "lib/underscore", "./Evented"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Evented_1 = require("./Evented");
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
        Util.d3Invoke = curry(function (method, obj) {
            return function (d3Selection) {
                _.each(obj, function (v, k) {
                    d3Selection[method](k, v);
                });
                return d3Selection;
            };
        });
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
        function curry(f) {
            var arity = f.length;
            return function f1(r1, r2, r3) {
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
        Util.curry = curry;
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
        function Style(stroke, fillColor, opacity, width, dashArray) {
            var _this = _super.call(this) || this;
            _this._d = [];
            _this._fontFamily = "arial,sans-serif";
            _this.setStroke(stroke || "black");
            _this.setFillColor(fillColor || "black");
            _this.setOpacity(opacity || 1);
            _this.setLineWidth(width || 2);
            _this.setDashArray(dashArray || "");
            return _this;
            // this._stroke =stroke||this._stroke;
            // this._fillColor =fillColor||this._fillColor
            // this._opacity =opacity||this._opacity
            // this._lineWidth=width||this._lineWidth
            // this._dashArray=dashArray||this._dashArray
        }
        Style.prototype._get = function (key, ns) {
            if (ns) {
                return _.findWhere(this._d, { name: ns })[key];
            }
            var v = "";
            this._d.forEach(function (d) {
                v = d[key] || v;
            });
            return v;
        };
        Style.prototype._set = function (k, v, namespace) {
            var name = namespace || "default";
            if (_.some(this._d, { name: name })) {
                var obj = _.findWhere(this._d, { name: name });
                obj[k] = v;
            }
            else {
                var obj = { name: name };
                obj[k] = v;
                this._d.push(obj);
            }
            this.fire("change");
            return this;
        };
        // _temp={}
        // ctx(s){return s}
        // private _font:any=14
        // _stroke:string ="black"
        // _fillColor:string ="black"
        // _opacity:number =1
        // _lineWidth:number=1
        // _rx:number=2
        // _ry:number=2
        // _visiable=true
        // _dashArray=""
        // set font(f:any){
        //     if(!isNaN(f)){
        //         this._font=f;
        //     }
        //     if(Util.isEndWith(f,"px")){
        //         this._font=parseFloat(f);
        //     }
        //     if(Util.isEndWith(f,"em")||Util.isEndWith(f,"rem")){
        //         let font=window.getComputedStyle(document.body).getPropertyValue('font-size')||16
        //         this._font=parseFloat(f) * parseFloat(font)
        //     }
        //     this.fire("change")
        // }
        // get font(){
        //     return this._font
        // }
        Style.prototype.equal = function (s) {
            return this._get("stroke", "default") == s._get("stroke", "default") && this._get("line-width", "default") == s._get("line-width", "default") && this._get("opacity", "default") == s._get("opacity", "default");
        };
        Style.prototype.getStroke = function () {
            return this._get("stroke");
        };
        Style.prototype.getFillColor = function () {
            return this._get("fill-color");
        };
        Style.prototype.getLineWidth = function () {
            return this._get("line-width");
        };
        Style.prototype.getRx = function () {
            return this._get("rx");
        };
        Style.prototype.getClass = function () {
            return this._get("class");
        };
        Style.prototype.getRy = function () {
            return this._get("ry");
        };
        Style.prototype.getOpacity = function () {
            return this._get("opacity");
        };
        Style.prototype.getVisiable = function () {
            return this._get("visiable");
        };
        Style.prototype.getDashArray = function () {
            return this._get("dash-array");
        };
        Style.prototype.setFillColor = function (c, ns) {
            return this._set("fill-color", c, ns);
        };
        Style.prototype.setDashArray = function (d, ns) {
            return this._set("dash-array", d, ns);
        };
        Style.prototype.setClass = function (d, ns) {
            return this._set("class", d, ns);
        };
        Style.prototype.setVisiable = function (d, ns) {
            return this._set("visiable", d, ns);
        };
        Style.prototype.setLineWidth = function (d, ns) {
            return this._set("line-width", d, ns);
        };
        Style.prototype.setColor = function (d, ns) {
            return this._set("color", d, ns);
        };
        Style.prototype.setStroke = function (d, ns) {
            return this._set("stroke", d, ns);
        };
        Style.prototype.setOpacity = function (d, ns) {
            return this._set("opacity", d, ns);
        };
        // setDefaultFillColor(f){
        //     this._fillColor=f
        //     this.fire("change")
        //     return this
        // }
        // setDefaultClass(c){
        //     this._class=c
        //     return this
        // }
        // setDefaultVisiable(v){
        //     this._visiable=v
        //     this.fire("change")
        //     return this
        // }
        // setDefaultDashArray(a){
        //     this._dashArray=a
        //     this.fire("change")
        // }
        // setDefaultLineWidth(d){
        //     this._lineWidth=d
        //     this.fire("change")
        // }
        // setDefaultStroke(s){
        //     this._stroke=s
        //     this.fire("change")
        // }
        // setDefaultOpacity(o){
        //     this._opacity=o
        //     this.fire("change")
        // }
        Style.prototype.reset = function (ns) {
            var nd = [];
            _.each(this._d, function (d) {
                if (d["name"] != ns) {
                    nd.push(d);
                }
            });
            this._d = nd;
            this.fire("change");
            return this;
        };
        Style.prototype.clone = function (s) {
            this._d = JSON.parse(JSON.stringify(s._d));
            this.fire("change");
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
        if (ds.length < 2)
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
});
// export class HTMLRender implements IChartElementRender{
//       titleRender(e:IChartElement){
//         let div =e.layout.node()?d3.select(e.layout.node()) :d3.select(e.chart.wrapper.node()).append("div")
//             div.style("position", "absolute")
//             .style("left", e.layout.x() + "px")
//             .style("top", e.layout.y() + "px")
//             .style("height", e.layout.h() + "px")
//             .style("width", e.layout.w() + "px")
//         e.layout.node(div.node())
//         div.node().innerHTML=""
//         div.append("p").classed(e.data.class, true).text(e.data.value)  
//     }
//      axisRender(e:IChartElement,domain,position:string){
//     }
//     chartRender(e:CompareChartElement){
//     }
//     legendRender(e:CompareChartElement){
//         let div =e.layout.node()?d3.select(e.layout.node()) :d3.select(e.chart.wrapper.node()).append("div")
//             div.style("position", "absolute")
//             .style("left", e.layout.x() + "px")
//             .style("top", e.layout.y() + "px")
//             .style("height", e.layout.h() + "px")
//             .style("width", e.layout.w() + "px")
//             .classed("legend",true)
//         e.layout.node(div.node())
//         div.node().innerHTML=""
//         div.append("ul").selectAll("li").data(e.data).enter().append("li").append("p").text("hah")
//     }
// }
// export class CanvasRender implements IChartElementRender{
//       titleRender(e:IChartElement){
//         let div = d3.select(e.chart.wrapper.node()).append("div")
//             .style("position", "absolute")
//             .style("left", e.layout.x() + "px")
//             .style("top", e.layout.y() + "px")
//             .style("height", e.layout.h() + "px")
//             .style("width", e.layout.w() + "px")
//         div.append("p").classed(e.data.class, true).text(e.data.value)  
//     }
//      axisRender(e:IChartElement,domain,position:string){
//         let d = d3.select(e.chart.wrapper.node()).append("div")
//             .style("position", "absolute")
//             .style("left", e.layout.x() + "px")
//             .style("top", e.layout.y() + "px")
//             .style("height", e.layout.h() + "px")
//             .style("width", e.layout.w() + "px")
//     }
//      chartRender(e:CompareChartElement){
//     }
//     legendRender(e:CompareChartElement){
//     }
// }
//# sourceMappingURL=Utils.js.map