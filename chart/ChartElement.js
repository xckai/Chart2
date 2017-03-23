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
define(["require", "exports", "./Evented", "lib/d3"], function (require, exports, Evented_1, d3) {
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
            s.on("change", this.reRender, this);
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
                .style("left", e.layout.getX() + "px")
                .style("top", e.layout.getY() + "px")
                .style("height", e.layout.getH() + "px")
                .style("width", e.layout.getW() + "px")
                .classed(e.style.getClass(), true);
            d.selectAll("*").remove();
            if (position === "left") {
                var scale = d3.scaleLinear().domain(domain).range([0, e.layout.getH()]);
                var axis = d3.axisLeft(scale);
                if (e.config.format) {
                    axis.tickFormat(e.config.format);
                }
                d.style("left", e.layout.getX() - e.layout.getW() + "px");
                d.style("width", e.layout.getW() + 2 + "px");
                // d.style("height",e.layout.getH())
                d.append("g").style("transform", "translate(" + (e.layout.getW()) + "px,0px)").call(axis);
            }
            if (position === "right") {
                var scale = d3.scaleLinear().domain(domain).range([0, e.layout.getH()]);
                var axis = d3.axisRight(scale);
                if (e.config.format) {
                    axis.tickFormat(e.config.format);
                }
                d.call(axis);
            }
            if (position === "bottom") {
                var scale = d3.scaleLinear().domain(domain).range([0, e.layout.getW()]);
                var axis = d3.axisBottom(scale);
                if (e.config.format) {
                    axis.tickFormat(e.config.format);
                }
                d.call(axis);
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
            div.append("ul").selectAll("li").data(this.getLegendFn()).enter().append("li").append("p").text("hah");
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
        return CompareChartCanvasElement;
    }(ChartElement));
    exports.CompareChartCanvasElement = CompareChartCanvasElement;
});
//# sourceMappingURL=ChartElement.js.map