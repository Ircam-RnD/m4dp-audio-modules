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
 *   @file       compressor.js
 *   @brief      This class implements a multichannel Compressor
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var MultichannelCompressorNode = function (_AbstractNode) {
    _inherits(MultichannelCompressorNode, _AbstractNode);

    //==============================================================================
    /**
     * @brief This class implements a multichannel Compressor
     *        The compressor affects all channel similarly
     *
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {int} numChannels - number of channels to instanciate
     *
     * @details It turns out the standard DynamicsCompressorNode from the WAA 
     *          does some weird stuff when the number of channels is 10 ( > 5.1 ?? )
     *
     *  So we created this class which just instanciate 10 mono compressor nodes in parallel
     *
     *  NB : the issues with DynamicsCompressorNode might come from the fact that 
     *  its default Channel count mode is "explicit"
     *  It could be possible (but not tested), to solve the issue
     *  by specifying : 
     *  DynamicsCompressorNode.channelCountMode = "max"
     *  DynamicsCompressorNode.channelCount = 10;
     *
     */

    function MultichannelCompressorNode(audioContext) {
        var numChannels = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];

        _classCallCheck(this, MultichannelCompressorNode);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MultichannelCompressorNode).call(this, audioContext));

        _this._compressorNodes = [];
        _this._splitterNode = undefined;
        _this._mergerNode = undefined;
        _this._isBypass = false;
        _this._drywet = 100;

        /// sanity checks
        if (numChannels <= 0) {
            throw new Error("Pas bon");
        }

        _this._gainDry = audioContext.createGain();
        _this._gainWet = audioContext.createGain();

        _this._splitterNode = audioContext.createChannelSplitter(numChannels);

        _this._mergerNode = audioContext.createChannelMerger(numChannels);

        /// sanity checks
        if (_this._splitterNode.numberOfInputs != 1 || _this._splitterNode.numberOfOutputs != numChannels) {
            throw new Error("Pas bon");
        }

        /// sanity checks
        if (_this._mergerNode.numberOfInputs != numChannels || _this._mergerNode.numberOfOutputs != 1) {
            throw new Error("Pas bon");
        }

        /// create N compressorNodes
        for (var i = 0; i < numChannels; i++) {
            var newCompressorNode = audioContext.createDynamicsCompressor();
            _this._compressorNodes.push(newCompressorNode);
        }

        _this._updateAudioGraph();

        /// default it totally wet
        _this.drywet = _this._drywet;
        return _this;
    }

    //==============================================================================


    _createClass(MultichannelCompressorNode, [{
        key: 'getNumChannels',


        //==============================================================================
        value: function getNumChannels() {
            return this._compressorNodes.length;
        }

        //==============================================================================

    }, {
        key: 'getCompressorOfFirstChannel',
        value: function getCompressorOfFirstChannel() {
            if (this.getNumChannels() <= 0) {
                throw new Error("smothing is wrong");
            }

            return this._compressorNodes[0];
        }

        //==============================================================================

    }, {
        key: 'getReductionForChannel',
        value: function getReductionForChannel(channelIndex) {
            /// representing the amount of gain reduction currently applied by the compressor to the signal.

            var numChannels = this.getNumChannels();

            if (channelIndex < 0 || channelIndex >= numChannels) {
                throw new Error("Invalid channel index : " + channelIndex);
            }

            return this._compressorNodes[channelIndex].reduction.value;
        }

        //==============================================================================

    }, {
        key: 'getReduction',
        value: function getReduction() {
            /// returns the minimum reduction among all channels
            var reduction = 0.0;

            var numChannels = this.getNumChannels();

            for (var i = 0; i < numChannels; i++) {
                var reductionForThisChannel = this.getReductionForChannel(i);

                reduction = Math.min(reduction, reductionForThisChannel);
            }

            return reduction;
        }

        //==============================================================================
        /**
         * Returns the dynamic compression state (i.e. true if actually compressing)
         * @type {boolean}
         */

    }, {
        key: 'setThreshold',


        //==============================================================================
        value: function setThreshold(value) {
            /// the parameter is applied similarly to all channels
            var numChannels = this.getNumChannels();

            for (var i = 0; i < numChannels; i++) {
                this._compressorNodes[i].threshold.value = value;
            }
        }
    }, {
        key: 'getThreshold',
        value: function getThreshold() {
            /// the parameter is the same for all channels

            return this.getCompressorOfFirstChannel().threshold.value;
        }

        //==============================================================================

    }, {
        key: 'setRatio',


        //==============================================================================
        value: function setRatio(value) {
            /// the parameter is applied similarly to all channels

            var numChannels = this.getNumChannels();

            for (var i = 0; i < numChannels; i++) {
                this._compressorNodes[i].ratio.value = value;
            }
        }
    }, {
        key: 'getRatio',
        value: function getRatio() {
            /// the parameter is the same for all channels

            return this.getCompressorOfFirstChannel().ratio.value;
        }

        //==============================================================================

    }, {
        key: 'setAttack',


        //==============================================================================
        value: function setAttack(value) {
            /// the parameter is applied similarly to all channels

            var numChannels = this.getNumChannels();

            for (var i = 0; i < numChannels; i++) {
                this._compressorNodes[i].attack.value = value;
            }
        }
    }, {
        key: 'getAttack',
        value: function getAttack() {
            /// the parameter is the same for all channels

            return this.getCompressorOfFirstChannel().attack.value;
        }

        //==============================================================================

    }, {
        key: 'setRelease',


        //==============================================================================
        value: function setRelease(value) {
            /// the parameter is applied similarly to all channels

            var numChannels = this.getNumChannels();

            for (var i = 0; i < numChannels; i++) {
                this._compressorNodes[i].release.value = value;
            }
        }
    }, {
        key: 'getRelease',
        value: function getRelease() {
            /// the parameter is the same for all channels

            return this.getCompressorOfFirstChannel().release.value;
        }

        //==============================================================================

    }, {
        key: '_updateAudioGraph',


        //==============================================================================
        /**
         * Updates the connections of the audio graph
         */
        value: function _updateAudioGraph() {

            var numChannels = this.getNumChannels();

            /// first of all, disconnect everything
            this._input.disconnect();
            this._splitterNode.disconnect();
            this._mergerNode.disconnect();
            for (var i = 0; i < numChannels; i++) {
                this._compressorNodes[i].disconnect();
            }

            this._gainWet.disconnect();
            this._gainDry.disconnect();

            if (this.bypass === true || numChannels === 0) {
                this._input.connect(this._output);
            } else {

                /// split the input streams into N independent channels           
                this._input.connect(this._splitterNode);
                this._input.connect(this._gainDry);

                /// connect a compressorNodes to each channel
                for (var _i = 0; _i < numChannels; _i++) {
                    this._splitterNode.connect(this._compressorNodes[_i], _i);
                }

                /// then merge the output of the N compressorNodes
                for (var _i2 = 0; _i2 < numChannels; _i2++) {
                    this._compressorNodes[_i2].connect(this._mergerNode, 0, _i2);
                }

                this._mergerNode.connect(this._gainWet);

                this._gainWet.connect(this._output);
                this._gainDry.connect(this._output);
            }

            /// update the drywet
            this.drywet = this._drywet;
        }
    }, {
        key: 'drywet',
        set: function set(value) {
            /// 100% --> totally wet
            /// 0% --> totally dry

            var percent = _utils2.default.clamp(value, 0, 100);

            this._drywet = percent;

            var wet = percent;
            var dry = 100 - percent;

            this._gainDry.gain.value = dry / 100.;
            this._gainWet.gain.value = wet / 100.;
        },
        get: function get() {
            return this._drywet;
        }

        //==============================================================================
        /**
         * Enable or bypass the processor
         * @type {boolean}
         */

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
        key: 'dynamicCompressionState',
        get: function get() {
            var reduction = this.getReduction();

            var state = reduction < -0.5 ? true : false;

            return state;
        }
    }], [{
        key: 'minThreshold',
        get: function get() {
            /// minimum value of the WAA
            return -100;
        }
    }, {
        key: 'maxThreshold',
        get: function get() {
            /// maximum value of the WAA
            return 0;
        }
    }, {
        key: 'defaultThreshold',
        get: function get() {
            /// default value of the WAA
            return -24;
        }
    }, {
        key: 'minRatio',
        get: function get() {
            /// minimum value of the WAA
            return 1;
        }
    }, {
        key: 'maxRatio',
        get: function get() {
            /// maximum value of the WAA
            return 20;
        }
    }, {
        key: 'defaultRatio',
        get: function get() {
            /// default value of the WAA
            return 12;
        }
    }, {
        key: 'minAttack',
        get: function get() {
            /// minimum value of the WAA (in seconds)
            return 0;
        }
    }, {
        key: 'maxAttack',
        get: function get() {
            /// maximum value of the WAA (in seconds)
            return 1;
        }
    }, {
        key: 'defaultAttack',
        get: function get() {
            /// default value of the WAA (in seconds)
            return 0.003;
        }
    }, {
        key: 'minRelease',
        get: function get() {
            /// minimum value of the WAA (in seconds)
            return 0;
        }
    }, {
        key: 'maxRelease',
        get: function get() {
            /// maximum value of the WAA (in seconds)
            return 1;
        }
    }, {
        key: 'defaultRelease',
        get: function get() {
            /// default value of the WAA (in seconds)
            return 0.25;
        }
    }]);

    return MultichannelCompressorNode;
}(_index2.default);

exports.default = MultichannelCompressorNode;