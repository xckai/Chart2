/// <amd-dependency path="lib/underscore">
declare var _:any;
declare var window:any;
import { IChartElement } from "./Chart"
import d3= require('lib/d3')
import { CompareChartMeasure } from "./Measure"
import {Evented} from "./Evented"
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
export function curry(f) {
        var arity = f.length;
        return function f1() {
            var args = Array.prototype.slice.call(arguments, 0);
            if(args.length < arity) {
                var f2 = function() {
                    var args2 = Array.prototype.slice.call(arguments, 0); // parameters of returned curry func
                    return f1.apply(null, args.concat(args2)); // compose the parameters for origin func f
                }
                return f2;
            } else {
                return f.apply(null, args); //all parameters are provided call the origin function
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
export class Style extends Evented{
    constructor(stroke ?,fillColor ?,opacity ?,width?,dashArray?){
        super()
        this.setStroke(stroke||"black")
        this.setFillColor(fillColor||"black")
        this.setOpacity(opacity||1)
        this.setLineWidth(width||2)
        this.setDashArray(dashArray||"")
        // this._stroke =stroke||this._stroke;
        // this._fillColor =fillColor||this._fillColor
        // this._opacity =opacity||this._opacity
        // this._lineWidth=width||this._lineWidth
        // this._dashArray=dashArray||this._dashArray
    }
    _get(key?,ns?){
         if(ns){
           return _.findWhere(this._d,{name:ns})[key]
        }
        let v="";
        this._d.forEach(d=>{
            v=d[key]||v
        })
        return v
    }
    _set(k,v,namespace?){
        let name=namespace||"default"
        if(_.some(this._d,{name:name})){
            let obj=_.findWhere(this._d,{name:name})
            obj[k]=v
        }else{
            let obj={name:name}
            obj[k]=v
            this._d.push(obj)
        }
        this.fire("change")
        return this
    }
    _d:any[]=[]
    // _temp={}
    // ctx(s){return s}
    // private _font:any=14
    // _stroke:string ="black"
    // _fillColor:string ="black"
    // _opacity:number =1
    // _lineWidth:number=1
    // _rx:number=2
    // _ry:number=2
    // _visiable=true
    // _dashArray=""
    // set font(f:any){
    //     if(!isNaN(f)){
    //         this._font=f;
    //     }
    //     if(Util.isEndWith(f,"px")){
    //         this._font=parseFloat(f);
    //     }
    //     if(Util.isEndWith(f,"em")||Util.isEndWith(f,"rem")){
    //         let font=window.getComputedStyle(document.body).getPropertyValue('font-size')||16
    //         this._font=parseFloat(f) * parseFloat(font)
    //     }
    //     this.fire("change")
    // }
    // get font(){
    //     return this._font
    // }
    equal(s:Style){
        return this._get("stroke","default")==s._get("stroke","default") && this._get("line-width","default")==s._get("line-width","default") &&this._get("opacity","default")==s._get("opacity","default")
    }
    _fontFamily:string="arial,sans-serif"
    _class:string
    getStroke(){
        return this._get("stroke")
    }
    getFillColor(){
        return this._get("fill-color")
    }
    getLineWidth(){
        return this._get("line-width")
    }
    getRx(){
        return this._get("rx")
    }
    getClass(){
        return this._get("class")
    }
    getRy(){
        return this._get("ry")
    }
    getOpacity(){
        return this._get("opacity")
    }
    getVisiable(){
        return this._get("visiable")
    }
    getDashArray(){
          return this._get("dash-array")
    }
    setFillColor(c,ns?){
        return this._set("fill-color",c,ns)
    }
    setDashArray(d,ns?){
        return this._set("dash-array",d,ns)
    }
    setClass(d,ns?){
         return this._set("class",d,ns)
    }
    setVisiable(d,ns?){
        return this._set("visiable",d,ns)
    }
    setLineWidth(d,ns?){
        return this._set("line-width",d,ns)
    }
    setColor(d,ns?){
        return this._set("color",d,ns)
    }
    setStroke(d,ns?){
         return this._set("stroke",d,ns)
    }
    setOpacity(d,ns?){
        return this._set("opacity",d,ns)
    }
    // setDefaultFillColor(f){
    //     this._fillColor=f
    //     this.fire("change")
    //     return this
    // }
    // setDefaultClass(c){
    //     this._class=c
    //     return this
    // }
    // setDefaultVisiable(v){
    //     this._visiable=v
    //     this.fire("change")
    //     return this
    // }
    // setDefaultDashArray(a){
    //     this._dashArray=a
    //     this.fire("change")
    // }
    // setDefaultLineWidth(d){
    //     this._lineWidth=d
    //     this.fire("change")
    // }
    // setDefaultStroke(s){
    //     this._stroke=s
    //     this.fire("change")
    // }
    // setDefaultOpacity(o){
    //     this._opacity=o
    //     this.fire("change")
    // }
    reset(ns){
        let nd=[]
        _.each(this._d,(d)=>{
            if(d["name"]!=ns){
                nd.push(d)
            }
        })
        this._d=nd
        this.fire("change")
        return this
    }
    clone(s:Style){
        this._d=JSON.parse(JSON.stringify(s._d))
        this.fire("change")
    }
}
export class Layout extends Evented{
    constructor(render?){
        super()
        if(render){
            this.render=render;
        }
    }
   render:string="html"
   private _w:number=0
   private _h:number=0
   private _x:number=0
   private _y:number=0
   private _p:string
   private _node:any
    set(k,v){
        let key= "_"+k
        if(this[key]===v){
          return this  
        }
        //console.log(this[key],v,this,new Error().stack)
        this[key]=v
        this.fire("change",{key,v})
        return this
    } 
    setW(w){
        return this.set("w",w)
    }
    getW(){
        return this._w
    }
    setH(h){
        return this.set("h",h)
    }
    getH(){
        return this._h
    }
    setNode(n){
        this._node=n
        return this
    }
    getNode(){
        return this._node
    }
    setPosition(p){
        return this.set("p",p)
    }
    getPosition(){
        return this._p
    }
    setX(x){
        return this.set("x",x)
    }
    getX(){
        return this._x
    }
    setY(y){
        return this.set("y",y)
    }
    getY(){
        return this._y
    }
    
}
export let pathGen=(xScale,yScale,ds,closed?)=>{
        if (ds.length < 2) return "M0,0";
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

// export class HTMLRender implements IChartElementRender{
//       titleRender(e:IChartElement){
        
//         let div =e.layout.node()?d3.select(e.layout.node()) :d3.select(e.chart.wrapper.node()).append("div")
            
//             div.style("position", "absolute")
//             .style("left", e.layout.x() + "px")
//             .style("top", e.layout.y() + "px")
//             .style("height", e.layout.h() + "px")
//             .style("width", e.layout.w() + "px")
//         e.layout.node(div.node())
//         div.node().innerHTML=""
//         div.append("p").classed(e.data.class, true).text(e.data.value)  
//     }
//      axisRender(e:IChartElement,domain,position:string){
      
//     }
//     chartRender(e:CompareChartElement){

//     }
//     legendRender(e:CompareChartElement){
//         let div =e.layout.node()?d3.select(e.layout.node()) :d3.select(e.chart.wrapper.node()).append("div")
//             div.style("position", "absolute")
//             .style("left", e.layout.x() + "px")
//             .style("top", e.layout.y() + "px")
//             .style("height", e.layout.h() + "px")
//             .style("width", e.layout.w() + "px")
//             .classed("legend",true)
//         e.layout.node(div.node())
//         div.node().innerHTML=""
//         div.append("ul").selectAll("li").data(e.data).enter().append("li").append("p").text("hah")
//     }
// }
// export class CanvasRender implements IChartElementRender{
//       titleRender(e:IChartElement){
//         let div = d3.select(e.chart.wrapper.node()).append("div")
//             .style("position", "absolute")
//             .style("left", e.layout.x() + "px")
//             .style("top", e.layout.y() + "px")
//             .style("height", e.layout.h() + "px")
//             .style("width", e.layout.w() + "px")
//         div.append("p").classed(e.data.class, true).text(e.data.value)  
//     }
//      axisRender(e:IChartElement,domain,position:string){
//         let d = d3.select(e.chart.wrapper.node()).append("div")
//             .style("position", "absolute")
//             .style("left", e.layout.x() + "px")
//             .style("top", e.layout.y() + "px")
//             .style("height", e.layout.h() + "px")
//             .style("width", e.layout.w() + "px")
//     }
//      chartRender(e:CompareChartElement){
        
//     }
//     legendRender(e:CompareChartElement){
        
//     }
// }
