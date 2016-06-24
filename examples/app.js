// fonctions de tests "unitaires"

//M4DPAudioModules.unittests.biquadtests.testBiquadNode();
//M4DPAudioModules.unittests.binauraltests.testBinauralNode();
//M4DPAudioModules.unittests.cascadetests.testCascadeNode();
//M4DPAudioModules.unittests.analysistests.testAnalysisNode();
//M4DPAudioModules.unittests.phonetests.testPhoneNode();
//M4DPAudioModules.unittests.testBinaural();
//M4DPAudioModules.unittests.testHrtfFromSofaServer();
//M4DPAudioModules.unittests.sumdifftests.testSumDiffNode();
//M4DPAudioModules.unittests.transauraltests.testTransauralShuffler();
//M4DPAudioModules.unittests.multichanneltests.testMultiChannel();
//M4DPAudioModules.unittests.routingtests.testRouting();
//M4DPAudioModules.unittests.compressorexpandertests.testCompressorExpanderNode();

var dumpObject = function(obj) {
    console.debug("Dumping: "+obj);
    for (var name in obj) {
        console.debug("    ."+name+"="+obj[name]);
    }
};



function typeOf(obj) {
    return({}).toString.call(obj).slice(8, -1).toLowerCase();
}

function querySt(ji) {
    var hu = window.location.search.substring(1);
    var gy = hu.split("&");
    for (var i = 0; i < gy.length; i++) {
        var ft = gy[i].split("=");
        //alert(ft);
        if (ft[0] == ji) {
            return ft[1];
        }
    }
    return "";
}

var getElementFromXML = function(item, ns, prefix, attr){
    if($(item).length){
        
        // Ne doit pas utiliser getElementsByTagName avec un object jQuery
        if(item.length){
            item = item[0];
        }
        
        // Méthode pour Chrome
        var collection = $(item).find(ns).filter(function(){
            if($(this)[0].prefix === prefix){
                return true;
            }
        });
        
        // Méthode pour Firefox
        if(!collection.length){
            collection = $(item.getElementsByTagName(prefix+':'+ns));
        }
        
        if(collection.length){          
            return collection.filter(function(){
                if(typeOf(attr) === "object" && attr.type && attr.value){
                    return $(this).attr(attr.type) === attr.value;
                }else{
                    return true;
                }
            }).eq(0);       
        }
    }
};

$(function () {
  
    /*
    //var ebucoreUrl = querySt("ebucore") || "xml/EBUcore_M4DP_LMDJ.xml", program;
    //var ebucoreUrl = querySt("ebucore") || "xml/EBUCore_M4DP_ALEXHUGO.xml", program;
    //var ebucoreUrl = querySt("ebucore") || "xml/EBUCore_M4DP_JT_20h00.xml", program;
    //var ebucoreUrl = querySt("ebucore") || "xml/EBUCore_M4DP_METEO.xml", program;
    //var ebucoreUrl = querySt("ebucore") || "xml/EBUCore_M4DP_TCHOUPI.xml", program;
    //var ebucoreUrl = querySt("ebucore") || "xml/EBUCore_M4DP_RUGBY_AVC.xml", program;
    //var ebucoreUrl = querySt("ebucore") || "xml/EBUCore_M4DP_RUGBY_HEVC.xml", program;
    //var ebucoreUrl = querySt("ebucore") || "xml/EBUCore_M4DP_CSOJ_AVC.xml", program;
    //var ebucoreUrl = querySt("ebucore") || "xml/EBUCore_M4DP_CSOJ_HEVC.xml", program;
     */
  
  
    /// Le monde de Jamy
    var ebucoreUrl = querySt("ebucore") || "xml/EBUCore_M4DP_EBU100000000.xml", program;
  
    /// Meteo
    //var ebucoreUrl = querySt("ebucore") || "xml/EBUCore_M4DP_EBU100000001.xml", program;
  
    /// Journal de 20h
    //var ebucoreUrl = querySt("ebucore") || "xml/EBUCore_M4DP_EBU100000002.xml", program;
  
    /// Tchoupi
    //var ebucoreUrl = querySt("ebucore") || "xml/EBUCore_M4DP_EBU100000003.xml", program;
  
    /// Alex Hugo
    //var ebucoreUrl = querySt("ebucore") || "xml/EBUCore_M4DP_EBU100000004.xml", program;
  
    /// Rugby
    //var ebucoreUrl = querySt("ebucore") || "xml/EBUCore_M4DP_EBU100000005.xml", program;
  
    /// Ce soir ou jamais
    //var ebucoreUrl = querySt("ebucore") || "xml/EBUCore_M4DP_EBU100000006.xml", program;
  
    /// Ange gardien de l'Atlantique
    //var ebucoreUrl = querySt("ebucore") || "xml/EBUCore_M4DP_EBU100000007.xml", program;
  
    if(ebucoreUrl){
        $.ajax({
            url : ebucoreUrl,
            timeout:30 * 1000,
            success: function(xml, status, xhr){
                if(!((typeOf(xml) === "document" || typeOf(xml) === "xmldocument") && xml.getElementsByTagName('ebucore:ebuCoreMain'))){
                    return {};
                }

                var getLinkDetails = function(ctn){
                    var data = {
                        dataMain:{},
                        dataLS:{},
                        dataAD:{},
                        dataEA:{},
                        dataDI:{}
                    };

                    if($(ctn).length){

                        var getData = function($data){
                            var data = {};
                            $data.children().each(function(){
                                if($(this).attr("typeLabel")){
                                    data[$(this).attr("typeLabel")] = $(this).text().trim();
                                }
                            });
                            return data;
                        };

                        // Main
                        var $data = $(getElementFromXML(ctn, "format", "ebucore", {type:"formatName", value:"Main"})),
                            $audioFormat = getElementFromXML($data, "audioFormat", "ebucore");
                        if($data.length && $audioFormat.length && $audioFormat.attr("audioPresenceFlag") === "true"){
                            data.dataMain = getData($audioFormat);
                            data.dataMain.url = getElementFromXML($data, "locator", "ebucore").text().trim();
                        }

                        // LS
                        $data = $(getElementFromXML(ctn, "format", "ebucore", {type:"formatName", value:"SL"}));
                        if($data.length && $data.attr("videoPresenceFlag") === "true"){
                            data.dataLS = {
                                url:getElementFromXML($data, "locator", "ebucore").text().trim()
                            };
                        }

                        // AD
                        $data = $(getElementFromXML(ctn, "format", "ebucore", {type:"formatName", value:"AD"}));
                        $audioFormat = getElementFromXML($data, "audioFormat", "ebucore");
                        if($data.length && $audioFormat.length && $audioFormat.attr("audioPresenceFlag") === "true"){
                            data.dataAD = getData($audioFormat);
                            data.dataAD.url = getElementFromXML($data, "locator", "ebucore").text().trim();
                        }

                        // EA
                        $data = $(getElementFromXML(ctn, "format", "ebucore", {type:"formatName", value:"EA3"}));
                        $audioFormat = getElementFromXML($data, "audioFormat", "ebucore");
                        if($data.length && $audioFormat.length && $audioFormat.attr("audioPresenceFlag") === "true"){
                            data.dataEA = getData($audioFormat);
                            data.dataEA.url = getElementFromXML($data, "locator", "ebucore").text().trim();
                        }

                        // DI
                        $data = $(getElementFromXML(ctn, "format", "ebucore", {type:"formatName", value:"DI"}));
                        $audioFormat = getElementFromXML($data, "audioFormat", "ebucore");
                        if($data.length && $audioFormat.length && $audioFormat.attr("audioPresenceFlag") === "true"){
                            data.dataDI = getData($audioFormat);
                            data.dataDI.url = getElementFromXML($data, "locator", "ebucore").text().trim();
                        }
                    }
                    return data;
                };
                
                program = getLinkDetails(getElementFromXML(xml, "part", "ebucore", {type:"partName", value:"Links"}));
                if(typeOf(program) === "object"){
                    initPlayer(program);
                }
            },
            error : function(xhr, erreur, e){

            }
        });
    }
});


var initPlayer = function(program)
{

    /// player pour la video principale
    videoPlayerMainMediaElement           = document.getElementById('videoPlayerMain');
    /// player pour la video LSF (langue des signes)
    videoPlayerPipMediaElement            = document.getElementById('videoPlayerPip');
    /// player pour l'audio 5.1
    playerAudioFiveDotOneMediaElement     = document.getElementById('playerAudioFiveDotOne');
    /// player pour l'audio description
    playerAudioDescriptionMediaElement    = document.getElementById('playerAudioDescription');
    /// player pour les dialgoues
    playerDialogueMediaElement            = document.getElementById('playerDialogue');


    var context = new Dash.di.DashContext();

    /*
    /// les premières URLs fournies par DotScreen
    var urlMain = "http://medias2.francetv.fr/innovation/media4D/m4dp-set1-LMDJ/manifest.mpd";
    var urlPip = "http://medias2.francetv.fr/innovation/media4D/m4dp-set1-LMDJ/manifest-lsf.mpd";
    var urlAudio = "http://medias2.francetv.fr/innovation/media4D/m4dp-set1-LMDJ/manifest-ad.mpd";
    */
           
    /*                                  
    var dashUrlAudioPrincipale     = 'http://videos-pmd.francetv.fr/innovation/media4D/m4d-LMDJ-ondemand-3lsf/manifest.mpd';
    var dashUrlAudioDescription    = 'http://videos-pmd.francetv.fr/innovation/media4D/m4d-LMDJ-ondemand-3lsf/manifest-ad.mpd';
    var dashUrlFiveDotOne          = 'http://videos-pmd.francetv.fr/innovation/media4D/m4d-LMDJ-ondemand-3lsf/manifest-ea3.mpd'; /// L R C LFE Ls Rs ?
    var dashUrlDial                = 'http://videos-pmd.francetv.fr/innovation/media4D/m4d-LMDJ-ondemand-3lsf/manifest-di.mpd';
    var dashUrlLsf                 = 'http://videos-pmd.francetv.fr/innovation/media4D/m4d-LMDJ-ondemand-3lsf/manifest-lsf.mpd';
    */

    var dashUrlAudioPrincipale     = program.dataMain.url;
    var dashUrlAudioDescription    = program.dataAD.url;
    var dashUrlFiveDotOne          = program.dataEA.url; /// L R C LFE Ls Rs ?
    var dashUrlDial                = program.dataDI.url;
    var dashUrlLsf                 = program.dataLS.url;

    var urlMain                = dashUrlAudioPrincipale;
    urlPip                     = dashUrlLsf;
    var urlAudioFiveDotOne     = dashUrlFiveDotOne;
    var urlAudioDescription    = dashUrlAudioDescription;
    var urlDialogue            = dashUrlDial;

    //==============================================================================
    var playerMain = new MediaPlayer(context);
    playerMain.startup();
    playerMain.setAutoPlay(false);
    playerMain.attachView(videoPlayerMainMediaElement);
    playerMain.getDebug().setLogToBrowserConsole(false);

    playerPip = new MediaPlayer(context);
    playerPip.startup();
    playerPip.setAutoPlay(false);
    if( urlPip )
    {
        playerPip.attachView(videoPlayerPipMediaElement);
    }
    playerPip.getDebug().setLogToBrowserConsole(false);

    var playerAudioFiveDotOne = new MediaPlayer(context);
    playerAudioFiveDotOne.startup();
    playerAudioFiveDotOne.setAutoPlay(false);
    if( urlAudioFiveDotOne )
    {
        playerAudioFiveDotOne.attachView(playerAudioFiveDotOneMediaElement);
    }
    playerAudioFiveDotOne.getDebug().setLogToBrowserConsole(false);

    var playerAudioDescription = new MediaPlayer(context);
    playerAudioDescription.startup();
    playerAudioDescription.setAutoPlay(false);
    if( urlAudioDescription )
    {
        playerAudioDescription.attachView(playerAudioDescriptionMediaElement);
    }
    playerAudioDescription.getDebug().setLogToBrowserConsole(false);

    var playerDialogue = new MediaPlayer(context);
    playerDialogue.startup();
    playerDialogue.setAutoPlay(false);
    if( urlDialogue )
    {
        playerDialogue.attachView(playerDialogueMediaElement);
    }
    playerDialogue.getDebug().setLogToBrowserConsole(false);

    controller = new MediaController();

    //dumpObject( playerMain );

    videoPlayerMainMediaElement.controller           = controller;
    if( urlPip )
    {
        videoPlayerPipMediaElement.controller            = controller;
    }
    if( urlAudioFiveDotOne )
    {
        playerAudioFiveDotOneMediaElement.controller     = controller;
    }
    if( urlAudioDescription )
    {
        playerAudioDescriptionMediaElement.controller    = controller;
    }
    if( urlDialogue )
    {
        playerDialogueMediaElement.controller            = controller;
    }

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
    var mainData = JSON.parse(JSON.stringify(program.dataMain));
    var eaData = JSON.parse(JSON.stringify(program.dataEA));
    var adData = JSON.parse(JSON.stringify(program.dataAD));
    var diData = JSON.parse(JSON.stringify(program.dataDI));

    /// Workaround when all the streams are not in the EBU Core
    if( typeof( program.dataEA.type ) === "undefined" )
    {
        eaData.type = "MultiWithLFE";
    }
    if( typeof( program.dataAD.type ) === "undefined" )
    {
        adData.type = "Mono";
    }
    if( typeof( program.dataDI.type ) === "undefined" )
    {
        diData.type = "Mono";
    }

    // Son principal
    mainAudioASD = new M4DPAudioModules.AudioStreamDescription(
            type = mainData.type,
            active = true,
            loudness = parseFloat(mainData.loudness,10),
            maxTruePeak = parseFloat(mainData.maxTruePeak,10),
            dialog = mainData.dialog === "true",
            ambiance = mainData.ambiance === "true",
            commentary = mainData.commentary === "true");

    // Ambiance (pour le 5.1)
    extendedAmbienceASD = new M4DPAudioModules.AudioStreamDescription(
            type = eaData.type,
            active = typeof( program.dataEA.type ) != "undefined",
            loudness = parseFloat(eaData.loudness,10),
            maxTruePeak = parseFloat(eaData.maxTruePeak,10),
            dialog = eaData.dialog === "true",
            ambiance = eaData.ambiance === "true",
            commentary = eaData.commentary === "true");

    // Audio description
    extendedCommentsASD = new M4DPAudioModules.AudioStreamDescription(
            type = adData.type,
            active = false,
            loudness = parseFloat(adData.loudness,10),
            maxTruePeak = parseFloat(adData.maxTruePeak,10),
            dialog = adData.dialog === "true",
            ambiance = adData.ambiance === "true",
            commentary = adData.commentary === "true");

    // Dialogue (pour le 5.1)
    extendedDialogsASD = new M4DPAudioModules.AudioStreamDescription(
            type = diData.type,
            active = typeof( program.dataDI.type ) != "undefined",
            loudness = parseFloat(diData.loudness,10),
            maxTruePeak = parseFloat(diData.maxTruePeak,10),
            dialog = diData.dialog === "true",
            ambiance = diData.ambiance === "true",
            commentary = diData.commentary === "true");

    var asdc = new M4DPAudioModules.AudioStreamDescriptionCollection(
            [mainAudioASD, extendedAmbienceASD, extendedCommentsASD, extendedDialogsASD]
            );

    //==============================================================================
    // M4DPAudioModules

    /// connect either the multichannel spatializer or the object spatializer
    ModulesConfiguration =
    {
        kMultichannelSpatialiser : 0,
        kObjectSpatialiserAndMixer : 1
    };

    config = ModulesConfiguration.kMultichannelSpatialiser;

    streamSelector              = new M4DPAudioModules.StreamSelector( audioContext, asdc );
    smartFader                  = new M4DPAudioModules.SmartFader( audioContext, asdc );
    dialogEnhancement           = new M4DPAudioModules.DialogEnhancement( audioContext, asdc );
    receiverMix                 = new M4DPAudioModules.OldReceiverMix( audioContext, asdc );
    //noiseAdaptation = new M4DPAudioModules.NoiseAdaptation(audioContext);
    multichannelSpatialiser     = new M4DPAudioModules.MultichannelSpatialiser( audioContext, asdc, 'binaural' );
    objectSpatialiserAndMixer   = new M4DPAudioModules.ObjectSpatialiserAndMixer( audioContext, asdc, 'binaural' );

    compressorExpander          = new M4DPAudioModules.CompressorWithSideChain( audioContext, 10 );

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
    updateWAAConnections();

    //==============================================================================
    playerMain.attachSource( urlMain );
    if( urlPip )
    {
        playerPip.attachSource( urlPip );
    }
    if( urlAudioFiveDotOne )
    {
        playerAudioFiveDotOne.attachSource( urlAudioFiveDotOne );
    }
    if( urlAudioDescription )
    {
        playerAudioDescription.attachSource( urlAudioDescription );
    }
    if( urlDialogue )
    {
        playerDialogue.attachSource( urlDialogue );
    }

    playerMain.play();
    if( urlPip )
    {
        playerPip.play();
    }
    if( urlAudioFiveDotOne )
    {
        playerAudioFiveDotOne.play();
    }
    if( urlAudioDescription )
    {
        playerAudioDescription.play();
    }
    if( urlDialogue )
    {
        playerDialogue.play();
    }

    //==============================================================================
    // initialize the GUI stuffs
    initializeSliders();
    initializeCheckBoxes();
    initializeDropDownMenus();


    //==============================================================================
    /// Refresh the dynamic compression state every 500 msec
    setInterval(function(){
        var isCompressed = smartFader.dynamicCompressionState;

        if( isCompressed === true)
        {
            document.getElementById('label-smart-fader-compression').style.color = "rgba(255, 0, 0, 0.7)";
        }
        else
        {
            document.getElementById('label-smart-fader-compression').style.color = "rgba(255, 255, 255, 0.7)";
        }

        var rmsCommentary = receiverMix.getRmsForCommentaryAsString();
        document.getElementById('label-receiver-mix-commentary-rms').textContent = rmsCommentary;

        var rmsProgram = receiverMix.getRmsForProgramAsString();
        document.getElementById('label-receiver-mix-program-rms').textContent = rmsProgram;    

        var receiverMixCompression = receiverMix.dynamicCompressionState;

        document.getElementById('label-receiver-mix-compression').textContent = "Compression";
        if( receiverMixCompression === true)
        {
            document.getElementById('label-receiver-mix-compression').style.color = "rgba(255, 0, 0, 0.7)";
        }
        else
        {
            document.getElementById('label-receiver-mix-compression').style.color = "rgba(255, 255, 255, 0.7)";
        }     

    }, 250);

    //==============================================================================
    var inputEvent = new Event('input');
    sliderTrimMain.dispatchEvent(inputEvent);
    sliderTrimAmbiance.dispatchEvent(inputEvent);
    sliderTrimComments.dispatchEvent(inputEvent);
    sliderTrimDialog.dispatchEvent(inputEvent);
    sliderSmartFader.dispatchEvent(inputEvent);
    sliderReceiverMixN.dispatchEvent(inputEvent);
    sliderReceiverMixX.dispatchEvent(inputEvent);
    sliderReceiverMixRatio.dispatchEvent(inputEvent);
    sliderReceiverMixThreshold.dispatchEvent(inputEvent);
    sliderReceiverMixAttack.dispatchEvent(inputEvent);
    sliderReceiverMixRelease.dispatchEvent(inputEvent);
    sliderReceiverMixRefreshRms.dispatchEvent(inputEvent);
    sliderReceiverMixHoldTime.dispatchEvent(inputEvent);
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
    sliderDialogEnhancementMode1.dispatchEvent(inputEvent);

};

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
var sliderReceiverMixRatio = document.getElementById('slider-receiver-mix-ratio');
var sliderReceiverMixThreshold = document.getElementById('slider-receiver-mix-threshold');
var sliderReceiverMixAttack = document.getElementById('slider-receiver-mix-attack');
var sliderReceiverMixRelease = document.getElementById('slider-receiver-mix-release');
var sliderReceiverMixRefreshRms = document.getElementById('slider-receiver-mix-refresh-rms');
var sliderReceiverMixHoldTime = document.getElementById('slider-receiver-mix-holdtime');
var sliderDialogEnhancementMode1 = document.getElementById('slider-dialog-enhancement-mode1');




//==============================================================================
function updateWAAConnections()
{
   
    smartFader.disconnect();
    dialogEnhancement.disconnect();
    receiverMix.disconnect();
    multichannelSpatialiser.disconnect();
    objectSpatialiserAndMixer.disconnect();

    var processor = undefined;

    if( config == ModulesConfiguration.kMultichannelSpatialiser )
    {
        processor = multichannelSpatialiser;       
    }
    else if( config == ModulesConfiguration.kObjectSpatialiserAndMixer )
    {
        processor = objectSpatialiserAndMixer;
    }
    else
    {
        throw new Error( "Invalid configuration" );
    }
    
    smartFader.connect( dialogEnhancement._input );

    dialogEnhancement.connect( receiverMix._input );

    receiverMix.connect( processor._input );

    /// apply the multichannel spatialiser
    processor.connect( audioContext.destination );

    /*
    processor.connect( compressorExpander._input );
    
    compressorExpander.connect( audioContext.destination );
     */
    
    /// force a nofitication of the HRTF selection
    var $hrtfSet = document.querySelector('#hrtf-selection-menu');
    if( $hrtfSet.onchange != null )
    {
        $hrtfSet.onchange();
    }
}

//==============================================================================
function setElementVisibility( elementId, visibility )
{
    if( visibility === true )
    {
        document.getElementById(elementId).style.visibility = "";
    }
    else
    {
        document.getElementById(elementId).style.visibility = "hidden";
    }
}

//==============================================================================
function prepareSpatializationModeMenu()
{
    var $menu = document.querySelector('#spatialisation-mode-menu');

    $menu.onchange = function ()
    {
        /// retrieve the selected mode
        var selection = $menu.value;

        var visibility = true;
        
        if( selection === 'binaural' )
        {
            visibility = true;
        }
        else
        {
            visibility = false;
        }
        setElementVisibility('checkbox-headphones-equalization', visibility);
        setElementVisibility('label-headphones-equalization', visibility);


        if( selection === 'multichannel' )
        {
            visibility = false;
        }
        else
        {
            visibility = true;
        }
        setElementVisibility('slider-listener-yaw', visibility);
        setElementVisibility('label-listener-yaw', visibility);
        setElementVisibility('slider-gain-offset', visibility);
        setElementVisibility('label-gain-offset', visibility);
        setElementVisibility('hrtf-selection-menu', visibility);


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
function prepareModulesConfigurationMenu()
{
    // configuration set selection menu
    var $menu = document.querySelector('#modules-configuration-menu');

    $menu.onchange = function ()
    {
        /// retrieve selected mode
        var selection = $menu.value;

        var displayDialogPosition = false;

        if( selection === 'Multichannel Spatialiser' )
        {
            displayDialogPosition = false;
            config = ModulesConfiguration.kMultichannelSpatialiser;
        }
        else if( selection === 'Object Spatialiser and Mixer' )
        {
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
function prepareHrtfSelectionMenu()
{
    
    var currentProcessor = undefined;
    if( config == ModulesConfiguration.kMultichannelSpatialiser )
    {
        currentProcessor = multichannelSpatialiser;
    }
    else
    {
        currentProcessor = objectSpatialiserAndMixer;
    }

    // HRTF set selection menu
    var $hrtfSet = document.querySelector('#hrtf-selection-menu');
    $hrtfSet.onchange = function ()
    {
        /// sets the color to red while loading
        $hrtfSet.style.backgroundColor="rgba(255, 0, 0, 0.7)";
        
        /// retrieve the URL selected in the menu 
        var url = $hrtfSet.value;

        /// load the URL in the spatialiser
        currentProcessor.loadHrtfSet( url )
        .then( function()
        {
            /// reset the color after loading
            $hrtfSet.style.backgroundColor="";

            objectSpatialiserAndMixer._updateCommentaryPosition();
        });
    };

    if( $hrtfSet.options.length === 0 )
    {
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

                 sofaUrl = currentProcessor._virtualSpeakers.getFallbackUrls();

                 sofaUrl.forEach( function (url) {
                     $option = document.createElement('option');
                     $option.textContent = url;
                     $hrtfSet.add($option);
                  });
                 
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

                 sofaUrl = currentProcessor._virtualSpeakers.getFallbackUrls();

                 var $option;
                 sofaUrl.forEach( function (url) {
                    $option = document.createElement('option');
                    $option.textContent = url;
                    $hrtfSet.add($option);
                 });
                 
                 $hrtfSet.value = sofaUrl[0];
                 $hrtfSet.onchange();

                 return sofaUrl;
             });
     }
}

//==============================================================================
function updateActiveStreams()
{
    /// notify the modification of active streams
    streamSelector.activeStreamsChanged();
    smartFader.activeStreamsChanged();
    dialogEnhancement.activeStreamsChanged();
    receiverMix.activeStreamsChanged();
    multichannelSpatialiser.activeStreamsChanged();
    objectSpatialiserAndMixer.activeStreamsChanged();

    /// update the dialog enhancement
    var value = dialogEnhancement.mode;
    document.getElementById('label-dialog-current-mode').textContent = 'current mode : ' + value;
    
    var inputEvent = new Event('input');
    sliderDialogEnhancementMode1.dispatchEvent(inputEvent);

    if( value == 0 )
    {
        setElementVisibility( 'label-dialog-enhancement-mode1', false );
    }
    else
    {
        setElementVisibility( 'label-dialog-enhancement-mode1', true );
    }
    
    setElementVisibility( 'slider-dialog-enhancement-mode1', true );        
    
}

function updateStreamsTrim()
{
    /// notify the modification of trim of streams
    streamSelector.streamsTrimChanged();    
}

//==============================================================================
function onCheckTrimBypass()
{
    var checkbox = document.getElementById('checkbox-trim-bypass');

    if( checkbox.checked )
    {
        streamSelector.bypass = true;
    }
    else
    {
        streamSelector.bypass = false;
    }
}

function onCheckSmartFaderBypass()
{
    var checkbox = document.getElementById('checkbox-smart-fader-bypass');

    if( checkbox.checked )
    {
        smartFader.bypass = true;
    }
    else
    {
        smartFader.bypass = false;
    }
}

function onCheckDialogEnhancementBypass()
{
    var checkbox = document.getElementById('checkbox-dialog-enhancement-bypass');

    if( checkbox.checked )
    {
        dialogEnhancement.bypass = true;
    }
    else
    {
        dialogEnhancement.bypass = false;
    }
}

function onCheckReceiverMixBypass()
{
    var checkbox = document.getElementById('checkbox-receiver-mix-bypass');

    if( checkbox.checked )
    {
        receiverMix.bypass = true;
    }
    else
    {
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

function onCheckExAmbience()
{
    if( checkboxExAmbience.checked )
    {
        extendedAmbienceASD.active = true;
    }
    else
    {
        extendedAmbienceASD.active = false;
    }
    updateActiveStreams();
}

function onCheckExComments()
{
    if( checkboxExComments.checked )
    {
        extendedCommentsASD.active = true;
    }
    else
    {
        extendedCommentsASD.active = false;
    }
    updateActiveStreams();
}

function onCheckExDialogs()
{
    if( checkboxExDialogs.checked )
    {
        extendedDialogsASD.active = true;
    }
    else
    {
        extendedDialogsASD.active = false;
    }
    updateActiveStreams();
}

function onCheckEqualization()
{
    multichannelSpatialiser.eqPreset = "eq1";
    objectSpatialiserAndMixer.eqPreset = "eq1";

    if( checkboxHeadphonesEqualization.checked )
    {
        multichannelSpatialiser.bypassHeadphoneEqualization( false );
        objectSpatialiserAndMixer.bypassHeadphoneEqualization( false );
    }
    else
    {
        multichannelSpatialiser.bypassHeadphoneEqualization( true );
        objectSpatialiserAndMixer.bypassHeadphoneEqualization( true );
    }
}

function onCheckLSF()
{
    if( checkboxLSF.checked && urlPip )
    {
        controller.currentTime = videoPlayerMainMediaElement.currentTime;
        videoPlayerPipMediaElement.controller = controller;
        playerPip.startup();
        playerPip.setAutoPlay(false);
        playerPip.attachView(videoPlayerPipMediaElement);
        playerPip.attachSource(urlPip);
    }
    else
    {
        videoPlayerPipMediaElement.controller = null;
        playerPip.reset();
    }
}

//==============================================================================
function initializeDropDownMenus()
{
    prepareModulesConfigurationMenu();

    /// prepare the sofa catalog of HRTF
    prepareHrtfSelectionMenu();

    prepareSpatializationModeMenu();
}

//==============================================================================
function initializeCheckBoxes()
{
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
function initializeSliders()
{
    /// make sure the sliders are properly initialized, with scaled values
    sliderSmartFader.value          = smartFader.getdBForGui( sliderSmartFader );
    sliderSmartFaderRatio.value     = smartFader.getCompressionRatioForGui( sliderSmartFaderRatio );
    sliderSmartFaderAttack.value    = smartFader.getAttackTimeForGui( sliderSmartFaderAttack );
    sliderSmartFaderRelease.value   = smartFader.getReleaseTimeForGui( sliderSmartFaderRelease );

    sliderReceiverMixRatio.value    = receiverMix.getCompressionRatioForGui( sliderReceiverMixRatio );
    sliderReceiverMixThreshold.value    = receiverMix.getCompressorThresholdForGui( sliderReceiverMixThreshold );
    sliderReceiverMixAttack.value   = receiverMix.getAttackTimeForGui( sliderReceiverMixAttack );
    sliderReceiverMixRelease.value  = receiverMix.getReleaseTimeForGui( sliderReceiverMixRelease );
    sliderReceiverMixRefreshRms.value  = receiverMix.getRefreshRmsTimeForGui( sliderReceiverMixRefreshRms );
    sliderReceiverMixHoldTime.value  = receiverMix.getMinimumHoldTimeForGui( sliderReceiverMixHoldTime );
    sliderReceiverMixN.value = receiverMix.getThresholdForCommentaryFromGui( sliderReceiverMixN );
    sliderReceiverMixX.value = receiverMix.getThresholdForProgrammeFromGui( sliderReceiverMixX );

    sliderDialogEnhancementMode1.value = dialogEnhancement.getBalanceFromGui( sliderDialogEnhancementMode1 );

    sliderTrimMain.value        = 0;
    sliderTrimAmbiance.value    = 0;
    sliderTrimComments.value    = 0;
    sliderTrimDialog.value      = 0;

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

    document.getElementById('label-receiver-mix-N').textContent = 'N = ' + Math.round(value).toFixed(1) + ' dB (gate for comments)';
});

sliderReceiverMixX.addEventListener('input', function(){

    var value = receiverMix.setThresholdForProgrammeFromGui( sliderReceiverMixX );

    document.getElementById('label-receiver-mix-X').textContent = 'X = ' + Math.round(value).toFixed(1) + ' dB (gate for program)';
});

//==============================================================================
sliderDialogEnhancementMode1.addEventListener('input', function(){

    var value = dialogEnhancement.setBalanceFromGui( sliderDialogEnhancementMode1 );

    var mode = dialogEnhancement.mode;

    if( mode === 1 )
    {
        document.getElementById('label-dialog-enhancement-mode1').textContent = Math.round(value).toString() + ' % (ambiance | dialog)';
    }
    else if( mode === 2 )
    {
        var scaled = M4DPAudioModules.utilities.scale( value, 0, 100, -6, 6 );
        document.getElementById('label-dialog-enhancement-mode1').textContent = Math.round(scaled).toFixed(1) + ' dB';   
    }
    else if( mode === 3 )
    {
        var scaled = M4DPAudioModules.utilities.scale( value, 0, 100, 0, 6 );
        document.getElementById('label-dialog-enhancement-mode1').textContent = Math.round(scaled).toFixed(1) + ' dB';   
    }
});

//==============================================================================
/**
 * Callback when the trim slider changes
 */
sliderTrimMain.addEventListener('input', function(){

    var value = mainAudioASD.setTrimFromGui( sliderTrimMain );

    updateStreamsTrim();

    document.getElementById('label-trim-main').textContent = 'Main Audio = ' + Math.round(value).toFixed(1) + ' dB';
});

sliderTrimAmbiance.addEventListener('input', function(){

    var value = extendedAmbienceASD.setTrimFromGui( sliderTrimAmbiance );

    updateStreamsTrim();

    document.getElementById('label-trim-ambiance').textContent = 'Extended ambiance = ' + Math.round(value).toFixed(1) + ' dB';
});

sliderTrimComments.addEventListener('input', function(){

    var value = extendedCommentsASD.setTrimFromGui( sliderTrimComments );

    updateStreamsTrim();

    document.getElementById('label-trim-comments').textContent = 'Extended comments = ' + Math.round(value).toFixed(1) + ' dB';
});

sliderTrimDialog.addEventListener('input', function(){

    var value = extendedDialogsASD.setTrimFromGui( sliderTrimDialog );

    updateStreamsTrim();

    document.getElementById('label-trim-dialog').textContent = 'Extended dialog = ' + Math.round(value).toFixed(1) + ' dB';
});

//==============================================================================
/**
 * Callback when the dB slider changes
 */
sliderSmartFader.addEventListener('input', function(){

    var value = smartFader.setdBFromGui( sliderSmartFader );

    document.getElementById('label-smart-fader').textContent = 'Smart Fader = ' + Math.round(value).toFixed(1) + ' dB';
});

//==============================================================================
sliderGainOffset.addEventListener('input', function(){

    var value = parseFloat( sliderGainOffset.value );
    /// this is in [-12 12] range

    document.getElementById('label-gain-offset').textContent = 'Gain Offset = ' + Math.round(value).toFixed(1) + ' dB';

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
    
    document.getElementById('label-dist-comments').textContent = 'dist = ' + value.toFixed(2) + ' m';    
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

    document.getElementById('label-dist-dialog').textContent = 'dist = ' + value.toFixed(2) + ' m';    
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
 * Callback when the sliderSmartFaderAttack slider changes
 */
sliderSmartFaderAttack.addEventListener('input', function(){

    var value = smartFader.setAttackTimeFromGui( sliderSmartFaderAttack );

    document.getElementById('label-smart-fader-attack').textContent = 'Attack time = ' + Math.round(value).toString()  + ' ms';
});

//==============================================================================
/**
 * Callback when the sliderSmartFaderRelease slider changes
 */
sliderSmartFaderRelease.addEventListener('input', function(){

    var value = smartFader.setReleaseTimeFromGui( sliderSmartFaderRelease );

    document.getElementById('label-smart-fader-release').textContent = 'Release time = ' + Math.round(value).toString()  + ' ms';
});

//==============================================================================
/**
 * Callback when the sliderReceiverMixRatio slider changes
 */
sliderReceiverMixRatio.addEventListener('input', function(){

    var value = receiverMix.setCompressionRatioFromGui( sliderReceiverMixRatio );

    document.getElementById('label-receiver-mix-ratio').textContent = 'Compression ratio = ' + value + ':1';
});

//==============================================================================
/**
 * Callback when the sliderReceiverMixThreshold slider changes
 */
sliderReceiverMixThreshold.addEventListener('input', function(){

    var value = receiverMix.setCompressorThresholdFromGui( sliderReceiverMixThreshold );

    document.getElementById('label-receiver-mix-threshold').textContent = 'Compression threshold = ' + value.toFixed(1) + ' dB';
});

//==============================================================================
/**
 * Callback when the sliderReceiverMixAttack slider changes
 */
sliderReceiverMixAttack.addEventListener('input', function(){

    var value = receiverMix.setAttackTimeFromGui( sliderReceiverMixAttack );

    document.getElementById('label-receiver-mix-attack').textContent = 'Attack time = ' + Math.round(value).toString()  + ' ms';
});

//==============================================================================
/**
 * Callback when the sliderReceiverMixRelease slider changes
 */
sliderReceiverMixRelease.addEventListener('input', function(){

    var value = receiverMix.setReleaseTimeFromGui( sliderReceiverMixRelease );

    document.getElementById('label-receiver-mix-release').textContent = 'Release time = ' + Math.round(value).toString()  + ' ms';
});

//==============================================================================
/**
 * Callback when the sliderReceiverMixRefreshRms slider changes
 */
sliderReceiverMixRefreshRms.addEventListener('input', function(){

    var value = receiverMix.setRefreshRmsTimeFromGui( sliderReceiverMixRefreshRms );

    document.getElementById('label-receiver-mix-refresh-rms').textContent = 'RMS refresh interval = ' + Math.round(value).toString()  + ' ms';
});

//==============================================================================
/**
 * Callback when the sliderReceiverMixHoldTime slider changes
 */
sliderReceiverMixHoldTime.addEventListener('input', function(){

    var value = receiverMix.setMinimumHoldTimeFromGui( sliderReceiverMixHoldTime );

    document.getElementById('label-receiver-mix-holdtime').textContent = 'Hold time = ' + Math.round(value).toString()  + ' ms';
});


