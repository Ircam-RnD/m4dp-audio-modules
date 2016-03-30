'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _multichannelgain = require('../dsp/multichannelgain.js');

var _multichannelgain2 = _interopRequireDefault(_multichannelgain);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       
 *   @brief      Implements the DialogEnhancement of M4DP
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var DialogEnhancement = function (_AbstractNode) {
    _inherits(DialogEnhancement, _AbstractNode);

    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.     
     */

    function DialogEnhancement(audioContext, audioStreamDescriptionCollection) {
        _classCallCheck(this, DialogEnhancement);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DialogEnhancement).call(this, audioContext, audioStreamDescriptionCollection));

        _this._mode = 1;
        _this._dialogGain = 0.0;
        _this._isBypass = true;

        _this._updateAudioGraph();
        return _this;
    }

    //==============================================================================
    /**
     * Enable or bypass the processor
     * @type {boolean}
     */


    _createClass(DialogEnhancement, [{
        key: 'activeStreamsChanged',


        //==============================================================================
        /**
         * Notification when the active stream(s) changes
         */
        value: function activeStreamsChanged() {
            this._updateAudioGraph();
        }

        //==============================================================================

    }, {
        key: 'setModeFromString',
        value: function setModeFromString(value) {

            if (value == 'Mode 1') {
                this.mode = 1;
            } else if (value == 'Mode 2') {
                this.mode = 2;
            } else if (value == 'Mode 3') {
                this.mode = 3;
            } else {
                throw new Error("Invalid mode " + value);
            }
        }

        /**
         * Get Mode - value is 1, 2 or 3
         * @type {number}
         */

    }, {
        key: '_update',


        //==============================================================================
        value: function _update() {}

        //==============================================================================
        /**
         * Returns true if the streams are available for the current mode
         */

    }, {
        key: '_canProcessCurrentMode',
        value: function _canProcessCurrentMode() {

            var mode = this.mode;

            if (mode === 1) {

                /// ajustement total du niveau des dialogues en cas de fourniture séparée
                /// des éléments “dialogues seuls” et “ambiances, musiques et effets”
                if (this.hasActiveExtendedDialog === true && this.hasActiveExtendedAmbiance === true) {
                    return true;
                } else {
                    return false;
                }
            } else if (mode === 2) {
                /// not yet implemented
                return true;
            } else if (mode === 3) {
                /// not yet implemented
                return true;
            } else {
                throw new Error("Invalid mode " + value);
            }
        }

        //==============================================================================
        /**
         * Updates the connections of the audio graph
         */

    }, {
        key: '_updateAudioGraph',
        value: function _updateAudioGraph() {

            /// first of all, disconnect everything
            this._input.disconnect();

            if (this.bypass === true || this._canProcessCurrentMode() === false) {

                this._input.connect(this._output);
            } else {}

            this._update();
        }
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
    }, {
        key: 'hasActiveExtendedDialog',
        get: function get() {
            return this._audioStreamDescriptionCollection.hasActiveExtendedDialog;
        }
    }, {
        key: 'channelIndexForExtendedDialog',
        get: function get() {
            return this._audioStreamDescriptionCollection.channelIndexForExtendedDialog;
        }
    }, {
        key: 'hasActiveExtendedAmbiance',
        get: function get() {
            return this._audioStreamDescriptionCollection.hasActiveExtendedAmbiance;
        }

        //==============================================================================
        /**
         * Set Mode - value is 1, 2 or 3
         * @type {number}
         */

    }, {
        key: 'mode',
        set: function set(value) {

            if (value < 1 || value > 3) {
                throw new Error("Invalid mode " + value);
            }

            if (value != this._mode) {

                // @todo error in some mode: eg. mode 1 and no dialog => "impossible"
                // error mode 2 et pas de 5.0 ou 5.1
                // error mode 3 et pas de stéréo
                this._mode = value;

                this._updateAudioGraph();
            }
        },
        get: function get() {
            return this._mode;
        }

        //==============================================================================
        /**
         * Set dialogGain
         * @type {number}
         * @todo give range of accepted values
         */

    }, {
        key: 'dialogGain',
        set: function set(value) {

            this._dialogGain = value;

            this._update();
        }
        /**
         * Get dialogGain
         * @type {number}
         * @todo give range of accepted values
         */
        ,
        get: function get() {
            return this._dialogGain;
        }
    }]);

    return DialogEnhancement;
}(_index2.default);

exports.default = DialogEnhancement;