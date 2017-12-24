module.exports.createAudioStreamProcessor = function(audioContext, callback, bufferSize = 1024) {
	var scriptProcessor = audioContext.createScriptProcessor(bufferSize);	
	
	scriptProcessor.onaudioprocess = volumeAudioStream;
	scriptProcessor.audioStreamCallback = callback;
	scriptProcessor.close = close;

	scriptProcessor.volume = 0;
	scriptProcessor.configuration = {
		waveFall: 0.95, /* (0,1) more means wave will be fall slower */
	};

	scriptProcessor.connect(audioContext.destination);
	
	return scriptProcessor;
}

function volumeAudioStream(event) {
	var buffer = event.inputBuffer.getChannelData(0);
	var sum = 0;

    for (var i = 0 ; i < buffer.length ; i++) {
    	sum += buffer[i] * buffer[i];
    }
    var rms =  Math.sqrt(sum / buffer.length);
    this.volume = Math.max(rms, this.volume * this.configuration.waveFall);
	
	this.audioStreamCallback();
}

function close() {
	this.disconnect();
	this.onaudioprocess = null;
};