/************************************************************************************/
/*!
 *   @file       multichannelgain.js
 *   @brief      This class implements a multichannel GainNode
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';
import utilities from '../core/utils.js';

export default class MultichannelGainNode extends AbstractNode
{
    //==============================================================================
    /**
     * @brief This class implements a multichannel GainNode
     *        Each channel can have independent gain level
     *
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {int} numChannels - number of channels to instanciate
     *
     *
     */
    constructor( audioContext,
                 numChannels = 10 )
    {
        super( audioContext );
        this._gainNodes = [];
        this._splitterNode = undefined;
        this._mergerNode = undefined;
        this._isBypass = false;
        
        /// sanity checks
        if( numChannels <= 0 )
        {
            throw new Error("Pas bon");
        }

        this._splitterNode = audioContext.createChannelSplitter( numChannels );
        
        this._mergerNode = audioContext.createChannelMerger( numChannels );

        /// sanity checks
        if( this._splitterNode.numberOfInputs != 1 
            || this._splitterNode.numberOfOutputs != numChannels )
        {
            throw new Error("Pas bon");
        }

        /// sanity checks
        if( this._mergerNode.numberOfInputs != numChannels 
            || this._mergerNode.numberOfOutputs != 1 )
        {
            throw new Error("Pas bon");
        }        

        /// create N gainNodes
        for( let i = 0; i < numChannels; i++ )
        {
            const newGainNode = audioContext.createGain();
            this._gainNodes.push( newGainNode );
        }
        
        /// create the audio graph
        this._updateAudioGraph();
    }


    //==============================================================================
    /**
     * Enable or bypass the processor
     * @type {boolean}
     */
    set bypass( value )
    {
        if( value !== this._isBypass )
        {
            this._isBypass = value;
            this._updateAudioGraph();
        }
    }

    /**
     * Returns true if the processor is bypassed
     */
    get bypass()
    {
        return this._isBypass;
    }

    //==============================================================================
	/**
     * Returns the current number of channels
     */
    getNumChannels()
    {
        return this._gainNodes.length;
    }

    //==============================================================================
    /**
     * Sets the same gain to all channels
     * @param {float} value: linear gain
     */
    setAllGains( value )
    {
        for( let k = 0; k < this.getNumChannels(); k++ )
        {
            this.setGain( k, value );
        }

    }

    //==============================================================================
    /**
     * Sets the gain of the i-th channel
     * @param {int} channelIndex
     * @param {float} value: linear gain
     */
    setGain( channelIndex, value )
    {
        /// boundary check
        if( channelIndex < 0 || channelIndex >= this.getNumChannels() )
        {
            throw new Error("Invalid channelIndex");
        }

		this._gainNodes[ channelIndex ].gain.value = value;
    }

    /**
     * Returns the gain of the i-th channel
     * @param {int} channelIndex
     */
    getGain( channelIndex )
    {
        /// boundary check
        if( channelIndex < 0 || channelIndex >= this.getNumChannels() )
        {
            throw new Error("Invalid channelIndex");
        }

        return this._gainNodes[ channelIndex ].gain.value;
    }

    //==============================================================================
    /**
     * Updates the connections of the audio graph
     */
    _updateAudioGraph()
    {

        const numChannels = this.getNumChannels();

        /// first of all, disconnect everything
        this._input.disconnect();
        this._splitterNode.disconnect();
        this._mergerNode.disconnect();
        for( let i = 0; i < numChannels; i++ )
        {
            this._gainNodes[ i ].disconnect();
        }

        if( this.bypass === true || numChannels === 0 )
        {
            this._input.connect( this._output );
        }
        else
        {
            
			/// split the input streams into N independent channels
            this._input.connect( this._splitterNode );
            
            /// connect a gainNode to each channel
            for( let i = 0; i < numChannels; i++ )
            {
                this._splitterNode.connect( this._gainNodes[i], i );
            }
            
            /// then merge the output of the N gainNodes
            for( let i = 0; i < numChannels; i++ )
            {
                this._gainNodes[i].connect( this._mergerNode, 0, i );
            }

            this._mergerNode.connect( this._output );
        }

    }
}

