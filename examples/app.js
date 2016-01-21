/*
var sampleRate = 44100;
var bufferSize = 5 * 44100;
var channels = 32;

var audioContext1 = new OfflineAudioContext(channels, bufferSize, sampleRate);

var buffer = audioContext1.createBuffer(channels, bufferSize, sampleRate);

for(var j = 0 ; j < buffer.numberOfChannels; j++){
	
	var data_ = buffer.getChannelData(j);

	for(var i = 0; i < bufferSize; ++i) {
		data_[i] = j + 1;//Math.random() * 2 - 1; 
	}
}

for(var i = 0; i < buffer.numberOfChannels; i++) {
		
		var data = buffer.getChannelData(i);		
		var sample_ = data[0];
		
		console.log("i = " + i );
		console.log("sample = " + sample_ );
		
		console.log("sample = " + buffer.getChannelData(i)[0] );

		//console.log(`IN${i}: ${sample}`);
	}

var bufferSource = audioContext1.createBufferSource();

bufferSource.buffer = buffer;

var compressorNode = audioContext1.createDynamicsCompressor ();
/// representing the decibel value above which the compression will start taking effect
compressorNode.threshold.value = M4DPAudioModules.utilities.dB2lin( 0 );

/// representing the amount of change, in dB, needed in the input for a 1 dB change in the output
compressorNode.ratio.value = 3;  

/// representing the amount of time, in seconds, required to reduce the gain by 10 dB
compressorNode.attack.value = 0.1;  

/// representing the amount of time, in seconds, required to increase the gain by 10 dB
compressorNode.release.value = 0.25;

bufferSource.connect(gainNode);
compressorNode.connect(audioContext1.destination);

var localTime = 0;
bufferSource.start( localTime );

audioContext1.oncomplete = (output) => {
	var buf = output.renderedBuffer;
	for(var i = 0; i < buf.numberOfChannels; ++i) {
		var sample_ = buf.getChannelData(i)[0];
		console.log(`channel${i}: ${sample_}`);
		debugger;
	}
	//debugger;
};

audioContext1.startRendering();
*/



var dumpObject = function(obj) {
	console.debug("Dumping: "+obj);
	for (var name in obj) {
		console.debug("    ."+name+"="+obj[name]);
	}
};

videoPlayerMainMediaElement = document.getElementById('videoPlayerMain');
videoPlayerPipMediaElement = document.getElementById('videoPlayerPip');
videoPlayerAudioMediaElement = document.getElementById('videoPlayerAudio');

var context = new Dash.di.DashContext();

var urlMain = "http://medias2.francetv.fr/innovation/media4D/m4dp-set1-LMDJ/manifest.mpd";
var urlPip = "http://medias2.francetv.fr/innovation/media4D/m4dp-set1-LMDJ/manifest-lsf.mpd";
var urlAudio = "http://medias2.francetv.fr/innovation/media4D/m4dp-set1-LMDJ/manifest-ad.mpd";

var playerMain = new MediaPlayer(context);
playerMain.startup();
playerMain.setAutoPlay(false);
playerMain.attachView(videoPlayerMainMediaElement);
playerMain.getDebug().setLogToBrowserConsole(false);


var playerPip = new MediaPlayer(context);
playerPip.startup();
playerPip.setAutoPlay(false);
playerPip.attachView(videoPlayerPipMediaElement);
playerPip.getDebug().setLogToBrowserConsole(false);
//videoPlayerPipMediaElement.style.zIndex = "2147483648"; //pour etre au dessus du 0x7fffffff du player en fullscreen

var playerAudio = new MediaPlayer(context);
playerAudio.startup();
playerAudio.setAutoPlay(false);
playerAudio.attachView(videoPlayerAudioMediaElement);
playerAudio.getDebug().setLogToBrowserConsole(false);


var controller = new MediaController();

dumpObject(playerMain);

videoPlayerMainMediaElement.controller = controller;
videoPlayerPipMediaElement.controller = controller;
videoPlayerAudioMediaElement.controller = controller;


var audioContext = new (window.AudioContext || window.webkitAudioContext)();
console.debug("######### audioContext: "+audioContext);

var videoAudioSource = audioContext.createMediaElementSource(videoPlayerMainMediaElement);

var extendedAudioSource = audioContext.createMediaElementSource(videoPlayerAudioMediaElement);

var mainChannelSplitterNode = audioContext.createChannelSplitter(2);
videoAudioSource.connect(mainChannelSplitterNode);

var extendedChannelSplitterNode = audioContext.createChannelSplitter(8);
extendedAudioSource.connect(extendedChannelSplitterNode);

var channelMerger = audioContext.createChannelMerger(10);

var i=0;
// main video (stereo)
mainChannelSplitterNode.connect(channelMerger, 0, i++);
mainChannelSplitterNode.connect(channelMerger, 1, i++);

// extended audio ambience (5.1)
extendedChannelSplitterNode.connect(channelMerger, 0, i++);
extendedChannelSplitterNode.connect(channelMerger, 1, i++);
extendedChannelSplitterNode.connect(channelMerger, 2, i++);
extendedChannelSplitterNode.connect(channelMerger, 3, i++);
extendedChannelSplitterNode.connect(channelMerger, 4, i++);
extendedChannelSplitterNode.connect(channelMerger, 5, i++);

// extended audio comments (mono)
extendedChannelSplitterNode.connect(channelMerger, 6, i++);

// extended audio dialogs (mono)
extendedChannelSplitterNode.connect(channelMerger, 7, i++);

var mainAudioASD = new M4DPAudioModules.AudioStreamDescription(
		type = "Stereo",
		active = true,
		loudness = -23,
		maxTruePeak = -1,
		dialog = true,
		ambiance = true,
		commentary = false);
var extendedAmbienceASD = new M4DPAudioModules.AudioStreamDescription(
		type = "MultiWithLFE",
		active = false,
		loudness = -23,
		maxTruePeak = -1,
		dialog = false,
		ambiance = true,
		commentary = false);
var extendedCommentsASD = new M4DPAudioModules.AudioStreamDescription(
		type = "Mono",
		active = false,
		loudness = -23,
		maxTruePeak = -1,
		dialog = false,
		ambiance = false,
		commentary = true);
var extendedDialogsASD = new M4DPAudioModules.AudioStreamDescription(
		type = "Mono",
		active = false,
		loudness = -23,
		maxTruePeak = -1,
		dialog = true,
		ambiance = false,
		commentary = false);

var asdc = new M4DPAudioModules.AudioStreamDescriptionCollection(
		[mainAudioASD, extendedAmbienceASD, extendedCommentsASD, extendedDialogsASD]
		);

// M4DPAudioModules
var smartFader = new M4DPAudioModules.SmartFader(audioContext, asdc);
//var objectSpatialiserAndMixer = new M4DPAudioModules.ObjectSpatialiserAndMixer(audioContext);
//var noiseAdaptation = new M4DPAudioModules.NoiseAdaptation(audioContext);
//var multichannelSpatialiser = new M4DPAudioModules.MultichannelSpatialiser(audioContext);
//var dialogEnhancement = new M4DPAudioModules.DialogEnhancement(audioContext);

channelMerger.connect(smartFader.input);
smartFader.connect(audioContext.destination);


playerMain.attachSource(urlMain);
playerPip.attachSource(urlPip);
playerAudio.attachSource(urlAudio);

playerMain.play();
playerPip.play();
playerAudio.play();

var checkboxVideo = document.getElementById('checkbox-video');
var checkboxExAmbience = document.getElementById('checkbox-extended-ambience');
var checkboxExComments = document.getElementById('checkbox-extended-comments');
var checkboxExDialogs = document.getElementById('checkbox-extended-dialogs');
var checkboxLSF = document.getElementById('checkbox-lsf');
var smartFaderDB = document.getElementById('smartFaderDB');

checkboxVideo.checked = true;
checkboxExAmbience.checked = false;
checkboxExComments.checked = false;
checkboxExDialogs.checked = false;
checkboxLSF.checked = true;






function updateActiveStreams(){
	/// notify the modification of active streams
	smartFader.activeStreamsChanged();
}

function onCheckVideo() {
	console.debug("######### onCheckVideo: "+checkboxVideo.checked);
	if (checkboxVideo.checked) {
		mainAudioASD.active = true;
	} else {
		mainAudioASD.active = false;
	}
	updateActiveStreams();
}

function onCheckExAmbience() {
	console.debug("######### onCheckExAmbience: "+checkboxExAmbience.checked);
	//onCheckEx();
	if (checkboxExAmbience.checked) {
		extendedAmbienceASD.active = true;
	} else {
		extendedAmbienceASD.active = false;
	}
	updateActiveStreams();
}

function onCheckExComments() {
	console.debug("######### onCheckExComments: "+checkboxExComments.checked);
	//onCheckEx();
	if (checkboxExComments.checked) {
		extendedCommentsASD.active = true;
	} else {
		extendedCommentsASD.active = false;
	}
	updateActiveStreams();
}

function onCheckExDialogs() {
	console.debug("######### onCheckExDialogs: "+checkboxExDialogs.checked);
	//onCheckEx();
	if (checkboxExDialogs.checked) {
		extendedDialogsASD.active = true;
	} else {
		extendedDialogsASD.active = false;
	}
	updateActiveStreams();
}

function onCheckLSF() {
	console.debug("######### onCheckLSF: "+checkboxLSF.checked);
	if (checkboxLSF.checked) {
		controller.currentTime = videoPlayerMainMediaElement.currentTime;
		videoPlayerPipMediaElement.controller = controller;
		playerPip.startup();
		playerPip.setAutoPlay(false);
		playerPip.attachView(videoPlayerPipMediaElement);
		playerPip.attachSource(urlPip);
	} else {
		videoPlayerPipMediaElement.controller = null;
		playerPip.reset();
	}
}


/**
 * Callback when the dB slider changes
 */
smartFaderDB.addEventListener('input', function(){

	//console.log( "smartFaderDB = " + smartFaderDB.value ); 

	const valueFader = smartFaderDB.value;

	const minFader = smartFaderDB.min;
	const maxFader = smartFaderDB.max;

	//const [minValue, maxValue] = M4DPAudioModules.SmartFader.dBRange();
	const minValue = -60;
	const maxValue = 8;

	/// scale from GUI to DSP
	const value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );

	//console.log( "smartFaderDB (scaled) = " + value ); 

	/// sets the smart fader dB gain
	smartFader.dB = value;
})

setInterval(function(){
   	const isCompressed = smartFader.dynamicCompressionState;

	if( isCompressed === true){
		console.log( "compression active" ); 
	}	
	else{
		console.log( "compression inactive" ); 
	}
}, 500);

