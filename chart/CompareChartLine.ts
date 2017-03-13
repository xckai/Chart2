import {CompareChartMeasure} from "./Measure"
export class CompareChartLine extends CompareChartMeasure{
    type="line"
    constructor(id?,name?,type?,ref?,ds?){
        super(id,name,type,ref,ds);
    }
    
}