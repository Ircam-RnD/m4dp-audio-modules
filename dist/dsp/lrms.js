'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _sumdiff = require('./sumdiff.js');

var _sumdiff2 = _interopRequireDefault(_sumdiff);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       lrms.js
 *   @brief      LR to MS or MS to LR
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

var LRMSNode = function (_AbstractNode) {
    _inherits(LRMSNode, _AbstractNode);

    //==============================================================================
    /**
     * @brief LR to MS or MS to LR
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */

    function LRMSNode(audioContext) {
        _classCallCheck(this, LRMSNode);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LRMSNode).call(this, audioContext));

        _this._gainNode = undefined;
        _this._sumdiff = undefined;

        /// The class has 2 input signals and 2 output signals
        /// It performs the following processing :
        /// out[0] = ( in[0] + in[1] ) / 2
        /// out[1] = ( in[0] - in[1] ) / 2

        /// M = ( L + R ) / 2
        /// S = ( L - R ) / 2
        ///
        /// L = ( M + S ) / 2
        /// R = ( M - S ) / 2

        _this._gainNode = _this._audioContext.createGain();
        //this._gainNode.gain.value = 0.5;
        _this._gainNode.gain.value = 0.707;

        _this._sumdiff = new _sumdiff2.default(audioContext);

        _this._input.connect(_this._sumdiff._input);

        _this._sumdiff.connect(_this._gainNode);

        _this._gainNode.connect(_this._output);
        return _this;
    }

    return LRMSNode;
}(_index2.default);

exports.default = LRMSNode;