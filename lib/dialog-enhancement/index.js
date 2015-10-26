import AbstractNode from '../core/index.js';


export default class DialogEnhancement extends AbstractNode {
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamsDescription} audioStreamsDescription - audioStreamsDescription.
     * @param {number} mode - mode
     * @param {number} dialogGain - dialog gain
     */
    constructor(audioContext, audioStreamsDescription, mode, dialogGain){
        super(audioContext);
        this._mode = mode;
        this._audioStreamsDescription = audioStreamsDescription;
    }
    /**
     * Set Mode - value is 1, 2 or 3
     * @type {number}
     */
    set mode(value){
        this._mode = value;
    }
    /**
     * Get Mode - value is 1, 2 or 3
     * @type {number}
     */
    get mode(){
        return this._mode;
    }
    /**
     * Set audioStreamsDescription
     * @type {AudioStreamsDescription}
     */
    set audioStreamsDescription(value){
        this._audioStreamsDescription = value;
    }
    /**
     * Get audioStreamsDescription
     * @type {AudioStreamsDescription}
     */
    get audioStreamsDescription(){
        return this._audioStreamsDescription;
    }
    /**
     * Set dialogGain
     * @type {number}
     * @todo give range of accepted values
     */
    set dialogGain(value){
        this._dialogGain = value;
    }
    /**
     * Get dialogGain
     * @type {number}
     * @todo give range of accepted values
     */
    get dialogGain(){
        return this._dialogGain;
    }
}

