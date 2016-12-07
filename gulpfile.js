var gulp = require('gulp');
var exec=require("child_process").exec;
var spawn = require('child_process').spawn;

gulp.task('develop', function() {
  // exec("python -m http.server 8000",function(err,out,errstd){
  //   console.log(out);
  // })
var ls   = spawn("python",["-m","http.server","8000"], {stdio : "inherit"});

  gulp.watch("*.less",function(event){
    var file=event.path;
    if(event.type==="changed"|| event.type==="added"){
       var new_file=file.replace(/less$/,"css");
       exec("lessc "+file+"  "+new_file,function(err,out,errstd){
         console.log("less convert to css done");
       })
    }
   
  })
});
