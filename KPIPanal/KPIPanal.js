define(["require", "exports", "d3", "underscore", "../lib/comparechart"], function (require, exports, d3, _, comparechart) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // import  "d3-transition"
    // import {interpolateNumber} from "d3-interpolate"
    var KPIPanal = (function () {
        function KPIPanal() {
            this._chart0 = comparechart.ChartManager.createCompareChart({
                "width": 400,
                "height": 230,
                title: "",
                xType: "time",
                showLegend: false,
                noAxisTitle: true,
                xValueFormat: function (v) {
                    return d3.timeFormat("%H:%M")(new Date(v));
                }
            });
            this._chart1 = comparechart.ChartManager.createCompareChart({
                "width": 400,
                "height": 230,
                title: "",
                xType: "time",
                noAxisTitle: true,
                showLegend: false,
                xValueFormat: function (v) {
                    return d3.timeFormat("%H:%M")(new Date(v));
                }
            });
            this._chart2 = comparechart.ChartManager.createCompareChart({
                "width": 400,
                "height": 230,
                title: "",
                xType: "time",
                noAxisTitle: true,
                showLegend: false,
                xValueFormat: function (v) {
                    return d3.timeFormat("%H:%M")(new Date(v));
                }
            });
            this._data = {};
        }
        KPIPanal.prototype.appendTo = function (s) {
            if (this._node) {
                d3.select(s).node().appendChild(this._node);
            }
            return this;
        };
        KPIPanal.prototype.setConfig = function (c) {
            this._config = c;
            return this;
        };
        KPIPanal.prototype.render = function () {
            var contariner, t1, t2, t3, charts, c1, c2, c3;
            if (!this._node) {
                contariner = d3.select(document.createDocumentFragment()).append("xhtml:div").classed("kpipanal", true);
                var div_1 = contariner.append("xhtml:div").classed(" tabs", true);
                t1 = div_1.append("xhtml:div").classed("t1 kpi ", true).classed("active", true)
                    .on("click", function () {
                    div_1.selectAll(".kpi").classed("active", false);
                    t1.classed("active", true);
                    charts.selectAll(".chart").style("display", "none");
                    c1.style("display", "block");
                });
                t1.append("xhtml:text").classed("value", true);
                t1.append("xhtml:text").text(this._config.label0 || "KPI-1");
                t2 = div_1.append('xhtml:div').classed("t2 kpi", true).on("click", function () {
                    div_1.selectAll(".kpi").classed("active", false);
                    t2.classed("active", true);
                    charts.selectAll(".chart").style("display", "none");
                    c2.style("display", "block");
                });
                t2.append("xhtml:text").classed("value", true);
                t2.append("xhtml:text").text(this._config.label1 || "KPI-2");
                t3 = div_1.append('xhtml:div').classed("t3 kpi", true).on("click", function () {
                    div_1.selectAll(".kpi").classed("active", false);
                    t3.classed("active", true);
                    charts.selectAll(".chart").style("display", "none");
                    c3.style("display", "block");
                });
                t3.append("xhtml:text").classed("value", true);
                t3.append("xhtml:text").text(this._config.label2 || "KPI-3");
                //this._chart.appendTo(this._data["chartId"])
                charts = contariner.append("xhtml:div").classed("charts", true);
                var id0 = _.uniqueId("chart"), id1 = _.uniqueId("chart"), id2 = _.uniqueId("chart");
                c1 = charts.append("xhtml:div").classed("chart", true).style("display", "block").attr("id", id0);
                this._chart0.appendTo(id0);
                c2 = charts.append("xhtml:div").classed("chart", true).style("display", "none").attr("id", id1);
                this._chart1.appendTo(id1);
                c3 = charts.append("xhtml:div").classed("chart", true).style("display", "none").attr("id", id2);
                this._chart2.appendTo(id2);
                contariner.append("xhtml:div").classed("chart", true).attr("id", this._data["chartId"]);
                this._node = contariner.node();
            }
            else {
                contariner = d3.select(this._node);
            }
            return this;
        };
        KPIPanal.prototype.tabClick = function (id) {
            var buttons = d3.select(this._node).selectAll("button");
        };
        KPIPanal.prototype.update = function (d) {
            /////{t1,t2,t3,d1,d2,d3}
            var contariner, t1, t2, t3, chart;
            contariner = d3.select(this._node);
            contariner.style("position", "absolute");
            if (this._config.left != undefined) {
                contariner.style("left", this._config.left + "px");
            }
            if (this._config.right != undefined) {
                contariner.style("right", this._config.right + "px");
            }
            if (this._config.top != undefined) {
                contariner.style("top", this._config.top + "px");
            }
            if (this._config.bottom != undefined) {
                contariner.style("bottom", this._config.bottom + "px");
            }
            var format = this._config.tpiFormat ? this._config.tpiFormat : function (n) {
                return (+n).toFixed(2);
            };
            t1 = contariner.select(".t1").select(".value");
            t1.transition().duration(1000).tween("text", function () {
                var num = d3.interpolateNumber(+t1.text(), d.t1 || 0);
                return function (t) { t1.text(format(num(t))); };
            });
            t1.style("color", "#009900");
            t2 = contariner.select(".t2").select(".value");
            t2.transition().duration(1000).tween("text", function () {
                var num = d3.interpolateNumber(+t2.text(), d.t2 || 0);
                return function (t) { t2.text(format(num(t))); };
            });
            t2.style("color", "#990000");
            t3 = contariner.select(".t3").select(".value");
            t3.transition().duration(1000).tween("text", function () {
                var num = d3.interpolateNumber(+t3.text(), d.t3 || 0);
                return function (t) { t3.text(format(num(t))); };
            });
            t3.style("color", "#000099");
            this._chart1.addMeasure(new comparechart.ChartManager.createMeasure({
                id: 1,
                uniqueID: "1",
                "name": "速度",
                "data": d.d1[0],
                type: "line",
                mapkey: {
                    y: "SPEED",
                    x: "TIMESTAMP"
                },
                style: {
                    linewidth: 2,
                    circleradius: 0.1,
                    color: "#990000"
                },
                config: {
                    yLabel: "KM/H"
                }
            }));
            this._chart1.addMeasure(new comparechart.ChartManager.createMeasure({
                id: 2,
                uniqueID: "2",
                "name": "预测速度",
                "data": d.d1[1],
                type: "line",
                mapkey: {
                    y: "SPEED",
                    x: "TIMESTAMP"
                },
                style: {
                    linewidth: 2,
                    dasharray: "2,3",
                    circleradius: 0.1,
                    color: "#990000"
                },
                config: {
                    yLabel: "KM/H"
                }
            }));
            this._chart1.addMeasure(new comparechart.ChartManager.createMeasure({
                id: 3,
                uniqueID: "3",
                "name": "历史速度",
                "data": d.d1[2],
                type: "range",
                mapkey: {
                    y1: "MAX",
                    y2: "MIN",
                    x: "TIMESTAMP"
                },
                style: {
                    linewidth: 1,
                    circleradius: 0.1,
                    color: "#990000"
                },
                config: {
                    yLabel: "KM/H"
                }
            }));
            this._chart1.rendering();
            this._chart2.addMeasure(new comparechart.ChartManager.createMeasure({
                id: 1,
                uniqueID: "1",
                "name": "速度",
                "data": d.d1[0],
                type: "line",
                mapkey: {
                    y: "SPEED",
                    x: "TIMESTAMP"
                },
                style: {
                    linewidth: 2,
                    circleradius: 0.1,
                    color: "#000066"
                },
                config: {
                    yLabel: "KM/H"
                }
            }));
            this._chart2.addMeasure(new comparechart.ChartManager.createMeasure({
                id: 2,
                uniqueID: "2",
                "name": "预测速度",
                "data": d.d1[1],
                type: "line",
                mapkey: {
                    y: "SPEED",
                    x: "TIMESTAMP"
                },
                style: {
                    linewidth: 2,
                    dasharray: "2,3",
                    circleradius: 0.1,
                    color: "#000066"
                },
                config: {
                    yLabel: "KM/H"
                }
            }));
            this._chart2.addMeasure(new comparechart.ChartManager.createMeasure({
                id: 3,
                uniqueID: "3",
                "name": "历史速度",
                "data": d.d1[2],
                type: "range",
                mapkey: {
                    y1: "MAX",
                    y2: "MIN",
                    x: "TIMESTAMP"
                },
                style: {
                    linewidth: 1,
                    circleradius: 0.1,
                    color: "#000066"
                },
                config: {
                    yLabel: "KM/H"
                }
            }));
            this._chart2.rendering();
            this._chart0.addMeasure(new comparechart.ChartManager.createMeasure({
                id: 1,
                uniqueID: "1",
                "name": "速度",
                "data": d.d1[0],
                type: "line",
                mapkey: {
                    y: "SPEED",
                    x: "TIMESTAMP"
                },
                style: {
                    linewidth: 2,
                    circleradius: 0.1,
                    color: "green"
                },
                config: {
                    yLabel: "KM/H"
                }
            }));
            this._chart0.addMeasure(new comparechart.ChartManager.createMeasure({
                id: 2,
                uniqueID: "2",
                "name": "预测速度",
                "data": d.d1[1],
                type: "line",
                mapkey: {
                    y: "SPEED",
                    x: "TIMESTAMP"
                },
                style: {
                    linewidth: 2,
                    dasharray: "2,3",
                    circleradius: 0.1,
                    color: "green"
                },
                config: {
                    yLabel: "KM/H"
                }
            }));
            this._chart0.addMeasure(new comparechart.ChartManager.createMeasure({
                id: 3,
                uniqueID: "3",
                "name": "历史速度",
                "data": d.d1[2],
                type: "range",
                mapkey: {
                    y1: "MAX",
                    y2: "MIN",
                    x: "TIMESTAMP"
                },
                style: {
                    linewidth: 1,
                    circleradius: 0.1,
                    color: "green"
                },
                config: {
                    yLabel: "KM/H"
                }
            }));
            this._chart0.rendering();
            // this._chart2.addMeasure().rendering()
            //this._chart0.addMeasure().rendering()
        };
        return KPIPanal;
    }());
    exports.KPIPanal = KPIPanal;
});
//# sourceMappingURL=KPIPanal.js.map