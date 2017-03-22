/// <amd-dependency path="lib/underscore">
declare var _:any;
declare var window:any;
import { IChartElement } from "./Chart"
import { CompareChartElement } from "./CompareChart"
import { CompareChartMeasure } from "./Measure"
export module Util{
export function isEndWith(s:any,ed:string){
    let ss= s.toString();
    let matcher= new RegExp(ed+"$")
    return matcher.test(ss);
  }
export function isBeginWith(s:any,bs:string){
    let ss= s.toString();
    let matcher= new RegExp("^"+bs)
    return matcher.test(ss);
  }
export function isContaint(s,ss){
    let matcher= new RegExp(ss)
    return matcher.test(s.toString());
  }

export function max (nums:number []){
       let n=Number.MIN_VALUE;
       nums.forEach((num)=>{
            n=isNaN(num)?n: n>num? n:num;
       })
       n= n==Number.MIN_VALUE?0:n;
       return n;
    }
export function min (ns:number []){
       let n=Number.MAX_VALUE;
       ns.forEach((num)=>{
            n=isNaN(num)?n: n<num? n:num;
       })
       n= n == Number.MAX_VALUE?0:n;
       return n;
    }
// var stringCache={cla:null,font_size:0,length:0,r:{width:0,height:0}} 
export function getStringRect(str:string, cla ?:string,font_size?:number){
        let d= window.document.createElement("div");
        let p = window.document.createElement("span");
        let r ={width:0,height:0};
         d.style.transform="translate3d(0, 0, 0)";
        d.style.visibility="hidden";
        d.className="getStringRect"
        p.innerHTML= str;
        if(cla){
            p.className=cla;
        }
        if(font_size){
            p.style["font-size"]=font_size+"px"
        }
        if(!str){
            return r;
        }
        p.style.display="inline-block";
        d.appendChild(p);
        window.document.body.appendChild(d);
        let rec=p.getBoundingClientRect()
        r.width=rec.width;
        r.height=rec.height;
        d.remove();
        return r;
    }
export function CacheAble(fn:any,keyFn?){
    let _key=function(){
        return  arguments2Array(arguments).join("-")
    }
    let cache={}
    _key=keyFn?keyFn:_key
    return function(){
        let args=arguments2Array(arguments)
       
        if(cache[_key.apply(null,args)]){
            return cache[_key.apply(null,args)]
        }else{
             console.log("not cached",args)

             return cache[_key.apply(null,args)]=fn.apply(null,args)  
        }
    }
}
function arguments2Array(args){
    let r=[]
    for(let i=0;i<args.length;++i){
        r.push(args[i])
    }
    return r
}
export function enableAutoResize(dom:any,fn){
       function getComputedStyle(element, prop) {
            if (element.currentStyle) {
                return element.currentStyle[prop];
            }
            if (window.getComputedStyle) {
                return window.getComputedStyle(element, null).getPropertyValue(prop);
            }

            return element.style[prop];
        }
        if (getComputedStyle(dom, 'position') == 'static') {
                dom.style.position = 'relative';
        }
        for(let i=0;i<dom.childNodes.length;++i){
            if(dom.childNodes[i].className =="autoResier"){
                dom.removeChild(dom.childNodes[i])
            }
        }
        let oldWidth=dom.offsetWidth,oldHeight=dom.offsetHeight,refId=0
        let d1= window.document.createElement("div")
        let d2=window.document.createElement("div")
        let d3=window.document.createElement("div")
        d1.className="autoResier"
        d1.style=" position: absolute; left: 0; top: 0; right: 0; overflow:hidden; visibility: hidden; bottom: 0; z-index: -1"
        d2.style="position: absolute; left: 0; top: 0; right: 0; overflow:scroll; bottom: 0; z-index: -1"
        d3.style="position: absolute; left: 0; top: 0; transition: 0s ;height: 100000px;width:100000px"
        d2.appendChild(d3)
        d1.appendChild(d2)
        dom.appendChild(d1)
        d2.scrollLeft=100000
        d2.scrollTop=100000
        d2.onscroll=(e)=>{
            d2.scrollLeft=100000;
            d2.scrollTop=100000;
            if((dom.offsetHeight!= oldHeight || dom.offsetWidth!=oldWidth) &&refId===0){
                refId= requestAnimationFrame(onresize) 
            }
        }
        function onresize(){
           refId=0
           if(fn){
               fn({oldHeight:oldHeight,oldWidth:oldWidth,height:dom.offsetHeight,width:dom.offsetWidth})
           }
            oldWidth=dom.offsetWidth,oldHeight=dom.offsetHeight
        }
    }
}
export class Style{
    constructor(color ?,stroke ?,fillColor ?,opacity ?){
        this.color=color||this.color
        this.stroke =stroke||this.stroke;
        this.fillColor =fillColor||this.fillColor
        this.opacity =opacity||this.opacity
    }
    private _font:any=14
    color:string ="black"
    stroke:number =1
    fillColor:string ="black"
    opacity:number =1
    lineWidth:number=1
    rx:number=2
    ry:number=2
    set font(f:any){
        if(!isNaN(f)){
            this._font=f;
        }
        if(Util.isEndWith(f,"px")){
            this._font=parseFloat(f);
        }
        if(Util.isEndWith(f,"em")||Util.isEndWith(f,"rem")){
            let font=window.getComputedStyle(document.body).getPropertyValue('font-size')||16
            this._font=parseFloat(f) * parseFloat(font)
        }
    }
    get font(){
        return this._font
    }
    fontFamily:string="arial,sans-serif"
}
export class Layout{
    constructor(render?){
        if(render){
            this.render=render;
        }
    }
   render:string="html"
   private _w:number=0
   private _h:number=0
   private _x:number=0
   private _y:number=0
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
import d3= require('lib/d3')
export interface IChartElementRender{
    titleRender(e:IChartElement)
    axisRender(e:IChartElement,domain:any,position:string)
    chartRender(e:CompareChartElement)
    legendRender(e:CompareChartElement)
}
export let pathGen=(xScale,yScale,ds,closed?)=>{
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

export class HTMLRender implements IChartElementRender{
      titleRender(e:IChartElement){
        
        let div =e.layout.node()?d3.select(e.layout.node()) :d3.select(e.chart.wrapper.node()).append("div")
            
            div.style("position", "absolute")
            .style("left", e.layout.x() + "px")
            .style("top", e.layout.y() + "px")
            .style("height", e.layout.h() + "px")
            .style("width", e.layout.w() + "px")
        e.layout.node(div.node())
        div.node().innerHTML=""
        div.append("p").classed(e.data.class, true).text(e.data.value)  
    }
     axisRender(e:IChartElement,domain,position:string){
      
    }
    chartRender(e:CompareChartElement){

    }
    legendRender(e:CompareChartElement){
        let div =e.layout.node()?d3.select(e.layout.node()) :d3.select(e.chart.wrapper.node()).append("div")
            div.style("position", "absolute")
            .style("left", e.layout.x() + "px")
            .style("top", e.layout.y() + "px")
            .style("height", e.layout.h() + "px")
            .style("width", e.layout.w() + "px")
            .classed("legend",true)
        e.layout.node(div.node())
        div.node().innerHTML=""
        div.append("ul").selectAll("li").data(e.data).enter().append("li").append("p").text("hah")
    }
}
export class CanvasRender implements IChartElementRender{
      titleRender(e:IChartElement){
        let div = d3.select(e.chart.wrapper.node()).append("div")
            .style("position", "absolute")
            .style("left", e.layout.x() + "px")
            .style("top", e.layout.y() + "px")
            .style("height", e.layout.h() + "px")
            .style("width", e.layout.w() + "px")
        div.append("p").classed(e.data.class, true).text(e.data.value)  
    }
     axisRender(e:IChartElement,domain,position:string){
        let d = d3.select(e.chart.wrapper.node()).append("div")
            .style("position", "absolute")
            .style("left", e.layout.x() + "px")
            .style("top", e.layout.y() + "px")
            .style("height", e.layout.h() + "px")
            .style("width", e.layout.w() + "px")
    }
     chartRender(e:CompareChartElement){
        
    }
    legendRender(e:CompareChartElement){
        
    }
}
