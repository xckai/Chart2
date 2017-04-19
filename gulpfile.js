var gulp = require('gulp');
var exec=require("child_process").exec;
var spawn = require('child_process').spawn;
const browserSync = require('browser-sync').create();
var browserify = require('gulp-browserify');
var less = require('gulp-less');

gulp.task('start', function() {
  // exec("python -m http.server 8000",function(err,out,errstd){
  //   console.log(out);
  // })
 // var ls   = spawn("tsc",["-w"], {stdio : "inherit"});
  browserSync.init({server:{baseDir:"./",index:"test/index.html"}});
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

 

gulp.task('kpibuddle', function () {
       gulp.src('./KPIPanal/KPIPanal.js')
        .pipe(browserify({
          insertGlobals : true
        }))
        .pipe(gulp.dest('./dist/KPIPanal'));
        gulp.src("./KPIPanal/*.less")
            .pipe(less())
            .pipe(gulp.dest("./dist/KPIPanal"))
});

gulp.task("kpi",["kpibuddle"],function(){
      var kpiserver=require('browser-sync').create();
      kpiserver.init({server:{baseDir:"./",index:"test/KPI.html"}});
      gulp.watch(["./KPIPanal/*.js","./test/KPI.html","./KPIPanal/*.less"],function(e){
            gulp.start("kpibuddle")
            setTimeout(function(){
              kpiserver.reload()
            },1000)
            console.log(e.path+"-------file changed")
        });
})
//////develop kpi panal  module AMD
gulp.task("kpiDev",function(){
     var kpiserver=require('browser-sync').create();
      kpiserver.init({server:{baseDir:"./",index:"test/KPI.html"}});
      gulp.watch("./KPIPanal/*.less",function(e){
        gulp.src("./KPIPanal/*.less")
            .pipe(less())
            .pipe(gulp.dest("./KPIPanal"))
      })
      gulp.watch(["./KPIPanal/*.js","./test/KPI.html","./KPIPanal/*.css"],function(e){
           
            kpiserver.reload()
            console.log(e.path+"-------file changed")
        });
})
