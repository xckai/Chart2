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
    var KPIPanal = (function () {
        function KPIPanal() {
            // _chart=ChartManager.createCompareChart({
            //         "width": 400,
            //         "height": 230,
            //         title: "",
            //         xType: "TimeSeries",
            //         showLegend: false
            //     })
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
            var contariner, t1, t2, t3, chart;
            if (!this._node) {
                contariner = d3.select(document.createDocumentFragment()).append("xhtml:div").classed("kpipanal", true);
                var div = contariner.append("xhtml:div").classed("texts", true);
                t1 = div.append("xhtml:div").classed("t1 text", true);
                t1.append("xhtml:text").text(this._config.label0 || "KPI-1");
                t1.append("xhtml:text").classed("value", true);
                t2 = div.append('xhtml:div').classed("t2 text", true);
                t2.append("xhtml:text").text(this._config.label1 || "KPI-2");
                t2.append("xhtml:text").classed("value", true);
                t3 = div.append('xhtml:div').classed("t3 text", true);
                t3.append("xhtml:text").text(this._config.label2 || "KPI-3");
                t3.append("xhtml:text").classed("value", true);
                this._data["chartId"] = _.uniqueId("chart");
                // this._chart.appendTo(this._data["chartId"])
                contariner.append("xhtml:div").classed("chart", true).attr("id", this._data["chartId"]);
                this._node = contariner.node();
            }
            else {
                contariner = d3.select(this._node);
            }
            return this;
        };
        KPIPanal.prototype.update = function (d) {
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
            t2 = contariner.select(".t2").select(".value");
            t2.transition().duration(1000).tween("text", function () {
                var num = d3.interpolateNumber(+t2.text(), d.t2 || 0);
                return function (t) { t2.text(format(num(t))); };
            });
            t3 = contariner.select(".t3").select(".value");
            t3.transition().duration(1000).tween("text", function () {
                var num = d3.interpolateNumber(+t3.text(), d.t3 || 0);
                return function (t) { t3.text(format(num(t))); };
            });
            chart = contariner.select(".chart");
        };
        return KPIPanal;
    }());
    exports.KPIPanal = KPIPanal;
});
//# sourceMappingURL=KPIPanal.js.map