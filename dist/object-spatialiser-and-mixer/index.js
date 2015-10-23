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
    function ObjectSpatialiserAndMixer(audioContext, _x, _x2, hrtf, eqPreset, offsetGain, listeningAxis) {
        var outputType = arguments[1] === undefined ? 'headphone' : arguments[1];
        var audioStreamsDescription = arguments[2] === undefined ? {} : arguments[2];

        _classCallCheck(this, ObjectSpatialiserAndMixer);

        _get(Object.getPrototypeOf(ObjectSpatialiserAndMixer.prototype), 'constructor', this).call(this, audioContext, outputType, audioStreamsDescription, hrtf, eqPreset, offsetGain, listeningAxis);
    }

    _inherits(ObjectSpatialiserAndMixer, _MultichannelSpatialiser);

    _createClass(ObjectSpatialiserAndMixer, [{
        key: 'setPosition',

        /*
         * Set the position of the sound
         */
        value: function setPosition(azimuth, elevation, distance) {
            this._azimuth = azimuth;
            this._elevation = elevation;
            this._distance = distance;
        }
    }, {
        key: 'getPosition',

        /*
         * Get the position of the sound
         */
        value: function getPosition() {
            return { 'azimuth': this._azimuth, 'elevation': this._elevation, 'distance': this._distance };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9zbWFydC1mYWRlci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OENBQW9DLHNDQUFzQzs7OztJQUdyRCx5QkFBeUI7QUFDL0IsYUFETSx5QkFBeUIsQ0FDOUIsWUFBWSxXQUEwRCxJQUFJLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUM7WUFBbEcsVUFBVSxnQ0FBRyxXQUFXO1lBQUUsdUJBQXVCLGdDQUFHLEVBQUU7OzhCQUQvRCx5QkFBeUI7O0FBRXRDLG1DQUZhLHlCQUF5Qiw2Q0FFaEMsWUFBWSxFQUFFLFVBQVUsRUFBRSx1QkFBdUIsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUU7S0FDdkc7O2NBSGdCLHlCQUF5Qjs7aUJBQXpCLHlCQUF5Qjs7Ozs7O2VBTy9CLHFCQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFDO0FBQ3JDLGdCQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztBQUN4QixnQkFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7QUFDNUIsZ0JBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1NBQzdCOzs7Ozs7O2VBSVUsdUJBQUU7QUFDVCxtQkFBTyxFQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFDLENBQUM7U0FDL0Y7Ozs7Ozs7O2VBS1Esb0JBQUUsRUFDVDs7O1dBdkJlLHlCQUF5Qjs7O3FCQUF6Qix5QkFBeUIiLCJmaWxlIjoibGliL3NtYXJ0LWZhZGVyL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE11bHRpY2hhbm5lbFNwYXRpYWxpc2VyIGZyb20gJy4uL211bHRpY2hhbm5lbC1zcGF0aWFsaXNlci9pbmRleC5qcyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT2JqZWN0U3BhdGlhbGlzZXJBbmRNaXhlciBleHRlbmRzIE11bHRpY2hhbm5lbFNwYXRpYWxpc2VyIHtcbiAgICBjb25zdHJ1Y3RvcihhdWRpb0NvbnRleHQsIG91dHB1dFR5cGUgPSAnaGVhZHBob25lJywgYXVkaW9TdHJlYW1zRGVzY3JpcHRpb24gPSB7fSwgaHJ0ZiwgZXFQcmVzZXQsIG9mZnNldEdhaW4sIGxpc3RlbmluZ0F4aXMpe1xuICAgICAgICBzdXBlcihhdWRpb0NvbnRleHQsIG91dHB1dFR5cGUsIGF1ZGlvU3RyZWFtc0Rlc2NyaXB0aW9uLCBocnRmLCBlcVByZXNldCwgb2Zmc2V0R2FpbiwgbGlzdGVuaW5nQXhpcyk7XG4gICAgfVxuICAgIC8qXG4gICAgICogU2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgc291bmRcbiAgICAgKi9cbiAgICBzZXRQb3NpdGlvbihhemltdXRoLCBlbGV2YXRpb24sIGRpc3RhbmNlKXtcbiAgICAgICAgdGhpcy5fYXppbXV0aCA9IGF6aW11dGg7XG4gICAgICAgIHRoaXMuX2VsZXZhdGlvbiA9IGVsZXZhdGlvbjtcbiAgICAgICAgdGhpcy5fZGlzdGFuY2UgPSBkaXN0YW5jZTtcbiAgICB9XG4gICAgLypcbiAgICAgKiBHZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBzb3VuZFxuICAgICAqL1xuICAgIGdldFBvc2l0aW9uKCl7XG4gICAgICAgIHJldHVybiB7J2F6aW11dGgnOiB0aGlzLl9hemltdXRoLCAnZWxldmF0aW9uJzogdGhpcy5fZWxldmF0aW9uLCAnZGlzdGFuY2UnOiB0aGlzLl9kaXN0YW5jZX07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFByb2Nlc3M6IFwicG9zaXRpb25cIiArIFwiZ2FpblwiXG4gICAgICogQHRvZG86IGhvdyB0byBhdXRvbWF0aWNhbGx5IHNldCB0aGUgZ2FpbiwgaG93IHRvIGhhdmUgUk1TIGZyb20gXCJ0aGUgb3RoZXIgc2lnbmFsXCIgaGVyZVxuICAgICAqL1xuICAgICBfcHJvY2Vzcygpe1xuICAgICB9XG59XG4iXX0=