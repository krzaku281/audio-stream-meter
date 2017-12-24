# audio-stream-meter
Simple meter for showing audio stream waveform.

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
    var waveform = document.getElementById('waveform');

    var meter = AudioStreamMeter.createAudioStreamProcessor(audioContext, function() {
        waveform.style.width = meter.volume * 100 + '%';
    });
      
    mediaStream.connect(meter);
    stream.onended = meter.close.bind(meter);
});

<!-- html waveform -->
<div style="width:500px;height:50px;background-color:#FF00FF">
	<div id="waveform" style="height:50px;background-color:#00FFFF">
	</div>
</div>
```
# Configuration
```sh
var meter = AudioStreamMeter.createAudioStreamProcessor(audioContext, function(){}, bufferSize);
```
> - bufferSize, default: 1024, set: [0, 256, 512, 1024, 2048, 4096, 8192, 16384] 
More value create higher latency of audio sample-frames.
> - meter.configuration.waveFall, default: 0.95, set: (0,1)
More means wave will be fall slower.


# Licence
MIT