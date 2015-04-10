# myth-player
A mihtril.js html5 video player

Myth player is a simple html5 video player depending on mythril.js.

### API

Currently myth player supports a very small subset of html5 media element's api, consisting of play, pause and load. 

### Usage

A player instance is created like this: 

```
var player = mythPlayer(containerID, configuration, mediasources);
```
##### containerID
Simply the id of the container element. In a structure like the following, the container id would be "videoContainer":

```
   <div id="videoContainer">
      <video controls="" preload="auto">
          <source src="http://media.w3.org/2010/05/sintel/trailer.mp4" type="video/mp4">
      </video>
   </div>
```

##### configuration

An object consisting of attributes for the media element. Please have a look at http://www.w3.org/TR/html5/embedded-content-0.html#the-video-element . Currently the default settings are as follows, but you can always override the configuration.

```
      {
            autoplay: false
            ,preload: "auto"
            ,controls: true
      }
```

##### sources

Sources for the media player. Sources can either be provided at the initilasation or set later by player.setSources. Please see the example.



Example:
```
      <script type="text/javascript">
        (function(){

            var player = mythPlayer("videoContainer", {}, {
                mp4: "http://media.w3.org/2010/05/sintel/trailer.mp4"
            });

            /* or 
                player.setSources({
                     mp4: "http://media.w3.org/2010/05/sintel/trailer.mp4",
                     webm: "..."
                })
            */
            player.api.play();

        })();
    </script>
```
