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
    var ChartElement = (function (_super) {
        __extends(ChartElement, _super);
        function ChartElement() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.config = {};
            _this.isInit = false;
            _this.internalStatus = {};
            return _this;
        }
        ChartElement.prototype.render = function () { };
        ChartElement.prototype.reRender = function () { };
        ChartElement.prototype.setChart = function (c) {
            this.chart = c;
            return this;
        };
        ChartElement.prototype.setLayout = function (l) {
            this.layout = l;
            this.layout.on("change", this.reRender, this);
            return this;
        };
        ChartElement.prototype.setStyle = function (s) {
            this.style = s;
            // s.on("change",this.reRender,this)
            return this;
        };
        ChartElement.prototype.setConfig = function (c) {
            this.config = c;
            return this;
        };
        return ChartElement;
    }(Evented_1.Evented));
    exports.ChartElement = ChartElement;
    var AxisElement = (function (_super) {
        __extends(AxisElement, _super);
        function AxisElement(c) {
            var _this = _super.call(this) || this;
            _this.setChart(c);
            c.on("render", _this.render, _this);
            _this.ctx = c.ctx();
            _this.internalStatus.domain = [];
            return _this;
        }
        AxisElement.prototype.domainFn = function () { };
        AxisElement.prototype.setDomainFn = function (fn) {
            this.domainFn = fn;
            return this;
        };
        AxisElement.prototype.render = function () {
            var ctx = this.chart.ctx();
            var newDomain = this.domainFn();
            if (newDomain[0] != this.internalStatus.domain[0] || newDomain[1] != this.internalStatus.domain[1]) {
                this.internalStatus.domain = newDomain;
                this._rerender(this, newDomain, this.layout.getPosition());
            }
            this.isInit = true;
        };
        AxisElement.prototype.reRender = function () {
            if (this.isInit) {
                this._rerender(this, this.internalStatus.domain, this.layout.getPosition());
            }
        };
        AxisElement.prototype._rerender = function (e, domain, position) {
            var d = e.layout.getNode() ? d3.select(e.layout.getNode()) : d3.select(e.chart.wrapper.getNode()).append("svg");
            d.style("position", "absolute")
                .style("height", e.chart.config.height + "px")
                .style("width", e.chart.config.width + "px")
                .style("pointer-events", "none")
                .classed(e.style.getClass(), true);
            d.selectAll("*").remove();
            var g = d.append("g").style("transform", "translate(" + e.layout.getX() + "px ," + e.layout.getY() + "px)");
            if (position === "left") {
                var scale = d3.scaleLinear().domain(domain).range([0, e.layout.getH()]);
                var axis = d3.axisLeft(scale);
                if (e.config.format) {
                    axis.tickFormat(e.config.format);
                }
                // d.style("left", e.layout.getX() - e.layout.getW() + "px")
                // d.style("width", e.layout.getW() + 2 + "px")
                // d.style("height",e.layout.getH())
                g.call(axis);
                g.selectAll("g").append("line").attr("x1", 0).attr("y1", 0.5).attr("x2", this.chart.ctx("chart-width")).attr("y2", 0.5).style("stroke", "black");
                //g.append("g").style("transform", "translate(" + (e.layout.getW()) + "px,0px)").call(axis)
            }
            if (position === "right") {
                var scale = d3.scaleLinear().domain(domain).range([0, e.layout.getH()]);
                var axis = d3.axisRight(scale);
                if (e.config.format) {
                    axis.tickFormat(e.config.format);
                }
                g.call(axis);
            }
            if (position === "bottom") {
                var scale = d3.scaleLinear().domain(domain).range([0, e.layout.getW()]);
                var axis = d3.axisBottom(scale);
                if (e.config.format) {
                    axis.tickFormat(e.config.format);
                }
                g.call(axis);
            }
            e.layout.setNode(d.node());
        };
        return AxisElement;
    }(ChartElement));
    exports.AxisElement = AxisElement;
    var TitleElement = (function (_super) {
        __extends(TitleElement, _super);
        function TitleElement(c) {
            var _this = _super.call(this) || this;
            _this.internalStatus = {};
            _this.setChart(c);
            c.on("render", _this.render, _this);
            _this.ctx = c.ctx();
            return _this;
        }
        TitleElement.prototype.render = function () {
            var e = this;
            if (this.internalStatus.value != e.config.value) {
                var div = e.layout.getNode() ? d3.select(e.layout.getNode()) : d3.select(e.chart.wrapper.getNode()).append("div");
                div.style("position", "absolute")
                    .style("left", e.layout.getX() + "px")
                    .style("top", e.layout.getY() + "px")
                    .style("height", e.layout.getH() + "px")
                    .style("width", e.layout.getW() + "px");
                e.layout.setNode(div.node());
                div.node().innerHTML = "";
                div.append("p").classed(e.style.getClass(), true).text(e.config.value);
            }
            this.isInit = true;
        };
        TitleElement.prototype.reRender = function () {
            if (!this.isInit) {
                return;
            }
            var e = this;
            var div = e.layout.getNode() ? d3.select(e.layout.getNode()) : d3.select(e.chart.wrapper.getNode()).append("div");
            div.style("position", "absolute")
                .style("left", e.layout.getX() + "px")
                .style("top", e.layout.getY() + "px")
                .style("height", e.layout.getH() + "px")
                .style("width", e.layout.getW() + "px");
            e.layout.setNode(div.node());
            div.node().innerHTML = "";
            div.append("p").classed(e.style.getClass(), true).text(e.config.value);
        };
        return TitleElement;
    }(ChartElement));
    exports.TitleElement = TitleElement;
    var LegendElement = (function (_super) {
        __extends(LegendElement, _super);
        function LegendElement(c) {
            var _this = _super.call(this) || this;
            _this.setChart(c);
            c.on("render", _this.render, _this);
            _this.ctx = c.ctx();
            return _this;
        }
        LegendElement.prototype.setLegendDataFn = function (f) {
            this.getLegendFn = f;
            return this;
        };
        LegendElement.prototype.getLegendFn = function () { return []; };
        LegendElement.prototype.render = function () {
            var _this = this;
            var e = this;
            var div = e.layout.getNode() ? d3.select(e.layout.getNode()) : d3.select(e.chart.wrapper.getNode()).append("div");
            div.style("position", "absolute")
                .style("left", e.layout.getX() + "px")
                .style("top", e.layout.getY() + "px")
                .style("height", e.layout.getH() + "px")
                .style("width", e.layout.getW() + "px")
                .classed("legend", true);
            e.layout.setNode(div.node());
            div.node().innerHTML = "";
            div.append("ul").selectAll("li").data(this.getLegendFn()).enter().append("li").append("p")
                .text(function (d) { return d.name; }).on("click", function (d) {
                _this.chart.getMeasures().filter(function (m) { return m.id == d.id; })
                    .forEach(function (m) { return m.style.setStroke("blue"); });
            });
        };
        LegendElement.prototype.reRender = function () {
            this.render();
        };
        return LegendElement;
    }(ChartElement));
    exports.LegendElement = LegendElement;
    var CompareChartCanvasElement = (function (_super) {
        __extends(CompareChartCanvasElement, _super);
        function CompareChartCanvasElement(c) {
            var _this = _super.call(this) || this;
            _this.setChart(c);
            c.on("render", _this.render, _this);
            _this.ctx = c.ctx();
            return _this;
        }
        CompareChartCanvasElement.prototype.dataFn = function () { return []; };
        CompareChartCanvasElement.prototype.setDataFn = function (f) {
            this.dataFn = f;
            return this;
        };
        CompareChartCanvasElement.prototype.render = function () {
            var _this = this;
            var e = this;
            d3.scaleLinear();
            var xScale = e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(), "x"), [0, e.layout.getW()]);
            var yScale = e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(), "y", true), [0, e.layout.getH()]);
            var y2Scale = e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(), "y2", true), [0, e.layout.getH()]);
            var c = e.layout.getNode() ? d3.select(e.layout.getNode()) : d3.select(e.chart.wrapper.getNode()).append("svg");
            c.style("position", "absolute")
                .style("left", e.layout.getX() + "px")
                .style("top", e.layout.getY() + "px")
                .style("height", e.layout.getH() + "px")
                .style("width", e.layout.getW() + "px");
            c.selectAll("*").remove();
            e.layout.setNode(c.node());
            var d = [].concat(this.dataFn());
            this.chart.ctx("CompareChart", this.chart);
            this.chart.ctx("canvas", this);
            this.chart.ctx("barIndex", {});
            d.map(function (v, k) {
                return v.toSymbolies(e.layout.getNode(), xScale, yScale, _this.chart.ctx());
            }).reduce(function (s1, s2) { return s1.concat(s2); }).sort(function (s1, s2) { return s1.z_index - s2.z_index; }).forEach(function (s) { return s.render(); });
            // let ss=d.map((v:CompareChartMeasure)=>v.toSymbolies(e.layout.getNode(),xScale,yScale,this.chart.ctx())).reduce((s1,s2)=>s1.concat(s2))
            // ss.forEach((s)=>s.render(true))
        };
        CompareChartCanvasElement.prototype.reRender = function () {
            if (this.isInit) {
                this.render();
            }
        };
        return CompareChartCanvasElement;
    }(ChartElement));
    exports.CompareChartCanvasElement = CompareChartCanvasElement;
    var XAreaEventElement = (function (_super) {
        __extends(XAreaEventElement, _super);
        function XAreaEventElement(c) {
            var _this = _super.call(this) || this;
            _this.symbolies = [];
            _this.setChart(c);
            c.on("render", _this.render, _this);
            _this.ctx = c.ctx();
            return _this;
        }
        XAreaEventElement.prototype.render = function () {
            var _this = this;
            var w = Math.ceil(this.layout.getW() / 5);
            var c = this.layout.getNode() ? d3.select(this.layout.getNode()) : d3.select(this.chart.wrapper.getNode()).append("svg");
            c.style("position", "absolute")
                .style("left", this.layout.getX() + "px")
                .style("top", this.layout.getY() + "px")
                .style("height", this.layout.getH() + "px")
                .style("width", this.layout.getW() + "px");
            c.on("mousemove", function () {
                var mp = d3.mouse(c.node());
                _this.symbolies.forEach(function (s) {
                    if (s.isInsharp(mp[0], mp[1])) {
                        // d3.select(s.node).classed("hover",true)
                        s.style.setStroke("blue", "hover");
                    }
                    else {
                        s.style.reset("hover");
                    }
                });
            });
            c.on("mouseout", function () {
                _this.symbolies.forEach(function (s) {
                    s.style.reset("stroke");
                });
            });
            c.on("click", function () {
                var mp = d3.mouse(c.node());
                var selected = [];
                _this.symbolies.filter(function (s) { return s.isInsharp(mp[0], mp[1]); }).forEach(function (s) {
                    if (s.data.selected) {
                        s.data.selected = false;
                        s.style.reset("selected");
                    }
                    else {
                        selected.push(s);
                        s.data.selected = true;
                        s.style.setOpacity(0.2, "selected");
                    }
                });
                _this.chart.fire("selected", selected);
            });
            c.selectAll("*").remove();
            this.layout.setNode(c.node());
            this.updateSymbolies();
        };
        XAreaEventElement.prototype.dataFn = function () { return []; };
        XAreaEventElement.prototype.setDataFn = function (f) {
            this.dataFn = f;
            return this;
        };
        XAreaEventElement.prototype.addSymbole = function (s) {
            this.symbolies.push(s);
            // let w=Math.ceil(this.layout.getW()/5)
            // let i= Math.floor(s.x/w)
            // i=i>0?i:0
            // if(this.symbolies[i]){
            //     this.symbolies[i].push(s)
            // }else{
            //     this.symbolies[i]=[]
            //     this.symbolies[i].push(s)
            // }
        };
        XAreaEventElement.prototype.updateSymbolies = function () {
            var _this = this;
            this.symbolies = [];
            this.dataFn().forEach(function (s) {
                _this.addSymbole(s);
            });
        };
        return XAreaEventElement;
    }(ChartElement));
    exports.XAreaEventElement = XAreaEventElement;
    var CompareChartActiveElement = (function (_super) {
        __extends(CompareChartActiveElement, _super);
        function CompareChartActiveElement(c) {
            var _this = _super.call(this) || this;
            _this.setChart(c);
            c.on("render", _this.render, _this);
            _this.ctx = c.ctx;
            return _this;
        }
        CompareChartActiveElement.prototype.render = function () {
            var c = this.layout.getNode() ? d3.select(this.layout.getNode()) : d3.select(this.chart.wrapper.getNode()).append("svg");
            c.style("position", "absolute")
                .style("left", this.layout.getX() + "px")
                .style("top", this.layout.getY() + "px")
                .style("height", this.layout.getH() + "px")
                .style("width", this.layout.getW() + "px");
            c.selectAll("*").remove();
            this.layout.setNode(c.node());
        };
        return CompareChartActiveElement;
    }(ChartElement));
    exports.CompareChartActiveElement = CompareChartActiveElement;
});
//# sourceMappingURL=ChartElement.js.map