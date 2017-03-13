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
define(["require", "exports", "lib/d3", "./Evented", "./Utils", "lib/underscore", "lib/d3"], function (require, exports, d3, Evented_1, Utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var a = document.createElement;
    var ChartElement = (function (_super) {
        __extends(ChartElement, _super);
        function ChartElement(type, l, d, chart) {
            var _this = _super.call(this) || this;
            _this.type = type;
            _this.layout = l;
            _this.data = d;
            _this.chart = chart;
            return _this;
        }
        return ChartElement;
    }(Evented_1.Evented));
    var CompareChart = (function (_super) {
        __extends(CompareChart, _super);
        function CompareChart(cfg) {
            var _this = _super.call(this) || this;
            _this.config = {
                class: "CompareChart",
                title: {
                    value: "",
                    class: "title",
                    visiable: true
                },
                xTitle: {
                    value: "",
                    class: "xTitle",
                    visiable: true
                },
                yTitle: {
                    value: "",
                    class: "yTitle",
                    visiable: true
                },
                y2Title: {
                    value: "",
                    class: "y2Title",
                    visiable: true
                },
                width: 300,
                height: 300
            };
            _this.wrapper = new Utils_1.Layout();
            _this.canvas = {
                node: new Utils_1.Layout(),
                legend: new Utils_1.Layout(),
                title: new Utils_1.Layout(),
                xTitle: new Utils_1.Layout(),
                yTitle: new Utils_1.Layout(),
                y2Title: new Utils_1.Layout(),
                xAxis: new Utils_1.Layout("svg"),
                yAxis: new Utils_1.Layout("svg"),
                y2Axis: new Utils_1.Layout("svg"),
                chart: new Utils_1.Layout("svg")
            };
            _this.legend = {
                getHeight: function (o) {
                    return 0;
                },
                getWidth: function (o) {
                    return 0;
                }
            };
            _.each(cfg, function (v, k) {
                _this.config[k] = v;
            });
            return _this;
        }
        CompareChart.prototype.addMeasure = function (nm) {
            var i = _.findIndex(this.measures, function (m) { return nm.id == m.id; });
            if (i != -1) {
                this.measures[i] = nm;
            }
            else {
                this.measures.push(nm);
            }
            this.fire("measure-add", nm);
            return this;
        };
        CompareChart.prototype.getMeasures = function () {
            return this.measures;
        };
        CompareChart.prototype.getDomain = function (ms, type, revert) {
            var r = [];
            if (!ms) {
                r = [0, 1];
            }
            else {
                var mss = _.reduce(ms, function (m1, m2) { return m1.plunkDatas(type).concat(m1.plunkDatas(type)); });
                r[0] = Utils_1.Util.min(mss);
                r[1] = Utils_1.Util.max(mss);
            }
            if (revert) {
                var t = r[0];
                r[0] = r[1];
                r[1] = t;
            }
            return r;
        };
        CompareChart.prototype.stringRect = function (con) {
            var ccls = this.config.class + " " + con.cls;
            return Utils_1.Util.getStringRect(con.value, ccls);
        };
        CompareChart.prototype.getScale = function (domain, range) {
            return d3.scaleLinear().domain(domain).range(range);
        };
        CompareChart.prototype.beforeDraw = function () {
        };
        CompareChart.prototype.calculateLayout = function () {
            var c = this.canvas;
            var con = this.config;
            // if(this.config.height>this.config.width){
            //     con.
            // }
            c.node.x(0);
            c.node.y(0);
            c.node.w(this.config.width);
            c.node.h(this.config.height);
            if (this.config.title.visiable) {
                c.title.x(0);
                c.title.y(0);
                this.canvas.title.w(c.node.w());
                this.canvas.title.h(this.stringRect(this.config.title).height);
            }
            if (con.xTitle.visiable) {
                c.xTitle.x(0);
                c.xTitle.y(c.node.h() - this.legend.getHeight("bottom"));
                c.xTitle.w(this.stringRect(c.xTitle).width);
                c.xTitle.h(this.stringRect(c.xTitle).height);
            }
            c.xAxis.h(30);
            c.xAxis.y(c.node.h() - c.xTitle.h() - c.xAxis.h() - this.legend.getHeight("bottom"));
            c.chart.y(c.title.h());
            c.chart.h(c.node.h() - c.title.h() - c.xAxis.h() - c.xTitle.h() - this.legend.getHeight("bottom"));
            ////calculate x 
            if (con.yTitle.visiable) {
                c.yTitle.x(0);
                c.yTitle.y(0);
                c.yTitle.h(this.stringRect(c.yTitle).height);
                c.yTitle.w(this.stringRect(c.yTitle).width);
            }
            c.yAxis.w(30);
            c.yAxis.h(c.chart.h());
            c.yAxis.x(c.yTitle.w() + c.yAxis.w());
            c.yAxis.y(c.title.h());
            c.y2Title.w(this.stringRect(c.y2Title).width);
            c.y2Title.h(this.stringRect(c.y2Title).height);
            if (con.y2Title.visiable) {
                c.y2Axis.w(30);
                c.y2Axis.h(c.chart.h());
                c.y2Axis.x(c.node.w() - c.y2Axis.w() - c.y2Title.w());
                c.y2Axis.y(c.title.h());
            }
            c.y2Title.x(c.node.w() - c.y2Title.w() - this.legend.getWidth("right"));
            c.y2Title.y(c.title.h());
            c.y2Title.y();
            c.chart.x(c.yAxis.w() + c.yTitle.w());
            c.chart.w(c.node.w() - c.yTitle.w() - c.yAxis.w() - c.y2Axis.w() - c.y2Title.w());
            c.xAxis.x(c.yTitle.w() + c.yAxis.w());
            c.xAxis.w(c.chart.w());
            c.y2Title.h(c.chart.h());
            c.yTitle.h(c.chart.h());
            c.xTitle.w(c.chart.w());
        };
        CompareChart.prototype.prepareCanvas = function () {
            this.wrapper.node(d3.select("#chart").append("div").classed(this.config.class, true).node());
            d3.select(this.wrapper.node()).style("position", "absolute");
            // this.canvas.node.node(d3.select(this.wrapper.node()).append("svg").node());
            // let node = d3.select(this.canvas.node.node())
            // let c=this.canvas
            // c.title.node(node.append("g").classed("title",true).node())
            // c.xAxis.node(node.append("g").classed("xAxis",true).node())
            // c.xTitle.node(node.append("g").classed("xTitle",true).node())
            // c.yTitle.node(node.append("g").classed("yTitle",true).node())
            // c.yAxis.node(node.append("g").classed("yAxis",true).node())
            // c.y2Title.node(node.append("g").classed("y2Title",true).node())
            // c.y2Axis.node(node.append("g").classed("y2Axis",true).node())
        };
        CompareChart.prototype.toElements = function (canvas, measures) {
            var r = [], chart = this;
            r.push(new ChartElement("chart", this.canvas.chart, this.measures, this));
            r.push(new ChartElement("title", this.canvas.title, this.config.title.value, this));
            r.push(new ChartElement("title", this.canvas.xTitle, this.config.xTitle.value, this));
            r.push(new ChartElement("title", this.canvas.yTitle, this.config.yTitle.value, this));
            r.push(new ChartElement("title", this.canvas.y2Title, this.config.y2Title.value, this));
            r.push(new ChartElement("axis", this.canvas.xAxis, "bottom", this));
            r.push(new ChartElement("axis", this.canvas.yAxis, "left", this));
            r.push(new ChartElement("axis", this.canvas.y2Axis, "right", this));
            return r;
        };
        CompareChart.prototype.getChartLayout = function () {
            return this.canvas.chart;
        };
        CompareChart.prototype.render = function () {
            this.prepareCanvas();
            this.calculateLayout();
            var renderer = this.renderer;
            this.toElements(this.canvas, this.measures).forEach(titleRender);
            this.toElements(this.canvas, this.measures).forEach(axisRender);
        };
        CompareChart.prototype.renderer = function (e) {
            if (e.type !== "node") {
                switch (e.layout.render) {
                    case "svg":
                        d3.select(e.chart.wrapper.node()).append("svg")
                            .style("position", "absolute")
                            .style("left", e.layout.x() + "px")
                            .style("top", e.layout.y() + "px")
                            .style("height", e.layout.h() + "px")
                            .style("width", e.layout.w() + "px")
                            .attr("type", e.type);
                        break;
                    case "html":
                        d3.select(e.chart.wrapper.node()).append("div")
                            .style("position", "absolute")
                            .style("left", e.layout.x() + "px")
                            .style("top", e.layout.y() + "px")
                            .style("height", e.layout.h() + "px")
                            .style("width", e.layout.w() + "px")
                            .attr("type", e.type);
                        break;
                }
            }
        };
        CompareChart.prototype.updateCanvasLayout = function () {
            var c = this.canvas;
            var con = this.config;
            var translater = function (x, y) {
                if (x != undefined && y != undefined) {
                    return "translate(" + x + "px," + y + "px)";
                }
                return "";
            };
            var updater = function (l) {
                d3.select(l.node()).style("transform", translater(l.x(), l.y()));
            };
            var clipper = function (l) {
            };
            _.each(this.canvas, function (v, k) {
                updater(v);
            });
        };
        return CompareChart;
    }(Evented_1.Evented));
    exports.CompareChart = CompareChart;
    var titleRender = function (e) {
        if (e.layout.render === "html") {
            var div = d3.select(e.chart.wrapper.node()).append("div")
                .style("position", "absolute")
                .style("left", e.layout.x() + "px")
                .style("top", e.layout.y() + "px")
                .style("height", e.layout.h() + "px")
                .style("width", e.layout.w() + "px")
                .attr("type", e.type);
            div.append("p").text(e.data);
        }
    };
    var axisRender = function (e) {
        if (e.layout.render === "svg") {
            var d = d3.select(e.chart.wrapper.node()).append("svg")
                .style("position", "absolute")
                .style("left", e.layout.x() + "px")
                .style("top", e.layout.y() + "px")
                .style("height", e.layout.h() + "px")
                .style("width", e.layout.w() + "px")
                .attr("type", e.type);
            var axis = null;
            if (e.data === "left") {
                var scale = d3.scaleLinear().domain(e.chart.getDomain(e.chart.getMeasures(), "y", true)).range([0, e.layout.h()]);
                axis = d3.axisLeft(scale);
                d.style("left", e.layout.x() - e.layout.w() + "px");
                d.style("width", e.layout.w() + 2 + "px");
                d.append("g").style("transform", "translate(" + (e.layout.w()) + "px,0px)").call(axis);
                //d.call(axis)
            }
            if (e.data === "right") {
                var scale = d3.scaleLinear().domain(e.chart.getDomain(e.chart.getMeasures(), "y2", true)).range([0, e.layout.h()]);
                axis = d3.axisRight(scale);
                d.call(axis);
            }
            if (e.data === "bottom") {
                var scale = d3.scaleLinear().domain(e.chart.getDomain(e.chart.getMeasures(), "x")).range([0, e.layout.w()]);
                axis = d3.axisBottom(scale);
                d.call(axis);
            }
        }
    };
});
//# sourceMappingURL=CompareChart.js.map