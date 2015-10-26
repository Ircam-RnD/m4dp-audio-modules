import AbstractNode from '../core/index.js';


export default class MultichannelSpatialiser extends AbstractNode {
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
        super(audioContext);
        this._outputType = outputType;
        this._audioStreamsDescription = audioStreamsDescription;
        this._hrtf = hrtf;
        this._eqPreset = eqPreset;
        this._offsetGain = offsetGain;
        this._listeningAxis = listeningAxis;
    }
    /**
     * Set outputType: 'headphone' or 'speaker', 'multicanal'
     * @todo: automatic for 'multicanal' even if nb of speaker 'wrong'
     * @type {string}
     */
    set outputType(value){
        this._outputType = value;
    }
    /**
     * Get outputType: 'headphone' or 'speaker'
     * @type {string}
     */
    get outputType(){
        return this._outputType
    }
    /**
     * Set audio streams description (json)
     * @type {AudioStreamsDescription}
     */
    set audioStreamsDescription(value){

    }
    /**
     * Get audio streams description
     * @type {AudioStreamsDescription}
     */
    get audioStreamsDescription(){
        return _audioStreamsDescription;
    }
    /**
     * Set hrtf
     * @type {HRTF}
     * @todo: which kind of value, json?
     */
    set hrtf(value){
        this._hrtf = value;
    }
    /**
     * Get hrtf
     * @type {HRTF}
     */
    get hrtf(){
        return this._hrtf;
    }
    /**
     * Set eqPreset
     * @todo: which kind of value, json?
     * @todo: set it to none to not appy any eq?
     * @type {EqPreset}
     */
    set eqPreset(value){
        this._eqPreset = value;
    }
    /**
     * Get eqPreset
     * @type {EqPreset}
     */
    get eqPreset(){
        return this._eqPreset;
    }
    /**
     * Set offsetGain
     * @todo range
     * @type {number}
     */
    set offsetGain(value){
        this._offsetGain = value;
    }
    /**
     * Get offsetGain
     * @todo range
     * @type {number}
     */
    get offsetGain(){
        return this._offsetGain;
    }
    /**
     * Set listeningAxis
     * @todo value type? angle?
     * @type {number}
     */
    set listeningAxis(value){
        this._listeningAxis = value;
    }
    /**
     * Get listeningAxis
     * @type {number}
     */
    get listeningAxis(){
        return this._listeningAxis;
    }
}
