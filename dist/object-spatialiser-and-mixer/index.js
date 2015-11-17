'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _multichannelSpatialiserIndexJs = require('../multichannel-spatialiser/index.js');

var _multichannelSpatialiserIndexJs2 = _interopRequireDefault(_multichannelSpatialiserIndexJs);

var ObjectSpatialiserAndMixer = (function (_MultichannelSpatialiser) {
  /**
   * @param {AudioContext} audioContext - audioContext instance.
   * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
   * @param {string} outputType - output type "headphone" or "speaker"
   * @param {HRTF} hrtf - hrtf @todo to be defined
   * @param {EqPreset} eqPreset - dialog gain @todo to be defined
   * @param {number} offsetGain - gain @todo value to be defined
   * @param {number} listeningAxis - angle? @todo value to be defined
   */

  function ObjectSpatialiserAndMixer(audioContext, _x, _x2, hrtf, eqPreset, offsetGain, listeningAxis) {
    var audioStreamDescriptionCollection = arguments[1] === undefined ? undefined : arguments[1];
    var outputType = arguments[2] === undefined ? 'headphone' : arguments[2];

    _classCallCheck(this, ObjectSpatialiserAndMixer);

    _get(Object.getPrototypeOf(ObjectSpatialiserAndMixer.prototype), 'constructor', this).call(this, audioContext, audioStreamDescriptionCollection, outputType, hrtf, eqPreset, offsetGain, listeningAxis);
  }

  _inherits(ObjectSpatialiserAndMixer, _MultichannelSpatialiser);

  _createClass(ObjectSpatialiserAndMixer, [{
    key: 'setPosition',

    /**
     * Set the position of the sound
     * @todo only for a unique mono stream
     * @param {number} azimuth - azimuth @todo values to be defined
     * @param {number} elevation - elevation @todo values to be defined
     * @param {number} distance - distance @todo values to be defined
     */
    value: function setPosition(azimuth, elevation, distance) {
      this._azimuth = azimuth;
      this._elevation = elevation;
      this._distance = distance;
    }
  }, {
    key: 'getPosition',

    /**
     * Get the position of the sound
     * @todo return an array? better I think for setPosition/getPosition homogeneity
     * @return {array}
     */
    value: function getPosition() {
      //return {'azimuth': this._azimuth, 'elevation': this._elevation, 'distance': this._distance};
      return [this._azimuth, this._elevation, this._distance];
    }
  }, {
    key: '_process',

    /**
     * Process: "position" + "gain"
     * @todo: how to automatically set the gain, how to have RMS from "the other signal" here
     */
    value: function _process() {}
  }]);

  return ObjectSpatialiserAndMixer;
})(_multichannelSpatialiserIndexJs2['default']);

exports['default'] = ObjectSpatialiserAndMixer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9zbWFydC1mYWRlci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OENBQW9DLHNDQUFzQzs7OztJQUdyRCx5QkFBeUI7Ozs7Ozs7Ozs7O0FBVS9CLFdBVk0seUJBQXlCLENBVTlCLFlBQVksV0FBMEUsSUFBSSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFDO1FBQWxILGdDQUFnQyxnQ0FBRyxTQUFTO1FBQUUsVUFBVSxnQ0FBRyxXQUFXOzswQkFWL0UseUJBQXlCOztBQVd0QywrQkFYYSx5QkFBeUIsNkNBV2hDLFlBQVksRUFBRSxnQ0FBZ0MsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFO0dBQ2hIOztZQVpnQix5QkFBeUI7O2VBQXpCLHlCQUF5Qjs7Ozs7Ozs7OztXQW9CL0IscUJBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUM7QUFDckMsVUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7QUFDeEIsVUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7QUFDNUIsVUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7S0FDN0I7Ozs7Ozs7OztXQU1VLHVCQUFFOztBQUVULGFBQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzNEOzs7Ozs7OztXQUtRLG9CQUFFLEVBQ1Q7OztTQXZDZSx5QkFBeUI7OztxQkFBekIseUJBQXlCIiwiZmlsZSI6ImxpYi9zbWFydC1mYWRlci9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNdWx0aWNoYW5uZWxTcGF0aWFsaXNlciBmcm9tICcuLi9tdWx0aWNoYW5uZWwtc3BhdGlhbGlzZXIvaW5kZXguanMnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9iamVjdFNwYXRpYWxpc2VyQW5kTWl4ZXIgZXh0ZW5kcyBNdWx0aWNoYW5uZWxTcGF0aWFsaXNlciB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IGF1ZGlvQ29udGV4dCAtIGF1ZGlvQ29udGV4dCBpbnN0YW5jZS5cbiAgICAgKiBAcGFyYW0ge0F1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9ufSBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbiAtIGF1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9uLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBvdXRwdXRUeXBlIC0gb3V0cHV0IHR5cGUgXCJoZWFkcGhvbmVcIiBvciBcInNwZWFrZXJcIlxuICAgICAqIEBwYXJhbSB7SFJURn0gaHJ0ZiAtIGhydGYgQHRvZG8gdG8gYmUgZGVmaW5lZFxuICAgICAqIEBwYXJhbSB7RXFQcmVzZXR9IGVxUHJlc2V0IC0gZGlhbG9nIGdhaW4gQHRvZG8gdG8gYmUgZGVmaW5lZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBvZmZzZXRHYWluIC0gZ2FpbiBAdG9kbyB2YWx1ZSB0byBiZSBkZWZpbmVkXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxpc3RlbmluZ0F4aXMgLSBhbmdsZT8gQHRvZG8gdmFsdWUgdG8gYmUgZGVmaW5lZFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGF1ZGlvQ29udGV4dCwgYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24gPSB1bmRlZmluZWQsIG91dHB1dFR5cGUgPSAnaGVhZHBob25lJywgaHJ0ZiwgZXFQcmVzZXQsIG9mZnNldEdhaW4sIGxpc3RlbmluZ0F4aXMpe1xuICAgICAgICBzdXBlcihhdWRpb0NvbnRleHQsIGF1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9uLCBvdXRwdXRUeXBlLCBocnRmLCBlcVByZXNldCwgb2Zmc2V0R2FpbiwgbGlzdGVuaW5nQXhpcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgcG9zaXRpb24gb2YgdGhlIHNvdW5kXG4gICAgICogQHRvZG8gb25seSBmb3IgYSB1bmlxdWUgbW9ubyBzdHJlYW1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYXppbXV0aCAtIGF6aW11dGggQHRvZG8gdmFsdWVzIHRvIGJlIGRlZmluZWRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZWxldmF0aW9uIC0gZWxldmF0aW9uIEB0b2RvIHZhbHVlcyB0byBiZSBkZWZpbmVkXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIC0gZGlzdGFuY2UgQHRvZG8gdmFsdWVzIHRvIGJlIGRlZmluZWRcbiAgICAgKi9cbiAgICBzZXRQb3NpdGlvbihhemltdXRoLCBlbGV2YXRpb24sIGRpc3RhbmNlKXtcbiAgICAgICAgdGhpcy5fYXppbXV0aCA9IGF6aW11dGg7XG4gICAgICAgIHRoaXMuX2VsZXZhdGlvbiA9IGVsZXZhdGlvbjtcbiAgICAgICAgdGhpcy5fZGlzdGFuY2UgPSBkaXN0YW5jZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgc291bmRcbiAgICAgKiBAdG9kbyByZXR1cm4gYW4gYXJyYXk/IGJldHRlciBJIHRoaW5rIGZvciBzZXRQb3NpdGlvbi9nZXRQb3NpdGlvbiBob21vZ2VuZWl0eVxuICAgICAqIEByZXR1cm4ge2FycmF5fVxuICAgICAqL1xuICAgIGdldFBvc2l0aW9uKCl7XG4gICAgICAgIC8vcmV0dXJuIHsnYXppbXV0aCc6IHRoaXMuX2F6aW11dGgsICdlbGV2YXRpb24nOiB0aGlzLl9lbGV2YXRpb24sICdkaXN0YW5jZSc6IHRoaXMuX2Rpc3RhbmNlfTtcbiAgICAgICAgcmV0dXJuIFt0aGlzLl9hemltdXRoLCB0aGlzLl9lbGV2YXRpb24sIHRoaXMuX2Rpc3RhbmNlXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUHJvY2VzczogXCJwb3NpdGlvblwiICsgXCJnYWluXCJcbiAgICAgKiBAdG9kbzogaG93IHRvIGF1dG9tYXRpY2FsbHkgc2V0IHRoZSBnYWluLCBob3cgdG8gaGF2ZSBSTVMgZnJvbSBcInRoZSBvdGhlciBzaWduYWxcIiBoZXJlXG4gICAgICovXG4gICAgIF9wcm9jZXNzKCl7XG4gICAgIH1cbn1cbiJdfQ==