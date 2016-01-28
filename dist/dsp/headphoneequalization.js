'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _cascade = require('../dsp/cascade.js');

var _cascade2 = _interopRequireDefault(_cascade);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HeadphonesEqualization = function (_CascadeNode) {
    _inherits(HeadphonesEqualization, _CascadeNode);

    //==============================================================================
    /**
     * @brief This class implements the headphone equalization.
     *        It thus applies filtering on 2 channels (2 in, 2 out)
     *        The filtering is based on parametric filters (BiquadFilterNode); various settings are hard-coded
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */

    function HeadphonesEqualization(audioContext) {
        _classCallCheck(this, HeadphonesEqualization);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HeadphonesEqualization).call(this, audioContext));

        _this._eqPreset = "none";
        return _this;
    }

    //==============================================================================
    /**
     * Set eqPreset
     * @todo: which kind of value, json?
     * @todo: set it to none to not appy any eq?
     * @type {EqPreset}
     */

    _createClass(HeadphonesEqualization, [{
        key: '_updateCascade',

        //==============================================================================
        value: function _updateCascade() {

            var preset = this.eqPreset;

            if (preset === "none") {
                _set(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'numCascades', 0, this);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'resetAllBiquads', this).call(this);
            } else if (preset === "eq1") {

                /// whatever settings... waiting for FTV to communicate their specifications

                _set(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'numCascades', 3, this);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'resetAllBiquads', this).call(this);

                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setType', this).call(this, 0, "highpass");
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setType', this).call(this, 1, "peaking");
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setType', this).call(this, 2, "lowpass");

                /// It is expressed in dB, has a default value of 0 and can take a value in a nominal range of -40 to 40
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setGain', this).call(this, 0, -12);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setGain', this).call(this, 1, 6);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setGain', this).call(this, 2, -16);

                /// measured in hertz (Hz)
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setFrequency', this).call(this, 0, 200);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setFrequency', this).call(this, 1, 1000);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setFrequency', this).call(this, 2, 4000);

                /// It is a dimensionless value with a default value of 1 and a nominal range of 0.0001 to 1000.
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setQ', this).call(this, 0, 1);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setQ', this).call(this, 1, 2);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setQ', this).call(this, 2, 1);
            } else {
                throw new Error("Invalid preset name " + preset);
            }
        }
    }, {
        key: 'eqPreset',
        set: function set(value) {
            this._eqPreset = value;
            this._updateCascade();
        }
        /**
         * Get eqPreset
         * @type {EqPreset}
         */
        ,
        get: function get() {
            return this._eqPreset;
        }
    }]);

    return HeadphonesEqualization;
}(_cascade2.default);

exports.default = HeadphonesEqualization;