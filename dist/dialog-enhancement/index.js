'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DialogEnhancement = function (_AbstractNode) {
    _inherits(DialogEnhancement, _AbstractNode);

    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
     * @param {number} mode - mode
     * @param {number} dialogGain - dialog gain
     */

    function DialogEnhancement(audioContext, audioStreamDescriptionCollection, mode, dialogGain) {
        _classCallCheck(this, DialogEnhancement);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DialogEnhancement).call(this, audioContext, audioStreamDescriptionCollection));

        _this._mode = mode;
        return _this;
    }
    /**
     * Set Mode - value is 1, 2 or 3
     * @type {number}
     */


    _createClass(DialogEnhancement, [{
        key: 'mode',
        set: function set(value) {
            // @todo error in some mode: eg. mode 1 and no dialog => "impossible"
            // error mode 2 et pas de 5.0 ou 5.1
            // error mode 3 et pas de stéréo
            this._mode = value;
        }
        /**
         * Get Mode - value is 1, 2 or 3
         * @type {number}
         */
        ,
        get: function get() {
            return this._mode;
        }
        /**
         * Set audioStreamDescriptionCollection
         * @type {AudioStreamDescriptionCollection}
         */

    }, {
        key: 'audioStreamDescriptionCollection',
        set: function set(value) {
            this._audioStreamDescriptionCollection = value;
        }
        /**
         * Get audioStreamDescriptionCollection
         * @type {AudioStreamDescriptionCollection}
         */
        ,
        get: function get() {
            return this._audioStreamDescriptionCollection;
        }
        /**
         * Set dialogGain
         * @type {number}
         * @todo give range of accepted values
         */

    }, {
        key: 'dialogGain',
        set: function set(value) {
            this._dialogGain = value;
        }
        /**
         * Get dialogGain
         * @type {number}
         * @todo give range of accepted values
         */
        ,
        get: function get() {
            return this._dialogGain;
        }
    }]);

    return DialogEnhancement;
}(_index2.default);

exports.default = DialogEnhancement;