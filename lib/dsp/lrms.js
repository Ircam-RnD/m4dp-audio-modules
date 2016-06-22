/************************************************************************************/
/*!
 *   @file       lrms.js
 *   @brief      LR to MS or MS to LR
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';
import SumDiffNode from './sumdiff.js'

export default class LRMSNode extends AbstractNode
{
    //==============================================================================
    /**
     * @brief LR to MS or MS to LR
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */
    constructor( audioContext )
    {
        super( audioContext );
        this._gainNode = undefined;
        this._sumdiff  = undefined;

        /// The class has 2 input signals and 2 output signals
        /// It performs the following processing : 
        /// out[0] = ( in[0] + in[1] ) / 2
        /// out[1] = ( in[0] - in[1] ) / 2

        /// M = ( L + R ) / 2
        /// S = ( L - R ) / 2
        ///
        /// L = ( M + S ) / 2 
        /// R = ( M - S ) / 2

        this._gainNode = this._audioContext.createGain();
        //this._gainNode.gain.value = 0.5;
        this._gainNode.gain.value = 0.707;

        this._sumdiff = new SumDiffNode( audioContext );

        this._input.connect( this._sumdiff._input );

        this._sumdiff.connect( this._gainNode );

        this._gainNode.connect( this._output );
    }

}