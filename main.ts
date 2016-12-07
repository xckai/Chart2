import {Flexable} from "Chart/Flexable"
import {Service} from "Chart/Service"
import d3= require("lib/d3"); 
let translateStr=Service.stringTemplate("translate({x},{y})")
    var svg = d3.select("body").append("svg").attr("height", 200);
    var texts= svg.selectAll("text").data(d3.range(30))
                        .enter()
                        .append("text")
                        .attr("x",0)
                        .attr("y",(d,i)=>{return i*30})
                        .attr("dominant-baseline", "text-before-edge")
                        .text((d)=>d);
    var scroll=svg.append("g").style("height",200).attr("transform",translateStr({x:20,y:0}))
    Flexable.connectContainerAndScrollbar(scroll,5,200,900,0,function(obj){
        texts.attr("transform",translateStr({x:0,y:-obj.offset}))
    });
    var svg1 = d3.select("body").append("svg").attr("width", 200);
    var texts1= svg1.selectAll("text").data(d3.range(30))
                        .enter()
                        .append("text")
                        .attr("y",0)
                        .attr("x",(d,i)=>{return i*30})
                        .attr("dominant-baseline", "text-before-edge")
                        .text((d)=>d);
    var scroll1=svg1.append("g").style("height",200).attr("transform",()=>{
         return Service.d3Transform().translate(0,20).rotate(-90)();
    })
    Flexable.connectContainerAndScrollbar(scroll1,5,200,900,0,function(obj){
        texts1.attr("transform",translateStr({x:-obj.offset,y:0}))
    });

    var svg2 = d3.select("body").append("svg").attr("width", 200).attr("height",200).append("g");
    var texts2= svg2.selectAll("text").data(d3.range(30))
                        .enter()
                        .append("text")
                        .attr("y",(d,i)=>{return i*30})
                        .attr("x",(d,i)=>{return i*30})
                        .attr("dominant-baseline", "text-before-edge")
                        .text((d)=>d);
   Flexable.flexableContainer(200,200,20,900,900,svg2);
   
