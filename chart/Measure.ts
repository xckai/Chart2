/// <amd-dependency path="lib/underscore">
declare var _:any;
import {Evented} from './Evented'
import { Style} from "./Utils"
export abstract class  Measure extends Evented {
    constructor(id?,name?,type?) {
        super();
        this.id=id;
        this.name=name || id;
        this.type=type;
    }
    dataset:any [];
    name:string
    style:Style=new Style();
    id:string
    type:string
    pluckDatas(type:string):any[]{
       return _.pluck(this.dataset,type);
    }
}

export class CompareChartMeasure extends Measure {
    constructor(id?,name?,type?,ref?,ds?){
        super(id,name,type);
        this.ref=ref||this.ref;
        this.data(ds)
    }
    ref:string ="y1";
    data(ds?){
        if(ds){
            this.dataset=ds;
            this.fire("change",ds);
            return this;
        }
        return this.dataset;
    }

}