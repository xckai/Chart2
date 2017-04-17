   /// <amd-dependency path="lib/underscore">
declare var _:any;
    import {CompareChartLine} from "../chart/CompareChartLine"
     import {CompareChartBar} from "../chart/CompareChartBar"
     import {CompareChartLegend} from "../chart/CompareLegend"

export namespace Tester{

    export function getLine(){
        let id=Math.floor(10*Math.random())
        return new CompareChartLine(id,"Line-"+id,null,dataGen(10,).map((d)=>{
            d.y=d[0]
             return d
        }).sort((d1,d2)=>{
            return d1.x-d2.x
        }))
    }
    export function getBar(){
        let id=Math.floor(10*Math.random())+"bar"
        return new CompareChartBar(id,"bar-"+id,null,dataGen(10).map((d)=>{
            d.y=d[0]
            return d
        }).sort((d1,d2)=>{
            return d1.x-d2.x
        }))
    }
    export function getLegend(){
        let id=Math.floor(10*Math.random())+"bar"
        return new CompareChartLegend(id,"legend-"+id,"hahah",dataGen(10).map((d)=>{
            d.y=d[0]
            return d
        }).sort((d1,d2)=>{
            return d1.x-d2.x
        }))
    }
    function dataGen(n){
        let ds=[],i=0,baseTime=  5 * Math.floor(60 * Math.random()) % 60
        for(;i<n;++i){
            let d:any={},baseNum=100 
            d.x=new Date("2016-2-3 1:" +(baseTime+i*5)%60)
            d[0]=baseNum+10+10*Math.random()
            d[1]=baseNum+5+5*Math.random()
            d[2]=baseNum
            d[3]=baseNum-10-5*Math.random()
            d[4]=baseNum-10-10*Math.random()
            d[5]=baseNum-15-20*Math.random()
            ds.push(d)
        }
        let nds=[]
        ds.forEach((d)=>{
            if(!_.some(nds,(nd)=>{nd==d.x})){
                nds.push(d)
            }
        })
        return nds
    }
    let add=x=>y=>x+y
}
