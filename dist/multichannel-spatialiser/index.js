'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _headphoneequalization = require('../dsp/headphoneequalization.js');

var _headphoneequalization2 = _interopRequireDefault(_headphoneequalization);

var _utils = require('../core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

var _transaural = require('../dsp/transaural.js');

var _routing = require('../multichannel-spatialiser/routing.js');

var _routing2 = _interopRequireDefault(_routing);

var _virtualspeakers = require('../dsp/virtualspeakers.js');

var _virtualspeakers2 = _interopRequireDefault(_virtualspeakers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       
 *   @brief      Implements the MultichannelSpatialiser of M4DP
 *   @author     Thibaut Carpentier, Samuel Goldszmidt
 *   @date       01/2016
 *
 */
/************************************************************************************/

var MultichannelSpatialiser = function (_AbstractNode) {
    _inherits(MultichannelSpatialiser, _AbstractNode);

    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
     * @param {string} outputType - output type 'binaural' or 'transaural' or 'multichannel'     
     * @param {string} headphoneEqPresetName - the name of the headphone equalization preset (they are hard-coded) 
     * @param {number} offsetGain - the offset gain (expressed in dB)
     * @param {number} listenerYaw - yaw angle in degrees
     */

    function MultichannelSpatialiser(audioContext) {
        var audioStreamDescriptionCollection = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
        var outputType = arguments.length <= 2 || arguments[2] === undefined ? 'binaural' : arguments[2];
        var headphoneEqPresetName = arguments.length <= 3 || arguments[3] === undefined ? 'none' : arguments[3];
        var offsetGain = arguments.length <= 4 || arguments[4] === undefined ? 0.0 : arguments[4];
        var listenerYaw = arguments.length <= 5 || arguments[5] === undefined ? 0.0 : arguments[5];

        _classCallCheck(this, MultichannelSpatialiser);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MultichannelSpatialiser).call(this, audioContext, audioStreamDescriptionCollection));

        _this._headphonesEqualizationNode = new _headphoneequalization2.default(audioContext);
        _this._transauralNode = new _transaural.TransauralShufflerNode(audioContext);
        _this._discreteRouting = new _routing2.default(audioContext, audioStreamDescriptionCollection);
        _this._virtualSpeakers = new _virtualspeakers2.default(audioContext, audioStreamDescriptionCollection);

        /// creates a gain Node. This node is used to process the so-called 'offset gain'
        _this._gainNode = audioContext.createGain();

        /// set the offset gain
        _this.offsetGain = offsetGain;

        /// loads the proper headphone equalization preset
        _this.eqPreset = headphoneEqPresetName;

        /// set the output type (this will create the audio graph)
        _this.outputType = outputType;

        /// sets the listener yaw
        _this.listenerYaw = listenerYaw;
        return _this;
    }

    //==============================================================================
    /**
     * Load a new HRTF from a given URL
     * @type {string} url
     */

    _createClass(MultichannelSpatialiser, [{
        key: 'loadHrtfSet',
        value: function loadHrtfSet(url) {
            return this._virtualSpeakers.loadHrtfSet(url);
        }

        //==============================================================================
        /**
         * Set outputType: 'binaural' or 'transaural' or 'multichannel'
         * @type {string}
         */

    }, {
        key: 'activeStreamsChanged',

        /**
         * Notification when the active stream(s) changes
         */
        value: function activeStreamsChanged() {}
        /// nothing to do, for the moment

        //==============================================================================
        /**
         * Updates the connections of the audio graph
         */

    }, {
        key: '_updateAudioGraph',
        value: function _updateAudioGraph() {

            this._updateGainOffset();

            this._disconnectEverything();

            if (this.isInBinauralMode() === true) {

                /// binaural + headphone EQ + gain offset
                this._input.connect(this._virtualSpeakers._input);
                this._virtualSpeakers.connect(this._headphonesEqualizationNode._input);
                this._headphonesEqualizationNode.connect(this._gainNode);
                this._gainNode.connect(this._output);
            } else if (this.isInTransauralMode() === true) {

                /// binaural + transaural + gain offset
                this._input.connect(this._virtualSpeakers._input);
                this._virtualSpeakers.connect(this._transauralNode._input);
                this._transauralNode.connect(this._gainNode);
                this._gainNode.connect(this._output);
            } else if (this.isInMultichannelMode() === true) {

                /// discrete routing in the multichannel mode
                this._input.connect(this._discreteRouting._input);
                this._discreteRouting.connect(this._gainNode);
                this._gainNode.connect(this._output);
            } else {
                throw new Error("Pas normal!");
            }
        }

        //==============================================================================
        /**
         * Disconnect the whole audio graph
         */

    }, {
        key: '_disconnectEverything',
        value: function _disconnectEverything() {

            this._input.disconnect();
            this._virtualSpeakers.disconnect();
            this._headphonesEqualizationNode.disconnect();
            this._discreteRouting.disconnect();
            this._transauralNode.disconnect();
            this._gainNode.disconnect();
        }

        //==============================================================================
        /**
         * Updates the gainNode which actually process the so-called 'offset gain'
         */

    }, {
        key: '_updateGainOffset',
        value: function _updateGainOffset() {

            /// the so-called 'offset gain' is only applied for transaural or binaural
            if (this.isInBinauralMode() === true || this.isInTransauralMode() === true) {
                var gainIndB = this.offsetGain;
                var gainLinear = _utils2.default.dB2lin(gainIndB);

                this._gainNode.gain.value = gainLinear;
            } else {
                /// this is the multichannel mode; no gain offset applied
                this._gainNode.gain.value = 1.0;
            }
        }

        //==============================================================================
        /**
         * Returns true if we are currently in binaural mode
         */

    }, {
        key: 'isInBinauralMode',
        value: function isInBinauralMode() {
            return this.outputType === 'binaural' ? true : false;
        }

        /**
         * Returns true if we are currently in transaural mode
         */

    }, {
        key: 'isInTransauralMode',
        value: function isInTransauralMode() {
            return this.outputType === 'transaural' ? true : false;
        }

        /**
         * Returns true if we are currently in multichannel mode
         */

    }, {
        key: 'isInMultichannelMode',
        value: function isInMultichannelMode() {
            return this.outputType === 'multichannel' ? true : false;
        }

        //==============================================================================
        /**
         * Loads a new headphones equalization preset
         * @type {string} presetName : the name of the preset (they are hard-coded) 
         */

    }, {
        key: 'bypassHeadphoneEqualization',

        /**
         * Enable or bypass the headphone equalization
         * @type {boolean}
         */
        value: function bypassHeadphoneEqualization(value) {
            this._headphonesEqualizationNode.bypass = value;
        }

        //==============================================================================
        /**
         * Set the offset gain (expressed in dB)
         * (un gain d’offset afin de maintenir un niveau subjectif apres l’enclenchement du process de spatialisation)
         * @type {number} value
         */

    }, {
        key: 'outputType',
        set: function set(value) {

            if (value === 'binaural' || value === 'transaural' || value === 'multichannel') {

                console.log("MultichannelSpatialiser switching to mode " + value);

                this._outputType = value;

                this._updateAudioGraph();
            } else {
                throw new Error("Invalid output type " + value);
            }
        }
        /**
         * Returns the current output type: 'binaural' or 'transaural' or 'multichannel'
         * @type {string}
         */
        ,
        get: function get() {
            return this._outputType;
        }
    }, {
        key: 'eqPreset',
        set: function set(presetName) {
            this._headphonesEqualizationNode.eqPreset = presetName;
        }

        /**
         * Returns the name of the current headphones equalization preset
         * @type {string}
         */
        ,
        get: function get() {
            return this._headphonesEqualizationNode.eqPreset;
        }
    }, {
        key: 'offsetGain',
        set: function set(value) {

            /// precaution : the value in clipped in the [-12 +12] dB range
            this._offsetGain = _utils2.default.clamp(value, -12, 12);

            /// update the DSP processor
            this._updateGainOffset();
        }

        /**
         * Returns the offset gain (expressed in dB)
         * @type {number}
         */
        ,
        get: function get() {
            return this._offsetGain;
        }

        //==============================================================================
        /**
         * Set listenerYaw
         * @type {number} yaw angle in degrees
         */

    }, {
        key: 'listenerYaw',
        set: function set(value) {
            this._virtualSpeakers.listenerYaw = value;
        }
        /**
         * Get listenerYaw
         * @type {number} yaw angle in degrees
         */
        ,
        get: function get() {
            return this._virtualSpeakers.listenerYaw;
        }
    }]);

    return MultichannelSpatialiser;
}(_index2.default);

exports.default = MultichannelSpatialiser;