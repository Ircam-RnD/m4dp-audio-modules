/************************************************************************************/
/*!
 *   @file       analysis.js
 *   @brief      This class implements an audio stream analysis
 *   @author     Jean-Philippe Lambert
 *   @date       04/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';

export default class AnalysisNode extends AbstractNode
{
    //==============================================================================
    /**
    * @brief This class implements the analysis on a single channel.
    *        The analysis is based on AnalyserNode.
    *
    * @param {AudioContext} audioContext - audioContext instance.
    */
    constructor( audioContext )
    {
        super( audioContext);

        this._analyser = audioContext.createAnalyser();
        this._input.connect(this._analyser);

        // default values
        this._analyser.fftSize = 2048;
        this._analyser.minDecibels = -100;
        this._analyser.maxDecibels = -30;
        this._analyser.smoothingTimeConstant = 0.85;
        this._voiceMinFrequency = 300;
        this._voiceMaxFrequency = 4000;

        this._analyserUpdate();
    }

    //==============================================================================
    /**
    * Set the number of bins of the FFT
    * @type {number} fftSize : a non-zero power of 2 in a range from 32 to 2048
    */
    set analyserFftSize( fftSize )
    {
        this._analyser.fftSize = fftSize;
        this._analyserUpdate();
    }

    /**
    * Set the number of bins of the FFT
    * @type {number} fftSize
    */
    get analyserFftSize()
    {
        return this._analyser.fftSize;
    }

    //==============================================================================
    /**
    * Set the minimum threshold for the spectrum of the analyser node
    * @type {number} threshold : a value in dB
    */
    set analyserMinDecibels( threshold )
    {
        this._analyser.minDecibels = threshold;
        this._analyserUpdate();
    }

    /**
    * Get the minimum threshold for the spectrum of the analyser node
    * @type {number} threshold
    */
    get analyserMinDecibels()
    {
        return this._analyser.minDecibels;
    }

    //==============================================================================
    /**
    * Set the maximum threshold for the spectrum of the analyser node
    * @type {number} threshold : a value in dB
    */
    set analyserMaxDecibels( threshold )
    {
        this._analyser.maxDecibels = threshold;
        this._analyserUpdate();
    }

    /**
    * Get the maximum threshold for the spectrum of the analyser node
    * @type {number} threshold
    */
    get analyserMaxDecibels()
    {
        return this._analyser.maxDecibels;
    }

    //==============================================================================
    /**
    * Set the smoothing time constant for the spectrum of the analyser node
    * @type {number} smoothing : it must be in the range 0 to 1 (0 meaning no time averaging).
    */
    set analyserSmoothingTimeConstant( smoothing )
    {
        this._analyser.smoothingTimeConstant = smoothing;
        this._analyserUpdate();
    }

    /**
    * Get the smoothing time constant for the spectrum of the analyser node
    * @type {number} smoothing : it must be in the range 0 to 1 (0 meaning no time averaging).
    */
    get analyserSmoothingTimeConstant()
    {
        return this._analyser.smoothingTimeConstant;
    }

    //==============================================================================
    /**
    * Set the minimum frequency corresponding to the voice
    * @type {number} frequency : in hertz
    */
    set voiceMinFrequency( frequency )
    {
        this._voiceMinFrequency = frequency;
        this._analyserUpdate();
    }

    /**
    * Get the minimum frequency corresponding to the voice
    * @type {number} frequency : in hertz
    */
    get voiceMinFrequency()
    {
        return this._voiceMinFrequency;
    }

    //==============================================================================
    /**
    * Set the maximum frequency corresponding to the voice
    * @type {number} frequency : in hertz
    */
    set voiceMaxFrequency( frequency )
    {
        this._voiceMaxFrequency = frequency;
        this._analyserUpdate();
    }

    /**
    * Get the maximum frequency corresponding to the voice
    * @type {number} frequency : in hertz
    */
    get voiceMaxFrequency()
    {
        return this._voiceMaxFrequency;
    }

    //==============================================================================
    /**
    * Get the RMS of the analysed signal.
    * @returns {number} RMS
    */
    getRMS()
    {
        this._analyser.getFloatTimeDomainData(this._analysed);

        const rms = this._analysed.reduce( (previous, current) => {
          return previous + current * current;
        }, 0);

        return Math.sqrt(rms * this._binsGlobalNormalisation);
    }

    //==============================================================================
    /**
    * Get the emergence of the frequencies corresponding to the voice.
    * @returns {number} emergence : the difference, of the normalised magnitudes,
    * of the frequencies corresponding to the voice to the other frequencies.
    */
    getVoiceEmergence()
    {
        this._analyser.getFloatFrequencyData(this._analysed);

        let nonVoiceMagnitude = 0;

        let voiceMagnitude = 0;

        let bin = 0;

        for(; bin < this._voiceMinBin; ++bin)
        {
          nonVoiceMagnitude += this._analysed[bin];
        }

        for(; bin <= this._voiceMaxBin; ++bin)
        {
          voiceMagnitude += this._analysed[bin];
        }

        for(; bin < this._analyser.frequencyBinCount; ++bin)
        {
          nonVoiceMagnitude += this._analysed[bin];
        }

        return voiceMagnitude * this._binVoiceNormalisation
          - nonVoiceMagnitude * this._binNonVoiceNormalisation;
    }

    //==============================================================================
    /**
    * Update memory pre-allocation and pre-computed normalisation factors.
    * @private
    */
    _analyserUpdate()
    {
        this._voiceMinBin = Math.max(1, // avoid first FFT bin
                                     Math.min(this._analyser.frequencyBinCount - 1,
                                              Math.round(this._voiceMinFrequency * this._analyser.fftSize
                                                         / this._audioContext.sampleRate) ) );

        this._voiceMaxBin = Math.max(this._voiceMinBin,
                                     Math.min(this._analyser.frequencyBinCount - 1,
                                              Math.round(this._voiceMaxFrequency * this._analyser.fftSize
                                                         / this._audioContext.sampleRate) ) );

        this._binsGlobalNormalisation = 1 / this._analyser.frequencyBinCount;

        const voiceBinCount = this._voiceMaxBin - this._voiceMinBin + 1;

        this._binVoiceNormalisation = 1 / voiceBinCount;
        this._binNonVoiceNormalisation = 1 / (this._analyser.frequencyBinCount - voiceBinCount);

        // pre-allocation
        this._analysed = new Float32Array(this._analyser.frequencyBinCount);
    }

}