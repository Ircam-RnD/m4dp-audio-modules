'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../multichannel-spatialiser/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ObjectSpatialiserAndMixer = function (_MultichannelSpatiali) {
  _inherits(ObjectSpatialiserAndMixer, _MultichannelSpatiali);

  /**
   * @param {AudioContext} audioContext - audioContext instance.
   * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
   * @param {string} outputType - output type "headphone" or "speaker"
   * @param {HRTF} hrtf - hrtf @todo to be defined
   * @param {EqPreset} eqPreset - dialog gain @todo to be defined
   * @param {number} offsetGain - gain @todo value to be defined
   * @param {number} listeningAxis - angle? @todo value to be defined
   */

  function ObjectSpatialiserAndMixer(audioContext) {
    var audioStreamDescriptionCollection = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
    var outputType = arguments.length <= 2 || arguments[2] === undefined ? 'headphone' : arguments[2];
    var hrtf = arguments[3];
    var eqPreset = arguments[4];
    var offsetGain = arguments[5];
    var listeningAxis = arguments[6];

    _classCallCheck(this, ObjectSpatialiserAndMixer);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ObjectSpatialiserAndMixer).call(this, audioContext, audioStreamDescriptionCollection, outputType, hrtf, eqPreset, offsetGain, listeningAxis));
  }
  /**
   * Set the position of the sound
   * @todo only for a unique mono stream
   * @param {number} azimuth - azimuth @todo values to be defined
   * @param {number} elevation - elevation @todo values to be defined
   * @param {number} distance - distance @todo values to be defined
   */

  _createClass(ObjectSpatialiserAndMixer, [{
    key: 'setPosition',
    value: function setPosition(azimuth, elevation, distance) {
      this._azimuth = azimuth;
      this._elevation = elevation;
      this._distance = distance;
    }
    /**
     * Get the position of the sound
     * @todo return an array? better I think for setPosition/getPosition homogeneity
     * @return {array}
     */

  }, {
    key: 'getPosition',
    value: function getPosition() {
      //return {'azimuth': this._azimuth, 'elevation': this._elevation, 'distance': this._distance};
      return [this._azimuth, this._elevation, this._distance];
    }
    /**
     * Process: "position" + "gain"
     * @todo: how to automatically set the gain, how to have RMS from "the other signal" here
     */

  }, {
    key: '_process',
    value: function _process() {}
  }]);

  return ObjectSpatialiserAndMixer;
}(_index2.default);

exports.default = ObjectSpatialiserAndMixer;