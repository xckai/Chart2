import {CompareChartMeasure} from "./Measure"
export class CompareChartLine extends CompareChartMeasure{
    type="line"
    constructor(id?,name?,ref?,ds?){
        super(id,name,"line",ref,ds);
    }
    
}