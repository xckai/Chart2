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
define(["require", "exports", "lib/d3", "./Chart", "./Utils", "./ChartElement", "lib/underscore"], function (require, exports, d3, Chart_1, Utils_1, ChartElement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CoverElement = (function (_super) {
        __extends(CoverElement, _super);
        function CoverElement() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CoverElement.prototype.showGuideLine = function () {
        };
        return CoverElement;
    }(ChartElement_1.XAreaEventElement));
    var CompareChart = (function (_super) {
        __extends(CompareChart, _super);
        function CompareChart(cfg) {
            var _this = _super.call(this, cfg) || this;
            _this.config = {
                appendTo: "chart",
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
                xAxis: {
                    visiable: true,
                    class: "xAxis",
                    format: d3.timeFormat("%Y-%m-%d %I:%M")
                },
                yAxis: {
                    visiable: true,
                    class: "yAxis",
                    format: d3.format(".18f")
                },
                y2Axis: {
                    visiable: true,
                    class: "y2Axis",
                    format: function (d) {
                        return d;
                    }
                },
                legend: {
                    visiable: true,
                    class: "legend",
                    position: "auto",
                    _position: ""
                },
                width: 300,
                height: 300
            };
            _this.stringRectCache = Utils_1.Util.CacheAble(Utils_1.Util.getStringRect, function () {
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
            _this.wrapper = new Utils_1.Layout();
            _this.canvas = {
                node: new Utils_1.Layout(),
                legend: new Utils_1.Layout(),
                title: new Utils_1.Layout(),
                xTitle: new Utils_1.Layout(),
                yTitle: new Utils_1.Layout(),
                y2Title: new Utils_1.Layout(),
                xAxis: new Utils_1.Layout().setPosition("bottom"),
                yAxis: new Utils_1.Layout().setPosition("left"),
                y2Axis: new Utils_1.Layout().setPosition("right"),
                chart: new Utils_1.Layout(),
                event: new Utils_1.Layout()
            };
            _this.styles = {
                xAxis: new Utils_1.Style().setClass(_this.config.xAxis.class),
                yAxis: new Utils_1.Style().setClass(_this.config.yAxis.class),
                y2Axis: new Utils_1.Style().setClass(_this.config.y2Axis.class),
                title: new Utils_1.Style().setClass(_this.config.title.class),
                xTitle: new Utils_1.Style().setClass(_this.config.xTitle.class),
                yTitle: new Utils_1.Style().setClass(_this.config.yTitle.class),
                y2Title: new Utils_1.Style().setClass(_this.config.y2Title.class),
                legend: new Utils_1.Style().setClass(_this.config.legend.class),
                canvas: new Utils_1.Style()
            };
            _this.measures = [];
            _this.barIndex = {};
            _.each(cfg, function (v, k) {
                _this.config[k] = v;
            });
            _this.xAxisElement = new ChartElement_1.AxisElement(_this).setLayout(_this.canvas.xAxis)
                .setStyle(_this.styles.xAxis)
                .setDomainFn(function () {
                return _this.getDomain(_this.getMeasures(), "x");
            })
                .setConfig({ format: _this.config.xAxis.format });
            _this.yAxisElement = new ChartElement_1.AxisElement(_this).setLayout(_this.canvas.yAxis)
                .setStyle(_this.styles.yAxis)
                .setDomainFn(function () {
                return _this.getDomain(_this.getMeasures(), "y", true);
            })
                .setConfig({ format: _this.config.yAxis.format });
            _this.y2AxisElement = new ChartElement_1.AxisElement(_this).setLayout(_this.canvas.y2Axis)
                .setStyle(_this.styles.y2Axis)
                .setDomainFn(function () {
                return _this.getDomain(_this.getMeasures(), "y2", true);
            })
                .setConfig({ format: _this.config.y2Axis.format });
            _this.titletElement = new ChartElement_1.TitleElement(_this).setLayout(_this.canvas.title)
                .setStyle(_this.styles.title)
                .setConfig({
                value: _this.config.title.value
            });
            _this.xTitleElement = new ChartElement_1.TitleElement(_this).setLayout(_this.canvas.xTitle)
                .setStyle(_this.styles.xTitle)
                .setConfig({
                value: _this.config.xTitle.value
            });
            _this.yTitleElement = new ChartElement_1.TitleElement(_this).setLayout(_this.canvas.yTitle)
                .setStyle(_this.styles.yTitle)
                .setConfig({
                value: _this.config.yTitle.value
            });
            _this.y2TitleElement = new ChartElement_1.TitleElement(_this).setLayout(_this.canvas.y2Title)
                .setStyle(_this.styles.y2Title)
                .setConfig({
                value: _this.config.y2Title.value
            });
            _this.legendElement = new ChartElement_1.LegendElement(_this).setLayout(_this.canvas.legend)
                .setStyle(_this.styles.legend)
                .setLegendDataFn(function () { return _this.getMeasures().filter(function (m) { return m.type === "legend"; }); });
            _this.canvasElement = new ChartElement_1.CompareChartCanvasElement(_this).setLayout(_this.canvas.chart)
                .setStyle(_this.styles.canvas)
                .setDataFn(function () { return _this.getMeasures(); });
            _this.eventElement = new CoverElement(_this).setLayout(_this.canvas.event)
                .setDataFn(function () {
                return _this.getMeasures().map(function (m) {
                    var xScale = _this.getScale(_this.getDomain(_this.getMeasures(), "x"), [0, _this.canvas.chart.getW()]);
                    var yScale = _this.getScale(_this.getDomain(_this.getMeasures(), "y", true), [0, _this.canvas.chart.getH()]);
                    var y2Scale = _this.getScale(_this.getDomain(_this.getMeasures(), "y2", true), [0, _this.canvas.chart.getH()]);
                    _this.ctx("CompareChart", _this);
                    _this.ctx("chartheight", _this.canvas.chart.getH());
                    return m.getSymbolizes();
                }).reduce(function (s1, s2) {
                    return s1.concat(s2);
                });
            });
            _this.toolTip = new ChartElement_1.Tooltip(_this).setLayout(new Utils_1.Layout());
            _this.toolTip.setContent("<p> ToolTip</p>");
            return _this;
        }
        CompareChart.prototype.addMeasure = function (nm) {
            var i = _.findIndex(this.measures, function (m) { return (nm.id == m.id) && (nm.type == m.type); });
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
                    mss = ms.map(function (m) { return m.pluckDatas(type); }).reduce(function (d1, d2) { return d1.concat(d2); });
                    //mss = _.reduce(ms, (m1: CompareChartMeasure, m2: CompareChartMeasure) => m1.pluckDatas(type).concat(m1.pluckDatas(type)));
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
            var ccls = this.config.class + " " + con.class;
            return this.stringRectCache(con.value, ccls);
            // return this.stringRectCache(con.value, ccls);
        };
        CompareChart.prototype.getScale = function (domain, range) {
            return d3.scaleLinear().domain(domain).range(range);
        };
        CompareChart.prototype.calculateLayout = function () {
            var c = this.canvas;
            var con = this.config;
            // if(this.config.height>this.config.width){
            //     con.
            // }
            var legendLayout = {
                bottomHeight: 0,
                bottomWidth: 0,
                rightWidth: 0,
                rightHeight: 0
            };
            if (c.legend.getPosition() === "right") {
                legendLayout.rightHeight = c.legend.getH();
                legendLayout.rightWidth = c.legend.getW();
            }
            if (c.legend.getPosition() === "bottom") {
                legendLayout.bottomHeight = c.legend.getH();
                legendLayout.bottomWidth = c.legend.getW();
            }
            this.wrapper.setX(0);
            this.wrapper.setY(0);
            this.wrapper.setW(this.config.width);
            this.wrapper.setH(this.config.height);
            if (this.config.title.visiable) {
                c.title.setX(0);
                c.title.setY(0);
                this.canvas.title.setW(this.wrapper.getW());
                this.canvas.title.setH(this.stringRect(this.config.title).height);
            }
            if (con.xTitle.visiable) {
                // c.xTitle.setW(this.stringRect(con.xTitle).width)
                c.xTitle.setH(this.stringRect(con.xTitle).height);
                //c.xTitle.setX(0)
                c.xTitle.setY(this.wrapper.getH() - legendLayout.bottomHeight - c.xTitle.getH());
            }
            c.xAxis.setH(this.getXHeight());
            c.xAxis.setY(this.wrapper.getH() - c.xTitle.getH() - c.xAxis.getH() - legendLayout.bottomHeight);
            c.chart.setY(c.title.getH());
            c.chart.setH(this.wrapper.getH() - c.title.getH() - c.xAxis.getH() - c.xTitle.getH() - legendLayout.bottomHeight);
            ////calculate setX 
            if (con.yTitle.visiable) {
                c.yTitle.setX(0);
                c.yTitle.setY(0);
                // c.yTitle.setH(this.stringRect(con.yTitle).height)
                c.yTitle.setW(this.stringRect(con.yTitle).width);
            }
            else {
                c.yTitle.setX(0);
                c.yTitle.setY(0);
                // c.yTitle.setH(0)
                c.yTitle.setW(0);
            }
            c.yAxis.setW(this.getYWidth());
            c.yAxis.setH(c.chart.getH());
            c.yAxis.setX(c.yTitle.getW() + c.yAxis.getW());
            c.yAxis.setY(c.title.getH());
            c.y2Title.setW(this.stringRect(con.y2Title).width);
            //c.y2Title.setH(this.stringRect(con.y2Title).height)
            if (con.y2Title.visiable) {
                c.y2Axis.setW(this.getY2Width());
                c.y2Axis.setH(c.chart.getH());
                c.y2Axis.setX(this.wrapper.getW() - c.y2Axis.getW() - c.y2Title.getW());
                c.y2Axis.setY(c.title.getH());
            }
            else {
                c.y2Axis.setW(0);
                c.y2Axis.setH(0);
                c.y2Axis.setX(this.wrapper.getW() - c.y2Axis.getW() - c.y2Title.getW());
                c.y2Axis.setY(c.title.getH());
            }
            c.y2Title.setX(this.wrapper.getW() - c.y2Title.getW() - legendLayout.rightWidth);
            c.y2Title.setY(c.title.getH());
            c.chart.setX(c.yAxis.getW() + c.yTitle.getW());
            c.chart.setW(this.wrapper.getW() - c.yTitle.getW() - c.yAxis.getW() - c.y2Axis.getW() - c.y2Title.getW() - legendLayout.rightWidth);
            c.xAxis.setX(c.yTitle.getW() + c.yAxis.getW());
            c.xAxis.setW(c.chart.getW());
            c.xTitle.setX(c.yTitle.getW() + c.yAxis.getW());
            c.y2Title.setH(c.chart.getH());
            c.yTitle.setH(c.chart.getH());
            c.xTitle.setW(c.chart.getW());
            c.event.setX(c.chart.getX()).setY(c.chart.getY())
                .setH(c.chart.getH())
                .setW(c.chart.getW());
            this.ctx("chart-width", c.chart.getW());
            this.ctx("chart-height", c.chart.getH());
        };
        CompareChart.prototype.getChartLayout = function () {
            return this.canvas.chart;
        };
        CompareChart.prototype.getYWidth = function () {
            var _this = this;
            var w = 0, chart = this, ss = 0;
            var d = this.getMeasures().filter(function (e) { return e.ref !== "y2"; })
                .forEach(function (e) {
                e.pluckDatas("y").forEach(function (s) {
                    var _w = _this.stringRectCache(_this.yAxisElement.config.format(s), null, 10).width;
                    w = w > _w ? w : _w, ss = s;
                });
            });
            if (w > 70) {
                this.yAxisElement.style.setClass(chart.config.yAxis.class + " rotation");
                //this.ctx("yAxisClass","rotation")
                w = this.stringRectCache(this.yAxisElement.config.format(ss), chart.config.yAxis.class + " rotation", 10).width;
            }
            return w;
        };
        CompareChart.prototype.getY2Width = function () {
            var _this = this;
            var w = 0, chart = this, ss = 0;
            var d = this.getMeasures().filter(function (e) { return e.ref === "y2"; })
                .forEach(function (e) {
                e.pluckDatas("y").forEach(function (s) {
                    var _w = _this.stringRectCache(_this.y2AxisElement.config.format(s), null, 10).width;
                    w = w > _w ? w : _w, ss = s;
                });
            });
            if (w > 70) {
                // console.log("before", w)
                this.y2AxisElement.style.setClass(chart.config.y2Axis.class + " rotation");
                //chart.config.yAxis.class+=" rotation"
                w = this.stringRectCache(this.y2AxisElement.config.format(ss), chart.config.y2Axis.class + " rotation", 10).width;
                //console.log("after", w)
            }
            return w;
        };
        CompareChart.prototype.getXHeight = function () {
            var _this = this;
            var w = 0, h = 0, chart = this, ss = 0;
            var d = this.getMeasures().forEach(function (e) {
                e.pluckDatas("x").forEach(function (s) {
                    var _w = _this.stringRectCache(_this.xAxisElement.config.format(s), null, 10).width;
                    w = w > _w ? w : _w, ss = s, h = _this.stringRectCache(chart.config.xAxis.format(s), null, 10).height;
                });
            });
            if (w > 40) {
                //this.ctx("xAxisClass","rotation")
                // chart.config.xAxis.class+=" rotation"
                this.xAxisElement.style.setClass(chart.config.xAxis.class + " rotation");
                h = this.stringRectCache(this.xAxisElement.config.format(ss), chart.config.xAxis.class + " rotation", 10).height;
            }
            return h;
        };
        CompareChart.prototype.checkData = function () {
            var ms = this.getMeasures();
            var y2 = _.some(ms, function (m) {
                return m.ref === "y2";
            });
            if (y2) {
                this.config.y2Axis.visiable = false;
                this.config.y2Title.visiable = false;
            }
            this.barIndex = {};
            if (this.config.legend.visiable) {
                if (this.config.width > this.config.height * 1.2) {
                    this.config.legend._position = "right";
                    this.canvas.legend.setPosition("right");
                    this.canvas.legend.setW(this.config.width * 0.2);
                    this.canvas.legend.setH(this.config.height - this.stringRectCache(this.config.title.value, this.config.title.class).height - this.stringRectCache(this.config.xTitle.value, this.config.xTitle.class).height);
                    this.canvas.legend.setX(this.config.width - this.canvas.legend.getW());
                    this.canvas.legend.setY(this.stringRectCache(this.config.title.value, this.config.title.class).height);
                }
                else {
                    this.config.legend._position = "bottom";
                    this.canvas.legend.setPosition("bottom");
                    this.canvas.legend.setW(this.config.width);
                    this.canvas.legend.setH(Math.ceil(ms.filter(function (m) { return m.type === "legend"; }).length * 100 / this.config.width) * 25);
                    this.canvas.legend.setX(0);
                    this.canvas.legend.setY(this.config.height - this.canvas.legend.getH());
                }
            }
            if (ms.filter(function (e) { return e.type == "legend"; }).length === 0) {
                this.ctx("showlegend", false);
            }
            else {
                this.ctx("showlegend", true);
            }
        };
        CompareChart.prototype.maxBarsNum = function () {
            var bars = this.getMeasures().filter(function (b) { return b.type === "bar"; });
            var n = 1;
            var bg = _.groupBy(bars.map(function (b) { return b.getData(); })
                .reduce(function (b1, b2) { return b1.concat(b2); }), "x");
            _.each(bg, function (v, k) {
                n = n > v.length ? n : v.length;
            });
            return n;
        };
        CompareChart.prototype.barNum = function (v) {
            var bars = this.getMeasures().filter(function (b) { return b.type === "bar"; });
            var num = 0;
            _.each(bars.map(function (b) { return b.getData(); })
                .reduce(function (b1, b2) { return b1.concat(b2); }), function (d) {
                if (d.x == v) {
                    num++;
                }
            });
            return num;
        };
        CompareChart.prototype.getBarIndex = function (v) {
            if (this.barIndex[v]) {
                console.log(v, this.barIndex[v] + 1);
                return this.barIndex[v] += 1;
            }
            else {
                return this.barIndex[v] = 1;
            }
        };
        CompareChart.prototype.clearDummyDate = function () {
            this.barIndex = {};
        };
        return CompareChart;
    }(Chart_1.Chart));
    exports.CompareChart = CompareChart;
});
//# sourceMappingURL=CompareChart.js.map