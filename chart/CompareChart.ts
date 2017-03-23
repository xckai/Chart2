/// <amd-dependency path="lib/underscore">
declare var _: any;
import d3 = require('lib/d3')
declare var window :any
import { CompareChartMeasure} from "./Measure"
import { Evented} from './Evented'
import {Chart , IChartElement,IChartConfig}  from "./Chart"
import { Util,Layout, Style} from "./Utils"
import{ChartElement ,AxisElement,TitleElement,LegendElement} from "./ChartElement"
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
        this.xAxisElement=new AxisElement(this).setLayout(this.canvas.xAxis)
                                                   .setStyle(this.styles.xAxis)
                                                   .setDomainFn(()=>{
                                                        return this.getDomain(this.getMeasures(),"x")
                                                    })
                                                    .setConfig({format:this.config.xAxis.format})
        this.yAxisElement=new AxisElement(this).setLayout(this.canvas.yAxis)
                                                    .setStyle(this.styles.yAxis)
                                                    .setDomainFn(()=>{
                                                        return this.getDomain(this.getMeasures(),"y",true)
                                                    })
                                                    .setConfig({format:this.config.yAxis.format})
        this.y2AxisElement=new AxisElement(this).setLayout(this.canvas.y2Axis)
                                                    .setStyle(this.styles.y2Axis)
                                                    .setDomainFn(()=>{
                                                        return this.getDomain(this.getMeasures(),"y2",true)
                                                    })
                                                    .setConfig({format:this.config.y2Axis.format})
        this.titletElement = new TitleElement(this).setLayout(this.canvas.title)
                                                        .setStyle(this.styles.title)
                                                        .setConfig({
                                                            value:this.config.title.value
                                                        })
        this.xTitleElement = new TitleElement(this).setLayout(this.canvas.xTitle)
                                                        .setStyle(this.styles.xTitle)
                                                        .setConfig({
                                                            value:this.config.xTitle.value
                                                        })
        this.yTitleElement = new TitleElement(this).setLayout(this.canvas.yTitle)
                                                        .setStyle(this.styles.yTitle)
                                                        .setConfig({
                                                            value:this.config.yTitle.value
                                                        })
        this.y2TitleElement = new TitleElement(this).setLayout(this.canvas.y2Title)
                                                        .setStyle(this.styles.y2Title)
                                                        .setConfig({
                                                            value:this.config.y2Title.value
                                                        })
        this.legendElement = new LegendElement(this).setLayout(this.canvas.legend)
                                                        .setStyle(this.styles.legend)
                                                        .setLegendDataFn(()=>this.getMeasures().filter(m=>m.type==="legend"))
    }
    titletElement:ChartElement
    xTitleElement:ChartElement
    yTitleElement:ChartElement
    y2TitleElement:ChartElement
    xAxisElement:ChartElement
    yAxisElement:ChartElement
    y2AxisElement:ChartElement
    legendElement:ChartElement
    //CanvasElement:ChartElement
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
        xAxis:  new Layout().setPosition("bottom") ,
        yAxis:  new Layout().setPosition("left"),
        y2Axis:  new Layout().setPosition("right"),
        chart:  new Layout() 
    }
    styles={
        xAxis:  new Style().setClass(this.config.xAxis.class),
        yAxis:  new Style().setClass(this.config.yAxis.class),
        y2Axis: new Style().setClass(this.config.y2Axis.class),
        title:new Style().setClass(this.config.title.class),
        xTitle:new Style().setClass(this.config.xTitle.class),
        yTitle:new Style().setClass(this.config.yTitle.class),
        y2Title:new Style().setClass(this.config.y2Title.class),
        legend:new Style().setClass(this.config.legend.class)
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
        if(c.legend.getPosition()==="right"){
            legendLayout.rightHeight=c.legend.getH()
            legendLayout.rightWidth=c.legend.getW()
        }
        if(c.legend.getPosition()==="bottom"){
            legendLayout.bottomHeight=c.legend.getH()
            legendLayout.bottomWidth=c.legend.getW()
        }
        this.wrapper.setX(0)
        this.wrapper.setY(0)
        this.wrapper.setW(this.config.width)
        this.wrapper.setH(this.config.height)
        if (this.config.title.visiable) {
            c.title.setX(0)
            c.title.setY(0)
            this.canvas.title.setW(this.wrapper.getW())
            this.canvas.title.setH(this.stringRect(this.config.title).height)
        }
        if (con.xTitle.visiable) {
           // c.xTitle.setW(this.stringRect(con.xTitle).width)
            c.xTitle.setH(this.stringRect(con.xTitle).height)
            //c.xTitle.setX(0)
            c.xTitle.setY(this.wrapper.getH() - legendLayout.bottomHeight - c.xTitle.getH())

        }

        c.xAxis.setH(this.getXHeight())
        c.xAxis.setY(this.wrapper.getH() - c.xTitle.getH() - c.xAxis.getH() - legendLayout.bottomHeight)
        c.chart.setY(c.title.getH())
        c.chart.setH(this.wrapper.getH() - c.title.getH() - c.xAxis.getH() - c.xTitle.getH() - legendLayout.bottomHeight)
            ////calculate setX 
        if (con.yTitle.visiable) {
            c.yTitle.setX(0)
            c.yTitle.setY(0)
           // c.yTitle.setH(this.stringRect(con.yTitle).height)
            c.yTitle.setW(this.stringRect(con.yTitle).width)
        }else{
            c.yTitle.setX(0)
            c.yTitle.setY(0)
           // c.yTitle.setH(0)
            c.yTitle.setW(0)
        }
        c.yAxis.setW(this.getYWidth())
        c.yAxis.setH(c.chart.getH())
        c.yAxis.setX(c.yTitle.getW() + c.yAxis.getW())
        c.yAxis.setY(c.title.getH())
        c.y2Title.setW(this.stringRect(con.y2Title).width)
        //c.y2Title.setH(this.stringRect(con.y2Title).height)
        if (con.y2Title.visiable) {
            c.y2Axis.setW(this.getY2Width())
            c.y2Axis.setH(c.chart.getH())
            c.y2Axis.setX(this.wrapper.getW() - c.y2Axis.getW() - c.y2Title.getW())
            c.y2Axis.setY(c.title.getH())

        }else{
            c.y2Axis.setW(0)
            c.y2Axis.setH(0)
            c.y2Axis.setX(this.wrapper.getW() - c.y2Axis.getW() - c.y2Title.getW())
            c.y2Axis.setY(c.title.getH())
        }

        c.y2Title.setX(this.wrapper.getW() - c.y2Title.getW() - legendLayout.rightWidth)
        c.y2Title.setY(c.title.getH())
        c.chart.setX(c.yAxis.getW() + c.yTitle.getW())
        c.chart.setW(this.wrapper.getW() - c.yTitle.getW() - c.yAxis.getW() - c.y2Axis.getW() - c.y2Title.getW()-legendLayout.rightWidth)
        c.xAxis.setX(c.yTitle.getW() + c.yAxis.getW())
        c.xAxis.setW(c.chart.getW())

        c.xTitle.setX(c.yTitle.getW() + c.yAxis.getW())
        c.y2Title.setH(c.chart.getH())

        c.yTitle.setH(c.chart.getH())
        c.xTitle.setW(c.chart.getW())
    }
    getChartLayout() {
        return this.canvas.chart
    }
    getYWidth(){
        let w=0,chart=this,ss=0
        var d=this.getMeasures().filter((e)=>e.ref!=="y2")
                                    .forEach((e)=>{
                                        e.pluckDatas("y").forEach((s)=>{
                                            let _w=this.stringRectCache(this.yAxisElement.config.format(s),null,10).width
                                            w=w>_w?w:_w,ss=s
                                        })              
                                    })
        if(w>70){
           this.yAxisElement.style.setClass(chart.config.yAxis.class+" rotation") 
            //this.ctx("yAxisClass","rotation")
            w=this.stringRectCache(this.yAxisElement.config.format(ss), chart.config.yAxis.class+" rotation",10).width
        
        }
        return w
    }
    getY2Width(){
         let w=0,chart=this,ss=0
        var d=this.getMeasures().filter((e)=>e.ref==="y2")
                                    .forEach((e)=>{
                                        e.pluckDatas("y").forEach((s)=>{
                                            let _w=this.stringRectCache(this.y2AxisElement.config.format(s),null,10).width
                                            w=w>_w?w:_w,ss=s
                                        })              
                                    })
        if(w>70){
           // console.log("before", w)
           this.y2AxisElement.style.setClass(chart.config.y2Axis.class+" rotation") 
            //chart.config.yAxis.class+=" rotation"
            w=this.stringRectCache(this.y2AxisElement.config.format(ss), chart.config.y2Axis.class+" rotation",10).width
            //console.log("after", w)
        }
        return w
    }
    getXHeight(){
        let w=0,h=0,chart=this,ss=0
        var d=this.getMeasures().forEach((e)=>{
                                        e.pluckDatas("x").forEach((s)=>{
                                            let _w=this.stringRectCache(this.xAxisElement.config.format(s),null,10).width
                                            w=w>_w?w:_w,ss=s,h=this.stringRectCache(chart.config.xAxis.format(s),null,10).height
                                        })              
                                    })
        if(w>40){
            //this.ctx("xAxisClass","rotation")
            // chart.config.xAxis.class+=" rotation"
            this.xAxisElement.style.setClass(chart.config.xAxis.class+" rotation") 
            h=this.stringRectCache(this.xAxisElement.config.format(ss), chart.config.xAxis.class+" rotation",10).height
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
                this.canvas.legend.setPosition("right")
                this.canvas.legend.setW(this.config.width*0.2)
                this.canvas.legend.setH(this.config.height-this.stringRectCache(this.config.title.value,this.config.title.class).height-this.stringRectCache(this.config.xTitle.value,this.config.xTitle.class).height)
                this.canvas.legend.setX(this.config.width-this.canvas.legend.getW())
                this.canvas.legend.setY(this.stringRectCache(this.config.title.value,this.config.title.class).height)
            }else{
                 this.config.legend._position="bottom"
                 this.canvas.legend.setPosition("bottom")
                this.canvas.legend.setW(this.config.width)
                this.canvas.legend.setH(Math.ceil(ms.filter(m=>m.type==="legend").length*100/this.config.width)*25)
                this.canvas.legend.setX(0)
                this.canvas.legend.setY(this.config.height-this.canvas.legend.getH())
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
        let bg=_.groupBy(bars.map((b)=>{return b.getData()})
                    .reduce((b1:any[],b2:any [])=>{return b1.concat(b2)}),"x")
        _.each(bg,(v,k)=>{
            n=n>v.length?n:v.length
        })
        return n
    }
    barNum(v){
        let bars=this.getMeasures().filter((b)=>{return b.type==="bar"})
        let num=0
        _.each(bars.map((b)=>{return b.getData()})
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
