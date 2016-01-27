import AbstractNode from '../core/index.js';
import utilities from '../core/utils.js';
import CascadeNode from '../dsp/cascade.js';

export default class HeadphonesEqualization extends AbstractNode {
    /**
     * @brief This class implements the headphone equalization.
     *        It thus applies filtering on 2 channels (2 in, 2 out)
     *        The filtering is based on parametric filters (BiquadFilterNode); various settings are hard-coded
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */
    constructor( audioContext ){
        super( audioContext );
        this._isBypass = true;   
    }

    /**
     * Enable or bypass the headphone equalization
     * @type {boolean}
     */
    set bypass(value){
        this._isBypass = value;

        ///@todo a completer
    }

    /**
     * Returns true if the headphone equalization is bypassed
     */
    get bypass(){
        return this._isBypass;
    }


}
