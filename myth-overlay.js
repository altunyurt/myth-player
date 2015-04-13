var mythOverlay = function(){
    var overlay = function(){
        var self = this;
        self.controller = function () {}
        self.view = function (ctrl, player) {
            return m(".overlay", {onclick: function() {
                                                player.api("playpause")
                                            }
            })
        }
        return self
    }
    return new overlay()
};
