/************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      This class implements the so-called SmartFader module of M4DP
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/
import AbstractNode from '../core/index.js';
import utilities from '../core/utils.js';
import MultichannelCompressorNode from '../dsp/compressor.js'

/************************************************************************************/
/*!
 *  @class          SmartFader
 *  @brief          This class implements the so-called SmartFader module of M4DP
 *  @ingroup        dsp
 *
 */
/************************************************************************************/
export default class SmartFader extends AbstractNode
{

    /************************************************************************************/
    /*!
     *  @brief          Class constructor
     *
     */
    /************************************************************************************/
    constructor(audioContext,
                audioStreamDescriptionCollection = undefined, 
                dB = 0.0)
    {
        super( audioContext, audioStreamDescriptionCollection );
        this._dB = undefined;
        this._compressionRatio = SmartFader.defaultCompressionRatio;
        this._attackTime = SmartFader.defaultAttackTime;
        this._releaseTime = SmartFader.defaultReleaseTime;
        this._isBypass = false;

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        const totalNumberOfChannels_ = this._audioStreamDescriptionCollection.totalNumberOfChannels;

        ///@n the gain and dynamic compression are applied similarly to all channels
        this._gainNode = audioContext.createGain();
        this._dynamicCompressorNode = new MultichannelCompressorNode( audioContext, totalNumberOfChannels_ );

        /// connect the audio nodes
        this._updateAudioGraph();

        /// initialization
        {
            this.dB = dB;
            this._updateCompressorSettings();
        }
    }

    /************************************************************************************/
    /*!
     *  @brief          Enable or bypass the processor
     *
     */
    /************************************************************************************/
    set bypass( value )
    {
        if( value !== this._isBypass )
        {
            this._isBypass = value;
            this._updateAudioGraph();
        }
    }

    /************************************************************************************/
    /*!
     *  @brief          Returns true if the processor is bypassed
     *
     */
    /************************************************************************************/
    get bypass()
    {
        return this._isBypass;
    }

    //==============================================================================
    /**
     * Set the dB value
     * @type {number}
     */
    set dB( value )
    {
        /// clamp the incoming value
        this._dB = SmartFader.clampdB( value );

        /// update the DSP processor
        this._update();
    }

    /**
     * Get the dB value
     * @type {number}
     */
    get dB()
    {
        return this._dB;
    }

    /**
     * Clips a value within the proper dB range
     * @type {number} value the value to be clipped
     */
    static clampdB( value )
    {
        const [minValue, maxValue] = SmartFader.dBRange;

        return utilities.clamp( value, minValue, maxValue );
    }

    //==============================================================================
    /**
     * Get the dB range
     * @type {array}
     * @details +8 dB suffisent, pour passer du -23 au -15 LUFS (iTunes), c'est l'idée.
     */
    static get dBRange()
    {
        return [-60, 8];
    }

    static get mindBRange()
    {
        const [minValue, maxValue] = SmartFader.dBRange;
        return minValue;
    }

    static get maxdBRange()
    {
        const [minValue, maxValue] = SmartFader.dBRange;
        return maxValue;
    }

    /**
     * Returns the default value (in dB)
     * @type {number}
     */
    static get dBDefault()
    {
        return 0;
    }

    //==============================================================================
    /**
     * Sets the compression ratio, according to a slider in the GUI
     * theSlider : the slider
     * return the actual value of the compression ratio
     */
    setdBFromGui( theSlider )
    {
        /// the value of the fader
        const valueFader = parseFloat( theSlider.value );

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = SmartFader.dBRange;

        /// scale from GUI to DSP
        const value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );

        this.dB = value;

        return value;
    }

    /**
     * Returns the current value of compression ratio, already scaled for the GUI
     * theSlider : the slider
     */
    getdBForGui( theSlider )
    {
        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = SmartFader.dBRange;

        const actualValue = this.dB;

        /// scale from DSP to GUI
        const value = M4DPAudioModules.utilities.scale( actualValue, minValue, maxValue, minFader, maxFader );

        return value;
    }

    //==============================================================================
    /**
     * Returns the dynamic compression state
     * @type {boolean}
     */
    get dynamicCompressionState()
    {
        /// representing the amount of gain reduction currently applied by the compressor to the signal.

        /**
        Intended for metering purposes, it returns a value in dB, or 0 (no gain reduction) if no signal is fed
        into the DynamicsCompressorNode. The range of this value is between -20 and 0 (in dB).
        */

        return this._dynamicCompressorNode.dynamicCompressionState;
    }

    /**
     * Notification when the active stream(s) changes
     */
    activeStreamsChanged()
    {
        this._updateCompressorSettings();
    }

    //==============================================================================
    /**
     * Sets the compression ratio
     * representing the amount of change, in dB, needed in the input for a 1 dB change in the output
     */
    set compressionRatio( value )
    {
        const [minValue, maxValue] = SmartFader.compressionRatioRange;

        this._compressionRatio = utilities.clamp( value, minValue, maxValue );

        this._updateCompressorSettings();
    }

    /**
     * Returns the compression ratio     
     */
    get compressionRatio()
    {
        return this._compressionRatio;
    }

    /**
     * Get the compression ratio range
     * @type {array}     
     */
    static get compressionRatioRange()
    {
        return [ SmartFader.minCompressionRatioRange, SmartFader.maxCompressionRatioRange ];
    }

    static get minCompressionRatioRange()
    {
        return MultichannelCompressorNode.minRatio;
    }

    static get maxCompressionRatioRange()
    {
        return MultichannelCompressorNode.maxRatio;
    }

    /**
     * Returns the default compression ratio
     * @type {number}
     */
    static get defaultCompressionRatio()
    {
        return 2;
    }

    //==============================================================================
    /**
     * Sets the compression ratio, according to a slider in the GUI
     * theSlider : the slider
     * return the actual value of the compression ratio
     */
    setCompressionRatioFromGui( theSlider )
    {
        /// the value of the fader
        const valueFader = parseFloat( theSlider.value );

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = SmartFader.compressionRatioRange;

        /// scale from GUI to DSP
        const value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );

        this.compressionRatio = value;

        return value;
    }

    /**
     * Returns the current value of compression ratio, already scaled for the GUI
     * theSlider : the slider
     */
    getCompressionRatioForGui( theSlider )
    {
        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = SmartFader.compressionRatioRange;

        const actualValue = this.compressionRatio;

        /// scale from DSP to GUI
        const value = M4DPAudioModules.utilities.scale( actualValue, minValue, maxValue, minFader, maxFader );

        return value;
    }

    //==============================================================================
    /**
     * Sets the attack time (in msec)
     * representing the amount of time, in seconds, required to reduce the gain by 10 dB
     */
    set attackTime( value )
    {
        const [minValue, maxValue] = SmartFader.attackTimeRange;

        this._attackTime = utilities.clamp( value, minValue, maxValue );

        this._updateCompressorSettings();
    }

    /**
     * Returns the attack time (in msec)  
     */
    get attackTime()
    {
        return this._attackTime;
    }

    /**
     * Get the attack time range (in msec)
     * @type {array}     
     */
    static get attackTimeRange()
    {
        return [ SmartFader.minAttackTimeRange, SmartFader.maxAttackTimeRange ];
    }

    /**
     * Returns the minimum attack time (in msec)  
     */
    static get minAttackTimeRange()
    {
        return utilities.sec2ms( MultichannelCompressorNode.minAttack );
    }

    /**
     * Returns the maximum attack time (in msec)  
     */
    static get maxAttackTimeRange()
    {
        return utilities.sec2ms( MultichannelCompressorNode.maxAttack );
    }

    /**
     * Returns the default attack time (in msec)
     * @type {number}
     */
    static get defaultAttackTime()
    {
        return 20;
    }

    //==============================================================================
    /**
     * Sets the attack time, according to a slider in the GUI
     * theSlider : the slider
     * return the actual value of the attack time (in msec)
     */
    setAttackTimeFromGui( theSlider )
    {
        /// the value of the fader
        const valueFader = parseFloat( theSlider.value );

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = SmartFader.attackTimeRange;

        /// scale from GUI to DSP
        const value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );

        this.attackTime = value;

        return value;
    }

    /**
     * Returns the current value of attack time, already scaled for the GUI
     * theSlider : the slider
     */
    getAttackTimeForGui( theSlider )
    {
        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = SmartFader.attackTimeRange;

        const actualValue = this.attackTime;

        /// scale from DSP to GUI
        const value = M4DPAudioModules.utilities.scale( actualValue, minValue, maxValue, minFader, maxFader );

        return value;
    }


    //==============================================================================
    /**
     * Sets the release time (in msec)
     * representing the amount of time, in seconds, required to increase the gain by 10 dB
     */
    set releaseTime( value )
    {
        const [minValue, maxValue] = SmartFader.releaseTimeRange;

        this._releaseTime = utilities.clamp( value, minValue, maxValue );

        this._updateCompressorSettings();
    }

    /**
     * Returns the release time (in msec)  
     */
    get releaseTime()
    {
        return this._releaseTime;
    }

    /**
     * Get the release time range (in msec)
     * @type {array}     
     */
    static get releaseTimeRange()
    {
        return [ SmartFader.minReleaseTimeRange, SmartFader.maxReleaseTimeRange ];
    }

    /**
     * Returns the minimum release time (in msec)  
     */
    static get minReleaseTimeRange()
    {
        return utilities.sec2ms( MultichannelCompressorNode.minRelease );
    }

    /**
     * Returns the maximum release time (in msec)  
     */
    static get maxReleaseTimeRange()
    {
        return utilities.sec2ms( MultichannelCompressorNode.maxRelease );
    }

    /**
     * Returns the default release time (in msec)
     * @type {number}
     */
    static get defaultReleaseTime()
    {
        return 200;
    }

    //==============================================================================
    /**
     * Sets the release time, according to a slider in the GUI
     * theSlider : the slider
     * return the actual value of the release time (in msec)
     */
    setReleaseTimeFromGui( theSlider )
    {
        /// the value of the fader
        const valueFader = parseFloat( theSlider.value );

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = SmartFader.releaseTimeRange;

        /// scale from GUI to DSP
        const value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );

        this.releaseTime = value;

        return value;
    }

    /**
     * Returns the current value of release time, already scaled for the GUI
     * theSlider : the slider
     */
    getReleaseTimeForGui( theSlider )
    {
        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = SmartFader.releaseTimeRange;

        const actualValue = this.releaseTime;

        /// scale from DSP to GUI
        const value = M4DPAudioModules.utilities.scale( actualValue, minValue, maxValue, minFader, maxFader );

        return value;
    }

    _updateCompressorSettings()
    {

        /// retrieves the AudioStreamDescriptionCollection
        const asdc = this._audioStreamDescriptionCollection;
        
        if( asdc.hasActiveStream === false )
        {
            //console.log( "no active streams !!");
            return;
        }
        
        ///@todo : que faire si plusieurs streams sont actifs ??

        /// retrieves the active AudioStreamDescription(s)
        const asd = asdc.actives;

        /// sanity check
        if( asd.length <= 0 )
        {
            throw new Error("Y'a un bug qq part...");
        }
        
        /// use the first active stream (???)
        const activeStream = asd[0];

        /**
        Le reglage du volume doit se comporter de la facon suivante :
        - attenuation classique du volume sonore entre le niveau nominal (gain = 0) et en deca
        - augmentation classique du volume sonore entre le niveau nominal et le niveau max (niveau max = niveau nominal + I MaxTruePeak I)
        - limiteur/compresseur multicanal au dela du niveau max
        */

        /// retrieves the MaxTruePeak (ITU­R BS.1770­3) of the active AudioStreamDescription
        /// (expressed in dBTP)
        const maxTruePeak = activeStream.maxTruePeak;

        /// integrated loudness (in LUFS)
        const nominal = activeStream.loudness;

        /// sanity check
        if( nominal >= 0.0 )
        {
            throw new Error("Ca parait pas bon...");
        }

        const threshold = nominal + Math.abs( maxTruePeak );

        /**
        Matthieu :
        Dans mon papier sur le sujet j'avais défini les ordres de grandeur d'une matrice pour expliciter
        la progression de la compression en fonction du niveau d'entrée. 
        Ça donne un ratio de 2:1 sur les premiers 6 dB de dépassement puis 3:1 au delà. 
        Est-ce plus simple pour vous d'user de cette matrice ou d'appeler un compresseur multicanal 
        et lui passer des paramètres classiques ?

        On aurait alors :
        Threshold à -18 dBFS
        Ratio à 2:1
        Attack à 20 ms
        Release à 200 ms
        */

        
        /// representing the decibel value above which the compression will start taking effect
        this._dynamicCompressorNode.setThreshold( threshold );

        /// representing the amount of change, in dB, needed in the input for a 1 dB change in the output
        this._dynamicCompressorNode.setRatio( this._compressionRatio );

        /// representing the amount of time, in seconds, required to reduce the gain by 10 dB
        const attackInSeconds = utilities.ms2sec( this._attackTime );
        this._dynamicCompressorNode.setAttack( attackInSeconds ); 

        /// representing the amount of time, in seconds, required to increase the gain by 10 dB
        const releaseInSeconds = utilities.ms2sec( this._releaseTime );
        this._dynamicCompressorNode.setRelease( releaseInSeconds );
        
    }

    _update()
    {
        //console.log( "_update" );

        /// the current fader value, in dB
        const fader = this._dB;

        if( typeof fader === "undefined" || isNaN( fader ) === true )
        {
            /// this can happen during the construction...
            return;
        }

        const lin = utilities.dB2lin( fader );

        this._gainNode.gain.value = lin;
    }

    //==============================================================================
    /**
     * Updates the connections of the audio graph
     */
    _updateAudioGraph()
    {
        
        /// first of all, disconnect everything
        this._input.disconnect();
        this._gainNode.disconnect();
        this._dynamicCompressorNode.disconnect();

        if( this.bypass === true )
        {
            this._input.connect( this._output );
        }
        else
        {
            this._input.connect( this._gainNode );
            this._gainNode.connect( this._dynamicCompressorNode._input );
            this._dynamicCompressorNode.connect( this._output );
        }
    }
}
