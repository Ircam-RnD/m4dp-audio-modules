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

var _coreIndexJs = require('../core/index.js');

var _coreIndexJs2 = _interopRequireDefault(_coreIndexJs);

var MultichannelSpatialiser = (function (_AbstractNode) {
    function MultichannelSpatialiser(audioContext, _x, _x2, hrtf, eqPreset, offsetGain, listeningAxis) {
        var outputType = arguments[1] === undefined ? 'headphone' : arguments[1];
        var audioStreamsDescription = arguments[2] === undefined ? {} : arguments[2];

        _classCallCheck(this, MultichannelSpatialiser);

        _get(Object.getPrototypeOf(MultichannelSpatialiser.prototype), 'constructor', this).call(this, audioContext);
        this._outputType = outputType;
        this._audioStreamsDescription = audioStreamsDescription;
        this._hrtf = hrtf;
        this._eqPreset = eqPreset;
        this._offsetGain = offsetGain;
        this._listeningAxis = listeningAxis;
    }

    _inherits(MultichannelSpatialiser, _AbstractNode);

    _createClass(MultichannelSpatialiser, [{
        key: 'outputType',

        /**
         * Set outputType: 'headphone' or 'speaker', 'multicanal'
         * @todo: automatic for 'multicanal' even if nb of speaker 'wrong'
         */
        set: function (value) {
            this._outputType = value;
        },

        /**
         * Get outputType: 'headphone' or 'speaker'
         */
        get: function () {
            return this._outputType;
        }
    }, {
        key: 'audioStreamsDescription',

        /**
         * Set audio streams description (json)
         */
        set: function (value) {},

        /**
         * Get audio streams description
         */
        get: function () {
            return _audioStreamsDescription;
        }
    }, {
        key: 'hrtf',

        /**
         * Set hrtf
         * @todo: which kind of value, json?
         */
        set: function (value) {
            this._hrtf = value;
        },

        /**
         * Get hrtf
         */
        get: function () {
            return this._hrtf;
        }
    }, {
        key: 'eqPreset',

        /**
         * Set eqPreset
         * @todo: which kind of value, json?
         * @todo: set it to none to not appy any eq?
         */
        set: function (value) {
            this._eqPreset = value;
        },

        /**
         * Get eqPreset
         */
        get: function () {
            return this._eqPreset;
        }
    }, {
        key: 'offsetGain',

        /**
         * Set offsetGain
         */
        set: function (value) {
            this._offsetGain = value;
        },

        /**
         * Get offsetGain
         */
        get: function () {
            return this._offsetGain;
        }
    }, {
        key: 'listeningAxis',

        /**
         * Set listeningAxis
         */
        set: function (value) {
            this._listeningAxis = value;
        },

        /**
         * Get listeningAxis
         */
        get: function () {
            return this._listeningAxis;
        }
    }]);

    return MultichannelSpatialiser;
})(_coreIndexJs2['default']);

exports['default'] = MultichannelSpatialiser;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9zbWFydC1mYWRlci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQXlCLGtCQUFrQjs7OztJQUd0Qix1QkFBdUI7QUFDN0IsYUFETSx1QkFBdUIsQ0FDNUIsWUFBWSxXQUEwRCxJQUFJLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUM7WUFBbEcsVUFBVSxnQ0FBRyxXQUFXO1lBQUUsdUJBQXVCLGdDQUFHLEVBQUU7OzhCQUQvRCx1QkFBdUI7O0FBRXBDLG1DQUZhLHVCQUF1Qiw2Q0FFOUIsWUFBWSxFQUFFO0FBQ3BCLFlBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO0FBQzlCLFlBQUksQ0FBQyx3QkFBd0IsR0FBRyx1QkFBdUIsQ0FBQztBQUN4RCxZQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixZQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztBQUMxQixZQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztBQUM5QixZQUFJLENBQUMsY0FBYyxHQUFHLGFBQWEsQ0FBQztLQUN2Qzs7Y0FUZ0IsdUJBQXVCOztpQkFBdkIsdUJBQXVCOzs7Ozs7O2FBYzFCLFVBQUMsS0FBSyxFQUFDO0FBQ2pCLGdCQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztTQUM1Qjs7Ozs7YUFJYSxZQUFFO0FBQ1osbUJBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQTtTQUMxQjs7Ozs7OzthQUkwQixVQUFDLEtBQUssRUFBQyxFQUVqQzs7Ozs7YUFJMEIsWUFBRTtBQUN6QixtQkFBTyx3QkFBd0IsQ0FBQztTQUNuQzs7Ozs7Ozs7YUFLTyxVQUFDLEtBQUssRUFBQztBQUNYLGdCQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztTQUN0Qjs7Ozs7YUFJTyxZQUFFO0FBQ04sbUJBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztTQUNyQjs7Ozs7Ozs7O2FBTVcsVUFBQyxLQUFLLEVBQUM7QUFDZixnQkFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7U0FDMUI7Ozs7O2FBSVcsWUFBRTtBQUNWLG1CQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7U0FDekI7Ozs7Ozs7YUFJYSxVQUFDLEtBQUssRUFBQztBQUNqQixnQkFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7U0FDNUI7Ozs7O2FBSWEsWUFBRTtBQUNaLG1CQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7U0FDM0I7Ozs7Ozs7YUFJZ0IsVUFBQyxLQUFLLEVBQUM7QUFDcEIsZ0JBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1NBQy9COzs7OzthQUlnQixZQUFFO0FBQ2YsbUJBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztTQUM5Qjs7O1dBckZnQix1QkFBdUI7OztxQkFBdkIsdUJBQXVCIiwiZmlsZSI6ImxpYi9zbWFydC1mYWRlci9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdE5vZGUgZnJvbSAnLi4vY29yZS9pbmRleC5qcyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXVsdGljaGFubmVsU3BhdGlhbGlzZXIgZXh0ZW5kcyBBYnN0cmFjdE5vZGUge1xuICAgIGNvbnN0cnVjdG9yKGF1ZGlvQ29udGV4dCwgb3V0cHV0VHlwZSA9ICdoZWFkcGhvbmUnLCBhdWRpb1N0cmVhbXNEZXNjcmlwdGlvbiA9IHt9LCBocnRmLCBlcVByZXNldCwgb2Zmc2V0R2FpbiwgbGlzdGVuaW5nQXhpcyl7XG4gICAgICAgIHN1cGVyKGF1ZGlvQ29udGV4dCk7XG4gICAgICAgIHRoaXMuX291dHB1dFR5cGUgPSBvdXRwdXRUeXBlO1xuICAgICAgICB0aGlzLl9hdWRpb1N0cmVhbXNEZXNjcmlwdGlvbiA9IGF1ZGlvU3RyZWFtc0Rlc2NyaXB0aW9uO1xuICAgICAgICB0aGlzLl9ocnRmID0gaHJ0ZjtcbiAgICAgICAgdGhpcy5fZXFQcmVzZXQgPSBlcVByZXNldDtcbiAgICAgICAgdGhpcy5fb2Zmc2V0R2FpbiA9IG9mZnNldEdhaW47XG4gICAgICAgIHRoaXMuX2xpc3RlbmluZ0F4aXMgPSBsaXN0ZW5pbmdBeGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgb3V0cHV0VHlwZTogJ2hlYWRwaG9uZScgb3IgJ3NwZWFrZXInLCAnbXVsdGljYW5hbCdcbiAgICAgKiBAdG9kbzogYXV0b21hdGljIGZvciAnbXVsdGljYW5hbCcgZXZlbiBpZiBuYiBvZiBzcGVha2VyICd3cm9uZydcbiAgICAgKi9cbiAgICBzZXQgb3V0cHV0VHlwZSh2YWx1ZSl7XG4gICAgICAgIHRoaXMuX291dHB1dFR5cGUgPSB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IG91dHB1dFR5cGU6ICdoZWFkcGhvbmUnIG9yICdzcGVha2VyJ1xuICAgICAqL1xuICAgIGdldCBvdXRwdXRUeXBlKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9vdXRwdXRUeXBlXG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCBhdWRpbyBzdHJlYW1zIGRlc2NyaXB0aW9uIChqc29uKVxuICAgICAqL1xuICAgIHNldCBhdWRpb1N0cmVhbXNEZXNjcmlwdGlvbih2YWx1ZSl7XG5cbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IGF1ZGlvIHN0cmVhbXMgZGVzY3JpcHRpb25cbiAgICAgKi9cbiAgICBnZXQgYXVkaW9TdHJlYW1zRGVzY3JpcHRpb24oKXtcbiAgICAgICAgcmV0dXJuIF9hdWRpb1N0cmVhbXNEZXNjcmlwdGlvbjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IGhydGZcbiAgICAgKiBAdG9kbzogd2hpY2gga2luZCBvZiB2YWx1ZSwganNvbj9cbiAgICAgKi9cbiAgICBzZXQgaHJ0Zih2YWx1ZSl7XG4gICAgICAgIHRoaXMuX2hydGYgPSB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IGhydGZcbiAgICAgKi9cbiAgICBnZXQgaHJ0Zigpe1xuICAgICAgICByZXR1cm4gdGhpcy5faHJ0ZjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IGVxUHJlc2V0XG4gICAgICogQHRvZG86IHdoaWNoIGtpbmQgb2YgdmFsdWUsIGpzb24/XG4gICAgICogQHRvZG86IHNldCBpdCB0byBub25lIHRvIG5vdCBhcHB5IGFueSBlcT9cbiAgICAgKi9cbiAgICBzZXQgZXFQcmVzZXQodmFsdWUpe1xuICAgICAgICB0aGlzLl9lcVByZXNldCA9IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgZXFQcmVzZXRcbiAgICAgKi9cbiAgICBnZXQgZXFQcmVzZXQoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VxUHJlc2V0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgb2Zmc2V0R2FpblxuICAgICAqL1xuICAgIHNldCBvZmZzZXRHYWluKHZhbHVlKXtcbiAgICAgICAgdGhpcy5fb2Zmc2V0R2FpbiA9IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgb2Zmc2V0R2FpblxuICAgICAqL1xuICAgIGdldCBvZmZzZXRHYWluKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9vZmZzZXRHYWluO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgbGlzdGVuaW5nQXhpc1xuICAgICAqL1xuICAgIHNldCBsaXN0ZW5pbmdBeGlzKHZhbHVlKXtcbiAgICAgICAgdGhpcy5fbGlzdGVuaW5nQXhpcyA9IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgbGlzdGVuaW5nQXhpc1xuICAgICAqL1xuICAgIGdldCBsaXN0ZW5pbmdBeGlzKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0ZW5pbmdBeGlzO1xuICAgIH1cbn1cbiJdfQ==