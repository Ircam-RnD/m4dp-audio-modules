/************************************************************************************/
/*!
 *   @file       newreceivermix.js
 *   @brief      Implements the Receiver-Mix : the so-called Receiver-Mix
 *				 corresponds to the 2nd part of the “OBJECT SPATIALISER AND MIXER”
 *				 This module inspects the RMS of the main program, the RMS of the commentary
 *				 and it applies dynamic compression on the main program if necessary
 *
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';
import utilities from '../core/utils.js';
import {RmsMetering,MultiRMSMetering} from '../dsp/index.js';
import MultichannelCompressorNode from '../dsp/compressor.js';
import CompressorWithDryWet from '../dsp/compressorwithdrywet.js';

/************************************************************************************/
/*!
 *  @class          NewReceiverMix
 *  @brief
 *
 */
/************************************************************************************/
export default class NewReceiverMix extends AbstractNode
{
    /************************************************************************************/
    /*!
     *  @brief          Class constructor
     *  @param[in]      audioContext
     *
     */
    /************************************************************************************/
    constructor( audioContext,
                 audioStreamDescriptionCollection = undefined )
    {
        super( audioContext, audioStreamDescriptionCollection );
        this._isBypass = false;
        this._rmsRefreshInterval = 50;     /// interval (in msec for refreshing the RMS measurement)
        this._durationHold = 0;             /// how long (in msec) the compressor has been on hold
        
        if( typeof audioStreamDescriptionCollection === "undefined" )
        {
            throw new Error("the audioStreamDescriptionCollection must be defined !");
        }
        
        /// first of all, check if there is a commentary stream.
        /// if not, the Receiver-Mix has nothing to do (just bypass)
        
        /// this is the N value in the .pdf :
        /// when the RMS of the commentary is > N (expressed in dB), the programme P must be analyzed
        this._thresholdForCommentary = NewReceiverMix.defaultForCommentaryThreshold;
        
        /// this is the X value in the .pdf :
        /// when the RMS of the programme P is > X, the programme is compressed
        this._thresholdForProgramme = NewReceiverMix.defaultForProgrammeThreshold;
        
        /// the actual number of channels will be later overriden
        this._compressors = [];
        
        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        const totalNumberOfChannels_ = this.getTotalNumberOfChannels();
        
        /// sanity check
        /// mainAudio (2) + extendedAmbience (6) + extendedComments (1) + extendedDialogs (1) = 10
        if( totalNumberOfChannels_ != 10 )
        {
            console.log( "warning : total number of channels = " + totalNumberOfChannels_ );
        }
        
        /// measure the RMS for each of the input channels
        this._rmsMeteringNode = new MultiRMSMetering( audioContext, totalNumberOfChannels_ );
        
        this._rmsMeteringNode.SetTimeConstant( 50 );
        
        /// main splitter node, at the entrance of the NewReceiverMix
        this._splitterNode = audioContext.createChannelSplitter( totalNumberOfChannels_ );
        
        /// main channel merger, at the output of the NewReceiverMix
        this._mergerNode = audioContext.createChannelMerger( totalNumberOfChannels_ );
        
        /// sanity checks
        if( this._splitterNode.numberOfInputs != 1
           || this._splitterNode.numberOfOutputs != totalNumberOfChannels_ )
        {
            throw new Error("Pas bon");
        }
        
        /// sanity checks
        if( this._mergerNode.numberOfInputs != totalNumberOfChannels_
           || this._mergerNode.numberOfOutputs != 1 )
        {
            throw new Error("Pas bon");
        }
        
        this._updateAudioGraph();
        
        this._updateCompressor();
    }
    
    //==============================================================================
    getTotalNumberOfChannels()
    {
        return this._audioStreamDescriptionCollection.totalNumberOfChannels;
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
     * Notification when the active stream(s) changes
     * (i.e. whenever a check box is modified)
     */
    activeStreamsChanged()
    {
        this._updateAudioGraph();
    }
    
    //==============================================================================
    /**
     * Returns true if there is at least one commentary among all the streams
     */
    get hasExtendedCommentary()
    {
        return this._audioStreamDescriptionCollection.hasExtendedCommentary;
    }
    
    /**
     * Returns true if there is at least one commentary among all the streams,
     * and if it is currently active
     */
    get hasActiveExtendedCommentary()
    {
        return this._audioStreamDescriptionCollection.hasActiveExtendedCommentary;
    }
    
    //==============================================================================
    /**
     * Returns the number of channels in the "main" programme.
     */
    getNumberOfChannelsInTheProgramme()
    {
        
        /// retrieves the AudioStreamDescriptionCollection
        const asdc = this._audioStreamDescriptionCollection;
        
        if( asdc.hasActiveStream === false )
        {
            throw new Error("no programme running !");
            return 0;
        }
        
        /// retrieves the active AudioStreamDescription(s)
        const asd = asdc.actives;
        
        for( let i = 0; i < asd.length; i++ )
        {
            const stream_ = asd[i];
            
            if( stream_.type === "Stereo" && stream_.active === true )
            {
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
    set thresholdForCommentary( valueIndB )
    {
        const [minValue, maxValue] = NewReceiverMix.rangeForCommentaryThreshold;
        
        this._thresholdForCommentary = utilities.clamp( valueIndB, minValue, maxValue );
    }
    
    /**
     * Get the gate threshold (in dB) for the commentary
     * @type {number}
     */
    get thresholdForCommentary()
    {
        return this._thresholdForCommentary;
    }
    
    /**
     * Sets the gate threshold (in dB) for the commentary, according to a slider in the GUI
     * theSlider : the slider
     * return the actual value of the gate threshold (in dB) for the commentary
     */
    setThresholdForCommentaryFromGui( theSlider )
    {
        /// the value of the fader
        const valueFader = parseFloat( theSlider.value );
        
        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );
        
        // get the actual bounds for this parameter
        const [minValue, maxValue] = NewReceiverMix.rangeForCommentaryThreshold;
        
        /// scale from GUI to DSP
        const value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );
        
        this.thresholdForCommentary = value;
        
        return value;
    }
    
    /**
     * Returns the current value of compression ratio, already scaled for the GUI
     * theSlider : the slider
     */
    getThresholdForCommentaryFromGui( theSlider )
    {
        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );
        
        // get the actual bounds for this parameter
        const [minValue, maxValue] = NewReceiverMix.rangeForCommentaryThreshold;
        
        const actualValue = this.thresholdForCommentary;
        
        /// scale from DSP to GUI
        const value = M4DPAudioModules.utilities.scale( actualValue, minValue, maxValue, minFader, maxFader );
        
        return value;
    }
    
    /**
     * Get the dB range
     * @type {array}
     */
    static get rangeForCommentaryThreshold()
    {
        return [-60, 0];
    }
    
    static get minForCommentaryThreshold()
    {
        const [minValue, maxValue] = NewReceiverMix.rangeForCommentaryThreshold;
        return minValue;
    }
    
    static get maxForCommentaryThreshold()
    {
        const [minValue, maxValue] = NewReceiverMix.rangeForCommentaryThreshold;
        return maxValue;
    }
    
    /**
     * Returns the default value (in dB)
     * @type {number}
     */
    static get defaultForCommentaryThreshold()
    {
        return -40;
    }
    
    
    //==============================================================================
    /**
     * Set the gate threshold (in dB) for the commentary
     * @type {number}
     */
    set thresholdForProgramme( valueIndB )
    {
        this._thresholdForProgramme = valueIndB;
    }
    /**
     * Get the gate threshold (in dB) for the commentary
     * @type {number}
     */
    get thresholdForProgramme()
    {
        return this._thresholdForProgramme;
    }
    
    
    /**
     * Sets the gate threshold (in dB) for the programme, according to a slider in the GUI
     * theSlider : the slider
     * return the actual value of the gate threshold (in dB) for the programme
     */
    setThresholdForProgrammeFromGui( theSlider )
    {
        /// the value of the fader
        const valueFader = parseFloat( theSlider.value );
        
        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );
        
        // get the actual bounds for this parameter
        const [minValue, maxValue] = NewReceiverMix.rangeForProgrammeThreshold;
        
        /// scale from GUI to DSP
        const value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );
        
        this.thresholdForProgramme = value;
        
        return value;
    }
    
    /**
     * Returns the current value of compression ratio, already scaled for the GUI
     * theSlider : the slider
     */
    getThresholdForProgrammeFromGui( theSlider )
    {
        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );
        
        // get the actual bounds for this parameter
        const [minValue, maxValue] = NewReceiverMix.rangeForProgrammeThreshold;
        
        const actualValue = this.thresholdForProgramme;
        
        /// scale from DSP to GUI
        const value = M4DPAudioModules.utilities.scale( actualValue, minValue, maxValue, minFader, maxFader );
        
        return value;
    }
    
    /**
     * Get the dB range
     * @type {array}
     */
    static get rangeForProgrammeThreshold()
    {
        return [-60, 0];
    }
    
    static get minForProgrammeThreshold()
    {
        const [minValue, maxValue] = NewReceiverMix.rangeForProgrammeThreshold;
        return minValue;
    }
    
    static get maxForCommentaryThreshold()
    {
        const [minValue, maxValue] = NewReceiverMix.rangeForProgrammeThreshold;
        return maxValue;
    }
    
    /**
     * Returns the default value (in dB)
     * @type {number}
     */
    static get defaultForProgrammeThreshold()
    {
        return -45;
    }
    
    //==============================================================================
    /**
     * Returns the RMS value for the commentary, in dB
     */
    getRmsForCommentary()
    {
        
        if( this._hasExtendedCommentaryToAnalyze() === true )
        {
            const indexForExtendedCommentary = this._getChannelIndexForExtendedCommentary();
            
            return this._rmsMeteringNode.GetValuedB( indexForExtendedCommentary );
        }
        else
        {
            return -200;
        }
        
    }
    
    /**
     * Returns the RMS value for the commentary, as a string
     */
    getRmsForCommentaryAsString()
    {
        return 'RMS comments = ' + this.getRmsForCommentary().toFixed(1) + ' dB';
    }
    
    //==============================================================================
    /**
     * This function returns the index of the source which corresponds to the commentary
     * (that needs to be analyzed)
     * Returns -1 if there is no commentary
     */
    _getChannelIndexForExtendedCommentary()
    {
        /// retrieves the AudioStreamDescriptionCollection
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        const asdc = this._audioStreamDescriptionCollection;
        
        return asdc.channelIndexForExtendedCommentary;
    }
    
    /**
     * Returns true if there is a commentary stream and if it is active
     */
    _hasExtendedCommentaryToAnalyze()
    {
        const indexForExtendedCommentary = this._getChannelIndexForExtendedCommentary();
        
        return ( this.hasActiveExtendedCommentary === true && indexForExtendedCommentary >= 0 );
    }
    
    
    //==============================================================================
    /**
     * The current program is either Stereo or MultiWithLFE
     */
    _getProgramStream()
    {
        
        const asdc = this._audioStreamDescriptionCollection;
        
        /// go through all the streams
        for( let stream of asdc.streams )
        {
            if( stream.type === "Stereo" && stream.active === true )
            {
                return stream;
            }
            else if ( stream.type === "MultiWithLFE" && stream.active === true )
            {
                return stream;
            }
        }
        
        return undefined;
    }
    
    /**
     * Among all the streams, this returns an array containing the indices of channels
     * to analyze for the program.
     */
    _getChannelsIndicesForProgram()
    {
        
        const programStream = this._getProgramStream();
        
        if( typeof programStream === "undefined" )
        {
            return [];
        }
        else
        {
            ///@todo : skip the LFE in case of 5.1
            
            var channelIndex = 0;
            
            var indices = [];
            
            const asdc = this._audioStreamDescriptionCollection;
            for( let stream of asdc.streams )
            {
                const numChannelsForThisStream = stream.numChannels;
                
                if( stream === programStream )
                {
                    for( let k = 0; k < numChannelsForThisStream; k++ )
                    {
                        const index = channelIndex + k;
                        indices.push( index );
                    }
                }
                else
                {
                    channelIndex += numChannelsForThisStream;
                }
            }
            
            return indices;
        }
        
    }
    
    _hasProgramToAnalyze()
    {
        const programStream = this._getProgramStream();
        
        if( typeof programStream === "undefined" )
        {
            return false;
        }
        else
        {
            return true;
        }
    }
    
    //==============================================================================
    getRmsForProgram()
    {
        
        if( this._hasProgramToAnalyze() === true )
        {
            const indicesForProgram = this._getChannelsIndicesForProgram();
            
            var rms = [];
            
            /// average rms among all channels of the program (except for LFE)
            
            for( let i = 0; i < indicesForProgram.length; i++ )
            {
                const index = indicesForProgram[i];
                
                const lin = this._rmsMeteringNode.GetValue( index );
                
                rms.push( lin );
            }
            
            const avg = utilities.mean( rms );
            
            return utilities.lin2powdB( avg + 1e-12 );
        }
        else
        {
            return -200;
        }
    }
    
    /**
     * Returns the RMS value for the commentary, as a string
     */
    getRmsForProgramAsString()
    {
        return 'RMS program = ' + this.getRmsForProgram().toFixed(1) + ' dB';
    }
    
    //==============================================================================
    /**
     * The number of channels of the current program (i.e. the number of channels) that have to be analyzed
     * or 0 if there is no active program at the moment
     */
    _getNumChannelsForProgramStream()
    {
        
        const programStream = this._getProgramStream();
        
        if( typeof programStream === "undefined" )
        {
            return 0;
        }
        else
        {
            return programStream.numChannels;
        }
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Returns true if some compression is currently applied
     *
     */
    /************************************************************************************/
    get dynamicCompressionState()
    {
        return this._getDryWet() > 1.0;
    }
    
    //==============================================================================
    /**
     * This method should be called once, and then it repeats itself periodically
     */
    _updateCompressor()
    {
        
        /// execute this function again, after a given interval
        window.setTimeout( () => {
                          this._updateCompressor();
                          }, this._rmsRefreshInterval );
        
        if( this.bypass === true )
        {
            /// increment the counter
            this._durationHold += this._rmsRefreshInterval;
            
            /// nothing else to do
            return;
        }
        
        const isCompressing = this.dynamicCompressionState;
        
        /// in msec
        /// once the compression gets activated,
        /// the compression remains with a dry/wet of 100%
        const uptime   = 325;   /// msec
        const downtime = 750;
        
        var holdtime = 0;
        
        if( isCompressing === true )
        {
            holdtime = downtime;
        }
        else
        {
            holdtime = uptime;
        }
        
        if( this._durationHold < holdtime )
        {
            /// increment the counter
            this._durationHold += this._rmsRefreshInterval;
            
            return;
        }
        else
        {
            const isCriteriaMet = this._isCompressionCriteriaMet();
            
            if( isCriteriaMet === true )
            {
                this._setDryWet( 100, 250 );
            }
            else
            {
                this._setDryWet( 0, 1500 );
            }
            
            /// reset the counter
            this._durationHold = 0;
        }
        
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Returns true if the compression criteria is met
     *
     */
    /************************************************************************************/
    _isCompressionCriteriaMet()
    {
        if( this.bypass === true  )
        {
            return false;
        }
        else
        {
            if( this._hasExtendedCommentaryToAnalyze() === true  )
            {
                const C = this.getRmsForCommentary();
                const P = this.getRmsForProgram();
                
                const N = this.thresholdForCommentary;
                const X = this.thresholdForProgramme;
                
                if( C > N && P > X )
                {
                    return true;
                }
            }
            else
            {
                return false;
            }
        }
    }
    
    _setDryWet( ratio, rampTimeInMilliseconds )
    {
        for( let i = 0; i < this._compressors.length; i++ )
        {
            this._compressors[i].setDryWet( ratio, rampTimeInMilliseconds );
        }
    }
    
    _getDryWet()
    {
        if( this._compressors.length > 0 )
        {
            return this._compressors[0].getDryWet();
        }
        else
        {
            return 0.0;
        }
    }
    
    /************************************************************************************/
    /*!
     *  @brief          removes all the nodes from the current audio graph
     *
     */
    /************************************************************************************/
    _disconnectEveryNodes()
    {
        this._input.disconnect();
        this._splitterNode.disconnect();
        this._mergerNode.disconnect();
        
        for( let i = 0; i < this._compressors.length; i++ )
        {
            this._compressors[i].disconnect();
        }
        
        /// note that the RMS metering remains always connected
        this._input.connect( this._rmsMeteringNode._input );
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Updates the connections of the audio graph
     *
     */
    /************************************************************************************/
    _updateAudioGraph()
    {
        
        /// first of all, disconnect everything
        this._disconnectEveryNodes();
        
        /// the bypass case
        if( this.bypass === true
         || this._hasProgramToAnalyze() === false
         || this._hasExtendedCommentaryToAnalyze() === false )
        {
            this._input.connect( this._output );
            
            return;
        }
        
        const totalNumberOfChannels_ = this.getTotalNumberOfChannels();
        
        const numChannelsForProgramStream = this._getNumChannelsForProgramStream();
        
        /// create the compressors
        {
            /// delete all existing compressors (if any)
            this._compressors = [];
            
            for( let i = 0; i < numChannelsForProgramStream; i++ )
            {
                const newCompressor = new CompressorWithDryWet( this._audioContext );
                
                this._compressors.push( newCompressor );
            }
        }
        
        /// configure the compressors
        {
            for( let i = 0; i < this._compressors.length; i++ )
            {
                this._compressors[i].setAttack( 5 );
                this._compressors[i].setRelease( 80 );
                this._compressors[i].setCompressorRatio( 2 );
                this._compressors[i].setCompressorThreshold( -28 );
                
                this._compressors[i].setExpanderRatio( 1 );
                this._compressors[i].setMakeUpGain( 0 );
            }
        }
        
        /// split the input streams into N independent channels
        this._input.connect( this._splitterNode );
        
        const indicesForProgram = this._getChannelsIndicesForProgram();
        
        /// sanity check
        if( indicesForProgram.length !== numChannelsForProgramStream )
        {
            throw new Error("Ca parait pas bon...");
        }
        
        var compressorIndex = 0;
        
        for( let i = 0; i < totalNumberOfChannels_; i++ )
        {
            /// is this a channel that goes into the compressor ?
            
            const shouldGoToCompressor = indicesForProgram.includes(i);
            
            if( shouldGoToCompressor === true )
            {
                this._splitterNode.connect( this._compressors[ compressorIndex ]._input, i, 0 );
                
                this._compressors[ compressorIndex ]._output.connect( this._mergerNode, 0, i );
                
                compressorIndex++;
            }
            else
            {
                /// not going to the compressor
                this._splitterNode.connect( this._mergerNode, i, i );
            }
        }
        
        /// sanity check
        if( compressorIndex !== numChannelsForProgramStream )
        {
            throw new Error("pas bon !");
        }
        
        this._mergerNode.connect( this._output );
        
    }
}


