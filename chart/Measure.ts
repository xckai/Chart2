/// <amd-dependency path="lib/underscore">
declare var _:any;
import {Evented} from './Evented'
import { Style} from "./Utils"
export abstract class  Measure extends Evented {
    constructor(id?,name?,type?,ds?) {
        super();
        this.id=id;
        this.name=name || id;
        this.type=type;
        this.dataset=ds;
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
    ref:string ="y1"
    _node:any
    data(ds?){
        if(ds){
            this.dataset=ds;
            this.fire("change",ds);
            return this;
        }
        return this.dataset;
    }
    node(n){
        if(n){
            this._node=n
            return this
        }
        return this._node
    }

}