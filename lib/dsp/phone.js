/************************************************************************************/
/*!
 *   @file       phone.js
 *   @brief      This class implements the voice enhancement node
 *   @author     Thibaut Carpentier, Jean-Philippe Lambert
 *   @date       04/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';
import CascadeNode from '../dsp/cascade.js';

export default class PhoneNode extends CascadeNode
{
    //==============================================================================
    /**
     * @brief This class implements the phone effect, for boosting the frequencies of the voice.
     *        It applies filtering on any number of channels
     *        The filtering is based on parametric filters (BiquadFilterNode).
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */
    constructor( audioContext )
    {
        super( audioContext );

        // default values
        this._gain = 0; // in dB
        this._frequency = 1200; // in hertz (in-between 300 and 4800)
        this._q = 1;

        super.numCascades = 1; // add more for steeper boost
        super.setType( 0, 'peaking' );
        this._updateCascades();
    }

    //==============================================================================
    /**
     * Set the boost gain. It has a default value of 0 and can take a value in a nominal range of -40 to 40
     * @type {number} gainRequest : the gain in dB (0 for no gain)
     */
    set gain( gainRequest )
    {
        this._gain = gainRequest;
        this._updateCascades();
    }

    /**
     * Get the boost gain.
     * @type {number} boost
     */
    get gain()
    {
        return this._gain;
    }

    //==============================================================================
    /**
     * Set the central frequency.
     * @type {number} frequencyRequest : the central frequency in hertz
     */
    set frequency( frequencyRequest )
    {
        this._frequency = frequencyRequest;
        this._updateCascades();
    }

    /**
     * Get the central frequency.
     * @type {number} frequency
     */
    get frequency()
    {
        return this._frequency;
    }

    //==============================================================================
    /**
     * Set the Q factor.
     * @type {number} qRequest : dimensionless in [0.0001, 1000.], 1 is default.
     */
    set q( qRequest )
    {
        this._q = qRequest;
        this._updateCascades();
    }

    /**
     * Get the Q factor.
     * @type {number} q
     */
    get q()
    {
        return this._q;
    }

    //==============================================================================
    /**
     * Set the number of cascading filters.
     * @type {number} numCascadesRequest : 1 is the default.
     */
    set numCascades( numCascadesRequest )
    {
        super.numCascades = numCascadesRequest;
        for( let c = 0; c < super.numCascades; ++c )
        {
            super.setType( c, 'peaking' );
        }
        this._updateCascades();
    }

    /**
     * Get the number of cascading filters.
     * @type {number} numCascades
     */
    get numCascades()
    {
        return super.numCascades;
    }

    //==============================================================================
    _updateCascades()
    {
        const gain = this._gain / super.numCascades;
        for( let c = 0; c < super.numCascades; ++c )
        {
            super.setGain( c, gain );
            super.setFrequency( c, this._frequency );
            super.setQ( c, this._q );
        }
    }

}








