'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
        _this._shouldCompress = false;
        _this._rmsRefreshInterval = 100; /// interval (in msec for refreshing the RMS measurement)
        _this._durationHold = 0; /// how long (in msec) the compressor has been on hold
        _this._minimumHoldTime = 1500; /// hold time in msec) for the compressor

        if (typeof audioStreamDescriptionCollection === "undefined") {
            throw new Error("the audioStreamDescriptionCollection must be defined !");
        }

        /// first of all, check if there is a commentary stream.
        /// if not, the Receiver-Mix has nothing to do (just bypass)

        /// create an analyzer node for computing the RMS of the main programme
        _this._analysisNodeMain = new _analysis2.default(audioContext);

        /// create a mono analyzer node for computing the RMS of the commentary
        _this._analysisNodeCommentary = new _analysis2.default(audioContext);

        /// several mono analyzers for analyzing the main program
        _this._analysisNodeProgram = [];

        /// this is the N value in the .pdf :
        /// when the RMS of the commentary is > N (expressed in dB), the programme P must be analyzed
        _this._thresholdForCommentary = ReceiverMix.defaultForCommentaryThreshold;

        /// this is the X value in the .pdf :
        /// when the RMS of the programme P is > X, the programme is compressed
        _this._thresholdForProgramme = ReceiverMix.defaultForProgrammeThreshold;

        /// the actual number of channels will be later overriden
        _this._dynamicCompressorNode = new _compressor2.default(audioContext, 1);
        _this._dynamicCompressorNode.setRatio(ReceiverMix.defaultCompressionRatio);
        _this._dynamicCompressorNode.setAttack(_utils2.default.ms2sec(ReceiverMix.defaultAttackTime));
        _this._dynamicCompressorNode.setRelease(_utils2.default.ms2sec(ReceiverMix.defaultReleaseTime));

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        var totalNumberOfChannels_ = _this.getTotalNumberOfChannels();

        /// sanity check
        /// mainAudio (2) + extendedAmbience (6) + extendedComments (1) + extendedDialogs (1) = 10
        if (totalNumberOfChannels_ != 10) {
            console.log("warning : total number of channels = " + totalNumberOfChannels_);
        }

        /// main splitter node, at the entrance of the ReceiverMix
        _this._splitterNode = audioContext.createChannelSplitter(totalNumberOfChannels_);

        /// main channel merger, at the output of the ReceiverMix
        _this._mergerNode = audioContext.createChannelMerger(totalNumberOfChannels_);

        /// sanity checks
        if (_this._splitterNode.numberOfInputs != 1 || _this._splitterNode.numberOfOutputs != totalNumberOfChannels_) {
            throw new Error("Pas bon");
        }

        /// sanity checks
        if (_this._mergerNode.numberOfInputs != totalNumberOfChannels_ || _this._mergerNode.numberOfOutputs != 1) {
            throw new Error("Pas bon");
        }

        _this._updateAudioGraph();

        /*
        window.setInterval( () => {
            this._updateCompressor();
        }, 100);
        */

        _this._updateCompressor();
        return _this;
    }

    //==============================================================================


    _createClass(ReceiverMix, [{
        key: 'getTotalNumberOfChannels',
        value: function getTotalNumberOfChannels() {
            return this._audioStreamDescriptionCollection.totalNumberOfChannels;
        }

        //==============================================================================
        /**
         * Enable or bypass the processor
         * @type {boolean}
         */

    }, {
        key: 'activeStreamsChanged',


        //==============================================================================
        /**
         * Notification when the active stream(s) changes
         * (i.e. whenever a check box is modified)
         */
        value: function activeStreamsChanged() {
            this._updateAudioGraph();
        }

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

        /**
         * Get the compression threshold range
         * @type {array}     
         */

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
        value: function setCompressorAttack(valueInMilliseconds) {
            var value = _utils2.default.ms2sec(valueInMilliseconds);

            //console.log("compressor attack = " + value.toString() + ' sec');

            this._dynamicCompressorNode.setAttack(value);
        }
    }, {
        key: 'getCompressorAttack',
        value: function getCompressorAttack() {
            return _utils2.default.sec2ms(this._dynamicCompressorNode.getAttack());
        }
    }, {
        key: 'setCompressorRelease',
        value: function setCompressorRelease(valueInMilliseconds) {

            var value = _utils2.default.ms2sec(valueInMilliseconds);

            //console.log("compressor release = " + value.toString() + ' sec');

            this._dynamicCompressorNode.setRelease(value);
        }
    }, {
        key: 'getCompressorRelease',
        value: function getCompressorRelease() {
            return _utils2.default.sec2ms(this._dynamicCompressorNode.getRelease());
        }

        //==============================================================================
        /**
         * Sets the release time, according to a slider in the GUI
         * theSlider : the slider
         * return the actual value of the release time (in msec)
         */

    }, {
        key: 'setCompressorThresholdFromGui',
        value: function setCompressorThresholdFromGui(theSlider) {

            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$compress = _slicedToArray(ReceiverMix.compressionThresholdRange, 2);

            var minValue = _ReceiverMix$compress[0];
            var maxValue = _ReceiverMix$compress[1];

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.setCompressorThreshold(value);

            return value;
        }

        /**
         * Returns the current value of release time, already scaled for the GUI
         * theSlider : the slider
         */

    }, {
        key: 'getCompressorThresholdForGui',
        value: function getCompressorThresholdForGui(theSlider) {
            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$compress2 = _slicedToArray(ReceiverMix.compressionThresholdRange, 2);

            var minValue = _ReceiverMix$compress2[0];
            var maxValue = _ReceiverMix$compress2[1];


            var actualValue = this.getCompressorThreshold();

            /// scale from DSP to GUI
            var value = M4DPAudioModules.utilities.scale(actualValue, minValue, maxValue, minFader, maxFader);

            return value;
        }

        //==============================================================================
        /**
         * Sets the release time, according to a slider in the GUI
         * theSlider : the slider
         * return the actual value of the release time (in msec)
         */

    }, {
        key: 'setReleaseTimeFromGui',
        value: function setReleaseTimeFromGui(theSlider) {
            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$releaseT = _slicedToArray(ReceiverMix.releaseTimeRange, 2);

            var minValue = _ReceiverMix$releaseT[0];
            var maxValue = _ReceiverMix$releaseT[1];

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.setCompressorRelease(value);

            return value;
        }

        /**
         * Returns the current value of release time, already scaled for the GUI
         * theSlider : the slider
         */

    }, {
        key: 'getReleaseTimeForGui',
        value: function getReleaseTimeForGui(theSlider) {
            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$releaseT2 = _slicedToArray(ReceiverMix.releaseTimeRange, 2);

            var minValue = _ReceiverMix$releaseT2[0];
            var maxValue = _ReceiverMix$releaseT2[1];


            var actualValue = this.getCompressorRelease();

            /// scale from DSP to GUI
            var value = M4DPAudioModules.utilities.scale(actualValue, minValue, maxValue, minFader, maxFader);

            return value;
        }

        //==============================================================================
        /**
         * Sets the refresh interval for RMS measurement (in msec)
         * theSlider : the slider
         * return the actual value of the refresh interval (in msec)
         */

    }, {
        key: 'setRefreshRmsTimeFromGui',
        value: function setRefreshRmsTimeFromGui(theSlider) {
            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = 20;
            var maxValue = 500;

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this._rmsRefreshInterval = value;

            return value;
        }

        /**
         * Returns the refresh interval for RMS measurement (in msec)
         * theSlider : the slider
         */

    }, {
        key: 'getRefreshRmsTimeForGui',
        value: function getRefreshRmsTimeForGui(theSlider) {
            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = 20;
            var maxValue = 500;


            var actualValue = this._rmsRefreshInterval;

            /// scale from DSP to GUI
            var value = M4DPAudioModules.utilities.scale(actualValue, minValue, maxValue, minFader, maxFader);

            return value;
        }

        //==============================================================================
        /**
         * Sets the attack time, according to a slider in the GUI
         * theSlider : the slider
         * return the actual value of the attack time (in msec)
         */

    }, {
        key: 'setAttackTimeFromGui',
        value: function setAttackTimeFromGui(theSlider) {
            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$attackTi = _slicedToArray(ReceiverMix.attackTimeRange, 2);

            var minValue = _ReceiverMix$attackTi[0];
            var maxValue = _ReceiverMix$attackTi[1];

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.setCompressorAttack(value);

            return value;
        }

        /**
         * Returns the current value of attack time, already scaled for the GUI
         * theSlider : the slider
         */

    }, {
        key: 'getAttackTimeForGui',
        value: function getAttackTimeForGui(theSlider) {
            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$attackTi2 = _slicedToArray(ReceiverMix.attackTimeRange, 2);

            var minValue = _ReceiverMix$attackTi2[0];
            var maxValue = _ReceiverMix$attackTi2[1];


            var actualValue = this.getCompressorAttack();

            /// scale from DSP to GUI
            var value = M4DPAudioModules.utilities.scale(actualValue, minValue, maxValue, minFader, maxFader);

            return value;
        }

        //==============================================================================
        /**
         * Sets the compression ratio, according to a slider in the GUI
         * theSlider : the slider
         * return the actual value of the compression ratio
         */

    }, {
        key: 'setCompressionRatioFromGui',
        value: function setCompressionRatioFromGui(theSlider) {
            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$compress3 = _slicedToArray(ReceiverMix.compressionRatioRange, 2);

            var minValue = _ReceiverMix$compress3[0];
            var maxValue = _ReceiverMix$compress3[1];

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.setCompressorRatio(value);

            return value;
        }

        /**
         * Returns the current value of compression ratio, already scaled for the GUI
         * theSlider : the slider
         */

    }, {
        key: 'getCompressionRatioForGui',
        value: function getCompressionRatioForGui(theSlider) {
            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$compress4 = _slicedToArray(ReceiverMix.compressionRatioRange, 2);

            var minValue = _ReceiverMix$compress4[0];
            var maxValue = _ReceiverMix$compress4[1];


            var actualValue = this.getCompressorRatio();

            /// scale from DSP to GUI
            var value = M4DPAudioModules.utilities.scale(actualValue, minValue, maxValue, minFader, maxFader);

            return value;
        }

        //==============================================================================
        /**
         * Sets the minimum hold time (in msec)
         * theSlider : the slider
         * return the actual value of the hold time
         */

    }, {
        key: 'setMinimumHoldTimeFromGui',
        value: function setMinimumHoldTimeFromGui(theSlider) {
            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = 1000;
            var maxValue = 5000;

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this._minimumHoldTime = value;

            return value;
        }

        /**
         * Returns the minimum hold time (in msec)
         * theSlider : the slider
         */

    }, {
        key: 'getMinimumHoldTimeForGui',
        value: function getMinimumHoldTimeForGui(theSlider) {
            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = 1000;
            var maxValue = 5000;


            var actualValue = this._minimumHoldTime;

            /// scale from DSP to GUI
            var value = M4DPAudioModules.utilities.scale(actualValue, minValue, maxValue, minFader, maxFader);

            return value;
        }

        //==============================================================================
        /**
         * Returns the RMS value for the commentary, in dB
         */

    }, {
        key: 'getRmsForCommentary',
        value: function getRmsForCommentary() {

            if (this._hasExtendedCommentaryToAnalyze() === true) {
                return _utils2.default.lin2dBsafe(this._analysisNodeCommentary.getRMS());
            } else {
                return -200;
            }
        }

        /**
         * Returns the RMS value for the commentary, as a string
         */

    }, {
        key: 'getRmsForCommentaryAsString',
        value: function getRmsForCommentaryAsString() {
            return 'RMS comments = ' + this.getRmsForCommentary().toFixed(1) + ' dB';
        }

        //==============================================================================
        /**
         * This function returns the index of the source which corresponds to the commentary
         * (that needs to be analyzed)
         * Returns -1 if there is no commentary
         */

    }, {
        key: '_getChannelIndexForExtendedCommentary',
        value: function _getChannelIndexForExtendedCommentary() {
            /// retrieves the AudioStreamDescriptionCollection
            /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
            var asdc = this._audioStreamDescriptionCollection;

            return asdc.channelIndexForExtendedCommentary;
        }

        /**
         * Returns true if there is a commentary stream and if it is active
         */

    }, {
        key: '_hasExtendedCommentaryToAnalyze',
        value: function _hasExtendedCommentaryToAnalyze() {
            var indexForExtendedCommentary = this._getChannelIndexForExtendedCommentary();

            return this.hasActiveExtendedCommentary === true && indexForExtendedCommentary >= 0;
        }

        //==============================================================================
        /**
         * The current program is either Stereo or MultiWithLFE
         */

    }, {
        key: '_getProgramStream',
        value: function _getProgramStream() {

            var asdc = this._audioStreamDescriptionCollection;

            /// go through all the streams
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = asdc.streams[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var stream = _step.value;

                    if (stream.type === "Stereo" && stream.active === true) {
                        return stream;
                    } else if (stream.type === "MultiWithLFE" && stream.active === true) {
                        return stream;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return undefined;
        }

        /**
         * Among all the streams, this returns an array containing the indices of channels
         * to analyze for the program.
         */

    }, {
        key: '_getChannelsIndicesForProgram',
        value: function _getChannelsIndicesForProgram() {

            var programStream = this._getProgramStream();

            if (typeof programStream === "undefined") {
                return [];
            } else {
                ///@todo : skip the LFE in case of 5.1

                var channelIndex = 0;

                var indices = [];

                var asdc = this._audioStreamDescriptionCollection;
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = asdc.streams[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var stream = _step2.value;

                        var numChannelsForThisStream = stream.numChannels;

                        if (stream === programStream) {
                            for (var k = 0; k < numChannelsForThisStream; k++) {
                                var index = channelIndex + k;
                                indices.push(index);
                            }
                        } else {
                            channelIndex += numChannelsForThisStream;
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                return indices;
            }
        }
    }, {
        key: '_hasProgramToAnalyze',
        value: function _hasProgramToAnalyze() {
            var programStream = this._getProgramStream();

            if (typeof programStream === "undefined") {
                return false;
            } else {
                return true;
            }
        }

        //==============================================================================

    }, {
        key: 'getRmsForProgram',
        value: function getRmsForProgram() {
            if (this._hasProgramToAnalyze() === true) {
                var rms = [];

                /// average rms among all channels

                for (var i = 0; i < this._analysisNodeProgram.length; i++) {
                    var lin = this._analysisNodeProgram[i].getRMS();

                    rms.push(lin);
                }

                var avg = _utils2.default.mean(rms);

                return _utils2.default.lin2dBsafe(avg);
            } else {
                return -200;
            }
        }

        /**
         * Returns the RMS value for the commentary, as a string
         */

    }, {
        key: 'getRmsForProgramAsString',
        value: function getRmsForProgramAsString() {
            return 'RMS program = ' + this.getRmsForProgram().toFixed(1) + ' dB';
        }

        //==============================================================================
        /**
         * The number of channels of the current program (i.e. the number of channels) that have to be analyzed
         * or 0 if there is no active program at the moment
         */

    }, {
        key: '_getNumChannelsForProgramStream',
        value: function _getNumChannelsForProgramStream() {

            var programStream = this._getProgramStream();

            if (typeof programStream === "undefined") {
                return 0;
            } else {
                return programStream.numChannels;
            }
        }

        //==============================================================================
        /**
         * returns true if the program is being compressed
         */

    }, {
        key: '_updateCompressor',


        //==============================================================================
        /**
         * This method should be called once, and then it repeats itself periodically
         */
        value: function _updateCompressor() {
            var _this2 = this;

            /// execute this function again, after a given interval       
            window.setTimeout(function () {
                _this2._updateCompressor();
            }, this._rmsRefreshInterval);

            /// in msec
            /// once the compression gets activated,
            /// we will hold it for at least 1500 msec
            /// i.e. for 1500 msec, we suspend the RMS comparison,
            /// and the compression remains with a dry/wet of 100%
            var minimumHoldTime = this._minimumHoldTime;

            ///@todo : the hold time could also appear in the GUI

            if (this.bypass === false && this._shouldCompress === true && this._durationHold <= minimumHoldTime) {
                /// hold the compressor for at least 1000 msec

                /// increment the counter
                this._durationHold += this._rmsRefreshInterval;

                return;
            }

            /// the hold period is over; now, really compare the RMS,
            /// to activate or not the compression

            this._shouldCompress = false;

            if (this.bypass === true) {
                this._shouldCompress = false;
            } else {
                if (this._hasExtendedCommentaryToAnalyze() === true) {
                    var C = this.getRmsForCommentary();
                    var P = this.getRmsForProgram();

                    var N = this.thresholdForCommentary;
                    var X = this.thresholdForProgramme;

                    if (C > N && P > X) {
                        this._shouldCompress = true;
                    }
                } else {
                    this._shouldCompress = false;
                }
            }

            if (this._shouldCompress === true) {
                //ratio = this._compressionRatio;
                //this._dynamicCompressorNode.bypass = false;
                this._dynamicCompressorNode.drywet = 100;

                /// increment the counter
                this._durationHold += this._rmsRefreshInterval;
            } else {
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

    }, {
        key: '_updateAudioGraph',
        value: function _updateAudioGraph() {

            /// first of all, disconnect everything
            this._input.disconnect();
            this._splitterNode.disconnect();
            this._analysisNodeCommentary.disconnect();
            this._mergerNode.disconnect();
            this._dynamicCompressorNode.disconnect();

            if (typeof this._splitterAfterCompressor !== "undefined") {
                this._splitterAfterCompressor.disconnect();
            }
            if (typeof this._mergerBeforeCompressor !== "undefined") {
                this._mergerBeforeCompressor.disconnect();
            }

            for (var i = 0; i < this._analysisNodeProgram.length; i++) {
                this._analysisNodeProgram[i].disconnect();
            }

            var indexForExtendedCommentary = this._getChannelIndexForExtendedCommentary();

            /// split the input streams into N independent channels
            this._input.connect(this._splitterNode);

            /// connect the analyzer for the commentary
            if (this._hasExtendedCommentaryToAnalyze() === true) {
                this._splitterNode.connect(this._analysisNodeCommentary._input, indexForExtendedCommentary, 0);
            }

            var indicesForProgram = this._getChannelsIndicesForProgram();

            /// connect the analyzers for the program
            if (this._hasProgramToAnalyze() === true) {
                var numChannelsForProgramStream = this._getNumChannelsForProgramStream();

                /// sanity check
                if (indicesForProgram.length !== numChannelsForProgramStream) {
                    throw new Error("Ca parait pas bon...");
                }

                /// delete the previous analyzers
                this._analysisNodeProgram = [];

                /// create N (mono) analyzers
                for (var _i = 0; _i < numChannelsForProgramStream; _i++) {
                    var newAnalyzer = new _analysis2.default(this._audioContext);
                    this._analysisNodeProgram.push(newAnalyzer);
                }

                /// connect the (mono) analyzers to the channel splitter
                for (var _i2 = 0; _i2 < numChannelsForProgramStream; _i2++) {
                    var splitterOutputIndex = indicesForProgram[_i2];

                    this._splitterNode.connect(this._analysisNodeProgram[_i2]._input, splitterOutputIndex, 0);
                }

                /// re-build the compressor if needed
                if (this._dynamicCompressorNode.getNumChannels() !== numChannelsForProgramStream) {

                    /// preserve the old state
                    var ratio = this._dynamicCompressorNode.getRatio();
                    var attack = this._dynamicCompressorNode.getAttack();
                    var release = this._dynamicCompressorNode.getRelease();
                    var threshold = this._dynamicCompressorNode.getThreshold();

                    /// destroy the compressor
                    this._dynamicCompressorNode = "undefined";

                    var audioContext = this._audioContext;

                    /// create a new one
                    this._dynamicCompressorNode = new _compressor2.default(audioContext, numChannelsForProgramStream);

                    /// restore the settings
                    this._dynamicCompressorNode.setRatio(ratio);
                    this._dynamicCompressorNode.setAttack(attack);
                    this._dynamicCompressorNode.setRelease(release);
                    this._dynamicCompressorNode.setThreshold(threshold);

                    /// delete these nodes
                    this._splitterAfterCompressor = "undefined";
                    this._mergerBeforeCompressor = "undefined";

                    /// a channel splitter at the output of the compressor
                    this._splitterAfterCompressor = audioContext.createChannelSplitter(numChannelsForProgramStream);

                    this._mergerBeforeCompressor = audioContext.createChannelMerger(numChannelsForProgramStream);
                }
            }

            if (this.bypass === true || this._hasProgramToAnalyze() === false) {
                this._input.connect(this._output);
            } else {

                /// sanity checks
                var _numChannelsForProgramStream = this._getNumChannelsForProgramStream();

                if (_numChannelsForProgramStream <= 0) {
                    throw new Error("pas bon !");
                }

                if (typeof this._dynamicCompressorNode === "undefined") {
                    throw new Error("pas bon !");
                }

                if (typeof this._splitterAfterCompressor === "undefined") {
                    throw new Error("pas bon !");
                }

                if (typeof this._mergerBeforeCompressor === "undefined") {
                    throw new Error("pas bon !");
                }

                if (this._dynamicCompressorNode.getNumChannels() !== _numChannelsForProgramStream) {
                    throw new Error("pas bon !");
                }

                if (this._splitterAfterCompressor.numberOfInputs != 1 || this._splitterAfterCompressor.numberOfOutputs != _numChannelsForProgramStream) {
                    throw new Error("pas bon !");
                }

                if (this._mergerBeforeCompressor.numberOfInputs != _numChannelsForProgramStream || this._mergerBeforeCompressor.numberOfOutputs != 1) {
                    throw new Error("pas bon !");
                }

                if (indicesForProgram.length !== _numChannelsForProgramStream) {
                    throw new Error("pas bon !");
                }

                var totalNumberOfChannels_ = this.getTotalNumberOfChannels();

                this._mergerBeforeCompressor.connect(this._dynamicCompressorNode._input);
                this._dynamicCompressorNode.connect(this._splitterAfterCompressor);

                var compressorIndex = 0;

                for (var _i3 = 0; _i3 < totalNumberOfChannels_; _i3++) {
                    /// is this a channel that goes into the compressor ?

                    var shouldGoToCompressor = indicesForProgram.includes(_i3);

                    if (shouldGoToCompressor === true) {
                        this._splitterNode.connect(this._mergerBeforeCompressor, _i3, compressorIndex);

                        this._splitterAfterCompressor.connect(this._mergerNode, compressorIndex, _i3);

                        compressorIndex++;
                    } else {
                        /// not going to the compressor
                        this._splitterNode.connect(this._mergerNode, _i3, _i3);
                    }
                }

                /// sanity check
                if (compressorIndex !== _numChannelsForProgramStream) {
                    throw new Error("pas bon !");
                }

                this._mergerNode.connect(this._output);
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
        key: 'hasExtendedCommentary',
        get: function get() {
            return this._audioStreamDescriptionCollection.hasExtendedCommentary;
        }

        /**
         * Returns true if there is at least one commentary among all the streams,
         * and if it is currently active     
         */

    }, {
        key: 'hasActiveExtendedCommentary',
        get: function get() {
            return this._audioStreamDescriptionCollection.hasActiveExtendedCommentary;
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
    }, {
        key: 'shouldCompressProgram',
        get: function get() {
            return this._shouldCompress;
        }

        //==============================================================================
        /**
         * Returns the dynamic compression state
         * @type {boolean}
         */

    }, {
        key: 'dynamicCompressionState',
        get: function get() {
            //return this._dynamicCompressorNode.dynamicCompressionState && this._shouldCompress;
            return this._shouldCompress;
        }
    }], [{
        key: 'rangeForCommentaryThreshold',
        get: function get() {
            return [-60, 0];
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
            return -30;
        }
    }, {
        key: 'rangeForProgrammeThreshold',
        get: function get() {
            return [-60, 0];
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
            return -35;
        }
    }, {
        key: 'compressionThresholdRange',
        get: function get() {
            return [ReceiverMix.minCompressionThresholdRange, ReceiverMix.maxCompressionThresholdRange];
        }
    }, {
        key: 'minCompressionThresholdRange',
        get: function get() {
            return _compressor2.default.minThreshold;
        }
    }, {
        key: 'maxCompressionThresholdRange',
        get: function get() {
            return _compressor2.default.maxThreshold;
        }

        /**
         * Returns the default threshold ratio
         * @type {number}
         */

    }, {
        key: 'defaultCompressionThreshold',
        get: function get() {
            return _compressor2.default.defaultThreshold;
        }

        /**
         * Get the compression ratio range
         * @type {array}     
         */

    }, {
        key: 'compressionRatioRange',
        get: function get() {
            return [ReceiverMix.minCompressionRatioRange, ReceiverMix.maxCompressionRatioRange];
        }
    }, {
        key: 'minCompressionRatioRange',
        get: function get() {
            return _compressor2.default.minRatio;
        }
    }, {
        key: 'maxCompressionRatioRange',
        get: function get() {
            return _compressor2.default.maxRatio;
        }

        /**
         * Returns the default compression ratio
         * @type {number}
         */

    }, {
        key: 'defaultCompressionRatio',
        get: function get() {
            return 5;
        }

        /**
         * Get the attack time range (in msec)
         * @type {array}     
         */

    }, {
        key: 'attackTimeRange',
        get: function get() {
            return [ReceiverMix.minAttackTimeRange, ReceiverMix.maxAttackTimeRange];
        }

        /**
         * Returns the minimum attack time (in msec)  
         */

    }, {
        key: 'minAttackTimeRange',
        get: function get() {
            return _utils2.default.sec2ms(_compressor2.default.minAttack);
        }

        /**
         * Returns the maximum attack time (in msec)  
         */

    }, {
        key: 'maxAttackTimeRange',
        get: function get() {

            return _utils2.default.sec2ms(_compressor2.default.maxAttack);
        }

        /**
         * Returns the default attack time (in msec)
         * @type {number}
         */

    }, {
        key: 'defaultAttackTime',
        get: function get() {
            return 5;
        }

        /**
         * Get the release time range (in msec)
         * @type {array}     
         */

    }, {
        key: 'releaseTimeRange',
        get: function get() {
            return [ReceiverMix.minReleaseTimeRange, ReceiverMix.maxReleaseTimeRange];
        }

        /**
         * Returns the minimum release time (in msec)  
         */

    }, {
        key: 'minReleaseTimeRange',
        get: function get() {
            return _utils2.default.sec2ms(_compressor2.default.minRelease);
        }

        /**
         * Returns the maximum release time (in msec)  
         */

    }, {
        key: 'maxReleaseTimeRange',
        get: function get() {
            return _utils2.default.sec2ms(_compressor2.default.maxRelease);
        }

        /**
         * Returns the default release time (in msec)
         * @type {number}
         */

    }, {
        key: 'defaultReleaseTime',
        get: function get() {
            return 20;
        }
    }]);

    return ReceiverMix;
}(_index2.default);

exports.default = ReceiverMix;