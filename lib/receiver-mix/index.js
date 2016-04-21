/************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      Implements the Receiver-Mix : the so-called Receiver-Mix 
 *				 corresponds to the 2nd part of the “OBJECT SPATIALISER AND MIXER”
 *				 This module inspects the RMS of the main programme, the RMS of the commentary
 *				 and it applies dynamic compression on the main programme if necessary
 *
 *   @author     Thibaut Carpentier, Samuel Goldszmidt
 *   @date       01/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';
import AnalysisNode from '../dsp/analysis.js';
import utilities from '../core/utils.js';
import MultichannelCompressorNode from '../dsp/compressor.js'

export default class ReceiverMix extends AbstractNode {
	//==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
     */
	constructor(audioContext,
                audioStreamDescriptionCollection = undefined)
	{
        super(audioContext, audioStreamDescriptionCollection);    
        this._isBypass = false;
        this._shouldCompress = false;
        this._rmsRefreshInterval = 100;     /// interval (in msec for refreshing the RMS measurement)
        this._durationHold = 0;             /// how long (in msec) the compressor has been on hold
        this._minimumHoldTime = 1500;       /// hold time in msec) for the compressor

        if( typeof audioStreamDescriptionCollection === "undefined" ){
            throw new Error("the audioStreamDescriptionCollection must be defined !");
        }

        /// first of all, check if there is a commentary stream.
        /// if not, the Receiver-Mix has nothing to do (just bypass)

        /// create an analyzer node for computing the RMS of the main programme
    	this._analysisNodeMain = new AnalysisNode( audioContext );

		/// create a mono analyzer node for computing the RMS of the commentary
    	this._analysisNodeCommentary = new AnalysisNode( audioContext );

        /// several mono analyzers for analyzing the main program
        this._analysisNodeProgram = [];

    	/// this is the N value in the .pdf :
    	/// when the RMS of the commentary is > N (expressed in dB), the programme P must be analyzed
        this._thresholdForCommentary = ReceiverMix.defaultForCommentaryThreshold;

		/// this is the X value in the .pdf :
    	/// when the RMS of the programme P is > X, the programme is compressed
        this._thresholdForProgramme = ReceiverMix.defaultForProgrammeThreshold;        

        /// the actual number of channels will be later overriden
        this._dynamicCompressorNode = new MultichannelCompressorNode( audioContext, 1 );
        this._dynamicCompressorNode.setRatio( ReceiverMix.defaultCompressionRatio );
        this._dynamicCompressorNode.setAttack( utilities.ms2sec( ReceiverMix.defaultAttackTime ) );
        this._dynamicCompressorNode.setRelease( utilities.ms2sec( ReceiverMix.defaultReleaseTime ) );


        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        const totalNumberOfChannels_ = this.getTotalNumberOfChannels();

        /// sanity check
        /// mainAudio (2) + extendedAmbience (6) + extendedComments (1) + extendedDialogs (1) = 10
        if( totalNumberOfChannels_ != 10 ){
            throw new Error("Ca parait pas bon...");
        }

        /// main splitter node, at the entrance of the ReceiverMix
        this._splitterNode = audioContext.createChannelSplitter( totalNumberOfChannels_ );
        
        /// main channel merger, at the output of the ReceiverMix
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
        
        this._updateAudioGraph();

        /*
        window.setInterval( () => {
            this._updateCompressor();
        }, 100);
        */

        this._updateCompressor();
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
       this._updateAudioGraph();
    }

    //==============================================================================
    /**
     * Returns true if there is at least one commentary among all the streams     
     */
    get hasExtendedCommentary(){
        return this._audioStreamDescriptionCollection.hasExtendedCommentary;
    }

    /**
     * Returns true if there is at least one commentary among all the streams,
     * and if it is currently active     
     */
    get hasActiveExtendedCommentary(){
        return this._audioStreamDescriptionCollection.hasActiveExtendedCommentary;
    }

    //==============================================================================
    /**
     * Returns the number of channels in the "main" programme.
     * The 
     */
    getNumberOfChannelsInTheProgramme(){
		
		/// retrieves the AudioStreamDescriptionCollection
        const asdc = this._audioStreamDescriptionCollection;
        
        if( asdc.hasActiveStream === false ){  

        	throw new Error("no programme running !");                  
            return 0;
        }

        /// retrieves the active AudioStreamDescription(s)
        const asd = asdc.actives;

        for( let i = 0; i < asd.length; i++ ){

        	const stream_ = asd[i];

        	if( stream_.type === "Stereo" && stream_.active === true ){
        		/// this is the right one
        		return stream_.numChannels();
        	}

        }

        throw new Error("no programme running !");
        return 0;
    }

    //==============================================================================
    /**
     * Set the gate threshold (in dB) for the commentary
     * @type {number}
     */
    set thresholdForCommentary(valueIndB){

        const [minValue, maxValue] = ReceiverMix.rangeForCommentaryThreshold;

        this._thresholdForCommentary = utilities.clamp( valueIndB, minValue, maxValue );
    }

    /**
     * Get the gate threshold (in dB) for the commentary
     * @type {number}
     */
    get thresholdForCommentary(){
        return this._thresholdForCommentary;
    }

    /**
     * Sets the gate threshold (in dB) for the commentary, according to a slider in the GUI
     * theSlider : the slider
     * return the actual value of the gate threshold (in dB) for the commentary
     */
    setThresholdForCommentaryFromGui( theSlider ){

        /// the value of the fader
        const valueFader = parseFloat( theSlider.value );

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = ReceiverMix.rangeForCommentaryThreshold;

        /// scale from GUI to DSP
        const value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );

        this.thresholdForCommentary = value;

        return value;
    }

    /**
     * Returns the current value of compression ratio, already scaled for the GUI
     * theSlider : the slider
     */
    getThresholdForCommentaryFromGui( theSlider ){

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = ReceiverMix.rangeForCommentaryThreshold;

        const actualValue = this.thresholdForCommentary;

        /// scale from DSP to GUI
        const value = M4DPAudioModules.utilities.scale( actualValue, minValue, maxValue, minFader, maxFader );

        return value;
    }

    /**
     * Get the dB range
     * @type {array}     
     */
    static get rangeForCommentaryThreshold(){
        return [-60, 0];
    }

    static get minForCommentaryThreshold(){
        const [minValue, maxValue] = ReceiverMix.rangeForCommentaryThreshold;
        return minValue;
    }

    static get maxForCommentaryThreshold(){
        const [minValue, maxValue] = ReceiverMix.rangeForCommentaryThreshold;
        return maxValue;
    }

    /**
     * Returns the default value (in dB)
     * @type {number}
     */
    static get defaultForCommentaryThreshold(){
        return -30;
    }


    //==============================================================================
    /**
     * Set the gate threshold (in dB) for the commentary
     * @type {number}
     */
    set thresholdForProgramme(valueIndB){
        this._thresholdForProgramme = valueIndB;
    }
    /**
     * Get the gate threshold (in dB) for the commentary
     * @type {number}
     */
    get thresholdForProgramme(){
        return this._thresholdForProgramme;
    }


    /**
     * Sets the gate threshold (in dB) for the programme, according to a slider in the GUI
     * theSlider : the slider
     * return the actual value of the gate threshold (in dB) for the programme
     */
    setThresholdForProgrammeFromGui( theSlider ){

        /// the value of the fader
        const valueFader = parseFloat( theSlider.value );

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = ReceiverMix.rangeForProgrammeThreshold;

        /// scale from GUI to DSP
        const value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );

        this.thresholdForProgramme = value;

        return value;
    }

    /**
     * Returns the current value of compression ratio, already scaled for the GUI
     * theSlider : the slider
     */
    getThresholdForProgrammeFromGui( theSlider ){

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = ReceiverMix.rangeForProgrammeThreshold;

        const actualValue = this.thresholdForProgramme;

        /// scale from DSP to GUI
        const value = M4DPAudioModules.utilities.scale( actualValue, minValue, maxValue, minFader, maxFader );

        return value;
    }

    /**
     * Get the dB range
     * @type {array}     
     */
    static get rangeForProgrammeThreshold(){
        return [-60, 0];
    }

    static get minForProgrammeThreshold(){
        const [minValue, maxValue] = ReceiverMix.rangeForProgrammeThreshold;
        return minValue;
    }

    static get maxForCommentaryThreshold(){
        const [minValue, maxValue] = ReceiverMix.rangeForProgrammeThreshold;
        return maxValue;
    }

    /**
     * Returns the default value (in dB)
     * @type {number}
     */
    static get defaultForProgrammeThreshold(){
        return -35;
    }

	//==============================================================================
	setCompressorThreshold( value ){
		this._dynamicCompressorNode.setThreshold( value );
	}

	getCompressorThreshold(){
		return this._dynamicCompressorNode.getThreshold();
	}

    /**
     * Get the compression threshold range
     * @type {array}     
     */
    static get compressionThresholdRange(){
        return [ ReceiverMix.minCompressionThresholdRange, ReceiverMix.maxCompressionThresholdRange ];
    }

    static get minCompressionThresholdRange(){        
        return MultichannelCompressorNode.minThreshold;
    }

    static get maxCompressionThresholdRange(){        
        return MultichannelCompressorNode.maxThreshold;
    }

    /**
     * Returns the default threshold ratio
     * @type {number}
     */
    static get defaultCompressionThreshold(){
        return MultichannelCompressorNode.defaultThreshold;
    }



    /**
     * Get the compression ratio range
     * @type {array}     
     */
    static get compressionRatioRange(){
        return [ ReceiverMix.minCompressionRatioRange, ReceiverMix.maxCompressionRatioRange ];
    }

    static get minCompressionRatioRange(){        
        return MultichannelCompressorNode.minRatio;
    }

    static get maxCompressionRatioRange(){        
        return MultichannelCompressorNode.maxRatio;
    }

    /**
     * Returns the default compression ratio
     * @type {number}
     */
    static get defaultCompressionRatio(){
        return 5;
    }

    /**
     * Get the attack time range (in msec)
     * @type {array}     
     */
    static get attackTimeRange(){
        return [ ReceiverMix.minAttackTimeRange, ReceiverMix.maxAttackTimeRange ];
    }

    /**
     * Returns the minimum attack time (in msec)  
     */
    static get minAttackTimeRange(){
        return utilities.sec2ms( MultichannelCompressorNode.minAttack );
    }

    /**
     * Returns the maximum attack time (in msec)  
     */
    static get maxAttackTimeRange(){
        
        return utilities.sec2ms( MultichannelCompressorNode.maxAttack );
    }

    /**
     * Returns the default attack time (in msec)
     * @type {number}
     */
    static get defaultAttackTime(){
        return 5;
    }

    /**
     * Get the release time range (in msec)
     * @type {array}     
     */
    static get releaseTimeRange(){
        return [ ReceiverMix.minReleaseTimeRange, ReceiverMix.maxReleaseTimeRange ];
    }

    /**
     * Returns the minimum release time (in msec)  
     */
    static get minReleaseTimeRange(){        
        return utilities.sec2ms( MultichannelCompressorNode.minRelease );
    }

    /**
     * Returns the maximum release time (in msec)  
     */
    static get maxReleaseTimeRange(){        
        return utilities.sec2ms( MultichannelCompressorNode.maxRelease );
    }

    /**
     * Returns the default release time (in msec)
     * @type {number}
     */
    static get defaultReleaseTime(){
        return 20;
    }

	setCompressorRatio( value ){
        this._dynamicCompressorNode.setRatio( value );     
	}

	getCompressorRatio(){
		return this._dynamicCompressorNode.getRatio();
	}	

	setCompressorAttack( valueInMilliseconds ){

        const value = utilities.ms2sec( valueInMilliseconds );

        //console.log("compressor attack = " + value.toString() + ' sec');

		this._dynamicCompressorNode.setAttack( value );
	}

	getCompressorAttack(){
		return utilities.sec2ms( this._dynamicCompressorNode.getAttack() );
	}

	setCompressorRelease( valueInMilliseconds ){

        const value = utilities.ms2sec( valueInMilliseconds );

        //console.log("compressor release = " + value.toString() + ' sec');

		this._dynamicCompressorNode.setRelease( value );
	}

	getCompressorRelease(){
		return utilities.sec2ms( this._dynamicCompressorNode.getRelease() );
	}

    //==============================================================================
    /**
     * Sets the release time, according to a slider in the GUI
     * theSlider : the slider
     * return the actual value of the release time (in msec)
     */
    setCompressorThresholdFromGui( theSlider ){

        /// the value of the fader
        const valueFader = parseFloat( theSlider.value );

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = ReceiverMix.compressionThresholdRange;

        /// scale from GUI to DSP
        const value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );

        this.setCompressorThreshold( value );

        return value;
    }

    /**
     * Returns the current value of release time, already scaled for the GUI
     * theSlider : the slider
     */
    getCompressorThresholdForGui( theSlider ){

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = ReceiverMix.compressionThresholdRange;

        const actualValue = this.getCompressorThreshold();

        /// scale from DSP to GUI
        const value = M4DPAudioModules.utilities.scale( actualValue, minValue, maxValue, minFader, maxFader );

        return value;
    }


    //==============================================================================
    /**
     * Sets the release time, according to a slider in the GUI
     * theSlider : the slider
     * return the actual value of the release time (in msec)
     */
    setReleaseTimeFromGui( theSlider ){

        /// the value of the fader
        const valueFader = parseFloat( theSlider.value );

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = ReceiverMix.releaseTimeRange;

        /// scale from GUI to DSP
        const value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );

        this.setCompressorRelease( value );

        return value;
    }

    /**
     * Returns the current value of release time, already scaled for the GUI
     * theSlider : the slider
     */
    getReleaseTimeForGui( theSlider ){

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = ReceiverMix.releaseTimeRange;

        const actualValue = this.getCompressorRelease();

        /// scale from DSP to GUI
        const value = M4DPAudioModules.utilities.scale( actualValue, minValue, maxValue, minFader, maxFader );

        return value;
    }


    //==============================================================================
    /**
     * Sets the refresh interval for RMS measurement (in msec)
     * theSlider : the slider
     * return the actual value of the refresh interval (in msec)
     */
    setRefreshRmsTimeFromGui( theSlider ){

        /// the value of the fader
        const valueFader = parseFloat( theSlider.value );

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = [ 20, 500 ];

        /// scale from GUI to DSP
        const value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );

        this._rmsRefreshInterval = value;

        return value;
    }

    /**
     * Returns the refresh interval for RMS measurement (in msec)
     * theSlider : the slider
     */
    getRefreshRmsTimeForGui( theSlider ){

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = [ 20, 500 ];

        const actualValue = this._rmsRefreshInterval;

        /// scale from DSP to GUI
        const value = M4DPAudioModules.utilities.scale( actualValue, minValue, maxValue, minFader, maxFader );

        return value;
    }

    //==============================================================================
    /**
     * Sets the attack time, according to a slider in the GUI
     * theSlider : the slider
     * return the actual value of the attack time (in msec)
     */
    setAttackTimeFromGui( theSlider ){

        /// the value of the fader
        const valueFader = parseFloat( theSlider.value );

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = ReceiverMix.attackTimeRange;

        /// scale from GUI to DSP
        const value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );

        this.setCompressorAttack( value );

        return value;
    }

    /**
     * Returns the current value of attack time, already scaled for the GUI
     * theSlider : the slider
     */
    getAttackTimeForGui( theSlider ){

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = ReceiverMix.attackTimeRange;

        const actualValue = this.getCompressorAttack();

        /// scale from DSP to GUI
        const value = M4DPAudioModules.utilities.scale( actualValue, minValue, maxValue, minFader, maxFader );

        return value;
    }


    //==============================================================================
    /**
     * Sets the compression ratio, according to a slider in the GUI
     * theSlider : the slider
     * return the actual value of the compression ratio
     */
    setCompressionRatioFromGui( theSlider ){

        /// the value of the fader
        const valueFader = parseFloat( theSlider.value );

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = ReceiverMix.compressionRatioRange;

        /// scale from GUI to DSP
        const value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );

        this.setCompressorRatio( value );

        return value;
    }

    /**
     * Returns the current value of compression ratio, already scaled for the GUI
     * theSlider : the slider
     */
    getCompressionRatioForGui( theSlider ){

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = ReceiverMix.compressionRatioRange;

        const actualValue = this.getCompressorRatio();

        /// scale from DSP to GUI
        const value = M4DPAudioModules.utilities.scale( actualValue, minValue, maxValue, minFader, maxFader );

        return value;
    }

    //==============================================================================
    /**
     * Sets the minimum hold time (in msec)
     * theSlider : the slider
     * return the actual value of the hold time
     */
    setMinimumHoldTimeFromGui( theSlider ){

        /// the value of the fader
        const valueFader = parseFloat( theSlider.value );

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = [1000, 5000];

        /// scale from GUI to DSP
        const value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );

        this._minimumHoldTime = value;

        return value;
    }

    /**
     * Returns the minimum hold time (in msec)
     * theSlider : the slider
     */
    getMinimumHoldTimeForGui( theSlider ){

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = [1000, 5000];

        const actualValue = this._minimumHoldTime;

        /// scale from DSP to GUI
        const value = M4DPAudioModules.utilities.scale( actualValue, minValue, maxValue, minFader, maxFader );

        return value;
    }

    //==============================================================================
    /**
     * Returns the RMS value for the commentary, in dB
     */
    getRmsForCommentary(){

        if( this._hasExtendedCommentaryToAnalyze() === true ){
            return utilities.lin2dBsafe( this._analysisNodeCommentary.getRMS() );
        }
        else{
            return -200;
        }

    }

    /**
     * Returns the RMS value for the commentary, as a string
     */
    getRmsForCommentaryAsString(){
        return 'RMS comments = ' + this.getRmsForCommentary().toFixed(1) + ' dB';
    }

    //==============================================================================
    /**
     * This function returns the index of the source which corresponds to the commentary
     * (that needs to be analyzed)
     * Returns -1 if there is no commentary
     */
    _getChannelIndexForExtendedCommentary(){

        /// retrieves the AudioStreamDescriptionCollection
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        const asdc = this._audioStreamDescriptionCollection;
        
        return asdc.channelIndexForExtendedCommentary;
    }

    /**
     * Returns true if there is a commentary stream and if it is active
     */
    _hasExtendedCommentaryToAnalyze(){

        const indexForExtendedCommentary = this._getChannelIndexForExtendedCommentary();

        return ( this.hasActiveExtendedCommentary === true && indexForExtendedCommentary >= 0 );
    }


    //==============================================================================
    /**
     * The current program is either Stereo or MultiWithLFE
     */
    _getProgramStream(){

        const asdc = this._audioStreamDescriptionCollection;

        /// go through all the streams 
        for (let stream of asdc.streams){
            
            if( stream.type === "Stereo" && stream.active === true ){

                return stream;
            }
            else if ( stream.type === "MultiWithLFE" && stream.active === true ){

                return stream;

            }
        }

        return undefined;
    }

    /**
     * Among all the streams, this returns an array containing the indices of channels
     * to analyze for the program.
     */
    _getChannelsIndicesForProgram(){

        const programStream = this._getProgramStream();

        if( typeof programStream === "undefined" ){
            return [];
        }
        else{
            
            ///@todo : skip the LFE in case of 5.1

            var channelIndex = 0;

            var indices = [];

            const asdc = this._audioStreamDescriptionCollection;
            for (let stream of asdc.streams){

                const numChannelsForThisStream = stream.numChannels;

                if( stream === programStream ){

                    for( let k = 0; k < numChannelsForThisStream; k++ ){

                        const index = channelIndex + k;
                        indices.push( index );
                    }

                }
                else{
                    channelIndex += numChannelsForThisStream;
                }

            }

            return indices;
        }

    }

    _hasProgramToAnalyze(){

        const programStream = this._getProgramStream();

        if( typeof programStream === "undefined" ){
            return false;
        }
        else{
            return true;
        }

    }

    //==============================================================================
    getRmsForProgram(){
        if( this._hasProgramToAnalyze() === true ){
            
            var rms = [];

            /// average rms among all channels

            for( let i = 0; i < this._analysisNodeProgram.length; i++ ){

                const lin = this._analysisNodeProgram[i].getRMS();

                rms.push( lin );
            }

            const avg = utilities.mean( rms );

            return utilities.lin2dBsafe( avg );
        }
        else{
            return -200;
        }
    }

    /**
     * Returns the RMS value for the commentary, as a string
     */
    getRmsForProgramAsString(){
        return 'RMS program = ' + this.getRmsForProgram().toFixed(1) + ' dB';
    }

    //==============================================================================
    /**
     * The number of channels of the current program (i.e. the number of channels) that have to be analyzed
     * or 0 if there is no active program at the moment
     */
    _getNumChannelsForProgramStream(){

        const programStream = this._getProgramStream();

        if( typeof programStream === "undefined" ){
            return 0;
        }
        else{
            return programStream.numChannels;
        }
    }

    //==============================================================================
    /**
     * returns true if the program is being compressed
     */
    get shouldCompressProgram(){
        return this._shouldCompress;
    }

    //==============================================================================
    /**
     * Returns the dynamic compression state
     * @type {boolean}
     */
    get dynamicCompressionState(){

        //return this._dynamicCompressorNode.dynamicCompressionState && this._shouldCompress;
        return this._shouldCompress;
    }

    //==============================================================================
    /**
     * This method should be called once, and then it repeats itself periodically
     */
    _updateCompressor(){

        /// execute this function again, after a given interval        
        window.setTimeout( () => {
            this._updateCompressor();
        }, this._rmsRefreshInterval );

        /// in msec
        /// once the compression gets activated, 
        /// we will hold it for at least 1500 msec
        /// i.e. for 1500 msec, we suspend the RMS comparison,
        /// and the compression remains with a dry/wet of 100%
        const minimumHoldTime = this._minimumHoldTime;

        ///@todo : the hold time could also appear in the GUI

        if( this.bypass === false 
            && this._shouldCompress === true 
            && this._durationHold <= minimumHoldTime ){
            /// hold the compressor for at least 1000 msec

            /// increment the counter
            this._durationHold += this._rmsRefreshInterval;

            return;
        }

        /// the hold period is over; now, really compare the RMS,
        /// to activate or not the compression

        this._shouldCompress = false;

        if( this.bypass === true  ){
            this._shouldCompress = false;
        }
        else{

            if( this._hasExtendedCommentaryToAnalyze() === true  ){

                const C = this.getRmsForCommentary();
                const P = this.getRmsForProgram();

                const N = this.thresholdForCommentary;
                const X = this.thresholdForProgramme;

                if( C > N && P > X ){
                    this._shouldCompress = true;   
                }
            }
            else{
                this._shouldCompress = false;
            }   
        }

        if( this._shouldCompress === true ){
            //ratio = this._compressionRatio;
            //this._dynamicCompressorNode.bypass = false;
            this._dynamicCompressorNode.drywet = 100;

            /// increment the counter
            this._durationHold += this._rmsRefreshInterval;
        }
        else{
            //ratio = 1.0;
            //this._dynamicCompressorNode.bypass = true;
            this._dynamicCompressorNode.drywet = 0;

            /// increment the counter
            this._durationHold = 0;
        }   
        
    }

	//==============================================================================
    /**
     * Updates the connections of the audio graph
     */
    _updateAudioGraph(){

        /// first of all, disconnect everything
        this._input.disconnect();
        this._splitterNode.disconnect();
        this._analysisNodeCommentary.disconnect();
        this._mergerNode.disconnect();
        this._dynamicCompressorNode.disconnect();

        if( typeof this._splitterAfterCompressor !== "undefined" ){
            this._splitterAfterCompressor.disconnect();
        }
        if( typeof this._mergerBeforeCompressor !== "undefined" ){
            this._mergerBeforeCompressor.disconnect();
        }


        for( let i = 0; i < this._analysisNodeProgram.length; i++ ){
            this._analysisNodeProgram[i].disconnect();
        }

        const indexForExtendedCommentary = this._getChannelIndexForExtendedCommentary();

        /// split the input streams into N independent channels
        this._input.connect( this._splitterNode );

        /// connect the analyzer for the commentary
        if( this._hasExtendedCommentaryToAnalyze() === true  ){
            this._splitterNode.connect( this._analysisNodeCommentary._input, indexForExtendedCommentary, 0 );    
        }

        const indicesForProgram = this._getChannelsIndicesForProgram();

        /// connect the analyzers for the program
        if( this._hasProgramToAnalyze() === true ){

            const numChannelsForProgramStream = this._getNumChannelsForProgramStream();

            /// sanity check
            if( indicesForProgram.length !== numChannelsForProgramStream ){
                throw new Error("Ca parait pas bon...");                
            }

            /// delete the previous analyzers
            this._analysisNodeProgram = [];

            /// create N (mono) analyzers
            for( let i = 0; i < numChannelsForProgramStream; i++ ){
                const newAnalyzer = new AnalysisNode( this._audioContext );
                this._analysisNodeProgram.push( newAnalyzer );
            }

            /// connect the (mono) analyzers to the channel splitter
            for( let i = 0; i < numChannelsForProgramStream; i++ ){

                const splitterOutputIndex = indicesForProgram[i];

                this._splitterNode.connect( this._analysisNodeProgram[i]._input, splitterOutputIndex, 0 );    
            }

            /// re-build the compressor if needed
            if( this._dynamicCompressorNode.getNumChannels() !== numChannelsForProgramStream ){
                
                /// preserve the old state
                const ratio = this._dynamicCompressorNode.getRatio();
                const attack = this._dynamicCompressorNode.getAttack();
                const release = this._dynamicCompressorNode.getRelease();
                const threshold = this._dynamicCompressorNode.getThreshold();

                /// destroy the compressor
                this._dynamicCompressorNode = "undefined";

                var audioContext = this._audioContext;

                /// create a new one
                this._dynamicCompressorNode = new MultichannelCompressorNode( audioContext, numChannelsForProgramStream );

                /// restore the settings
                this._dynamicCompressorNode.setRatio( ratio );
                this._dynamicCompressorNode.setAttack( attack );
                this._dynamicCompressorNode.setRelease( release );
                this._dynamicCompressorNode.setThreshold( threshold );

                /// delete these nodes
                this._splitterAfterCompressor = "undefined";
                this._mergerBeforeCompressor = "undefined";

                /// a channel splitter at the output of the compressor
                this._splitterAfterCompressor = audioContext.createChannelSplitter( numChannelsForProgramStream );

                this._mergerBeforeCompressor = audioContext.createChannelMerger( numChannelsForProgramStream );
            }
        }

        
        if( this.bypass === true || this._hasProgramToAnalyze() === false ){
            this._input.connect( this._output );
        }
        else{

            /// sanity checks
            const numChannelsForProgramStream = this._getNumChannelsForProgramStream();

            if( numChannelsForProgramStream <= 0 ){
                throw new Error("pas bon !");
            }

            if( typeof this._dynamicCompressorNode === "undefined" ){
                throw new Error("pas bon !");
            }

            if( typeof this._splitterAfterCompressor === "undefined" ){
                throw new Error("pas bon !");
            }

            if( typeof this._mergerBeforeCompressor === "undefined" ){
                throw new Error("pas bon !");
            }

            if( this._dynamicCompressorNode.getNumChannels() !== numChannelsForProgramStream ){
                throw new Error("pas bon !");
            }

            if( this._splitterAfterCompressor.numberOfInputs != 1
             || this._splitterAfterCompressor.numberOfOutputs != numChannelsForProgramStream ){
                throw new Error("pas bon !");
            }

            if( this._mergerBeforeCompressor.numberOfInputs != numChannelsForProgramStream 
                || this._mergerBeforeCompressor.numberOfOutputs != 1 ){
                throw new Error("pas bon !");
            }  

            if( indicesForProgram.length !== numChannelsForProgramStream ){
                throw new Error("pas bon !");
            }

            const totalNumberOfChannels_ = this.getTotalNumberOfChannels();


            this._mergerBeforeCompressor.connect( this._dynamicCompressorNode._input );
            this._dynamicCompressorNode.connect( this._splitterAfterCompressor );

            var compressorIndex = 0;

            for( let i = 0; i < totalNumberOfChannels_; i++ ){

                /// is this a channel that goes into the compressor ? 

                const shouldGoToCompressor = indicesForProgram.includes(i);

                if( shouldGoToCompressor === true ){
                    
                    this._splitterNode.connect( this._mergerBeforeCompressor, i, compressorIndex );  

                    this._splitterAfterCompressor.connect( this._mergerNode, compressorIndex, i );

                    compressorIndex++;
                }
                else{
                    /// not going to the compressor
                    this._splitterNode.connect( this._mergerNode, i, i );  
                }

            }

            /// sanity check
            if( compressorIndex !== numChannelsForProgramStream ){
                throw new Error("pas bon !");
            }

            this._mergerNode.connect( this._output );

        }
                        
    }
}


