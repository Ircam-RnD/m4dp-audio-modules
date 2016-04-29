'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _lrms = require('./lrms.js');

var _lrms2 = _interopRequireDefault(_lrms);

var _phone = require('./phone.js');

var _phone2 = _interopRequireDefault(_phone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       centerenhancement.js
 *   @brief      Enhance the center channel : Start from LR signals, do MS conversion
 *               apply filtering in M, then do MS to LR conversion
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var CenterEnhancementNode = function (_AbstractNode) {
    _inherits(CenterEnhancementNode, _AbstractNode);

    //==============================================================================
    /**
     * @brief Enhance the center channel
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */

    function CenterEnhancementNode(audioContext) {
        _classCallCheck(this, CenterEnhancementNode);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CenterEnhancementNode).call(this, audioContext));

        _this._lr2ms = undefined;
        _this._phone = undefined;
        _this._ms2lr = undefined;

        /// The class has 2 input signals and 2 output signals
        /// It performs the following processing :
        /// Start from LR signals, do MS conversion
        /// apply filtering in M, then do MS to LR conversion

        _this._lr2ms = new _lrms2.default(audioContext);
        _this._ms2lr = new _lrms2.default(audioContext);
        _this._phone = new _phone2.default(audioContext);

        _this._channelSplitterNode = _this._audioContext.createChannelSplitter(2);
        _this._channelMergerNode = _this._audioContext.createChannelMerger(2);

        /// first convert from LR to MS
        _this._input.connect(_this._lr2ms._input);

        /// split M and S
        _this._lr2ms.connect(_this._channelSplitterNode);

        /// connect the M to the phone filter
        _this._channelSplitterNode.connect(_this._phone._input, 0, 0);

        /// connect the output of the phone filter to the 1st outlet
        _this._phone.connect(_this._channelMergerNode, 0, 0);

        /// the S signal is unaffected
        _this._channelSplitterNode.connect(_this._channelMergerNode, 1, 1);

        /// merge back the M and S
        _this._channelMergerNode.connect(_this._ms2lr._input);

        /// and perform MS to LR conversion
        _this._ms2lr.connect(_this._output);

        return _this;
    }

    //==============================================================================
    /**
     * Set the boost gain. It has a default value of 0 and can take a value in a nominal range of -40 to 40
     * @type {number} gainRequest : the gain in dB (0 for no gain)
     */


    _createClass(CenterEnhancementNode, [{
        key: 'gain',
        set: function set(gainRequest) {
            this._phone.gain = gainRequest;
        }

        /**
         * Get the boost gain.
         * @type {number} boost
         */
        ,
        get: function get() {
            return this._phone.gain;
        }
    }]);

    return CenterEnhancementNode;
}(_index2.default);

exports.default = CenterEnhancementNode;