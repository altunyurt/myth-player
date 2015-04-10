
// https://gist.github.com/mindeavor/13d4593b00b4ee7cea33
// Partially apply arguments to a function. Useful for binding
// specific data to an event handler.
// Example:
//
//   var add = function (x,y) { return x + y; }
//   var add5 = add.papp(5)
//   add5(7) //=> 11
//
Function.prototype.papp = function () {
  var slice = Array.prototype.slice
  var fn = this
  var args = slice.call(arguments)
  return function () {
    return fn.apply(this, args.concat(slice.call(arguments)))
  }
}

// Prevents the default action. Useful for preventing
// anchor click page jumps and form submits.
// Example:
//
//   var x = 0;
//   var increment = function () { x += 1 }
//   myAnchorEl.addEventListener('click', increment.chill())
//
Function.prototype.chill = function() {
  var fn = this
  return function(e) {
    e.preventDefault()
    return fn()
  };
};

// Both prevent default and partially apply in one go.
// Example:
//
//   var x = 0;
//   var increment = function (amount) { x += amount }
//   myAnchorEl.addEventListener('click', increment.coldPapp(17))
//
Function.prototype.coldPapp = function() {
  var slice = Array.prototype.slice
  var fn = this
  var args = slice.call(arguments)
  return function(e) {
    e.preventDefault()
    return fn.apply(this, args.concat(slice.call(arguments, 1)))
  };
};

// Apply the combination of two arrays of arguments.
// Useful for dealing with fancy functions using the `arguments` keyword.
// Example:
//
//   function sum () {
//     var result = 0
//     for (var i=0; i < arguments.length; i++) { result += arguments[i] }
//     return result
//   }
//   function sumPlusTen () {
//     return sum.apply2(null, [10], arguments)
//   }
//   sumPlusTen(100,200) //=> 310
//
Function.prototype.apply2 = function (context, args1, args2) {
  var slice = [].slice
  var args = slice.call(args1).concat(slice.call(args2))
  return this.apply(context, args)
}


// Compose two functions together,
// piping the result of one to the other.
// Example:
//
//   var double = function (x) { return x * 2 }
//   var addOne = function (x) { return x + 1 }
//   var doublePlus = double.andThen(addOne)
//   doublePlus(3) //=> 7
//
Function.prototype.andThen = function(f) {
  var g = this
  return function() {
    var slice = Array.prototype.slice
    var args = slice.call(arguments)
    return f.call(this, g.apply(this, args))
  }
}


var mythPlayer = function (selectorId, options, sources) {
    "use strict";
    options = options || {};
    sources = sources || {};

    var mythTools = (function () {
            /*
            https://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
            */
            var clone = function (obj) {
                var attr;
                if (null === obj || "object" !== typeof obj) {
                    return obj;
                }
                var copy = obj.constructor();
                for (attr in obj) {
                    if (obj.hasOwnProperty(attr)) {
                        copy[attr] = obj[attr];
                    }
                }
                return copy;
            };

            var extend = function (arg1, arg2) {
                var newObj = this.clone(arg1);
                Object.keys(arg2).map(function (key) {
                    newObj[key] = arg2[key];
                });
                return newObj;
            };

            return {clone: clone, extend: extend};
        }());

    var player = function(){
        var self = this;
        self.defaultOptions = {
            autoplay: false
            ,preload: "auto"
            ,controls: true
        };

        self.vm = {
            init: function(){
                this.sources = m.prop(sources);
                this.options = m.prop(mythTools.extend(self.defaultOptions, options));
                this.state = m.prop("INIT");
            }
        };

        self.getApi= function (mediaElement) {
            self.mediaElement = mediaElement;
            return function(method, args, state){
                args = Array.prototype.indexOf.call([null, undefined], args) != -1? undefined: args;
                var retval = mediaElement[method].apply(mediaElement, args);
                if(state){
                    self.vm.state(state);
                }
                return retval;
            }
        };

        self.setSources = function (sources) {
            m.startComputation();
            self.vm.sources(sources);
            m.endComputation();
        };

        self.controller = function () {
        };

        self.view = function (ctrl) {
            var vmSources = self.vm.sources(),
                vmOptions = self.vm.options();

            vmOptions.config = function (mediaElement, isInitialized, context) {
                if(isInitialized){
                    return
                }
                if (!self.api) {
                    self.api = self.getApi(mediaElement);
                }
                self.api("load");
            };

            var video = m("video", vmOptions, [
                            Object.keys(vmSources).map(function (key, idx) {
                                return m("source", {type: "video/" + key, src: vmSources[key] });
                            })
                        ])
            return [video]
        };

        self.vm.init();
        m.module(document.getElementById(selectorId), self);
        return self;
    };
    return new player();
};

