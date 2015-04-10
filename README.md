# myth-player
A mihtril.js html5 video player

Myth player is a simple html5 video player depending on mythril.js.

### API

Currently myth player supports a very small subset of html5 media element's api, consisting of play, pause and load. 




Usage:
```
      <script type="text/javascript">
        (function(){

             player = mythPlayer("videoContainer", {}, {
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
