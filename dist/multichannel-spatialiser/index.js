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
     * @param {binaural.HrtfSet} : HRTF set to load
     * @param {string} headphoneEqPresetName - the name of the headphone equalization preset (they are hard-coded) 
     * @param {number} offsetGain - the offset gain (expressed in dB)
     * @param {number} listeningAxis - angle? @todo value to be defined
     */

    function MultichannelSpatialiser(audioContext) {
        var audioStreamDescriptionCollection = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
        var outputType = arguments.length <= 2 || arguments[2] === undefined ? 'binaural' : arguments[2];
        var hrtf = arguments.length <= 3 || arguments[3] === undefined ? undefined : arguments[3];
        var headphoneEqPresetName = arguments.length <= 4 || arguments[4] === undefined ? 'none' : arguments[4];
        var offsetGain = arguments.length <= 5 || arguments[5] === undefined ? 0.0 : arguments[5];
        var listeningAxis = arguments.length <= 6 || arguments[6] === undefined ? undefined : arguments[6];

        _classCallCheck(this, MultichannelSpatialiser);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MultichannelSpatialiser).call(this, audioContext, audioStreamDescriptionCollection));

        _this._hrtf = hrtf;
        _this._headphonesEqualizationNode = new _headphoneequalization2.default(audioContext);

        _this._listeningAxis = listeningAxis;

        /// creates a gain Node. This node is used to process the so-called 'offset gain'
        _this._gainNode = audioContext.createGain();

        ///@todo : connect the gainNode where it should be

        /// set the offset gain
        _this.offsetGain = offsetGain;

        /// loads the proper headphone equalization preset
        _this.eqPreset = headphoneEqPresetName;

        /// set the output type
        _this.outputType = outputType;
        return _this;
    }

    //==============================================================================
    /**
     * Set outputType: 'binaural' or 'transaural' or 'multichannel'
     * @type {string}
     */

    _createClass(MultichannelSpatialiser, [{
        key: '_updateAudioGraph',

        //==============================================================================
        /**
         * Updates the connections of the audio graph
         */
        value: function _updateAudioGraph() {

            this._updateGainOffset();

            if (this.isInBinauralMode() === true) {} else if (this.isInTransauralMode() === true) {} else if (this.isInMultichannelMode() === true) {} else {
                throw new Error("Pas normal!");
            }

            ///@todo a completer
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
                var gainIndB = this.offsetGain();
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
         * Set audio streams description (json)
         * @type {AudioStreamDescriptionCollection}
         */

    }, {
        key: 'outputType',
        set: function set(value) {

            if (value === 'binaural' || value === 'transaural' || value === 'multichannel') {

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
        key: 'audioStreamDescriptionCollection',
        set: function set(value) {}
        /**
         * Get audio streams description
         * @type {AudioStreamDescriptionCollection}
         */
        ,
        get: function get() {
            return _audioStreamDescriptionCollection;
        }

        //==============================================================================
        /**
         * Loads a set of HRTF
         * @type {binaural.HrtfSet} : cf the binaural module
         */

    }, {
        key: 'hrtf',
        set: function set(value) {
            this._hrtf = value;
        }

        ///@todo simplified function loadHrtfFrom( subjectNumber )
        /// using the current sampling rate
        /// --> creates a new HrtfSet and load it

        /**
         * Returns the current hrtf
         * @type {HRTF}
         */
        ,
        get: function get() {
            return this._hrtf;
        }

        //==============================================================================
        /**
         * Loads a new headphones equalization preset
         * @type {string} presetName : the name of the preset (they are hard-coded) 
         */

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

        //==============================================================================
        /**
         * Set the offset gain (expressed in dB)
         * (un gain d’offset afin de maintenir un niveau subjectif après l’enclenchement du process de spatialisation)
         * @todo range
         * @type {number} value
         */

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
         * Set listeningAxis
         * @todo value type? angle?
         * @type {number}
         */

    }, {
        key: 'listeningAxis',
        set: function set(value) {
            this._listeningAxis = value;
        }
        /**
         * Get listeningAxis
         * @type {number}
         */
        ,
        get: function get() {
            return this._listeningAxis;
        }
    }]);

    return MultichannelSpatialiser;
}(_index2.default);

exports.default = MultichannelSpatialiser;