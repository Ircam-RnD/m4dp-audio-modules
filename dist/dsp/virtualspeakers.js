'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _binaural = require('binaural');

var _binaural2 = _interopRequireDefault(_binaural);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       virtualspeakers.js
 *   @brief      This class implements the 5.1 to binaural virtual speakers
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var VirtualSpeakersNode = function (_AbstractNode) {
    _inherits(VirtualSpeakersNode, _AbstractNode);

    //==============================================================================
    /**
     * @brief This class implements the 5.1 to binaural virtual speakers
     *
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
     */

    function VirtualSpeakersNode(audioContext, audioStreamDescriptionCollection) {
        _classCallCheck(this, VirtualSpeakersNode);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VirtualSpeakersNode).call(this, audioContext, audioStreamDescriptionCollection));

        _this._splitterNode = undefined;
        _this._binauralPanner = undefined;
        _this._hrtfSet = undefined;
        _this._listenerYaw = 0.0;

        /// retrieves the positions of all streams
        var horizontalPositions = _this._getHorizontalPlane();

        /// instanciate an empty hrtf set
        _this._hrtfSet = new _binaural2.default.sofa.HrtfSet({
            audioContext: audioContext,
            positionsType: 'gl', // mandatory for BinauralPanner
            filterPositions: horizontalPositions,
            filterPositionsType: 'sofaSpherical'
        });

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        var totalNumberOfChannels_ = _this._audioStreamDescriptionCollection.totalNumberOfChannels;

        _this._splitterNode = audioContext.createChannelSplitter(totalNumberOfChannels_);

        /// sanity checks
        if (_this._splitterNode.numberOfInputs != 1 || _this._splitterNode.numberOfOutputs != totalNumberOfChannels_) {
            throw new Error("Pas bon");
        }

        /// split the input streams into 10 independent channels
        _this._input.connect(_this._splitterNode);

        /// the binaural panner is not yet created;
        /// it will be instanciated and connected to the audio graph as soon as an SOFA URL is loaded

        var url = 'http://bili2.ircam.fr/SimpleFreeFieldHRIR/BILI/COMPENSATED/44100/IRC_1100_C_HRIR.sofa';
        _this.loadHrtfSet(url);
        return _this;
    }

    //==============================================================================
    /**
     * Set listenerYaw
     * @type {number} yaw angle in degrees
     */

    _createClass(VirtualSpeakersNode, [{
        key: 'loadHrtfSet',

        //==============================================================================
        /**
         * Load a new HRTF from a given URL
         * @type {string} url
         */
        value: function loadHrtfSet(url) {
            var _this2 = this;

            /// the total number of incoming channels, including all the streams
            /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
            var totalNumberOfChannels_ = this._audioStreamDescriptionCollection.totalNumberOfChannels;

            /// retrieves the positions of all streams
            var sofaPositions = this._getSofaPositions();

            return this._hrtfSet.load(url).then(function () {
                console.log("loaded hrtf from " + url);

                /// first of all, disconnect the old panner
                if (typeof _this2._binauralPanner !== 'undefined') {
                    _this2._binauralPanner.disconnectOutputs();
                }

                _this2._binauralPanner = null;

                _this2._binauralPanner = new _binaural2.default.audio.BinauralPanner({
                    audioContext: _this2._audioContext,
                    hrtfSet: _this2._hrtfSet,
                    crossfadeDuration: 0.01,
                    positionsType: 'sofaSpherical',
                    sourceCount: totalNumberOfChannels_,
                    sourcePositions: sofaPositions
                });

                /// first of all, disconnect the old panner
                _this2._splitterNode.disconnect();

                /// connect the inputs
                for (var i = 0; i < totalNumberOfChannels_; i++) {
                    _this2._binauralPanner.connectInputByIndex(i, _this2._splitterNode, i, 0);
                }

                /// connect the outputs
                _this2._binauralPanner.connectOutputs(_this2._output);

                /// update the listener yaw
                _this2.listenerYaw = _this2._listenerYaw;
            });
        }

        //==============================================================================
        /// Returns an array of positions in the horizontal plane only.

    }, {
        key: '_getHorizontalPlane',
        value: function _getHorizontalPlane() {

            var sofaPositions = [];

            for (var i = -180; i <= 180; i += 1) {

                /// positions expressed with Spat4 navigation coordinate
                var azimuth = i;

                /// convert to SOFA spherical coordinate
                var sofaAzim = -1. * azimuth;
                var sofaElev = 0.;
                var sofaDist = 1.;

                var sofaPos = [sofaAzim, sofaElev, sofaDist];

                sofaPositions.push(sofaPos);
            }

            return sofaPositions;
        }

        //==============================================================================
        /// returns all the source positions, with the SOFA spherical coordinate

    }, {
        key: '_getSofaPositions',
        value: function _getSofaPositions() {

            /// retrieves the AudioStreamDescriptionCollection
            /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
            var asdc = this._audioStreamDescriptionCollection.streams;

            var channelIndex = 0;

            var sofaPositions = [];

            /// go through all the streams and mute/unmute according to their 'active' flag
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = asdc[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var stream = _step.value;

                    /// positions expressed with Spat4 navigation coordinate
                    var azimuths = stream.channelPositions;

                    var numChannelsForThisStream = stream.numChannels;

                    for (var i = 0; i < numChannelsForThisStream; i++) {

                        /// positions expressed with Spat4 navigation coordinate
                        var azimuth = azimuths[i];

                        /// convert to SOFA spherical coordinate
                        var sofaAzim = -1. * azimuth;
                        var sofaElev = 0.;
                        var sofaDist = 1.;

                        var sofaPos = [sofaAzim, sofaElev, sofaDist];

                        sofaPositions.push(sofaPos);
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

            return sofaPositions;
        }
    }, {
        key: 'listenerYaw',
        set: function set(value) {
            this._listenerYaw = value;

            /// the view vector must be expressed in sofaSpherical
            var viewPos = [-1. * this._listenerYaw, 0., 1.];

            if (typeof this._binauralPanner !== 'undefined') {
                this._binauralPanner.listenerView = viewPos;
                this._binauralPanner.update();
            }
        }

        /**
         * Get listenerYaw
         * @type {number} yaw angle in degrees
         */
        ,
        get: function get() {
            return this._listenerYaw;
        }
    }]);

    return VirtualSpeakersNode;
}(_index2.default);

exports.default = VirtualSpeakersNode;