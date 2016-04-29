'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _multichannelgain = require('../dsp/multichannelgain.js');

var _multichannelgain2 = _interopRequireDefault(_multichannelgain);

var _utils = require('../core/utils.js');

var _centerenhancement = require('../dsp/centerenhancement.js');

var _centerenhancement2 = _interopRequireDefault(_centerenhancement);

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

//import utilities from '../core/utils.js';


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

        _this._mode = 0;
        _this._balance = 100.0;
        _this._isBypass = false;
        _this._processor1 = new DialogEnhancementProcessorMode1(audioContext, audioStreamDescriptionCollection);
        _this._processor2 = new DialogEnhancementProcessorMode2(audioContext, audioStreamDescriptionCollection);
        _this._processor3 = new DialogEnhancementProcessorMode3(audioContext, audioStreamDescriptionCollection);

        _this._updateAudioGraph();
        return _this;
    }

    //==============================================================================


    _createClass(DialogEnhancement, [{
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
         */
        value: function activeStreamsChanged() {

            this._chooseAppropriateMode();

            this._updateAudioGraph();
        }

        //==============================================================================

    }, {
        key: '_chooseAppropriateMode',


        //==============================================================================
        value: function _chooseAppropriateMode() {

            var mode = 0; ///< 0 corresponds to bypass

            if (this.hasActiveExtendedDialog === true && this.hasActiveExtendedAmbiance === true) {
                mode = 1;
            } else if (this.hasActiveMultiWithDialog === true) {
                mode = 2;
            } else if (this.hasActiveStereoWithDialog === true) {
                mode = 3;
            }

            /// mode 0 ==> bypass
            /// mode 1 ==> balance entre le Extended dialog et le Extended Ambiance
            /// le flux main est inchange
            /// mode 2 ==> on agit sur la voie centrale du Main, s'il s'agit d'un 5.1 ou 5.0
            /// mode 3 ==> lorsqu'on a juste un flux stereo

            this.mode = mode;
        }

        //==============================================================================
        /**
         * Set Mode - value is 1, 2 or 3
         * @type {number}
         */

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
         * Get Mode - value is 0, 1, 2 or 3
         * @type {number}
         */

    }, {
        key: 'setBalanceFromGui',
        value: function setBalanceFromGui(theSlider) {
            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = 0;
            var maxValue = 100;

            /// scale from GUI to DSP
            var value = (0, _utils.scale)(valueFader, minFader, maxFader, minValue, maxValue);

            this.balance = value;

            return value;
        }
    }, {
        key: 'getBalanceFromGui',
        value: function getBalanceFromGui(theSlider) {

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = 0;
            var maxValue = 100;

            var actualValue = this.balance;

            /// scale from DSP to GUI
            var value = M4DPAudioModules.utilities.scale(actualValue, minValue, maxValue, minFader, maxFader);

            return value;
        }

        //==============================================================================

    }, {
        key: '_update',
        value: function _update() {

            this._processor1.balance = this.balance;
            this._processor2.balance = this.balance;
            this._processor3.balance = this.balance;
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
            this._processor1.disconnect();
            this._processor2.disconnect();

            var mode = this.mode;

            if (this.bypass === true || mode === 0) {

                this._input.connect(this._output);
            } else {

                if (mode === 1) {
                    this._input.connect(this._processor1._input);
                    this._processor1.connect(this._output);
                } else if (mode === 2) {
                    this._input.connect(this._processor2._input);
                    this._processor2.connect(this._output);
                } else if (mode === 3) {
                    this._input.connect(this._processor3._input);
                    this._processor3.connect(this._output);
                }
            }

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
    }, {
        key: 'hasActiveMultiWithDialog',
        get: function get() {
            return this._audioStreamDescriptionCollection.hasActiveMultiWithDialog;
        }
    }, {
        key: 'hasActiveStereoWithDialog',
        get: function get() {
            return this._audioStreamDescriptionCollection.hasActiveStereoWithDialog;
        }
    }, {
        key: 'mode',
        set: function set(value) {

            console.log('DialogEnhancement to mode ' + value);

            if (value < 0 || value > 3) {
                throw new Error("Invalid mode " + value);
            }

            if (value != this._mode) {

                this._mode = value;
                this._updateAudioGraph();
            }
        },
        get: function get() {
            return this._mode;
        }

        //==============================================================================       
        /**
         * Sets the balance (in 0 - 100 %) between dialogs and ambiance
         *      
         */

    }, {
        key: 'balance',
        set: function set(value) {

            this._balance = value;

            this._update();
        }

        /**
         * Returns the balance (in 0 - 100 %) between dialogs and ambiance
         * @type {number}     
         */
        ,
        get: function get() {
            return this._balance;
        }
    }]);

    return DialogEnhancement;
}(_index2.default);

exports.default = DialogEnhancement;

var DialogEnhancementProcessorMode1 = function (_AbstractNode2) {
    _inherits(DialogEnhancementProcessorMode1, _AbstractNode2);

    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.     
     */

    function DialogEnhancementProcessorMode1(audioContext, audioStreamDescriptionCollection) {
        _classCallCheck(this, DialogEnhancementProcessorMode1);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(DialogEnhancementProcessorMode1).call(this, audioContext, audioStreamDescriptionCollection));

        _this2._balance = 100;

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        var totalNumberOfChannels_ = _this2.getTotalNumberOfChannels();

        _this2._gainsNode = new _multichannelgain2.default(audioContext, totalNumberOfChannels_);

        _this2._updateAudioGraph();
        return _this2;
    }

    //==============================================================================


    _createClass(DialogEnhancementProcessorMode1, [{
        key: 'getTotalNumberOfChannels',
        value: function getTotalNumberOfChannels() {
            return this._audioStreamDescriptionCollection.totalNumberOfChannels;
        }

        //==============================================================================
        /**
         * Returns the current number of channels
         */

    }, {
        key: 'getNumChannels',
        value: function getNumChannels() {
            return this._gainsNode.getNumChannels();
        }

        //==============================================================================       
        /**
         * Sets the balance (in 0 - 100 %) between dialogs and ambiance
         *      
         */

    }, {
        key: 'isChannelForExtendedDialog',


        //==============================================================================
        /**
         * Returns true if this channel index corresponds to the extended dialog
         *      
         */
        value: function isChannelForExtendedDialog(channelIndex) {

            return this._audioStreamDescriptionCollection.isChannelForExtendedDialog(channelIndex);
        }

        //==============================================================================
        /**
         * Returns true if this channel index corresponds to the extended ambiance
         *      
         */

    }, {
        key: 'isChannelForExtendedAmbiance',
        value: function isChannelForExtendedAmbiance(channelIndex) {
            return this._audioStreamDescriptionCollection.isChannelForExtendedAmbiance(channelIndex);
        }

        //==============================================================================
        /**
         * Updates the gains for each channel
         *      
         */

    }, {
        key: '_update',
        value: function _update() {

            var gainForDialogs = (0, _utils.scale)(this.balance, 0., 100., 0., 1.);
            var gainForAmbiance = 1.0 - gainForDialogs;

            for (var k = 0; k < this.getNumChannels(); k++) {

                if (this.isChannelForExtendedDialog(k) === true) {
                    this._gainsNode.setGain(k, gainForDialogs);
                } else if (this.isChannelForExtendedAmbiance(k) === true) {
                    this._gainsNode.setGain(k, gainForAmbiance);
                } else {
                    this._gainsNode.setGain(k, 1.0);
                }
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
            this._gainsNode.disconnect();

            this._input.connect(this._gainsNode._input);
            this._gainsNode.connect(this._output);

            this._update();
        }
    }, {
        key: 'balance',
        set: function set(value) {

            /// 100% --> only the dialogs
            /// 0% --> only the ambiance

            var percent = (0, _utils.clamp)(value, 0., 100.);

            this._balance = percent;

            this._update();
        },
        get: function get() {
            return this._balance;
        }
    }]);

    return DialogEnhancementProcessorMode1;
}(_index2.default);

var DialogEnhancementProcessorMode2 = function (_AbstractNode3) {
    _inherits(DialogEnhancementProcessorMode2, _AbstractNode3);

    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.     
     */

    function DialogEnhancementProcessorMode2(audioContext, audioStreamDescriptionCollection) {
        _classCallCheck(this, DialogEnhancementProcessorMode2);

        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(DialogEnhancementProcessorMode2).call(this, audioContext, audioStreamDescriptionCollection));

        _this3._balance = 100;

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        var totalNumberOfChannels_ = _this3.getTotalNumberOfChannels();

        _this3._gainsNode = new _multichannelgain2.default(audioContext, totalNumberOfChannels_);

        _this3._updateAudioGraph();
        return _this3;
    }

    //==============================================================================


    _createClass(DialogEnhancementProcessorMode2, [{
        key: 'getTotalNumberOfChannels',
        value: function getTotalNumberOfChannels() {
            return this._audioStreamDescriptionCollection.totalNumberOfChannels;
        }

        //==============================================================================
        /**
         * Returns the current number of channels
         */

    }, {
        key: 'getNumChannels',
        value: function getNumChannels() {
            return this._gainsNode.getNumChannels();
        }

        //==============================================================================       
        /**
         * Sets the balance (in 0 - 100 %) between dialogs and ambiance
         *      
         */

    }, {
        key: 'isChannelCenter',


        //==============================================================================
        /**
         * Returns true if this channel index corresponds to a center channel (of 5.0 or 5.1 stream)
         *      
         */
        value: function isChannelCenter(channelIndex) {
            return this._audioStreamDescriptionCollection.isChannelCenter(channelIndex);
        }

        //==============================================================================
        /**
         * Updates the gains for each channel
         *      
         */

    }, {
        key: '_update',
        value: function _update() {

            var balanceIndB = (0, _utils.scale)(this.balance, 0., 100., -6., 6.);

            var gainForDialogs = (0, _utils.dB2lin)(balanceIndB);

            for (var k = 0; k < this.getNumChannels(); k++) {

                if (this.isChannelCenter(k) === true) {
                    this._gainsNode.setGain(k, gainForDialogs);
                } else {
                    this._gainsNode.setGain(k, 1.0);
                }
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
            this._gainsNode.disconnect();

            this._input.connect(this._gainsNode._input);
            this._gainsNode.connect(this._output);

            this._update();
        }
    }, {
        key: 'balance',
        set: function set(value) {

            /// 100% --> +6 dB for the dialog
            /// 0% --> -6 dB for the dialog

            var percent = (0, _utils.clamp)(value, 0., 100.);

            this._balance = percent;

            this._update();
        },
        get: function get() {
            return this._balance;
        }
    }]);

    return DialogEnhancementProcessorMode2;
}(_index2.default);

var DialogEnhancementProcessorMode3 = function (_AbstractNode4) {
    _inherits(DialogEnhancementProcessorMode3, _AbstractNode4);

    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.     
     */

    function DialogEnhancementProcessorMode3(audioContext, audioStreamDescriptionCollection) {
        _classCallCheck(this, DialogEnhancementProcessorMode3);

        var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(DialogEnhancementProcessorMode3).call(this, audioContext, audioStreamDescriptionCollection));

        _this4._balance = 100;

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        var totalNumberOfChannels_ = _this4.getTotalNumberOfChannels();

        _this4._channelSplitterNode = _this4._audioContext.createChannelSplitter(totalNumberOfChannels_);
        _this4._channelMergerNode = _this4._audioContext.createChannelMerger(totalNumberOfChannels_);

        _this4._input.connect(_this4._channelSplitterNode);

        _this4._channelSplitter2 = _this4._audioContext.createChannelSplitter(2);
        _this4._channelMerger2 = _this4._audioContext.createChannelMerger(2);

        ///
        _this4._centerEnhancement = new _centerenhancement2.default(audioContext);

        {
            _this4._channelSplitterNode.connect(_this4._channelMerger2, 0, 0);
            _this4._channelSplitterNode.connect(_this4._channelMerger2, 1, 1);

            _this4._channelMerger2.connect(_this4._centerEnhancement._input);
            _this4._centerEnhancement.connect(_this4._channelSplitter2);

            _this4._channelSplitter2.connect(_this4._channelMergerNode, 0, 0);
            _this4._channelSplitter2.connect(_this4._channelMergerNode, 1, 1);
        }

        for (var k = 2; k < totalNumberOfChannels_; k++) {
            _this4._channelSplitterNode.connect(_this4._channelMergerNode, k, k);
        }

        _this4._channelMergerNode.connect(_this4._output);

        return _this4;
    }

    //==============================================================================


    _createClass(DialogEnhancementProcessorMode3, [{
        key: 'getTotalNumberOfChannels',
        value: function getTotalNumberOfChannels() {
            return this._audioStreamDescriptionCollection.totalNumberOfChannels;
        }

        //==============================================================================       
        /**
         * Sets the balance (in 0 - 100 %) between dialogs and ambiance
         *      
         */

    }, {
        key: '_update',


        //==============================================================================
        /**
         * Updates the gains for each channel
         *      
         */
        value: function _update() {

            var balanceIndB = (0, _utils.scale)(this.balance, 0., 100., 0., 12.);

            this._centerEnhancement.gain = balanceIndB;
        }
    }, {
        key: 'balance',
        set: function set(value) {

            /// 100% --> +6 dB for the dialog
            /// 0% --> -6 dB for the dialog

            var percent = (0, _utils.clamp)(value, 0., 100.);

            this._balance = percent;

            this._update();
        },
        get: function get() {
            return this._balance;
        }
    }]);

    return DialogEnhancementProcessorMode3;
}(_index2.default);