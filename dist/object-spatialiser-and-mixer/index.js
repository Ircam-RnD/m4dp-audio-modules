'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../multichannel-spatialiser/index.js');

var _index2 = _interopRequireDefault(_index);

var _utils = require('../core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

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

        _this._DialogDistance = 1;
        _this._CommentaryDistance = 1;
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
            this._CommentaryAzimuth = azimuth;
            this._CommentaryElevation = elevation;
            this._CommentaryDistance = distance;

            this._updateCommentaryPosition();
        }
    }, {
        key: 'setCommentaryAzimuth',
        value: function setCommentaryAzimuth(azim) {
            this.setCommentaryPosition(azim, this._CommentaryElevation, this._CommentaryDistance);
        }
    }, {
        key: 'setCommentaryElevation',
        value: function setCommentaryElevation(elev) {
            this.setCommentaryPosition(this._CommentaryAzimuth, elev, this._CommentaryDistance);
        }
    }, {
        key: 'setCommentaryDistance',
        value: function setCommentaryDistance(dist) {
            this.setCommentaryPosition(this._CommentaryAzimuth, this._CommentaryElevation, dist);
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
    }, {
        key: 'setCommentaryDistanceFromGui',
        value: function setCommentaryDistanceFromGui(theSlider) {
            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = 0.5;
            var maxValue = 10;

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.setCommentaryDistance(value);

            return value;
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
            return [this._CommentaryAzimuth, this._CommentaryElevation, this._CommentaryDistance];
        }

        //==============================================================================

    }, {
        key: '_updateCommentaryPosition',
        value: function _updateCommentaryPosition() {

            var sourceIndex = this._getSourceIndexForCommentary();

            if (sourceIndex >= 0) {

                /// convert to SOFA spherical coordinate
                var sofaAzim = -1. * this._CommentaryAzimuth;
                var sofaElev = this._CommentaryElevation;
                var sofaDist = 1.; /// fow now, the distance is not take into account

                var sofaPos = [sofaAzim, sofaElev, sofaDist];

                if (typeof this._virtualSpeakers._binauralPanner !== 'undefined') {
                    this._virtualSpeakers._binauralPanner.setSourcePositionByIndex(sourceIndex, sofaPos);
                    this._virtualSpeakers._binauralPanner.update();

                    /// now, apply a simple gain to attenuate according to distance
                    var drop = ObjectSpatialiserAndMixer.distanceToDrop(this._CommentaryDistance);
                    var dropLin = _utils2.default.dB2lin(drop);

                    this._virtualSpeakers.setGainForVirtualSource(sourceIndex, dropLin);
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

            /// go through all the streams
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
         * Set the position of the additionnal mono dialog     
         * @param {number} azimuth - azimuth @todo values to be defined
         * @param {number} elevation - elevation @todo values to be defined
         * @param {number} distance - distance @todo values to be defined
         *
         * @details The values are expressed with Spat4 navigational coordinates
         */

    }, {
        key: 'setDialogPosition',
        value: function setDialogPosition(azimuth, elevation, distance) {
            this._DialogAzimuth = azimuth;
            this._DialogElevation = elevation;
            this._DialogDistance = distance;

            this._updateDialogPosition();
        }
    }, {
        key: 'setDialogAzimuth',
        value: function setDialogAzimuth(azim) {
            this.setDialogPosition(azim, this._DialogElevation, this._DialogDistance);
        }
    }, {
        key: 'setDialogElevation',
        value: function setDialogElevation(elev) {
            this.setDialogPosition(this._DialogAzimuth, elev, this._DialogDistance);
        }
    }, {
        key: 'setDialogDistance',
        value: function setDialogDistance(dist) {
            this.setDialogPosition(this._DialogAzimuth, this._DialogElevation, dist);
        }
    }, {
        key: 'setDialogAzimuthFromGui',
        value: function setDialogAzimuthFromGui(theSlider) {

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

            this.setDialogAzimuth(value);

            return Math.round(value);
        }
    }, {
        key: 'setDialogElevationFromGui',
        value: function setDialogElevationFromGui(theSlider) {
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

            this.setDialogElevation(value);

            return Math.round(value);
        }
    }, {
        key: 'setDialogDistanceFromGui',
        value: function setDialogDistanceFromGui(theSlider) {
            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = 0.5;
            var maxValue = 10;

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.setDialogDistance(value);

            return value;
        }

        /**
         * Returns the position of the additionnal mono dialog     
         * @return {array}
         *
         * @details The values are expressed with Spat4 navigational coordinates
         */

    }, {
        key: 'getDialogPosition',
        value: function getDialogPosition() {
            return [this._DialogAzimuth, this._DialogElevation, this._DialogDistance];
        }

        //==============================================================================

    }, {
        key: '_updateDialogPosition',
        value: function _updateDialogPosition() {

            var sourceIndex = this._getSourceIndexForDialog();

            if (sourceIndex >= 0) {

                /// convert to SOFA spherical coordinate
                var sofaAzim = -1. * this._DialogAzimuth;
                var sofaElev = this._DialogElevation;
                var sofaDist = 1.; /// fow now, the distance is not take into account

                var sofaPos = [sofaAzim, sofaElev, sofaDist];

                if (typeof this._virtualSpeakers._binauralPanner !== 'undefined') {
                    this._virtualSpeakers._binauralPanner.setSourcePositionByIndex(sourceIndex, sofaPos);
                    this._virtualSpeakers._binauralPanner.update();

                    /// now, apply a simple gain to attenuate according to distance
                    var drop = ObjectSpatialiserAndMixer.distanceToDrop(this._DialogDistance);
                    var dropLin = _utils2.default.dB2lin(drop);

                    this._virtualSpeakers.setGainForVirtualSource(sourceIndex, dropLin);
                }
            } else {
                /// there is no dialog stream
            }
        }

        //==============================================================================
        /**
         * The binaural processor handles up to 10 sources, considering all the streams.
         * This function returns the index of the source which corresponds to the dialog
         * (that needs to be spatialized)
         * Returns -1 if there is no dialog
         */

    }, {
        key: '_getSourceIndexForDialog',
        value: function _getSourceIndexForDialog() {

            /// retrieves the AudioStreamDescriptionCollection
            /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
            var asdc = this._audioStreamDescriptionCollection.streams;

            var sourceIndex = 0;

            /// go through all the streams
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = asdc[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var stream = _step2.value;

                    if (stream.dialog === true && stream.type === "Mono") {
                        return sourceIndex;
                    } else {
                        var numChannelsForThisStream = stream.numChannels;

                        sourceIndex += numChannelsForThisStream;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return -1;
        }

        /**
         * Computes a drop in dB, according to distance
         * @type {number} value : the distance in meters
         */

    }, {
        key: '_process',

        //==============================================================================
        /**
         * Process: "position" + "gain"
         * @todo: how to automatically set the gain, how to have RMS from "the other signal" here
         */
        value: function _process() {}
    }], [{
        key: 'distanceToDrop',
        value: function distanceToDrop(value) {

            var clampDist = _utils2.default.clamp(value, 0.5, 10.0);
            var refDist = 1.0;

            /// 6dB each time the distance is x2

            var drop = -6.0 * Math.log2(clampDist / refDist);

            return drop;
        }
    }]);

    return ObjectSpatialiserAndMixer;
}(_index2.default);

exports.default = ObjectSpatialiserAndMixer;