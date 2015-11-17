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


/**
 * Container for AudioStreamDescription
 */
export class AudioStreamDescriptionCollection {
    /**
     * AudioStreamDescriptionCollection constructor
     * @param {AudioStreamDescription[]} streams - array of AudioStreamDescription
     */
    constructor(streams){
        this._streams = streams;
    }
    /**
     * Set the stream description collection
     * @type {AudioStreamDescription[]}
     */
    set streams(streams){
        this._streams = streams;
    }
    /**
     * Get the stream description collection
     * @type {AudioStreamDescription[]}
     */
    get streams(){
        return this._streams;
    }
    /**
     * Get the current active audio stream descriptions of the collection
     * @type {AudioStreamDescription[]}
     */
    get actives(){
        let actives = []
        for (let stream of this._streams){
            if(stream.active){
                actives.push(stream)
            }
        }
        return actives;
    }
    /**
     * Get the current dialog audio stream description of the collection
     * @type {AudioStreamDescription}
     */
    get dialog(){
        for (let stream of this._streams){
            if(stream.dialog){
                return stream;
            }
        }
        return undefined
    }
}


/**
 * AudioStreamDescription describes a stream.
 */
export class AudioStreamDescription {
    /**
     * AudioStreamDescription constructor
     * @param {string} type - type.
     * @param {boolean} active - active.
     * @param {number} loudness - loudness.
     * @param {number} maxTruePeak - maxTruePeak.
     * @param {boolean} dialog - dialog.
     * @param {boolean} ambiance - ambiance.
     */
    constructor(type, active = false, loudness = undefined, maxTruePeak = undefined, dialog = false, ambiance = false){
        this._type = type;
        this._active = active;
        this._loudness = loudness;
        this._maxTruePeak = maxTruePeak;
        this._dialog = dialog;
        this._ambiance = ambiance;
    }
    /**
     * Get channel position based on audio stream type
     * @type {number[]}
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
    /**
     * Set active, if stream is currently playing or not
     * @type {boolean}
     */
    set active(value){
        this._active = value;
    }
    /**
     * Get active, if stream is currently playing or not
     * @type {boolean}
     */
    get active(){
        return this._active;
    }
    /**
     * Set the loudness value of audio stream
     * @type {number}
     */
    set loudness(value){
        this._loudness = value;
    }
    /**
     * Get the loudness of audio stream
     * @type {number}
     */
    get loudness(){
        return this._loudness
    }
    /**
     * Set the maxTruePeak of audio stream
     * @type {number}
     */
    set maxTruePeak(value){
        this._maxTruePeak = value;
    }
    /**
     * Get the maxTruePeak of audio stream
     * @type {number}
     */
    get maxTruePeak(){
        return this._maxTruePeak
    }
    /**
     * Set dialog, if stream is currently a dialog or not
     * @type {boolean}
     */
    set dialog(value){
        this._dialog = value;
    }
    /**
     * Get dialog, if stream is currently a dialog or not
     * @type {boolean}
     */
    get dialog(){
        return this._dialog
    }
    /**
     * Set ambiance, if stream is currently an ambiance or not
     * @type {boolean}
     */
    set ambiance(value){
        this._ambiance = value;
    }
    /**
     * Get ambiance, if stream is currently an ambiance or not
     * @type {boolean}
     */
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
