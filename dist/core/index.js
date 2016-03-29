"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

    /**
     * Set the stream description collection
     * @type {AudioStreamDescription[]}
     */

    _createClass(AudioStreamDescriptionCollection, [{
        key: "activeStreamsChanged",

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

        /**
         * Get the current dialog audio stream description of the collection
         * @type {AudioStreamDescription}
         */

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

        /**
         * Returns the total number of channels (i.e. for all the streams)
         */

    }, {
        key: "totalNumberOfChannels",
        get: function get() {
            var totalNumberOfChannels_ = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._streams[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var stream = _step.value;

                    totalNumberOfChannels_ += stream.numChannels;
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

            return totalNumberOfChannels_;
        }

        /**
         * Get the current active audio stream descriptions of the collection
         * @type {AudioStreamDescription[]}
         */

    }, {
        key: "actives",
        get: function get() {
            var actives = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this._streams[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var stream = _step2.value;

                    if (stream.active) {
                        actives.push(stream);
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

            return actives;
        }

        /**
         * Returns true if at least one stream is currently active
         * @type {boolean}
         */

    }, {
        key: "hasActiveStream",
        get: function get() {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this._streams[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var stream = _step3.value;

                    if (stream.active === true) {
                        return true;
                    }
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

            return false;
        }
    }, {
        key: "dialog",
        get: function get() {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this._streams[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var stream = _step4.value;

                    if (stream.dialog === true) {
                        return stream;
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

            return undefined;
        }

        /**
         * Returns true if there is at least one dialog among all the streams     
         */

    }, {
        key: "hasDialog",
        get: function get() {
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = this._streams[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var stream = _step5.value;

                    if (stream.dialog === true) {
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

        /**
         * Returns true if there is at least one commentary among all the streams     
         */

    }, {
        key: "hasCommentary",
        get: function get() {
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = this._streams[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var stream = _step6.value;

                    if (stream.commentary === true) {
                        return true;
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

            return false;
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
    /**
     * Get channel position based on audio stream type
     * @type {number[]}
     */

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
            return this._active;
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
    }]);

    return AudioStreamDescription;
}();

/**
* @external {AudioContext} https://developer.mozilla.org/fr/docs/Web/API/AudioContext
*/