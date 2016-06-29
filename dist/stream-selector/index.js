'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _utils = require('../core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

var _multichannelgain = require('../dsp/multichannelgain.js');

var _multichannelgain2 = _interopRequireDefault(_multichannelgain);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      This class mutes/unmutes the incoming streams according to the checkbox selections
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

var StreamSelector = function (_AbstractNode) {
    _inherits(StreamSelector, _AbstractNode);

    //==============================================================================
    /**
     * @brief This class mutes/unmutes the incoming streams according to the checkbox selections
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection
     */

    function StreamSelector(audioContext) {
        var audioStreamDescriptionCollection = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

        _classCallCheck(this, StreamSelector);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StreamSelector).call(this, audioContext, audioStreamDescriptionCollection));

        _this._gainsNode = 'undefined';

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        var totalNumberOfChannels_ = _this.getTotalNumberOfChannels();

        /// sanity check
        /// mainAudio (2) + extendedAmbience (6) + extendedComments (1) + extendedDialogs (1) = 10
        if (totalNumberOfChannels_ != 10) {
            console.log("warning : total number of channels = " + totalNumberOfChannels_);
        }

        _this._gainsNode = new _multichannelgain2.default(audioContext, totalNumberOfChannels_);

        _this._updateAudioGraph();
        return _this;
    }

    //==============================================================================


    _createClass(StreamSelector, [{
        key: 'getTotalNumberOfChannels',
        value: function getTotalNumberOfChannels() {
            return this._audioStreamDescriptionCollection.totalNumberOfChannels;
        }

        //==============================================================================
        /**
         * Enable or bypass the processor
         * @type {boolean}
         */

    }, {
        key: 'activeStreamsChanged',


        //==============================================================================
        /**
         * Notification when the active stream(s) changes
         * (i.e. whenever a check box is modified)
         */
        value: function activeStreamsChanged() {
            this._update();
        }
    }, {
        key: 'streamsTrimChanged',
        value: function streamsTrimChanged() {
            this._update();
        }

        //==============================================================================
        /**
         * Mute/unmute the streams, depending on the user selection
         * in the check boxes
         */

    }, {
        key: '_update',
        value: function _update() {

            /// retrieves the AudioStreamDescriptionCollection
            /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
            var asdc = this._audioStreamDescriptionCollection.streams;

            var channelIndex = 0;

            /// go through all the streams and mute/unmute according to their 'active' flag
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = asdc[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var stream = _step.value;

                    var isActive = stream.active;

                    /// linear gain value
                    var gainValue = isActive ? 1.0 : 0.0;

                    var trimIndB = stream.trim;
                    var trimLevel = _utils2.default.dB2lin(trimIndB);

                    var overallGain = gainValue * trimLevel;

                    var numChannelsForThisStream = stream.numChannels;

                    for (var i = 0; i < numChannelsForThisStream; i++) {
                        if (channelIndex >= this._gainsNode.getNumChannels()) {
                            throw new Error("Y'a un bug qq part...");
                        }

                        this._gainsNode.setGain(channelIndex, overallGain);

                        channelIndex++;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        /************************************************************************************/
        /*!
         *  @brief          Updates the connections of the audio graph
         *
         */
        /************************************************************************************/

    }, {
        key: '_updateAudioGraph',
        value: function _updateAudioGraph() {
            /// first of all, disconnect everything
            this._input.disconnect();
            this._gainsNode.disconnect();

            this._input.connect(this._gainsNode._input);
            this._gainsNode.connect(this._output);
        }
    }, {
        key: 'bypass',
        set: function set(value) {
            this._gainsNode.bypass = value;
        }

        /**
         * Returns true if the processor is bypassed
         */
        ,
        get: function get() {
            return this._gainsNode.bypass;
        }
    }]);

    return StreamSelector;
}(_index2.default);

exports.default = StreamSelector;