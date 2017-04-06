/// <amd-dependency path="lib/underscore">
declare var _: any;
import{Util} from "./Utils"
import d3 = require('lib/d3')
export class Heatmap{
    constructor(){
        this._config={
            width:600,
            height:800,
            x:"x",
            y:"y",
            value:"value",
            xSort:null,
            ySort:null,
            xFormat:null,
            yFormat:null,
            title:"ahha",
            color:{
                from:"blue",
                to:"red"
            },
            appendId:null,
            toolTipTemplate:"<table class='tool-tip-table' ><tbody><tr><td>{{xLabel}}:</td><td>{{x}}</td></tr> <tr><td>{{yLabel}}:</td><td>{{y}}</td></tr> <tr><td>{{valueLabel}}:</td><td>{{value}}</td></tr></tbody><table>",
            label:{
                xLabel:"列",
                yLabel:"行",
                valueLabel:"值"
            }
        }
        this._node={}
    }
    setConfig(c){
        _.each(c,(v,k)=>{
            this._config[k]=v
        })
        return this
    }
   
    _node:any
    _ds:any[]
    _config:{
        width:number
        height:number
        x:string
        y:string
        value:string
        xSort:any
        ySort:any
        xFormat:any
        yFormat:any
        title:string
        color:{
            from:string,
            to:string
        }
        appendId:string
        toolTipTemplate:string
        label:{
            valueLabel:string,
            xLabel:string,
            yLabel:string
        }
    }
    _ctx:any={}
    _layout={
        chart_h:0,
        chart_w:0,
        title_h:0,
        xAxis_h:0,
        yAxis_w:0
    }
    colors:any
    setData(ds){
        this._ds=ds
        return this
    }
    getColor(v){
        this.colors=this.colors?this.colors:d3.scaleLinear()
                .domain(this.getDomain())
                .range([this._config.color.from, this._config.color.to])
        return this.colors(v)
    }
    getX(noFormat?){
        let tx= _.pluck(this._ds,this._config.x)
        let n=[]
        _.each(tx,x=>{
            _.contains(n,x)?null:n.push(x)
        })
        if(this._config.xSort){
            n=n.sort(this._config.xSort)
        }
        if(this._config.xFormat&&noFormat){
            n=n.map(v=>this._config.xFormat(v))
        }
        return n
    }
    getY(noFormat?){
        let t= _.pluck(this._ds,this._config.y)
        let n=[]
        _.each(t,v=>{
            _.contains(n,v)?null:n.push(v)
        })
        if(this._config.ySort){
            n=n.sort(this._config.ySort)
        }
        if(this._config.yFormat&&noFormat){
            n=n.map(v=>this._config.yFormat(v))
        }
        return n
    }
    getXIndex(d){
        let xs=this.getX()
        let v=this._config.xFormat?this._config.xFormat(d[this._config.x]):d[this._config.x]
         return _.findIndex(xs,x=>x==v)
    }
    getYIndex(d){
        let ys=this.getY()
        let v=this._config.yFormat?this._config.yFormat(d[this._config.y]):d[this._config.y]
        //let xi=_.findIndex(xs,this._config.xFormat?this._config.xFormat(d[this._config.x]):d[this._config.x])
        return _.findIndex(ys,y=>y==v)
      }
    getDomain(){
        let d=_.pluck(this._ds,this._config.value)
        let max=_.max(d)
        let min=_.min(d)
        max=isNaN(max)?1:max
        min=isNaN(min)?0:min
        return [min,max]
    }
    beforeRender(){
        if(this.getX().length<1 || this.getY().length <1){
            return false
        }
        let l=this._layout
        l.yAxis_w=Util.getStringRect(this.getY()[0],"yAxis").width
        this._ctx["yAxisClass"]="yAxis"
        //title
        l.title_h=Util.getStringRect(this._config.title,"title").height+2
        //xAxis
        l.xAxis_h=Util.getStringRect(this.getX()[0],"xAxis").height
        l.chart_h=this._config.height-l.title_h-l.xAxis_h
        l.chart_w=this._config.width-l.yAxis_w
        //reCal xAxis
        let xAsxi_w=Util.getStringRect(this.getX()[0],"xAxis").width
        let rectWidth=Math.min(this._layout.chart_h/this.getY().length,this._layout.chart_w/this.getX().length)
        this._ctx["rectWidth"]=rectWidth
        if(xAsxi_w>rectWidth){
            this._ctx["xAxisClass"]="xAxis rotation"
            l.xAxis_h= Util.getStringRect(this.getX()[0],"xAxis rotation").height +5
        }else{
            this._ctx["xAxisClass"]="xAxis"
            l.xAxis_h+=5
        }

   
        // if(l.yAxis_w>40){
        //     this._ctx["yAxisClass"]="yAxis rotation"
        //     l.yAxis_w=Util.getStringRect(this.getY()[0],"yAxis rotation").width +5
        // }else{
        //     this._ctx["yAxisClass"]="yAxis"
        //     l.yAxis_w+=5
        // }
        
        l.chart_h=this._config.height-l.title_h-l.xAxis_h
        l.chart_w=this._config.width-l.yAxis_w
        return true
    }
    showToolTip(d?,p?){
        _.templateSettings = {
            interpolate: /\{\{(.+?)\}\}/g
        };
        if(d){
            this._node.tooltip.style("visibility","")
            d.x=d[this._config.x]
            d.y=d[this._config.y]
            d.value=d[this._config.value]
            this._node.tooltip.selectAll("*").remove()
            this._node.tooltip.node().insertAdjacentHTML("afterbegin",_.template(this._config.toolTipTemplate)(_.extend(d,this._config.label)))
            let x=p.clientX,y=p.clientY
            var width =this._node.tooltip.node().offsetWidth;
                var height =this._node.tooltip.node().offsetHeight;
               var  screenWidth =document.body.clientWidth || 800;
                if(x-width/2 < 0){
                    this._node.tooltip.style("left",  10+ "px");
                }else if(x+width/2 >screenWidth){
                    this._node.tooltip.style("left", (screenWidth-width -10) + "px");
                }
                else
                {
                    this._node.tooltip.style("left", x-width/2 + "px");
                }
                if(y - height-5 <0){
                    this._node.tooltip.style("top", y +20+ "px");
                }else{
                    this._node.tooltip.style("top", y - height -10+ "px");
                }
        }else{
             this._node.tooltip.style("visibility","hidden")
             this._node.tooltip.selectAll("*").remove()
        }
            
        //setPosition(p.clientX,p.clientY)
    }
    showGuildLine(od?){

           let  d=od||{}
            let chart=this
            this._node.xAxis.selectAll("text").each(function(_d){
                let dd=chart._config.xFormat?chart._config.xFormat(d[chart._config.x]):d[chart._config.x]
                if(_d == dd){
                    d3.select(this).classed("dataHover",true)
                }else{
                    d3.select(this).classed("dataHover",false)
                }
            })
            this._node.yAxis.selectAll("text").each(function(_d){
                let dd=chart._config.yFormat?chart._config.xFormat(d[chart._config.y]):d[chart._config.y]
                if(_d == dd){
                    d3.select(this).classed("dataHover",true)
                }else{
                    d3.select(this).classed("dataHover",false)
                }
            })
        
    }
    render(){
        if ( !this.beforeRender()){
            console.log("no data")
            return
        }
        let rectWidth=this._ctx["rectWidth"]
        d3.select("#"+this._config.appendId).selectAll("*").remove()
        let svg= d3.select("#"+this._config.appendId).append("svg")
        this._node.tooltip= d3.select("#"+this._config.appendId).append("div").style("position", "absolute")
                                                .style("z-index", "10")
                                                .style("visibility", "hidden")
        this._node.svg=svg
        svg.style("height",this._config.height).style("width",this._config.width)
        svg.append("g").classed("title",true).append("text").text(this._config.title)
                                                                .attr("x",this._config.width/2)
                                                                .attr("y",0)
                                                                .style("alignment-baseline","hanging")

        this._node.yAxis=svg.append("g")
        this._node.yAxis.selectAll("text").data(this.getY()).enter()
                                            .append("g").style("transform",(d,i)=>"translate("+(this._layout.yAxis_w)+"px,"+((i+0.5)*rectWidth+this._layout.title_h)+"px)")
                                            .append("text").classed(this._ctx["yAxisClass"],true)
                                            .text(d=>d)
                                            .attr("x",0)
                                            .attr("y",0)
                                            .style("alignment-baseline","central")
                                                                                
        this._node.xAxis=svg.append("g")
        this._node.xAxis.selectAll("text").data(this.getX()).enter().append("g")
                                            .style("transform",(d,i)=>"translate("+(this._layout.yAxis_w+(i+0.5)*rectWidth)+"px,"+((this.getY().length+1)*rectWidth)+"px)").append("text")
                                            .classed(this._ctx["xAxisClass"],true)
                                            .text(d=>d)
                                            .attr("x",0)
                                            .attr("y",0)
                                            .style("alignment-baseline","central")
        this._node.matrix=svg.append("g").style("transform","translate("+this._layout.yAxis_w+"px,"+this._layout.title_h+"px)").classed("matrix",true)
        this._node.matrix.selectAll("rect").data(this.validData(this._ds)).enter().append("rect").attr("x",d=>this.getXIndex(d)*rectWidth)
                                                                                        .attr("y",d=>this.getYIndex(d)*rectWidth)
                                                                                        .attr("width",rectWidth)
                                                                                        .attr("height",rectWidth)
                                                                                        .style("fill",(d)=>{
                                                                                            if(isNaN(d[this._config.value])){
                                                                                                return "gray"
                                                                                            }
                                                                                            return this.getColor(d[this._config.value])
                                                                                        }).on("mousemove",(d)=>{
                                                                                            this.showToolTip(d,event)
                                                                                            this.showGuildLine(d)
                                                                                        }).on("mouseout",(d)=>{
                                                                                            this.showToolTip()
                                                                                            this.showGuildLine()
                                                                                        })
                            
    }
    validData(ds:any[]){
        let xs=this.getX(true),ys=this.getY(true)
        let newDs=[]
        let chart=this
        _.each(xs,x=>{
            _.each(ys,y=>{
                if(!_.some(ds,d=>d[this._config.x]==x &&d[this._config.y]==y)){
                    let _t={}
                    _t[this._config.x]=x
                    _t[this._config.y]=y
                    _t[this._config.value]=undefined
                    newDs.push(_t)
                }
            })
        })
        if(newDs.length>1){
            return ds.concat(newDs)
        }
        return ds
    }
    

}