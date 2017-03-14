/// <amd-dependency path="lib/underscore">
declare var _:any;
declare var window:any;
import d3= require('lib/d3')
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
    export function getStringRect(str:string, cla ?:string){
        let d= window.document.createElement("div");
        let p = window.document.createElement("span");
        let r ={width:0,height:0};
         d.style.transform="translate3d(0, 0, 0)";
        d.style.visibility="hidden";
        p.innerHTML= str;
        if(cla){
            p.className=cla;
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
        console.log(r);
        return r;
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
