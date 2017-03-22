define(["require", "exports", "./Utils", "lib/d3", "lib/underscore"], function (require, exports, Utils_1, d3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SVGRender = (function () {
        function SVGRender() {
            this.lineRender = function (xScale, yScale, node, ds, style, ctx) {
                d3.select(node).append("path").attr("d", Utils_1.pathGen(xScale, yScale, ds, false))
                    .style("stroke", style.color)
                    .style("stroke-width", style.lineWidth)
                    .style("fill", "none");
            };
            this.circleRender = function (xScale, yScale, node, ds, style, ctx) {
                _.each([].concat(ds), function (d) {
                    d3.select(node).append("ellipse").attr("cx", xScale(d.x))
                        .attr("cy", yScale(d.y))
                        .attr("rx", style.rx)
                        .attr("ry", style.ry)
                        .style("fill", style.fillColor);
                });
            };
            this.barRender = function (xScale, yScale, node, ds, style, ctx, m) {
                var compareChart = ctx.compareChart;
                var chart = ctx["chart"];
                var w = 70 / compareChart.maxBarsNum();
                _.each([].concat(ds), function (d) {
                    d3.select(node).append("rect").attr("x", xScale(d.x) - w * compareChart.barNum(d.x) / 2 + w * (compareChart.getBarIndex(d.x) - 1))
                        .attr("y", yScale(d.y))
                        .attr("width", w)
                        .attr("height", chart.layout.h() - yScale(d.y))
                        .style("fill", style.fillColor);
                });
            };
        }
        SVGRender.prototype.titleRender = function (e) {
            var div, text;
            if (e.layout.node()) {
                div = d3.select(e.layout.node())
                    .style("position", "absolute")
                    .style("left", e.layout.x() + "px")
                    .style("top", e.layout.y() + "px")
                    .style("height", e.layout.h() + "px")
                    .style("width", e.layout.w() + "px")
                    .classed(e.data.class, true);
                div.selectAll("*").remove();
            }
            else {
                div = d3.select(e.chart.wrapper.node()).append("g")
                    .style("position", "absolute")
                    .style("left", e.layout.x() + "px")
                    .style("top", e.layout.y() + "px")
                    .style("height", e.layout.h() + "px")
                    .style("width", e.layout.w() + "px")
                    .classed(e.data.class, true);
            }
            text = div.append("text");
            text.text(e.data.value);
            e.layout.node(div.node());
        };
        SVGRender.prototype.axisRender = function (e, domain, position) {
            var d = e.layout.node() ? d3.select(e.layout.node()) : d3.select(e.chart.wrapper.node()).append("svg");
            d.style("position", "absolute")
                .style("left", e.layout.x() + "px")
                .style("top", e.layout.y() + "px")
                .style("height", e.layout.h() + "px")
                .style("width", e.layout.w() + "px")
                .classed(e.data.class, true);
            d.selectAll("*").remove();
            if (position === "left") {
                var scale = d3.scaleLinear().domain(domain).range([0, e.layout.h()]);
                var axis = d3.axisLeft(scale);
                if (e.data.format) {
                    axis.tickFormat(e.data.format);
                }
                d.style("left", e.layout.x() - e.layout.w() + "px");
                d.style("width", e.layout.w() + 2 + "px");
                // d.style("height",e.layout.h())
                d.append("g").style("transform", "translate(" + (e.layout.w()) + "px,0px)").call(axis);
            }
            if (position === "right") {
                var scale = d3.scaleLinear().domain(domain).range([0, e.layout.h()]);
                var axis = d3.axisRight(scale);
                if (e.data.format) {
                    axis.tickFormat(e.data.format);
                }
                d.call(axis);
            }
            if (position === "bottom") {
                var scale = d3.scaleLinear().domain(domain).range([0, e.layout.w()]);
                var axis = d3.axisBottom(scale);
                if (e.data.format) {
                    axis.tickFormat(e.data.format);
                }
                d.call(axis);
            }
            e.layout.node(d.node());
        };
        SVGRender.prototype.legendRender = function (e) {
        };
        SVGRender.prototype.chartRender = function (e) {
            var _this = this;
            var xScale = e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(), "x"), [0, e.layout.w()]);
            var yScale = e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(), "y", true), [0, e.layout.h()]);
            var y2Scale = e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(), "y2", true), [0, e.layout.h()]);
            var c = e.layout.node() ? d3.select(e.layout.node()) : d3.select(e.chart.wrapper.node()).append("svg");
            c.style("position", "absolute")
                .style("left", e.layout.x() + "px")
                .style("top", e.layout.y() + "px")
                .style("height", e.layout.h() + "px")
                .style("width", e.layout.w() + "px");
            c.selectAll("*").remove();
            e.layout.node(c.node());
            var d = [].concat(e.data);
            d.forEach(function (v, k) {
                switch (v.type) {
                    case "line":
                        _this.lineRender(xScale, yScale, e.layout.node(), v.data(), v.style, {});
                        break;
                    case "circle":
                        _this.circleRender(xScale, yScale, e.layout.node(), v.data(), v.style, {});
                        break;
                    case "bar":
                        _this.barRender(xScale, yScale, e.layout.node(), v.data(), v.style, { compareChart: e.chart, chart: e });
                        break;
                }
            });
        };
        return SVGRender;
    }());
    exports.SVGRender = SVGRender;
});
//# sourceMappingURL=SvgRender.js.map