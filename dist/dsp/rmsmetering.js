'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MultiRMSMetering = undefined;

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
 *   @file       rmsmetering.js
 *   @brief      RMS metering
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       06/2016
 *
 */
/************************************************************************************/

/************************************************************************************/
/*!
 *  @class          RMSMetering
 *  @brief          RMS metering using an averaging filter
 *                  (first order low pass filter with smoothing factor)
 *                  a.k.a Exponentially Weighted Moving Average a.k.a exponential smoothing
 *  @ingroup        dsp
 *
 */
/************************************************************************************/

var RmsMetering = function (_AbstractNode) {
    _inherits(RmsMetering, _AbstractNode);

    /************************************************************************************/
    /*!
     *  @brief          Class constructor
     *
     */
    /************************************************************************************/

    function RmsMetering(audioContext) {
        _classCallCheck(this, RmsMetering);

        // default values

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RmsMetering).call(this, audioContext));

        _this._samplerate = _utils2.default.clamp(audioContext.sampleRate, 22050, 192000);
        _this._value = 0.0;
        _this._tau = 20.0; /// msec
        _this._a = 0.0;
        _this._b = 0.0;
        _this._mem = 0.0;

        _this.SetTimeConstant(_this._tau);

        /// the script processor part
        {
            var bufferSize = 0;
            /*
             The buffer size in units of sample-frames. If specified, the bufferSize must be one of the following values:
             256, 512, 1024, 2048, 4096, 8192, 16384. If it's not passed in, or if the value is 0,
             then the implementation will choose the best buffer size for the given environment,
             which will be a constant power of 2 throughout the lifetime of the node.
             */
            var numberOfInputChannels = 1;
            var numberOfOutputChannels = 0;
            _this._scriptNode = audioContext.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);

            var metering = _this;

            _this._scriptNode.onaudioprocess = function (audioProcessingEvent) {
                var inputBuffer = audioProcessingEvent.inputBuffer;

                if (inputBuffer.numberOfChannels != 1) {
                    throw new Error("Pas bon");
                }

                var numSamples = inputBuffer.length;

                var tmp = 0.0;

                for (var i = 0; i < numSamples; i++) {
                    var input = inputData[i];

                    var x = metering._b * input * input;
                    tmp = x + metering._a * metering._mem;
                    metering._mem = tmp;
                }

                metering._value = tmp;
            };
        }

        _this._input.connect(_this._scriptNode);
        return _this;
    }

    /************************************************************************************/
    /*!
     *  @brief          Returns the current RMS value, in dB
     *
     */
    /************************************************************************************/


    _createClass(RmsMetering, [{
        key: 'GetValuedB',
        value: function GetValuedB() {
            return _utils2.default.lin2powdB(this._value + 1e-12);
        }
    }, {
        key: 'SetTimeConstant',
        value: function SetTimeConstant(valueInMilliseconds) {
            this._samplerate = _utils2.default.clamp(this._samplerate, 22050, 192000);

            var sr = this._samplerate;

            this._tau = _utils2.default.clamp(valueInMilliseconds, 5.0, 500.0);

            var tauInSeconds = this._tau / 1000;

            var dt = 1.0 / sr;

            var alpha = 1.0 - Math.exp(-dt / tauInSeconds);

            alpha = _utils2.default.clamp(alpha, 0.001, 0.999);

            this._a = 1. - alpha;
            this._b = 1. - this._a;
        }

        /************************************************************************************/
        /*!
         *  @brief          Clears the internal state of the object
         *
         */
        /************************************************************************************/

    }, {
        key: 'clearState',
        value: function clearState() {
            this._mem = 0.0;
            this._rms = 0.0;
        }
    }]);

    return RmsMetering;
}(_index2.default);

/************************************************************************************/
/*!
 *  @class          MultiRMSMetering
 *  @brief          multi-channel version of RMSMetering
 *  @ingroup        dsp
 *
 */
/************************************************************************************/


exports.default = RmsMetering;

var MultiRMSMetering = exports.MultiRMSMetering = function (_AbstractNode2) {
    _inherits(MultiRMSMetering, _AbstractNode2);

    /************************************************************************************/
    /*!
     *  @brief          Class constructor
     *
     */
    /************************************************************************************/

    function MultiRMSMetering(audioContext, numChannels) {
        _classCallCheck(this, MultiRMSMetering);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(MultiRMSMetering).call(this, audioContext));

        _this2._meterNodes = [];
        _this2._splitterNode = undefined;

        /// sanity checks
        if (numChannels <= 0) {
            throw new Error("Pas bon");
        }

        _this2._splitterNode = audioContext.createChannelSplitter(numChannels);

        /// sanity checks
        if (_this2._splitterNode.numberOfInputs != 1 || _this2._splitterNode.numberOfOutputs != numChannels) {
            throw new Error("Pas bon");
        }

        /// create N compressorNodes
        for (var i = 0; i < numChannels; i++) {
            var newCompressorNode = new RmsMetering(audioContext);
            _this2._meterNodes.push(newCompressorNode);
        }

        /// create the audio graph
        _this2._updateAudioGraph();
        return _this2;
    }

    /************************************************************************************/
    /*!
     *  @brief          Returns the current number of channels
     *
     */
    /************************************************************************************/


    _createClass(MultiRMSMetering, [{
        key: 'getNumChannels',
        value: function getNumChannels() {
            return this._meterNodes.length;
        }
    }, {
        key: 'SetTimeConstant',
        value: function SetTimeConstant(valueInMilliseconds) {
            var numChannels = this.getNumChannels();

            for (var i = 0; i < numChannels; i++) {
                this._meterNodes[i].SetTimeConstant(valueInMilliseconds);
            }
        }

        /************************************************************************************/
        /*!
         *  @brief          Returns the current RMS value, in dB
         *
         */
        /************************************************************************************/

    }, {
        key: 'GetValuedB',
        value: function GetValuedB(channelIndex) {
            /// boundary check
            if (channelIndex < 0 || channelIndex >= this.numChannels) {
                throw new Error("Invalid channel index");
            }

            return this._meterNodes[channelIndex].GetValuedB();
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
            for (var i = 0; i < numChannels; i++) {
                this._meterNodes[i].disconnect();
            }

            /// split the input streams into N independent channels
            this._input.connect(this._splitterNode);

            /// connect a compressorNode to each channel
            for (var _i = 0; _i < numChannels; _i++) {
                this._splitterNode.connect(this._meterNodes[_i]._input, _i);
            }
        }
    }]);

    return MultiRMSMetering;
}(_index2.default);