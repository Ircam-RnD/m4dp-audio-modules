'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; }; /************************************************************************************/
/*!
 *   @file       phone.js
 *   @brief      This class implements the voice enhancement node
 *   @author     Thibaut Carpentier, Jean-Philippe Lambert
 *   @date       04/2016
 *
 */
/************************************************************************************/

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _cascade = require('../dsp/cascade.js');

var _cascade2 = _interopRequireDefault(_cascade);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PhoneNode = function (_CascadeNode) {
    _inherits(PhoneNode, _CascadeNode);

    //==============================================================================
    /**
     * @brief This class implements the phone effect, for boosting the frequencies of the voice.
     *        It applies filtering on any number of channels
     *        The filtering is based on parametric filters (BiquadFilterNode).
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */

    function PhoneNode(audioContext) {
        _classCallCheck(this, PhoneNode);

        // default values

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PhoneNode).call(this, audioContext));

        _this._gain = 0; // in dB
        _this._frequency = 1200; // in hertz (in-between 300 and 4800)
        _this._q = 1;

        _set(Object.getPrototypeOf(PhoneNode.prototype), 'numCascades', 1, _this); // add more for steeper boost
        _get(Object.getPrototypeOf(PhoneNode.prototype), 'setType', _this).call(_this, 0, 'peaking');
        _this._updateCascades();
        return _this;
    }

    //==============================================================================
    /**
     * Set the boost gain. It has a default value of 0 and can take a value in a nominal range of -40 to 40
     * @type {number} gainRequest : the gain in dB (0 for no gain)
     */


    _createClass(PhoneNode, [{
        key: '_updateCascades',


        //==============================================================================
        value: function _updateCascades() {
            var gain = this._gain / _get(Object.getPrototypeOf(PhoneNode.prototype), 'numCascades', this);
            for (var c = 0; c < _get(Object.getPrototypeOf(PhoneNode.prototype), 'numCascades', this); ++c) {
                _get(Object.getPrototypeOf(PhoneNode.prototype), 'setGain', this).call(this, c, gain);
                _get(Object.getPrototypeOf(PhoneNode.prototype), 'setFrequency', this).call(this, c, this._frequency);
                _get(Object.getPrototypeOf(PhoneNode.prototype), 'setQ', this).call(this, c, this._q);
            }
        }
    }, {
        key: 'gain',
        set: function set(gainRequest) {
            this._gain = gainRequest;
            this._updateCascades();
        }

        /**
         * Get the boost gain.
         * @type {number} boost
         */
        ,
        get: function get() {
            return this._gain;
        }

        //==============================================================================
        /**
         * Set the central frequency.
         * @type {number} frequencyRequest : the central frequency in hertz
         */

    }, {
        key: 'frequency',
        set: function set(frequencyRequest) {
            this._frequency = frequencyRequest;
            this._updateCascades();
        }

        /**
         * Get the central frequency.
         * @type {number} frequency
         */
        ,
        get: function get() {
            return this._frequency;
        }

        //==============================================================================
        /**
         * Set the Q factor.
         * @type {number} qRequest : dimensionless in [0.0001, 1000.], 1 is default.
         */

    }, {
        key: 'q',
        set: function set(qRequest) {
            this._q = qRequest;
            this._updateCascades();
        }

        /**
         * Get the Q factor.
         * @type {number} q
         */
        ,
        get: function get() {
            return this._q;
        }

        //==============================================================================
        /**
         * Set the number of cascading filters.
         * @type {number} numCascadesRequest : 1 is the default.
         */

    }, {
        key: 'numCascades',
        set: function set(numCascadesRequest) {
            _set(Object.getPrototypeOf(PhoneNode.prototype), 'numCascades', numCascadesRequest, this);
            for (var c = 0; c < _get(Object.getPrototypeOf(PhoneNode.prototype), 'numCascades', this); ++c) {
                _get(Object.getPrototypeOf(PhoneNode.prototype), 'setType', this).call(this, c, 'peaking');
            }
            this._updateCascades();
        }

        /**
         * Get the number of cascading filters.
         * @type {number} numCascades
         */
        ,
        get: function get() {
            return _get(Object.getPrototypeOf(PhoneNode.prototype), 'numCascades', this);
        }
    }]);

    return PhoneNode;
}(_cascade2.default);

exports.default = PhoneNode;