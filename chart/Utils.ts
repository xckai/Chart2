/// <amd-dependency path="lib/underscore">
declare var _:any;
declare var window:any;
export module Util{

  export function max (nums:number []){
       let n=Number.MIN_VALUE;
       nums.forEach((num)=>{
            n=isNaN(num)?n: n>num? n:num;
       })
       n= n==Number.MIN_VALUE?0:n;
       return n;
    }
   export function min (ns:number []){
       let n=Number.MAX_VALUE;
       ns.forEach((num)=>{
            n=isNaN(num)?n: n<num? n:num;
       })
       n= n == Number.MAX_VALUE?0:n;
       return n;
    }
    export function getStringRect(str:string, cla ?:string){
        let d= window.document.createElement("div");
        let p = window.document.createElement("span");
        let r ={width:0,height:0};
         d.style.transform="translate3d(0, 0, 0)";
        d.style.visibility="hidden";
        p.innerHTML= str;
        if(cla){
            p.className=cla;
        }
        if(!str){
            return r;
        }
        p.style.display="inline-block";
        d.appendChild(p);
        window.document.body.appendChild(d);
        let rec=p.getBoundingClientRect()
        r.width=rec.width;
        r.height=rec.height;
        d.remove();
        console.log(r);
        return r;
    }
}
export class Style{
    constructor(color ?,stroke ?,fillColor ?,opacity ?){
        this.color=color;
        this.stroke =stroke;
        this.fillColor =fillColor;
        this.opacity =opacity;
    }
    color:string ="black"
    stroke:number =1
    fillColor:string ="black"
    opacity:number =1
}
