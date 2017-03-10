/// <amd-dependency path="lib/underscore">
declare var _: any;
import d3 = require("lib/d3");
import {
    Service,
    BaseClass
} from "Chart/Service"

function rectGen(x: number, y: number, w: number, h: number, r: number, tl: boolean, tr: boolean, bl: boolean, br: boolean) {
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
    } else {
        path += "h" + r;
        path += "v" + r;
    }
    path += "v" + (h - 2 * r);
    if (br) {
        path += "a" + r + "," + r + " 0 0 1 " + -r + "," + r;
    } else {
        path += "v" + r;
        path += "h" + -r;
    }
    path += "h" + (2 * r - w);
    if (bl) {
        path += "a" + r + "," + r + " 0 0 1 " + -r + "," + -r;
    } else {
        path += "h" + -r;
        path += "v" + -r;
    }
    path += "v" + (2 * r - h);
    if (tl) {
        path += "a" + r + "," + r + " 0 0 1 " + r + "," + -r;
    } else {
        path += "v" + -r;
        path += "h" + r;
    }
    path += "z";
    return path;
}

function connectContainerAndScrollbar(scroll: any, sbw: number, sbLenght: number, elementLength: number, elementOffset: number, fn) {
    let scrollContainer = scroll;
    let scrollBarBackground = scrollContainer.append("path").attr("d", rectGen(0, 0, sbw, sbLenght, 5, true, true, true, true)).classed("flexable-scrollbar", true)
    let offset = elementOffset,
        scrollBarSplitterOffset = 0,
        scrollBarSplitterLength = sbLenght * Math.min(sbLenght / elementLength);
    let scrollBarSplitter = scrollContainer.append("path").attr("d", rectGen(0.5, 0, sbw - 1, scrollBarSplitterLength, 5, true, true, true, true)).classed("flexable-scrollbar-splitter", true)
    scrollBarSplitterOffset = offset * sbLenght / elementLength;
    scrollBarSplitter.attr("transform", "translate(0," + scrollBarSplitterOffset + ")");
    let setOffset = function () {
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
                event,
                offset,
                scrollBarSplitterOffset
            });
        }
    }
    let drag = d3.drag();
    drag.on("drag", function () {
        var _offset = d3.event.dy;
        scrollBarSplitterOffset += _offset;
        setOffset();
        event.preventDefault();
    })
    let dragging = false;
    drag.on("start", function () {
        scrollBarSplitter.classed("flexable-scrollbar-splitter-drag", true);
        dragging = true;
    })
    drag.on("end", function () {
        scrollBarSplitter.classed("flexable-scrollbar-splitter-drag", false);
        dragging = false;
    })
    scrollBarSplitter.call(drag);
    scrollBarSplitter.on("mousemove", function () {
        scrollBarSplitter.classed("flexable-scrollbar-splitter-drag", true);
    })
    scrollBarSplitter.on("mouseout", function () {
        if (!dragging) {
            scrollBarSplitter.classed("flexable-scrollbar-splitter-drag", false);
        }
    })
    scrollContainer.on("mousewheel", function () {
        var _offset = d3.event.deltaY;
        scrollBarSplitterOffset = (offset + _offset) * sbLenght / elementLength;
        setOffset();
    })
    return ;


}

function formatTranslate(str:string) {
    let translate = /.*translate\([^a-z]*\)/.exec(str);
    if (translate) {
        if (translate[0].match(/-?\d+/g)) {
            if (translate[0].match(/-?\d+/g)[1] !== undefined) {
                return [translate[0].match(/-?\d+/g)[0], translate[0].match(/-?\d+/g)[1]];
            } else {
                return [translate[0].match(/-?\d+/g)[0], "0"];
            }
        } else {
            return ["0", "0"];
        }
    } else {
        return ["0", "0"];
    }
}

function getTranslate(element) {
    let transform = element.attr("transform");
    return formatTranslate(transform);
}

function flexableContainer(cw:number, ch:number, scrollWidth:number, ew:number, eh:number, element:any) {
    if (ew > cw || eh > ch) {
        let translateStr = Service.stringTemplate("translate({x},{y})")
        let parentNode = element.node().parentNode;
        let elementNode = element.node();
        let container = d3.select(parentNode).append("g").classed("flexable-container", true);
        var clipId = _.uniqueId('clip');
        let elementContainer = container.append("g").classed("flexable-elementContainer",true);
        let moveAbleContainer = elementContainer.append("g").classed("flexable-element",true)
        let xscrollOffset = ew > cw ? scrollWidth : 0;
        let yscrollOffset = eh > ch ? scrollWidth : 0;
        parentNode.removeChild(elementNode);
        moveAbleContainer.node().appendChild(elementNode);
        
        elementContainer.append("defs").append("clipPath")
                        .attr("id", clipId)
                        .append("rect")
                        .attr("x",0)
                        .attr("y",0)
                        .attr("width", cw-yscrollOffset)
                        .attr("height",ch-xscrollOffset);
        elementContainer.attr("clip-path","url(#"+clipId+")");
        if (ew > cw) {
            let scrollBarContainer = container.append("g").attr("transform", () => Service.d3Transform().translate(0, ch).rotate(-90)());
            connectContainerAndScrollbar(scrollBarContainer, scrollWidth, cw -xscrollOffset, ew + xscrollOffset, 0, (obj) => {
                let translate=getTranslate(moveAbleContainer);
                moveAbleContainer.attr("transform", Service.d3Transform().translate(-obj.offset, translate[1])())
            })
        }
        if (eh > ch) {
            let scrollBarContainer = container.append("g").attr("transform", () => Service.d3Transform().translate(cw - scrollWidth, 0)());
            connectContainerAndScrollbar(scrollBarContainer, scrollWidth, cw - yscrollOffset, ew + yscrollOffset, 0, (obj) => {
                let translate=getTranslate(moveAbleContainer);
                moveAbleContainer.attr("transform", Service.d3Transform().translate(translate[0], -obj.offset)())
            })
        }
    }
}

export {
    flexableContainer,formatTranslate,connectContainerAndScrollbar
};