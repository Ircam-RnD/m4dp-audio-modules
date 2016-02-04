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


/// player pour la video principale
videoPlayerMainMediaElement			= document.getElementById('videoPlayerMain');
/// player pour la video LSF (langue des signes)
videoPlayerPipMediaElement 			= document.getElementById('videoPlayerPip');
/// player pour l'audio 5.1
playerAudioFiveDotOneMediaElement 	= document.getElementById('playerAudioFiveDotOne');
/// player pour l'audio description
playerAudioDescriptionMediaElement 	= document.getElementById('playerAudioDescription');


var context = new Dash.di.DashContext();

/*
/// les premières URLs fournies par DotScreen
var urlMain = "http://medias2.francetv.fr/innovation/media4D/m4dp-set1-LMDJ/manifest.mpd";
var urlPip = "http://medias2.francetv.fr/innovation/media4D/m4dp-set1-LMDJ/manifest-lsf.mpd";
var urlAudio = "http://medias2.francetv.fr/innovation/media4D/m4dp-set1-LMDJ/manifest-ad.mpd";
*/

var dashUrlAudioPrincipale  = 'http://videos-pmd.francetv.fr/innovation/media4D/m4d--LMDJ4-ondemand/manifest.mpd';
var dashUrlAudioDescription = 'http://videos-pmd.francetv.fr/innovation/media4D/m4d--LMDJ4-ondemand/manifest-ad.mpd';
var dashUrlFiveDotOne  		= 'http://videos-pmd.francetv.fr/innovation/media4D/m4d--LMDJ4-ondemand/manifest-mc.mpd'; /// L R C LFE Ls Rs ?
var dashUrlAllTogether 		= 'http://videos-pmd.francetv.fr/innovation/media4D/m4d--LMDJ4-ondemand/manifest-aud.mpd';
var dashUrlLsf 				= 'http://videos-pmd.francetv.fr/innovation/media4D/m4d--LMDJ4-ondemand/manifest-lsf.mpd';

var urlMain 			= dashUrlAudioPrincipale;
var urlPip 				= dashUrlLsf;
var urlAudioFiveDotOne 	= dashUrlFiveDotOne;
var urlAudioDescription	= dashUrlAudioDescription;

//==============================================================================
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

var playerAudioFiveDotOne = new MediaPlayer(context);
playerAudioFiveDotOne.startup();
playerAudioFiveDotOne.setAutoPlay(false);
playerAudioFiveDotOne.attachView(playerAudioFiveDotOneMediaElement);
playerAudioFiveDotOne.getDebug().setLogToBrowserConsole(false);

var playerAudioDescription = new MediaPlayer(context);
playerAudioDescription.startup();
playerAudioDescription.setAutoPlay(false);
playerAudioDescription.attachView(playerAudioDescriptionMediaElement);
playerAudioDescription.getDebug().setLogToBrowserConsole(false);

var controller = new MediaPlayer.dependencies.MediaController();

//dumpObject( playerMain );

videoPlayerMainMediaElement.controller 			= controller;
videoPlayerPipMediaElement.controller 			= controller;
playerAudioFiveDotOneMediaElement.controller 	= controller;
playerAudioDescriptionMediaElement.controller 	= controller;

var audioContext = new (window.AudioContext || window.webkitAudioContext)();
console.debug("######### audioContext: " + audioContext);

//==============================================================================
var audioSourceMain 	 	= audioContext.createMediaElementSource( videoPlayerMainMediaElement );
var audioSourceFiveDotOne  	= audioContext.createMediaElementSource( playerAudioFiveDotOneMediaElement );
var audioSourceDescription	= audioContext.createMediaElementSource( playerAudioDescriptionMediaElement );
///@todo : audioSource pour les dialogues ?

/// create a 10-channel stream containing all audio materials
var channelMerger = audioContext.createChannelMerger(10);

var channelSplitterMain 		= audioContext.createChannelSplitter( 2 );
var channelSplitterFiveDotOne	= audioContext.createChannelSplitter( 6 );
var channelSplitterDescription 	= audioContext.createChannelSplitter( 1 );

audioSourceMain.connect( channelSplitterMain );
audioSourceFiveDotOne.connect( channelSplitterFiveDotOne );
audioSourceDescription.connect( channelSplitterDescription );

channelSplitterMain.connect( channelMerger, 0, 0 );
channelSplitterMain.connect( channelMerger, 1, 1 );

channelSplitterFiveDotOne.connect( channelMerger, 0, 2 );
channelSplitterFiveDotOne.connect( channelMerger, 1, 3 );
channelSplitterFiveDotOne.connect( channelMerger, 2, 4 );
channelSplitterFiveDotOne.connect( channelMerger, 3, 5 );
channelSplitterFiveDotOne.connect( channelMerger, 4, 6 );
channelSplitterFiveDotOne.connect( channelMerger, 5, 7 );

channelSplitterDescription.connect( channelMerger, 0, 8 );

//==============================================================================
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

//==============================================================================
// M4DPAudioModules
var streamSelector = new M4DPAudioModules.StreamSelector( audioContext, asdc );
var smartFader = new M4DPAudioModules.SmartFader( audioContext, asdc );
var objectSpatialiserAndMixer = new M4DPAudioModules.ObjectSpatialiserAndMixer( audioContext, asdc, 'binaural' );
//var noiseAdaptation = new M4DPAudioModules.NoiseAdaptation(audioContext);
var multichannelSpatialiser = new M4DPAudioModules.MultichannelSpatialiser( audioContext, asdc, 'binaural' );
//var dialogEnhancement = new M4DPAudioModules.DialogEnhancement(audioContext);

{
	///@bug : the channelSplitterMain MUST be connected to the AudioContext,
	/// otherwise the video wont read.
	/// so as a workaround, we just add a dummuy node, with 0 gain,
	/// to connect the channelSplitterMain
	var uselessGain = audioContext.createGain();
	channelSplitterMain.connect( uselessGain, 0, 0 );
	uselessGain.gain.value = 0.;
	uselessGain.connect( audioContext.destination, 0, 0 );
}

/*
{
	/// bout de code pour tester la reception des flux DASH

	var extendedChannelSplitterNode2 = audioContext.createChannelSplitter(10);
	channelMerger.connect( extendedChannelSplitterNode2 );

	var channelMerger2 = audioContext.createChannelMerger(2);

	extendedChannelSplitterNode2.connect( channelMerger2, 8, 0 );

	channelMerger2.connect( audioContext.destination );
}
*/


/// receives 4 ADSC with 10 channels in total
channelMerger.connect( streamSelector._input );

/// mute or unmute the inactive streams
/// (process 10 channels in total)
streamSelector.connect( smartFader._input );

smartFader.connect( multichannelSpatialiser._input );

/// apply the multichannel spatialiser
multichannelSpatialiser.connect( audioContext.destination );



/// prepare the sofa catalog of HRTF
prepareSofaCatalog();

playerMain.attachSource( urlMain );
playerPip.attachSource( urlPip );
playerAudioFiveDotOne.attachSource( urlAudioFiveDotOne );
playerAudioDescription.attachSource( urlAudioDescription );

playerMain.play();
playerPip.play();
playerAudioFiveDotOne.play();
playerAudioDescription.play();

var checkboxVideo = document.getElementById('checkbox-video');
var checkboxExAmbience = document.getElementById('checkbox-extended-ambience');
var checkboxExComments = document.getElementById('checkbox-extended-comments');
var checkboxExDialogs = document.getElementById('checkbox-extended-dialogs');
var checkboxLSF = document.getElementById('checkbox-lsf');
var smartFaderDB = document.getElementById('smartFaderDB');
var checkboxEqualization = document.getElementById('checkbox-equalization');
var yawFader = document.getElementById('yawFader');
var azimFader = document.getElementById('azimFader');
var elevFader = document.getElementById('elevFader');
var gainOffsetFader = document.getElementById('gainOffset');

checkboxVideo.checked 			= true;
checkboxExAmbience.checked 		= false;
checkboxExComments.checked 		= false;
checkboxExDialogs.checked 		= false;
checkboxLSF.checked 			= true;
checkboxEqualization.checked 	= false;

initializeSmartFader();
onCheckVideo();
onCheckExAmbience();
onCheckExComments();
onCheckEqualization();
onCheckExDialogs();
onCheckLSF();

prepareModeSelectionMenu();

//==============================================================================
function setElementVisibility( elementId, visibility ){

	if( visibility === true ){
		document.getElementById(elementId).style.visibility = "";
	}
	else{
		document.getElementById(elementId).style.visibility = "hidden";
	}
}

//==============================================================================
function prepareModeSelectionMenu(){
	var $menu = document.querySelector('#spatialisation-mode-menu');

	$menu.onchange = function () 
	{
		/// retrieve selected mode
        var selection = $menu.value;

        if( selection === 'binaural' ){
			setElementVisibility('checkbox-equalization', true);
			setElementVisibility('label-equalization', true);
        }
        else{
			setElementVisibility('checkbox-equalization', false);
			setElementVisibility('label-equalization', false);
        }

        if( selection === 'multichannel' ){
        	setElementVisibility('yawFader', false);
        	setElementVisibility('label-yaw', false);
        	setElementVisibility('gainOffset', false);
        	setElementVisibility('label-gain-offset', false);
        	setElementVisibility('hrtf-selector', false);
        }
        else{
        	setElementVisibility('yawFader', true);
        	setElementVisibility('label-yaw', true);
        	setElementVisibility('gainOffset', true);
        	setElementVisibility('label-gain-offset', true);
        	setElementVisibility('hrtf-selector', true);
        }

        multichannelSpatialiser.outputType = selection;
        objectSpatialiserAndMixer.outputType = selection;
    };

	$option = document.createElement('option');
	$option.textContent = 'binaural';
    $menu.add($option);

	$option = document.createElement('option');
	$option.textContent = 'transaural';
    $menu.add($option);

    $option = document.createElement('option');
	$option.textContent = 'multichannel';
    $menu.add($option);
}

//==============================================================================
function prepareSofaCatalog(){
	
	// HRTF set selection menu
    var $hrtfSet = document.querySelector('#hrtf-selector');
    $hrtfSet.onchange = function ()
    {
		/// sets the color to red while loading
		$hrtfSet.style.backgroundColor="rgba(255, 0, 0, 0.7)";
        
        /// retrieve the URL selected in the menu 
        var url = $hrtfSet.value;

        /// load the URL in the spatialiser
        multichannelSpatialiser.loadHrtfSet( url )
        .then( function()
        {
			/// reset the color after loading
			$hrtfSet.style.backgroundColor="";
		});

		objectSpatialiserAndMixer.loadHrtfSet( url );        
    };

    /// retrieves the catalog of URLs from the OpenDAP server
	var serverDataBase = new M4DPAudioModules.binaural.sofa.ServerDataBase();
	serverDataBase
         .loadCatalogue()
         .then( function () {
             var urls = serverDataBase.getUrls({
                 convention: 'HRIR',
                 equalisation: 'compensated',
                 sampleRate: audioContext.sampleRate,
             });

             var $option;
             urls.forEach( function (url) {
                 $option = document.createElement('option');
                 $option.textContent = url;
                 $hrtfSet.add($option);
             });

             defaultUrl = urls.findIndex( function (url) {
                 return url.match('1076');
             });
             $hrtfSet.value = urls[defaultUrl];
             $hrtfSet.onchange();

             return urls;
         });
}

//==============================================================================
function updateActiveStreams(){
	/// notify the modification of active streams
	streamSelector.activeStreamsChanged();
	smartFader.activeStreamsChanged();
	multichannelSpatialiser.activeStreamsChanged();
	objectSpatialiserAndMixer.activeStreamsChanged();
}

function onCheckVideo() {
	//console.debug("######### onCheckVideo: "+checkboxVideo.checked);
	if (checkboxVideo.checked) {
		mainAudioASD.active = true;
	} else {
		mainAudioASD.active = false;
	}
	updateActiveStreams();
}

function onCheckExAmbience() {
	//console.debug("######### onCheckExAmbience: "+checkboxExAmbience.checked);
	//onCheckEx();
	if (checkboxExAmbience.checked) {
		extendedAmbienceASD.active = true;
	} else {
		extendedAmbienceASD.active = false;
	}
	updateActiveStreams();
}

function onCheckExComments() {
	//console.debug("######### onCheckExComments: "+checkboxExComments.checked);
	//onCheckEx();
	if (checkboxExComments.checked) {
		extendedCommentsASD.active = true;
	} else {
		extendedCommentsASD.active = false;
	}
	updateActiveStreams();
}

function onCheckExDialogs() {
	//console.debug("######### onCheckExDialogs: "+checkboxExDialogs.checked);
	//onCheckEx();
	if (checkboxExDialogs.checked) {
		extendedDialogsASD.active = true;
	} else {
		extendedDialogsASD.active = false;
	}
	updateActiveStreams();
}

function onCheckEqualization() {
	//console.debug("######### onCheckEqualization: "+checkboxEqualization.checked);
	
	multichannelSpatialiser.eqPreset = "eq1";

	if (checkboxEqualization.checked) {
		multichannelSpatialiser.bypassHeadphoneEqualization( false );
	} else {
		multichannelSpatialiser.bypassHeadphoneEqualization( true );
	}
}

function onCheckLSF() {
	//console.debug("######### onCheckLSF: "+checkboxLSF.checked);
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

//==============================================================================
function initializeSmartFader(){

	var minFader = parseFloat( smartFaderDB.min );
	var maxFader = parseFloat( smartFaderDB.max );

	/// default value in dB
	var value = 0.0;

	//const [minValue, maxValue] = M4DPAudioModules.SmartFader.dBRange();
	var minValue = -60;
	var maxValue = 8;

	/// scale from dB to GUI
	var valueFader = M4DPAudioModules.utilities.scale( value, minValue, maxValue, minFader, maxFader );

	smartFaderDB.value = valueFader;
}

//==============================================================================
/**
 * Callback when the dB slider changes
 */
smartFaderDB.addEventListener('input', function(){

	var valueFader = smartFaderDB.value;

	var minFader = parseFloat( smartFaderDB.min );
	var maxFader = parseFloat( smartFaderDB.max );

	//const [minValue, maxValue] = M4DPAudioModules.SmartFader.dBRange();
	var minValue = -60;
	var maxValue = 8;

	/// scale from GUI to DSP
	var value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );

	document.getElementById('label-smart-fader').textContent = 'Smart Fader = ' + Math.round(value).toString() + ' dB';

	/// sets the smart fader dB gain
	smartFader.dB = value;
});

//==============================================================================
gainOffsetFader.addEventListener('input', function(){

	var value = gainOffsetFader.value;
	/// this is in [-12 12] range

	document.getElementById('label-gain-offset').textContent = 'Gain Offset = ' + Math.round(value).toString() + ' dB';

	/// un gain d’offset afin de maintenir un niveau subjectif apres l’enclenchement du process de spatialisation

	multichannelSpatialiser.offsetGain = value;
	objectSpatialiserAndMixer.offsetGain = value;
});

//==============================================================================
/**
 * Callback when the yaw slider changes
 */
yawFader.addEventListener('input', function(){

	var valueFader = yawFader.value;

	document.getElementById('label-yaw').textContent = 'Listener yaw = ' + valueFader;

	multichannelSpatialiser.listenerYaw = valueFader;
	objectSpatialiserAndMixer.listenerYaw = valueFader;
});

//==============================================================================
/**
 * Callback when the azim slider changes
 */
azimFader.addEventListener('input', function(){

	var valueFader = azimFader.value;

	document.getElementById('label-azim').textContent = 'azim = ' + valueFader;

	objectSpatialiserAndMixer.setCommentaryAzimuth( valueFader );
});

//==============================================================================
/**
 * Callback when the azim slider changes
 */
elevFader.addEventListener('input', function(){

	var valueFader = elevFader.value;

	document.getElementById('label-elev').textContent = 'elev = ' + valueFader;

	objectSpatialiserAndMixer.setCommentaryElevation( valueFader );
});

//==============================================================================
setInterval(function(){
	var isCompressed = smartFader.dynamicCompressionState;

	if( isCompressed === true){
		document.getElementById('label-compression').style.color = "rgba(255, 0, 0, 0.7)";
	}
	else{
		document.getElementById('label-compression').style.color = "rgba(255, 255, 255, 0.7)";
	}
}, 500);

