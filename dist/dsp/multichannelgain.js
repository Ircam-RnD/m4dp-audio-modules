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
 *   @file       multichannelgain.js
 *   @brief      This class implements a multichannel GainNode
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var MultichannelGainNode = function (_AbstractNode) {
    _inherits(MultichannelGainNode, _AbstractNode);

    //==============================================================================
    /**
     * @brief This class implements a multichannel GainNode
     *        Each channel can have independent gain level
     *
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {int} numChannels - number of channels to instanciate
     *
     *
     */

    function MultichannelGainNode(audioContext) {
        var numChannels = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];

        _classCallCheck(this, MultichannelGainNode);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MultichannelGainNode).call(this, audioContext));

        _this._gainNodes = [];
        _this._splitterNode = undefined;
        _this._mergerNode = undefined;
        _this._isBypass = false;

        /// sanity checks
        if (numChannels <= 0) {
            throw new Error("Pas bon");
        }

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

        /// create N gainNodes
        for (var i = 0; i < numChannels; i++) {
            var newGainNode = audioContext.createGain();
            _this._gainNodes.push(newGainNode);
        }

        /// create the audio graph
        _this._updateAudioGraph();
        return _this;
    }

    //==============================================================================
    /**
     * Enable or bypass the processor
     * @type {boolean}
     */


    _createClass(MultichannelGainNode, [{
        key: 'getNumChannels',


        //==============================================================================
        /**
            * Returns the current number of channels
            */
        value: function getNumChannels() {
            return this._gainNodes.length;
        }

        //==============================================================================
        /**
         * Sets the gain of the i-th channel
         * @param {int} channelIndex
         * @param {float} value: linear gain
         */

    }, {
        key: 'setGain',
        value: function setGain(channelIndex, value) {

            /// boundary check
            if (channelIndex < 0 || channelIndex >= this.getNumChannels()) {
                throw new Error("Invalid channelIndex");
            }

            this._gainNodes[channelIndex].gain.value = value;
        }

        /**
         * Returns the gain of the i-th channel
         * @param {int} channelIndex
         */

    }, {
        key: 'getGain',
        value: function getGain(channelIndex) {

            /// boundary check
            if (channelIndex < 0 || channelIndex >= this.getNumChannels()) {
                throw new Error("Invalid channelIndex");
            }

            return this._gainNodes[channelIndex].gain.value;
        }

        //==============================================================================
        /**
         * Updates the connections of the audio graph
         */

    }, {
        key: '_updateAudioGraph',
        value: function _updateAudioGraph() {

            var numChannels = this.getNumChannels();

            /// first of all, disconnect everything
            this._input.disconnect();
            this._splitterNode.disconnect();
            this._mergerNode.disconnect();
            for (var i = 0; i < numChannels; i++) {
                this._gainNodes[i].disconnect();
            }

            if (this.bypass === true || numChannels === 0) {

                this._input.connect(this._output);
            } else {

                /// split the input streams into N independent channels
                this._input.connect(this._splitterNode);

                /// connect a gainNode to each channel
                for (var _i = 0; _i < numChannels; _i++) {
                    this._splitterNode.connect(this._gainNodes[_i], _i);
                }

                /// then merge the output of the N gainNodes
                for (var _i2 = 0; _i2 < numChannels; _i2++) {
                    this._gainNodes[_i2].connect(this._mergerNode, 0, _i2);
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
    }]);

    return MultichannelGainNode;
}(_index2.default);

exports.default = MultichannelGainNode;