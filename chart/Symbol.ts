import {Measure} from "./Measure"
import {Style}from "./Utils"
export class Symbol {
    constructor(x?,y?,w?,h?) {
        this.x=x
        this.y=y
        this.w=w
        this.h=h
        //this.style.on("change",this.render)
    }
    x:number
    y:number
    measure: Measure
    canvas:any
    type:any
    node:any
    data:any={}
    w:number
    h:number
    z_index:number
    style:Style
    _render:()=>{}
    isInsharp(mx,my){
        return Math.abs(mx-this.x)<this.w && Math.abs(my-this.y)<this.h
    }
    setStyle=(s:Style)=>{
        this.style=new Style()
        s.clone(s)
        this.style.on("change",this.render,this)
        return this
    }
    setRender(fn){
        this._render=fn
        return this
    }
    render(isRedraw?){
        if(isRedraw){
            this.node=null
        }
        if(this._render){
            this._render()
        }}
}
export class Circle extends Symbol{
    constructor(cx,cy,rx,ry){
        super(cx,cy,rx,ry)
        this.rx=rx
        this.ry=ry
        this.type="circle"
    }
    rx:number
    ry:number
    render(){}
}
export class Line extends Symbol{
    constructor(d){
        super()
        this.type="line"
        this.d=d
        this.z_index=10
    }
    d:string
    isInsharp(mx,my){
        return false
    }
}
export class Bar extends Symbol{
    constructor(x,y,w,h){
        super(x,y,w,h)
        this.type="bar"
        this.z_index=5
    }
    isInsharp(mx,my){
         return mx-this.x<=this.w && mx-this.x>=0 && my-this.y<=this.h && my-this.y >=0
    }
}