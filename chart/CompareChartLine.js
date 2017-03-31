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
define(["require", "exports", "./Utils", "lib/d3", "./Measure", "./Symbol", "./SvgRender"], function (require, exports, Utils_1, d3, Measure_1, Symbol_1, SvgRender_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CompareChartLine = (function (_super) {
        __extends(CompareChartLine, _super);
        function CompareChartLine(id, name, ref, ds) {
            var _this = _super.call(this, id, name, "line", ref, ds) || this;
            _this.type = "line";
            return _this;
        }
        CompareChartLine.prototype.color = function (d, ds, ctx) {
            if (d.y > 115) {
                return "red";
            }
            return "black";
        };
        CompareChartLine.prototype.dashArray = function (d, ds, ctx) {
            if (d.y > 113) {
                return "1,3";
            }
            else {
                return "";
            }
        };
        CompareChartLine.prototype.width = function (p1, p2, ctx) {
            if (p1.y > 112) {
                return 4;
            }
            return 2;
        };
        CompareChartLine.prototype.getStyle = function (d, ds, ctx) {
            var color = typeof (this.color) === "function" ? this.color(d, ds, ctx) : this.color;
            var dasharray = typeof (this.dashArray) === "function" ? this.dashArray(d, ds, ctx) : this.dashArray;
            var width = typeof (this.width) === "function" ? this.width(d, ds, ctx) : this.width;
            return new Utils_1.Style(color, null, 1, width, dasharray);
        };
        CompareChartLine.prototype.render = function (canvas, xScale, yScale) {
            var _this = this;
            var style = this.style, ds = this.getData(), c;
            // if(this.node){
            //     c=d3.select(this.node)
            // }else{
            //     c= d3.select(canvas).append("g")
            //     this.node=c.node()
            // }
            c = d3.select(canvas).append("g");
            // let enter=c.data(ds).selectAll("line").enter()
            //                                         .append("line")
            //                                         .attr("x1")
            var _color = "red";
            var needNewLine = function (d) {
                return !(_this.color(d) == _color);
            };
            var _ls = [];
            _ls.push(ds[0]);
            for (var i = 1; i < ds.length; ++i) {
                if (needNewLine(ds[i])) {
                    c.append("path").attr("d", Utils_1.pathGen(xScale, yScale, _ls, false))
                        .style("stroke", _color)
                        .style("stroke-width", 2)
                        .style("fill", "none");
                    var t = _ls[_ls.length - 1];
                    _ls = [];
                    _ls.push(t);
                    _ls.push(ds[i]);
                    _color = this.color(ds[i]);
                }
                else {
                    _ls.push(ds[i]);
                }
            }
            c.append("path").attr("d", Utils_1.pathGen(xScale, yScale, _ls, false))
                .style("stroke", _color)
                .style("stroke-width", 2)
                .style("fill", "none");
            // c.attr("d",pathGen(xScale,yScale,ds,false))
            //                                 .style("stroke",style.getColor())
            //                                 .style("stroke-width",style.getLineWidth())
            //                                 .style("fill","none")                               
        };
        CompareChartLine.prototype.toSymbolies = function (node, xScale, yScale, ctx) {
            var style = this.style, ds = this.getData(), lines = [];
            if (ds.length < 2) {
                return lines;
            }
            else {
                var s = this.getStyle(ds[0], this);
                var _d = [];
                _d.push(ds[0]);
                for (var i = 1; i < ds.length; ++i) {
                    if (s.equal(this.getStyle(ds[i], this))) {
                        _d.push[ds[i]];
                    }
                    else {
                        var l = new Symbol_1.Line(Utils_1.pathGen(xScale, yScale, _d, false));
                        l.canvas = node;
                        l.style = s;
                        l.render = SvgRender_1.lineRender;
                        lines.push(l);
                        var t = _d[_d.length - 1];
                        _d = [];
                        _d.push(t);
                        _d.push(ds[i]);
                        s = this.getStyle(ds[i], this);
                    }
                }
                return lines;
            }
        };
        return CompareChartLine;
    }(Measure_1.CompareChartMeasure));
    exports.CompareChartLine = CompareChartLine;
});
//# sourceMappingURL=CompareChartLine.js.map