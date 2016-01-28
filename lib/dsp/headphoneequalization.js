import AbstractNode from '../core/index.js';
import CascadeNode from '../dsp/cascade.js';

export default class HeadphonesEqualization extends CascadeNode {
    //==============================================================================
    /**
     * @brief This class implements the headphone equalization.
     *        It thus applies filtering on 2 channels (2 in, 2 out)
     *        The filtering is based on parametric filters (BiquadFilterNode); various settings are hard-coded
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */
    constructor( audioContext ){
        super( audioContext );
        this._eqPreset = "none";
    }

    //==============================================================================
    /**
     * Set eqPreset
     * @todo: which kind of value, json?
     * @todo: set it to none to not appy any eq?
     * @type {EqPreset}
     */
    set eqPreset(value){
        this._eqPreset = value;
        this._updateCascade();
    }
    /**
     * Get eqPreset
     * @type {EqPreset}
     */
    get eqPreset(){
        return this._eqPreset;
    }

    //==============================================================================
    _updateCascade(){

        const preset = this.eqPreset;

        if( preset === "none" ){
            super.numCascades = 0;
            super.resetAllBiquads();
        }
        else if( preset === "eq1" ){

            /// whatever settings... waiting for FTV to communicate their specifications

            super.numCascades = 3;
            super.resetAllBiquads();

            super.setType( 0, "highpass" );
            super.setType( 1, "peaking" );
            super.setType( 2, "lowpass" );

            /// It is expressed in dB, has a default value of 0 and can take a value in a nominal range of -40 to 40
            super.setGain( 0, -12 );
            super.setGain( 1, 6 );
            super.setGain( 2, -16 );

            /// measured in hertz (Hz)
            super.setFrequency( 0, 200 );
            super.setFrequency( 1, 1000 );
            super.setFrequency( 2, 4000 );

            /// It is a dimensionless value with a default value of 1 and a nominal range of 0.0001 to 1000.
            super.setQ( 0, 1 );
            super.setQ( 1, 2 );
            super.setQ( 2, 1 );
        }
        else{
            throw new Error( "Invalid preset name " + preset );
        }

    }

}
