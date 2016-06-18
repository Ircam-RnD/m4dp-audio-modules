'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MultiCompressorExpanderNode = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _utils = require('../core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       compressorexpander.js
 *   @brief      This class implements a mono compressor/expander, ported from C++ to javascript
 *   @author     Thibaut Carpentier
 *   @date       06/2016
 *
 */
/************************************************************************************/

/************************************************************************************/
/*!
 *  @class          CompressorExpanderNode
 *  @brief          Compressor/Expander
 *  @details        The processor does not include the lookahead of the C++ version
 *  @details        mono version
 *
 */
/************************************************************************************/

var CompressorExpanderNode = function (_AbstractNode) {
    _inherits(CompressorExpanderNode, _AbstractNode);

    /************************************************************************************/
    /*!
     *  @brief          Class constructor
     *
     */
    /************************************************************************************/

    function CompressorExpanderNode(audioContext) {
        _classCallCheck(this, CompressorExpanderNode);

        // default values

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CompressorExpanderNode).call(this, audioContext));

        _this._averagingTime = 30; /// msec
        _this._attack = 10; /// msec
        _this._release = 30; /// msec
        _this._compressorThreshold = -30; /// msec
        _this._expanderThreshold = -60; /// msec
        _this._compressorRatio = 1;
        _this._expanderRatio = 1;
        _this._makeupIndB = 0; /// dB
        _this._samplerate = _utils2.default.clamp(audioContext.sampleRate, 22050, 192000);

        _this._bypass = false;

        /// local variables
        _this._makeup = undefined;
        _this._tav = undefined;
        _this._rms = 0.0;
        _this._at = undefined;
        _this._rt = undefined;
        _this._CS = undefined;
        _this._ES = undefined;
        _this._g = 1.0;

        _this._updateParameters();

        {
            var bufferSize = 0;
            /*
            The buffer size in units of sample-frames. If specified, the bufferSize must be one of the following values:
            256, 512, 1024, 2048, 4096, 8192, 16384. If it's not passed in, or if the value is 0,
            then the implementation will choose the best buffer size for the given environment,
            which will be a constant power of 2 throughout the lifetime of the node.
            */
            var numberOfInputChannels = 1;
            var numberOfOutputChannels = 1;
            _this._scriptNode = audioContext.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);

            var compressor = _this;

            _this._scriptNode.onaudioprocess = function (audioProcessingEvent) {
                var inputBuffer = audioProcessingEvent.inputBuffer;
                var outputBuffer = audioProcessingEvent.outputBuffer;

                var inputIndex = 0;
                var outputIndex = 0;

                var inputData = inputBuffer.getChannelData(inputIndex);
                var outputData = outputBuffer.getChannelData(outputIndex);

                var numSamples = inputBuffer.length;

                var one_minus_tav = 1. - compressor._tav;

                for (var i = 0; i < numSamples; i++) {
                    var x = inputData[i];

                    compressor._rms = one_minus_tav * compressor._rms + compressor._tav * x * x;

                    var X = compressor._rms < 1e-12 ? -120. : _utils2.default.lin2powdB(compressor._rms);

                    var G = 0.0;
                    if (X > compressor._compressorThreshold) {
                        G = compressor._CS * (compressor._compressorThreshold - X);
                    } else if (X < compressor._expanderThreshold) {
                        G = compressor._ES * (X - compressor._expanderThreshold);
                    }

                    var f = _utils2.default.dB2lin(G);

                    var coeff = f < compressor._g ? compressor._at : compressor._rt;

                    compressor._g = (1.0 - coeff) * compressor._g + coeff * f;

                    outputData[i] = x * compressor._g * compressor._makeup;
                }
            };
        }

        if (_this._bypass === true) {
            _this._input.connect(_this._output);
        } else {
            _this._input.connect(_this._scriptNode);
            _this._scriptNode.connect(_this._output);
        }
        return _this;
    }

    //==============================================================================
    /**
     * @brief Set attack time
     *
     */


    _createClass(CompressorExpanderNode, [{
        key: 'setAttack',
        value: function setAttack(valueInMsec) {
            var MinAttack = 0.1; /// msec
            var MaxAttack = 3000; /// msec

            this._attack = _utils2.default.clamp(valueInMsec, MinAttack, MaxAttack);

            this._updateParameters();
        }

        //==============================================================================
        /**
         * @brief Set release time
         *
         */

    }, {
        key: 'setRelease',
        value: function setRelease(valueInMsec) {
            var MinRelease = 0.1; /// msec
            var MaxRelease = 5000; /// msec

            this._release = _utils2.default.clamp(valueInMsec, MinRelease, MaxRelease);

            this._updateParameters();
        }
    }, {
        key: 'setCompressorThreshold',
        value: function setCompressorThreshold(valueIndB) {
            var MinCompressorThreshold = -120; /// dB
            var MaxCompressorThreshold = 20; /// dB

            this._compressorThreshold = _utils2.default.clamp(valueIndB, MinCompressorThreshold, MaxCompressorThreshold);

            this._updateParameters();
        }
    }, {
        key: 'setExpanderThreshold',
        value: function setExpanderThreshold(valueIndB) {
            var MinExpanderThreshold = -120; /// dB
            var MaxExpanderThreshold = 20; /// dB

            this._expanderThreshold = _utils2.default.clamp(valueIndB, MinExpanderThreshold, MaxExpanderThreshold);

            this._updateParameters();
        }
    }, {
        key: 'setCompressorRatio',
        value: function setCompressorRatio(value) {
            var MinCompressorRatio = 1;
            var MaxCompressorRatio = 30;

            this._compressorRatio = _utils2.default.clamp(value, MinCompressorRatio, MaxCompressorRatio);

            this._updateParameters();
        }
    }, {
        key: 'setExpanderRatio',
        value: function setExpanderRatio(value) {
            var MinExpanderRatio = 0.1;
            var MaxExpanderRatio = 1;

            this._expanderRatio = _utils2.default.clamp(value, MinExpanderRatio, MaxExpanderRatio);

            this._updateParameters();
        }
    }, {
        key: 'setMakeUpGain',
        value: function setMakeUpGain(valueIndB) {
            var MinMakeUpGain = -40; /// dB
            var MaxMakeUpGain = 40;

            this._makeupIndB = _utils2.default.clamp(value, MinMakeUpGain, MaxMakeUpGain);

            this._updateParameters();
        }
    }, {
        key: 'setRMSAveragingTime',
        value: function setRMSAveragingTime(timeInMilliseconds) {
            var MinRmsAveragingTime = 5; /// msec
            var MaxRmsAveragingTime = 130;

            this._averagingTime = _utils2.default.clamp(timeInMilliseconds, MinRmsAveragingTime, MaxRmsAveragingTime);

            this._updateParameters();
        }
    }, {
        key: 'ms2param',
        value: function ms2param(valueInMilliseconds, sr) {
            var inv_sr = 1.0 / sr;

            return 1.0 - Math.exp(-2.2 * inv_sr * 1000. / valueInMilliseconds);
        }

        //==============================================================================
        /**
         * @brief Update local values
         *
         */

    }, {
        key: '_updateParameters',
        value: function _updateParameters() {
            if (typeof this._samplerate === "undefined") {
                this._samplerate == 48000;
            }

            this._samplerate = _utils2.default.clamp(this._samplerate, 22050, 192000);

            var sr = this._samplerate;

            this._tav = this.ms2param(this._averagingTime, sr);
            this._at = this.ms2param(this._attack, sr);
            this._rt = this.ms2param(this._release, sr);

            this._makeup = _utils2.default.dB2lin(this._makeupIndB);

            this._CS = 1. - 1. / this._compressorRatio;
            this._ES = 1. - 1. / this._expanderRatio;

            this._rms = 0.0;
            this._g = 1.0;
        }
    }]);

    return CompressorExpanderNode;
}(_index2.default);

/************************************************************************************/
/*!
 *  @class          MultiCompressorExpanderNode
 *  @brief          multichannel version of CompressorExpanderNode
 *                  each channel is an independent compressor/expander
 *
 */
/************************************************************************************/


exports.default = CompressorExpanderNode;

var MultiCompressorExpanderNode = exports.MultiCompressorExpanderNode = function (_AbstractNode2) {
    _inherits(MultiCompressorExpanderNode, _AbstractNode2);

    /************************************************************************************/
    /*!
     *  @brief          Class constructor
     *
     */
    /************************************************************************************/

    function MultiCompressorExpanderNode(audioContext, numChannels) {
        _classCallCheck(this, MultiCompressorExpanderNode);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(MultiCompressorExpanderNode).call(this, audioContext));

        _this2._compressorNodes = [];
        _this2._splitterNode = undefined;
        _this2._mergerNode = undefined;
        _this2._isBypass = false;

        /// sanity checks
        if (numChannels <= 0) {
            throw new Error("Pas bon");
        }

        _this2._splitterNode = audioContext.createChannelSplitter(numChannels);

        _this2._mergerNode = audioContext.createChannelMerger(numChannels);

        /// sanity checks
        if (_this2._splitterNode.numberOfInputs != 1 || _this2._splitterNode.numberOfOutputs != numChannels) {
            throw new Error("Pas bon");
        }

        /// sanity checks
        if (_this2._mergerNode.numberOfInputs != numChannels || _this2._mergerNode.numberOfOutputs != 1) {
            throw new Error("Pas bon");
        }

        /// create N compressorNodes
        for (var i = 0; i < numChannels; i++) {
            var newCompressorNode = new CompressorExpanderNode(audioContext);
            _this2._compressorNodes.push(newCompressorNode);
        }

        /// create the audio graph
        _this2._updateAudioGraph();
        return _this2;
    }

    /************************************************************************************/
    /*!
     *  @brief          Enable or bypass the processor
     *
     */
    /************************************************************************************/


    _createClass(MultiCompressorExpanderNode, [{
        key: 'getNumChannels',


        /************************************************************************************/
        /*!
         *  @brief          Returns the current number of channels
         *
         */
        /************************************************************************************/
        value: function getNumChannels() {
            return this._compressorNodes.length;
        }
    }, {
        key: 'setAttack',
        value: function setAttack(valueInMsec) {
            var MinAttack = 0.1; /// msec
            var MaxAttack = 3000; /// msec

            this._attack = _utils2.default.clamp(valueInMsec, MinAttack, MaxAttack);

            this._updateParameters();
        }

        //==============================================================================

    }, {
        key: 'setRelease',
        value: function setRelease(valueInMsec) {
            var numChannels = this.getNumChannels();

            for (var i = 0; i < numChannels; i++) {
                this._compressorNodes[i].setRelease(valueInMsec);
            }
        }
    }, {
        key: 'setCompressorThreshold',
        value: function setCompressorThreshold(valueIndB) {
            var numChannels = this.getNumChannels();

            for (var i = 0; i < numChannels; i++) {
                this._compressorNodes[i].setCompressorThreshold(valueIndB);
            }
        }
    }, {
        key: 'setExpanderThreshold',
        value: function setExpanderThreshold(valueIndB) {
            var numChannels = this.getNumChannels();

            for (var i = 0; i < numChannels; i++) {
                this._compressorNodes[i].setExpanderThreshold(valueIndB);
            }
        }
    }, {
        key: 'setCompressorRatio',
        value: function setCompressorRatio(value) {
            var numChannels = this.getNumChannels();

            for (var i = 0; i < numChannels; i++) {
                this._compressorNodes[i].setCompressorRatio(value);
            }
        }
    }, {
        key: 'setExpanderRatio',
        value: function setExpanderRatio(value) {
            var numChannels = this.getNumChannels();

            for (var i = 0; i < numChannels; i++) {
                this._compressorNodes[i].setExpanderRatio(value);
            }
        }
    }, {
        key: 'setMakeUpGain',
        value: function setMakeUpGain(valueIndB) {
            var numChannels = this.getNumChannels();

            for (var i = 0; i < numChannels; i++) {
                this._compressorNodes[i].setMakeUpGain(valueIndB);
            }
        }
    }, {
        key: 'setRMSAveragingTime',
        value: function setRMSAveragingTime(timeInMilliseconds) {
            var numChannels = this.getNumChannels();

            for (var i = 0; i < numChannels; i++) {
                this._compressorNodes[i].setRMSAveragingTime(timeInMilliseconds);
            }
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

            var numChannels = this.getNumChannels();

            /// first of all, disconnect everything
            this._input.disconnect();
            this._splitterNode.disconnect();
            this._mergerNode.disconnect();
            for (var i = 0; i < numChannels; i++) {
                this._compressorNodes[i].disconnect();
            }

            if (this.bypass === true || numChannels === 0) {
                this._input.connect(this._output);
            } else {
                /// split the input streams into N independent channels
                this._input.connect(this._splitterNode);

                /// connect a compressorNode to each channel
                for (var _i = 0; _i < numChannels; _i++) {
                    this._splitterNode.connect(this._compressorNodes[_i]._input, _i);
                }

                /// then merge the output of the N compressorNodes
                for (var _i2 = 0; _i2 < numChannels; _i2++) {
                    this._compressorNodes[_i2].connect(this._mergerNode, 0, _i2);
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

        /************************************************************************************/
        /*!
         *  @brief          Returns true if the processor is bypassed
         *
         */
        /************************************************************************************/
        ,
        get: function get() {
            return this._isBypass;
        }
    }]);

    return MultiCompressorExpanderNode;
}(_index2.default);