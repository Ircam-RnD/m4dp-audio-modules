'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _utils = require('../core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

var _index3 = require('../dsp/index.js');

var _compressor = require('../dsp/compressor.js');

var _compressor2 = _interopRequireDefault(_compressor);

var _compressorwithdrywet = require('../dsp/compressorwithdrywet.js');

var _compressorwithdrywet2 = _interopRequireDefault(_compressorwithdrywet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
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

/************************************************************************************/
/*!
 *  @class          NewReceiverMix
 *  @brief
 *
 */
/************************************************************************************/

var NewReceiverMix = function (_AbstractNode) {
    _inherits(NewReceiverMix, _AbstractNode);

    /************************************************************************************/
    /*!
     *  @brief          Class constructor
     *  @param[in]      audioContext
     *
     */
    /************************************************************************************/

    function NewReceiverMix(audioContext) {
        var audioStreamDescriptionCollection = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

        _classCallCheck(this, NewReceiverMix);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NewReceiverMix).call(this, audioContext, audioStreamDescriptionCollection));

        _this._isBypass = false;
        _this._rmsRefreshInterval = 50; /// interval (in msec for refreshing the RMS measurement)
        _this._durationHold = 0; /// how long (in msec) the compressor has been on hold

        if (typeof audioStreamDescriptionCollection === "undefined") {
            throw new Error("the audioStreamDescriptionCollection must be defined !");
        }

        /// first of all, check if there is a commentary stream.
        /// if not, the Receiver-Mix has nothing to do (just bypass)

        /// this is the N value in the .pdf :
        /// when the RMS of the commentary is > N (expressed in dB), the programme P must be analyzed
        _this._thresholdForCommentary = NewReceiverMix.defaultForCommentaryThreshold;

        /// this is the X value in the .pdf :
        /// when the RMS of the programme P is > X, the programme is compressed
        _this._thresholdForProgramme = NewReceiverMix.defaultForProgrammeThreshold;

        /// the actual number of channels will be later overriden
        _this._compressors = [];

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        var totalNumberOfChannels_ = _this.getTotalNumberOfChannels();

        /// sanity check
        /// mainAudio (2) + extendedAmbience (6) + extendedComments (1) + extendedDialogs (1) = 10
        if (totalNumberOfChannels_ != 10) {
            console.log("warning : total number of channels = " + totalNumberOfChannels_);
        }

        /// measure the RMS for each of the input channels
        _this._rmsMeteringNode = new _index3.MultiRMSMetering(audioContext, totalNumberOfChannels_);

        _this._rmsMeteringNode.SetTimeConstant(50);

        /// main splitter node, at the entrance of the NewReceiverMix
        _this._splitterNode = audioContext.createChannelSplitter(totalNumberOfChannels_);

        /// main channel merger, at the output of the NewReceiverMix
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

        _this._updateCompressor();
        return _this;
    }

    //==============================================================================


    _createClass(NewReceiverMix, [{
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

            var _NewReceiverMix$range = _slicedToArray(NewReceiverMix.rangeForCommentaryThreshold, 2);

            var minValue = _NewReceiverMix$range[0];
            var maxValue = _NewReceiverMix$range[1];

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

            var _NewReceiverMix$range2 = _slicedToArray(NewReceiverMix.rangeForCommentaryThreshold, 2);

            var minValue = _NewReceiverMix$range2[0];
            var maxValue = _NewReceiverMix$range2[1];


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

            var _NewReceiverMix$range3 = _slicedToArray(NewReceiverMix.rangeForProgrammeThreshold, 2);

            var minValue = _NewReceiverMix$range3[0];
            var maxValue = _NewReceiverMix$range3[1];

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

            var _NewReceiverMix$range4 = _slicedToArray(NewReceiverMix.rangeForProgrammeThreshold, 2);

            var minValue = _NewReceiverMix$range4[0];
            var maxValue = _NewReceiverMix$range4[1];


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
        key: 'getRmsForCommentary',


        //==============================================================================
        /**
         * Returns the RMS value for the commentary, in dB
         */
        value: function getRmsForCommentary() {

            if (this._hasExtendedCommentaryToAnalyze() === true) {
                var indexForExtendedCommentary = this._getChannelIndexForExtendedCommentary();

                return this._rmsMeteringNode.GetValuedB(indexForExtendedCommentary);
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
                var indicesForProgram = this._getChannelsIndicesForProgram();

                var rms = [];

                /// average rms among all channels of the program (except for LFE)

                for (var i = 0; i < indicesForProgram.length; i++) {
                    var index = indicesForProgram[i];

                    var lin = this._rmsMeteringNode.GetValue(index);

                    rms.push(lin);
                }

                var avg = _utils2.default.mean(rms);

                return _utils2.default.lin2powdB(avg + 1e-12);
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

        /************************************************************************************/
        /*!
         *  @brief          Returns true if some compression is currently applied
         *
         */
        /************************************************************************************/

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

            if (this.bypass === true) {
                /// increment the counter
                this._durationHold += this._rmsRefreshInterval;

                /// nothing else to do
                return;
            }

            var isCompressing = this.dynamicCompressionState;

            /// in msec
            /// once the compression gets activated,
            /// the compression remains with a dry/wet of 100%
            var uptime = 325; /// msec
            var downtime = 750;

            var holdtime = 0;

            if (isCompressing === true) {
                holdtime = downtime;
            } else {
                holdtime = uptime;
            }

            if (this._durationHold < holdtime) {
                /// increment the counter
                this._durationHold += this._rmsRefreshInterval;

                return;
            } else {
                var isCriteriaMet = this._isCompressionCriteriaMet();

                if (isCriteriaMet === true) {
                    this._setDryWet(100, 250);
                } else {
                    this._setDryWet(0, 1500);
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

    }, {
        key: '_isCompressionCriteriaMet',
        value: function _isCompressionCriteriaMet() {
            if (this.bypass === true) {
                return false;
            } else {
                if (this._hasExtendedCommentaryToAnalyze() === true) {
                    var C = this.getRmsForCommentary();
                    var P = this.getRmsForProgram();

                    var N = this.thresholdForCommentary;
                    var X = this.thresholdForProgramme;

                    if (C > N && P > X) {
                        return true;
                    }
                } else {
                    return false;
                }
            }
        }
    }, {
        key: '_setDryWet',
        value: function _setDryWet(ratio, rampTimeInMilliseconds) {
            for (var i = 0; i < this._compressors.length; i++) {
                this._compressors[i].setDryWet(ratio, rampTimeInMilliseconds);
            }
        }
    }, {
        key: '_getDryWet',
        value: function _getDryWet() {
            if (this._compressors.length > 0) {
                return this._compressors[0].getDryWet();
            } else {
                return 0.0;
            }
        }

        /************************************************************************************/
        /*!
         *  @brief          removes all the nodes from the current audio graph
         *
         */
        /************************************************************************************/

    }, {
        key: '_disconnectEveryNodes',
        value: function _disconnectEveryNodes() {
            this._input.disconnect();
            this._splitterNode.disconnect();
            this._mergerNode.disconnect();

            for (var i = 0; i < this._compressors.length; i++) {
                this._compressors[i].disconnect();
            }

            /// note that the RMS metering remains always connected
            this._input.connect(this._rmsMeteringNode._input);
        }

        /************************************************************************************/
        /*!
         *  @brief          Updates the connections of the audio graph
         *
         */
        /************************************************************************************/

    }, {
        key: '_updateAudioGraph',
        value: function _updateAudioGraph() {

            /// first of all, disconnect everything
            this._disconnectEveryNodes();

            /// the bypass case
            if (this.bypass === true || this._hasProgramToAnalyze() === false || this._hasExtendedCommentaryToAnalyze() === false) {
                this._input.connect(this._output);

                return;
            }

            var totalNumberOfChannels_ = this.getTotalNumberOfChannels();

            var numChannelsForProgramStream = this._getNumChannelsForProgramStream();

            /// create the compressors
            {
                /// delete all existing compressors (if any)
                this._compressors = [];

                for (var i = 0; i < numChannelsForProgramStream; i++) {
                    var newCompressor = new _compressorwithdrywet2.default(this._audioContext);

                    this._compressors.push(newCompressor);
                }
            }

            /// configure the compressors
            {
                for (var _i = 0; _i < this._compressors.length; _i++) {
                    this._compressors[_i].setAttack(5);
                    this._compressors[_i].setRelease(80);
                    this._compressors[_i].setCompressorRatio(2);
                    this._compressors[_i].setCompressorThreshold(-28);

                    this._compressors[_i].setExpanderRatio(1);
                    this._compressors[_i].setMakeUpGain(0);
                }
            }

            /// split the input streams into N independent channels
            this._input.connect(this._splitterNode);

            var indicesForProgram = this._getChannelsIndicesForProgram();

            /// sanity check
            if (indicesForProgram.length !== numChannelsForProgramStream) {
                throw new Error("Ca parait pas bon...");
            }

            var compressorIndex = 0;

            for (var _i2 = 0; _i2 < totalNumberOfChannels_; _i2++) {
                /// is this a channel that goes into the compressor ?

                var shouldGoToCompressor = indicesForProgram.includes(_i2);

                if (shouldGoToCompressor === true) {
                    this._splitterNode.connect(this._compressors[compressorIndex]._input, _i2, 0);

                    this._compressors[compressorIndex]._output.connect(this._mergerNode, 0, _i2);

                    compressorIndex++;
                } else {
                    /// not going to the compressor
                    this._splitterNode.connect(this._mergerNode, _i2, _i2);
                }
            }

            /// sanity check
            if (compressorIndex !== numChannelsForProgramStream) {
                throw new Error("pas bon !");
            }

            this._mergerNode.connect(this._output);
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
            var _NewReceiverMix$range5 = _slicedToArray(NewReceiverMix.rangeForCommentaryThreshold, 2);

            var minValue = _NewReceiverMix$range5[0];
            var maxValue = _NewReceiverMix$range5[1];


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
        key: 'dynamicCompressionState',
        get: function get() {
            return this._getDryWet() > 1.0;
        }
    }], [{
        key: 'rangeForCommentaryThreshold',
        get: function get() {
            return [-60, 0];
        }
    }, {
        key: 'minForCommentaryThreshold',
        get: function get() {
            var _NewReceiverMix$range6 = _slicedToArray(NewReceiverMix.rangeForCommentaryThreshold, 2);

            var minValue = _NewReceiverMix$range6[0];
            var maxValue = _NewReceiverMix$range6[1];

            return minValue;
        }
    }, {
        key: 'maxForCommentaryThreshold',
        get: function get() {
            var _NewReceiverMix$range7 = _slicedToArray(NewReceiverMix.rangeForProgrammeThreshold, 2);

            var minValue = _NewReceiverMix$range7[0];
            var maxValue = _NewReceiverMix$range7[1];

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
            return -40;
        }
    }, {
        key: 'rangeForProgrammeThreshold',
        get: function get() {
            return [-60, 0];
        }
    }, {
        key: 'minForProgrammeThreshold',
        get: function get() {
            var _NewReceiverMix$range8 = _slicedToArray(NewReceiverMix.rangeForProgrammeThreshold, 2);

            var minValue = _NewReceiverMix$range8[0];
            var maxValue = _NewReceiverMix$range8[1];

            return minValue;
        }
    }, {
        key: 'defaultForProgrammeThreshold',
        get: function get() {
            return -45;
        }
    }]);

    return NewReceiverMix;
}(_index2.default);

exports.default = NewReceiverMix;