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

var MultichannelSpatialiser = function (_AbstractNode) {
  _inherits(MultichannelSpatialiser, _AbstractNode);

  /**
   * @param {AudioContext} audioContext - audioContext instance.
   * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
   * @param {string} outputType - output type "headphone" or "speaker"
   * @param {HRTF} hrtf - hrtf @todo to be defined
   * @param {EqPreset} eqPreset - dialog gain @todo to be defined
   * @param {number} offsetGain - gain @todo value to be defined
   * @param {number} listeningAxis - angle? @todo value to be defined
   */

  function MultichannelSpatialiser(audioContext) {
    var audioStreamDescriptionCollection = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
    var outputType = arguments.length <= 2 || arguments[2] === undefined ? 'headphone' : arguments[2];
    var hrtf = arguments[3];
    var eqPreset = arguments[4];
    var offsetGain = arguments[5];
    var listeningAxis = arguments[6];

    _classCallCheck(this, MultichannelSpatialiser);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MultichannelSpatialiser).call(this, audioContext, audioStreamDescriptionCollection));

    _this._outputType = outputType;
    _this._hrtf = hrtf;
    _this._eqPreset = eqPreset;
    _this._offsetGain = offsetGain;
    _this._listeningAxis = listeningAxis;
    return _this;
  }
  /**
   * Set outputType: 'headphone' or 'speaker', 'multicanal'
   * @todo: automatic for 'multicanal' even if nb of speaker 'wrong'
   * @type {string}
   */

  _createClass(MultichannelSpatialiser, [{
    key: 'outputType',
    set: function set(value) {
      this._outputType = value;
    }
    /**
     * Get outputType: 'headphone' or 'speaker'
     * @type {string}
     */
    ,
    get: function get() {
      return this._outputType;
    }
    /**
     * Set audio streams description (json)
     * @type {AudioStreamDescriptionCollection}
     */

  }, {
    key: 'audioStreamDescriptionCollection',
    set: function set(value) {}
    /**
     * Get audio streams description
     * @type {AudioStreamDescriptionCollection}
     */
    ,
    get: function get() {
      return _audioStreamDescriptionCollection;
    }
    /**
     * Set hrtf
     * @type {HRTF}
     * @todo: which kind of value, json?
     */

  }, {
    key: 'hrtf',
    set: function set(value) {
      this._hrtf = value;
    }
    /**
     * Get hrtf
     * @type {HRTF}
     */
    ,
    get: function get() {
      return this._hrtf;
    }
    /**
     * Set eqPreset
     * @todo: which kind of value, json?
     * @todo: set it to none to not appy any eq?
     * @type {EqPreset}
     */

  }, {
    key: 'eqPreset',
    set: function set(value) {
      this._eqPreset = value;
    }
    /**
     * Get eqPreset
     * @type {EqPreset}
     */
    ,
    get: function get() {
      return this._eqPreset;
    }
    /**
     * Set offsetGain
     * @todo range
     * @type {number}
     */

  }, {
    key: 'offsetGain',
    set: function set(value) {
      this._offsetGain = value;
    }
    /**
     * Get offsetGain
     * @todo range
     * @type {number}
     */
    ,
    get: function get() {
      return this._offsetGain;
    }
    /**
     * Set listeningAxis
     * @todo value type? angle?
     * @type {number}
     */

  }, {
    key: 'listeningAxis',
    set: function set(value) {
      this._listeningAxis = value;
    }
    /**
     * Get listeningAxis
     * @type {number}
     */
    ,
    get: function get() {
      return this._listeningAxis;
    }
  }]);

  return MultichannelSpatialiser;
}(_index2.default);

exports.default = MultichannelSpatialiser;