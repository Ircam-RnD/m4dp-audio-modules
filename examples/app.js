// fonctions de tests "unitaires"

//M4DPAudioModules.unittests.biquadtests.testBiquadNode();
//M4DPAudioModules.unittests.binauraltests.testBinauralNode();
//M4DPAudioModules.unittests.testCascadeNode();
//M4DPAudioModules.unittests.analysistests.testAnalysisNode();
//M4DPAudioModules.unittests.phonetests.testPhoneNode();
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

function prepareMediaPlayer( dashContext ){
    var player = new MediaPlayer( dashContext );
    player.startup();
    player.setAutoPlay(false);
    player.attachView(videoPlayerMainMediaElement);
    player.getDebug().setLogToBrowserConsole(false);

    return player;
}


//==============================================================================
/// player pour la video principale
var videoPlayerMainMediaElement           = document.getElementById('videoPlayerMain');
/// player pour la video LSF (langue des signes)
var videoPlayerPipMediaElement            = document.getElementById('videoPlayerPip');
/// player pour l'audio 5.1
var playerAudioFiveDotOneMediaElement     = document.getElementById('playerAudioFiveDotOne');
/// player pour l'audio description
var playerAudioDescriptionMediaElement    = document.getElementById('playerAudioDescription');
/// player pour les dialgoues
var playerDialogueMediaElement            = document.getElementById('playerDialogue');


var context = new Dash.di.DashContext();

//==============================================================================
/*
/// les premières URLs fournies par DotScreen
var urlMain = "http://medias2.francetv.fr/innovation/media4D/m4dp-set1-LMDJ/manifest.mpd";
var urlPip = "http://medias2.francetv.fr/innovation/media4D/m4dp-set1-LMDJ/manifest-lsf.mpd";
var urlAudio = "http://medias2.francetv.fr/innovation/media4D/m4dp-set1-LMDJ/manifest-ad.mpd";
*/

var dashUrlAudioPrincipale     = 'http://videos-pmd.francetv.fr/innovation/media4D/m4d-LMDJ-ondemand-3lsf/manifest.mpd';
var dashUrlAudioDescription    = 'http://videos-pmd.francetv.fr/innovation/media4D/m4d-LMDJ-ondemand-3lsf/manifest-ad.mpd';
var dashUrlFiveDotOne          = 'http://videos-pmd.francetv.fr/innovation/media4D/m4d-LMDJ-ondemand-3lsf/manifest-ea3.mpd'; /// L R C LFE Ls Rs ?
var dashUrlDial                = 'http://videos-pmd.francetv.fr/innovation/media4D/m4d-LMDJ-ondemand-3lsf/manifest-di.mpd';
var dashUrlLsf                 = 'http://videos-pmd.francetv.fr/innovation/media4D/m4d-LMDJ-ondemand-3lsf/manifest-lsf.mpd';

var urlMain                = dashUrlAudioPrincipale;
var urlPip                 = dashUrlLsf;
var urlAudioFiveDotOne     = dashUrlFiveDotOne;
var urlAudioDescription    = dashUrlAudioDescription;
var urlDialogue            = dashUrlDial;

//==============================================================================
var playerMain              = prepareMediaPlayer( context );
var playerPip               = prepareMediaPlayer( context );
var playerAudioFiveDotOne   = prepareMediaPlayer( context );
var playerAudioDescription  = prepareMediaPlayer( context );
var playerDialogue          = prepareMediaPlayer( context );

/*
var playerMain = new MediaPlayer( context );
playerMain.startup();
playerMain.setAutoPlay(false);
playerMain.attachView(videoPlayerMainMediaElement);
playerMain.getDebug().setLogToBrowserConsole(false);

var playerPip = new MediaPlayer( context );
playerPip.startup();
playerPip.setAutoPlay(false);
playerPip.attachView(videoPlayerMainMediaElement);
playerPip.getDebug().setLogToBrowserConsole(false);

var playerAudioFiveDotOne = new MediaPlayer( context );
playerAudioFiveDotOne.startup();
playerAudioFiveDotOne.setAutoPlay(false);
playerAudioFiveDotOne.attachView(videoPlayerMainMediaElement);
playerAudioFiveDotOne.getDebug().setLogToBrowserConsole(false);

var playerAudioDescription = new MediaPlayer( context );
playerAudioDescription.startup();
playerAudioDescription.setAutoPlay(false);
playerAudioDescription.attachView(videoPlayerMainMediaElement);
playerAudioDescription.getDebug().setLogToBrowserConsole(false);

var playerDialogue = new MediaPlayer( context );
playerDialogue.startup();
playerDialogue.setAutoPlay(false);
playerDialogue.attachView(videoPlayerMainMediaElement);
playerDialogue.getDebug().setLogToBrowserConsole(false);
*/

//dumpObject( playerMain );

var controller = new MediaController();

videoPlayerMainMediaElement.controller           = controller;
videoPlayerPipMediaElement.controller            = controller;
playerAudioFiveDotOneMediaElement.controller     = controller;
playerAudioDescriptionMediaElement.controller    = controller;
playerDialogueMediaElement.controller            = controller;

var audioContext = new (window.AudioContext || window.webkitAudioContext)();
//console.debug("######### audioContext: " + audioContext);

//==============================================================================
// check if the DASH streams are ready
var audioMainReady          = playerMain.isReady();
var audioFiveDotOneReady    = playerAudioFiveDotOne.isReady();
var audioDescriptionReady   = playerAudioDescription.isReady();
var audioDialogReady        = playerDialogue.isReady();

//==============================================================================
var audioSourceMain          = audioContext.createMediaElementSource( videoPlayerMainMediaElement );
var audioSourceFiveDotOne    = audioContext.createMediaElementSource( playerAudioFiveDotOneMediaElement );
var audioSourceDescription   = audioContext.createMediaElementSource( playerAudioDescriptionMediaElement );
var audioSourceDialogue      = audioContext.createMediaElementSource( playerDialogueMediaElement );

/// create a 10-channel stream containing all audio materials
var channelMerger = audioContext.createChannelMerger(10);

var channelSplitterMain         = audioContext.createChannelSplitter( 2 );
var channelSplitterFiveDotOne   = audioContext.createChannelSplitter( 6 );
var channelSplitterDescription  = audioContext.createChannelSplitter( 1 );
var channelSplitterDialogue     = audioContext.createChannelSplitter( 1 );

audioSourceMain.connect( channelSplitterMain );
audioSourceFiveDotOne.connect( channelSplitterFiveDotOne );
audioSourceDescription.connect( channelSplitterDescription );
audioSourceDialogue.connect( channelSplitterDialogue );

channelSplitterMain.connect( channelMerger, 0, 0 );
channelSplitterMain.connect( channelMerger, 1, 1 );

channelSplitterFiveDotOne.connect( channelMerger, 0, 2 );
channelSplitterFiveDotOne.connect( channelMerger, 1, 3 );
channelSplitterFiveDotOne.connect( channelMerger, 2, 4 );
channelSplitterFiveDotOne.connect( channelMerger, 3, 5 );
channelSplitterFiveDotOne.connect( channelMerger, 4, 6 );
channelSplitterFiveDotOne.connect( channelMerger, 5, 7 );

channelSplitterDescription.connect( channelMerger, 0, 8 );

channelSplitterDialogue.connect( channelMerger, 0, 9 );

//==============================================================================
// Configure the AudioStreamDescription according to the EBU Core file(s)
var mainAudioASD = new M4DPAudioModules.AudioStreamDescription(
        type = "Stereo",
        active = true,
        loudness = -22.1,
        maxTruePeak = -5.1,
        dialog = true,
        ambiance = true,
        commentary = false);
var extendedAmbienceASD = new M4DPAudioModules.AudioStreamDescription(
        type = "MultiWithLFE",
        active = false,
        loudness = -19.6,
        maxTruePeak = -5.9,
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
        loudness = -22.7,
        maxTruePeak = -6.1,
        dialog = true,
        ambiance = false,
        commentary = false);

var asdc = new M4DPAudioModules.AudioStreamDescriptionCollection(
        [mainAudioASD, extendedAmbienceASD, extendedCommentsASD, extendedDialogsASD]
        );

//==============================================================================
// M4DPAudioModules

/// connect either the multichannel spatializer or the object spatializer
var ModulesConfiguration =
{
    kMultichannelSpatialiser : 0,
    kObjectSpatialiserAndMixer : 1
};

var config = ModulesConfiguration.kMultichannelSpatialiser;

var streamSelector  = new M4DPAudioModules.StreamSelector( audioContext, asdc );
var smartFader      = new M4DPAudioModules.SmartFader( audioContext, asdc );
var receiverMix     = new M4DPAudioModules.ReceiverMix( audioContext, asdc );
//var noiseAdaptation = new M4DPAudioModules.NoiseAdaptation(audioContext);
//var dialogEnhancement = new M4DPAudioModules.DialogEnhancement(audioContext);    
var multichannelSpatialiser = new M4DPAudioModules.MultichannelSpatialiser( audioContext, asdc, 'binaural' );
var objectSpatialiserAndMixer = new M4DPAudioModules.ObjectSpatialiserAndMixer( audioContext, asdc, 'binaural' );

//==============================================================================    
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

/// WAA connections
{
    /// receives 4 ADSC with 10 channels in total
    channelMerger.connect( streamSelector._input );

    /// mute or unmute the inactive streams
    /// (process 10 channels in total)
    streamSelector.connect( smartFader._input );
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

//==============================================================================
//updateWAAConnections();

//==============================================================================
playerMain.attachSource( urlMain );
playerPip.attachSource( urlPip );
playerAudioFiveDotOne.attachSource( urlAudioFiveDotOne );
playerAudioDescription.attachSource( urlAudioDescription );
playerDialogue.attachSource( urlDialogue );

playerMain.play();
playerPip.play();
playerAudioFiveDotOne.play();
playerAudioDescription.play();
playerDialogue.play();

//==============================================================================
// Retrieves the controllers from the GUI
var checkboxVideo = document.getElementById('checkbox-video');
var checkboxExAmbience = document.getElementById('checkbox-extended-ambience');
var checkboxExComments = document.getElementById('checkbox-extended-comments');
var checkboxExDialogs = document.getElementById('checkbox-extended-dialogs');
var checkboxLSF = document.getElementById('checkbox-lsf');
var sliderSmartFader = document.getElementById('slider-smart-fader');
var sliderSmartFaderRatio = document.getElementById('slider-smart-fader-ratio');
var sliderSmartFaderAttack = document.getElementById('slider-smart-fader-attack');
var sliderSmartFaderRelease = document.getElementById('slider-smart-fader-release');
var checkboxHeadphonesEqualization = document.getElementById('checkbox-headphones-equalization');
var sliderGainOffset = document.getElementById('slider-gain-offset');
var sliderListenerYaw = document.getElementById('slider-listener-yaw');
var sliderAzimComments = document.getElementById('slider-azim-comments');
var sliderElevComments = document.getElementById('slider-elev-comments');
var sliderDistComments = document.getElementById('slider-dist-comments');
var sliderAzimDialog = document.getElementById('slider-azim-dialog');
var sliderElevDialog = document.getElementById('slider-elev-dialog');
var sliderDistDialog = document.getElementById('slider-dist-dialog');
var sliderTrimMain = document.getElementById('slider-trim-main');
var sliderTrimAmbiance = document.getElementById('slider-trim-ambiance');
var sliderTrimComments = document.getElementById('slider-trim-comments');
var sliderTrimDialog = document.getElementById('slider-trim-dialog');
var sliderReceiverMixN = document.getElementById('slider-receiver-mix-N');
var sliderReceiverMixX = document.getElementById('slider-receiver-mix-X');

//==============================================================================
// initialize the GUI stuffs
initializeSliders();
initializeCheckBoxes();
initializeDropDownMenus();

//==============================================================================
function updateWAAConnections(){
    
    smartFader.disconnect();
    receiverMix.disconnect();
    multichannelSpatialiser.disconnect();
    objectSpatialiserAndMixer.disconnect();

    var processor = undefined;

    if( config == ModulesConfiguration.kMultichannelSpatialiser ){
        processor = multichannelSpatialiser;       
    }
    else if( config == ModulesConfiguration.kObjectSpatialiserAndMixer ){
        processor = objectSpatialiserAndMixer;
    }
    else{
        throw new Error( "Invalid configuration" );
    }
    
    smartFader.connect( processor._input );

    /// apply the multichannel spatialiser
    processor.connect( audioContext.destination );

    var $hrtfSet = document.querySelector('#hrtf-selector');
    if( $hrtfSet.onchange != null ){
        $hrtfSet.onchange();
    }
}

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
        /// retrieve the selected mode
        var selection = $menu.value;

        var visibility = true;
        
        if( selection === 'binaural' ){
            visibility = true;
        }
        else{
            visibility = false;
        }
        setElementVisibility('checkbox-headphones-equalization', visibility);
        setElementVisibility('label-headphones-equalization', visibility);


        if( selection === 'multichannel' ){
            visibility = false;
        }
        else{
            visibility = true;
        }
        setElementVisibility('slider-listener-yaw', visibility);
        setElementVisibility('label-listener-yaw', visibility);
        setElementVisibility('slider-gain-offset', visibility);
        setElementVisibility('label-gain-offset', visibility);
        setElementVisibility('hrtf-selector', visibility);


        multichannelSpatialiser.outputType   = selection;
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

    $menu.value = 'binaural';
    $menu.onchange();
}

//==============================================================================
function prepareConfiguration(){
    // configuration set selection menu
    var $menu = document.querySelector('#configuration-selector');

    $menu.onchange = function ()
    {
        /// retrieve selected mode
        var selection = $menu.value;

        var displayDialogPosition = false;

        if( selection === 'Multichannel Spatialiser' ){
            displayDialogPosition = false;
            config = ModulesConfiguration.kMultichannelSpatialiser;
        }
        else if( selection === 'Object Spatialiser and Mixer' ){
            displayDialogPosition = true;
            config = ModulesConfiguration.kObjectSpatialiserAndMixer;
        }

        setElementVisibility('slider-azim-comments', displayDialogPosition);
        setElementVisibility('label-azim-comments', displayDialogPosition);
        setElementVisibility('slider-elev-comments', displayDialogPosition);
        setElementVisibility('label-elev-comments', displayDialogPosition);
        setElementVisibility('slider-dist-comments', displayDialogPosition);
        setElementVisibility('label-dist-comments', displayDialogPosition);

        setElementVisibility('slider-azim-dialog', displayDialogPosition);
        setElementVisibility('label-azim-dialog', displayDialogPosition);
        setElementVisibility('slider-elev-dialog', displayDialogPosition);
        setElementVisibility('label-elev-dialog', displayDialogPosition);
        setElementVisibility('slider-dist-dialog', displayDialogPosition);
        setElementVisibility('label-dist-dialog', displayDialogPosition);

        /// and update the WAA connections
        updateWAAConnections();
    };

    $option = document.createElement('option');
    $option.textContent = 'Multichannel Spatialiser';
    $menu.add($option);

    $option = document.createElement('option');
    $option.textContent = 'Object Spatialiser and Mixer';
    $menu.add($option);
    
    $menu.value = 'Multichannel Spatialiser';
    $menu.onchange();
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

        var currentProcessor = undefined;
        if( config == ModulesConfiguration.kMultichannelSpatialiser ){
            currentProcessor = multichannelSpatialiser;
        }
        else{
            currentProcessor = objectSpatialiserAndMixer;
        }

        /// load the URL in the spatialiser
        currentProcessor.loadHrtfSet( url )
        .then( function()
        {
            /// reset the color after loading
            $hrtfSet.style.backgroundColor="";

            objectSpatialiserAndMixer._updateCommentaryPosition();
        });
    };

    if( $hrtfSet.options.length === 0 ){

        /// populate the menu

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
                     return url.match('1018');
                 });
                 $hrtfSet.value = urls[defaultUrl];
                 $hrtfSet.onchange();

                 return urls;
             })
             .catch( function (){
                 /// failed to access the catalog (maybe unauthorized IP)
                 /// just use the hard-coded sofa data

                 console.log('could not access bili2.ircam.fr...');

                var currentProcessor = undefined;
                if( config == ModulesConfiguration.kMultichannelSpatialiser ){
                    currentProcessor = multichannelSpatialiser;
                }
                else{
                    currentProcessor = objectSpatialiserAndMixer;
                }

                 sofaUrl = currentProcessor._virtualSpeakers.getFallbackUrl();

                 var $option;
                 $option = document.createElement('option');
                 $option.textContent = sofaUrl;
                 $hrtfSet.add($option);
                 
                 $hrtfSet.value = sofaUrl;
                 $hrtfSet.onchange();

                 return sofaUrl;
             });
     }
}

//==============================================================================
function updateActiveStreams(){
    /// notify the modification of active streams
    streamSelector.activeStreamsChanged();
    smartFader.activeStreamsChanged();
    receiverMix.activeStreamsChanged();
    multichannelSpatialiser.activeStreamsChanged();
    objectSpatialiserAndMixer.activeStreamsChanged();
}

function updateStreamsTrim(){
    /// notify the modification of trim of streams
    streamSelector.streamsTrimChanged();    
}

//==============================================================================
function onCheckTrimBypass(){

    var checkbox = document.getElementById('checkbox-trim-bypass');

    if (checkbox.checked) {
        streamSelector.bypass = true;
    } else {
        streamSelector.bypass = false;
    }
}

function onCheckSmartFaderBypass(){

    var checkbox = document.getElementById('checkbox-smart-fader-bypass');

    if (checkbox.checked) {
        smartFader.bypass = true;
    } else {
        smartFader.bypass = false;
    }
}

function onCheckReceiverMixBypass(){

    var checkbox = document.getElementById('checkbox-receiver-mix-bypass');

    if (checkbox.checked) {
        receiverMix.bypass = true;
    } else {
        receiverMix.bypass = false;
    }
}

//==============================================================================
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
    //console.debug("######### onCheckEqualization: "+checkboxHeadphonesEqualization.checked);
    
    multichannelSpatialiser.eqPreset = "eq1";

    if (checkboxHeadphonesEqualization.checked) {
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
function initializeDropDownMenus(){

    prepareConfiguration();

    /// prepare the sofa catalog of HRTF
    prepareSofaCatalog();

    prepareModeSelectionMenu();
}

//==============================================================================
function initializeCheckBoxes(){

    checkboxVideo.checked           = true;
    checkboxExAmbience.checked      = false;
    checkboxExComments.checked      = false;
    checkboxExDialogs.checked       = false;
    checkboxLSF.checked             = true;
    checkboxHeadphonesEqualization.checked    = false;

    onCheckVideo();
    onCheckExAmbience();
    onCheckExComments();
    onCheckEqualization();
    onCheckExDialogs();
    onCheckLSF();
}

//==============================================================================
function initializeSliders(){

    /// make sure the sliders are properly initialized, with scaled values
    sliderSmartFader.value          = smartFader.getdBForGui( sliderSmartFader );
    sliderSmartFaderRatio.value     = smartFader.getCompressionRatioForGui( sliderSmartFaderRatio );
    sliderSmartFaderAttack.value    = smartFader.getAttackTimeForGui( sliderSmartFaderAttack );
    sliderSmartFaderRelease.value   = smartFader.getReleaseTimeForGui( sliderSmartFaderRelease );

    sliderTrimMain.value        = 0;
    sliderTrimAmbiance.value    = 0;
    sliderTrimComments.value    = 0;
    sliderTrimDialog.value      = 0;

    sliderReceiverMixN.value = receiverMix.getThresholdForCommentaryFromGui( sliderReceiverMixN );
    sliderReceiverMixX.value = receiverMix.getThresholdForProgrammeFromGui( sliderReceiverMixX );

    sliderAzimComments.value = 0;
    sliderElevComments.value = 0;
    sliderDistComments.value = 1;

    sliderAzimDialog.value = 0;
    sliderElevDialog.value = 0;
    sliderDistDialog.value = 1;
}

//==============================================================================
/**
 * Callback when the Receiver-Mix slider changes
 */
sliderReceiverMixN.addEventListener('input', function(){

    var value = receiverMix.setThresholdForCommentaryFromGui( sliderReceiverMixN );

    document.getElementById('label-receiver-mix-N').textContent = 'N = ' + Math.round(value).toString() + ' dB (gate for comments)';
});

sliderReceiverMixX.addEventListener('input', function(){

    var value = receiverMix.setThresholdForProgrammeFromGui( sliderReceiverMixX );

    document.getElementById('label-receiver-mix-X').textContent = 'X = ' + Math.round(value).toString() + ' dB (gate for program)';
});

//==============================================================================
/**
 * Callback when the trim slider changes
 */
sliderTrimMain.addEventListener('input', function(){

    var value = mainAudioASD.setTrimFromGui( sliderTrimMain );

    updateStreamsTrim();

    document.getElementById('label-trim-main').textContent = 'Main Audio = ' + Math.round(value).toString() + ' dB';
});

sliderTrimAmbiance.addEventListener('input', function(){

    var value = extendedAmbienceASD.setTrimFromGui( sliderTrimAmbiance );

    updateStreamsTrim();

    document.getElementById('label-trim-ambiance').textContent = 'Extended ambiance = ' + Math.round(value).toString() + ' dB';
});

sliderTrimComments.addEventListener('input', function(){

    var value = extendedCommentsASD.setTrimFromGui( sliderTrimComments );

    updateStreamsTrim();

    document.getElementById('label-trim-comments').textContent = 'Extended comments = ' + Math.round(value).toString() + ' dB';
});

sliderTrimDialog.addEventListener('input', function(){

    var value = extendedDialogsASD.setTrimFromGui( sliderTrimDialog );

    updateStreamsTrim();

    document.getElementById('label-trim-dialog').textContent = 'Extended dialog = ' + Math.round(value).toString() + ' dB';
});

//==============================================================================
/**
 * Callback when the dB slider changes
 */
sliderSmartFader.addEventListener('input', function(){

    var value = smartFader.setdBFromGui( sliderSmartFader );

    document.getElementById('label-smart-fader').textContent = 'Smart Fader = ' + Math.round(value).toString() + ' dB';
});

//==============================================================================
sliderGainOffset.addEventListener('input', function(){

    var value = parseFloat( sliderGainOffset.value );
    /// this is in [-12 12] range

    document.getElementById('label-gain-offset').textContent = 'Gain Offset = ' + Math.round(value).toString() + ' dB';

    /// un gain d’offset afin de maintenir un niveau subjectif apres l’enclenchement du process de spatialisation

    multichannelSpatialiser.offsetGain   = value;
    objectSpatialiserAndMixer.offsetGain = value;
});

//==============================================================================
/**
 * Callback when the yaw slider changes
 */
sliderListenerYaw.addEventListener('input', function(){

    var valueFader = parseFloat( sliderListenerYaw.value );

    document.getElementById('label-listener-yaw').textContent = 'Listener yaw = ' + valueFader;

    multichannelSpatialiser.listenerYaw   = valueFader;
    objectSpatialiserAndMixer.listenerYaw = valueFader;
});

//==============================================================================
/**
 * Callback when the azim slider changes
 */
sliderAzimComments.addEventListener('input', function(){

    var value = objectSpatialiserAndMixer.setCommentaryAzimuthFromGui( sliderAzimComments );
    
    document.getElementById('label-azim-comments').textContent = 'azim = ' + value;    
});

//==============================================================================
/**
 * Callback when the elev slider changes
 */
sliderElevComments.addEventListener('input', function(){

    var value = objectSpatialiserAndMixer.setCommentaryElevationFromGui( sliderElevComments );

    document.getElementById('label-elev-comments').textContent = 'elev = ' + value;    
});

//==============================================================================
/**
 * Callback when the azim slider changes
 */
sliderDistComments.addEventListener('input', function(){

    var value = objectSpatialiserAndMixer.setCommentaryDistanceFromGui( sliderDistComments );
    
    document.getElementById('label-dist-comments').textContent = 'dist = ' + value + ' m';    
});

//==============================================================================
/**
 * Callback when the azim slider changes
 */
sliderAzimDialog.addEventListener('input', function(){

    var value = objectSpatialiserAndMixer.setDialogAzimuthFromGui( sliderAzimDialog );
    
    document.getElementById('label-azim-dialog').textContent = 'azim = ' + value;    
});

//==============================================================================
/**
 * Callback when the elev slider changes
 */
sliderElevDialog.addEventListener('input', function(){

    var value = objectSpatialiserAndMixer.setDialogElevationFromGui( sliderElevDialog );

    document.getElementById('label-elev-dialog').textContent = 'elev = ' + value;    
});

//==============================================================================
/**
 * Callback when the elev slider changes
 */
sliderDistDialog.addEventListener('input', function(){

    var value = objectSpatialiserAndMixer.setDialogDistanceFromGui( sliderDistDialog );

    document.getElementById('label-dist-dialog').textContent = 'dist = ' + value + ' m';    
});

//==============================================================================
/**
 * Callback when the sliderSmartFaderRatio slider changes
 */
sliderSmartFaderRatio.addEventListener('input', function(){

    var value = smartFader.setCompressionRatioFromGui( sliderSmartFaderRatio );

    document.getElementById('label-smart-fader-ratio').textContent = 'Compression ratio = ' + value + ':1';
});

//==============================================================================
/**
 * Callback when the sliderSmartFaderRatio slider changes
 */
sliderSmartFaderAttack.addEventListener('input', function(){

    var value = smartFader.setAttackTimeFromGui( sliderSmartFaderAttack );

    document.getElementById('label-smart-fader-attack').textContent = 'Attack time = ' + Math.round(value).toString()  + ' ms';
});

//==============================================================================
/**
 * Callback when the sliderSmartFaderRatio slider changes
 */
sliderSmartFaderRelease.addEventListener('input', function(){

    var value = smartFader.setReleaseTimeFromGui( sliderSmartFaderRelease );

    document.getElementById('label-smart-fader-release').textContent = 'Release time = ' + Math.round(value).toString()  + ' ms';
});

//==============================================================================
/// Refresh the dynamic compression state every 500 msec
setInterval(function(){
    var isCompressed = smartFader.dynamicCompressionState;

    if( isCompressed === true){
        document.getElementById('label-smart-fader-compression').style.color = "rgba(255, 0, 0, 0.7)";
    }
    else{
        document.getElementById('label-smart-fader-compression').style.color = "rgba(255, 255, 255, 0.7)";
    }
}, 500);

//==============================================================================
var inputEvent = new Event('input');
sliderTrimMain.dispatchEvent(inputEvent);
sliderTrimAmbiance.dispatchEvent(inputEvent);
sliderTrimComments.dispatchEvent(inputEvent);
sliderTrimDialog.dispatchEvent(inputEvent);
sliderSmartFader.dispatchEvent(inputEvent);
sliderReceiverMixN.dispatchEvent(inputEvent);
sliderReceiverMixX.dispatchEvent(inputEvent);
sliderSmartFaderRatio.dispatchEvent(inputEvent);
sliderSmartFaderAttack.dispatchEvent(inputEvent);
sliderSmartFaderRelease.dispatchEvent(inputEvent);
sliderListenerYaw.dispatchEvent(inputEvent);
sliderAzimComments.dispatchEvent(inputEvent);
sliderElevComments.dispatchEvent(inputEvent);
sliderDistComments.dispatchEvent(inputEvent);
sliderAzimDialog.dispatchEvent(inputEvent);
sliderElevDialog.dispatchEvent(inputEvent);
sliderDistDialog.dispatchEvent(inputEvent);
sliderGainOffset.dispatchEvent(inputEvent);


