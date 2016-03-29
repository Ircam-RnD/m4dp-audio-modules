'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _analysis = require('../dsp/analysis.js');

var _analysis2 = _interopRequireDefault(_analysis);

var _utils = require('../core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

var _compressor = require('../dsp/compressor.js');

var _compressor2 = _interopRequireDefault(_compressor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
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

var ReceiverMix = function (_AbstractNode) {
    _inherits(ReceiverMix, _AbstractNode);

    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
     */

    function ReceiverMix(audioContext) {
        var audioStreamDescriptionCollection = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

        _classCallCheck(this, ReceiverMix);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ReceiverMix).call(this, audioContext, audioStreamDescriptionCollection));

        _this._isBypass = false;

        if (typeof audioStreamDescriptionCollection === "undefined") {
            throw new Error("the audioStreamDescriptionCollection must be defined !");
        }

        /// first of all, check if there is a commentary stream.
        /// if not, the Receiver-Mix has nothing to do (just bypass)

        var hasComment = _this.hasCommentary;

        /// create an analyzer node for computing the RMS of the main programme
        _this._analysisNodeMain = new _analysis2.default(audioContext);

        /// create an analyzer node for computing the RMS of the commentary
        _this._analysisNodeCommentary = new _analysis2.default(audioContext);

        /// this is the N value in the .pdf :
        /// when the RMS of the commentary is > N (expressed in dB), the programme P must be analyzed
        _this._thresholdForCommentary = ReceiverMix.defaultForCommentaryThreshold;

        /// this is the X value in the .pdf :
        /// when the RMS of the programme P is > X, the programme is compressed
        _this._thresholdForProgramme = ReceiverMix.defaultForProgrammeThreshold;

        ///@todo : fix the number of channels
        _this._dynamicCompressorNode = new _compressor2.default(audioContext, 1);

        _this._updateAudioGraph();
        return _this;
    }

    //==============================================================================
    /**
     * Enable or bypass the processor
     * @type {boolean}
     */

    _createClass(ReceiverMix, [{
        key: 'activeStreamsChanged',

        //==============================================================================
        /**
         * Notification when the active stream(s) changes
         * (i.e. whenever a check box is modified)
         */
        value: function activeStreamsChanged() {}
        ///@todo

        //==============================================================================
        /**
         * Returns true if there is at least one commentary among all the streams     
         */

    }, {
        key: 'getNumberOfChannelsInTheProgramme',

        //==============================================================================
        /**
         * Returns the number of channels in the "main" programme.
         * The 
         */
        value: function getNumberOfChannelsInTheProgramme() {

            /// retrieves the AudioStreamDescriptionCollection
            var asdc = this._audioStreamDescriptionCollection;

            if (asdc.hasActiveStream === false) {

                throw new Error("no programme running !");
                return 0;
            }

            /// retrieves the active AudioStreamDescription(s)
            var asd = asdc.actives;

            for (var i = 0; i < asd.length; i++) {

                var stream_ = asd[i];

                if (stream_.type === "Stereo" && stream_.active === true) {
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

    }, {
        key: 'setThresholdForCommentaryFromGui',

        /**
         * Sets the gate threshold (in dB) for the commentary, according to a slider in the GUI
         * theSlider : the slider
         * return the actual value of the gate threshold (in dB) for the commentary
         */
        value: function setThresholdForCommentaryFromGui(theSlider) {

            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$rangeFor = _slicedToArray(ReceiverMix.rangeForCommentaryThreshold, 2);

            var minValue = _ReceiverMix$rangeFor[0];
            var maxValue = _ReceiverMix$rangeFor[1];

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.thresholdForCommentary = value;

            return value;
        }

        /**
         * Returns the current value of compression ratio, already scaled for the GUI
         * theSlider : the slider
         */

    }, {
        key: 'getThresholdForCommentaryFromGui',
        value: function getThresholdForCommentaryFromGui(theSlider) {

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$rangeFor2 = _slicedToArray(ReceiverMix.rangeForCommentaryThreshold, 2);

            var minValue = _ReceiverMix$rangeFor2[0];
            var maxValue = _ReceiverMix$rangeFor2[1];

            var actualValue = this.thresholdForCommentary;

            /// scale from DSP to GUI
            var value = M4DPAudioModules.utilities.scale(actualValue, minValue, maxValue, minFader, maxFader);

            return value;
        }

        /**
         * Get the dB range
         * @type {array}     
         */

    }, {
        key: 'setThresholdForProgrammeFromGui',

        /**
         * Sets the gate threshold (in dB) for the programme, according to a slider in the GUI
         * theSlider : the slider
         * return the actual value of the gate threshold (in dB) for the programme
         */
        value: function setThresholdForProgrammeFromGui(theSlider) {

            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$rangeFor3 = _slicedToArray(ReceiverMix.rangeForProgrammeThreshold, 2);

            var minValue = _ReceiverMix$rangeFor3[0];
            var maxValue = _ReceiverMix$rangeFor3[1];

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.thresholdForProgramme = value;

            return value;
        }

        /**
         * Returns the current value of compression ratio, already scaled for the GUI
         * theSlider : the slider
         */

    }, {
        key: 'getThresholdForProgrammeFromGui',
        value: function getThresholdForProgrammeFromGui(theSlider) {

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$rangeFor4 = _slicedToArray(ReceiverMix.rangeForProgrammeThreshold, 2);

            var minValue = _ReceiverMix$rangeFor4[0];
            var maxValue = _ReceiverMix$rangeFor4[1];

            var actualValue = this.thresholdForProgramme;

            /// scale from DSP to GUI
            var value = M4DPAudioModules.utilities.scale(actualValue, minValue, maxValue, minFader, maxFader);

            return value;
        }

        /**
         * Get the dB range
         * @type {array}     
         */

    }, {
        key: 'setCompressorThreshold',

        //==============================================================================
        value: function setCompressorThreshold(value) {
            this._dynamicCompressorNode.setThreshold(value);
        }
    }, {
        key: 'getCompressorThreshold',
        value: function getCompressorThreshold() {
            return this._dynamicCompressorNode.getThreshold();
        }
    }, {
        key: 'setCompressorRatio',
        value: function setCompressorRatio(value) {
            this._dynamicCompressorNode.setRatio(value);
        }
    }, {
        key: 'getCompressorRatio',
        value: function getCompressorRatio() {
            return this._dynamicCompressorNode.getRatio();
        }
    }, {
        key: 'setCompressorAttack',
        value: function setCompressorAttack(value) {
            this._dynamicCompressorNode.setAttack(value);
        }
    }, {
        key: 'getCompressorAttack',
        value: function getCompressorAttack() {
            return this._dynamicCompressorNode.getAttack();
        }
    }, {
        key: 'setCompressorRelease',
        value: function setCompressorRelease(value) {
            this._dynamicCompressorNode.setRelease(value);
        }
    }, {
        key: 'getCompressorRelease',
        value: function getCompressorRelease() {
            return this._dynamicCompressorNode.getRelease();
        }

        //==============================================================================
        /**
         * Updates the connections of the audio graph
         */

    }, {
        key: '_updateAudioGraph',
        value: function _updateAudioGraph() {

            /// first of all, disconnect everything
            this._input.disconnect();

            if (this.bypass === true || this.hasCommentary === false) {

                this._input.connect(this._output);
            } else {

                /// @todo
            }
        }
    }, {
        key: 'bypass',
        set: function set(value) {

            if (value !== this._isBypass) {
                this._isBypass = value;
                this._updateAudioGraph();
            }
        }

        /**
         * Returns true if the processor is bypassed
         */
        ,
        get: function get() {
            return this._isBypass;
        }
    }, {
        key: 'hasCommentary',
        get: function get() {
            return this._audioStreamDescriptionCollection.hasCommentary;
        }
    }, {
        key: 'thresholdForCommentary',
        set: function set(valueIndB) {
            var _ReceiverMix$rangeFor5 = _slicedToArray(ReceiverMix.rangeForCommentaryThreshold, 2);

            var minValue = _ReceiverMix$rangeFor5[0];
            var maxValue = _ReceiverMix$rangeFor5[1];

            this._thresholdForCommentary = _utils2.default.clamp(valueIndB, minValue, maxValue);
        }

        /**
         * Get the gate threshold (in dB) for the commentary
         * @type {number}
         */
        ,
        get: function get() {
            return this._thresholdForCommentary;
        }
    }, {
        key: 'thresholdForProgramme',

        //==============================================================================
        /**
         * Set the gate threshold (in dB) for the commentary
         * @type {number}
         */
        set: function set(valueIndB) {
            this._thresholdForProgramme = valueIndB;
        }
        /**
         * Get the gate threshold (in dB) for the commentary
         * @type {number}
         */
        ,
        get: function get() {
            return this._thresholdForProgramme;
        }
    }], [{
        key: 'rangeForCommentaryThreshold',
        get: function get() {
            return [-60, 30];
        }
    }, {
        key: 'minForCommentaryThreshold',
        get: function get() {
            var _ReceiverMix$rangeFor6 = _slicedToArray(ReceiverMix.rangeForCommentaryThreshold, 2);

            var minValue = _ReceiverMix$rangeFor6[0];
            var maxValue = _ReceiverMix$rangeFor6[1];

            return minValue;
        }
    }, {
        key: 'maxForCommentaryThreshold',
        get: function get() {
            var _ReceiverMix$rangeFor7 = _slicedToArray(ReceiverMix.rangeForProgrammeThreshold, 2);

            var minValue = _ReceiverMix$rangeFor7[0];
            var maxValue = _ReceiverMix$rangeFor7[1];

            return maxValue;
        }

        /**
         * Returns the default value (in dB)
         * @type {number}
         */

    }, {
        key: 'defaultForCommentaryThreshold',

        /**
         * Returns the default value (in dB)
         * @type {number}
         */
        get: function get() {
            return -10;
        }
    }, {
        key: 'rangeForProgrammeThreshold',
        get: function get() {
            return [-60, 30];
        }
    }, {
        key: 'minForProgrammeThreshold',
        get: function get() {
            var _ReceiverMix$rangeFor8 = _slicedToArray(ReceiverMix.rangeForProgrammeThreshold, 2);

            var minValue = _ReceiverMix$rangeFor8[0];
            var maxValue = _ReceiverMix$rangeFor8[1];

            return minValue;
        }
    }, {
        key: 'defaultForProgrammeThreshold',
        get: function get() {
            return -15;
        }
    }]);

    return ReceiverMix;
}(_index2.default);

exports.default = ReceiverMix;