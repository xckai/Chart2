import {Style,pathGen}from "./Utils"
import d3 = require('lib/d3')
import {CompareChartMeasure} from "./Measure"
import {Line} from "./Symbol"
import {lineRender} from "./SvgRender"
export class CompareChartLine extends CompareChartMeasure{
    type="line"
    constructor(id?,name?,ref?,ds?){
        super(id,name,"line",ref,ds);
    }
    color(d,ds?,ctx?):string{
        if(d.y>115){
            return "red"
        }
        return "black"
    }
    dashArray(d,ds,ctx?){
        if(d.y>113)
            {return "1,3"}
        else{
            return ""
        }
    }
    width(p1,p2,ctx?){
        if(p1.y>112){
            return 4
        }
        return 2
    }
    getStyle(d,ds,ctx?){
        let color=typeof(this.color) ==="function"? this.color(d,ds,ctx):this.color
        let dasharray=typeof(this.dashArray) ==="function"? this.dashArray(d,ds,ctx):this.dashArray
        let width=typeof(this.width) ==="function"? this.width(d,ds,ctx):this.width
        return new Style(color,null,1,width,dasharray)
    }
    render(canvas,xScale,yScale){
        let style=this.style ,ds=this.getData(),c
        // if(this.node){
        //     c=d3.select(this.node)
        // }else{
        //     c= d3.select(canvas).append("g")
        //     this.node=c.node()
        // }
        c= d3.select(canvas).append("g")
        // let enter=c.data(ds).selectAll("line").enter()
        //                                         .append("line")
        //                                         .attr("x1")
        let _color="red"
        let needNewLine=(d)=>{
            return !(this.color(d) == _color)
        }
        let _ls=[]
        _ls.push(ds[0])
        for(let i=1;i<ds.length;++i){
            if(needNewLine(ds[i])){
                c.append("path").attr("d",pathGen(xScale,yScale,_ls,false))
                                    .style("stroke",_color)
                                    .style("stroke-width",2)
                                    .style("fill","none")
                let t=_ls[_ls.length-1]
                _ls=[]
                _ls.push(t)
                _ls.push(ds[i])
                _color=this.color(ds[i])
            }else{
                _ls.push(ds[i])
            }
        }
         c.append("path").attr("d",pathGen(xScale,yScale,_ls,false))
                                 .style("stroke",_color)
                                    .style("stroke-width",2)
                                     .style("fill","none")
        // c.attr("d",pathGen(xScale,yScale,ds,false))
        //                                 .style("stroke",style.getColor())
        //                                 .style("stroke-width",style.getLineWidth())
        //                                 .style("fill","none")                               
    }
     toSymbolies(node,xScale,yScale,ctx?){
        let style=this.style ,ds=this.getData(),lines=[]
        if(ds.length<2){
            return lines
        }else{
            let s=this.getStyle(ds[0],this)
            let _d=[]
            _d.push(ds[0])
            for(let i=1;i<ds.length;++i){
                if(s.equal(this.getStyle(ds[i],this))){
                    _d.push[ds[i]]
                }else{
                    let l=new Line(pathGen(xScale,yScale,_d,false))
                    l.canvas=node
                    l.style=s
                    l.render=lineRender
                    lines.push(l)
                    let t=_d[_d.length-1]
                    _d=[]
                    _d.push(t)
                    _d.push(ds[i])
                    s=this.getStyle(ds[i],this)
                }
            }
            return lines
        }
     }
}