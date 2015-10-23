import AbstractNode from '../core/index.js';


export default class MultichannelSpatialiser extends AbstractNode {
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
     */
    set outputType(value){
        this._outputType = value;
    }
    /**
     * Get outputType: 'headphone' or 'speaker'
     */
    get outputType(){
        return this._outputType
    }
    /**
     * Set audio streams description (json)
     */
    set audioStreamsDescription(value){

    }
    /**
     * Get audio streams description
     */
    get audioStreamsDescription(){
        return _audioStreamsDescription;
    }
    /**
     * Set hrtf
     * @todo: which kind of value, json?
     */
    set hrtf(value){
        this._hrtf = value;
    }
    /**
     * Get hrtf
     */
    get hrtf(){
        return this._hrtf;
    }
    /**
     * Set eqPreset
     * @todo: which kind of value, json?
     * @todo: set it to none to not appy any eq?
     */
    set eqPreset(value){
        this._eqPreset = value;
    }
    /**
     * Get eqPreset
     */
    get eqPreset(){
        return this._eqPreset;
    }
    /**
     * Set offsetGain
     */
    set offsetGain(value){
        this._offsetGain = value;
    }
    /**
     * Get offsetGain
     */
    get offsetGain(){
        return this._offsetGain;
    }
    /**
     * Set listeningAxis
     */
    set listeningAxis(value){
        this._listeningAxis = value;
    }
    /**
     * Get listeningAxis
     */
    get listeningAxis(){
        return this._listeningAxis;
    }
}
