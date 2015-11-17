import AbstractNode from '../core/index.js';


export default class NoiseAdaptation extends AbstractNode {
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
     * @param {boolean} headphone - true is headphone, else, false.
     */
    constructor(audioContext, audioStreamDescriptionCollection, headphone = false){
        super(audioContext, audioStreamDescriptionCollection);
        this._headphone = headphone;
    }
    /**
     * Process:
     * @todo: track noise, add compression, improve voice if no headphone
     */
    _process(){

    }
    /**
     * Set headphone - true is headphone, else, false.
     * @type {boolean}
     */
    set headphone(value){
        this._headphone = value
    }
    /**
     * Get headphone, return True if headphone is connected, else, false
     * @type {boolean}
     */
    get headphone(){
        return this._headphone;
    }
}
