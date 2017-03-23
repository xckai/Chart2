import { Evented} from './Evented'
import {Chart} from "./Chart"
import d3= require('lib/d3')
import {CompareChart} from "./CompareChart"
import { Util,Layout, Style,HTMLRender,CanvasRender,IChartElementRender} from "./Utils"
export  abstract class ChartElement extends Evented{
    chart:Chart
    config:any={}
    isInit:boolean=false
    style:Style
    layout:Layout
    render(){}
    reRender(){}
    ctx:any
    setChart(c:Chart){
        this.chart=c
        return this
    }
    setLayout(l){
        this.layout=l
        this.layout.on("change",this.reRender,this)
        return this
    }
    setStyle(s:Style){
        this.style=s
        s.on("change",this.reRender,this)
        return this
    }
    setConfig(c){
        this.config=c
        return this
    }
    internalStatus:any={}
}
export class AxisElement extends ChartElement{
    constructor(c:Chart){
        super()
        this.setChart(c)
        c.on("render",this.render,this)
        this.ctx=c.ctx()
        this.internalStatus.domain=[]
    }
    config:{
        format:()=>{}
    }
    domainFn(){}
    setDomainFn(fn){
        this.domainFn=fn
        return this
    }
    render(){
       let ctx=this.chart.ctx()
       let newDomain=this.domainFn()
       if(newDomain[0] !=this.internalStatus.domain[0] || newDomain[1]!= this.internalStatus.domain[1]){
           this.internalStatus.domain=newDomain
           this._rerender(this,newDomain,this.layout.getPosition())
       }
       this.isInit=true
    }
    reRender(){
        if(this.isInit){
             this._rerender(this,this.internalStatus.domain,this.layout.getPosition())
        }  
    }
    _rerender(e:ChartElement,domain,position){
        let d=e.layout.getNode()?d3.select(e.layout.getNode()):d3.select(e.chart.wrapper.getNode()).append("svg")
            d.style("position", "absolute")
                .style("left", e.layout.getX() + "px")
                .style("top", e.layout.getY() + "px")
                .style("height", e.layout.getH() + "px")
                .style("width", e.layout.getW() + "px")
                .classed(e.style.getClass(),true)
            d.selectAll("*").remove()
        if(position==="left"){
            let scale = d3.scaleLinear().domain(domain).range([0, e.layout.getH()])
            let axis = d3.axisLeft(scale)
            if(e.config.format){
                axis.tickFormat(e.config.format)
            }
            d.style("left", e.layout.getX() - e.layout.getW() + "px")
            d.style("width", e.layout.getW() + 2 + "px")
          // d.style("height",e.layout.getH())
            d.append("g").style("transform", "translate(" + (e.layout.getW()) + "px,0px)").call(axis)

        }
        if(position ==="right"){
            let scale = d3.scaleLinear().domain(domain).range([0, e.layout.getH()])
            let axis = d3.axisRight(scale)
            if(e.config.format){
                axis.tickFormat(e.config.format)
            }
            d.call(axis)
        }
        if(position ==="bottom"){
            let scale = d3.scaleLinear().domain(domain).range([0, e.layout.getW()])
            let axis = d3.axisBottom(scale)
            if(e.config.format){
                axis.tickFormat(e.config.format)
            }
            d.call(axis)
        }
        e.layout.setNode(d.node())
    }
}
export class TitleElement extends ChartElement{
    constructor(c:Chart){
        super()
        this.setChart(c)
        c.on("render",this.render,this)
        this.ctx=c.ctx()
    }
    internalStatus:any={}
    render(){
        let e=this
        if(this.internalStatus.value!=e.config.value){
            let div =e.layout.getNode()?d3.select(e.layout.getNode()) :d3.select(e.chart.wrapper.getNode()).append("div")
            div.style("position", "absolute")
            .style("left", e.layout.getX() + "px")
            .style("top", e.layout.getY() + "px")
            .style("height", e.layout.getH() + "px")
            .style("width", e.layout.getW() + "px")
        e.layout.setNode(div.node())
        div.node().innerHTML=""
        div.append("p").classed(e.style.getClass(), true).text(e.config.value) 
    }
    this.isInit=true
    }
    reRender(){
        if(!this.isInit){
            return
        }
        let e=this
        let div =e.layout.getNode()?d3.select(e.layout.getNode()) :d3.select(e.chart.wrapper.getNode()).append("div")
            div.style("position", "absolute")
            .style("left", e.layout.getX() + "px")
            .style("top", e.layout.getY() + "px")
            .style("height", e.layout.getH() + "px")
            .style("width", e.layout.getW() + "px")
        e.layout.setNode(div.node())
        div.node().innerHTML=""
        div.append("p").classed(e.style.getClass(), true).text(e.config.value) 
    }
}
export class LegendElement extends ChartElement{
     constructor(c:Chart){
        super()
        this.setChart(c)
        c.on("render",this.render,this)
        this.ctx=c.ctx()
    }
    setLegendDataFn(f){
        this.getLegendFn=f
        return this
    }
    getLegendFn():any[]{return []}
    render(){
        let e=this
        let div =e.layout.getNode()?d3.select(e.layout.getNode()) :d3.select(e.chart.wrapper.getNode()).append("div")
            div.style("position", "absolute")
            .style("left", e.layout.getX() + "px")
            .style("top", e.layout.getY() + "px")
            .style("height", e.layout.getH() + "px")
            .style("width", e.layout.getW() + "px")
            .classed("legend",true)
        e.layout.setNode(div.node())
        div.node().innerHTML=""
        div.append("ul").selectAll("li").data(this.getLegendFn()).enter().append("li").append("p").text("hah")
    }
    reRender(){
        this.render()
    }
}
export class CompareChartCanvasElement extends ChartElement {
        constructor(c:CompareChart){
        super()
        this.setChart(c)
        c.on("render",this.render,this)
        this.ctx=c.ctx()
    }

}