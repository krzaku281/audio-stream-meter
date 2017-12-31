# audio-stream-meter
Simple meter for showing audio stream volume.

Available is callback function. For every portion of stream is called and you can do what you need with the provided information about current part of audio stream.

[![npm version](https://badge.fury.io/js/audio-stream-meter.svg)](https://badge.fury.io/js/audio-stream-meter) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

# Installation
```sh
$ npm install audio-stream-meter
```

# Example
```sh
var AudioStreamMeter = require('audio-stream-meter');

navigator.mediaDevices.getUserMedia({audio:true})
.then(stream => {

	var audioContext = new AudioContext();
				
    var mediaStream = audioContext.createMediaStreamSource(stream);
    var volume = document.getElementById('volume');

    var meter = AudioStreamMeter.audioStreamProcessor(audioContext, function() {
        volume.style.width = meter.volume * 100 + '%';
    });
      
    mediaStream.connect(meter);
    stream.onended = meter.close.bind(meter);
});

<!-- html volume -->
<div style="width:300px;height:30px;background-color:#FF00FF">
	<div id="volume" style="height:30px;background-color:#00FFFF">
	</div>
</div>
```
# Configuration
```sh
var config = {
	bufferSize: 1024 // default: 1024, set: [0, 256, 512, 1024, 2048, 4096, 8192, 16384] 
	volumeFall: 0.95 // default: 0.95, set: (0,1)
};

var meter = AudioStreamMeter.audioStreamProcessor(audioContext, function(){}, config);
```
> - bufferSize - more value create higher latency of audio sample-frames,
> - volumeFall - more means volume wave will be fall slower.


# Licence
MIT