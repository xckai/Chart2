var gulp = require('gulp');
var exec=require("child_process").exec;
var spawn = require('child_process').spawn;
const browserSync = require('browser-sync').create();

gulp.task('start', function() {
  // exec("python -m http.server 8000",function(err,out,errstd){
  //   console.log(out);
  // })
 // var ls   = spawn("tsc",["-w"], {stdio : "inherit"});
  browserSync.init({server:{baseDir:"./"}});
  gulp.watch("./*/*.js",function(e){
        browserSync.reload();
        console.log(e.path+"-------file changed")
    });
  // gulp.watch("*.less",function(event){
  //   var file=event.path;
  //   if(event.type==="changed"|| event.type==="added"){
  //      var new_file=file.replace(/less$/,"css");
  //      exec("lessc "+file+"  "+new_file,function(err,out,errstd){
  //        console.log("less convert to css done");
  //      })
  //   }
   
  // })
});
