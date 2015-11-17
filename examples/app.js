var audioContext = new AudioContext()


// AudioStreamDescriptionCollection example
var asd1 = new M4DPAudioModules.AudioStreamDescription(type = "Mono", active = true, loudness = 1, maxTruePeak = 1, dialog = false, ambiance = true);
var asdc = new M4DPAudioModules.AudioStreamDescriptionCollection([asd1]);
// AudioNode "translation" of the Description asd1
var oscillator = audioContext.createOscillator();
oscillator.type = 'sine';
oscillator.frequency.value = 46;
oscillator.start();


// M4DPAudioModules
var smartFader = new M4DPAudioModules.SmartFader(audioContext, asdc);
// var objectSpatialiserAndMixer = new M4DPAudioModules.ObjectSpatialiserAndMixer(audioContext);
// var noiseAdaptation = new M4DPAudioModules.NoiseAdaptation(audioContext);
// var multichannelSpatialiser = new M4DPAudioModules.MultichannelSpatialiser(audioContext);
// var dialogEnhancement = new M4DPAudioModules.DialogEnhancement(audioContext);

oscillator.connect(smartFader.input)
smartFader.connect(audioContext.destination)
