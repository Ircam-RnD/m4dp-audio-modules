import DialogEnhancement from './dialog-enhancement/index.js';
import MultichannelSpatialiser from './multichannel-spatialiser/index.js';
import NoiseAdaptation from './noise-adaptation/index.js';
import ObjectSpatialiserAndMixer from './object-spatialiser-and-mixer/index.js';
import SmartFader from './smart-fader/index.js';
import {AudioStreamDescriptionCollection, AudioStreamDescription} from './core/index.js';


const M4DPAudioModules = {
    "DialogEnhancement": DialogEnhancement,
    "MultichannelSpatialiser": MultichannelSpatialiser,
    "NoiseAdaptation": NoiseAdaptation,
    "ObjectSpatialiserAndMixer": ObjectSpatialiserAndMixer,
    "SmartFader": SmartFader,
    "AudioStreamDescriptionCollection": AudioStreamDescriptionCollection,
    "AudioStreamDescription": AudioStreamDescription
};

// @fix, Extra ugly, should use export default M4DPAudioModules;
window.M4DPAudioModules = M4DPAudioModules;
