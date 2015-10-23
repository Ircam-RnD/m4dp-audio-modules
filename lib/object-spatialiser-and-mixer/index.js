import MultichannelSpatialiser from '../multichannel-spatialiser/index.js';


export default class ObjectSpatialiserAndMixer extends MultichannelSpatialiser {
    constructor(audioContext, outputType = 'headphone', audioStreamsDescription = {}, hrtf, eqPreset, offsetGain, listeningAxis){
        super(audioContext, outputType, audioStreamsDescription, hrtf, eqPreset, offsetGain, listeningAxis);
    }
    /*
     * Set the position of the sound
     */
    setPosition(azimuth, elevation, distance){
        this._azimuth = azimuth;
        this._elevation = elevation;
        this._distance = distance;
    }
    /*
     * Get the position of the sound
     */
    getPosition(){
        return {'azimuth': this._azimuth, 'elevation': this._elevation, 'distance': this._distance};
    }
    /**
     * Process: "position" + "gain"
     * @todo: how to automatically set the gain, how to have RMS from "the other signal" here
     */
     _process(){
     }
}
