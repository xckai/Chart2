/// <amd-dependency path="lib/underscore">
declare var _: any;
import d3 = require('lib/d3')
declare var window :any
import { CompareChartMeasure} from "./Measure"
import { Evented} from './Evented'
import {Chart , IChartElement,IChartConfig}  from "./Chart"
import { Util,Layout, Style} from "./Utils"
export class CompareChartElement  extends Evented implements IChartElement{
    constructor(id:string,l:Layout,chart:CompareChart,data:any,visiable:boolean,render:any,ctx?){
        super()
         this.layout=l
         this.chart=chart
         this.visiable=visiable,
         this.render=render
         this.id=id
         this.data=data
         this.ctx=ctx
    }
    Parent:any
    visiable:boolean
    z_index:number=1
    id:string
    chart:CompareChart
    layout:Layout
    data:any
    render:any
    ctx:any

}
interface ICompareChartConfig{
        appendTo:"chart",
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
        xAxis:{
            visiable:true,
            class:"xAxis",
            format:()=>{}
        
        },
        yAxis:{
            visiable:true,
            class:"yAxis",
            format:()=>{}
        },
        y2Axis:{
            visiable:true,
            class:"y2Axis",
           format:()=>{}
        },
        legend:{
            visiable:true,
            class:"legend",
            position:"auto",
            _position:""
        },
        width: 300,
        height: 300
    
}
export class CompareChart extends Chart {
    constructor(cfg) {
        super(cfg);
        _.each(cfg, (v, k) => {
            this.config[k] = v;
        })
    }
    config = {
        appendTo:"chart",
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
        xAxis:{
            visiable:true,
            class:"xAxis",
            format:d3.timeFormat("%Y-%m-%d %I:%M")
        
        },
        yAxis:{
            visiable:true,
            class:"yAxis",
            format:d3.format(".18f")
        },
        y2Axis:{
            visiable:true,
            class:"y2Axis",
           format:function(d){
                return d
            }
              
        },
        legend:{
            visiable:true,
            class:"legend",
            position:"auto",
            _position:""
        },
        width: 300,
        height: 300
    }
    stringRectCache:any=Util.CacheAble(Util.getStringRect,function(){
        let s=""
        s+=arguments[0].length
        if(arguments[1]!=undefined){
            s+=arguments[1]
        }
        if(arguments[2]!=undefined){
            s+=arguments[2]
        }
        return s
    })
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
        let i = _.findIndex(this.measures, (m) => (nm.id == m.id)&&(nm.type== m.type))
        if (i != -1) {
            this.measures[i] = nm
        } else {
            this.measures.push(nm)
        }
        this.fire("measure-add", nm)
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
    getElements(){
        let r=[]
        let svg= this.getRenderer("svg")
        let html=this.getRenderer("html")
        //let legendLayout=this.config.legend._position==="right"?this.canvas.rightLegend:this.canvas.bottomLegend
        r.push(new CompareChartElement("legend",this.canvas.legend,this,this.getMeasures().filter(m=>m.type == "legend"),this.config.legend.visiable,e=>html.legendRender(e),this.ctx()))
        r.push(new CompareChartElement("title",this.canvas.title,this,this.config.title,this.config.title.visiable,(e)=>{html.titleRender(e)}))
        r.push(new CompareChartElement("xTitle",this.canvas.xTitle,this,this.config.xTitle,this.config.xTitle.visiable,(e)=>{html.titleRender(e)}))
        r.push(new CompareChartElement("yTitle",this.canvas.yTitle,this,this.config.yTitle,this.config.yTitle.visiable,(e)=>{html.titleRender(e)}))
        r.push(new CompareChartElement("y2Title",this.canvas.y2Title,this,this.config.y2Title,this.config.y2Title.visiable,(e)=>{html.titleRender(e)}))

        r.push(new CompareChartElement("xAxis",this.canvas.xAxis,this,{class:this.ctx("xAxisClass")?this.ctx("xAxisClass")+" "+this.config.xAxis.class:this.config.xAxis.class,
                                                                            format:this.config.xAxis.format},this.config.xAxis.visiable,(e)=>{svg.axisRender(e,this.getDomain(this.getMeasures(),"x"),"bottom")},this.ctx()))
        r.push(new CompareChartElement("yAxis",this.canvas.yAxis,this,{class:this.ctx("yAxisClass")?this.ctx("yAxisClass")+" "+this.config.yAxis.class:this.config.yAxis.class,
                                                                            format:this.config.yAxis.format},this.config.yAxis.visiable,(e)=>{svg.axisRender(e,this.getDomain(this.getMeasures(),"y",true),"left")},this.ctx()))
        r.push(new CompareChartElement("y2Axis",this.canvas.y2Axis,this,{class:this.ctx("y2AxisClass")?this.ctx("y2AxisClass")+" "+this.config.y2Axis.class:this.config.y2Axis.class,
                                                                            format:this.config.y2Axis.format},this.config.y2Axis.visiable,(e)=>{svg.axisRender(e,this.getDomain(this.getMeasures(),"y",true),"right")},this.ctx()))
        r.push(new CompareChartElement("chart",this.canvas.chart,this,this.getMeasures(),true,(e)=>{svg.chartRender(e)}))
        return r.concat(this.elements)
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
                mss=ms.map((m)=>m.pluckDatas(type)).reduce((d1,d2)=>d1.concat(d2))
                //mss = _.reduce(ms, (m1: CompareChartMeasure, m2: CompareChartMeasure) => m1.pluckDatas(type).concat(m1.pluckDatas(type)));
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
        let ccls = this.config.class + " " + con.class;
       return this.stringRectCache(con.value, ccls)
       // return this.stringRectCache(con.value, ccls);
    }
    getScale(domain: any[], range: any[]) {
        return d3.scaleLinear().domain(domain).range(range);
    }
    calculateLayout() {
        let c = this.canvas
        let con = this.config
            // if(this.config.height>this.config.width){
            //     con.
            // }
        let legendLayout={
            bottomHeight:0,
            bottomWidth:0,
            rightWidth:0,
            rightHeight:0
        }
        if(c.legend.position()==="right"){
            legendLayout.rightHeight=c.legend.h()
            legendLayout.rightWidth=c.legend.w()
        }
        if(c.legend.position()==="bottom"){
            legendLayout.bottomHeight=c.legend.h()
            legendLayout.bottomWidth=c.legend.w()
        }
        this.wrapper.x(0)
        this.wrapper.y(0)
        this.wrapper.w(this.config.width)
        this.wrapper.h(this.config.height)
        if (this.config.title.visiable) {
            c.title.x(0)
            c.title.y(0)
            this.canvas.title.w(this.wrapper.w())
            this.canvas.title.h(this.stringRect(this.config.title).height)
        }
        if (con.xTitle.visiable) {
            c.xTitle.w(this.stringRect(con.xTitle).width)
            c.xTitle.h(this.stringRect(con.xTitle).height)
            c.xTitle.x(0)
            c.xTitle.y(this.wrapper.h() - legendLayout.bottomHeight - c.xTitle.h())

        }

        c.xAxis.h(this.getXHeight())
        c.xAxis.y(this.wrapper.h() - c.xTitle.h() - c.xAxis.h() - legendLayout.bottomHeight)
        c.chart.y(c.title.h())
        c.chart.h(this.wrapper.h() - c.title.h() - c.xAxis.h() - c.xTitle.h() - legendLayout.bottomHeight)
            ////calculate x 
        if (con.yTitle.visiable) {
            c.yTitle.x(0)
            c.yTitle.y(0)
            c.yTitle.h(this.stringRect(con.yTitle).height)
            c.yTitle.w(this.stringRect(con.yTitle).width)
        }else{
            c.yTitle.x(0)
            c.yTitle.y(0)
            c.yTitle.h(0)
            c.yTitle.w(0)
        }
        c.yAxis.w(this.getYWidth())
        c.yAxis.h(c.chart.h())
        c.yAxis.x(c.yTitle.w() + c.yAxis.w())
        c.yAxis.y(c.title.h())
        c.y2Title.w(this.stringRect(con.y2Title).width)
        c.y2Title.h(this.stringRect(con.y2Title).height)
        if (con.y2Title.visiable) {
            c.y2Axis.w(this.getY2Width())
            c.y2Axis.h(c.chart.h())
            c.y2Axis.x(this.wrapper.w() - c.y2Axis.w() - c.y2Title.w())
            c.y2Axis.y(c.title.h())

        }else{
            c.y2Axis.w(0)
            c.y2Axis.h(0)
            c.y2Axis.x(this.wrapper.w() - c.y2Axis.w() - c.y2Title.w())
            c.y2Axis.y(c.title.h())
        }

        c.y2Title.x(this.wrapper.w() - c.y2Title.w() - legendLayout.rightWidth)
        c.y2Title.y(c.title.h())
        c.y2Title.y()
        c.chart.x(c.yAxis.w() + c.yTitle.w())
        c.chart.w(this.wrapper.w() - c.yTitle.w() - c.yAxis.w() - c.y2Axis.w() - c.y2Title.w()-legendLayout.rightWidth)
        c.xAxis.x(c.yTitle.w() + c.yAxis.w())
        c.xAxis.w(c.chart.w())

        c.xTitle.x(c.yTitle.w() + c.yAxis.w())
        c.y2Title.h(c.chart.h())
        c.yTitle.h(c.chart.h())
        c.xTitle.w(c.chart.w())
    }
    getChartLayout() {
        return this.canvas.chart
    }
    getYWidth(){
        let w=0,chart=this,ss=0
        var d=this.getMeasures().filter((e)=>e.ref!=="y2")
                                    .forEach((e)=>{
                                        e.pluckDatas("y").forEach((s)=>{
                                            let _w=this.stringRectCache(chart.config.yAxis.format(s),null,10).width
                                            w=w>_w?w:_w,ss=s
                                        })              
                                    })
        if(w>70){
          
            this.ctx("yAxisClass","rotation")
            w=this.stringRectCache(chart.config.yAxis.format(ss), chart.config.yAxis.class+" "+this.ctx("yAxisClass"),10).width
        
        }
        return w
    }
    getY2Width(){
         let w=0,chart=this,ss=0
        var d=this.getMeasures().filter((e)=>e.ref==="y2")
                                    .forEach((e)=>{
                                        e.pluckDatas("y").forEach((s)=>{
                                            let _w=this.stringRectCache(chart.config.y2Axis.format(s),null,10).width
                                            w=w>_w?w:_w,ss=s
                                        })              
                                    })
        if(w>70){
           // console.log("before", w)
           this.ctx("y2AxisClass","rotation")
            //chart.config.yAxis.class+=" rotation"
            w=this.stringRectCache(chart.config.yAxis.format(ss), chart.config.y2Axis.class+" "+ this.ctx("y2AxisClass"),10).width
            //console.log("after", w)
        }
        return w
    }
    getXHeight(){
        let w=0,h=0,chart=this,ss=0
        var d=this.getMeasures().forEach((e)=>{
                                        e.pluckDatas("x").forEach((s)=>{
                                            let _w=this.stringRectCache(chart.config.xAxis.format(s),null,10).width
                                            w=w>_w?w:_w,ss=s,h=this.stringRectCache(chart.config.xAxis.format(s),null,10).height
                                        })              
                                    })
        if(w>40){
            this.ctx("xAxisClass","rotation")
            // chart.config.xAxis.class+=" rotation"
            h=this.stringRectCache(chart.config.xAxis.format(ss), chart.config.xAxis.class+" "+ this.ctx("xAxisClass"),10).height
        }
        return h
    }
    checkData(){
        let ms= this.getMeasures()
        let y2=_.some(ms,(m:CompareChartMeasure)=>{
            return m.ref==="y2"
        })
        if(y2){
            this.config.y2Axis.visiable=false
            this.config.y2Title.visiable=false
        }
       
        this.barIndex={}
        if(this.config.legend.visiable){
            if(this.config.width>this.config.height*1.2){
                this.config.legend._position="right"
                this.canvas.legend.position("right")
                this.canvas.legend.w(this.config.width*0.2)
                this.canvas.legend.h(this.config.height-this.stringRectCache(this.config.title.value,this.config.title.class).height-this.stringRectCache(this.config.xTitle.value,this.config.xTitle.class).height)
                this.canvas.legend.x(this.config.width-this.canvas.legend.w())
                this.canvas.legend.y(this.stringRectCache(this.config.title.value,this.config.title.class).height)
            }else{
                 this.config.legend._position="bottom"
                 this.canvas.legend.position("bottom")
                this.canvas.legend.w(this.config.width)
                this.canvas.legend.h(Math.ceil(ms.filter(m=>m.type==="legend").length*100/this.config.width)*25)
                this.canvas.legend.x(0)
                this.canvas.legend.y(this.config.height-this.canvas.legend.h())
            }
        }
        if(ms.filter(e=>e.type=="legend").length===0){
            this.ctx("showlegend",false)
        }else{
             this.ctx("showlegend",true)
        }
    }
    maxBarsNum(){
        let bars=this.getMeasures().filter((b)=>{return b.type==="bar"})
        let n=1
        let bg=_.groupBy(bars.map((b)=>{return b.data()})
                    .reduce((b1:any[],b2:any [])=>{return b1.concat(b2)}),"x")
        _.each(bg,(v,k)=>{
            n=n>v.length?n:v.length
        })
        return n
    }
    barNum(v){
        let bars=this.getMeasures().filter((b)=>{return b.type==="bar"})
        let num=0
        _.each(bars.map((b)=>{return b.data()})
                    .reduce((b1:any[],b2:any [])=>{return b1.concat(b2)}),(d)=>{
                        if(d.x==v){
                            num++
                        }
                    })
        return num
       
    }
    barIndex:any={}
    getBarIndex(v){
         if(this.barIndex[v]){
             return this.barIndex[v]+=1
         }else{
            return    this.barIndex[v]=1
         }

    }
}
// let titleRender = (t?:string) => {
//     if(!t||t==="html"){
//         return (e:IChartElement)=>{
//             let div = d3.select(e.chart.wrapper.node()).append("div")
//             .style("position", "absolute")
//             .style("left", e.layout.x() + "px")
//             .style("top", e.layout.y() + "px")
//             .style("height", e.layout.h() + "px")
//             .style("width", e.layout.w() + "px")
//             .classed(e.data.class, true)
//         div.append("p").text(e.data.value)  
//         }
//     }
// }
// let axisRender =(t?:string)=>{
//     if(!t || t==="svg"){
//         return (e: CompareChartElement) => {
//         let d = d3.select(e.chart.wrapper.node()).append("svg")
//             .style("position", "absolute")
//             .style("left", e.layout.x() + "px")
//             .style("top", e.layout.y() + "px")
//             .style("height", e.layout.h() + "px")
//             .style("width", e.layout.w() + "px")
//         let axis = null;
//         if (e.data === "left") {
//             let scale = d3.scaleLinear().domain(e.chart.getDomain(e.chart.getMeasures(), "y", true)).range([0, e.layout.h()])
//             axis = d3.axisLeft(scale)
//             d.style("left", e.layout.x() - e.layout.w() + "px")
//             d.style("width", e.layout.w() + 2 + "px")
//             d.append("g").style("transform", "translate(" + (e.layout.w()) + "px,0px)").call(axis)
//                 //d.call(axis)
//         }
//         if (e.data === "right") {
//             let scale = d3.scaleLinear().domain(e.chart.getDomain(e.chart.getMeasures(), "y2", true)).range([0, e.layout.h()])
//             axis = d3.axisRight(scale)
//             d.call(axis)
//         }
//         if (e.data === "bottom") {
//             let scale = d3.scaleLinear().domain(e.chart.getDomain(e.chart.getMeasures(), "x")).range([0, e.layout.w()])
//             axis = d3.axisBottom(scale)
//             d.call(axis)
//         }
// }
//     }
// }



// let chartRender =(t?:string)=>{
    
//     if(!t || t==="svg"){
//         return (e:CompareChartElement)=>{
//             let xScale=e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(),"x"),[0,e.layout.w()])
//             let yScale=e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(),"y",true),[0,e.layout.h()])
//             let y2Scale=e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(),"y2",true),[0,e.layout.h()])
//             let c = d3.select(e.chart.wrapper.node()).append("svg")
//                 .style("position", "absolute")
//                 .style("left", e.layout.x() + "px")
//                 .style("top", e.layout.y() + "px")
//                 .style("height", e.layout.h() + "px")
//                 .style("width", e.layout.w() + "px")
//             e.layout.node(c.node());
//             let d = [].concat(e.data)
//             d.forEach((v: CompareChartMeasure, k) => {
//                 switch(v.type){
//                     case "line":
//                         lineRender(xScale,yScale,e.layout.node(),v.data(),v.style);
//                         break;
//                     case "circle":
//                         circleRender(xScale,yScale,e.layout.node(),v.data(),v.style);
//                 }
//             })
//         }
//     }
//     if(t==="canvas"){
//         return (e:CompareChartElement)=>{
//             let xScale=e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(),"x"),[0,e.layout.w()])
//             let yScale=e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(),"y",true),[0,e.layout.h()])
//             let y2Scale=e.chart.getScale(e.chart.getDomain(e.chart.getMeasures(),"y2",true),[0,e.layout.h()])
//             let c = d3.select(e.chart.wrapper.node()).append("canvas")
//                 .style("position", "absolute")
//                 .style("left", e.layout.x() + "px")
//                 .style("top", e.layout.y() + "px")
//                 .style("height", e.layout.h() + "px")
//                 .style("width", e.layout.w() + "px")
//                 .attr("height",e.layout.h())
//                 .attr("width",e.layout.w())
//             e.layout.node(this.wrapper());
//             let d=[].concat(e.data)
//             d.forEach((v:CompareChartMeasure,k)=>{
//                  switch(v.type){
//                     case "line":
//                         lineRenderCanvas(xScale,yScale,e.layout.node(),v.data(),v.style);
//                         break;
//                     case "circle":
//                         circleRender(xScale,yScale,e.layout.node(),v.data(),v.style);

//                 }
//             })
//         }
//     }
// }

// let pathGen=(xScale,yScale,ds,closed?)=>{
//         if (ds.length < 1) return "M0,0";
//         var lineString = "";
//         var isStartPoint = true;
//         for (var i = 0; i < ds.length; ++i) {
//             if (isStartPoint) {
//                 if (isNaN(ds[i].y)) {
//                     isStartPoint = true;
//                     continue;
//                 } else {
//                     lineString += "M" + xScale(ds[i].x) + "," + yScale(ds[i].y);
//                     isStartPoint = false;
//                 }
//             } else {
//                 if (isNaN(ds[i].y)) {
//                     isStartPoint = true;
//                     continue;
//                 } else {
//                     lineString += "L" + xScale(ds[i].x) + "," + yScale(ds[i].y);
//                 }
//             }

//         }
//         if (closed){
//             lineString+="Z"
//         }
//         return lineString;
// }
// let lineRender=(xScale,yScale,node,ds,style:Style,ctx?)=>{
//     d3.select(node).append("path").attr("d",pathGen(xScale,yScale,ds,false))
//                                         .style("stroke",style.color)
//                                         .style("stroke-width",style.lineWidth)
//                                         .style("fill","none");
// }
// let lineRenderCanvas=(xScale,yScale,canvas,ds,style:Style,ctx?)=>{
//         if (canvas.getContext){
//         var ctx = canvas.getContext('2d')
//         ctx.strokeStyle =style.color
//         ctx.lineWidth = style.lineWidth
//         ctx.fillStyle =style.fillColor
//         let p= new window.Path2D(pathGen(xScale,yScale,ds,false))
//         ctx.stroke(p)
//         ctx.save();
        
// }
// }
// let circleRender=(xScale,yScale,node,ds,style:Style,ctx?)=>{
//      _.each([].concat(ds),(d)=>{
//         d3.select(node).append("ellipse").attr("cx",xScale(d.x))
//                                         .attr("cy",yScale(d.y))
//                                         .attr("rx",style.rx)
//                                         .attr("ry",style.ry)
//                                         .style("fill",style.fillColor);     
//      })
// }
// let barRender=(xScale,yScale,node,ds,style:Style,ctx?)=>{
//     _.each()
// }