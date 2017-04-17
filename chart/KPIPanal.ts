
declare var _: any;
declare var ChartManager:any
import d3 = require('lib/d3')
export class KPIPanal{
    constructor(){

    }
    _config:{
        right:0,top:0,left:0,bottom:0,label0:string,label1:string,label2:string ,tpiFormat:any
    }
    appendTo(s){
       if(this._node){
           d3.select(s).node().appendChild(this._node)
       }
       return this
    }
    _chart=ChartManager.createCompareChart({
            "width": 400,
            "height": 230,
            title: "",
            xType: "TimeSeries",
            showLegend: false
        })
    _data:{}={}
    _node:Element
    setConfig(c){
        this._config=c
        return this
    }
    render(){
        let contariner,t1,t2,t3,chart
        if(!this._node){
            contariner=d3.select(document.createDocumentFragment()).append("xhtml:div").classed("kpipanal",true)
            let div=contariner.append("xhtml:div").classed("texts",true)
            t1=div.append("xhtml:div").classed("t1 text",true)
                t1.append("xhtml:text").text(this._config.label0||"KPI-1")
                t1.append("xhtml:text").classed("value",true)
            t2=div.append('xhtml:div').classed("t2 text",true)
                t2.append("xhtml:text").text(this._config.label1||"KPI-2")
                t2.append("xhtml:text").classed("value",true)
            t3=div.append('xhtml:div').classed("t3 text",true)
                t3.append("xhtml:text").text(this._config.label2||"KPI-3")
                t3.append("xhtml:text").classed("value",true)
            this._data["chartId"]=_.uniqueId("chart")
            this._chart.appendTo(this._data["chartId"])
            contariner.append("xhtml:div").classed("chart",true).attr("id",this._data["chartId"])
            this._node=contariner.node()
        }else{
            contariner = d3.select(this._node)
        }
        return this
    }
    update(d){
        let contariner,t1,t2,t3,chart
        contariner=d3.select(this._node)
        contariner.style("position","absolute")
        if(this._config.left!=undefined){
            contariner.style("left",this._config.left+"px")
        }
        if(this._config.right!=undefined){
            contariner.style("right",this._config.right+"px")
        }
        if(this._config.top!=undefined){
            contariner.style("top",this._config.top+"px")
        }
        if(this._config.bottom!=undefined){
            contariner.style("bottom",this._config.bottom+"px")
        }
        
        let format=this._config.tpiFormat?this._config.tpiFormat:(n)=>{
            return (+n).toFixed(2)
        } 
        t1=contariner.select(".t1").select(".value")
        t1.transition().duration(1000).tween("text",()=>{
            let num=d3.interpolateNumber(+t1.text(),d.t1 || 0)
            return (t)=>{t1.text(format(num(t)))}
        })
        
        t2=contariner.select(".t2").select(".value")
        t2.transition().duration(1000).tween("text",()=>{
            let num=d3.interpolateNumber(+t2.text(),d.t2 || 0)
            return (t)=>{t2.text(format(num(t)))}
        })
        t3=contariner.select(".t3").select(".value")
        t3.transition().duration(1000).tween("text",()=>{
            let num=d3.interpolateNumber(+t3.text(),d.t3 || 0)
            return (t)=>{t3.text(format(num(t)))}
        })
        chart=contariner.select(".chart")
        
    }
}