/// <amd-dependency path="lib/underscore">
declare var _: any;
import d3 = require('lib/d3')
declare var window :any
import { Measure} from "./Measure"
import { Evented} from './Evented'
import { Util,Layout, Style,HTMLRender,CanvasRender,IChartElementRender} from "./Utils"
import {SVGRender} from "./SvgRender"
export interface IChartElement {
    id:string
    chart:Chart
    layout:Layout
    render:any
    data:any
    visiable:boolean
    z_index:number
    Parent():any
    ctx:any
}
export interface IChartConfig{
    class:string
    appendTo:string
    height:number
    width:number
}
export abstract class Chart extends Evented {
    constructor(cfg) {
        super();
        _.each(cfg, (v, k) => {
            this.config[k] = v
        })
    }
    config :IChartConfig = {
        class:"chart",
        appendTo:"chart",
        height:300,
        width:300
    }
    _ctx:any={}
    ctx(k?,v?){
        if(k!=undefined){
            if(v!=undefined){
                this._ctx[k]=v
            }else{
                return this._ctx[k]
            }
        }else{
            return this._ctx
        }
    }
    measures: Measure[]=[]
    elements=[]
    getElements(){
        let r=[]
        return r.concat(this.elements)
    }
    addElement(e:IChartElement){
        this.elements.push(e)
    }
    wrapper = new Layout()
    addMeasure(nm: Measure) {
        let i = _.findIndex(this.measures, (m) => nm.id == m.id);
        if (i != -1) {
            this.measures[i] = nm
        } else {
            this.measures.push(nm)
        }
        this.fire("measure-add", nm)
        return this
    }
    getMeasures(): Measure[] {
        return this.measures
    }
    beforeDraw() {
        this.config.height=document.getElementById(this.config.appendTo).clientHeight
        this.config.width = document.getElementById(this.config.appendTo).clientWidth
    }
    calculateLayout() {
    }
    prepareCanvas() {
        if(d3.select("#"+this.config.appendTo).empty()){
            return false
        }else{
            if(this.wrapper.node()){

                d3.select(this.wrapper.node())
                            .classed(this.config.class, true)
                                            .style("position", "absolute")
            }else{
                    this.wrapper.node(d3.select("#"+this.config.appendTo).append("div")
                                            .classed(this.config.class, true)
                                            .style("position", "absolute")
                                            .node())
            }
            return true
        }
    }
    checkData(){

    }
    endDraw(){
        let chart=this
        Util.enableAutoResize(document.getElementById(this.config.appendTo),()=>{
            this.beforeDraw()
            this.checkData()
            this.calculateLayout()
            this._draw()
        })
    }
    _draw(ctx?){
        this.calculateLayout()
            this.getElements().filter((e:IChartElement)=>{
                return e.visiable
            }).sort((e1:IChartElement,e2:IChartElement)=>{
                return e1.z_index-e2.z_index
            }).forEach((e)=>{
                e.render(e,ctx)
            })
    }
    render(ctx?) {
        if(this.prepareCanvas()){
            this.beforeDraw()
            this.checkData()
            this.calculateLayout()
            this._draw()
            this.endDraw()
        }
    }
    getRenderer(s:string):IChartElementRender{
        if(s==="html"){
            return new HTMLRender()
        }
        if(s==="canvas"){
            return new CanvasRender()
        }
        else{
            return new SVGRender()
        }
    }
}