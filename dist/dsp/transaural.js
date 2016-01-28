'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TransauralFeedforwardNode = undefined;

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TransauralNode = function (_AbstractNode) {
    _inherits(TransauralNode, _AbstractNode);

    //==============================================================================
    /**
     * @brief This class implements a transaural decoder.
     *        Restricted to symmetrical speakers setup
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */

    function TransauralNode(audioContext) {
        _classCallCheck(this, TransauralNode);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TransauralNode).call(this, audioContext));

        _this._isBypass = false;
        _this.speakersSpan = 60;
        /// span between speaker angles
        /// e.g. 60 corresponds to speakers at azimuth +/-30 deg

        _this._updateAudioGraph();
        return _this;
    }

    _createClass(TransauralNode, [{
        key: '_updateAudioGraph',

        //==============================================================================
        /**
         * Updates the connections of the audio graph
         */
        value: function _updateAudioGraph() {

            if (this.bypass === true) {
                this.input.connect(this._output);
            } else {
                ///@todo a completer
            }
        }
    }, {
        key: 'speakersSpan',
        get: function get() {
            return this.speakersSpan;
        }

        //==============================================================================
        /**
         * Enable or bypass the processor
         * @type {boolean}
         */

    }, {
        key: 'bypass',
        set: function set(value) {

            if (value !== this._isBypass) {
                this._isBypass = value;
                this._updateAudioGraph();
            }
        }

        /**
         * Returns true if the processor is bypassed
         */
        ,
        get: function get() {
            return this._isBypass;
        }
    }]);

    return TransauralNode;
}(_index2.default);

exports.default = TransauralNode;

var TransauralFeedforwardNode = exports.TransauralFeedforwardNode = function (_TransauralNode) {
    _inherits(TransauralFeedforwardNode, _TransauralNode);

    //==============================================================================
    /**
     * @brief This class implements a transaural decoder with feedforward topology
     *        Restricted to symmetrical speakers setup
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */

    function TransauralFeedforwardNode(audioContext) {
        _classCallCheck(this, TransauralFeedforwardNode);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(TransauralFeedforwardNode).call(this, audioContext));
    }

    return TransauralFeedforwardNode;
}(TransauralNode);