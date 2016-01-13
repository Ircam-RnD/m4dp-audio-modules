"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require("../core/index.js");

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

        _this._dB = undefined;

        // AudioGraph connect
        // @todo: DynamicsCompressorNode accept n channels input
        _this._dynamicCompressorNode = audioContext.createDynamicsCompressor();
        _this.input.connect(_this._dynamicCompressorNode);
        _this._dynamicCompressorNode.connect(_this._output);

        _this.dB = dB;
        return _this;
    }

    /**
     * Set the dB value
     * @type {number}
     */

    _createClass(SmartFader, [{
        key: "_update",
        value: function _update() {

            /// retrieves the AudioStreamDescriptionCollection
            var asdc = this._audioStreamDescriptionCollection;

            /// retrieves the active AudioStreamDescription(s)
            var asd = asdc.actives;

            /// retrieves the MaxTruePeak (ITU­R BS.1770­3) of the active AudioStreamDescription
            var maxTruePeak = asd.maxTruePeak;

            /**
            Le reglage du volume doit se comporter de la facon suivante :
            - attenuation classique du volume sonore entre le niveau nominal (gain = 0) et en deca
            - augmentation classique du volume sonore entre le niveau nominal et le niveau max (niveau max = niveau nominal + I MaxTruePeak I)
            - limiteur/compresseur multicanal au dela du niveau max
             NB : la donnee de loudness integree n'est pas utilisee
            */

            // @todo éclaircir régles d'activation avec Matthieu
            // this._dynamicCompressorNode.threshold
            // this._dynamicCompressorNode.knee
            // this._dynamicCompressorNode.ratio
            // this._dynamicCompressorNode.attack
            // this._dynamicCompressorNode.release
        }
    }, {
        key: "dB",
        set: function set(value) {
            this._dB = SmartFader.clampdB(value);
            this._update();
        }

        /**
         * Clips a value within a given range
         * @type {number} value the value to be clipped
         * @type {number} min the lower bound
         * @type {number} max the upper bound
         *
         * @todo move this function into a common file
         */
        ,

        /**
         * Get the dB value
         * @type {number}
         */
        get: function get() {
            return this._dB;
        }

        /**
         * Get the dB range
         * @type {array}
         * @details +8 dB suffisent, pour passer du -23 au -15 LUFS (iTunes), c'est l'idée.
         */

    }, {
        key: "dynamicCompressionState",

        /**
         * Returns the dynamic compression state
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
        key: "clamp",
        value: function clamp(value, min, max) {

            if (max < min) {
                throw new Error("pas bon");
            }

            return Math.max(min, Math.min(value, max));
        }

        /**
         * Clips a value within the proper dB range
         * @type {number} value the value to be clipped
         */

    }, {
        key: "clampdB",
        value: function clampdB(value) {
            var _SmartFader$dBRange = _slicedToArray(SmartFader.dBRange, 2);

            var minValue = _SmartFader$dBRange[0];
            var maxValue = _SmartFader$dBRange[1];

            return SmartFader.clamp(value, minValue, maxValue);
        }
    }, {
        key: "dBRange",
        get: function get() {
            return [0, 8];
        }

        /**
         * Returns the default value (in dB)
         * @type {number}
         */

    }, {
        key: "dBDefault",
        get: function get() {
            return 0;
        }
    }]);

    return SmartFader;
}(_index2.default);

exports.default = SmartFader;