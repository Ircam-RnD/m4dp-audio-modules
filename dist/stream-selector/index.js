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

var StreamSelector = function (_AbstractNode) {
    _inherits(StreamSelector, _AbstractNode);

    /**
     * @brief This class mutes/unmutes the incoming streams according to the checkbox selections
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection
     */

    function StreamSelector(audioContext) {
        var audioStreamDescriptionCollection = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

        _classCallCheck(this, StreamSelector);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StreamSelector).call(this, audioContext, audioStreamDescriptionCollection));

        _this._splitterNode = undefined;
        _this._mergerNode = undefined;
        _this._gainNode = [];

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        var totalNumberOfChannels_ = _this._audioStreamDescriptionCollection.totalNumberOfChannels;

        _this._splitterNode = audioContext.createChannelSplitter(totalNumberOfChannels_);

        _this._mergerNode = audioContext.createChannelMerger(totalNumberOfChannels_);

        /// create 10 gainNodes
        for (var i = 0; i < totalNumberOfChannels_; i++) {
            var newGainNode = audioContext.createGain();
            _this._gainNode.push(newGainNode);
        }

        /// split the input streams into 10 independent channels
        _this.input.connect(_this._splitterNode);

        /// connect a gainNode to each channel
        for (var i = 0; i < totalNumberOfChannels_; i++) {
            _this._splitterNode.connect(_this._gainNode[i], i);
        }

        /// then merge the output of the 10 gainNodes
        for (var i = 0; i < totalNumberOfChannels_; i++) {
            _this._gainNode[i].connect(_this._mergerNode, 0, i);
        }

        _this._mergerNode.connect(_this._output);
        return _this;
    }

    /**
     * Notification when the active stream(s) changes
     * (i.e. whenever a check box is modified)
     */

    _createClass(StreamSelector, [{
        key: 'activeStreamsChanged',
        value: function activeStreamsChanged() {
            this._update();
        }

        /**
         * Mute/unmute the streams, depending on the user selection
         * in the check boxes
         */

    }, {
        key: '_update',
        value: function _update() {

            /// retrieves the AudioStreamDescriptionCollection
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

                    var gainValue = isActive ? 1.0 : 0.0;

                    var numChannelsForThisStream = stream.numChannels;

                    for (var i = 0; i < numChannelsForThisStream; i++) {

                        this._gainNode[channelIndex].gain.value = gainValue;

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
    }]);

    return StreamSelector;
}(_index2.default);

exports.default = StreamSelector;