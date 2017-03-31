/// <amd-dependency path="lib/underscore">
declare var _:any;
import { Evented} from './Evented'
import {Chart} from "./Chart"
import d3= require('lib/d3')
import {CompareChart} from "./CompareChart"
import {CompareChartMeasure,Measure} from "./Measure"
import { Util,Layout, Style} from "./Utils"
import {Symbol} from "./Symbol"
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
       // s.on("change",this.reRender,this)
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
                .style("height", e.chart.config.height + "px")
                .style("width", e.chart.config.width + "px")
                .style("pointer-events","none")
                .classed(e.style.getClass(),true)
         d.selectAll("*").remove()
        let g= d.append("g").style("transform","translate("+e.layout.getX()+"px ,"+e.layout.getY()+"px)")
        
        if(position==="left"){
            let scale = d3.scaleLinear().domain(domain).range([0, e.layout.getH()])
            let axis = d3.axisLeft(scale)
            if(e.config.format){
                axis.tickFormat(e.config.format)
            }
            // d.style("left", e.layout.getX() - e.layout.getW() + "px")
            // d.style("width", e.layout.getW() + 2 + "px")
          // d.style("height",e.layout.getH())
            g.call(axis)
            g.selectAll("g").append("line").attr("x1",0).attr("y1",0.5).attr("x2",this.chart.ctx("chart-width")).attr("y2",0.5).style("stroke","black")
            //g.append("g").style("transform", "translate(" + (e.layout.getW()) + "px,0px)").call(axis)

        }
        if(position ==="right"){
            let scale = d3.scaleLinear().domain(domain).range([0, e.layout.getH()])
            let axis = d3.axisRight(scale)
            if(e.config.format){
                axis.tickFormat(e.config.format)
            }
           g.call(axis)
        }
        if(position ==="bottom"){
            let scale = d3.scaleLinear().domain(domain).range([0, e.layout.getW()])
            let axis = d3.axisBottom(scale)
            if(e.config.format){
                axis.tickFormat(e.config.format)
            }
           g.call(axis)
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
        div.append("ul").selectAll("li").data(this.getLegendFn()).enter().append("li").append("p")
                                                                    .text(d=>d.name).on("click",(d:Measure)=>{
                                                                        this.chart.getMeasures().filter((m:Measure)=>m.id==d.id)
                                                                                                    .forEach((m:Measure)=>m.style.setStroke("blue"))
                                                                    })
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
    // setChart(c:CompareChart){
    //     this.chart=c
    //     return this
    // }
    chart:CompareChart
    dataFn():CompareChartMeasure[]{return []}
    setDataFn(f){
        this.dataFn=f
        return this
    }
    render(){
            let e = this
            d3.scaleLinear()
           
            let xScale=e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(),"x"),[0,e.layout.getW()])
            let yScale=e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(),"y",true),[0,e.layout.getH()])
            let y2Scale=e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(),"y2",true),[0,e.layout.getH()])
            let c = e.layout.getNode()? d3.select(e.layout.getNode()):  d3.select(e.chart.wrapper.getNode()).append("svg")
                c.style("position", "absolute")
                .style("left", e.layout.getX() + "px")
                .style("top", e.layout.getY() + "px")
                .style("height", e.layout.getH() + "px")
                .style("width", e.layout.getW() + "px")
            c.selectAll("*").remove()
            c.on("mousemove",()=>{
                this.fire("mousemove",d3.mouse(c.node()))
            })
            c.on("click",()=>{
                this.fire("click",d3.mouse(c.node()))
            })
            c.on("mouseout",()=>{
                this.fire("mouseout",d3.mouse(c.node()))
            })
            e.layout.setNode(c.node());
            let d = [].concat(this.dataFn())
            this.chart.ctx("CompareChart",this.chart)
            this.chart.ctx("canvas",this)
            this.chart.ctx("barIndex",{})
            d.map((v: CompareChartMeasure, k) => {
              return v.toSymbolies( e.layout.getNode(),xScale,yScale,this.chart.ctx())
            }).reduce((s1,s2)=>s1.concat(s2)).sort((s1,s2)=> s1.z_index-s2.z_index).forEach(s=>s.render())
            // let ss=d.map((v:CompareChartMeasure)=>v.toSymbolies(e.layout.getNode(),xScale,yScale,this.chart.ctx())).reduce((s1,s2)=>s1.concat(s2))
            // ss.forEach((s)=>s.render(true))
    }
    reRender(){
         if(this.isInit){
             this.render()
        }  
       
    }

}
export class XAreaEventElement extends ChartElement{
    constructor(c:Chart){
        super()
        this.setChart(c)
        c.on("render",this.render,this)
        this.ctx=c.ctx()
    }
    symbolies:Symbol[]= []
    render(){
        let w=Math.ceil(this.layout.getW()/5)
        let c= this.layout.getNode() ? d3.select(this.layout.getNode()):  d3.select(this.chart.wrapper.getNode()).append("svg")
        c.style("position", "absolute")
                .style("left", this.layout.getX() + "px")
                .style("top", this.layout.getY() + "px")
                .style("height", this.layout.getH() + "px")
                .style("width", this.layout.getW() + "px")
        c.on("mousemove",()=>{ let mp=d3.mouse(c.node())
                                  this.symbolies.forEach((s)=>{
                                      if(s.isInsharp(mp[0],mp[1])){
                                           // d3.select(s.node).classed("hover",true)
                                            s.style.setStroke("blue","hover")
                                        }
                                        else{
                                            s.style.reset("hover")
                                        }
                                  })
                              })
        c.on("mouseout",()=>{
            this.symbolies.forEach(s=>{
                s.style.reset("stroke")
            })
        })
        c.on("click",()=>{ let mp=d3.mouse(c.node())
                                  let selected=[]
                                  this.symbolies.filter(s=>s.isInsharp(mp[0],mp[1])).forEach(s=>{if(s.data.selected){
                                      s.data.selected=false
                                      s.style.reset("selected")
                                  }else{
                                      selected.push(s)
                                      s.data.selected=true
                                      s.style.setOpacity(0.2,"selected")
                                  }})
                                  this.chart.fire("selected",selected)
                                  
                            })
        c.selectAll("*").remove()
        this.layout.setNode(c.node())
        this.updateSymbolies()
    }
    dataFn():Symbol[]{return []}
    setDataFn(f){
        this.dataFn=f
        return this
    }
    addSymbole(s:Symbol){
        this.symbolies.push(s)
        // let w=Math.ceil(this.layout.getW()/5)
        // let i= Math.floor(s.x/w)
        // i=i>0?i:0
        // if(this.symbolies[i]){
        //     this.symbolies[i].push(s)
        // }else{
        //     this.symbolies[i]=[]
        //     this.symbolies[i].push(s)
        // }
    }
    updateSymbolies(){
        this.symbolies=[]
        this.dataFn().forEach((s:Symbol)=>{
           this.addSymbole(s)
        })
    }
}
export class CompareChartActiveElement extends ChartElement{
        constructor(c:Chart){
        super()
        this.setChart(c)
        c.on("render",this.render,this)
        this.ctx=c.ctx
    }
    chart:CompareChart
    render(){
        let c= this.layout.getNode() ? d3.select(this.layout.getNode()):  d3.select(this.chart.wrapper.getNode()).append("svg")
        c.style("position", "absolute")
                .style("left", this.layout.getX() + "px")
                .style("top", this.layout.getY() + "px")
                .style("height", this.layout.getH() + "px")
                .style("width", this.layout.getW() + "px")
                c.selectAll("*").remove()
        this.layout.setNode(c.node())
    }
    // showGuideLine(ss:Symbol[]){
    //     d3.select(this.layout.getNode()).selectAll("guideline").remove()
    //     let chart=this.chart
    //     let xScale=this.chart.getScale(this.chart.getDomain(this.chart.getMeasures(),"x"),[0,this.layout.getW()])
    //     let yScale=this.chart.getScale(this.chart.getDomain(this.chart.getMeasures(),"y",true),[0,this.layout.getH()])
    //     let y2Scale=this.chart.getScale(this.chart.getDomain(this.chart.getMeasures(),"y2",true),[0,this.layout.getH()])
    //     ss=ss.filter(s=>s.type=="circle")
    //     if(ss.length>0){
    //           d3.select(this.layout.getNode()).append("g").classed("guideline",true).append("line")
    //                                                             .attr("x1",xScale(ss[0].x))
    //                                                             .attr("y1",ss[])
    //     }
      
    // }
    
}
export class Tooltip extends ChartElement{
     constructor(c:Chart){
        super()
        this.setChart(c)
        c.on("render",this.render,this)
        this.ctx=c.ctx
    }
    render(){
        let c= this.layout.getNode() ? d3.select(this.layout.getNode()):  d3.select(this.chart.wrapper.getNode()).append("div").classed(".tooltipContainer",true)
         c.style("position", "absolute")
                .style("left", "0px")
                .style("top","0px")
        c.selectAll("*").remove()
        this.layout.setNode(c)
    }
    _template:string
    showTooltip(p){
        d3.select(this.layout.getNode()).select(".tooltip")
                                            .style("left",p[0]+"px")
                                            .style("top",p[1]+"px")
        d3.select(this.layout.getNode()).style("display","visiable")
                                            
    }
    hideenTooltip(){
        d3.select(this.layout.getNode()).style("display","none")
    }
    setContent(c:string){
        d3.select(this.layout.getNode()).selectAll("*").remove()
        d3.select(this.layout.getNode()).append("div").classed("tooltip",true)
                                            .append(c)

    }
    setTemplate(t){
        this._template=t
    }
    getContent(obj){
         _.templateSettings = {
                interpolate: /\{\{(.+?)\}\}/g
            };
        return _.template(this._template,obj)
    }
}
