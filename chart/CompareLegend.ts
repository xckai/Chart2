import {CompareChartMeasure} from "./Measure"
export class CompareChartLegend extends CompareChartMeasure{
    type="legend"
    constructor(id?,name?,ref?,ds?){
        super(id,name,"legend",ref,ds);
    }
     pluckDatas(type:string):any[]{
       return []
    }
}