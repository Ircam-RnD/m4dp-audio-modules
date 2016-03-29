/************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      This class mutes/unmutes the incoming streams according to the checkbox selections
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';
import utilities from '../core/utils.js';

export default class StreamSelector extends AbstractNode {
    //==============================================================================
    /**
     * @brief This class mutes/unmutes the incoming streams according to the checkbox selections
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection
     */
    constructor(audioContext, 
                audioStreamDescriptionCollection = undefined){
        super(audioContext, audioStreamDescriptionCollection);
        this._splitterNode = undefined;
        this._mergerNode = undefined;
        this._gainNode = [];
        this._isBypass = false;

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        const totalNumberOfChannels_ = this.getTotalNumberOfChannels();

        /// sanity check
        /// mainAudio (2) + extendedAmbience (6) + extendedComments (1) + extendedDialogs (1) = 10
        if( totalNumberOfChannels_ != 10 ){
            throw new Error("Ca parait pas bon...");
        }

        this._splitterNode = audioContext.createChannelSplitter( totalNumberOfChannels_ );
        
        this._mergerNode = audioContext.createChannelMerger( totalNumberOfChannels_ );

        /// sanity checks
        if( this._splitterNode.numberOfInputs != 1 
            || this._splitterNode.numberOfOutputs != totalNumberOfChannels_ ){
            throw new Error("Pas bon");
        }

        /// sanity checks
        if( this._mergerNode.numberOfInputs != totalNumberOfChannels_ 
            || this._mergerNode.numberOfOutputs != 1 ){
            throw new Error("Pas bon");
        }        

        /// create N gainNodes
        for( let i = 0; i < totalNumberOfChannels_; i++ ){
            const newGainNode = audioContext.createGain();
            this._gainNode.push( newGainNode );
        }
        
        this._updateAudioGraph();
    }

    //==============================================================================
    getTotalNumberOfChannels(){
        return this._audioStreamDescriptionCollection.totalNumberOfChannels;
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
     * Notification when the active stream(s) changes
     * (i.e. whenever a check box is modified)
     */
    activeStreamsChanged(){
        this._update();
    }

    streamsTrimChanged(){
        this._update();
    }

    //==============================================================================
    /**
     * Mute/unmute the streams, depending on the user selection
     * in the check boxes
     */
    _update(){

        /// retrieves the AudioStreamDescriptionCollection
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        const asdc = this._audioStreamDescriptionCollection.streams;
        
        var channelIndex = 0;

        /// go through all the streams and mute/unmute according to their 'active' flag
        for (let stream of asdc){

            const isActive = stream.active;

            /// linear gain value
            const gainValue = ( isActive ? 1.0 : 0.0 );

            const trimIndB = stream.trim;
            const trimLevel = utilities.dB2lin( trimIndB );

            const overallGain = gainValue * trimLevel;

            const numChannelsForThisStream = stream.numChannels;

            for( let i = 0; i < numChannelsForThisStream; i++ ){

                if( channelIndex >= this._gainNode.length ){
                    throw new Error("Y'a un bug qq part...");
                }

                this._gainNode[ channelIndex ].gain.value = overallGain;

                channelIndex++;                
            }
        }
        
    }

    //==============================================================================
    /**
     * Updates the connections of the audio graph
     */
    _updateAudioGraph(){

        const totalNumberOfChannels_ = this.getTotalNumberOfChannels();

        /// first of all, disconnect everything
        this._input.disconnect();
        this._splitterNode.disconnect();
        for( let i = 0; i < totalNumberOfChannels_; i++ ){
            this._gainNode[i].disconnect();
        }
        this._mergerNode.disconnect();

        if( this.bypass === true || totalNumberOfChannels_ === 0 ){
            this._input.connect( this._output );
        }
        else{
            /// split the input streams into N independent channels
            this._input.connect( this._splitterNode );
            
            /// connect a gainNode to each channel
            for( let i = 0; i < totalNumberOfChannels_; i++ ){
                this._splitterNode.connect( this._gainNode[i], i );
            }
            
            /// then merge the output of the N gainNodes
            for( let i = 0; i < totalNumberOfChannels_; i++ ){
                this._gainNode[i].connect( this._mergerNode, 0, i );
            }

            this._mergerNode.connect( this._output );
        }
    }
}
