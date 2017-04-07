(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "lib/underscore", "lib/d3", "Chart/Service"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var d3 = require("lib/d3");
    var Service_1 = require("Chart/Service");
    function rectGen(x, y, w, h, r, tl, tr, bl, br) {
        // x: x-coordinate
        // y: y-coordinate
        // w: width
        // h: height
        // r: corner radius
        // tl: top_left rounded?
        // tr: top_right rounded?
        // bl: bottom_left rounded?
        // br: bottom_right rounded?
        var path;
        path = "M" + (x + r) + "," + y;
        path += "h" + (w - 2 * r);
        if (tr) {
            path += "a" + r + "," + r + " 0 0 1 " + r + "," + r;
        }
        else {
            path += "h" + r;
            path += "v" + r;
        }
        path += "v" + (h - 2 * r);
        if (br) {
            path += "a" + r + "," + r + " 0 0 1 " + -r + "," + r;
        }
        else {
            path += "v" + r;
            path += "h" + -r;
        }
        path += "h" + (2 * r - w);
        if (bl) {
            path += "a" + r + "," + r + " 0 0 1 " + -r + "," + -r;
        }
        else {
            path += "h" + -r;
            path += "v" + -r;
        }
        path += "v" + (2 * r - h);
        if (tl) {
            path += "a" + r + "," + r + " 0 0 1 " + r + "," + -r;
        }
        else {
            path += "v" + -r;
            path += "h" + r;
        }
        path += "z";
        return path;
    }
    function connectContainerAndScrollbar(scroll, sbw, sbLenght, elementLength, elementOffset, fn) {
        var scrollContainer = scroll;
        var scrollBarBackground = scrollContainer.append("path").attr("d", rectGen(0, 0, sbw, sbLenght, 5, true, true, true, true)).classed("flexable-scrollbar", true);
        var offset = elementOffset, scrollBarSplitterOffset = 0, scrollBarSplitterLength = sbLenght * Math.min(sbLenght / elementLength);
        var scrollBarSplitter = scrollContainer.append("path").attr("d", rectGen(0.5, 0, sbw - 1, scrollBarSplitterLength, 5, true, true, true, true)).classed("flexable-scrollbar-splitter", true);
        scrollBarSplitterOffset = offset * sbLenght / elementLength;
        scrollBarSplitter.attr("transform", "translate(0," + scrollBarSplitterOffset + ")");
        var setOffset = function () {
            if (scrollBarSplitterOffset < 0) {
                scrollBarSplitterOffset = 0;
            }
            if (scrollBarSplitterOffset + scrollBarSplitterLength > sbLenght) {
                scrollBarSplitterOffset = sbLenght - scrollBarSplitterLength;
            }
            offset = Math.ceil(scrollBarSplitterOffset * elementLength / sbLenght);
            scrollBarSplitter.attr("transform", "translate(0," + scrollBarSplitterOffset + ")");
            if (typeof fn === "function") {
                fn({
                    event: event,
                    offset: offset,
                    scrollBarSplitterOffset: scrollBarSplitterOffset
                });
            }
        };
        var drag = d3.drag();
        drag.on("drag", function () {
            var _offset = d3.event.dy;
            scrollBarSplitterOffset += _offset;
            setOffset();
            event.preventDefault();
        });
        var dragging = false;
        drag.on("start", function () {
            scrollBarSplitter.classed("flexable-scrollbar-splitter-drag", true);
            dragging = true;
        });
        drag.on("end", function () {
            scrollBarSplitter.classed("flexable-scrollbar-splitter-drag", false);
            dragging = false;
        });
        scrollBarSplitter.call(drag);
        scrollBarSplitter.on("mousemove", function () {
            scrollBarSplitter.classed("flexable-scrollbar-splitter-drag", true);
        });
        scrollBarSplitter.on("mouseout", function () {
            if (!dragging) {
                scrollBarSplitter.classed("flexable-scrollbar-splitter-drag", false);
            }
        });
        scrollContainer.on("mousewheel", function () {
            var _offset = d3.event.deltaY;
            scrollBarSplitterOffset = (offset + _offset) * sbLenght / elementLength;
            setOffset();
        });
        return;
    }
    exports.connectContainerAndScrollbar = connectContainerAndScrollbar;
    function formatTranslate(str) {
        var translate = /.*translate\([^a-z]*\)/.exec(str);
        if (translate) {
            if (translate[0].match(/-?\d+/g)) {
                if (translate[0].match(/-?\d+/g)[1] !== undefined) {
                    return [translate[0].match(/-?\d+/g)[0], translate[0].match(/-?\d+/g)[1]];
                }
                else {
                    return [translate[0].match(/-?\d+/g)[0], "0"];
                }
            }
            else {
                return ["0", "0"];
            }
        }
        else {
            return ["0", "0"];
        }
    }
    exports.formatTranslate = formatTranslate;
    function getTranslate(element) {
        var transform = element.attr("transform");
        return formatTranslate(transform);
    }
    function flexableContainer(cw, ch, scrollWidth, ew, eh, element) {
        if (ew > cw || eh > ch) {
            var translateStr = Service_1.Service.stringTemplate("translate({x},{y})");
            var parentNode = element.node().parentNode;
            var elementNode = element.node();
            var container = d3.select(parentNode).append("g").classed("flexable-container", true);
            var clipId = _.uniqueId('clip');
            var elementContainer = container.append("g").classed("flexable-elementContainer", true);
            var moveAbleContainer_1 = elementContainer.append("g").classed("flexable-element", true);
            var xscrollOffset = ew > cw ? scrollWidth : 0;
            var yscrollOffset = eh > ch ? scrollWidth : 0;
            parentNode.removeChild(elementNode);
            moveAbleContainer_1.node().appendChild(elementNode);
            elementContainer.append("defs").append("clipPath")
                .attr("id", clipId)
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", cw - yscrollOffset)
                .attr("height", ch - xscrollOffset);
            elementContainer.attr("clip-path", "url(#" + clipId + ")");
            if (ew > cw) {
                var scrollBarContainer = container.append("g").attr("transform", function () { return Service_1.Service.d3Transform().translate(0, ch).rotate(-90)(); });
                connectContainerAndScrollbar(scrollBarContainer, scrollWidth, cw - xscrollOffset, ew + xscrollOffset, 0, function (obj) {
                    var translate = getTranslate(moveAbleContainer_1);
                    moveAbleContainer_1.attr("transform", Service_1.Service.d3Transform().translate(-obj.offset, translate[1])());
                });
            }
            if (eh > ch) {
                var scrollBarContainer = container.append("g").attr("transform", function () { return Service_1.Service.d3Transform().translate(cw - scrollWidth, 0)(); });
                connectContainerAndScrollbar(scrollBarContainer, scrollWidth, cw - yscrollOffset, ew + yscrollOffset, 0, function (obj) {
                    var translate = getTranslate(moveAbleContainer_1);
                    moveAbleContainer_1.attr("transform", Service_1.Service.d3Transform().translate(translate[0], -obj.offset)());
                });
            }
        }
    }
    exports.flexableContainer = flexableContainer;
});
//# sourceMappingURL=Flexable.js.map