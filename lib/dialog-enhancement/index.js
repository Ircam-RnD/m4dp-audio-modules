import AbstractNode from '../core/index.js';


export default class DialogEnhancement extends AbstractNode {
    /**
     * Constructor
     * audioContext, audioStreamsDescription, mode, dialogGain
     */
    constructor(audioContext, audioStreamsDescription, mode, dialogGain){
        super(audioContext);
        this._mode = mode;
        this._audioStreamsDescription = audioStreamsDescription;
    }
    /**
     * Set Mode
     * @param {number} value - 1, 2 or 3
     */
    set mode(value){
        this._mode = value;
    }
    /**
     * Get Mode
     */
    get mode(){
        return this._mode;
    }
    /**
     * Set audioStreamsDescription
     */
    set audioStreamsDescription(value){
        this._audioStreamsDescription = value;
    }
    /**
     * Get audioStreamsDescription
     */
    get audioStreamsDescription(){
        return this._audioStreamsDescription;
    }
    /**
     * Set dialogGain
     */
    set dialogGain(value){
        this._dialogGain = value;
    }
    /**
     * Get dialogGain
     */
    get dialogGain(){
        return this._dialogGain;
    }
}
