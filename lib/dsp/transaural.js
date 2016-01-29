/************************************************************************************/
/*!
 *   @file       transaural.js
 *   @brief      This class implements the transaural decoder node(s)
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';

export default class TransauralNode extends AbstractNode {
    //==============================================================================
    /**
     * @brief This class implements a transaural decoder (abstract)
     *        Restricted to symmetrical speakers setup
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */
    constructor( audioContext ){
        super( audioContext );
        this._isBypass = false; 
        this.speakersSpan = 60;     
        /// span between speaker angles
        /// e.g. 60 corresponds to speakers at azimuth +/-30 deg

        this._updateAudioGraph();
    }

    //==============================================================================
    /**
     * Returns the span between speaker (angles in degress)
     * @type {number}
     */    
    get speakersSpan() {
        return this.speakersSpan;
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
     * Updates the connections of the audio graph
     */
    _updateAudioGraph(){

        if( this.bypass === true ){
            this.input.connect( this._output );
        }
        else{
            ///@todo a completer
        }
    }
}

export class TransauralFeedforwardNode extends TransauralNode {
    //==============================================================================
    /**
     * @brief This class implements a transaural decoder with feedforward topology
     *        Restricted to symmetrical speakers setup
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */
    constructor( audioContext ){
        super( audioContext );
        
    }


}
