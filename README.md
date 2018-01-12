# audio-stream-meter
Simple meter for showing audio stream volume.

[![npm version](https://badge.fury.io/js/audio-stream-meter.svg)](https://badge.fury.io/js/audio-stream-meter) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

# Installation
```sh
$ npm install audio-stream-meter
```

# Quick start
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
	<div id="volume" style="height:30px;background-color:#00FFFF"></div>
</div>
```
# Configuration
```sh
var config = {
	bufferSize: 1024, // default: 1024, interval: {0, 256, 512, 1024, 2048, 4096, 8192, 16384} 
	inputChannels: 1, // default: 1, interval: [1, 32]
	volumeFall: 0.95, // default: 0.95, interval: (0,1)
	throttle: 1, // default: 1, interval: [1, 10]
};

var meter = AudioStreamMeter.audioStreamProcessor(audioContext, callbackFn(), config);
```
> - bufferSize - more value create higher latency of audio sample-frames,
> - inputChannels - how many input channels should be handling, passing more channels then exists in stream will flatten volume,
> - volumeFall - more means volume wave will be fall slower.
> - throttle - sets step for which will be take samples for calculations, see percent of calculated samples by means of formula f(x) = 1 / x * 100, 

# Controls
> - callbackFn() - function is invoke after each processing audio samples and can use within data from **'Output data'** paragraph. For example: *callbackFn(){ console.log(meter.volume)}*
> - meter.close() - close and disconnect audio processing

# Output data
> - meter.volume - gives info about volume of the last package of samples - intervals [0, 1],

# Licence
MIT