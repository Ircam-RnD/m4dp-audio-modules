// fonctions de tests "unitaires"

//M4DPAudioModules.unittests.biquadtests.testBiquadNode();

//M4DPAudioModules.unittests.binauraltests.testBinauralNode();

//M4DPAudioModules.unittests.testCascadeNode();

//M4DPAudioModules.unittests.testBinaural();

//M4DPAudioModules.unittests.testHrtfFromSofaServer();

//M4DPAudioModules.unittests.sumdifftests.testSumDiffNode();

//M4DPAudioModules.unittests.transauraltests.testTransauralShuffler();

//M4DPAudioModules.unittests.multichanneltests.testMultiChannel();

//M4DPAudioModules.unittests.routingtests.testRouting();

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


var controller = new MediaPlayer.dependencies.MediaController();

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

/// create a 10-channel stream containing all audio materials
var channelMerger = audioContext.createChannelMerger(10);

// main video (stereo)
mainChannelSplitterNode.connect(channelMerger, 0, 0);
mainChannelSplitterNode.connect(channelMerger, 1, 1);

// extended audio ambience (5.1)
extendedChannelSplitterNode.connect(channelMerger, 0, 2);
extendedChannelSplitterNode.connect(channelMerger, 1, 3);
extendedChannelSplitterNode.connect(channelMerger, 2, 4);
extendedChannelSplitterNode.connect(channelMerger, 3, 5);
extendedChannelSplitterNode.connect(channelMerger, 4, 6);
extendedChannelSplitterNode.connect(channelMerger, 5, 7);

// extended audio comments (mono)
extendedChannelSplitterNode.connect(channelMerger, 6, 8);

// extended audio dialogs (mono)
extendedChannelSplitterNode.connect(channelMerger, 7, 9);

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
var streamSelector = new M4DPAudioModules.StreamSelector( audioContext, asdc );
var smartFader = new M4DPAudioModules.SmartFader( audioContext, asdc );
//var objectSpatialiserAndMixer = new M4DPAudioModules.ObjectSpatialiserAndMixer(audioContext);
//var noiseAdaptation = new M4DPAudioModules.NoiseAdaptation(audioContext);
var multichannelSpatialiser = new M4DPAudioModules.MultichannelSpatialiser( audioContext, asdc, 'multichannel' );
//var dialogEnhancement = new M4DPAudioModules.DialogEnhancement(audioContext);
var headphonesEqualization = new M4DPAudioModules.HeadphonesEqualization( audioContext );

{
	///@bug : the mainChannelSplitterNode MUST be connected to the AudioContext,
	/// otherwise the video wont read.
	/// so as a workaround, we just add a dummuy node, with 0 gain,
	/// to connect the mainChannelSplitterNode
	var uselessGain = audioContext.createGain();
	mainChannelSplitterNode.connect( uselessGain, 0, 0 );
	uselessGain.gain.value = 0.;
	uselessGain.connect( audioContext.destination, 0, 0 );
}

/*
/// test pour voir si on a du son dans les canaux extendedChannelSplitterNode
var oneGain = audioContext.createGain();
extendedChannelSplitterNode.connect( oneGain, 2, 0 );
oneGain.connect( audioContext.destination, 0, 0 );
*/

/// receives 4 ADSC with 10 channels in total
channelMerger.connect( streamSelector.input );

/// mute or unmute the inactive streams
/// (process 10 channels in total)
streamSelector.connect( smartFader.input );

smartFader.connect( multichannelSpatialiser.input );

/*

/// apply the smart fader 
/// (process 10 channels in total)
smartFader.connect( headphonesEqualization.input );

/// apply the headphones equalization
headphonesEqualization.connect( audioContext.destination );
*/

/// apply the multichannel spatialiser
multichannelSpatialiser.connect( audioContext.destination );


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
var checkboxEqualization = document.getElementById('checkbox-equalization');

checkboxVideo.checked = true;
checkboxExAmbience.checked = false;
checkboxExComments.checked = false;
checkboxExDialogs.checked = false;
checkboxLSF.checked = true;
checkboxEqualization.checked = false;

///@otodo : need to properly initialize the smartFader (slider) and other checkboxes

function updateActiveStreams(){
	/// notify the modification of active streams
	streamSelector.activeStreamsChanged();
	smartFader.activeStreamsChanged();
	multichannelSpatialiser.activeStreamsChanged();
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

function onCheckEqualization() {
	console.debug("######### onCheckEqualization: "+checkboxEqualization.checked);
	
	headphonesEqualization.eqPreset = "eq1";

	if (checkboxEqualization.checked) {
		headphonesEqualization.bypass = false;
	} else {
		headphonesEqualization.bypass = true;
	}
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

	var valueFader = smartFaderDB.value;

	var minFader = smartFaderDB.min;
	var maxFader = smartFaderDB.max;

	//const [minValue, maxValue] = M4DPAudioModules.SmartFader.dBRange();
	var minValue = -60;
	var maxValue = 8;

	/// scale from GUI to DSP
	var value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );

	//console.log( "smartFaderDB (scaled) = " + value ); 

	/// sets the smart fader dB gain
	smartFader.dB = value;
});

setInterval(function(){
	var isCompressed = smartFader.dynamicCompressionState;

	if( isCompressed === true){
		console.log( "compression active" );
	}
	else{
		console.log( "compression inactive" );
	}
}, 500);

