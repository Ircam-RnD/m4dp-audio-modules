/************************************************************************************/
/*!
 *   @file       cascade.js
 *   @brief      This class implements a cascade of BiquadFilterNodes
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';

export default class CascadeNode extends AbstractNode {
    /**
     * @brief This class implements a cascade of BiquadFilterNodes
     *        The filtering affects all channel similarly
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */
    constructor( audioContext ){
        super( audioContext );
        this._isBypass = false; 
        this._biquadNodes = [];

        /// by default, 0 cascades.
        /// this will also update the audio graph
        this.numCascades = 0;
    }

    //==============================================================================
    /**
     * Enable or bypass the processor
     * @type {boolean}
     */
    set bypass( value ){

        if( value !== this._isBypass ){
            this._isBypass = value;
            this._updateAudioGraph();
        }
    }

    /**
     * Returns true if the processor is bypassed
     */
    get bypass(){
        return this._isBypass;
    }

    //==============================================================================
    /**
     * Sets the frequency of the i-th biquad in the cascade
     * @param {int} biquadIndex
     * @param {float} value
     */
    setFrequency( biquadIndex, value ){

        /// boundary check
        if( biquadIndex < 0 || biquadIndex >= this.numCascades ){
            throw new Error("Invalid biquadIndex");
        }

        this._biquadNodes[ biquadIndex ].frequency.value = value;
    }

    /**
     * Returns the frequency of the i-th biquad in the cascade
     * @param {int} biquadIndex
     */
    getFrequency( biquadIndex ){
        
        /// boundary check
        if( biquadIndex < 0 || biquadIndex >= this.numCascades ){
            throw new Error("Invalid biquadIndex");
        }

        return this._biquadNodes[ biquadIndex ].frequency;
    }

    //==============================================================================
    /**
     * Sets the Q of the i-th biquad in the cascade
     * @param {int} biquadIndex
     * @param {float} value
     */
    setQ( biquadIndex, value ){

        /// boundary check
        if( biquadIndex < 0 || biquadIndex >= this.numCascades ){
            throw new Error("Invalid biquadIndex");
        }

        this._biquadNodes[ biquadIndex ].Q.value = value;
    }

    /**
     * Returns the Q of the i-th biquad in the cascade
     * @param {int} biquadIndex
     */
    getQ( biquadIndex ){
        
        /// boundary check
        if( biquadIndex < 0 || biquadIndex >= this.numCascades ){
            throw new Error("Invalid biquadIndex");
        }

        return this._biquadNodes[ biquadIndex ].Q;
    }

    //==============================================================================
    /**
     * Sets the gain of the i-th biquad in the cascade
     * @param {int} biquadIndex
     * @param {float} value
     */
    setGain( biquadIndex, value ){

        /// boundary check
        if( biquadIndex < 0 || biquadIndex >= this.numCascades ){
            throw new Error("Invalid biquadIndex");
        }

        this._biquadNodes[ biquadIndex ].gain.value = value;
    }

    /**
     * Returns the gain of the i-th biquad in the cascade
     * @param {int} biquadIndex
     */
    getGain( biquadIndex ){
        
        /// boundary check
        if( biquadIndex < 0 || biquadIndex >= this.numCascades ){
            throw new Error("Invalid biquadIndex");
        }

        return this._biquadNodes[ biquadIndex ].gain;
    }

    //==============================================================================
    /**
     * Sets the type of the i-th biquad in the cascade
     * @param {int} biquadIndex
     * @param {string} value
     */
    setType( biquadIndex, value ){

        /// boundary check
        if( biquadIndex < 0 || biquadIndex >= this.numCascades ){
            throw new Error("Invalid biquadIndex");
        }

        this._biquadNodes[ biquadIndex ].type = value;
    }

    /**
     * Returns the type of the i-th biquad in the cascade
     * @param {int} biquadIndex
     */
    getType( biquadIndex ){
        
        /// boundary check
        if( biquadIndex < 0 || biquadIndex >= this.numCascades ){
            throw new Error("Invalid biquadIndex");
        }

        return this._biquadNodes[ biquadIndex ].type;
    }

    //==============================================================================
    /**
     * Resets one biquad to its default
     * @param {int} biquadIndex
     */    
    resetBiquad( biquadIndex ){

        /// boundary check
        if( biquadIndex < 0 || biquadIndex >= this.numCascades ){
            throw new Error("Invalid biquadIndex");
        }

        this.setType( biquadIndex, "lowpass" );
        this.setGain( biquadIndex, 0.0 );
        this.setFrequency( biquadIndex, 350 );
        this.setQ( biquadIndex, 1 );
    }

    /**
     * Resets all biquads
     */   
    resetAllBiquads(){

        const numCascades = this.numCascades;

        for( let i = 0; i < numCascades; i++ ){
            this.resetBiquad( i );
        }
    }

    //==============================================================================
    /**
     * Returns the number of biquads in the cascade
     */
    get numCascades(){
        return this._biquadNodes.length;
    }

    /**
     * Sets the number of cascades
     */
    set numCascades( newNumCascades ){

        const currentNumCascades = this.numCascades;

        if( newNumCascades > currentNumCascades ){

            for( let i = currentNumCascades; i < newNumCascades; i++ ){

                const newBiquadNode = this._audioContext.createBiquadFilter();

                this._biquadNodes.push( newBiquadNode );
            }

        }
        else if( newNumCascades < currentNumCascades ){

            this._biquadNodes.length = newNumCascades;

        }

        /// now update the audio connections
        this._updateAudioGraph();

    }

    //==============================================================================
    /**
     * Updates the connections of the audio graph
     */
    _updateAudioGraph(){

        const numCascades_ = this.numCascades;

        /// first of all, disconnect everything
        this.input.disconnect();
        for( let i = 0; i < numCascades_; i++ ){
            this._biquadNodes[ i ].disconnect();
        }

        if( this.bypass === true || numCascades_ === 0 ){
            this.input.connect( this._output );
        }
        else{
            /// connect the last element to the output
            this._biquadNodes[ numCascades_ - 1 ].connect( this._output );

            /// connect the cascades
            for( let i = numCascades_ - 1; i > 0; i-- ){
                this._biquadNodes[ i - 1 ].connect( this._biquadNodes[ i ] );
            }
            
            /// connect the 1st biquad to the input
            this.input.connect( this._biquadNodes[ 0 ] );
        }
    }
}
