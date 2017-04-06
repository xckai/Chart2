import{Evented} from"./Evented"
export class Model extends Evented{
    _status:any={}
    _dataset:any[]
    _url:string
    setUrl(u){
        this._url=u
        this.fire("change",{url:u})
        return this
    }
    setDate(ds){
        this._dataset=ds
        this.fire("change")
        return this
    }
}