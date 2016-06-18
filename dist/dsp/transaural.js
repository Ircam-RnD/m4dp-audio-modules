'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TransauralFeedforwardNode = exports.TransauralShufflerNode = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _sumdiff = require('./sumdiff.js');

var _sumdiff2 = _interopRequireDefault(_sumdiff);

var _kemar = require('./kemar.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       transaural.js
 *   @brief      This class implements the transaural decoder node(s)
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var TransauralNode = function (_AbstractNode) {
    _inherits(TransauralNode, _AbstractNode);

    //==============================================================================
    /**
     * @brief This class implements a transaural decoder (abstract)
     *        Restricted to symmetrical speakers setup
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */

    function TransauralNode(audioContext) {
        _classCallCheck(this, TransauralNode);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TransauralNode).call(this, audioContext));

        _this._isBypass = false;
        _this._speakersSpan = 60;
        /// span between speaker angles
        /// e.g. 60 corresponds to speakers at azimuth +/-30 deg

        return _this;
    }

    //==============================================================================
    /**
     * Returns the span between speaker (angles in degress)
     * @type {number}
     */


    _createClass(TransauralNode, [{
        key: '_updateAudioGraph',


        //==============================================================================
        /**
         * Updates the connections of the audio graph
         */
        value: function _updateAudioGraph() {
            if (this.bypass === true) {
                this._input.disconnect();
                this._input.connect(this._output);
            } else {
                //this._updateTransauralAudioGraph();
            }
        }
    }, {
        key: 'speakersSpan',
        get: function get() {
            return this._speakersSpan;
        }

        //==============================================================================
        /**
         * Sets the span between speaker (angles in degress)
         * @type {number}
         */
        ,
        set: function set(spanInDegress) {

            if (0 < spanInDegress && spanInDegress <= 60) {
                this._speakersSpan = spanInDegress;
                this._updateAudioGraph();
            } else {
                throw new Error("Invalid speakerSpan " + spanInDegress);
            }
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

var TransauralShufflerNode = exports.TransauralShufflerNode = function (_TransauralNode) {
    _inherits(TransauralShufflerNode, _TransauralNode);

    //==============================================================================
    /**
     * @brief This class implements a transaural decoder with feedforward topology
     *        Restricted to symmetrical speakers setup
     *
     *
     * @param {AudioContext} audioContext - audioContext instance.
     *
     * @n TC : this class is OK (01/02/2016)
     */

    function TransauralShufflerNode(audioContext) {
        _classCallCheck(this, TransauralShufflerNode);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(TransauralShufflerNode).call(this, audioContext));

        _this2._sumDiffNode1 = undefined;
        _this2._convolverNode = undefined;
        _this2._sumDiffNode2 = undefined;

        /// create the nodes
        {
            _this2._sumDiffNode1 = new _sumdiff2.default(audioContext);
            _this2._sumDiffNode2 = new _sumdiff2.default(audioContext);

            _this2._convolverNode = audioContext.createConvolver();
            _this2._convolverNode.normalize = false;
        }

        /// shuffling input
        _this2._input.disconnect();
        _this2._input.connect(_this2._sumDiffNode1._input);

        /// filtering
        _this2._sumDiffNode1.connect(_this2._convolverNode);

        /// shuffling output
        _this2._convolverNode.connect(_this2._sumDiffNode2._input);

        /// connect to the output
        _this2._sumDiffNode2.connect(_this2._output);

        _this2.speakersSpan = 60;
        return _this2;
    }

    //==============================================================================
    /**
     * Updates the connections of the audio graph
     */


    _createClass(TransauralShufflerNode, [{
        key: '_updateAudioGraph',
        value: function _updateAudioGraph() {
            if (this.bypass === true) {
                this._input.disconnect();
                this._input.connect(this._output);
            } else {
                this._updateTransauralAudioGraph();
            }
        }
    }, {
        key: '_updateTransauralAudioGraph',
        value: function _updateTransauralAudioGraph() {
            this._input.disconnect();

            this._input.connect(this._sumDiffNode1._input);

            /// (the rest of the graph is already connected in the constructor)

            /// updates the convolution kernels
            this._updateFilters();
        }
    }, {
        key: '_updateFilters',
        value: function _updateFilters() {
            var span = this.speakersSpan;

            var firBuffer = undefined;

            if (span <= 20) {
                firBuffer = (0, _kemar.getKemar2btFilters)(this._audioContext, 20);
            } else if (span <= 40) {
                firBuffer = (0, _kemar.getKemar2btFilters)(this._audioContext, 40);
            } else if (span <= 60) {
                firBuffer = (0, _kemar.getKemar2btFilters)(this._audioContext, 60);
            } else {
                throw new Error("Invalid speakerSpan " + speakerSpan);
            }

            this._convolverNode.buffer = firBuffer;
        }
    }]);

    return TransauralShufflerNode;
}(TransauralNode);

var TransauralFeedforwardNode = exports.TransauralFeedforwardNode = function (_TransauralNode2) {
    _inherits(TransauralFeedforwardNode, _TransauralNode2);

    //==============================================================================
    /**
     * @brief This class implements a transaural decoder with shuffler topology
     *        Restricted to symmetrical speakers setup
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */

    function TransauralFeedforwardNode(audioContext) {
        _classCallCheck(this, TransauralFeedforwardNode);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(TransauralFeedforwardNode).call(this, audioContext));

        ///@todo : not yet implemented 
    }

    return TransauralFeedforwardNode;
}(TransauralNode);