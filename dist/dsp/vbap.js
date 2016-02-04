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
 *   @file       vbap.js
 *   @brief      This class implements pairwise amplitude panning for stereo or 5.1 setups
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var VbapPannerNode = function (_AbstractNode) {
  _inherits(VbapPannerNode, _AbstractNode);

  //==============================================================================
  /**
   * @brief This class implements pairwise amplitude panning for stereo or 5.1 setups
   *
   * @param {AudioContext} audioContext - audioContext instance.
   * @param {string} mode - either 'stereo' or 'multichannel' (for 5.1)
   *
   * The class takes one input signal (one source) and produces 2 or 6 outputs
   * for either stereo or 5.1 reproduction
   *
   * For stereo, the channel arrangment is L/R
   * For 5.1, it is L R C LFE Ls Rs
   */

  function VbapPannerNode(audioContext) {
    var mode = arguments.length <= 1 || arguments[1] === undefined ? 'stereo' : arguments[1];

    _classCallCheck(this, VbapPannerNode);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VbapPannerNode).call(this, audioContext));

    _this._mode = mode;
    _this._gainNodes = [];

    var numInputs = 1;
    var numOutputs = mode === 'stereo' ? 2 : 6;

    return _this;
  }

  return VbapPannerNode;
}(_index2.default);

exports.default = VbapPannerNode;