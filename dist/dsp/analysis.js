'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       analysis.js
 *   @brief      This class implements an audio stream analysis
 *   @author     Jean-Philippe Lambert
 *   @date       04/2016
 *
 */
/************************************************************************************/

var AnalysisNode = function (_AbstractNode) {
  _inherits(AnalysisNode, _AbstractNode);

  //==============================================================================
  /**
   * @brief This class implements the analysis on a single channel.
   *        The analysis is based on AnalyserNode.
   *
   * @param {AudioContext} audioContext - audioContext instance.
   */

  function AnalysisNode(audioContext) {
    _classCallCheck(this, AnalysisNode);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AnalysisNode).call(this, audioContext));

    _this._analyser = audioContext.createAnalyser();
    _this._input.connect(_this._analyser);

    // default values
    _this._analyser.fftSize = 2048;
    _this._analyser.minDecibels = -100;
    _this._analyser.maxDecibels = -30;
    _this._analyser.smoothingTimeConstant = 0.85;
    _this._voiceMinFrequency = 300;
    _this._voiceMaxFrequency = 4000;

    _this._analyserUpdate();
    return _this;
  }

  //==============================================================================
  /**
   * Set the number of bins of the FFT
   * @type {number} fftSize : a non-zero power of 2 in a range from 32 to 2048
   */

  _createClass(AnalysisNode, [{
    key: 'getRMS',

    //==============================================================================
    /**
     * Get the RMS of the analysed signal.
     * @returns {number} RMS
     */
    value: function getRMS() {
      this._analyser.getFloatTimeDomainData(this._analysed);

      var rms = this._analysed.reduce(function (previous, current) {
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

  }, {
    key: 'getVoiceEmergence',
    value: function getVoiceEmergence() {
      this._analyser.getFloatFrequencyData(this._analysed);

      var nonVoiceMagnitude = 0;

      var voiceMagnitude = 0;

      var bin = 0;

      for (; bin < this._voiceMinBin; ++bin) {
        nonVoiceMagnitude += this._analysed[bin];
      }

      for (; bin <= this._voiceMaxBin; ++bin) {
        voiceMagnitude += this._analysed[bin];
      }

      for (; bin < this._analyser.frequencyBinCount; ++bin) {
        nonVoiceMagnitude += this._analysed[bin];
      }

      return voiceMagnitude * this._binVoiceNormalisation - nonVoiceMagnitude * this._binNonVoiceNormalisation;
    }

    //==============================================================================
    /**
     * Update memory pre-allocation and pre-computed normalisation factors.
     * @private
     */

  }, {
    key: '_analyserUpdate',
    value: function _analyserUpdate() {
      this._voiceMinBin = Math.max(1, // avoid first FFT bin
      Math.min(this._analyser.frequencyBinCount - 1, Math.round(this._voiceMinFrequency * this._analyser.fftSize / this._audioContext.sampleRate)));

      this._voiceMaxBin = Math.max(this._voiceMinBin, Math.min(this._analyser.frequencyBinCount - 1, Math.round(this._voiceMaxFrequency * this._analyser.fftSize / this._audioContext.sampleRate)));

      this._binsGlobalNormalisation = 1 / this._analyser.frequencyBinCount;

      var voiceBinCount = this._voiceMaxBin - this._voiceMinBin + 1;

      this._binVoiceNormalisation = 1 / voiceBinCount;
      this._binNonVoiceNormalisation = 1 / (this._analyser.frequencyBinCount - voiceBinCount);

      // pre-allocation
      this._analysed = new Float32Array(this._analyser.frequencyBinCount);
    }
  }, {
    key: 'analyserFftSize',
    set: function set(fftSize) {
      this._analyser.fftSize = fftSize;
      this._analyserUpdate();
    }

    /**
     * Set the number of bins of the FFT
     * @type {number} fftSize
     */
    ,
    get: function get() {
      return this._analyser.fftSize;
    }

    //==============================================================================
    /**
     * Set the minimum threshold for the spectrum of the analyser node
     * @type {number} threshold : a value in dB
     */

  }, {
    key: 'analyserMinDecibels',
    set: function set(threshold) {
      this._analyser.minDecibels = threshold;
      this._analyserUpdate();
    }

    /**
     * Get the minimum threshold for the spectrum of the analyser node
     * @type {number} threshold
     */
    ,
    get: function get() {
      return this._analyser.minDecibels;
    }

    //==============================================================================
    /**
     * Set the maximum threshold for the spectrum of the analyser node
     * @type {number} threshold : a value in dB
     */

  }, {
    key: 'analyserMaxDecibels',
    set: function set(threshold) {
      this._analyser.maxDecibels = threshold;
      this._analyserUpdate();
    }

    /**
     * Get the maximum threshold for the spectrum of the analyser node
     * @type {number} threshold
     */
    ,
    get: function get() {
      return this._analyser.maxDecibels;
    }

    //==============================================================================
    /**
     * Set the smoothing time constant for the spectrum of the analyser node
     * @type {number} smoothing : it must be in the range 0 to 1 (0 meaning no time averaging).
     */

  }, {
    key: 'analyserSmoothingTimeConstant',
    set: function set(smoothing) {
      this._analyser.smoothingTimeConstant = smoothing;
      this._analyserUpdate();
    }

    /**
     * Get the smoothing time constant for the spectrum of the analyser node
     * @type {number} smoothing : it must be in the range 0 to 1 (0 meaning no time averaging).
     */
    ,
    get: function get() {
      return this._analyser.smoothingTimeConstant;
    }

    //==============================================================================
    /**
     * Set the minimum frequency corresponding to the voice
     * @type {number} frequency : in hertz
     */

  }, {
    key: 'voiceMinFrequency',
    set: function set(frequency) {
      this._voiceMinFrequency = frequency;
      this._analyserUpdate();
    }

    /**
     * Get the minimum frequency corresponding to the voice
     * @type {number} frequency : in hertz
     */
    ,
    get: function get() {
      return this._voiceMinFrequency;
    }

    //==============================================================================
    /**
     * Set the maximum frequency corresponding to the voice
     * @type {number} frequency : in hertz
     */

  }, {
    key: 'voiceMaxFrequency',
    set: function set(frequency) {
      this._voiceMaxFrequency = frequency;
      this._analyserUpdate();
    }

    /**
     * Get the maximum frequency corresponding to the voice
     * @type {number} frequency : in hertz
     */
    ,
    get: function get() {
      return this._voiceMaxFrequency;
    }
  }]);

  return AnalysisNode;
}(_index2.default);

exports.default = AnalysisNode;