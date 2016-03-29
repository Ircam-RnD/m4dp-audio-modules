/************************************************************************************/
/*!
 *   @file       compressor.js
 *   @brief      This class implements a multichannel Compressor
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';

export default class MultichannelCompressorNode extends AbstractNode {
    //==============================================================================
    /**
     * @brief This class implements a multichannel Compressor
     *        The compressor affects all channel similarly
     *
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {int} numChannels - number of channels to instanciate
     *
     * @details It turns out the standard DynamicsCompressorNode from the WAA 
     *          does some weird stuff when the number of channels is 10 ( > 5.1 ?? )
     *
     *  So we created this class which just instanciate 10 mono compressor nodes in parallel
     *
     *  NB : the issues with DynamicsCompressorNode might come from the fact that 
     *  its default Channel count mode is "explicit"
     *  It could be possible (but not tested), to solve the issue
     *  by specifying : 
     *  DynamicsCompressorNode.channelCountMode = "max"
     *  DynamicsCompressorNode.channelCount = 10;
     *
     */
    constructor( audioContext,
                 numChannels = 10 ){
        super( audioContext );
        this._compressorNodes = [];
        this._splitterNode = undefined;
        this._mergerNode = undefined;
        this._isBypass = false;

        /// sanity checks
        if( numChannels <= 0 ){
            throw new Error("Pas bon");
        }

        this._splitterNode = audioContext.createChannelSplitter( numChannels );
        
        this._mergerNode = audioContext.createChannelMerger( numChannels );

        /// sanity checks
        if( this._splitterNode.numberOfInputs != 1 
            || this._splitterNode.numberOfOutputs != numChannels ){
            throw new Error("Pas bon");
        }

        /// sanity checks
        if( this._mergerNode.numberOfInputs != numChannels 
            || this._mergerNode.numberOfOutputs != 1 ){
            throw new Error("Pas bon");
        }        

        /// create N compressorNodes
        for( let i = 0; i < numChannels; i++ ){
            const newCompressorNode = audioContext.createDynamicsCompressor();
            this._compressorNodes.push( newCompressorNode );
        }
        
        this._updateAudioGraph();
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
    getNumChannels(){
        return this._compressorNodes.length;
    }

    //==============================================================================
    getCompressorOfFirstChannel(){

        if( this.getNumChannels() <= 0 ){
            throw new Error( "smothing is wrong" );
        }

        return this._compressorNodes[0];
    }

    //==============================================================================
    getReductionForChannel( channelIndex ){

        /// representing the amount of gain reduction currently applied by the compressor to the signal.

        const numChannels = this.getNumChannels();

        if( channelIndex < 0 || channelIndex >= numChannels ){
            throw new Error( "Invalid channel index : " + channelIndex );
        }

        return this._compressorNodes[ channelIndex ].reduction.value;
    }

    //==============================================================================
    getReduction(){

        /// returns the minimum reduction among all channels
        var reduction = 0.0;

        const numChannels = this.getNumChannels();

        for( let i = 0; i < numChannels; i++ ){

            const reductionForThisChannel = this.getReductionForChannel( i );

            reduction = Math.min( reduction, reductionForThisChannel );
        }

        return reduction;
    }

    //==============================================================================
    setThreshold( value ){
        /// the parameter is applied similarly to all channels

        const numChannels = this.getNumChannels();

        for( let i = 0; i < numChannels; i++ ){
            this._compressorNodes[i].threshold.value = value;
        }
    }

    getThreshold(){
        /// the parameter is the same for all channels

        return this.getCompressorOfFirstChannel().threshold.value;
    }

    //==============================================================================
    setRatio( value ){
        /// the parameter is applied similarly to all channels

        const numChannels = this.getNumChannels();

        for( let i = 0; i < numChannels; i++ ){
            this._compressorNodes[i].ratio.value = value;
        }
    }

    getRatio(){
        /// the parameter is the same for all channels

        return this.getCompressorOfFirstChannel().ratio.value;
    }

    //==============================================================================
    setAttack( value ){
        /// the parameter is applied similarly to all channels

        const numChannels = this.getNumChannels();

        for( let i = 0; i < numChannels; i++ ){
            this._compressorNodes[i].attack.value = value;
        }
    }

    getAttack(){
        /// the parameter is the same for all channels

        return this.getCompressorOfFirstChannel().attack.value;
    }

    //==============================================================================
    setRelease( value ){
        /// the parameter is applied similarly to all channels

        const numChannels = this.getNumChannels();

        for( let i = 0; i < numChannels; i++ ){
            this._compressorNodes[i].release.value = value;
        }
    }

    getRelease(){
        /// the parameter is the same for all channels

        return this.getCompressorOfFirstChannel().release.value;
    }


    //==============================================================================
    /**
     * Updates the connections of the audio graph
     */
    _updateAudioGraph(){

        const numChannels = this.getNumChannels();

        /// first of all, disconnect everything
        this._input.disconnect();
        this._splitterNode.disconnect();
        this._mergerNode.disconnect();
        for( let i = 0; i < numChannels; i++ ){
            this._compressorNodes[ i ].disconnect();
        }

        if( this.bypass === true || numChannels === 0 ){
            
            this._input.connect( this._output );

        }
        else{
            
            /// split the input streams into N independent channels
            this._input.connect( this._splitterNode );
            
            /// connect a compressorNodes to each channel
            for( let i = 0; i < numChannels; i++ ){
                this._splitterNode.connect( this._compressorNodes[i], i );
            }
            
            /// then merge the output of the N compressorNodes
            for( let i = 0; i < numChannels; i++ ){
                this._compressorNodes[i].connect( this._mergerNode, 0, i );
            }

            this._mergerNode.connect( this._output );

        }
    }
}

