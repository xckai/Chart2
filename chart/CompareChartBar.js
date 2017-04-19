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
define(["require", "exports", "lib/d3", "./Utils", "./Measure", "./Symbol", "./SvgRender", "lib/underscore"], function (require, exports, d3, Utils_1, Measure_1, Symbol_1, SvgRender_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CompareChartBar = (function (_super) {
        __extends(CompareChartBar, _super);
        function CompareChartBar(id, name, ref, ds) {
            var _this = _super.call(this, id, name, "line", ref, ds) || this;
            _this.type = "bar";
            return _this;
        }
        CompareChartBar.prototype.update = function () {
            console.log("changed");
        };
        CompareChartBar.prototype.color = function (d, ds, ctx) {
            if (d.y > 115) {
                return "red";
            }
            return "black";
        };
        CompareChartBar.prototype.dashArray = function (d, ds, ctx) {
            if (d.y > 113) {
                return "1,3";
            }
            else {
                return "";
            }
        };
        CompareChartBar.prototype.width = function (p1, p2, ctx) {
            if (p1.y > 112) {
                return 4;
            }
            return 2;
        };
        CompareChartBar.prototype.fillColor = function (d, ds, ctx) {
            return "blue";
        };
        CompareChartBar.prototype.render = function (node, xScale, yScale, ctx) {
            var _this = this;
            var ds = this.getData();
            var barIndex = ctx["barIndex"];
            var getBarIndex = function (v) {
                if (barIndex[v]) {
                    return barIndex[v] += 1;
                }
                else {
                    return barIndex[v] = 1;
                }
            };
            var compareChart = ctx.CompareChart;
            var chart = ctx["canvas"];
            var w = 60 / compareChart.maxBarsNum();
            _.each([].concat(ds), function (d) {
                d3.select(node).append("rect").attr("x", xScale(d.x) - w * compareChart.barNum(d.x) / 2 + w * (getBarIndex(d.x) - 1))
                    .attr("y", yScale(d.y))
                    .attr("width", w)
                    .attr("height", chart.layout.getH() - yScale(d.y))
                    .style("fill", _this.style.getFillColor());
            });
        };
        CompareChartBar.prototype.getStyle = function (d, ds, ctx) {
            var color = typeof (this.color) === "function" ? this.color(d, ds, ctx) : this.color;
            var dasharray = typeof (this.dashArray) === "function" ? this.dashArray(d, ds, ctx) : this.dashArray;
            var width = typeof (this.width) === "function" ? this.width(d, ds, ctx) : this.width;
            var fillColor = typeof (this.fillColor) === "function" ? this.fillColor(d, ds, ctx) : this.fillColor;
            return new Utils_1.Style(color, fillColor, 1, width, dasharray);
        };
        CompareChartBar.prototype.toSymbolies = function (node, xScale, yScale, ctx) {
            var _this = this;
            this.symbolizes = this.getData().map(function (d) {
                var ds = _this.getData();
                var barIndex = ctx["barIndex"];
                var getBarIndex = function (v) {
                    if (barIndex[v]) {
                        return barIndex[v] += 1;
                    }
                    else {
                        return barIndex[v] = 1;
                    }
                };
                var compareChart = ctx.CompareChart;
                var chart = ctx["canvas"];
                var w = 60 / compareChart.maxBarsNum();
                // _.each([].concat(ds),(d)=>{
                //     d3.select(node).append("rect").attr("x",xScale(d.x)-w*compareChart.barNum(d.x)/2+w*(getBarIndex(d.x)-1))
                //                                     .attr("y",yScale(d.y))
                //                                     .attr("width",w)
                //                                     .attr("height",chart.layout.getH()-yScale(d.y))
                //                                     .style("fill",this.style.getFillColor())
                // })
                var s = new Symbol_1.Bar(xScale(d.x) - w * compareChart.barNum(d.x) / 2 + w * (getBarIndex(d.x) - 1), yScale(d.y), w, chart.layout.getH() - yScale(d.y));
                s.setStyle(_this.getStyle(d, _this));
                s.setRender(SvgRender_1.barRender);
                s.measure = _this;
                s.canvas = node;
                // let _h=0
                // let chartHeight=ctx["chartheight"]
                // let compareChart:CompareChart=ctx.CompareChart
                // //let w=60/compareChart.maxBarsNum()
                // let barIndex:any={}
                // let getBarIndex=(v)=>{
                //         if(barIndex[v]){
                //             return barIndex[v]+=1
                //         }else{
                //             return    barIndex[v]=1
                //         }
                //     }
                // _h=chartHeight-yScale(d.y)
                // let w=60/compareChart.maxBarsNum()
                // s.x=xScale(d.x)-w*compareChart.barNum(d.x)/2+w*(getBarIndex(d.x)-1)+w/2
                // s.y=yScale(d.y)+_h/2
                // s.h=_h/2
                // s.w=w/2
                // s.measure =this
                return s;
            });
            return this.symbolizes;
        };
        return CompareChartBar;
    }(Measure_1.CompareChartMeasure));
    exports.CompareChartBar = CompareChartBar;
});
//# sourceMappingURL=CompareChartBar.js.map