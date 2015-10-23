import AbstractNode from '../core/index.js';


export default class NoiseAdaptation extends AbstractNode {
    constructor(audioContext, headphone = false){
        super(audioContext);
        this._headphone = headphone;
    }
    /**
     * Process:
     * @todo: track noise, add compression, improve voice if no headphone
     */
    _process(){

    }
    /**
     * Set headphone
     * @param {boolean} value - true is headphone, else, false.
     */
    set headphone(value){
        this._headphone = value
    }
    /**
     * Get headphone, return True if headphone is connected, else, false
     */
    get headphone(){
        return this._headphone;
    }
}
