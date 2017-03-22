import {CompareChartMeasure} from "./Measure"
export class CompareChartBar extends CompareChartMeasure{
    type="bar"
    constructor(id?,name?,ref?,ds?){
        super(id,name,"line",ref,ds);
    }
    maxBarsNum(){

    }
}