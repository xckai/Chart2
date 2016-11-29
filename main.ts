/// <amd-dependency path="underscore">
import {Test} from "test"
declare var _:any;
let t= new Test(_([2,3]).size());
document.body.innerHTML=t.getStr();
