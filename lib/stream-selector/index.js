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
import MultichannelGainNode from '../dsp/multichannelgain.js'

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
        this._gainsNode = 'undefined';

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        const totalNumberOfChannels_ = this.getTotalNumberOfChannels();

        /// sanity check
        /// mainAudio (2) + extendedAmbience (6) + extendedComments (1) + extendedDialogs (1) = 10
        if( totalNumberOfChannels_ != 10 ){
            throw new Error("Ca parait pas bon...");
        }

		this._gainsNode = new MultichannelGainNode( audioContext, totalNumberOfChannels_ );
        
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
        this._gainsNode.bypass = value;
    }

    /**
     * Returns true if the processor is bypassed
     */
    get bypass(){
        return this._gainsNode.bypass;
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

            const trimIndB  = stream.trim;
            const trimLevel = utilities.dB2lin( trimIndB );

            const overallGain = gainValue * trimLevel;

            const numChannelsForThisStream = stream.numChannels;

            for( let i = 0; i < numChannelsForThisStream; i++ ){

                if( channelIndex >= this._gainsNode.getNumChannels() ){
                    throw new Error("Y'a un bug qq part...");
                }

				this._gainsNode.setGain( channelIndex, overallGain );

                channelIndex++;                
            }
        }
        
    }

    //==============================================================================
    /**
     * Updates the connections of the audio graph
     */
    _updateAudioGraph(){

		/// first of all, disconnect everything
        this._input.disconnect();
        this._gainsNode.disconnect();

		this._input.connect( this._gainsNode._input );
		this._gainsNode.connect( this._output );

    }
}
