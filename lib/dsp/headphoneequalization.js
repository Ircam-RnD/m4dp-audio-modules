/************************************************************************************/
/*!
 *   @file       headphoneequalization.js
 *   @brief      This class implements the headphone equalization node
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';
import CascadeNode from '../dsp/cascade.js';

export default class HeadphonesEqualization extends CascadeNode
{
    //==============================================================================
    /**
     * @brief This class implements the headphone equalization.
     *        It thus applies filtering on 2 channels (2 in, 2 out)
     *        The filtering is based on parametric filters (BiquadFilterNode); various settings are hard-coded
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */
    constructor( audioContext )
    {
        super( audioContext );
        this._eqPreset = 'none';
    }

    //==============================================================================
    /**
     * Loads a new headphones equalization preset
     * @type {string} value : the name of the preset (they are hard-coded) 
     */
    set eqPreset( presetName )
    {
        this._eqPreset = presetName;
        this._updateCascade();
    }

    /**
     * Returns the name of the current headphones equalization preset
     * @type {string}
     */
    get eqPreset()
    {
        return this._eqPreset;
    }

    //==============================================================================
    _updateCascade()
    {

        const presetName = this.eqPreset;

        if( presetName === 'none' )
        {
            super.numCascades = 0;
            super.resetAllBiquads();
        }
        else if( presetName === 'eq1' )
        {

            /// whatever settings... waiting for FTV to communicate their specifications

            super.numCascades = 3;
            super.resetAllBiquads();

            super.setType( 0, 'highpass' );
            super.setType( 1, 'peaking' );
            super.setType( 2, 'lowpass' );

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
        else
        {
            throw new Error( 'Invalid preset name ' + presetName );
        }

    }

}
