'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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
 *   @file       compressorsidechain.js
 *   @brief      This class implements a mono compressor/expander, ported from C++ to javascript
 *   @author     Thibaut Carpentier
 *   @date       06/2016
 *
 */
/************************************************************************************/

/************************************************************************************/
/*!
 *  @class          CompressorWithSideChain
 *  @brief          Compressor/Expander with side chain
 *  @details        The processor has N channels.
 *                  One of these N channels is being used as the side chain (and thus is not affected by compression)
 *
 */
/************************************************************************************/

var CompressorWithSideChain = function (_AbstractNode) {
    _inherits(CompressorWithSideChain, _AbstractNode);

    /************************************************************************************/
    /*!
     *  @brief          Class constructor
     *
     */
    /************************************************************************************/

    function CompressorWithSideChain(audioContext, numChannels) {
        _classCallCheck(this, CompressorWithSideChain);

        /// sanity checks
        if (numChannels <= 0) {
            throw new Error("Pas bon");
        }

        // default values

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CompressorWithSideChain).call(this, audioContext));

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

        _this._numChannels = numChannels;
        _this._sideChainIndex = 0; ///< index of the channel that is used for side chain
        _this._buffer = new Array(1024); /// buffer holding the gain values

        if (_this._sideChainIndex < 0 || _this._sideChainIndex >= _this._numChannels) {
            throw new Error("Pas bon");
        }

        _this._updateParameters();

        {
            var bufferSize = 0;
            /*
             The buffer size in units of sample-frames. If specified, the bufferSize must be one of the following values:
             256, 512, 1024, 2048, 4096, 8192, 16384. If it's not passed in, or if the value is 0,
             then the implementation will choose the best buffer size for the given environment,
             which will be a constant power of 2 throughout the lifetime of the node.
             */
            var numberOfInputChannels = numChannels;
            var numberOfOutputChannels = numChannels;
            _this._scriptNode = audioContext.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);

            var compressor = _this;

            _this._scriptNode.onaudioprocess = function (audioProcessingEvent) {
                var inputBuffer = audioProcessingEvent.inputBuffer;
                var outputBuffer = audioProcessingEvent.outputBuffer;

                var numChannels = outputBuffer.numberOfChannels;

                if (inputBuffer.numberOfChannels != numChannels) {
                    throw new Error("Pas bon");
                }
                if (numChannels != compressor._numChannels) {
                    throw new Error("Pas bon");
                }

                var numSamples = inputBuffer.length;

                if (compressor._buffer.length < numSamples) {
                    /// make sure the array is large enough
                    compressor._buffer.length = numSamples;
                }

                var one_minus_tav = 1. - compressor._tav;

                var sideChainIndex = compressor._sideChainIndex;

                if (sideChainIndex < 0 || sideChainIndex >= numChannels) {
                    throw new Error("Pas bon");
                }

                /// first : analyze the side chain signal
                {
                    var inputData = inputBuffer.getChannelData(sideChainIndex);

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

                        /// store the resulting (compressed) gain
                        compressor._buffer[i] = compressor._g * compressor._makeup;
                    }
                }

                /// then apply the compression gain to the signals
                for (var k = 0; k < numChannels; k++) {
                    var inputData = inputBuffer.getChannelData(k);
                    var outputData = outputBuffer.getChannelData(k);

                    if (k != sideChainIndex) {
                        /// do not compress the side chain channel

                        for (var _i = 0; _i < numSamples; _i++) {
                            outputData[_i] = inputData[_i] * compressor._buffer[_i];
                        }
                    } else {
                        /// the side-chain channel is pass-through, unchanged
                        for (var _i2 = 0; _i2 < numSamples; _i2++) {
                            outputData[_i2] = inputData[_i2];
                        }
                    }
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

    /************************************************************************************/
    /*!
     *  @brief          Determine which of the input channels should be considered the side-chain
     *
     */
    /************************************************************************************/


    _createClass(CompressorWithSideChain, [{
        key: 'setSideChainChannel',
        value: function setSideChainChannel(channelIndex) {
            if (channelIndex < 0 || channelIndex >= this._numChannels) {
                throw new Error("Pas bon");
            }

            this._sideChainIndex = channelIndex;
        }

        /************************************************************************************/
        /*!
         *  @brief          Returns the index of the current side-chain channel
         *
         */
        /************************************************************************************/

    }, {
        key: 'getSideChainChannel',
        value: function getSideChainChannel() {
            return this._sideChainIndex;
        }

        /************************************************************************************/
        /*!
         *  @brief          Set attack time
         *
         */
        /************************************************************************************/

    }, {
        key: 'setAttack',
        value: function setAttack(valueInMsec) {
            var MinAttack = 0.1; /// msec
            var MaxAttack = 3000; /// msec

            this._attack = _utils2.default.clamp(valueInMsec, MinAttack, MaxAttack);

            this._updateParameters();
        }

        /************************************************************************************/
        /*!
         *  @brief          Set release time
         *
         */
        /************************************************************************************/

    }, {
        key: 'setRelease',
        value: function setRelease(valueInMsec) {
            var MinRelease = 0.1; /// msec
            var MaxRelease = 5000; /// msec

            this._release = _utils2.default.clamp(valueInMsec, MinRelease, MaxRelease);

            this._updateParameters();
        }

        /************************************************************************************/
        /*!
         *  @brief          Set the compressor threshold
         *
         */
        /************************************************************************************/

    }, {
        key: 'setCompressorThreshold',
        value: function setCompressorThreshold(valueIndB) {
            var MinCompressorThreshold = -120; /// dB
            var MaxCompressorThreshold = 20; /// dB

            this._compressorThreshold = _utils2.default.clamp(valueIndB, MinCompressorThreshold, MaxCompressorThreshold);

            this._updateParameters();
        }

        /************************************************************************************/
        /*!
         *  @brief          Set the expander threshold
         *
         */
        /************************************************************************************/

    }, {
        key: 'setExpanderThreshold',
        value: function setExpanderThreshold(valueIndB) {
            var MinExpanderThreshold = -120; /// dB
            var MaxExpanderThreshold = 20; /// dB

            this._expanderThreshold = _utils2.default.clamp(valueIndB, MinExpanderThreshold, MaxExpanderThreshold);

            this._updateParameters();
        }

        /************************************************************************************/
        /*!
         *  @brief          Set the compressor ratio
         *
         */
        /************************************************************************************/

    }, {
        key: 'setCompressorRatio',
        value: function setCompressorRatio(value) {
            var MinCompressorRatio = 1;
            var MaxCompressorRatio = 30;

            this._compressorRatio = _utils2.default.clamp(value, MinCompressorRatio, MaxCompressorRatio);

            this._updateParameters();
        }

        /************************************************************************************/
        /*!
         *  @brief          Set the expander ratio
         *
         */
        /************************************************************************************/

    }, {
        key: 'setExpanderRatio',
        value: function setExpanderRatio(value) {
            var MinExpanderRatio = 0.1;
            var MaxExpanderRatio = 1;

            this._expanderRatio = _utils2.default.clamp(value, MinExpanderRatio, MaxExpanderRatio);

            this._updateParameters();
        }

        /************************************************************************************/
        /*!
         *  @brief          Set the make up gain
         *
         */
        /************************************************************************************/

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

        /************************************************************************************/
        /*!
         *  @brief          Update local values
         *
         */
        /************************************************************************************/

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

    return CompressorWithSideChain;
}(_index2.default);

exports.default = CompressorWithSideChain;