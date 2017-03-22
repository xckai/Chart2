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
define(["require", "exports", "lib/d3", "./Evented", "./Utils", "lib/underscore"], function (require, exports, d3, Evented_1, Utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var a = document.createElement;
    var CompareChartElement = (function (_super) {
        __extends(CompareChartElement, _super);
        function CompareChartElement(id, l, chart, data, visiable, render) {
            var _this = _super.call(this) || this;
            _this.z_index = 1;
            _this.layout = l;
            _this.chart = chart;
            _this.visiable = visiable,
                _this.render = render;
            _this.id = id;
            _this.data = data;
            return _this;
        }
        CompareChartElement.prototype.getNode = function () {
            if (this.chart) {
                return this.chart.wrapper;
            }
        };
        return CompareChartElement;
    }(Evented_1.Evented));
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
                chart: {
                    value: "",
                    class: "chart",
                    visiable: true
                },
                width: 300,
                height: 300
            };
            _this.defaultElements = {};
            _this.wrapper = new Utils_1.Layout();
            _this.canvas = {
                node: new Utils_1.Layout(),
                legend: new Utils_1.Layout(),
                title: new Utils_1.Layout(),
                xTitle: new Utils_1.Layout(),
                yTitle: new Utils_1.Layout(),
                y2Title: new Utils_1.Layout(),
                xAxis: new Utils_1.Layout(),
                yAxis: new Utils_1.Layout(),
                y2Axis: new Utils_1.Layout(),
                chart: new Utils_1.Layout()
            };
            _this.legend = {
                getHeight: function (o) {
                    return 0;
                },
                getWidth: function (o) {
                    return 0;
                }
            };
            _this.measures = [];
            _.each(cfg, function (v, k) {
                _this.config[k] = v;
            });
            return _this;
        }
        CompareChart.prototype.getDefaultElements = function () {
            var r = [];
            r.push(new CompareChartElement("legend", this.canvas.legend, this, this.getMeasures(), true, null));
            r.push(new CompareChartElement("title", this.canvas.title, this, this.config.title, this.config.title.visiable, titleRender()));
            r.push(new CompareChartElement("xTitle", this.canvas.xTitle, this, this.config.xTitle, this.config.xTitle.visiable, titleRender()));
            r.push(new CompareChartElement("yTitle", this.canvas.yTitle, this, this.config.yTitle, this.config.yTitle.visiable, titleRender()));
            r.push(new CompareChartElement("y2Title", this.canvas.y2Title, this, this.config.y2Title, this.config.y2Title.visiable, titleRender()));
            r.push(new CompareChartElement("xAxis", this.canvas.xAxis, this, "bottom", true, axisRender()));
            r.push(new CompareChartElement("yAxis", this.canvas.yAxis, this, "left", true, axisRender()));
            r.push(new CompareChartElement("y2Axis", this.canvas.y2Axis, this, "right", true, axisRender()));
            r.push(new CompareChartElement("chart", this.canvas.chart, this, this.getMeasures(), true, chartRender("svg")));
            return r;
        };
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
            if (ms.length == 0) {
                r = [0, 1];
            }
            else {
                var mss = void 0;
                if (ms.length == 1) {
                    mss = ms[0].pluckDatas(type);
                }
                else {
                    mss = _.reduce(ms, function (m1, m2) { return m1.pluckDatas(type).concat(m1.pluckDatas(type)); });
                }
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
                c.xTitle.w(this.stringRect(c.xTitle).width);
                c.xTitle.h(this.stringRect(c.xTitle).height);
                c.xTitle.x(0);
                c.xTitle.y(c.node.h() - this.legend.getHeight("bottom") - c.xTitle.h());
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
            c.xTitle.x(c.yTitle.w() + c.yAxis.w());
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
            r.push(new ChartElement("title", this.canvas.title, this.config.title, this));
            r.push(new ChartElement("title", this.canvas.xTitle, this.config.xTitle, this));
            r.push(new ChartElement("title", this.canvas.yTitle, this.config.yTitle, this));
            r.push(new ChartElement("title", this.canvas.y2Title, this.config.y2Title, this));
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
            this.getDefaultElements().forEach(function (e) {
                e.render ? e.render(e) : null;
            });
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
        };
        return CompareChart;
    }(Evented_1.Evented));
    exports.CompareChart = CompareChart;
    var titleRender = function (t) {
        if (!t || t === "html") {
            return function (e) {
                var div = d3.select(e.chart.wrapper.node()).append("div")
                    .style("position", "absolute")
                    .style("left", e.layout.x() + "px")
                    .style("top", e.layout.y() + "px")
                    .style("height", e.layout.h() + "px")
                    .style("width", e.layout.w() + "px")
                    .classed(e.data.class, true);
                div.append("p").text(e.data.value);
            };
        }
    };
    var axisRender = function (t) {
        if (!t || t === "svg") {
            return function (e) {
                var d = d3.select(e.chart.wrapper.node()).append("svg")
                    .style("position", "absolute")
                    .style("left", e.layout.x() + "px")
                    .style("top", e.layout.y() + "px")
                    .style("height", e.layout.h() + "px")
                    .style("width", e.layout.w() + "px");
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
            };
        }
    };
    var chartRender = function (t) {
        if (!t || t === "svg") {
            return function (e) {
                var xScale = e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(), "x"), [0, e.layout.w()]);
                var yScale = e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(), "y", true), [0, e.layout.h()]);
                var y2Scale = e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(), "y2", true), [0, e.layout.h()]);
                var c = d3.select(e.chart.wrapper.node()).append("svg")
                    .style("position", "absolute")
                    .style("left", e.layout.x() + "px")
                    .style("top", e.layout.y() + "px")
                    .style("height", e.layout.h() + "px")
                    .style("width", e.layout.w() + "px");
                e.layout.node(c.node());
                var d = [].concat(e.data);
                d.forEach(function (v, k) {
                    switch (v.type) {
                        case "line":
                            lineRender(xScale, yScale, e.layout.node(), v.data(), v.style);
                            break;
                        case "circle":
                            circleRender(xScale, yScale, e.layout.node(), v.data(), v.style);
                    }
                });
            };
        }
        if (t === "canvas") {
            return function (e) {
                var xScale = e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(), "x"), [0, e.layout.w()]);
                var yScale = e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(), "y", true), [0, e.layout.h()]);
                var y2Scale = e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(), "y2", true), [0, e.layout.h()]);
                var c = d3.select(e.chart.wrapper.node()).append("canvas")
                    .style("position", "absolute")
                    .style("left", e.layout.x() + "px")
                    .style("top", e.layout.y() + "px")
                    .style("height", e.layout.h() + "px")
                    .style("width", e.layout.w() + "px")
                    .attr("height", e.layout.h())
                    .attr("width", e.layout.w());
                e.layout.node(c.node());
                var d = [].concat(e.data);
                d.forEach(function (v, k) {
                    switch (v.type) {
                        case "line":
                            lineRenderCanvas(xScale, yScale, e.layout.node(), v.data(), v.style);
                            break;
                        case "circle":
                            circleRender(xScale, yScale, e.layout.node(), v.data(), v.style);
                    }
                });
            };
        }
    };
    var pathGen = function (xScale, yScale, ds, closed) {
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
    var lineRender = function (xScale, yScale, node, ds, style, ctx) {
        d3.select(node).append("path").attr("d", pathGen(xScale, yScale, ds, false))
            .style("stroke", style.color)
            .style("stroke-width", style.lineWidth)
            .style("fill", "none");
    };
    var lineRenderCanvas = function (xScale, yScale, canvas, ds, style, ctx) {
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
            ctx.strokeStyle = style.color;
            ctx.lineWidth = style.lineWidth;
            ctx.fillStyle = style.fillColor;
            var p = new window.Path2D(pathGen(xScale, yScale, ds, false));
            ctx.stroke(p);
            ctx.save();
        }
    };
    var circleRender = function (xScale, yScale, node, ds, style, ctx) {
        _.each([].concat(ds), function (d) {
            d3.select(node).append("ellipse").attr("cx", xScale(d.x))
                .attr("cy", yScale(d.y))
                .attr("rx", style.rx)
                .attr("ry", style.ry)
                .style("fill", style.fillColor);
        });
    };
    var barRender = function (xScale, yScale, node, ds, style, ctx) {
        _.each();
    };
});
//# sourceMappingURL=CompareChart.js.map