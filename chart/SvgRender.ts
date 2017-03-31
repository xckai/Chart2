/// <amd-dependency path="lib/underscore">
declare var _:any;
declare var window:any;
import { IChartElement } from "./Chart"
import { CompareChartMeasure } from "./Measure"
import {Style} from"./Utils"
import {Symbol,Line,Bar,Circle} from "./Symbol"
import d3= require('lib/d3')
export function lineRender(){
    let l:Line=this
    if(!l.node){
         l.node=d3.select(l.canvas).append("path").node()
    }
    let line=d3.select(l.node)
    line.style("stroke",l.style.getStroke())
    line.style("stroke-width",l.style.getLineWidth())
    line.style("fill","none").style("stroke-dasharray",l.style.getDashArray())
    line.attr("d",l.d)
}
export function barRender(){
    let s:Bar=this
    if(!s.node){
         s.node=d3.select(s.canvas).append("rect").node()
    }
    let symbol = d3.select(s.node)
    symbol.attr("x",s.x).attr("y",s.y)
                            .attr("width",s.w)
                            .attr("height",s.h)
                            .attr("fill",s.style.getFillColor())
                            .attr("stroke",s.style.getStroke())
                            .attr("stroke-width",s.style.getLineWidth())
                            .attr("opacity",s.style.getOpacity())
}