import AbstractNode from '../core/index.js';


export default class DialogEnhancement extends AbstractNode {
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
     * @param {number} mode - mode
     * @param {number} dialogGain - dialog gain
     */
    constructor(audioContext, audioStreamDescriptionCollection, mode, dialogGain){
        super(audioContext, audioStreamDescriptionCollection);
        this._mode = mode;
    }
    /**
     * Set Mode - value is 1, 2 or 3
     * @type {number}
     */
    set mode(value){
        // @todo error in some mode: eg. mode 1 and no dialog => "impossible"
        // error mode 2 et pas de 5.0 ou 5.1
        // error mode 3 et pas de stéréo
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
     * Set audioStreamDescriptionCollection
     * @type {AudioStreamDescriptionCollection}
     */
    set audioStreamDescriptionCollection(value){
        this._audioStreamDescriptionCollection = value;
    }
    /**
     * Get audioStreamDescriptionCollection
     * @type {AudioStreamDescriptionCollection}
     */
    get audioStreamDescriptionCollection(){
        return this._audioStreamDescriptionCollection;
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

