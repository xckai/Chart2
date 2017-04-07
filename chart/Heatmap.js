(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "lib/underscore", "lib/d3"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var d3 = require("lib/d3");
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
    })(Util || (Util = {}));
    var Heatmap = (function () {
        function Heatmap() {
            this._ctx = {};
            this._layout = {
                chart_h: 0,
                chart_w: 0,
                title_h: 0,
                xAxis_h: 0,
                yAxis_w: 0,
                infoBar_h: 0
            };
            this.stringRect = Util.CacheAble(Util.getStringRect, function () {
                var s = "";
                s += arguments[0].length;
                if (arguments[1] != undefined) {
                    s += arguments[1];
                }
                if (arguments[2] != undefined) {
                    s += arguments[2];
                }
                return s;
            });
            this._config = {
                width: 600,
                height: 800,
                x: "x",
                y: "y",
                value: "value",
                xSort: null,
                ySort: null,
                xFormat: null,
                yFormat: null,
                title: "ahha",
                color: {
                    from: "blue",
                    to: "red",
                    noData: "gray"
                },
                appendId: null,
                toolTipTemplate: "<table class='tool-tip-table' ><tbody><tr><td>{{xLabel}}:</td><td>{{x}}</td></tr> <tr><td>{{yLabel}}:</td><td>{{y}}</td></tr> <tr><td>{{valueLabel}}:</td><td>{{value}}</td></tr></tbody><table>",
                label: {
                    xLabel: "列",
                    yLabel: "行",
                    valueLabel: "值",
                    noData: "无数据"
                }
            };
            this._node = {};
        }
        Heatmap.prototype.setConfig = function (c) {
            var _this = this;
            _.each(c, function (v, k) {
                _this._config[k] = v;
            });
            return this;
        };
        Heatmap.prototype.setData = function (ds) {
            this._ds = ds;
            return this;
        };
        Heatmap.prototype.getColor = function (v) {
            this.colors = this.colors ? this.colors : d3.scaleLinear()
                .domain(this.getDomain())
                .range([this._config.color.from, this._config.color.to]);
            return this.colors(v);
        };
        Heatmap.prototype.getX = function (noFormat) {
            var _this = this;
            var tx = _.pluck(this._ds, this._config.x);
            var n = [];
            _.each(tx, function (x) {
                _.contains(n, x) ? null : n.push(x);
            });
            if (this._config.xSort) {
                n = n.sort(this._config.xSort);
            }
            if (this._config.xFormat && !noFormat) {
                n = n.map(function (v) { return _this._config.xFormat(v); });
            }
            return n;
        };
        Heatmap.prototype.getY = function (noFormat) {
            var _this = this;
            var t = _.pluck(this._ds, this._config.y);
            var n = [];
            _.each(t, function (v) {
                _.contains(n, v) ? null : n.push(v);
            });
            if (this._config.ySort) {
                n = n.sort(this._config.ySort);
            }
            if (this._config.yFormat && !noFormat) {
                n = n.map(function (v) { return _this._config.yFormat(v); });
            }
            return n;
        };
        Heatmap.prototype.getXIndex = function (d) {
            var xs = this.getX();
            var v = this._config.xFormat ? this._config.xFormat(d[this._config.x]) : d[this._config.x];
            return _.findIndex(xs, function (x) { return x == v; });
        };
        Heatmap.prototype.getYIndex = function (d) {
            var ys = this.getY();
            var v = this._config.yFormat ? this._config.yFormat(d[this._config.y]) : d[this._config.y];
            //let xi=_.findIndex(xs,this._config.xFormat?this._config.xFormat(d[this._config.x]):d[this._config.x])
            return _.findIndex(ys, function (y) { return y == v; });
        };
        Heatmap.prototype.getDomain = function () {
            var d = _.pluck(this._ds, this._config.value);
            var max = _.max(d);
            var min = _.min(d);
            max = isNaN(max) ? 1 : max;
            min = isNaN(min) ? 0 : min;
            return [min, max];
        };
        Heatmap.prototype.getXAxisRect = function (cls) {
            var _this = this;
            var w = 0, h = 0;
            this.getX().forEach(function (x) {
                var rect = _this.stringRect(x, cls);
                w = Math.max(rect.width, w);
                h = Math.max(rect.height, h);
            });
            return { width: w, height: h };
        };
        Heatmap.prototype.getYAxisRect = function (cls) {
            var _this = this;
            var w = 0, h = 0;
            this.getY().forEach(function (x) {
                var rect = _this.stringRect(x, cls);
                w = Math.max(rect.width, w);
                h = Math.max(rect.height, h);
            });
            return { width: w, height: h };
        };
        Heatmap.prototype.beforeRender = function () {
            if (this.getX().length < 1 || this.getY().length < 1) {
                return false;
            }
            var l = this._layout;
            l.infoBar_h = 35;
            l.yAxis_w = this.getYAxisRect("yAxis").width + 2;
            this._ctx["yAxisClass"] = "yAxis";
            //title
            l.title_h = Util.getStringRect(this._config.title, "title").height + 2;
            //xAxis
            l.xAxis_h = this.getXAxisRect("xAxis").height + 2;
            this._ctx["xAxisClass"] = "xAxis";
            l.chart_h = this._config.height - l.title_h - l.xAxis_h - l.infoBar_h;
            l.chart_w = this._config.width - l.yAxis_w;
            //reCal xAxis
            var xAsxi_w = this.getXAxisRect("xAxis").width;
            var rectWidth = Math.min(this._layout.chart_h / this.getY().length, this._layout.chart_w / this.getX().length);
            this._ctx["rectWidth"] = rectWidth;
            // if(xAsxi_w>rectWidth){
            //     this._ctx["xAxisClass"]="xAxis rotation"
            //     l.xAxis_h=this.getXAxisRect("xAxis rotation").height +5
            // }else{
            //     this._ctx["xAxisClass"]="xAxis"
            //     l.xAxis_h+=5
            // }
            // if(l.yAxis_w>40){
            //     this._ctx["yAxisClass"]="yAxis rotation"
            //     l.yAxis_w=Util.getStringRect(this.getY()[0],"yAxis rotation").width +5
            // }else{
            //     this._ctx["yAxisClass"]="yAxis"
            //     l.yAxis_w+=5
            // }
            l.chart_h = this._config.height - l.title_h - l.xAxis_h - l.infoBar_h;
            l.chart_w = this._config.width - l.yAxis_w;
            return true;
        };
        Heatmap.prototype.showToolTip = function (d, p) {
            _.templateSettings = {
                interpolate: /\{\{(.+?)\}\}/g
            };
            if (d) {
                this._node.tooltip.style("visibility", "");
                d.x = this._config.xFormat ? this._config.xFormat(d[this._config.x]) : d[this._config.x];
                d.y = this._config.yFormat ? this._config.yFormat(d[this._config.y]) : d[this._config.y];
                d.value = d[this._config.value] ? d[this._config.value] : this._config.label.noData;
                this._node.tooltip.selectAll("*").remove();
                this._node.tooltip.node().insertAdjacentHTML("afterbegin", _.template(this._config.toolTipTemplate)(_.extend(d, this._config.label)));
                var x = p.clientX, y = p.clientY;
                var width = this._node.tooltip.node().offsetWidth;
                var height = this._node.tooltip.node().offsetHeight;
                var screenWidth = document.body.clientWidth || 800;
                if (x - width / 2 < 0) {
                    this._node.tooltip.style("left", 10 + "px");
                }
                else if (x + width / 2 > screenWidth) {
                    this._node.tooltip.style("left", (screenWidth - width - 10) + "px");
                }
                else {
                    this._node.tooltip.style("left", x - width / 2 + "px");
                }
                if (y - height - 5 < 0) {
                    this._node.tooltip.style("top", y + 20 + "px");
                }
                else {
                    this._node.tooltip.style("top", y - height - 10 + "px");
                }
            }
            else {
                this._node.tooltip.style("visibility", "hidden");
                this._node.tooltip.selectAll("*").remove();
            }
            //setPosition(p.clientX,p.clientY)
        };
        Heatmap.prototype.showGuildLine = function (od) {
            var d = od || {};
            var chart = this;
            this._node.xAxis.selectAll("g").each(function (_d) {
                var dd = chart._config.xFormat ? chart._config.xFormat(d[chart._config.x]) : d[chart._config.x];
                if (_d == dd) {
                    d3.select(this).classed("dataHover", true);
                }
                else {
                    d3.select(this).classed("dataHover", false);
                }
            });
            this._node.yAxis.selectAll("g").each(function (_d) {
                var dd = chart._config.yFormat ? chart._config.xFormat(d[chart._config.y]) : d[chart._config.y];
                if (_d == dd) {
                    d3.select(this).classed("dataHover", true);
                }
                else {
                    d3.select(this).classed("dataHover", false);
                }
            });
        };
        Heatmap.prototype.render = function () {
            var _this = this;
            if (!this.beforeRender()) {
                console.log("no data");
                return;
            }
            var attrs = Util.d3Invoke("attr"), styles = Util.d3Invoke("style");
            var rectWidth = this._ctx["rectWidth"];
            d3.select("#" + this._config.appendId).selectAll("*").remove();
            var svg = d3.select("#" + this._config.appendId).append("svg").classed("heatmap", true);
            this._node.tooltip = d3.select("#" + this._config.appendId).append("div").style("position", "absolute")
                .style("z-index", "10")
                .style("visibility", "hidden")
                .classed("heatmap", true);
            this._node.svg = svg;
            svg.style("height", this._config.height).style("width", this._config.width);
            svg.append("g").classed("title", true).append("text").text(this._config.title)
                .attr("x", this._config.width / 2)
                .attr("y", 0)
                .style("alignment-baseline", "hanging");
            this._node.yAxis = svg.append("g");
            this._node.yAxis.selectAll("g").data(this.getY()).enter()
                .append("g").style("transform", function (d, i) { return "translate(0px," + ((i + 0.5) * rectWidth + _this._layout.title_h + _this._layout.xAxis_h) + "px)"; });
            var chart = this;
            this._node.yAxis.selectAll("g").each(function (d) {
                d3.select(this).append("rect").classed(chart._ctx["yAxisClass"], true)
                    .call(attrs({
                    x: 0, y: -0.5 * rectWidth, width: chart._layout.yAxis_w, height: rectWidth, fill: "none"
                }));
                d3.select(this).append("text").classed(chart._ctx["yAxisClass"], true)
                    .text(d)
                    .attr("x", 0)
                    .attr("y", 0)
                    .style("alignment-baseline", "central");
            });
            this._node.xAxis = svg.append("g");
            this._node.xAxis.selectAll("g").data(this.getX()).enter().append("g")
                .style("transform", function (d, i) { return "translate(" + (_this._layout.yAxis_w + (i + 0.5) * rectWidth) + "px," + (_this._layout.title_h) + "px)"; });
            this._node.xAxis.selectAll("g").each(function (d) {
                d3.select(this).append("rect").classed(chart._ctx["xAxisClass"], true)
                    .call(attrs({
                    x: 0, y: -0.5 * rectWidth, height: rectWidth, width: chart._layout.xAxis_h, fill: "none"
                }));
                d3.select(this).append("text")
                    .classed(chart._ctx["xAxisClass"], true)
                    .text(d)
                    .attr("x", 0)
                    .attr("y", 0)
                    .style("alignment-baseline", "central");
            });
            this._node.matrix = svg.append("g").style("transform", "translate(" + this._layout.yAxis_w + "px," + (this._layout.title_h + this._layout.xAxis_h) + "px)").classed("matrix", true);
            this._node.matrix.selectAll("rect").data(this.validData(this._ds)).enter().append("rect").attr("x", function (d) { return _this.getXIndex(d) * rectWidth; })
                .attr("y", function (d) { return _this.getYIndex(d) * rectWidth; })
                .attr("width", rectWidth)
                .attr("height", rectWidth)
                .style("fill", function (d) {
                if (isNaN(d[_this._config.value])) {
                    return _this._config.color.noData;
                }
                return _this.getColor(d[_this._config.value]);
            }).on("mousemove", function (d) {
                _this.showToolTip(d, event);
                _this.showGuildLine(d);
            }).on("mouseout", function (d) {
                _this.showToolTip();
                _this.showGuildLine();
            });
            ////inforBar
            this._node.infoBar = svg.append("g").style("transform", "translate(" + this._layout.yAxis_w + "px," + (this._layout.title_h + (this.getY().length) * rectWidth + this._layout.xAxis_h + 10) + "px)").classed("inforBar", true);
            var def = this._node.infoBar.append("defs").append("linearGradient").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", 0).attr("id", "linearColor");
            def.append("stop").attr("offset", "0%").attr("stop-color", this._config.color.from);
            def.append("stop").attr("offset", "100%").attr("stop-color", this._config.color.to);
            var domain = this.getDomain();
            this._node.infoBar.append("rect").call(attrs({
                x: 0,
                y: 0,
                width: this._layout.chart_w / 2,
                height: 10,
                fill: "url(#linearColor)"
            }));
            this._node.infoBar.append("text").call(attrs({
                x: 0, y: 12
            })).text(Math.floor(domain[0])).call(styles({
                "alignment-baseline": "hanging",
                "text-anchor": "begin"
            }));
            this._node.infoBar.append("text").call(attrs({
                x: this._layout.chart_w / 2, y: 12
            })).text(Math.ceil(domain[1])).call(styles({
                "alignment-baseline": "hanging",
                "text-anchor": "end"
            }));
            this._node.infoBar.append("rect").call(attrs({
                x: this._layout.chart_w * 0.6,
                y: 0,
                width: 10,
                height: 10,
                fill: this._config.color.noData
            }));
            this._node.infoBar.append("text").call(attrs({
                x: this._layout.chart_w * 0.6 + 5, y: 12
            })).text(this._config.label.noData).call(styles({
                "alignment-baseline": "hanging",
                "text-anchor": "middle"
            }));
            // .attr().attr("x",0).attr("y",0).attr()
        };
        Heatmap.prototype.validData = function (ds) {
            var _this = this;
            var xs = this.getX(true), ys = this.getY(true);
            var newDs = [];
            var chart = this;
            _.each(xs, function (x) {
                _.each(ys, function (y) {
                    if (!_.some(ds, function (d) { return d[_this._config.x] == x && d[_this._config.y] == y; })) {
                        var _t = {};
                        _t[_this._config.x] = x;
                        _t[_this._config.y] = y;
                        _t[_this._config.value] = undefined;
                        newDs.push(_t);
                    }
                });
            });
            if (newDs.length > 1) {
                return ds.concat(newDs);
            }
            return ds;
        };
        return Heatmap;
    }());
    exports.Heatmap = Heatmap;
});
//# sourceMappingURL=Heatmap.js.map