/************************************************************************************/
/*!
 *   @file       centerenhancement.js
 *   @brief      Enhance the center channel : Start from LR signals, do MS conversion
 *               apply filtering in M, then do MS to LR conversion
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';
import LRMSNode from './lrms.js'
import PhoneNode from './phone.js'

export default class CenterEnhancementNode extends AbstractNode {
    //==============================================================================
    /**
     * @brief Enhance the center channel
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */
    constructor( audioContext ){
        super( audioContext );
        this._lr2ms = undefined;
        this._phone = undefined;
        this._ms2lr = undefined;

        /// The class has 2 input signals and 2 output signals
        /// It performs the following processing : 
        /// Start from LR signals, do MS conversion
        /// apply filtering in M, then do MS to LR conversion

        this._lr2ms = new LRMSNode( audioContext );
        this._ms2lr = new LRMSNode( audioContext );
        this._phone = new PhoneNode( audioContext );

        this._channelSplitterNode = this._audioContext.createChannelSplitter(2);
        this._channelMergerNode   = this._audioContext.createChannelMerger(2);

        /// first convert from LR to MS
        this._input.connect( this._lr2ms._input );

        /// split M and S
        this._lr2ms.connect( this._channelSplitterNode );

        /// connect the M to the phone filter
        this._channelSplitterNode.connect( this._phone._input, 0, 0 );

        /// connect the output of the phone filter to the 1st outlet
        this._phone.connect( this._channelMergerNode, 0, 0 );

        /// the S signal is unaffected
        this._channelSplitterNode.connect( this._channelMergerNode, 1, 1 );

        /// merge back the M and S
        this._channelMergerNode.connect( this._ms2lr._input );

        /// and perform MS to LR conversion
        this._ms2lr.connect( this._output );

    }

    //==============================================================================
    /**
     * Set the boost gain. It has a default value of 0 and can take a value in a nominal range of -40 to 40
     * @type {number} gainRequest : the gain in dB (0 for no gain)
     */
    set gain( gainRequest ){
        this._phone.gain = gainRequest;        
    }

    /**
     * Get the boost gain.
     * @type {number} boost
     */
    get gain(){
        return this._phone.gain;
    }
}