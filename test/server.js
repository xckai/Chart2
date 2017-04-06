var _=require("../lib/underscore")
var PORT = 8000;
var http = require('http');
var url = require('url');
var util = require('util'); 
var server = http.createServer(function (req, res) {
     var params = url.parse(req.url, true).query
      res.writeHead(200, {'Content-Type': 'application/json'});
      var a={}
      var timeFrom=params.TIMEFROM? new Date(params.TIMEFROM):new Date() - 3600000
      var timeTo=params.TIMETO? new Date(params.TIMETO):new Date()
      var ids
      if(params.ID){
            ids=JSON.parse(params.ID)
      }else{
        ids=[]
      }
      console.log(ids,timeFrom,timeTo)
      res.write(JSON.stringify(dataGen(ids,timeFrom,timeTo)))
      res.end()
}).listen(PORT)
console.log("Server start")
// function dataGen(n) {
//             var ds = [], i = 0, baseTime = 5 * Math.floor(60 * Math.random()) % 60;
//             for (; i < n; ++i) {
//                 var d = {}, baseNum = 100;
//                 d.x = new Date("2016-2-3 1:" + (baseTime + i * 5) % 60);
//                 d[0] = baseNum + 10 + 10 * Math.random();
//                 d[1] = baseNum + 5 + 5 * Math.random();
//                 d[2] = baseNum;
//                 d[3] = baseNum - 10 - 5 * Math.random();
//                 d[4] = baseNum - 10 - 10 * Math.random();
//                 d[5] = baseNum - 15 - 20 * Math.random();
//                 ds.push(d);
//             }
//             var nds = [];
//             ds.forEach(function (d) {
//                 if (!_.some(nds, function (nd) { nd == d.x; })) {
//                     nds.push(d);
//                 }
//             });
//             return nds;
// }
function dataGen(ids,timeFrom,timeTo){
    var ds=[],i=0
    var n=(timeTo-timeFrom)/(5*60000)
    ids.forEach(function(id){
        i=0;
        for(;i<n;++i){
        var d={}
        d.ID=id
        d.TIMESTAMP=new Date(timeFrom+i*5*60000).toUTCString()
        d.VOLUME=100*Math.random()
        ds.push(d)
    }
})
 //console.log(ds)
    return ds
   
}
