 class Test {
    str;
    constructor(str){
        this.str=str;
    };
    getStr(){
        return "hello world "+ this.str;
    }
}
export { Test };