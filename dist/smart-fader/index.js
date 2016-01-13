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

var SmartFader = function (_AbstractNode) {
    _inherits(SmartFader, _AbstractNode);

    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection
     * @param {number} dB - dB value for the SmartFader.
     * @todo give range of accepted values
     */

    function SmartFader(audioContext) {
        var audioStreamDescriptionCollection = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
        var dB = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];

        _classCallCheck(this, SmartFader);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SmartFader).call(this, audioContext, audioStreamDescriptionCollection));

        _this._dB = dB;

        // AudioGraph connect
        // @todo: DynamicsCompressorNode accept n channels input
        _this._dynamicCompressorNode = audioContext.createDynamicsCompressor();
        _this.input.connect(_this._dynamicCompressorNode);
        _this._dynamicCompressorNode.connect(_this._output);
        return _this;
    }
    /**
     * Set the dB value
     * @todo give range of accepted values
     * @type {number}
     */

    _createClass(SmartFader, [{
        key: '_update',
        value: function _update() {
            // @todo éclaircir régles d'activation avec Matthieu
            // this._dynamicCompressorNode.threshold
            // this._dynamicCompressorNode.knee
            // this._dynamicCompressorNode.ratio
            // this._dynamicCompressorNode.attack
            // this._dynamicCompressorNode.release
        }
    }, {
        key: 'dB',
        set: function set(value) {
            // @todo clip value
            this._dB = value;
            this._update();
        }
        /**
         * Get the dB value
         * @type {number}
         */
        ,
        get: function get() {
            return this._dB;
        }
        // @todo Mathieu -80dB => +20dB
        /**
         * Get the dB range
         * @type {array}
         */

    }, {
        key: 'dynamicCompressionState',

        /**
         * Get the dynamic compression state
         * @type {boolean}
         */
        get: function get() {
            if (this._dynamicCompressorNode.reduction > 0) {
                return true;
            } else {
                return false;
            }
        }
    }], [{
        key: 'dBRange',
        get: function get() {
            return [-80, 20];
        }
    }, {
        key: 'dBDefault',
        get: function get() {
            return 0;
        }
    }]);

    return SmartFader;
}(_index2.default);

exports.default = SmartFader;