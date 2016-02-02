"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require("../core/index.js");

var _index2 = _interopRequireDefault(_index);

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
     * @details It turns out the standard CompressorNode from the WAA 
     *          does some weird stuff when the number of channels is 10 ( > 5.1 ?? )
     *
     *  So we created this class which just instanciate 10 mono compressor nodes in parallel
     */

    function MultichannelCompressorNode(audioContext) {
        var numChannels = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];

        _classCallCheck(this, MultichannelCompressorNode);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MultichannelCompressorNode).call(this, audioContext));

        _this._compressorNodes = [];
        _this._splitterNode = undefined;
        _this._mergerNode = undefined;

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

        /// create 10 compressorNodes
        for (var i = 0; i < numChannels; i++) {
            var newCompressorNode = audioContext.createDynamicsCompressor();
            _this._compressorNodes.push(newCompressorNode);
        }

        /// split the input streams into 10 independent channels
        _this.input.connect(_this._splitterNode);

        /// connect a compressorNodes to each channel
        for (var i = 0; i < numChannels; i++) {
            _this._splitterNode.connect(_this._compressorNodes[i], i);
        }

        /// then merge the output of the 10 compressorNodes
        for (var i = 0; i < numChannels; i++) {
            _this._compressorNodes[i].connect(_this._mergerNode, 0, i);
        }

        _this._mergerNode.connect(_this._output);
        return _this;
    }

    _createClass(MultichannelCompressorNode, [{
        key: "getNumChannels",
        value: function getNumChannels() {
            return this._compressorNodes.length;
        }
    }, {
        key: "getReductionForChannel",
        value: function getReductionForChannel(channelIndex) {

            /// representing the amount of gain reduction currently applied by the compressor to the signal.

            var numChannels = this.getNumChannels();

            if (channelIndex < 0 || channelIndex >= numChannels) {
                throw new Error("Invalid channel index : " + channelIndex);
            }

            return this._compressorNodes[channelIndex].reduction.value;
        }
    }, {
        key: "getReduction",
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
    }, {
        key: "setThreshold",
        value: function setThreshold(value) {
            /// the parameter is applied similarly to all channels

            var numChannels = this.getNumChannels();

            for (var i = 0; i < numChannels; i++) {
                this._compressorNodes[i].threshold.value = value;
            }
        }
    }, {
        key: "setRatio",
        value: function setRatio(value) {
            /// the parameter is applied similarly to all channels

            var numChannels = this.getNumChannels();

            for (var i = 0; i < numChannels; i++) {
                this._compressorNodes[i].ratio.value = value;
            }
        }
    }, {
        key: "setAttack",
        value: function setAttack(value) {
            /// the parameter is applied similarly to all channels

            var numChannels = this.getNumChannels();

            for (var i = 0; i < numChannels; i++) {
                this._compressorNodes[i].attack.value = value;
            }
        }
    }, {
        key: "setRelease",
        value: function setRelease(value) {
            /// the parameter is applied similarly to all channels

            var numChannels = this.getNumChannels();

            for (var i = 0; i < numChannels; i++) {
                this._compressorNodes[i].release.value = value;
            }
        }
    }]);

    return MultichannelCompressorNode;
}(_index2.default);

exports.default = MultichannelCompressorNode;