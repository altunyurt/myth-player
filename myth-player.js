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
            // place holding for callbacks
            return function(method, arg){
                return mediaElement[method](arg);
            }
        };

        self.setSources = function (sources) {
            // apply changes to dom
            m.startComputation();
            self.vm.sources(sources);
            m.endComputation();
        };

        self.setState = function(state){
            self.vm.state(state);
        }

        self.controller = function () {};

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

