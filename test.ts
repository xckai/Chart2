class Test {
    private str;
    constructor( str:number){
        this.str=str;
    };
    getStr(){
        return "hello world "+ this.str;
    }
}
export { Test };