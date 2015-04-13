var mythPlayer = function (selectorId, options, sources) {
    "use strict"
    options = options || {}
    sources = sources || {}

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
            }

            , extend = function (arg1, arg2) {
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
            ,controls: false
            ,plugins: []
        };

        self.vm = {
            init: function(){
                var _config = options.config;
                options.config = function (mediaElement, isInitialized, context) {
                    if(isInitialized){
                        return
                    }
                    self.api = self.api || self.getApi(mediaElement);
                    self.api("load")
                    return _config? _config(mediaElement, isInitialized, context): undefined;
                }
                this.sources = m.prop(sources);
                this.options = m.prop(mythTools.extend(self.defaultOptions, options));
                this.state = m.prop("INIT");
            }
        };

        self.getApi= function (mediaElement) {
            self.mediaElement = mediaElement
            // place holding for callbacks
            return function(method, arg){
                var commands = {
                    "playpause": function(){
                        return mediaElement.paused? mediaElement.play(): mediaElement.pause()
                    }
                };
                return method in commands? commands[method](arg): mediaElement[method](arg)
            }
        }

        self.setSources = function (sources) {
            // apply changes to dom
            m.startComputation()
            self.vm.sources(sources)
            m.endComputation()
        }

        self.setState = function(state){
            self.vm.state(state)
        }

        self.controller = function () {
            self.vm.init()
        }

        self.view = function (ctrl) {
            var vmSources = self.vm.sources(),
                vmOptions = self.vm.options();

            var video = m("video", vmOptions, [
                            Object.keys(vmSources).map(function (key, idx) {
                                return m("source", {type: "video/" + key, src: vmSources[key] });
                            })
                        ]),
                views = [video];
            vmOptions.plugins.map(function(plugin){
                views.push(plugin.view(plugin.controller, self))
            })
            return views
        };

        m.module(document.getElementById(selectorId), self)
        return self
    }
    return new player()
};
