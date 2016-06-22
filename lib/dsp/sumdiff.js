/************************************************************************************/
/*!
 *   @file       sumdiff.js
 *   @brief      Helper class for Transaural (shuffler)
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';

export default class SumDiffNode extends AbstractNode
{
    //==============================================================================
    /**
     * @brief Helper class for Transaural (shuffler)
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */
    constructor( audioContext )
    {
        super( audioContext );
        this._channelSplitterNode = undefined;

        /// The class has 2 input signals and 2 output signals
        /// It performs the following processing : 
        /// out[0] = in[0] + in[1]
        /// out[1] = in[0] - in[1]

        this._channelSplitterNode = this._audioContext.createChannelSplitter(2);
        this._channelMergerNode   = this._audioContext.createChannelMerger(2);

        this._input.connect( this._channelSplitterNode );

        /// a gain node used for -1 multiplication
        this._gainNode = this._audioContext.createGain();
        this._gainNode.gain.value = -1.0;

        this._channelSplitterNode.connect( this._gainNode, 1, 0 );
    
        /// out[0] = in[0] + in[1]
        this._channelSplitterNode.connect( this._channelMergerNode, 0, 0 );
        this._channelSplitterNode.connect( this._channelMergerNode, 1, 0 );

        /// out[1] = in[0] - in[1]
        this._channelSplitterNode.connect( this._channelMergerNode, 0, 1 );
        this._gainNode.connect( this._channelMergerNode, 0, 1 );

        this._channelMergerNode.connect( this._output );
    }

}