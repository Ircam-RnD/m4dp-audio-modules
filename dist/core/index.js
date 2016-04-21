"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//==============================================================================
/**
 * Template for other audio nodes: set the audioContext reference and provide connect/disconnect methods for the audio node.
 */

var AbstractNode = function () {
    /**
     * AbstractNode constructor
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection instance.
     */

    function AbstractNode(audioContext) {
        var audioStreamDescriptionCollection = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

        _classCallCheck(this, AbstractNode);

        this._audioContext = audioContext;
        this._audioStreamDescriptionCollection = audioStreamDescriptionCollection;
        /**
         * @type {AudioNode}
         */
        this._input = this._audioContext.createGain();
        this._output = this._audioContext.createGain();
    }

    //==============================================================================
    /**
     * Connect the audio node
     * @param {AudioNode} node - an AudioNode to connect to.
     */


    _createClass(AbstractNode, [{
        key: "connect",
        value: function connect(node) {
            this._output.connect(node);
        }
        /**
         * Disconnect the audio node     
         */

    }, {
        key: "disconnect",
        value: function disconnect() {
            this._output.disconnect();
        }

        //==============================================================================
        /**
         * Returns the current sample rate of the audio context
         */

    }, {
        key: "getCurrentSampleRate",
        value: function getCurrentSampleRate() {
            return this._audioContext.sampleRate;
        }
    }]);

    return AbstractNode;
}();

//==============================================================================
/**
 * Container for AudioStreamDescription
 */


exports.default = AbstractNode;

var AudioStreamDescriptionCollection = exports.AudioStreamDescriptionCollection = function () {
    /**
     * AudioStreamDescriptionCollection constructor
     * @param {AudioStreamDescription[]} streams - array of AudioStreamDescription
     */

    function AudioStreamDescriptionCollection(streams) {
        _classCallCheck(this, AudioStreamDescriptionCollection);

        this._streams = streams;
    }

    //==============================================================================
    /**
     * Set the stream description collection
     * @type {AudioStreamDescription[]}
     */


    _createClass(AudioStreamDescriptionCollection, [{
        key: "activeStreamsChanged",


        //==============================================================================
        /**
         * Notification when the active stream(s) changes
         */
        value: function activeStreamsChanged() {}
        /// nothing to do in the base class


        /**
         * Notification when the trim of stream(s) changes
         */

    }, {
        key: "streamsTrimChanged",
        value: function streamsTrimChanged() {}
        /// nothing to do in the base class  


        //==============================================================================
        /**
         * Get the current dialog audio stream description of the collection
         * @type {AudioStreamDescription}
         */

    }, {
        key: "isChannelForExtendedDialog",


        //==============================================================================
        /**
         * Returns true if this channel index corresponds to the extended dialog
         *      
         */
        value: function isChannelForExtendedDialog(channelIndex) {

            if (channelIndex < 0 || channelIndex >= this.totalNumberOfChannels) {
                throw new Error("Invalid channel index : " + channelIndex);
            }

            var index = 0;

            /// go through all the streams
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._streams[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var stream = _step.value;


                    var numChannelsForThisStream = stream.numChannels;

                    var isExtendedDialog = stream.isExtendedDialog;

                    for (var k = 0; k < numChannelsForThisStream; k++) {

                        if (channelIndex === index && isExtendedDialog === true) {
                            return true;
                        }

                        index++;
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

            return false;
        }

        //==============================================================================
        /**
         * Returns true if this channel index corresponds to the extended ambiance
         *      
         */

    }, {
        key: "isChannelForExtendedAmbiance",
        value: function isChannelForExtendedAmbiance(channelIndex) {

            if (channelIndex < 0 || channelIndex >= this.totalNumberOfChannels) {
                throw new Error("Invalid channel index : " + channelIndex);
            }

            var index = 0;

            /// go through all the streams
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this._streams[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var stream = _step2.value;


                    var numChannelsForThisStream = stream.numChannels;

                    var isExtendedAmbiance = stream.isExtendedAmbiance;

                    for (var k = 0; k < numChannelsForThisStream; k++) {

                        if (channelIndex === index && isExtendedAmbiance === true) {
                            return true;
                        }

                        index++;
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

            return false;
        }
    }, {
        key: "streams",
        set: function set(streams) {
            this._streams = streams;
        }
        /**
         * Get the stream description collection
         * @type {AudioStreamDescription[]}
         */
        ,
        get: function get() {
            return this._streams;
        }

        /**
         * Returns the number of streams in the collection
         */

    }, {
        key: "numStreams",
        get: function get() {
            return this._streams.length;
        }

        //==============================================================================
        /**
         * Returns the total number of channels (i.e. for all the streams)
         */

    }, {
        key: "totalNumberOfChannels",
        get: function get() {
            var totalNumberOfChannels_ = 0;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this._streams[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var stream = _step3.value;

                    totalNumberOfChannels_ += stream.numChannels;
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return totalNumberOfChannels_;
        }

        //==============================================================================
        /**
         * Get the current active audio stream descriptions of the collection
         * @type {AudioStreamDescription[]}
         */

    }, {
        key: "actives",
        get: function get() {
            var actives = [];
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this._streams[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var stream = _step4.value;

                    if (stream.active) {
                        actives.push(stream);
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            return actives;
        }

        /**
         * Returns true if at least one stream is currently active
         * @type {boolean}
         */

    }, {
        key: "hasActiveStream",
        get: function get() {
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = this._streams[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var stream = _step5.value;

                    if (stream.active === true) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            return false;
        }
    }, {
        key: "extendedDialog",
        get: function get() {
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = this._streams[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var stream = _step6.value;

                    if (stream.isExtendedDialog === true) {
                        return stream;
                    }
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            return undefined;
        }

        /**
         * Returns true if there is at least one dialog among all the streams     
         */

    }, {
        key: "hasExtendedDialog",
        get: function get() {
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = this._streams[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var stream = _step7.value;

                    if (stream.isExtendedDialog === true) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }

            return false;
        }

        /**
         * Returns true if there is at least one dialog among all the streams     
         */

    }, {
        key: "hasActiveExtendedDialog",
        get: function get() {
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = this._streams[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var stream = _step8.value;

                    if (stream.isExtendedDialog === true && stream.active === true) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                        _iterator8.return();
                    }
                } finally {
                    if (_didIteratorError8) {
                        throw _iteratorError8;
                    }
                }
            }

            return false;
        }

        //==============================================================================
        /**
         * Returns true if there is at least one ambiance among all the streams     
         */

    }, {
        key: "hasExtendedAmbiance",
        get: function get() {
            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
                for (var _iterator9 = this._streams[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                    var stream = _step9.value;

                    if (stream.isExtendedAmbiance === true) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError9 = true;
                _iteratorError9 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion9 && _iterator9.return) {
                        _iterator9.return();
                    }
                } finally {
                    if (_didIteratorError9) {
                        throw _iteratorError9;
                    }
                }
            }

            return false;
        }

        /**
         * Returns true if there is at least one ambiance among all the streams     
         */

    }, {
        key: "hasActiveExtendedAmbiance",
        get: function get() {
            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
                for (var _iterator10 = this._streams[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                    var stream = _step10.value;

                    if (stream.isExtendedAmbiance === true && stream.active === true) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError10 = true;
                _iteratorError10 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion10 && _iterator10.return) {
                        _iterator10.return();
                    }
                } finally {
                    if (_didIteratorError10) {
                        throw _iteratorError10;
                    }
                }
            }

            return false;
        }

        //==============================================================================
        /**
         * Returns true if there is at least one commentary among all the streams     
         */

    }, {
        key: "hasExtendedCommentary",
        get: function get() {
            var _iteratorNormalCompletion11 = true;
            var _didIteratorError11 = false;
            var _iteratorError11 = undefined;

            try {
                for (var _iterator11 = this._streams[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                    var stream = _step11.value;

                    if (stream.isExtendedCommentary === true) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError11 = true;
                _iteratorError11 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion11 && _iterator11.return) {
                        _iterator11.return();
                    }
                } finally {
                    if (_didIteratorError11) {
                        throw _iteratorError11;
                    }
                }
            }

            return false;
        }

        /**
         * Returns true if there is at least one commentary among all the streams,
         * and if it is currently active     
         */

    }, {
        key: "hasActiveExtendedCommentary",
        get: function get() {
            var _iteratorNormalCompletion12 = true;
            var _didIteratorError12 = false;
            var _iteratorError12 = undefined;

            try {
                for (var _iterator12 = this._streams[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                    var stream = _step12.value;

                    if (stream.isExtendedCommentary === true && stream.active === true) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError12 = true;
                _iteratorError12 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion12 && _iterator12.return) {
                        _iterator12.return();
                    }
                } finally {
                    if (_didIteratorError12) {
                        throw _iteratorError12;
                    }
                }
            }

            return false;
        }

        //==============================================================================
        /**
         * This function returns the index of the source which corresponds to the mono commentary
         * 
         * Returns -1 if there is no commentary
         */

    }, {
        key: "channelIndexForExtendedCommentary",
        get: function get() {

            var channelIndex = 0;

            /// go through all the streams
            var _iteratorNormalCompletion13 = true;
            var _didIteratorError13 = false;
            var _iteratorError13 = undefined;

            try {
                for (var _iterator13 = this._streams[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                    var stream = _step13.value;


                    if (stream.isExtendedCommentary === true) {

                        if (stream.type !== "Mono") {
                            throw new Error("The commentary must be mono!");
                        }

                        return channelIndex;
                    } else {
                        var numChannelsForThisStream = stream.numChannels;

                        channelIndex += numChannelsForThisStream;
                    }
                }
            } catch (err) {
                _didIteratorError13 = true;
                _iteratorError13 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion13 && _iterator13.return) {
                        _iterator13.return();
                    }
                } finally {
                    if (_didIteratorError13) {
                        throw _iteratorError13;
                    }
                }
            }

            return -1;
        }

        //==============================================================================
        /**
         * This function returns the index of the source which corresponds to the mono dialog
         * 
         * Returns -1 if there is no commentary
         */

    }, {
        key: "channelIndexForExtendedDialog",
        get: function get() {

            var channelIndex = 0;

            /// go through all the streams
            var _iteratorNormalCompletion14 = true;
            var _didIteratorError14 = false;
            var _iteratorError14 = undefined;

            try {
                for (var _iterator14 = this._streams[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                    var stream = _step14.value;


                    if (stream.isExtendedDialog === true) {

                        if (stream.type !== "Mono") {
                            throw new Error("The commentary must be mono!");
                        }

                        return channelIndex;
                    } else {
                        var numChannelsForThisStream = stream.numChannels;

                        channelIndex += numChannelsForThisStream;
                    }
                }
            } catch (err) {
                _didIteratorError14 = true;
                _iteratorError14 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion14 && _iterator14.return) {
                        _iterator14.return();
                    }
                } finally {
                    if (_didIteratorError14) {
                        throw _iteratorError14;
                    }
                }
            }

            return -1;
        }
    }]);

    return AudioStreamDescriptionCollection;
}();

//==============================================================================
/**
 * AudioStreamDescription describes a stream.
 */


var AudioStreamDescription = exports.AudioStreamDescription = function () {
    /**
     * AudioStreamDescription constructor
     * @param {string} type - type.
     * @param {boolean} active - active.
     * @param {number} loudness - loudness.
     * @param {number} maxTruePeak - maxTruePeak.
     * @param {boolean} dialog - dialog.
     * @param {boolean} ambiance - ambiance.
     * @param {number} trim - input trim level (in dB)
     */

    function AudioStreamDescription(type) {
        var active = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
        var loudness = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];
        var maxTruePeak = arguments.length <= 3 || arguments[3] === undefined ? undefined : arguments[3];
        var dialog = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
        var ambiance = arguments.length <= 5 || arguments[5] === undefined ? false : arguments[5];
        var commentary = arguments.length <= 6 || arguments[6] === undefined ? false : arguments[6];

        _classCallCheck(this, AudioStreamDescription);

        this._type = type;
        this._active = active;
        this._loudness = loudness;
        this._maxTruePeak = maxTruePeak;
        this._dialog = dialog;
        this._ambiance = ambiance;
        this._commentary = commentary;
        this._trim = 0;
    }

    //==============================================================================
    /// if one of the value is NaN, this most likely means the stream was
    /// actually not in the EBU core.
    /// it should thus be considered as inactive   


    _createClass(AudioStreamDescription, [{
        key: "channelIsCenter",


        //==============================================================================
        /**
         * Returns true if the i-th channel corresponds to center
         * @type {int} channelIndex : index of the channel to query
         */
        value: function channelIsCenter(channelIndex) {

            if (channelIndex < 0 || channelIndex >= this.numChannels) {
                throw new Error("Invalid channel index : " + channelIndex);
            }

            if (this._type === "Mono") {
                return channelIndex === 0 ? true : false;
            } else if (this._type === "MultiWithoutLFE" || this._type === "MultiWithLFE") {
                return channelIndex === 2 ? true : false;
            } else {
                return false;
            }
        }

        /**
         * Returns true if the i-th channel corresponds to LFE
         * @type {int} channelIndex : index of the channel to query
         */

    }, {
        key: "channelIsLfe",
        value: function channelIsLfe(channelIndex) {

            if (channelIndex < 0 || channelIndex >= this.numChannels) {
                throw new Error("Invalid channel index : " + channelIndex);
            }

            if (this._type === "MultiWithLFE" && channelIndex === 3) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * Returns true if the i-th channel corresponds to LEFT
         * @type {int} channelIndex : index of the channel to query
         */

    }, {
        key: "channelIsLeft",
        value: function channelIsLeft(channelIndex) {

            if (channelIndex < 0 || channelIndex >= this.numChannels) {
                throw new Error("Invalid channel index : " + channelIndex);
            }

            var pos = this.channelPositions;

            return pos[channelIndex] === -30 ? true : false;
        }

        /**
         * Returns true if the i-th channel corresponds to RIGHT
         * @type {int} channelIndex : index of the channel to query
         */

    }, {
        key: "channelIsRight",
        value: function channelIsRight(channelIndex) {

            if (channelIndex < 0 || channelIndex >= this.numChannels) {
                throw new Error("Invalid channel index : " + channelIndex);
            }

            var pos = this.channelPositions;

            return pos[channelIndex] === +30 ? true : false;
        }

        /**
         * Returns true if the i-th channel corresponds to LS
         * @type {int} channelIndex : index of the channel to query
         */

    }, {
        key: "channelIsLeftSurround",
        value: function channelIsLeftSurround(channelIndex) {

            if (channelIndex < 0 || channelIndex >= this.numChannels) {
                throw new Error("Invalid channel index : " + channelIndex);
            }

            var pos = this.channelPositions;

            return pos[channelIndex] === -110 ? true : false;
        }

        /**
         * Returns true if the i-th channel corresponds to RS
         * @type {int} channelIndex : index of the channel to query
         */

    }, {
        key: "channelIsRightSurround",
        value: function channelIsRightSurround(channelIndex) {

            if (channelIndex < 0 || channelIndex >= this.numChannels) {
                throw new Error("Invalid channel index : " + channelIndex);
            }

            var pos = this.channelPositions;

            return pos[channelIndex] === +110 ? true : false;
        }

        //==============================================================================
        /**
         * Returns the number of channels of the stream
         * @type {number}
         */

    }, {
        key: "setTrimFromGui",


        //==============================================================================
        /**
         * Sets the trim level, according to a slider in the GUI
         * theSlider : the slider
         * return the actual value of the trim
         */
        value: function setTrimFromGui(theSlider) {

            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = -60;
            var maxValue = 30;

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this._trim = value;

            return value;
        }

        //==============================================================================
        /**
         * Set the loudness value of audio stream
         * @type {number}
         */

    }, {
        key: "hasNaN",
        get: function get() {

            return isNaN(this._maxTruePeak) || isNaN(this._loudness);
        }

        //==============================================================================
        /**
         * Get channel position based on audio stream type
         * @type {number[]}
         */

    }, {
        key: "channelPositions",
        get: function get() {
            switch (this._type) {
                case "Mono":
                    return [0];
                case "Stereo":
                    return [-30, +30];
                case "MultiWithoutLFE":
                    /// L, R, C, Ls, Rs.
                    return [-30, +30, 0, -110, +110];
                case "MultiWithLFE":
                    // L, R, C, Lfe, Ls, Rs.
                    // @n LFE position is irrelevant
                    // but provided so that the array has a length of 6
                    return [-30, +30, 0, 0, -110, +110];
                case "EightChannel":
                    // @todo set correct positions
                    return [1, 2, 3, 4, 5, 6, 7, 8];
            }
        }
    }, {
        key: "numChannels",
        get: function get() {
            switch (this._type) {
                case "Mono":
                    return 1;
                case "Stereo":
                    return 2;
                case "MultiWithoutLFE":
                    return 5;
                case "MultiWithLFE":
                    return 6;
                case "EightChannel":
                    return 8;
            }
        }

        //==============================================================================
        /**
         * Returns the type of the stream
         * @type {string}
         */

    }, {
        key: "type",
        get: function get() {
            return this._type;
        }

        //==============================================================================
        /**
         * Set active, if stream is currently playing or not
         * @type {boolean}
         */

    }, {
        key: "active",
        set: function set(value) {
            this._active = value;
        }
        /**
         * Get active, if stream is currently playing or not
         * @type {boolean}
         */
        ,
        get: function get() {
            return this._active && this.hasNaN === false;
        }

        //==============================================================================
        /**
         * Set the trim level (in dB)
         * @type {number}
         */

    }, {
        key: "trim",
        set: function set(value) {
            this._trim = value;
        }
        /**
         * Get the trim level (in dB)
         * @type {number}
         */
        ,
        get: function get() {
            return this._trim;
        }
    }, {
        key: "loudness",
        set: function set(value) {
            this._loudness = value;
        }
        /**
         * Get the loudness of audio stream
         * @type {number}
         */
        ,
        get: function get() {
            return this._loudness;
        }

        //==============================================================================
        /**
         * Set the maxTruePeak of audio stream
         * @type {number}
         */

    }, {
        key: "maxTruePeak",
        set: function set(value) {
            this._maxTruePeak = value;
        }
        /**
         * Get the maxTruePeak of audio stream
         * @type {number}
         */
        ,
        get: function get() {
            return this._maxTruePeak;
        }

        //==============================================================================
        /**
         * Set dialog, if stream is currently a dialog or not
         * @type {boolean}
         */

    }, {
        key: "dialog",
        set: function set(value) {
            this._dialog = value;
        }
        /**
         * Returns true if the stream is a dialog
         * @type {boolean}
         */
        ,
        get: function get() {
            return this._dialog;
        }

        /**
         * Returns true if the stream contains ONLY dialog
         * (in which case, it is most likely a mono stream)
         * @type {boolean}
         */

    }, {
        key: "isExtendedDialog",
        get: function get() {
            return this._dialog === true && this._ambiance === false && this._commentary === false;
        }

        //==============================================================================
        /**
         * Set ambiance, if stream is currently an ambiance or not
         * @type {boolean}
         */

    }, {
        key: "ambiance",
        set: function set(value) {
            this._ambiance = value;
        }
        /**
         * Returns if the stream is an ambiance
         * @type {boolean}
         */
        ,
        get: function get() {
            return this._ambiance;
        }

        /**
         * Returns true if the stream contains ONLY the ambiance
         * (in which case, it is most likely a mono stream)
         * @type {boolean}
         */

    }, {
        key: "isExtendedAmbiance",
        get: function get() {
            return this._dialog === false && this._ambiance === true && this._commentary === false;
        }

        //==============================================================================
        /**
         * Set commentary, if stream is currently a commentary (audio description) or not
         * @type {boolean}
         */

    }, {
        key: "commentary",
        set: function set(value) {
            this._commentary = value;
        }
        /**
         * Returns true if the stream is a commentary (audio description)
         * @type {boolean}
         */
        ,
        get: function get() {
            return this._commentary;
        }

        /**
         * Returns true if the stream contains ONLY the commentary (audio description)
         * (in which case, it is most likely a mono stream)
         * @type {boolean}
         */

    }, {
        key: "isExtendedCommentary",
        get: function get() {
            return this._dialog === false && this._ambiance === false && this._commentary === true;
        }
    }]);

    return AudioStreamDescription;
}();

/**
* @external {AudioContext} https://developer.mozilla.org/fr/docs/Web/API/AudioContext
*/