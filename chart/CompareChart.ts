/// <amd-dependency path="lib/underscore">
/// <amd-dependency path="lib/d3">
declare var _: any;
//declare var d3:any;
import d3 = require('lib/d3')
    //import * as d3 from "d3"
import {
    CompareChartMeasure
} from "./Measure"
import {
    Evented
} from './Evented'
import {
    Util,
    Layout,
    Style
} from "./Utils"
let a = document.createElement
interface IChartElement {
    id:string
    chart:CompareChart
    layout:Layout
    render:any
    data:any
    visiable:boolean
    z_index:number
    getNode():any
}
class CompareChartElement  extends Evented implements IChartElement{
    constructor(id:string,l:Layout,chart:CompareChart,data:any,visiable:boolean,render:any){
        super()
         this.layout=l
         this.chart=chart
         this.visiable=visiable,
         this.render=render
         this.id=id
         this.data=data
    }
    getNode(){
        if(this.chart){
            return this.chart.wrapper
        }
    }
    visiable:boolean
    z_index:number=1
    id:string
    chart:CompareChart
    layout:Layout
    data:any
    render:any

}
class ChartElement extends Evented {
    constructor(type: string, l: Layout, d: any, chart: CompareChart) {
        super()
        this.type = type
        this.layout = l
        this.data = d
        this.chart = chart
    }
    chart: CompareChart
    type: string
    layout: Layout
    data: any
}

export class CompareChart extends Evented {
    constructor(cfg) {
        super();
        _.each(cfg, (v, k) => {
            this.config[k] = v;
        })
    }
    config = {
        class: "CompareChart",
        title: {
            value: "",
            class: "title",
            visiable: true
        },
        xTitle: {
            value: "",
            class: "xTitle",
            visiable: true
        },
        yTitle: {
            value: "",
            class: "yTitle",
            visiable: true
        },
        y2Title: {
            value: "",
            class: "y2Title",
            visiable: true
        },
        chart:{
            value:"",
            class:"chart",
            visiable:true
        },
        width: 300,
        height: 300
    }
    defaultElements={       
        
    }
    getDefaultElements(){
        let r=[];
        r.push(new CompareChartElement("legend",this.canvas.legend,this,this.getMeasures(),true,null))
        r.push(new CompareChartElement("title",this.canvas.title,this,this.config.title,this.config.title.visiable,titleRender()))
        r.push(new CompareChartElement("xTitle",this.canvas.xTitle,this,this.config.xTitle,this.config.xTitle.visiable,titleRender()))
        r.push(new CompareChartElement("yTitle",this.canvas.yTitle,this,this.config.yTitle,this.config.yTitle.visiable,titleRender()))
        r.push(new CompareChartElement("y2Title",this.canvas.y2Title,this,this.config.y2Title,this.config.y2Title.visiable,titleRender()))
        r.push(new CompareChartElement("xAxis",this.canvas.xAxis,this,"bottom",true,axisRender()))
        r.push(new CompareChartElement("yAxis",this.canvas.yAxis,this,"left",true,axisRender()))
        r.push(new CompareChartElement("y2Axis",this.canvas.y2Axis,this,"right",true,axisRender()))
        r.push(new CompareChartElement("chart",this.canvas.chart,this,this.getMeasures(),true,chartRender()))
        return r;
    }
    wrapper = new Layout()
    canvas = {
        node: new Layout(),
        legend:  new Layout() ,
        title:  new Layout() ,
        xTitle: new Layout() ,
        yTitle:  new Layout() ,
        y2Title:  new Layout() ,
        xAxis:  new Layout() ,
        yAxis:  new Layout() ,
        y2Axis:  new Layout() ,
        chart:  new Layout() 
    }
    addMeasure(nm: CompareChartMeasure) {
        let i = _.findIndex(this.measures, (m) => nm.id == m.id);
        if (i != -1) {
            this.measures[i] = nm;
        } else {
            this.measures.push(nm);
        }
        this.fire("measure-add", nm);
        return this;
    }
    legend = {
        getHeight: (o) => {
            return 0;
        },
        getWidth: (o) => {
            return 0
        }
    }
    getMeasures(): CompareChartMeasure[] {
        return this.measures;
    }
    measures: CompareChartMeasure[]=[];
    getDomain(ms: CompareChartMeasure[], type: string, revert ? : boolean) {
        let r = [];
        if (ms.length==0) {
            r = [0, 1]
        } else {
            let mss;
            if(ms.length==1){
                mss=ms[0].pluckDatas(type)
            }else{
                mss = _.reduce(ms, (m1: CompareChartMeasure, m2: CompareChartMeasure) => m1.pluckDatas(type).concat(m1.pluckDatas(type)));
            }
            r[0] = Util.min(mss);
            r[1] = Util.max(mss);
        }

        if (revert) {
            let t = r[0]
            r[0] = r[1]
            r[1] = t
        }
        return r;
    }
    stringRect(con) {

        let ccls = this.config.class + " " + con.cls;
        return Util.getStringRect(con.value, ccls);
    }
    getScale(domain: any[], range: any[]) {
        return d3.scaleLinear().domain(domain).range(range);
    }
    beforeDraw() {

    }
    calculateLayout() {
        let c = this.canvas
        let con = this.config
            // if(this.config.height>this.config.width){
            //     con.
            // }
        c.node.x(0)
        c.node.y(0)
        c.node.w(this.config.width)
        c.node.h(this.config.height)
        if (this.config.title.visiable) {
            c.title.x(0)
            c.title.y(0)
            this.canvas.title.w(c.node.w())
            this.canvas.title.h(this.stringRect(this.config.title).height)
        }
        if (con.xTitle.visiable) {
            c.xTitle.w(this.stringRect(c.xTitle).width)
            c.xTitle.h(this.stringRect(c.xTitle).height)
            c.xTitle.x(0)
            c.xTitle.y(c.node.h() - this.legend.getHeight("bottom") - c.xTitle.h())

        }

        c.xAxis.h(30)
        c.xAxis.y(c.node.h() - c.xTitle.h() - c.xAxis.h() - this.legend.getHeight("bottom"))
        c.chart.y(c.title.h())
        c.chart.h(c.node.h() - c.title.h() - c.xAxis.h() - c.xTitle.h() - this.legend.getHeight("bottom"))
            ////calculate x 
        if (con.yTitle.visiable) {
            c.yTitle.x(0)
            c.yTitle.y(0)
            c.yTitle.h(this.stringRect(c.yTitle).height)
            c.yTitle.w(this.stringRect(c.yTitle).width)
        }
        c.yAxis.w(30)
        c.yAxis.h(c.chart.h())
        c.yAxis.x(c.yTitle.w() + c.yAxis.w())
        c.yAxis.y(c.title.h())
        c.y2Title.w(this.stringRect(c.y2Title).width)
        c.y2Title.h(this.stringRect(c.y2Title).height)
        if (con.y2Title.visiable) {
            c.y2Axis.w(30)
            c.y2Axis.h(c.chart.h())
            c.y2Axis.x(c.node.w() - c.y2Axis.w() - c.y2Title.w())
            c.y2Axis.y(c.title.h())

        }

        c.y2Title.x(c.node.w() - c.y2Title.w() - this.legend.getWidth("right"))
        c.y2Title.y(c.title.h())
        c.y2Title.y()
        c.chart.x(c.yAxis.w() + c.yTitle.w())
        c.chart.w(c.node.w() - c.yTitle.w() - c.yAxis.w() - c.y2Axis.w() - c.y2Title.w())
        c.xAxis.x(c.yTitle.w() + c.yAxis.w())
        c.xAxis.w(c.chart.w())

        c.xTitle.x(c.yTitle.w() + c.yAxis.w())
        c.y2Title.h(c.chart.h())
        c.yTitle.h(c.chart.h())
        c.xTitle.w(c.chart.w())


    }
    prepareCanvas() {

        this.wrapper.node(d3.select("#chart").append("div").classed(this.config.class, true).node())
        d3.select(this.wrapper.node()).style("position", "absolute");

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
    toElements(canvas: Object, measures: CompareChartMeasure[]) {
        let r = [],
            chart = this
        r.push(new ChartElement("chart", this.canvas.chart, this.measures, this))

        r.push(new ChartElement("title", this.canvas.title, this.config.title, this))
        r.push(new ChartElement("title", this.canvas.xTitle, this.config.xTitle, this))
        r.push(new ChartElement("title", this.canvas.yTitle, this.config.yTitle, this))
        r.push(new ChartElement("title", this.canvas.y2Title, this.config.y2Title, this))

        r.push(new ChartElement("axis", this.canvas.xAxis, "bottom", this))
        r.push(new ChartElement("axis", this.canvas.yAxis, "left", this))
        r.push(new ChartElement("axis", this.canvas.y2Axis, "right", this))
        return r
    }
    getChartLayout() {
        return this.canvas.chart
    }
    render() {
        this.prepareCanvas()
        this.calculateLayout()
        this.getDefaultElements().forEach((e:CompareChartElement)=>{
            e.render?e.render(e):null
        })
    }
    renderer(e: ChartElement) {
        if (e.type !== "node") {
            switch (e.layout.render) {
                case "svg":
                    d3.select(e.chart.wrapper.node()).append("svg")
                        .style("position", "absolute")
                        .style("left", e.layout.x() + "px")
                        .style("top", e.layout.y() + "px")
                        .style("height", e.layout.h() + "px")
                        .style("width", e.layout.w() + "px")
                        .attr("type", e.type)
                    break
                case "html":
                    d3.select(e.chart.wrapper.node()).append("div")
                        .style("position", "absolute")
                        .style("left", e.layout.x() + "px")
                        .style("top", e.layout.y() + "px")
                        .style("height", e.layout.h() + "px")
                        .style("width", e.layout.w() + "px")
                        .attr("type", e.type)
                    break

            }
        }
    }
    updateCanvasLayout() {
        let c = this.canvas;
        let con = this.config
    }
}
let titleRender = (t?:string) => {
    if(!t||t==="html"){
        return (e:IChartElement)=>{
            let div = d3.select(e.chart.wrapper.node()).append("div")
            .style("position", "absolute")
            .style("left", e.layout.x() + "px")
            .style("top", e.layout.y() + "px")
            .style("height", e.layout.h() + "px")
            .style("width", e.layout.w() + "px")
            .classed(e.data.class, true)
        div.append("p").text(e.data.value)  
        }
    }
}
let axisRender =(t?:string)=>{
    if(!t || t==="svg"){
        return (e: IChartElement) => {
  
        let d = d3.select(e.chart.wrapper.node()).append("svg")
            .style("position", "absolute")
            .style("left", e.layout.x() + "px")
            .style("top", e.layout.y() + "px")
            .style("height", e.layout.h() + "px")
            .style("width", e.layout.w() + "px")
        let axis = null;
        if (e.data === "left") {
            let scale = d3.scaleLinear().domain(e.chart.getDomain(e.chart.getMeasures(), "y", true)).range([0, e.layout.h()])
            axis = d3.axisLeft(scale)
            d.style("left", e.layout.x() - e.layout.w() + "px")
            d.style("width", e.layout.w() + 2 + "px")
            d.append("g").style("transform", "translate(" + (e.layout.w()) + "px,0px)").call(axis)
                //d.call(axis)
        }
        if (e.data === "right") {
            let scale = d3.scaleLinear().domain(e.chart.getDomain(e.chart.getMeasures(), "y2", true)).range([0, e.layout.h()])
            axis = d3.axisRight(scale)
            d.call(axis)
        }
        if (e.data === "bottom") {
            let scale = d3.scaleLinear().domain(e.chart.getDomain(e.chart.getMeasures(), "x")).range([0, e.layout.w()])
            axis = d3.axisBottom(scale)
            d.call(axis)
        }
    
}
    }
}



let chartRender =(t?:string)=>{
    
    if(!t || t==="svg"){
        return (e:IChartElement)=>{
            let xScale=e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(),"x"),[0,e.layout.w()])
            let yScale=e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(),"y",true),[0,e.layout.h()])
            let y2Scale=e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(),"y2",true),[0,e.layout.h()])
             let c = d3.select(e.chart.wrapper.node()).append("svg")
                .style("position", "absolute")
                .style("left", e.layout.x() + "px")
                .style("top", e.layout.y() + "px")
                .style("height", e.layout.h() + "px")
                .style("width", e.layout.w() + "px")
            e.layout.node(c.node());
            let d = [].concat(e.data)
            d.forEach((v: CompareChartMeasure, k) => {
                switch(v.type){
                    case "line":
                        lineRender(xScale,yScale,e.layout.node(),v.data(),v.style);
                        break;
                    case "circle":
                        circleRender(xScale,yScale,e.layout.node(),v.data(),v.style);

                }
            })
        }
    }
}

let pathGen=(xScale,yScale,ds,closed?)=>{
        if (ds.length < 1) return "M0,0";
        var lineString = "";
        var isStartPoint = true;
        for (var i = 0; i < ds.length; ++i) {
            if (isStartPoint) {
                if (isNaN(ds[i].y)) {
                    isStartPoint = true;
                    continue;
                } else {
                    lineString += "M" + xScale(ds[i].x) + "," + yScale(ds[i].y);
                    isStartPoint = false;
                }
            } else {
                if (isNaN(ds[i].y)) {
                    isStartPoint = true;
                    continue;
                } else {
                    lineString += "L" + xScale(ds[i].x) + "," + yScale(ds[i].y);
                }
            }

        }
        if (closed){
            lineString+="Z"
        }
        return lineString;
}
let lineRender=(xScale,yScale,node,ds,style:Style,ctx?)=>{
    d3.select(node).append("path").attr("d",pathGen(xScale,yScale,ds,false))
                                        .style("stroke",style.color)
                                        .style("stroke-width",style.lineWidth)
                                        .style("fill","none");
}
let circleRender=(xScale,yScale,node,ds,style:Style,ctx?)=>{
     _.each([].concat(ds),(d)=>{
        d3.select(node).append("ellipse").attr("cx",xScale(d.x))
                                        .attr("cy",yScale(d.y))
                                        .attr("rx",style.rx)
                                        .attr("ry",style.ry)
                                        .style("fill",style.fillColor);     
     })
}
let barRender=(xScale,yScale,node,ds,style:Style,ctx?)=>{
    _.each()
}