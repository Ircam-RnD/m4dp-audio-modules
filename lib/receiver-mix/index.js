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

        if( typeof audioStreamDescriptionCollection === "undefined" ){
            throw new Error("the audioStreamDescriptionCollection must be defined !");
        }

        /// first of all, check if there is a commentary stream.
        /// if not, the Receiver-Mix has nothing to do (just bypass)

        const hasComment = this.hasCommentary;

        /// create an analyzer node for computing the RMS of the main programme
    	this._analysisNodeMain = new AnalysisNode( audioContext );

		/// create an analyzer node for computing the RMS of the commentary
    	this._analysisNodeCommentary = new AnalysisNode( audioContext );

    	/// this is the N value in the .pdf :
    	/// when the RMS of the commentary is > N (expressed in dB), the programme P must be analyzed
        this._thresholdForCommentary = ReceiverMix.defaultForCommentaryThreshold;

		/// this is the X value in the .pdf :
    	/// when the RMS of the programme P is > X, the programme is compressed
        this._thresholdForProgramme = ReceiverMix.defaultForProgrammeThreshold;        

        ///@todo : fix the number of channels
        this._dynamicCompressorNode = new MultichannelCompressorNode( audioContext, 1 );


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
    /**
     * Notification when the active stream(s) changes
     * (i.e. whenever a check box is modified)
     */
    activeStreamsChanged(){
        ///@todo
    }

    //==============================================================================
    /**
     * Returns true if there is at least one commentary among all the streams     
     */
    get hasCommentary(){
        return this._audioStreamDescriptionCollection.hasCommentary;
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
        return [-60, 30];
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
        return -10;
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
        return [-60, 30];
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
        return -15;
    }

	//==============================================================================
	setCompressorThreshold( value ){
		this._dynamicCompressorNode.setThreshold( value );
	}

	getCompressorThreshold(){
		return this._dynamicCompressorNode.getThreshold();
	}

	setCompressorRatio( value ){
		this._dynamicCompressorNode.setRatio( value );
	}

	getCompressorRatio(){
		return this._dynamicCompressorNode.getRatio();
	}	

	setCompressorAttack( value ){
		this._dynamicCompressorNode.setAttack( value );
	}

	getCompressorAttack(){
		return this._dynamicCompressorNode.getAttack();
	}

	setCompressorRelease( value ){
		this._dynamicCompressorNode.setRelease( value );
	}

	getCompressorRelease(){
		return this._dynamicCompressorNode.getRelease();
	}

	//==============================================================================
    /**
     * Updates the connections of the audio graph
     */
    _updateAudioGraph(){

        /// first of all, disconnect everything
        this._input.disconnect();
        
        if( this.bypass === true || this.hasCommentary === false ){

            this._input.connect( this._output );
            
        }
        else{
            
            /// @todo
        }
    }
}


