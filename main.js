(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "Chart/Flexable", "Chart/Service", "lib/d3", "lib/underscore"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Flexable_1 = require("Chart/Flexable");
    var Service_1 = require("Chart/Service");
    var d3 = require("lib/d3");
    var underscore = require("lib/underscore");
    console.log(underscore);
    var translateStr = Service_1.Service.stringTemplate("translate({x},{y})");
    var svg = d3.select("body").append("svg").attr("height", 200);
    var texts = svg.selectAll("text").data(d3.range(30))
        .enter()
        .append("text")
        .attr("x", 0)
        .attr("y", function (d, i) { return i * 30; })
        .attr("dominant-baseline", "text-before-edge")
        .text(function (d) { return d; });
    var scroll = svg.append("g").style("height", 200).attr("transform", translateStr({ x: 20, y: 0 }));
    Flexable_1.connectContainerAndScrollbar(scroll, 5, 200, 900, 0, function (obj) {
        texts.attr("transform", translateStr({ x: 0, y: -obj.offset }));
    });
    var svg1 = d3.select("body").append("svg").attr("width", 200);
    var texts1 = svg1.selectAll("text").data(d3.range(30))
        .enter()
        .append("text")
        .attr("y", 0)
        .attr("x", function (d, i) { return i * 30; })
        .attr("dominant-baseline", "text-before-edge")
        .text(function (d) { return d; });
    var scroll1 = svg1.append("g").style("height", 200).attr("transform", function () {
        return Service_1.Service.d3Transform().translate(0, 20).rotate(-90)();
    });
    Flexable_1.connectContainerAndScrollbar(scroll1, 5, 200, 900, 0, function (obj) {
        texts1.attr("transform", translateStr({ x: -obj.offset, y: 0 }));
    });
    var svg2 = d3.select("body").append("svg").attr("width", 200).attr("height", 200).append("g");
    var texts2 = svg2.selectAll("text").data(d3.range(30))
        .enter()
        .append("text")
        .attr("y", function (d, i) { return i * 30; })
        .attr("x", function (d, i) { return i * 30; })
        .attr("dominant-baseline", "text-before-edge")
        .text(function (d) { return d; });
    Flexable_1.flexableContainer(200, 200, 20, 900, 900, svg2);
});
//# sourceMappingURL=main.js.map