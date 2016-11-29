require.config({
    path:{
        "require":"",
        "exports":"",
        "backbone":"backbone"
    }
})

import {Test} from "test"
let t= new Test("a");
document.body.innerHTML=t.getStr();
