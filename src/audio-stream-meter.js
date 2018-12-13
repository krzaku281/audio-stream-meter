"use strict";

function createAudioStreamProcessor(audioContext, callback, config) {
	if (typeof config === 'undefined') {
		config = {};
	}
	var scriptProcessor = audioContext.createScriptProcessor(
		config.bufferSize || 1024, 
		config.inputChannels || 1, 
		1
	);	
	
	scriptProcessor.onaudioprocess = onAudioStreamProcess;
	scriptProcessor.audioProcessCallback = callback;
	scriptProcessor.close = close;

	scriptProcessor.volume = 0;
	scriptProcessor.config = {
		volumeFall: config.volumeFall || 0.95, /* (0,1) more means volume wave will be fall slower */
		throttle: config.throttle || 1, /* [1, 10] higher value means more percent of data will be omited, 1 = 100% */
	};

	scriptProcessor.connect(audioContext.destination);
	
	return scriptProcessor;
};

function onAudioStreamProcess(event) {
	var volumeSum, volumeCount, buffer, sample;
	volumeSum = volumeCount = 0;
	
	for (var i = 0 ; i < event.inputBuffer.numberOfChannels ; i++) {
		buffer = event.inputBuffer.getChannelData(i);

		for (var j = 0 ; j < buffer.length ; j += this.config.throttle) {
			sample = buffer[~~j]
			volumeSum += sample * sample;
		}
		
		volumeCount += buffer.length;
	}
	
	var rms =  Math.sqrt(volumeSum / volumeCount);
	this.volume = Math.max(rms, this.volume * this.config.volumeFall);
	
	this.audioProcessCallback();
};

function close() {
	this.disconnect();
	this.onaudioprocess = null;
};

module.exports = {
	audioStreamProcessor: createAudioStreamProcessor,
};