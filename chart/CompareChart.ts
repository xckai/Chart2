/// <amd-dependency path="lib/underscore">
/// <amd-dependency path="lib/d3">
declare var _:any;
//declare var d3:any;
import d3= require('lib/d3')
//import * as d3 from "d3"
import {CompareChartMeasure} from "./Measure"
import {Evented} from './Evented'
import { Util,Layout} from "./Utils"
let a=document.createElement

class ChartElement extends Evented{
    constructor(type:string,l:Layout,d:any,chart:CompareChart){
        super()
        this.type=type
        this.layout=l
        this.data=d
        this.chart=chart
    }
    chart:CompareChart
    type:string
    layout:Layout
    data:any
}

export class CompareChart extends Evented{
    constructor(cfg) {
        super();
        _.each(cfg,(v,k)=>{
            this.config[k]=v;
        })
    }
    config={
        class:"CompareChart",
        title:{
            value:"",
            class:"title",
            visiable:true
        },
        xTitle:{
            value:"",
            class:"xTitle",
            visiable:true
        },
        yTitle:{
            value:"",
            class:"yTitle",
            visiable:true
        },
        y2Title:{
            value:"",
            class:"y2Title",
            visiable:true
        },
        width:300,
        height:300
    }
    wrapper= new Layout()
    canvas={
        node:new Layout (),
        legend:new Layout (),
        title:new Layout (),
        xTitle:new Layout (),
        yTitle:new Layout (),
        y2Title:new Layout (),
        xAxis:new Layout ("svg"),
        yAxis:new Layout ("svg"),
        y2Axis:new Layout ("svg"),
        chart:new Layout ("svg")
    }
    addMeasure(nm:CompareChartMeasure){
      let i=  _.findIndex(this.measures,(m)=>nm.id == m.id);
      if(i!= -1){
          this.measures[i]=nm;
      }else{
          this.measures.push(nm);
      }
      this.fire("measure-add",nm);
      return this;
    }
    legend={
        getHeight:(o)=>{
            return 0;
        },
        getWidth:(o)=>{
            return 0
        }
    }
    getMeasures():CompareChartMeasure []{
        return this.measures;
    }
    measures:CompareChartMeasure [];
    getDomain(ms: CompareChartMeasure [],type:string,revert?:boolean){
        let r=[];
        if(!ms){
            r= [0,1]
        }else{
            let mss=_.reduce(ms,(m1:CompareChartMeasure,m2:CompareChartMeasure)=>m1.plunkDatas(type).concat(m1.plunkDatas(type)));
        r[0]=Util.min(mss);
        r[1]=Util.max(mss);
        }
        
        if (revert){
            let t=r[0]
            r[0]=r[1]
            r[1]=t
        }
        return r;
    }
    stringRect(con){

        let ccls=this.config.class+" "+con.cls;
        return Util.getStringRect(con.value,ccls);        
    }
    getScale(domain:any [],range:any []){
        return d3.scaleLinear().domain(domain).range(range);
    }
    beforeDraw(){

    }
    calculateLayout(){
        let c=this.canvas
        let con=this.config
        // if(this.config.height>this.config.width){
        //     con.
        // }
        c.node.x(0)
        c.node.y(0)
        c.node.w(this.config.width)
        c.node.h(this.config.height)
        if(this.config.title.visiable){
            c.title.x(0)
            c.title.y(0)
            this.canvas.title.w(c.node.w())
            this.canvas.title.h(this.stringRect(this.config.title).height)
        }
        if(con.xTitle.visiable){
            c.xTitle.x(0)
            c.xTitle.y(c.node.h()-this.legend.getHeight("bottom"))
            c.xTitle.w(this.stringRect(c.xTitle).width)
            c.xTitle.h(this.stringRect(c.xTitle).height)
        }
            
            c.xAxis.h(30)
            c.xAxis.y(c.node.h()-c.xTitle.h()-c.xAxis.h()-this.legend.getHeight("bottom"))
            c.chart.y(c.title.h())
            c.chart.h(c.node.h()-c.title.h()-c.xAxis.h()-c.xTitle.h()-this.legend.getHeight("bottom"))
////calculate x 
        if(con.yTitle.visiable){
            c.yTitle.x(0)
            c.yTitle.y(0)
            c.yTitle.h(this.stringRect(c.yTitle).height)
            c.yTitle.w(this.stringRect(c.yTitle).width)
        }
            c.yAxis.w(30)
            c.yAxis.h(c.chart.h())
            c.yAxis.x(c.yTitle.w()+c.yAxis.w())
            c.yAxis.y(c.title.h())
            c.y2Title.w(this.stringRect(c.y2Title).width)
            c.y2Title.h(this.stringRect(c.y2Title).height)
            if(con.y2Title.visiable){
                c.y2Axis.w(30)
                c.y2Axis.h(c.chart.h())
                c.y2Axis.x(c.node.w()-c.y2Axis.w()-c.y2Title.w())
                c.y2Axis.y(c.title.h())
            
            }

            c.y2Title.x(c.node.w()-c.y2Title.w()-this.legend.getWidth("right"))
            c.y2Title.y(c.title.h())
            c.y2Title.y()
            c.chart.x(c.yAxis.w()+c.yTitle.w())
            c.chart.w(c.node.w()-c.yTitle.w()-c.yAxis.w()-c.y2Axis.w()-c.y2Title.w())
            c.xAxis.x(c.yTitle.w()+c.yAxis.w())
            c.xAxis.w(c.chart.w())

            c.y2Title.h(c.chart.h())
            c.yTitle.h(c.chart.h())
            c.xTitle.w(c.chart.w())


    }
    prepareCanvas(){

        this.wrapper.node(d3.select("#chart").append("div").classed(this.config.class,true).node())
        d3.select(this.wrapper.node()).style("position","absolute");
   
       // this.canvas.node.node(d3.select(this.wrapper.node()).append("svg").node());
        // let node = d3.select(this.canvas.node.node())
        // let c=this.canvas
        // c.title.node(node.append("g").classed("title",true).node())

        // c.xAxis.node(node.append("g").classed("xAxis",true).node())
        // c.xTitle.node(node.append("g").classed("xTitle",true).node())

        // c.yTitle.node(node.append("g").classed("yTitle",true).node())
        // c.yAxis.node(node.append("g").classed("yAxis",true).node())

        // c.y2Title.node(node.append("g").classed("y2Title",true).node())
        // c.y2Axis.node(node.append("g").classed("y2Axis",true).node())
    }
    toElements(canvas:Object,measures:CompareChartMeasure[]){
        let r= [],chart=this
        r.push(new ChartElement("chart",this.canvas.chart,this.measures,this))
        r.push(new ChartElement("title",this.canvas.title,this.config.title.value,this))
        r.push(new ChartElement("title",this.canvas.xTitle,this.config.xTitle.value,this))
        r.push(new ChartElement("title",this.canvas.yTitle,this.config.yTitle.value,this))
        r.push(new ChartElement("title",this.canvas.y2Title,this.config.y2Title.value,this))
        
        r.push(new ChartElement("axis",this.canvas.xAxis,"bottom",this))
        r.push(new ChartElement("axis",this.canvas.yAxis,"left",this))
        r.push(new ChartElement("axis",this.canvas.y2Axis,"right",this))
        return r
    }
    getChartLayout(){
        return this.canvas.chart
    }
    render(){
        this.prepareCanvas()
        this.calculateLayout()
        let renderer=this.renderer;
        this.toElements(this.canvas,this.measures).forEach(titleRender)
        this.toElements(this.canvas,this.measures).forEach(axisRender)
    }
    renderer(e:ChartElement){
        if(e.type!=="node"){
            switch (e.layout.render){
                case "svg":
                               d3.select(e.chart.wrapper.node()).append("svg")
                                    .style("position","absolute")
                                    .style("left",e.layout.x()+"px")
                                    .style("top",e.layout.y()+"px")
                                    .style("height",e.layout.h()+"px")
                                    .style("width",e.layout.w()+"px")
                                    .attr("type",e.type)
                                break
                 case "html":
                         d3.select(e.chart.wrapper.node()).append("div")
                                    .style("position","absolute")
                                    .style("left",e.layout.x()+"px")
                                    .style("top",e.layout.y()+"px")
                                    .style("height",e.layout.h()+"px")
                                    .style("width",e.layout.w()+"px")
                                    .attr("type",e.type)
                                break               

            }
        }
    }
    updateCanvasLayout(){
        let c=this.canvas;
        let con=this.config
        let translater=(x:number,y:number)=>{
            if(x!=undefined && y != undefined){
                return "translate("+x+"px,"+y+"px)"
            }
            return "";
        }
        let updater=(l:Layout)=>{
            d3.select(l.node()).style("transform",translater(l.x(),l.y()))
        }
        let clipper=(l:Layout)=>{

        }
        _.each(this.canvas,(v,k)=>{
            updater(v);
        })
    }
}
let titleRender=(e:ChartElement)=>{
    if(e.layout.render==="html"){
        let div= d3.select(e.chart.wrapper.node()).append("div")
                                    .style("position","absolute")
                                    .style("left",e.layout.x()+"px")
                                    .style("top",e.layout.y()+"px")
                                    .style("height",e.layout.h()+"px")
                                    .style("width",e.layout.w()+"px")
                                    .attr("type",e.type)
        div.append("p").text(e.data)
    }
}
let axisRender=(e:ChartElement)=>{
    if(e.layout.render==="svg"){
        let d= d3.select(e.chart.wrapper.node()).append("svg")
                                    .style("position","absolute")
                                    .style("left",e.layout.x()+"px")
                                    .style("top",e.layout.y()+"px")
                                    .style("height",e.layout.h()+"px")
                                    .style("width",e.layout.w()+"px")
                                    .attr("type",e.type)
        let axis=null;
        if(e.data==="left"){
            let scale=d3.scaleLinear().domain(e.chart.getDomain(e.chart.getMeasures(),"y",true)).range([0,e.layout.h()])
            axis=d3.axisLeft(scale)
            d.style("left",e.layout.x()-e.layout.w()+"px")
            d.style("width",e.layout.w()+2+"px")
            d.append("g").style("transform","translate("+(e.layout.w())+"px,0px)").call(axis)
             //d.call(axis)
        }
        if(e.data==="right"){
            let scale=d3.scaleLinear().domain(e.chart.getDomain(e.chart.getMeasures(),"y2",true)).range([0,e.layout.h()])
            axis=d3.axisRight(scale)
             d.call(axis)
        }
        if(e.data==="bottom"){
            let scale=d3.scaleLinear().domain(e.chart.getDomain(e.chart.getMeasures(),"x")).range([0,e.layout.w()])
            axis=d3.axisBottom(scale)
             d.call(axis)
        }
    }
}