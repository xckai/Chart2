/// <amd-dependency path="lib/underscore">
/// <amd-dependency path="lib/d3">
declare var _:any;
//declare var d3:any;
import d3= require('lib/d3')
//import * as d3 from "d3"
import {CompareChartMeasure} from "./Measure"
import {Evented} from './Evented'
import { Util} from "./Utils"
let a=document.createElement
class Layout{
    constructor(){

    }
   private _w:0
   private _h:0
   private _x:0
   private _y:0
   private _p:"default"
   private _node:HTMLElement
    w(v?):any{
        return v!==undefined? (this._w=v,this):this._w;
    }
    h(v?):any{
        return v!==undefined?(this._h=v,this):this._h;
    }
    node(v?):any{
        return v!==undefined?(this._node=v,this):this._node;
    }
    x(v?):any{
        return v!==undefined? (this._x=v,this):this._x;
    }
    y(v?):any{
        return v!==undefined? (this._y=v,this):this._y;
    }
    position(p?):any{
        return p!==undefined? (this._p=p,this):this._p;
    }
    
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
    canvas={
        wrapper:new Layout(),
        node:new Layout (),
        legend:new Layout (),
        title:new Layout (),
        xTitle:new Layout (),
        yTitle:new Layout (),
        y2Title:new Layout (),
        xAxis:new Layout (),
        yAxis:new Layout (),
        y2Axis:new Layout (),
        chart:new Layout ()
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
    measures:CompareChartMeasure [];
    getDomain(ms: CompareChartMeasure [],type:string){
        let r=[];
        let mss=_.reduce(ms,(m1:CompareChartMeasure,m2:CompareChartMeasure)=>m1.plunkDatas(type).concat(m1.plunkDatas(type)));
        r[0]=Util.min(mss);
        r[1]=Util.max(mss);
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
    console.log(this.config.width);
        c.node.x(0)
        c.node.y(0)
        c.node.w(this.config.width)
        c.node.h(this.config.height)
        if(this.config.title.visiable){
            c.title.x(c.node.w()/2)
            c.title.y(0)
            this.canvas.title.w(this.stringRect(this.config.title).width)
            this.canvas.title.h(this.stringRect(this.config.title).height)
        }
        if(con.xTitle.visiable){
            c.xTitle.x(c.node.w()/2)
            c.xTitle.y(c.node.h()-this.legend.getHeight("bottom"))
            c.xTitle.w(this.stringRect(c.xTitle).width)
            c.xTitle.h(this.stringRect(c.xTitle).height)
        }
            c.xAxis.w(0)
            c.xAxis.h(10)
            c.xAxis.y(c.node.h()-c.xTitle.h()-c.xAxis.h()-this.legend.getHeight("bottom"))
            c.chart.y(c.title.h())
            c.chart.h(c.node.h()-c.title.h()-c.xAxis.h()-c.xTitle.h()-this.legend.getHeight("bottom"))
////calculate x 
        if(con.yTitle.visiable){
            c.yTitle.x(0)
            c.yTitle.y(c.chart.h()/2+c.title.h())
            c.yTitle.h(this.stringRect(c.yTitle).height)
            c.yTitle.w(this.stringRect(c.yTitle).width)
        }
            c.yAxis.w(10)
            c.yAxis.h(0)
            c.yAxis.x(c.yTitle.w()+c.yAxis.w())
            c.yAxis.y(c.title.y())
            c.y2Title.w(this.stringRect(c.y2Title).width)
            c.y2Title.h(this.stringRect(c.y2Title).height)
            c.y2Axis.w(10)
            c.y2Axis.h(0)
            c.y2Title.x(c.node.w()-c.y2Title.w()-this.legend.getWidth("right"))
            c.y2Title.y(c.yTitle.h())
            c.y2Title.y()
            c.chart.x(c.yTitle.x())
            c.chart.w(c.node.w()-c.yTitle.w()-c.yAxis.w())
        console.log(c)
    }
    prepareCanvas(){

        this.canvas.wrapper.node(d3.select("#chart").append("div").classed(this.config.class,true).node())
        this.canvas.node.node(d3.select(this.canvas.wrapper.node()).append("svg").node());
        let node = d3.select(this.canvas.node.node())
        let c=this.canvas
        c.title.node(node.append("g").classed("title",true).append("text").node())

        c.xAxis.node(node.append("g").classed("xAxis",true).node())
        c.xTitle.node(node.append("g").classed("xTitle",true).append("text").node())

        c.yTitle.node(node.append("g").classed("yTitle",true).append("text").node())
        c.yAxis.node(node.append("g").classed("yAxis",true).node())

        c.y2Title.node(node.append("g").classed("y2Title",true).append("text").node())
        c.y2Axis.node(node.append("g").classed("y2Axis",true).node())
    }
    updateCanvasStyle(){
        let c=this.canvas;
        let con=this.config
        let translater=(x:number,y:number)=>{
            return "translate("+x+" "+y+")"
        }
        let updater=(l:Layout)=>{
            d3.select(l.node()).style("transform",translater(l.x(),l.y()))
        }
    }
    
    
}