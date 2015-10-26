/**
 * Template for other audio nodes: set the audioContext reference and provide connect/disconnect methods for the audio node.
 */
export default class AbstractNode {
    /**
     * AbstractNode constructor
     * @param {AudioContext} audioContext - audioContext instance.
     */
    constructor(audioContext){
        this._audioContext = audioContext;
        /**
         * @type {AudioNode}
         */
        this.input = this._audioContext.createGain();
        this._ouput = this._audioContext.createGain();
    }
    /**
     * Connect the audio node
     * @param {AudioNode} node - an AudioNode to connect to.
     */
    connect(node){
        this._ouput.connect(node)
    }
    /**
     * Disconnect the audio node
     * @param {AudioNode} node - an AudioNode to disconnect to.
     */
    disconnect(node){
        this._ouput.disconnect(node)
    }
}


/**
 * AudioStreamsDescription
 * @todo: to be defined
 * @typedef {Object} AudioStreamsDescription
 */

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
