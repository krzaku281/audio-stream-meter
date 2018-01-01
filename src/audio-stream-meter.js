"use strict";

module.exports = {
	audioStreamProcessor: createAudioStreamProcessor,
};

function createAudioStreamProcessor(audioContext, callback, config = {}) {
	var scriptProcessor = audioContext.createScriptProcessor(
		config.bufferSize || 1024, 
		config.inputChannels || 1, 
		1
	);	
	
	scriptProcessor.onaudioprocess = volumeAudioStream;
	scriptProcessor.audioStreamCallback = callback;
	scriptProcessor.close = close;

	scriptProcessor.volume = 0;
	scriptProcessor.config = {
		volumeFall: config.volumeFall || 0.95, /* (0,1) more means volume wave will be fall slower */
	};

	scriptProcessor.connect(audioContext.destination);
	
	return scriptProcessor;
};

function volumeAudioStream(event) {
	var volumeSum, volumeCount, buffer;
	volumeSum = volumeCount = 0;
	
	for (var i = 0 ; i < event.inputBuffer.numberOfChannels ; i++) {
		buffer = event.inputBuffer.getChannelData(i);

		for (var j = 0 ; j < buffer.length ; j++) {
			volumeSum += buffer[j] * buffer[j];
		}
		
		volumeCount += buffer.length;
	}
	
	var rms =  Math.sqrt(volumeSum / volumeCount);
	this.volume = Math.max(rms, this.volume * this.config.volumeFall);
	
	this.audioStreamCallback();
};

function close() {
	this.disconnect();
	this.onaudioprocess = null;
};