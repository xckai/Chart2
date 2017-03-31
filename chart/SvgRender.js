define(["require", "exports", "lib/d3", "lib/underscore"], function (require, exports, d3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function lineRender() {
        var l = this;
        if (!l.node) {
            l.node = d3.select(l.canvas).append("path").node();
        }
        var line = d3.select(l.node);
        line.style("stroke", l.style.getStroke());
        line.style("stroke-width", l.style.getLineWidth());
        line.style("fill", "none").style("stroke-dasharray", l.style.getDashArray());
        line.attr("d", l.d);
    }
    exports.lineRender = lineRender;
    function barRender() {
        var s = this;
        if (!s.node) {
            s.node = d3.select(s.canvas).append("rect").node();
        }
        var symbol = d3.select(s.node);
        symbol.attr("x", s.x).attr("y", s.y)
            .attr("width", s.w)
            .attr("height", s.h)
            .attr("fill", s.style.getFillColor())
            .attr("stroke", s.style.getStroke())
            .attr("stroke-width", s.style.getLineWidth())
            .attr("opacity", s.style.getOpacity());
    }
    exports.barRender = barRender;
});
//# sourceMappingURL=SvgRender.js.map