/**
 * Template for other audio nodes: set the audioContext reference and provide connect/disconnect methods for the audio node.
 */
export default class AbstractNode {
    /**
     * AbstractNode constructor
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection instance.
     */
    constructor(audioContext, audioStreamDescriptionCollection = undefined){
        this._audioContext = audioContext;
        this._audioStreamDescriptionCollection = audioStreamDescriptionCollection;
        /**
         * @type {AudioNode}
         */
        this.input = this._audioContext.createGain();
        this._output = this._audioContext.createGain();
    }
    /**
     * Connect the audio node
     * @param {AudioNode} node - an AudioNode to connect to.
     */
    connect(node){
        this._output.connect(node)
    }
    /**
     * Disconnect the audio node
     * @param {AudioNode} node - an AudioNode to disconnect to.
     */
    disconnect(node){
        this._output.disconnect(node)
    }
}


export class AudioStreamDescriptionCollection {
    constructor(streams){
        this._streams = streams;
    }
    set streams(streams){
        this._streams = streams;
    }
    get streams(){
        return this._streams;
    }
    get actives(){
        let actives = []
        for (let stream of this._streams){
            if(stream.active){
                actives.push(stream)
            }
        }
        return actives;
    }
    get dialog(){
        for (let stream of this._streams){
            if(stream.dialog){
                return stream;
            }
        }
        return undefined
    }
}


export class AudioStreamDescription {
    constructor(type, active = false, loudness = undefined, maxTruePeak = undefined, dialog = false, ambiance = false){
        this._type = type;
        this._active = active;
        this._loudness = loudness;
        this._maxTruePeak = maxTruePeak;
        this._dialog = dialog;
        this._ambiance = ambiance;
    }
    /**
     * @todo better name?
     */
    get channelPositions(){
        switch(this._type){
            case "Mono":
                return [0];
            case "Stereo":
                return [-30, 30];
            case "MultiWithoutLFE":
                return [-30, 0, +30, -110, +110]
            case "MultiWithLFE":
                // @todo set correct LFE position
                return [-30, 0, +30, -110, +110, 0]
            case "EightChannel":
                // @todo set correct positions
                return [1, 2, 3, 4, 5, 6, 7, 8]
        }
    }
    set active(value){
        this._active = value;
    }
    get active(){
        return this._active;
    }
    set loudness(value){
        this._loudness = value;
    }
    get loudness(){
        return this._loudness
    }
    set maxTruePeak(value){
        this._maxTruePeak = value;
    }
    get maxTruePeak(){
        return this._maxTruePeak
    }
    set dialog(value){
        this._dialog = value;
    }
    get dialog(){
        return this._dialog
    }
    set ambiance(value){
        this._ambiance = value;
    }
    get ambiance(){
        return this._ambiance
    }
}


/**
 * HRTF
 * @todo: to be defined
 * @typedef {Object} HRTF
 */

/**
 * EqPreset
 * @todo: to be defined
 * @typedef {Object} EqPreset
 */

 /**
 * @external {AudioContext} https://developer.mozilla.org/fr/docs/Web/API/AudioContext
 */
