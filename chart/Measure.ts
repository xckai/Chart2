/// <amd-dependency path="lib/underscore">
declare var _:any;
import {Evented} from './Evented'
import { Style} from "./Utils"
import {Symbol} from"./Symbol"
export abstract class  Measure extends Evented {
    constructor(id?,name?,type?,ds?) {
        super();
        this.id=id;
        this.name=name || id;
        this.type=type;
        this.dataset=ds;
    }
    dataset:any [];
    symbolizes:any[]=[]
    name:string
    style:Style=new Style();
    id:string
    type:string
    pluckDatas(type:string):any[]{
       return _.pluck(this.dataset,type);
    }
    toSymbolies(node?,x?,y?):Symbol[]{
        return this.symbolizes
    }
    getSymbolizes(){
        return this.symbolizes
    }
    setID(id){
        if(id!=undefined){
              this.id=id
        }
        return this
    }
    setData(ds){
        if(ds!=undefined){
             this.dataset=ds
        }
        return this
    }
    getData(){
        return this.dataset
    }
    getID(){
        return this.id
    }
    removeSymbolies(){
        
    }
    update(){

    }


}

export class CompareChartMeasure extends Measure {
    constructor(id?,name?,type?,ref?,ds?){
        super(id,name,type);
        this.ref=ref||this.ref;
        this.setData(ds)
        // this.style.on("change",()=>{
        //     this.symbolizes.forEach((s:Symbol)=>{
        //         s.style.clone(this.style)
        //     })
        // })
    }
    ref:string ="y1"
    node:any
    render(canvas,xScale,yScale,ctx?){
        //this.toSymbolies()
    }
    getStyle(d,ds,ctx?){
        return new Style()
    }
    toSymbolies(node,xScale,yScale,ctx?){
        return this.getData().map((d)=>{
            let s= new Symbol()
            return s
        })
    }
}