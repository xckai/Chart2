/// <amd-dependency path="lib/underscore">
declare var _:any;
class BaseClass{
    setConfig =(obj)=>{
        let self=this;
        _(obj).chain().keys().each(
           (v,k)=>{
               self[k]=v;
           }
        )
    }
}
function stringTemplate(str:string){
    return  _.template(str,{interpolate:/\{(.+?)\}/g});
}

function curry(f) {
        var arity = f.length;
        return function f1() {
            var args = Array.prototype.slice.call(arguments, 0);
            if(args.length < arity) {
                var f2 = function() {
                    var args2 = Array.prototype.slice.call(arguments, 0); // parameters of returned curry func
                    return f1.apply(null, args.concat(args2)); // compose the parameters for origin func f
                };
                return f2;
            } else {
                return f.apply(null, args); //all parameters are provided call the origin function
            }
        };
    };
function d3Transform(chain ?) {
    var transforms = [];
    if (chain !== undefined) { transforms.push(chain) }

    function push(kind, args) {
      var n = args.length;

      transforms.push(function() {
        return kind + '(' + (n == 1 && typeof args[0] == 'function'
            ? args[0].apply(this, arr(arguments)) : args) + ')';
      });
    };

    function arr(args) {
      return Array.prototype.slice.call(args);
    }

    var my = function() {
      var that = this,
          args = arr(arguments);

      return transforms.map(function(f) {
        return f.apply(that, args);
      }).join(' ');
    };

    ['translate','rotate', 'scale', 'matrix', 'skewX', 'skewY'].forEach(function(t) {
      my[t] = function() {
        push(t, arr(arguments));
        return my;
      };
    });

    return my;
  };
class Service extends BaseClass{
    static stringTemplate=stringTemplate;
    static curry=curry;
    static d3Transform:any= d3Transform;
}
export{Service,BaseClass};