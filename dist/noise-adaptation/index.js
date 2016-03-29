'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NoiseAdaptation = function (_AbstractNode) {
  _inherits(NoiseAdaptation, _AbstractNode);

  /**
   * @param {AudioContext} audioContext - audioContext instance.
   * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
   * @param {boolean} headphone - true is headphone, else, false.
   */

  function NoiseAdaptation(audioContext, audioStreamDescriptionCollection) {
    var headphone = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    _classCallCheck(this, NoiseAdaptation);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NoiseAdaptation).call(this, audioContext, audioStreamDescriptionCollection));

    _this._headphone = headphone;
    return _this;
  }
  /**
   * Process:
   * @todo: track noise, add compression, improve voice if no headphone
   */

  _createClass(NoiseAdaptation, [{
    key: '_process',
    value: function _process() {}
    /**
     * Set headphone - true is headphone, else, false.
     * @type {boolean}
     */

  }, {
    key: 'headphone',
    set: function set(value) {
      this._headphone = value;
    }
    /**
     * Get headphone, return True if headphone is connected, else, false
     * @type {boolean}
     */
    ,
    get: function get() {
      return this._headphone;
    }
  }]);

  return NoiseAdaptation;
}(_index2.default);

exports.default = NoiseAdaptation;