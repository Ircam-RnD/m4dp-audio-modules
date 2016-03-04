'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../multichannel-spatialiser/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       
 *   @brief      Implements the ObjectSpatialiserAndMixer of M4DP
 *   @author     Thibaut Carpentier, Samuel Goldszmidt
 *   @date       01/2016
 *
 */
/************************************************************************************/

var ObjectSpatialiserAndMixer = function (_MultichannelSpatiali) {
    _inherits(ObjectSpatialiserAndMixer, _MultichannelSpatiali);

    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
     * @param {string} outputType - output type 'binaural' or 'transaural' or 'multichannel'     
     * @param {string} headphoneEqPresetName - the name of the headphone equalization preset (they are hard-coded) 
     * @param {number} offsetGain - the offset gain (expressed in dB)
     * @param {number} listenerYaw - yaw angle in degrees
     */

    function ObjectSpatialiserAndMixer(audioContext) {
        var audioStreamDescriptionCollection = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
        var outputType = arguments.length <= 2 || arguments[2] === undefined ? 'binaural' : arguments[2];
        var headphoneEqPresetName = arguments.length <= 3 || arguments[3] === undefined ? 'none' : arguments[3];
        var offsetGain = arguments.length <= 4 || arguments[4] === undefined ? 0.0 : arguments[4];
        var listenerYaw = arguments.length <= 5 || arguments[5] === undefined ? 0.0 : arguments[5];

        _classCallCheck(this, ObjectSpatialiserAndMixer);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ObjectSpatialiserAndMixer).call(this, audioContext, audioStreamDescriptionCollection, outputType, headphoneEqPresetName, offsetGain, listenerYaw));

        _this._distance = 1;
        return _this;
    }

    //==============================================================================
    /**
     * Set the position of the additionnal mono commentary     
     * @param {number} azimuth - azimuth @todo values to be defined
     * @param {number} elevation - elevation @todo values to be defined
     * @param {number} distance - distance @todo values to be defined
     *
     * @details The values are expressed with Spat4 navigational coordinates
     */

    _createClass(ObjectSpatialiserAndMixer, [{
        key: 'setCommentaryPosition',
        value: function setCommentaryPosition(azimuth, elevation, distance) {
            this._azimuth = azimuth;
            this._elevation = elevation;
            this._distance = distance;

            this._updateCommentaryPosition();
        }
    }, {
        key: 'setCommentaryAzimuth',
        value: function setCommentaryAzimuth(azim) {
            this.setCommentaryPosition(azim, this._elevation, this._distance);
        }
    }, {
        key: 'setCommentaryElevation',
        value: function setCommentaryElevation(elev) {
            this.setCommentaryPosition(this._azimuth, elev, this._distance);
        }
    }, {
        key: 'setCommentaryAzimuthFromGui',
        value: function setCommentaryAzimuthFromGui(theSlider) {

            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = -180;
            var maxValue = 180;

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.setCommentaryAzimuth(value);

            return Math.round(value);
        }
    }, {
        key: 'setCommentaryElevationFromGui',
        value: function setCommentaryElevationFromGui(theSlider) {
            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = -40;
            var maxValue = 90;

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.setCommentaryElevation(value);

            return Math.round(value);
        }

        /**
         * Returns the position of the additionnal mono commentary     
         * @return {array}
         *
         * @details The values are expressed with Spat4 navigational coordinates
         */

    }, {
        key: 'getCommentaryPosition',
        value: function getCommentaryPosition() {
            return [this._azimuth, this._elevation, this._distance];
        }

        //==============================================================================

    }, {
        key: '_updateCommentaryPosition',
        value: function _updateCommentaryPosition() {

            var sourceIndex = this._getSourceIndexForCommentary();

            if (sourceIndex >= 0) {

                /// convert to SOFA spherical coordinate
                var sofaAzim = -1. * this._azimuth;
                var sofaElev = this._elevation;
                var sofaDist = 1.; /// fow now, the distance is not take into account

                var sofaPos = [sofaAzim, sofaElev, sofaDist];

                if (typeof this._virtualSpeakers._binauralPanner !== 'undefined') {
                    this._virtualSpeakers._binauralPanner.setSourcePositionByIndex(sourceIndex, sofaPos);
                    this._virtualSpeakers._binauralPanner.update();
                }
            } else {
                /// there is no commentary stream
            }
        }

        //==============================================================================
        /**
         * The binaural processor handles up to 10 sources, considering all the streams.
         * This function returns the index of the source which corresponds to the commentary
         * (that needs to be spatialized)
         * Returns -1 if there is no commentary
         */

    }, {
        key: '_getSourceIndexForCommentary',
        value: function _getSourceIndexForCommentary() {

            /// retrieves the AudioStreamDescriptionCollection
            /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
            var asdc = this._audioStreamDescriptionCollection.streams;

            var sourceIndex = 0;

            /// go through all the streams and mute/unmute according to their 'active' flag
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = asdc[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var stream = _step.value;

                    if (stream.commentary === true) {

                        if (stream.type !== "Mono") {
                            throw new Error("The commentary must be mono!");
                        }

                        return sourceIndex;
                    } else {
                        var numChannelsForThisStream = stream.numChannels;

                        sourceIndex += numChannelsForThisStream;
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

            return -1;
        }

        //==============================================================================
        /**
         * Process: "position" + "gain"
         * @todo: how to automatically set the gain, how to have RMS from "the other signal" here
         */

    }, {
        key: '_process',
        value: function _process() {}
    }]);

    return ObjectSpatialiserAndMixer;
}(_index2.default);

exports.default = ObjectSpatialiserAndMixer;