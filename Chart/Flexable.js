var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/d3", "Chart/Service", "lib/underscore"], function (require, exports, d3, Service_1) {
    "use strict";
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
        return Flexable;
    }
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
            var elementContainer_1 = container.append("g");
            var xscrollOffset = ew > cw ? scrollWidth : 0;
            var yscrollOffset = eh > ch ? scrollWidth : 0;
            parentNode.removeChild(elementNode);
            elementContainer_1.node().appendChild(elementNode);
            if (ew > cw) {
                var scrollBarContainer = container.append("g").attr("transform", function () { return Service_1.Service.d3Transform().translate(0, ch).rotate(-90)(); });
                connectContainerAndScrollbar(scrollBarContainer, scrollWidth, cw, ew + xscrollOffset, 0, function (obj) {
                    elementContainer_1.attr("transform", Service_1.Service.d3Transform().translate(-obj.offset, getTranslate(elementContainer_1)[1])());
                });
            }
            if (eh > ch) {
                var scrollBarContainer = container.append("g").attr("transform", function () { return Service_1.Service.d3Transform().translate(cw - scrollWidth, 0)(); });
                connectContainerAndScrollbar(scrollBarContainer, scrollWidth, cw - yscrollOffset, ew + yscrollOffset, 0, function (obj) {
                    elementContainer_1.attr("transform", Service_1.Service.d3Transform().translate(getTranslate(elementContainer_1)[0], -obj.offset)());
                });
            }
        }
    }
    var Flexable = (function (_super) {
        __extends(Flexable, _super);
        function Flexable() {
            _super.apply(this, arguments);
        }
        Flexable.connectContainerAndScrollbar = connectContainerAndScrollbar;
        Flexable.flexableContainer = flexableContainer;
        Flexable.formatTranslate = formatTranslate;
        return Flexable;
    }(Service_1.BaseClass));
    exports.Flexable = Flexable;
});
//# sourceMappingURL=Flexable.js.map