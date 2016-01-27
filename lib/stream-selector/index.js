import AbstractNode from '../core/index.js';

export default class StreamSelector extends AbstractNode {
    /**
     * @brief This class mutes/unmutes the incoming streams according to the checkbox selections
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection
     */
    constructor(audioContext, audioStreamDescriptionCollection = undefined){
        super(audioContext, audioStreamDescriptionCollection);
        this._splitterNode = undefined;
        this._mergerNode = undefined;
        this._gainNode = [];

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        const totalNumberOfChannels_ = this._audioStreamDescriptionCollection.totalNumberOfChannels;

        this._splitterNode = audioContext.createChannelSplitter( totalNumberOfChannels_ );
        
        this._mergerNode = audioContext.createChannelMerger( totalNumberOfChannels_ );

        /// create 10 gainNodes
        for( let i = 0; i < totalNumberOfChannels_; i++ ){
            const newGainNode = audioContext.createGain();
            this._gainNode.push( newGainNode );
        }
        
        /// split the input streams into 10 independent channels
        this.input.connect( this._splitterNode );
        
        /// connect a gainNode to each channel
        for( let i = 0; i < totalNumberOfChannels_; i++ ){
            this._splitterNode.connect( this._gainNode[i], i );
        }
        
        /// then merge the output of the 10 gainNodes
        for( let i = 0; i < totalNumberOfChannels_; i++ ){
            this._gainNode[i].connect( this._mergerNode, 0, i );
        }

        this._mergerNode.connect( this._output );
    }


    /**
     * Notification when the active stream(s) changes
     * (i.e. whenever a check box is modified)
     */
    activeStreamsChanged(){
        this._update();
    }

    /**
     * Mute/unmute the streams, depending on the user selection
     * in the check boxes
     */
    _update(){

        /// retrieves the AudioStreamDescriptionCollection
        const asdc = this._audioStreamDescriptionCollection.streams;
        
        var channelIndex = 0;

        /// go through all the streams and mute/unmute according to their 'active' flag
        for (let stream of asdc){

            const isActive = stream.active;

            const gainValue = ( isActive ? 1.0 : 0.0 );

            const numChannelsForThisStream = stream.numChannels;

            for( let i = 0; i < numChannelsForThisStream; i++ ){

                this._gainNode[ channelIndex ].gain.value = gainValue;

                channelIndex++;                
            }
        }
        
    }
}