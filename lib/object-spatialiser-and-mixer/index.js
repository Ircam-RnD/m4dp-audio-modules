import MultichannelSpatialiser from '../multichannel-spatialiser/index.js';


export default class ObjectSpatialiserAndMixer extends MultichannelSpatialiser {
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {string} outputType - output type "headphone" or "speaker"
     * @param {AudioStreamsDescription} audioStreamsDescription - audioStreamsDescription.
     * @param {HRTF} hrtf - hrtf @todo to be defined
     * @param {EqPreset} eqPreset - dialog gain @todo to be defined
     * @param {number} offsetGain - gain @todo value to be defined
     * @param {number} listeningAxis - angle? @todo value to be defined
     */
    constructor(audioContext, outputType = 'headphone', audioStreamsDescription = {}, hrtf, eqPreset, offsetGain, listeningAxis){
        super(audioContext, outputType, audioStreamsDescription, hrtf, eqPreset, offsetGain, listeningAxis);
    }
    /**
     * Set the position of the sound
     * @param {number} azimuth - azimuth @todo values to be defined
     * @param {number} elevation - elevation @todo values to be defined
     * @param {number} distance - distance @todo values to be defined
     */
    setPosition(azimuth, elevation, distance){
        this._azimuth = azimuth;
        this._elevation = elevation;
        this._distance = distance;
    }
    /**
     * Get the position of the sound
     * @todo return an array? better I think for setPosition/getPosition homogeneity
     * @return {array}
     */
    getPosition(){
        //return {'azimuth': this._azimuth, 'elevation': this._elevation, 'distance': this._distance};
        return [this._azimuth, this._elevation, this._distance];
    }
    /**
     * Process: "position" + "gain"
     * @todo: how to automatically set the gain, how to have RMS from "the other signal" here
     */
     _process(){
     }
}
