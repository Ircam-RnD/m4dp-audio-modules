'use strict';

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
 *   @file       sumdiff.js
 *   @brief      Helper class for Transaural (shuffler)
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var SumDiffNode = function (_AbstractNode) {
    _inherits(SumDiffNode, _AbstractNode);

    //==============================================================================
    /**
     * @brief Helper class for Transaural (shuffler)
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */

    function SumDiffNode(audioContext) {
        _classCallCheck(this, SumDiffNode);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SumDiffNode).call(this, audioContext));

        _this._channelSplitterNode = undefined;

        /// The class has 2 input signals and 2 output signals
        /// It performs the following processing :
        /// out[0] = in[0] + in[1]
        /// out[1] = in[0] - in[1]

        _this._channelSplitterNode = _this._audioContext.createChannelSplitter(2);
        _this._channelMergerNode = _this._audioContext.createChannelMerger(2);

        _this._input.connect(_this._channelSplitterNode);

        /// a gain node used for -1 multiplication
        _this._gainNode = _this._audioContext.createGain();
        _this._gainNode.gain.value = -1.0;

        _this._channelSplitterNode.connect(_this._gainNode, 1, 0);

        /// out[0] = in[0] + in[1]
        _this._channelSplitterNode.connect(_this._channelMergerNode, 0, 0);
        _this._channelSplitterNode.connect(_this._channelMergerNode, 1, 0);

        /// out[1] = in[0] - in[1]
        _this._channelSplitterNode.connect(_this._channelMergerNode, 0, 1);
        _this._gainNode.connect(_this._channelMergerNode, 0, 1);

        _this._channelMergerNode.connect(_this._output);
        return _this;
    }

    return SumDiffNode;
}(_index2.default);

exports.default = SumDiffNode;