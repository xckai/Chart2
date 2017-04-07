/// <amd-dependency path="lib/underscore">
declare var _: any;
import d3 = require('lib/d3')
 module Util{
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
export let d3Invoke = curry((method?,obj?)=>{
    return (d3Selection)=>{
        _.each(obj,(v,k)=>{
            d3Selection[method](k,v)
        })
        return d3Selection
    }
})

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
        return function f1(r1?,r2?,r3?) {
            var args = Array.prototype.slice.call(arguments, 0);
            if(args.length < arity) {
                var f2= function() {
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
                to:"red",
                noData:"gray"
            },
            appendId:null,
            toolTipTemplate:"<table class='tool-tip-table' ><tbody><tr><td>{{xLabel}}:</td><td>{{x}}</td></tr> <tr><td>{{yLabel}}:</td><td>{{y}}</td></tr> <tr><td>{{valueLabel}}:</td><td>{{value}}</td></tr></tbody><table>",
            label:{
                xLabel:"列",
                yLabel:"行",
                valueLabel:"值",
                noData:"无数据"
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
            to:string,
            noData:string
        }
        appendId:string
        toolTipTemplate:string
        label:{
            valueLabel:string,
            xLabel:string,
            yLabel:string
            noData:string
        }
    }
    _ctx:any={}
    _layout={
        chart_h:0,
        chart_w:0,
        title_h:0,
        xAxis_h:0,
        yAxis_w:0,
        infoBar_h:0
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
        if(this._config.xFormat&&!noFormat){
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
        if(this._config.yFormat&&!noFormat){
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
    stringRect:any=Util.CacheAble(Util.getStringRect,function(){
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
    getXAxisRect(cls?){
        let w=0,h=0
        this.getX().forEach(x=>{
            let rect=this.stringRect(x,cls)
            w= Math.max(rect.width,w)
            h=Math.max(rect.height,h)
        })
        return {width:w,height:h}
    }
    getYAxisRect(cls?){
        let w=0,h=0
        this.getY().forEach(x=>{
            let rect=this.stringRect(x,cls)
            w= Math.max(rect.width,w)
            h=Math.max(rect.height,h)
        })
        return {width:w,height:h}
    }
    beforeRender(){
        if(this.getX().length<1 || this.getY().length <1){
            return false
        }
        let l=this._layout
        l.infoBar_h=35
        l.yAxis_w=this.getYAxisRect("yAxis").width+2
        this._ctx["yAxisClass"]="yAxis"
        //title
        l.title_h=Util.getStringRect(this._config.title,"title").height+2
        //xAxis
        l.xAxis_h=this.getXAxisRect("xAxis").height+2
        this._ctx["xAxisClass"]="xAxis"
        l.chart_h=this._config.height-l.title_h-l.xAxis_h-l.infoBar_h
        l.chart_w=this._config.width-l.yAxis_w
        //reCal xAxis
        let xAsxi_w=this.getXAxisRect("xAxis").width
        let rectWidth=Math.min(this._layout.chart_h/this.getY().length,this._layout.chart_w/this.getX().length)
        this._ctx["rectWidth"]=rectWidth
        // if(xAsxi_w>rectWidth){
        //     this._ctx["xAxisClass"]="xAxis rotation"
        //     l.xAxis_h=this.getXAxisRect("xAxis rotation").height +5
        // }else{
        //     this._ctx["xAxisClass"]="xAxis"
        //     l.xAxis_h+=5
        // }

   
        // if(l.yAxis_w>40){
        //     this._ctx["yAxisClass"]="yAxis rotation"
        //     l.yAxis_w=Util.getStringRect(this.getY()[0],"yAxis rotation").width +5
        // }else{
        //     this._ctx["yAxisClass"]="yAxis"
        //     l.yAxis_w+=5
        // }
        
        l.chart_h=this._config.height-l.title_h-l.xAxis_h-l.infoBar_h
        l.chart_w=this._config.width-l.yAxis_w
        return true
    }
    showToolTip(d?,p?){
        _.templateSettings = {
            interpolate: /\{\{(.+?)\}\}/g
        };
        if(d){
            this._node.tooltip.style("visibility","")
            d.x=this._config.xFormat?this._config.xFormat(d[this._config.x]):d[this._config.x]
            d.y=this._config.yFormat?this._config.yFormat(d[this._config.y]):d[this._config.y]
            d.value=d[this._config.value]?d[this._config.value]:this._config.label.noData
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
            this._node.xAxis.selectAll("g").each(function(_d){
                let dd=chart._config.xFormat?chart._config.xFormat(d[chart._config.x]):d[chart._config.x]
                if(_d == dd){
                    d3.select(this).classed("dataHover",true)
                }else{
                    d3.select(this).classed("dataHover",false)
                }
            })
            this._node.yAxis.selectAll("g").each(function(_d){
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
        let attrs=Util.d3Invoke("attr"),styles=Util.d3Invoke("style")
        let rectWidth=this._ctx["rectWidth"]
        d3.select("#"+this._config.appendId).selectAll("*").remove()
        let svg= d3.select("#"+this._config.appendId).append("svg").classed("heatmap",true)
        this._node.tooltip= d3.select("#"+this._config.appendId).append("div").style("position", "absolute")
                                                .style("z-index", "10")
                                                .style("visibility", "hidden")
                                                .classed("heatmap",true)
        this._node.svg=svg
        svg.style("height",this._config.height).style("width",this._config.width)
        svg.append("g").classed("title",true).append("text").text(this._config.title)
                                                                .attr("x",this._config.width/2)
                                                                .attr("y",0)
                                                                .style("alignment-baseline","hanging")

        this._node.yAxis=svg.append("g")
        this._node.yAxis.selectAll("g").data(this.getY()).enter()
                                            .append("g").style("transform",(d,i)=>"translate(0px,"+((i+0.5)*rectWidth+this._layout.title_h+this._layout.xAxis_h)+"px)")
                                            
        let chart=this
        this._node.yAxis.selectAll("g").each(function(d){
            d3.select(this).append("rect").classed(chart._ctx["yAxisClass"],true)
                                            .call(attrs({
                                                x:0,y:-0.5*rectWidth,width:chart._layout.yAxis_w,height:rectWidth,fill:"none"
                                            }))
            d3.select(this).append("text").classed(chart._ctx["yAxisClass"],true)
                                            .text(d)
                                            .attr("x",0)
                                            .attr("y",0)
                                            .style("alignment-baseline","central")
        })                                 
                                            
                                                                                
        this._node.xAxis=svg.append("g")
        this._node.xAxis.selectAll("g").data(this.getX()).enter().append("g")
                                            .style("transform",(d,i)=>"translate("+(this._layout.yAxis_w+(i+0.5)*rectWidth)+"px,"+(this._layout.title_h)+"px)")
        
        this._node.xAxis.selectAll("g").each(function(d){
            d3.select(this).append("rect").classed(chart._ctx["xAxisClass"],true)
                                            .call(attrs({
                                                x:0,y:-0.5*rectWidth,height:rectWidth,width:chart._layout.xAxis_h,fill:"none"
                                            }))
            d3.select(this).append("text")
                                            .classed(chart._ctx["xAxisClass"],true)
                                            .text(d)
                                            .attr("x",0)
                                            .attr("y",0)
                                            .style("alignment-baseline","central")
        })

                                
        this._node.matrix=svg.append("g").style("transform","translate("+this._layout.yAxis_w+"px,"+(this._layout.title_h+this._layout.xAxis_h)+"px)").classed("matrix",true)
        this._node.matrix.selectAll("rect").data(this.validData(this._ds)).enter().append("rect").attr("x",d=>this.getXIndex(d)*rectWidth)
                                                                                        .attr("y",d=>this.getYIndex(d)*rectWidth)
                                                                                        .attr("width",rectWidth)
                                                                                        .attr("height",rectWidth)
                                                                                        .style("fill",(d)=>{
                                                                                            if(isNaN(d[this._config.value])){
                                                                                                return this._config.color.noData
                                                                                            }
                                                                                            return this.getColor(d[this._config.value])
                                                                                        }).on("mousemove",(d)=>{
                                                                                            this.showToolTip(d,event)
                                                                                            this.showGuildLine(d)
                                                                                        }).on("mouseout",(d)=>{
                                                                                            this.showToolTip()
                                                                                            this.showGuildLine()
                                                                                        })
        ////inforBar
        this._node.infoBar=svg.append("g").style("transform","translate("+this._layout.yAxis_w+"px,"+(this._layout.title_h+(this.getY().length)*rectWidth+this._layout.xAxis_h+10)+"px)").classed("inforBar",true)
        let def=this._node.infoBar.append("defs").append("linearGradient").attr("x1","0%").attr("y1","0%").attr("x2","100%").attr("y2",0).attr("id","linearColor")
        def.append("stop").attr("offset","0%").attr("stop-color",this._config.color.from)   
        def.append("stop").attr("offset","100%").attr("stop-color",this._config.color.to)
        let domain=this.getDomain()
        this._node.infoBar.append("rect").call(attrs({
            x:0,
            y:0,
            width:this._layout.chart_w/2,
            height:10,
            fill:"url(#linearColor)"
        }))
        this._node.infoBar.append("text").call(attrs({
            x:0,y:12
        })).text(Math.floor(domain[0])).call(styles({
            "alignment-baseline":"hanging",
             "text-anchor":"begin"
        }))
        this._node.infoBar.append("text").call(attrs({
            x:this._layout.chart_w/2,y:12
        })).text(Math.ceil(domain[1])).call(styles({
            "alignment-baseline":"hanging",
            "text-anchor":"end"
        }))
        
        this._node.infoBar.append("rect").call(attrs({
            x:this._layout.chart_w*0.6,
            y:0,
            width:10,
            height:10,
            fill:this._config.color.noData
        }))
         this._node.infoBar.append("text").call(attrs({
            x:this._layout.chart_w*0.6+5,y:12
        })).text(this._config.label.noData).call(styles({
            "alignment-baseline":"hanging",
            "text-anchor":"middle"
        }))
       // .attr().attr("x",0).attr("y",0).attr()
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