//==============================================================================
/**
 * Template for other audio nodes: set the audioContext reference and provide connect/disconnect methods for the audio node.
 */
export default class AbstractNode
{
    /**
     * AbstractNode constructor
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection instance.
     */
    constructor(audioContext, 
                audioStreamDescriptionCollection = undefined)
    {
        this._audioContext = audioContext;
        this._audioStreamDescriptionCollection = audioStreamDescriptionCollection;
        /**
         * @type {AudioNode}
         */
        this._input  = this._audioContext.createGain();
        this._output = this._audioContext.createGain();
    }

    //==============================================================================
    /**
     * Connect the audio node
     * @param {AudioNode} node - an AudioNode to connect to.
     */
    connect(node)
    {
        this._output.connect( node );
    }
    /**
     * Disconnect the audio node     
     */
    disconnect()
    {
        this._output.disconnect();
    }

    //==============================================================================
    /**
     * Returns the current sample rate of the audio context
     */
    getCurrentSampleRate()
    {
        return this._audioContext.sampleRate;
    }
}

//==============================================================================
/**
 * Container for AudioStreamDescription
 */
export class AudioStreamDescriptionCollection
{
    /**
     * AudioStreamDescriptionCollection constructor
     * @param {AudioStreamDescription[]} streams - array of AudioStreamDescription
     */
    constructor( streams )
    {
        this._streams = streams;
    }
    
    //==============================================================================
    /**
     * Set the stream description collection
     * @type {AudioStreamDescription[]}
     */
    set streams( streams )
    {
        this._streams = streams;
    }
    /**
     * Get the stream description collection
     * @type {AudioStreamDescription[]}
     */
    get streams()
    {
        return this._streams;
    }

    /**
     * Returns the number of streams in the collection
     */
    get numStreams()
    {
        return this._streams.length;
    }

	//==============================================================================
    /**
     * Returns the total number of channels (i.e. for all the streams)
     */
    get totalNumberOfChannels()
    {
        var totalNumberOfChannels_ = 0;
        for( let stream of this._streams )
        {
            totalNumberOfChannels_ += stream.numChannels;
        }
        return totalNumberOfChannels_;
    }

	//==============================================================================
    /**
     * Get the current active audio stream descriptions of the collection
     * @type {AudioStreamDescription[]}
     */
    get actives(){
        let actives = [];
        for (let stream of this._streams){
            if(stream.active){
                actives.push(stream);
            }
        }
        return actives;
    }
    
    /**
     * Returns true if at least one stream is currently active
     * @type {boolean}
     */
    get hasActiveStream(){
        for (let stream of this._streams){
            if( stream.active === true ){
                return true;
            }
        }
        return false;
    }

	//==============================================================================
    /**
     * Notification when the active stream(s) changes
     */
    activeStreamsChanged(){
        /// nothing to do in the base class
    }

    /**
     * Notification when the trim of stream(s) changes
     */
    streamsTrimChanged(){
        /// nothing to do in the base class   
    }

	//==============================================================================
    /**
     * Get the current dialog audio stream description of the collection
     * @type {AudioStreamDescription}
     */
    get extendedDialog(){
        for (let stream of this._streams){
            if( stream.isExtendedDialog === true ){
                return stream;
            }
        }
        return undefined;
    }

    /**
     * Returns true if there is at least one dialog among all the streams     
     */
    get hasExtendedDialog(){
        for (let stream of this._streams){
            if( stream.isExtendedDialog === true ){
                return true;
            }
        }
        return false;
    }

    /**
     * Returns true if there is at least one dialog among all the streams     
     */
    get hasActiveExtendedDialog(){
        for (let stream of this._streams){
            if( stream.isExtendedDialog === true && stream.active === true ){
                return true;
            }
        }
        return false;
    }

    //==============================================================================
    /**
     * Returns true if there is at least one ambiance among all the streams     
     */
    get hasExtendedAmbiance(){
        for (let stream of this._streams){
            if( stream.isExtendedAmbiance === true ){
                return true;
            }
        }
        return false;
    }

    /**
     * Returns true if there is at least one ambiance among all the streams     
     */
    get hasActiveExtendedAmbiance(){
        for (let stream of this._streams){
            if( stream.isExtendedAmbiance === true && stream.active === true ){
                return true;
            }
        }
        return false;
    }

	//==============================================================================
    /**
     * Returns true if there is at least one commentary among all the streams     
     */
    get hasExtendedCommentary(){
        for (let stream of this._streams){
            if( stream.isExtendedCommentary === true ){
                return true;
            }
        }
        return false;
    }

    /**
     * Returns true if there is at least one commentary among all the streams,
     * and if it is currently active     
     */
    get hasActiveExtendedCommentary()
    {
        for (let stream of this._streams)
        {
            if( stream.isExtendedCommentary === true && stream.active === true )
            {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns true if there is at least one active 5.0 or 5.1 stream, with dialog
     */
    get hasActiveMultiWithDialog()
    {
        for (let stream of this._streams)
        {
            if( ( stream.type === 'MultiWithoutLFE' || stream.type === 'MultiWithLFE' )                
               && stream.active === true )
            {
                // && stream.dialog === true
                return true;
            }
        }
        return false;
    }

    /**
     * Returns true if there is at least one active stereo stream, with dialog
     */
    get hasActiveStereoWithDialog()
    {
        for (let stream of this._streams)
        {
            if( stream.type === 'Stereo' 
                && stream.dialog === true
                && stream.active === true )
            {
                return true;
            }
        }
        return false;
    }

    //==============================================================================
    /**
     * This function returns the index of the source which corresponds to the mono commentary
     * 
     * Returns -1 if there is no commentary
     */
    get channelIndexForExtendedCommentary(){

        var channelIndex = 0;

        /// go through all the streams 
        for (let stream of this._streams){
            
            if( stream.isExtendedCommentary === true ){

                if( stream.type !== "Mono" ){
                    throw new Error( "The commentary must be mono!" );
                } 

                return channelIndex;
            }
            else{
                const numChannelsForThisStream = stream.numChannels;

                channelIndex += numChannelsForThisStream;
            }
        }

        return -1;
    }

    //==============================================================================
    /**
     * This function returns the index of the source which corresponds to the mono dialog
     * 
     * Returns -1 if there is no commentary
     */
    get channelIndexForExtendedDialog(){

        var channelIndex = 0;

        /// go through all the streams 
        for (let stream of this._streams){
            
            if( stream.isExtendedDialog === true ){                

                if( stream.type !== "Mono" ){
                    throw new Error( "The commentary must be mono!" );
                } 

                return channelIndex;
            }
            else{
                const numChannelsForThisStream = stream.numChannels;

                channelIndex += numChannelsForThisStream;
            }
        }

        return -1;
    }

    //==============================================================================
    /**
     * Returns true if this channel index corresponds to the extended dialog
     *      
     */
    isChannelForExtendedDialog( channelIndex ){

        if( channelIndex < 0 || channelIndex >= this.totalNumberOfChannels ){
            throw new Error( "Invalid channel index : " + channelIndex );
        }

        var index = 0;

        /// go through all the streams 
        for (let stream of this._streams){

            const numChannelsForThisStream = stream.numChannels;

            const isExtendedDialog = stream.isExtendedDialog;

            for( let k = 0; k < numChannelsForThisStream; k++ ){                

                if( channelIndex === index && isExtendedDialog === true ){            
                    return true;
                }

                index++;
            }   
        }

        return false;
    }

    //==============================================================================
    /**
     * Returns true if this channel index corresponds to the extended ambiance
     *      
     */
    isChannelForExtendedAmbiance( channelIndex ){

        if( channelIndex < 0 || channelIndex >= this.totalNumberOfChannels ){
            throw new Error( "Invalid channel index : " + channelIndex );
        }

        var index = 0;

        /// go through all the streams 
        for (let stream of this._streams){

            const numChannelsForThisStream = stream.numChannels;

            const isExtendedAmbiance = stream.isExtendedAmbiance;

            for( let k = 0; k < numChannelsForThisStream; k++ ){                

                if( channelIndex === index && isExtendedAmbiance === true ){            
                    return true;
                }

                index++;
            }   
        }

        return false;
    }

    //==============================================================================
    /**
     * Returns true if this channel index corresponds to a center channel (of 5.0 or 5.1 stream)
     *      
     */
    isChannelCenter( channelIndex ){

        if( channelIndex < 0 || channelIndex >= this.totalNumberOfChannels ){
            throw new Error( "Invalid channel index : " + channelIndex );
        }

        var index = 0;

        /// go through all the streams 
        for (let stream of this._streams){

            const numChannelsForThisStream = stream.numChannels;

            const isMulti = ( stream.type === 'MultiWithoutLFE' || stream.type === 'MultiWithLFE' );

            for( let k = 0; k < numChannelsForThisStream; k++ ){                

                if( channelIndex === index 
                    && stream.channelIsCenter( k ) === true ){            
                    return true;
                }

                index++;
            }   
        }

        return false;
    }

}

//==============================================================================
/**
 * AudioStreamDescription describes a stream.
 */
export class AudioStreamDescription {
    /**
     * AudioStreamDescription constructor
     * @param {string} type - type.
     * @param {boolean} active - active.
     * @param {number} loudness - loudness.
     * @param {number} maxTruePeak - maxTruePeak.
     * @param {boolean} dialog - dialog.
     * @param {boolean} ambiance - ambiance.
     * @param {number} trim - input trim level (in dB)
     */
    constructor(type, 
                active = false, 
                loudness = undefined, 
                maxTruePeak = undefined, 
                dialog = false, 
                ambiance = false, 
                commentary = false){
        this._type = type;
        this._active = active;
        this._loudness = loudness;
        this._maxTruePeak = maxTruePeak;
        this._dialog = dialog;
        this._ambiance = ambiance;
        this._commentary = commentary;
        this._trim = 0;
    }

    //==============================================================================
    /// if one of the value is NaN, this most likely means the stream was
    /// actually not in the EBU core.
    /// it should thus be considered as inactive    
    get hasNaN(){

        return isNaN( this._maxTruePeak ) || isNaN( this._loudness );

    }

    //==============================================================================
    /**
     * Get channel position based on audio stream type
     * @type {number[]}
     */
    get channelPositions(){
        switch(this._type){
            case "Mono":
                return [0];
            case "Stereo":
                return [-30, +30];
            case "MultiWithoutLFE":
                /// L, R, C, Ls, Rs.
                return [-30, +30, 0, -110, +110];
            case "MultiWithLFE":
                // L, R, C, Lfe, Ls, Rs.
                // @n LFE position is irrelevant 
                // but provided so that the array has a length of 6
                return [-30, +30, 0, 0, -110, +110];
            case "EightChannel":
                // @todo set correct positions
                return [1, 2, 3, 4, 5, 6, 7, 8];
        }
    }

    //==============================================================================
    /**
     * Returns true if the i-th channel corresponds to center
     * @type {int} channelIndex : index of the channel to query
     */
    channelIsCenter( channelIndex ){

        if( channelIndex < 0 || channelIndex >= this.numChannels ){
            throw new Error( "Invalid channel index : " + channelIndex );
        }

        if( this._type === "Mono" ){
            return ( channelIndex === 0 ? true : false );
        }
        else if( this._type ===  "MultiWithoutLFE" 
              || this._type ===  "MultiWithLFE" ){
            return ( channelIndex === 2 ? true : false );
        }
        else{
            return false;
        }

    }

    /**
     * Returns true if the i-th channel corresponds to LFE
     * @type {int} channelIndex : index of the channel to query
     */
    channelIsLfe( channelIndex ){

        if( channelIndex < 0 || channelIndex >= this.numChannels ){
            throw new Error( "Invalid channel index : " + channelIndex );
        }

        if( this._type ===  "MultiWithLFE" && channelIndex === 3 ){
            return true;
        }
        else{
            return false;
        }

    }

    /**
     * Returns true if the i-th channel corresponds to LEFT
     * @type {int} channelIndex : index of the channel to query
     */
    channelIsLeft( channelIndex ){

        if( channelIndex < 0 || channelIndex >= this.numChannels ){
            throw new Error( "Invalid channel index : " + channelIndex );
        }

        const pos = this.channelPositions;

        return ( pos[ channelIndex ] === -30 ? true : false );
    }

    /**
     * Returns true if the i-th channel corresponds to RIGHT
     * @type {int} channelIndex : index of the channel to query
     */
    channelIsRight( channelIndex ){

        if( channelIndex < 0 || channelIndex >= this.numChannels ){
            throw new Error( "Invalid channel index : " + channelIndex );
        }

        const pos = this.channelPositions;

        return ( pos[ channelIndex ] === +30 ? true : false );
    }

    /**
     * Returns true if the i-th channel corresponds to LS
     * @type {int} channelIndex : index of the channel to query
     */
    channelIsLeftSurround( channelIndex ){

        if( channelIndex < 0 || channelIndex >= this.numChannels ){
            throw new Error( "Invalid channel index : " + channelIndex );
        }

        const pos = this.channelPositions;

        return ( pos[ channelIndex ] === -110 ? true : false );
    }

    /**
     * Returns true if the i-th channel corresponds to RS
     * @type {int} channelIndex : index of the channel to query
     */
    channelIsRightSurround( channelIndex ){

        if( channelIndex < 0 || channelIndex >= this.numChannels ){
            throw new Error( "Invalid channel index : " + channelIndex );
        }

        const pos = this.channelPositions;

        return ( pos[ channelIndex ] === +110 ? true : false );
    }

    //==============================================================================
    /**
     * Returns the number of channels of the stream
     * @type {number}
     */
    get numChannels(){
        switch(this._type){
            case "Mono":
                return 1;
            case "Stereo":
                return 2;
            case "MultiWithoutLFE":
                return 5;
            case "MultiWithLFE":
                return 6;
            case "EightChannel":
                return 8;
        }
    }

    //==============================================================================
    /**
     * Returns the type of the stream
     * @type {string}
     */
    get type(){
        return this._type;
    }

    //==============================================================================
    /**
     * Set active, if stream is currently playing or not
     * @type {boolean}
     */
    set active(value){
        this._active = value;
    }
    /**
     * Get active, if stream is currently playing or not
     * @type {boolean}
     */
    get active(){
        return this._active && this.hasNaN === false;
    }

    //==============================================================================
    /**
     * Set the trim level (in dB)
     * @type {number}
     */
    set trim(value){
        this._trim = value;
    }
    /**
     * Get the trim level (in dB)
     * @type {number}
     */
    get trim(){
        return this._trim;
    }

    //==============================================================================
    /**
     * Sets the trim level, according to a slider in the GUI
     * theSlider : the slider
     * return the actual value of the trim
     */
    setTrimFromGui( theSlider ){

        /// the value of the fader
        const valueFader = parseFloat( theSlider.value );

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = [-60, 30];

        /// scale from GUI to DSP
        const value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );

        this._trim = value;

        return value;
    }

    //==============================================================================
    /**
     * Set the loudness value of audio stream
     * @type {number}
     */
    set loudness(value){
        this._loudness = value;
    }
    /**
     * Get the loudness of audio stream
     * @type {number}
     */
    get loudness(){
        return this._loudness;
    }

    //==============================================================================
    /**
     * Set the maxTruePeak of audio stream
     * @type {number}
     */
    set maxTruePeak(value){
        this._maxTruePeak = value;
    }
    /**
     * Get the maxTruePeak of audio stream
     * @type {number}
     */
    get maxTruePeak(){
        return this._maxTruePeak;
    }

    //==============================================================================
    /**
     * Set dialog, if stream is currently a dialog or not
     * @type {boolean}
     */
    set dialog(value){
        this._dialog = value;
    }
    /**
     * Returns true if the stream is a dialog
     * @type {boolean}
     */
    get dialog(){
        return this._dialog;
    }

    /**
     * Returns true if the stream contains ONLY dialog
     * (in which case, it is most likely a mono stream)
     * @type {boolean}
     */
    get isExtendedDialog(){
        return this._dialog === true 
            && this._ambiance === false 
            && this._commentary === false;
    }

    //==============================================================================
    /**
     * Set ambiance, if stream is currently an ambiance or not
     * @type {boolean}
     */
    set ambiance(value){
        this._ambiance = value;
    }
    /**
     * Returns if the stream is an ambiance
     * @type {boolean}
     */
    get ambiance(){
        return this._ambiance;
    }

    /**
     * Returns true if the stream contains ONLY the ambiance
     * (in which case, it is most likely a mono stream)
     * @type {boolean}
     */
    get isExtendedAmbiance(){
        return this._dialog === false 
            && this._ambiance === true 
            && this._commentary === false;
    }

    //==============================================================================
    /**
     * Set commentary, if stream is currently a commentary (audio description) or not
     * @type {boolean}
     */
    set commentary(value){
        this._commentary = value;
    }
    /**
     * Returns true if the stream is a commentary (audio description)
     * @type {boolean}
     */
    get commentary(){
        return this._commentary;
    }

    /**
     * Returns true if the stream contains ONLY the commentary (audio description)
     * (in which case, it is most likely a mono stream)
     * @type {boolean}
     */
    get isExtendedCommentary(){
        return this._dialog === false 
            && this._ambiance === false 
            && this._commentary === true;
    }
}


 /**
 * @external {AudioContext} https://developer.mozilla.org/fr/docs/Web/API/AudioContext
 */
