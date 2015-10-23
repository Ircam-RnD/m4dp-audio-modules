var audioContext = new AudioContext()

var smartFader = new M4DPAudioModules.SmartFader(audioContext);
var objectSpatialiserAndMixer = new M4DPAudioModules.ObjectSpatialiserAndMixer(audioContext);
var noiseAdaptation = new M4DPAudioModules.NoiseAdaptation(audioContext);
var multichannelSpatialiser = new M4DPAudioModules.MultichannelSpatialiser(audioContext);
var dialogEnhancement = new M4DPAudioModules.DialogEnhancement(audioContext);

