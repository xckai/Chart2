/// <amd-dependency path="lib/underscore">
declare var _:any;
declare var window:any;
import { IChartElement } from "./Chart"
import { CompareChartElement ,CompareChart} from "./CompareChart"
import { CompareChartMeasure } from "./Measure"
import {Style ,IChartElementRender,pathGen} from "./Utils"
import d3= require('lib/d3')
export class SVGRender implements IChartElementRender{
      titleRender(e:IChartElement){
        let div ,text
        if(e.layout.node()){
            div=d3.select(e.layout.node())
                .style("position", "absolute")
                .style("left", e.layout.x() + "px")
                .style("top", e.layout.y() + "px")
                .style("height", e.layout.h() + "px")
                .style("width", e.layout.w() + "px")
                .classed(e.data.class, true)
            div.selectAll("*").remove()
        }else{
            div = d3.select(e.chart.wrapper.node()).append("g")
                .style("position", "absolute")
                .style("left", e.layout.x() + "px")
                .style("top", e.layout.y() + "px")
                .style("height", e.layout.h() + "px")
                .style("width", e.layout.w() + "px")
                .classed(e.data.class, true)
          
        }
        text=div.append("text")
       text.text(e.data.value)
       e.layout.node(div.node())  
    }
     axisRender(e:IChartElement,domain,position:string){
        let d=e.layout.node()?d3.select(e.layout.node()):d3.select(e.chart.wrapper.node()).append("svg")
            d.style("position", "absolute")
                .style("left", e.layout.x() + "px")
                .style("top", e.layout.y() + "px")
                .style("height", e.layout.h() + "px")
                .style("width", e.layout.w() + "px")
                .classed(e.data.class,true)
            d.selectAll("*").remove()
        if(position==="left"){
            let scale = d3.scaleLinear().domain(domain).range([0, e.layout.h()])
            let axis = d3.axisLeft(scale)
            if(e.data.format){
                axis.tickFormat(e.data.format)
            }
            d.style("left", e.layout.x() - e.layout.w() + "px")
            d.style("width", e.layout.w() + 2 + "px")
          // d.style("height",e.layout.h())
            d.append("g").style("transform", "translate(" + (e.layout.w()) + "px,0px)").call(axis)

        }
        if(position ==="right"){
            let scale = d3.scaleLinear().domain(domain).range([0, e.layout.h()])
            let axis = d3.axisRight(scale)
            if(e.data.format){
                axis.tickFormat(e.data.format)
            }
            d.call(axis)
        }
        if(position ==="bottom"){
            let scale = d3.scaleLinear().domain(domain).range([0, e.layout.w()])
            let axis = d3.axisBottom(scale)
            if(e.data.format){
                axis.tickFormat(e.data.format)
            }
            d.call(axis)
        }
        e.layout.node(d.node())
    }
    legendRender(e:CompareChartElement){
        
    }
    chartRender(e:CompareChartElement){
            let xScale=e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(),"x"),[0,e.layout.w()])
            let yScale=e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(),"y",true),[0,e.layout.h()])
            let y2Scale=e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(),"y2",true),[0,e.layout.h()])
            let c = e.layout.node()? d3.select(e.layout.node()):  d3.select(e.chart.wrapper.node()).append("svg")
                c.style("position", "absolute")
                .style("left", e.layout.x() + "px")
                .style("top", e.layout.y() + "px")
                .style("height", e.layout.h() + "px")
                .style("width", e.layout.w() + "px")
            c.selectAll("*").remove()
            e.layout.node(c.node());
            let d = [].concat(e.data)
            d.forEach((v: CompareChartMeasure, k) => {
                switch(v.type){
                    case "line":
                        this.lineRender(xScale,yScale,e.layout.node(),v.data(),v.style,{});
                        break
                    case "circle":
                        this.circleRender(xScale,yScale,e.layout.node(),v.data(),v.style,{});
                        break
                    case "bar":
                        this.barRender(xScale,yScale,e.layout.node(),v.data(),v.style,{compareChart:e.chart,chart:e})
                        break
                }
            })
        }
     lineRender=(xScale,yScale,node,ds,style:Style,ctx?)=>{
     d3.select(node).append("path").attr("d",pathGen(xScale,yScale,ds,false))
                                        .style("stroke",style.color)
                                        .style("stroke-width",style.lineWidth)
                                        .style("fill","none")
                                        
    }
    circleRender=(xScale,yScale,node,ds,style:Style,ctx?)=>{
     _.each([].concat(ds),(d)=>{
        d3.select(node).append("ellipse").attr("cx",xScale(d.x))
                                        .attr("cy",yScale(d.y))
                                        .attr("rx",style.rx)
                                        .attr("ry",style.ry)
                                        .style("fill",style.fillColor);     
    })
}
    barRender=(xScale,yScale,node,ds,style:Style,ctx?,m?:CompareChartMeasure)=>{
     let compareChart:CompareChart=ctx.compareChart
     let chart:CompareChartElement=ctx["chart"]
     let w=70/compareChart.maxBarsNum()
     _.each([].concat(ds),(d)=>{
        d3.select(node).append("rect").attr("x",xScale(d.x)-w*compareChart.barNum(d.x)/2+w*(compareChart.getBarIndex(d.x)-1))
                                        .attr("y",yScale(d.y))
                                        .attr("width",w)
                                        .attr("height",chart.layout.h()-yScale(d.y))
                                        .style("fill",style.fillColor);     
    })
    }
}