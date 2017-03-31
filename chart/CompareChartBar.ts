/// <amd-dependency path="lib/underscore">
declare var _: any;
import d3 = require('lib/d3')
import {Style}from "./Utils"
import {CompareChartMeasure} from "./Measure"
import {CompareChart} from "./CompareChart"
import {CompareChartCanvasElement} from "./ChartElement"
import {Symbol,Bar} from "./Symbol"
import {barRender} from"./SvgRender"
export class CompareChartBar extends CompareChartMeasure{
    type="bar"
    constructor(id?,name?,ref?,ds?){
        super(id,name,"line",ref,ds)
    }
    update(){
        console.log("changed")
    }
    color(d,ds?,ctx?):string{
        if(d.y>115){
            return "red"
        }
        return "black"
    }
    dashArray(d,ds,ctx?){
        if(d.y>113)
            {return "1,3"}
        else{
            return ""
        }
    }
    width(p1,p2,ctx?){
        if(p1.y>112){
            return 4
        }
        return 2
    }
    fillColor(d,ds,ctx?){
        return "blue"
    }
    render(node,xScale,yScale,ctx){
      let ds=this.getData()
      let barIndex=ctx["barIndex"]
      let getBarIndex=(v)=>{
            if(barIndex[v]){
                return barIndex[v]+=1
            }else{
                return    barIndex[v]=1
            }
        }
     let compareChart:CompareChart=ctx.CompareChart
     let chart:CompareChartCanvasElement=ctx["canvas"]
     let w=60/compareChart.maxBarsNum()
     _.each([].concat(ds),(d)=>{
        d3.select(node).append("rect").attr("x",xScale(d.x)-w*compareChart.barNum(d.x)/2+w*(getBarIndex(d.x)-1))
                                        .attr("y",yScale(d.y))
                                        .attr("width",w)
                                        .attr("height",chart.layout.getH()-yScale(d.y))
                                        .style("fill",this.style.getFillColor())
    })
}   
    getStyle(d,ds,ctx?){
            let color=typeof(this.color) ==="function"? this.color(d,ds,ctx):this.color
            let dasharray=typeof(this.dashArray) ==="function"? this.dashArray(d,ds,ctx):this.dashArray
            let width=typeof(this.width) ==="function"? this.width(d,ds,ctx):this.width
            let fillColor=typeof(this.fillColor) ==="function"? this.fillColor(d,ds,ctx):this.fillColor
            return new Style(color,fillColor,1,width,dasharray)
    }
    toSymbolies(node,xScale,yScale,ctx?){
        this.symbolizes=this.getData().map((d)=>{
            
            let ds=this.getData()
            let barIndex=ctx["barIndex"]
            let getBarIndex=(v)=>{
                    if(barIndex[v]){
                        return barIndex[v]+=1
                    }else{
                        return    barIndex[v]=1
                    }
                }
            let compareChart:CompareChart=ctx.CompareChart
            let chart:CompareChartCanvasElement=ctx["canvas"]
            let w=60/compareChart.maxBarsNum()
            // _.each([].concat(ds),(d)=>{
            //     d3.select(node).append("rect").attr("x",xScale(d.x)-w*compareChart.barNum(d.x)/2+w*(getBarIndex(d.x)-1))
            //                                     .attr("y",yScale(d.y))
            //                                     .attr("width",w)
            //                                     .attr("height",chart.layout.getH()-yScale(d.y))
            //                                     .style("fill",this.style.getFillColor())
            // })
            let s= new Bar(xScale(d.x)-w*compareChart.barNum(d.x)/2+w*(getBarIndex(d.x)-1),yScale(d.y),w,chart.layout.getH()-yScale(d.y))
            s.setStyle(this.getStyle(d,this))
            s.setRender(barRender)
            s.measure=this
            s.canvas=node
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
            return s
        })
        return this.symbolizes
}
}