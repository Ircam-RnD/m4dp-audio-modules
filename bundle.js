(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.M4DPAudioModules = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.writeBufferToTextFileWithMatlabFormat = writeBufferToTextFileWithMatlabFormat;
exports.writeBufferToTextFile = writeBufferToTextFile;
exports.clearBufferChannel = clearBufferChannel;
exports.clearBuffer = clearBuffer;
exports.makeImpulse = makeImpulse;
/**
 * Utilities functions
 */

//==============================================================================
/**
 * Writes some text into a file.
 * The file can later be downloaded
 * The function returns the download URL
 */
function writeTextDataToFile(text) {
    var textFile = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    var data = new Blob([text], { type: 'text/plain' });

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return textFile;
};

//==============================================================================
/**
 * Writes a buffer to a text file and returns the URL of the downloadable file
 * The text file is formatted so that it can be easily copy/paste into Matlab
 * 
 * @type {AudioBuffer} buffer
 */
function writeBufferToTextFileWithMatlabFormat(buffer) {

    var numChannels = buffer.numberOfChannels;
    var numSamples = buffer.length;

    var text = "";

    text += "printing buffer :" + "\n";
    text += "numChannels = " + numChannels + "\n";
    text += "numSamples  = " + numSamples + "\n";

    var numDecimals = 9;

    for (var i = 0; i < numChannels; i++) {

        var channel_ = buffer.getChannelData(i);

        text += "channel(" + (i + 1) + ", 1:" + numSamples + ") = ";
        text += "...\n";

        text += "[ ";

        for (var j = 0; j < numSamples; j++) {
            var value = channel_[j];

            var valueAsString = value.toFixed(numDecimals);

            text += valueAsString;
            text += " ";
        }
        text += " ];";

        text += "\n";
    }

    return writeTextDataToFile(text);
}

/**
 * Writes a buffer to a text file and returns the URL of the downloadable file
 * @type {AudioBuffer} buffer
 */
function writeBufferToTextFile(buffer) {

    var numChannels = buffer.numberOfChannels;
    var numSamples = buffer.length;

    var text = "";

    text += "printing buffer :" + "\n";
    text += "numChannels = " + numChannels + "\n";
    text += "numSamples  = " + numSamples + "\n";

    var numDecimals = 9;

    for (var i = 0; i < numChannels; i++) {

        var channel_ = buffer.getChannelData(i);

        text += "channel[" + i + "] = ";
        text += "\n";

        for (var j = 0; j < numSamples; j++) {
            var value = channel_[j];

            var valueAsString = value.toFixed(numDecimals);

            text += valueAsString;
            text += " ";
        }
        text += "\n";
    }

    return writeTextDataToFile(text);
}

//==============================================================================
/**
 * Fills one channel of a buffer with 0
 * @type {AudioBuffer} buffer
 */
function clearBufferChannel(buffer, channelIndex) {

    var numChannels = buffer.numberOfChannels;
    var numSamples = buffer.length;

    /// boundary check
    if (channelIndex < 0 || channelIndex >= numChannels) {
        throw new Error("Invalid channelIndex");
    }

    var channel_ = buffer.getChannelData(channelIndex);

    for (var j = 0; j < numSamples; j++) {
        channel_[j] = 0.0;
    }
}

/**
 * Fills all channel of a buffer with 0
 * @type {AudioBuffer} buffer
 */
function clearBuffer(buffer) {

    var numChannels = buffer.numberOfChannels;

    for (var i = 0; i < numChannels; i++) {

        clearBufferChannel(buffer, i);
    }
}

/**
 * Creates a Dirac in one given channel of the AudioBuffer
 * @type {AudioBuffer} buffer
 * @type {int} channelIndex
 * @type {int} sampleIndex
 */
function makeImpulse(buffer) {
    var channelIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    var sampleIndex = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

    var numChannels = buffer.numberOfChannels;
    var numSamples = buffer.length;

    /// boundary check
    if (channelIndex < 0 || channelIndex >= numChannels) {
        throw new Error("Invalid channelIndex");
    }

    /// boundary check
    if (sampleIndex < 0 || sampleIndex >= numSamples) {
        throw new Error("Invalid sampleIndex");
    }

    /// first clear the channel
    clearBufferChannel(buffer, channelIndex);

    /// then create a Dirac
    var channel_ = buffer.getChannelData(channelIndex);
    channel_[sampleIndex] = 1.0;
}

/// @n technique pour avoir un pseudo-namespace
var bufferutilities = {
    writeBufferToTextFileWithMatlabFormat: writeBufferToTextFileWithMatlabFormat,
    writeBufferToTextFile: writeBufferToTextFile,
    clearBufferChannel: clearBufferChannel,
    clearBuffer: clearBuffer,
    makeImpulse: makeImpulse
};

exports.default = bufferutilities;
},{}],2:[function(require,module,exports){
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
        this.input = this._audioContext.createGain();
        this._output = this._audioContext.createGain();
    }
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
         * @param {AudioNode} node - an AudioNode to disconnect to.
         */

    }, {
        key: "disconnect",
        value: function disconnect(node) {
            this._output.disconnect(node);
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

                    if (stream.active) {
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

                    if (stream.dialog) {
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
    }
    /**
     * Get channel position based on audio stream type
     * @type {number[]}
     */

    _createClass(AudioStreamDescription, [{
        key: "channelPositions",
        get: function get() {
            switch (this._type) {
                case "Mono":
                    return [0];
                case "Stereo":
                    return [-30, +30];
                case "MultiWithoutLFE":
                    return [-30, +30, 0, -110, +110];
                case "MultiWithLFE":
                    // @n LFE position is irrelevant
                    // but provided so that the array has a length of 6
                    return [-30, +30, 0, -110, +110, 0];
                case "EightChannel":
                    // @todo set correct positions
                    return [1, 2, 3, 4, 5, 6, 7, 8];
            }
        }

        /**
         * Returns the number of channels of the stream
         * @type {number}
         */

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

        /**
         * Returns the type of the stream
         * @type {string}
         */

    }, {
        key: "type",
        get: function get() {
            return this._type;
        }

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

        /**
         * Set the loudness value of audio stream
         * @type {number}
         */

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
         * Get dialog, if stream is currently a dialog or not
         * @type {boolean}
         */
        ,
        get: function get() {
            return this._dialog;
        }

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
         * Get ambiance, if stream is currently an ambiance or not
         * @type {boolean}
         */
        ,
        get: function get() {
            return this._ambiance;
        }

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
         * Get commentary, if stream is currently a commentary (audio description) or not
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
 * HRTF
 * @todo: to be defined
 * @typedef {Object} HRTF
 */

/**
 * EqPreset
 * @todo: to be defined
 * @typedef {Object} EqPreset
 */

/**
* @external {AudioContext} https://developer.mozilla.org/fr/docs/Web/API/AudioContext
*/
},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.clamp = clamp;
exports.scale = scale;
exports.lin2dB = lin2dB;
exports.dB2lin = dB2lin;
exports.arrayAlmostEqual = arrayAlmostEqual;
/**
 * Utilities functions
 */

/**
 * Clips a value within a given range
 * @type {number} value the value to be clipped
 * @type {number} min the lower bound
 * @type {number} max the upper bound
 *
 */
function clamp(value, min, max) {

    if (max < min) {
        throw new Error("pas bon");
    }

    return Math.max(min, Math.min(value, max));
}

/**
 * linear rescaling bases on input and output domains
 *
 */
function scale(value, minIn, maxIn, minOut, maxOut) {

    if (maxIn === minIn) {
        throw new Error("pas bon");
    }

    var normalized = (value - minIn) / (maxIn - minIn);

    return minOut + normalized * (maxOut - minOut);
}

/**
 * linear gain to decibel conversion
 *
 */
function lin2dB(value) {

    if (value <= 0) {
        throw new Error("pas bon");
    }

    return 20 * Math.log10(value);
}

/**
 * amplitude decibel to linear gain conversion
 *
 */
function dB2lin(value) {
    return Math.pow(10, value / 20);
}

/**
 * Compares two array. Returns true if they are (almost) equal
 *
 */
function arrayAlmostEqual(array1, array2) {
    var tolerance = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

    if (tolerance < 0.0) {
        throw new Error("pas bon");
    }

    if (array1.length != array2.length) {
        return false;
    }

    var size = array1.length;

    for (var i = 0; i < size; i++) {
        var val1 = array1[i];
        var val2 = array2[i];
        var diff = Math.abs(val1 - val2);

        if (diff > tolerance) {
            return false;
        }
    }

    return true;
}

/// @n technique pour avoir un pseudo-namespace
var utilities = {
    clamp: clamp,
    scale: scale,
    lin2dB: lin2dB,
    dB2lin: dB2lin,
    arrayAlmostEqual: arrayAlmostEqual
};

exports.default = utilities;
},{}],4:[function(require,module,exports){
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

var DialogEnhancement = function (_AbstractNode) {
    _inherits(DialogEnhancement, _AbstractNode);

    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
     * @param {number} mode - mode
     * @param {number} dialogGain - dialog gain
     */

    function DialogEnhancement(audioContext, audioStreamDescriptionCollection, mode, dialogGain) {
        _classCallCheck(this, DialogEnhancement);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DialogEnhancement).call(this, audioContext, audioStreamDescriptionCollection));

        _this._mode = mode;
        return _this;
    }
    /**
     * Set Mode - value is 1, 2 or 3
     * @type {number}
     */

    _createClass(DialogEnhancement, [{
        key: 'mode',
        set: function set(value) {
            // @todo error in some mode: eg. mode 1 and no dialog => "impossible"
            // error mode 2 et pas de 5.0 ou 5.1
            // error mode 3 et pas de stéréo
            this._mode = value;
        }
        /**
         * Get Mode - value is 1, 2 or 3
         * @type {number}
         */
        ,
        get: function get() {
            return this._mode;
        }
        /**
         * Set audioStreamDescriptionCollection
         * @type {AudioStreamDescriptionCollection}
         */

    }, {
        key: 'audioStreamDescriptionCollection',
        set: function set(value) {
            this._audioStreamDescriptionCollection = value;
        }
        /**
         * Get audioStreamDescriptionCollection
         * @type {AudioStreamDescriptionCollection}
         */
        ,
        get: function get() {
            return this._audioStreamDescriptionCollection;
        }
        /**
         * Set dialogGain
         * @type {number}
         * @todo give range of accepted values
         */

    }, {
        key: 'dialogGain',
        set: function set(value) {
            this._dialogGain = value;
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
},{"../core/index.js":2}],5:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require("../core/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CascadeNode = function (_AbstractNode) {
    _inherits(CascadeNode, _AbstractNode);

    /**
     * @brief This class implements a cascade of BiquadFilterNodes
     *        The filtering affects all channel similarly
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */

    function CascadeNode(audioContext) {
        _classCallCheck(this, CascadeNode);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CascadeNode).call(this, audioContext));

        _this._isBypass = false;
        _this._biquadNodes = [];

        /// by default, 0 cascades.
        /// this will also update the audio graph
        _this.numCascades = 0;
        return _this;
    }

    //==============================================================================
    /**
     * Enable or bypass the processor
     * @type {boolean}
     */

    _createClass(CascadeNode, [{
        key: "setFrequency",

        //==============================================================================
        /**
         * Sets the frequency of the i-th biquad in the cascade
         * @param {int} biquadIndex
         * @param {float} value
         */
        value: function setFrequency(biquadIndex, value) {

            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            this._biquadNodes[biquadIndex].frequency.value = value;
        }

        /**
         * Returns the frequency of the i-th biquad in the cascade
         * @param {int} biquadIndex
         */

    }, {
        key: "getFrequency",
        value: function getFrequency(biquadIndex) {

            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            return this._biquadNodes[biquadIndex].frequency;
        }

        //==============================================================================
        /**
         * Sets the Q of the i-th biquad in the cascade
         * @param {int} biquadIndex
         * @param {float} value
         */

    }, {
        key: "setQ",
        value: function setQ(biquadIndex, value) {

            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            this._biquadNodes[biquadIndex].Q.value = value;
        }

        /**
         * Returns the Q of the i-th biquad in the cascade
         * @param {int} biquadIndex
         */

    }, {
        key: "getQ",
        value: function getQ(biquadIndex) {

            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            return this._biquadNodes[biquadIndex].Q;
        }

        //==============================================================================
        /**
         * Sets the gain of the i-th biquad in the cascade
         * @param {int} biquadIndex
         * @param {float} value
         */

    }, {
        key: "setGain",
        value: function setGain(biquadIndex, value) {

            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            this._biquadNodes[biquadIndex].gain.value = value;
        }

        /**
         * Returns the gain of the i-th biquad in the cascade
         * @param {int} biquadIndex
         */

    }, {
        key: "getGain",
        value: function getGain(biquadIndex) {

            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            return this._biquadNodes[biquadIndex].gain;
        }

        //==============================================================================
        /**
         * Sets the type of the i-th biquad in the cascade
         * @param {int} biquadIndex
         * @param {string} value
         */

    }, {
        key: "setType",
        value: function setType(biquadIndex, value) {

            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            this._biquadNodes[biquadIndex].type = value;
        }

        /**
         * Returns the type of the i-th biquad in the cascade
         * @param {int} biquadIndex
         */

    }, {
        key: "getType",
        value: function getType(biquadIndex) {

            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            return this._biquadNodes[biquadIndex].type;
        }

        //==============================================================================
        /**
         * Resets one biquad to its default
         * @param {int} biquadIndex
         */

    }, {
        key: "resetBiquad",
        value: function resetBiquad(biquadIndex) {

            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            this.setType(biquadIndex, "lowpass");
            this.setGain(biquadIndex, 0.0);
            this.setFrequency(biquadIndex, 350);
            this.setQ(biquadIndex, 1);
        }

        /**
         * Resets all biquads
         */

    }, {
        key: "resetAllBiquads",
        value: function resetAllBiquads() {

            var numCascades = this.numCascades;

            for (var i = 0; i < numCascades; i++) {
                this.resetBiquad(i);
            }
        }

        //==============================================================================
        /**
         * Returns the number of biquads in the cascade
         */

    }, {
        key: "_updateAudioGraph",

        //==============================================================================
        /**
         * Updates the connections of the audio graph
         */
        value: function _updateAudioGraph() {

            var numCascades_ = this.numCascades;

            /// first of all, disconnect everything
            this.input.disconnect();
            for (var i = 0; i < numCascades_; i++) {
                this._biquadNodes[i].disconnect();
            }

            if (this.bypass === true || numCascades_ === 0) {
                this.input.connect(this._output);
            } else {
                /// connect the last element to the output
                this._biquadNodes[numCascades_ - 1].connect(this._output);

                /// connect the cascades
                for (var i = numCascades_ - 1; i > 0; i--) {
                    this._biquadNodes[i - 1].connect(this._biquadNodes[i]);
                }

                /// connect the 1st biquad to the input
                this.input.connect(this._biquadNodes[0]);
            }
        }
    }, {
        key: "bypass",
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
        key: "numCascades",
        get: function get() {
            return this._biquadNodes.length;
        }

        /**
         * Sets the number of cascades
         */
        ,
        set: function set(newNumCascades) {

            var currentNumCascades = this.numCascades;

            if (newNumCascades > currentNumCascades) {

                for (var i = currentNumCascades; i < newNumCascades; i++) {

                    var newBiquadNode = this._audioContext.createBiquadFilter();

                    this._biquadNodes.push(newBiquadNode);
                }
            } else if (newNumCascades < currentNumCascades) {

                this._biquadNodes.length = newNumCascades;
            }

            /// now update the audio connections
            this._updateAudioGraph();
        }
    }]);

    return CascadeNode;
}(_index2.default);

exports.default = CascadeNode;
},{"../core/index.js":2}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _cascade = require('../dsp/cascade.js');

var _cascade2 = _interopRequireDefault(_cascade);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HeadphonesEqualization = function (_CascadeNode) {
    _inherits(HeadphonesEqualization, _CascadeNode);

    //==============================================================================
    /**
     * @brief This class implements the headphone equalization.
     *        It thus applies filtering on 2 channels (2 in, 2 out)
     *        The filtering is based on parametric filters (BiquadFilterNode); various settings are hard-coded
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */

    function HeadphonesEqualization(audioContext) {
        _classCallCheck(this, HeadphonesEqualization);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HeadphonesEqualization).call(this, audioContext));

        _this._eqPreset = "none";
        return _this;
    }

    //==============================================================================
    /**
     * Set eqPreset
     * @todo: which kind of value, json?
     * @todo: set it to none to not appy any eq?
     * @type {EqPreset}
     */

    _createClass(HeadphonesEqualization, [{
        key: '_updateCascade',

        //==============================================================================
        value: function _updateCascade() {

            var preset = this.eqPreset;

            if (preset === "none") {
                _set(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'numCascades', 0, this);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'resetAllBiquads', this).call(this);
            } else if (preset === "eq1") {

                /// whatever settings... waiting for FTV to communicate their specifications

                _set(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'numCascades', 3, this);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'resetAllBiquads', this).call(this);

                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setType', this).call(this, 0, "highpass");
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setType', this).call(this, 1, "peaking");
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setType', this).call(this, 2, "lowpass");

                /// It is expressed in dB, has a default value of 0 and can take a value in a nominal range of -40 to 40
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setGain', this).call(this, 0, -12);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setGain', this).call(this, 1, 6);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setGain', this).call(this, 2, -16);

                /// measured in hertz (Hz)
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setFrequency', this).call(this, 0, 200);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setFrequency', this).call(this, 1, 1000);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setFrequency', this).call(this, 2, 4000);

                /// It is a dimensionless value with a default value of 1 and a nominal range of 0.0001 to 1000.
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setQ', this).call(this, 0, 1);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setQ', this).call(this, 1, 2);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setQ', this).call(this, 2, 1);
            } else {
                throw new Error("Invalid preset name " + preset);
            }
        }
    }, {
        key: 'eqPreset',
        set: function set(value) {
            this._eqPreset = value;
            this._updateCascade();
        }
        /**
         * Get eqPreset
         * @type {EqPreset}
         */
        ,
        get: function get() {
            return this._eqPreset;
        }
    }]);

    return HeadphonesEqualization;
}(_cascade2.default);

exports.default = HeadphonesEqualization;
},{"../core/index.js":2,"../dsp/cascade.js":5}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeadphonesEqualization = exports.CascadeNode = undefined;

var _cascade = require('./cascade.js');

var _cascade2 = _interopRequireDefault(_cascade);

var _headphoneequalization = require('./headphoneequalization.js');

var _headphoneequalization2 = _interopRequireDefault(_headphoneequalization);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.CascadeNode = _cascade2.default;
exports.HeadphonesEqualization = _headphoneequalization2.default;
},{"./cascade.js":5,"./headphoneequalization.js":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
		value: true
});
exports.unittests = exports.utilities = exports.AudioStreamDescription = exports.AudioStreamDescriptionCollection = exports.SmartFader = exports.ObjectSpatialiserAndMixer = exports.NoiseAdaptation = exports.MultichannelSpatialiser = exports.DialogEnhancement = exports.StreamSelector = exports.HeadphonesEqualization = exports.CascadeNode = undefined;

var _index = require('./dialog-enhancement/index.js');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./multichannel-spatialiser/index.js');

var _index4 = _interopRequireDefault(_index3);

var _index5 = require('./noise-adaptation/index.js');

var _index6 = _interopRequireDefault(_index5);

var _index7 = require('./object-spatialiser-and-mixer/index.js');

var _index8 = _interopRequireDefault(_index7);

var _index9 = require('./smart-fader/index.js');

var _index10 = _interopRequireDefault(_index9);

var _index11 = require('./core/index.js');

var _index12 = require('./stream-selector/index.js');

var _index13 = _interopRequireDefault(_index12);

var _index14 = require('./dsp/index.js');

var _utils = require('./core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

var _index15 = require('./testing/index.js');

var _index16 = _interopRequireDefault(_index15);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.CascadeNode = _index14.CascadeNode;
exports.HeadphonesEqualization = _index14.HeadphonesEqualization;
exports.StreamSelector = _index13.default;
exports.DialogEnhancement = _index2.default;
exports.MultichannelSpatialiser = _index4.default;
exports.NoiseAdaptation = _index6.default;
exports.ObjectSpatialiserAndMixer = _index8.default;
exports.SmartFader = _index10.default;
exports.AudioStreamDescriptionCollection = _index11.AudioStreamDescriptionCollection;
exports.AudioStreamDescription = _index11.AudioStreamDescription;
exports.utilities = _utils2.default;
exports.unittests = _index16.default;
},{"./core/index.js":2,"./core/utils.js":3,"./dialog-enhancement/index.js":4,"./dsp/index.js":7,"./multichannel-spatialiser/index.js":9,"./noise-adaptation/index.js":10,"./object-spatialiser-and-mixer/index.js":11,"./smart-fader/index.js":12,"./stream-selector/index.js":13,"./testing/index.js":14}],9:[function(require,module,exports){
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

var MultichannelSpatialiser = function (_AbstractNode) {
  _inherits(MultichannelSpatialiser, _AbstractNode);

  /**
   * @param {AudioContext} audioContext - audioContext instance.
   * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
   * @param {string} outputType - output type "headphone" or "speaker"
   * @param {HRTF} hrtf - hrtf @todo to be defined
   * @param {EqPreset} eqPreset - dialog gain @todo to be defined
   * @param {number} offsetGain - gain @todo value to be defined
   * @param {number} listeningAxis - angle? @todo value to be defined
   */

  function MultichannelSpatialiser(audioContext) {
    var audioStreamDescriptionCollection = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
    var outputType = arguments.length <= 2 || arguments[2] === undefined ? 'headphone' : arguments[2];
    var hrtf = arguments[3];
    var eqPreset = arguments[4];
    var offsetGain = arguments[5];
    var listeningAxis = arguments[6];

    _classCallCheck(this, MultichannelSpatialiser);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MultichannelSpatialiser).call(this, audioContext, audioStreamDescriptionCollection));

    _this._outputType = outputType;
    _this._hrtf = hrtf;
    _this._eqPreset = eqPreset;
    _this._offsetGain = offsetGain;
    _this._listeningAxis = listeningAxis;
    return _this;
  }
  /**
   * Set outputType: 'headphone' or 'speaker', 'multicanal'
   * @todo: automatic for 'multicanal' even if nb of speaker 'wrong'
   * @type {string}
   */

  _createClass(MultichannelSpatialiser, [{
    key: 'outputType',
    set: function set(value) {
      this._outputType = value;
    }
    /**
     * Get outputType: 'headphone' or 'speaker'
     * @type {string}
     */
    ,
    get: function get() {
      return this._outputType;
    }
    /**
     * Set audio streams description (json)
     * @type {AudioStreamDescriptionCollection}
     */

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
    /**
     * Set hrtf
     * @type {HRTF}
     * @todo: which kind of value, json?
     */

  }, {
    key: 'hrtf',
    set: function set(value) {
      this._hrtf = value;
    }
    /**
     * Get hrtf
     * @type {HRTF}
     */
    ,
    get: function get() {
      return this._hrtf;
    }
    /**
     * Set eqPreset
     * @todo: which kind of value, json?
     * @todo: set it to none to not appy any eq?
     * @type {EqPreset}
     */

  }, {
    key: 'eqPreset',
    set: function set(value) {
      this._eqPreset = value;
    }
    /**
     * Get eqPreset
     * @type {EqPreset}
     */
    ,
    get: function get() {
      return this._eqPreset;
    }
    /**
     * Set offsetGain
     * @todo range
     * @type {number}
     */

  }, {
    key: 'offsetGain',
    set: function set(value) {
      this._offsetGain = value;
    }
    /**
     * Get offsetGain
     * @todo range
     * @type {number}
     */
    ,
    get: function get() {
      return this._offsetGain;
    }
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
},{"../core/index.js":2}],10:[function(require,module,exports){
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

var NoiseAdaptation = function (_AbstractNode) {
  _inherits(NoiseAdaptation, _AbstractNode);

  /**
   * @param {AudioContext} audioContext - audioContext instance.
   * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
   * @param {boolean} headphone - true is headphone, else, false.
   */

  function NoiseAdaptation(audioContext, audioStreamDescriptionCollection) {
    var headphone = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    _classCallCheck(this, NoiseAdaptation);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NoiseAdaptation).call(this, audioContext, audioStreamDescriptionCollection));

    _this._headphone = headphone;
    return _this;
  }
  /**
   * Process:
   * @todo: track noise, add compression, improve voice if no headphone
   */

  _createClass(NoiseAdaptation, [{
    key: '_process',
    value: function _process() {}
    /**
     * Set headphone - true is headphone, else, false.
     * @type {boolean}
     */

  }, {
    key: 'headphone',
    set: function set(value) {
      this._headphone = value;
    }
    /**
     * Get headphone, return True if headphone is connected, else, false
     * @type {boolean}
     */
    ,
    get: function get() {
      return this._headphone;
    }
  }]);

  return NoiseAdaptation;
}(_index2.default);

exports.default = NoiseAdaptation;
},{"../core/index.js":2}],11:[function(require,module,exports){
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

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ObjectSpatialiserAndMixer = function (_MultichannelSpatiali) {
  _inherits(ObjectSpatialiserAndMixer, _MultichannelSpatiali);

  /**
   * @param {AudioContext} audioContext - audioContext instance.
   * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
   * @param {string} outputType - output type "headphone" or "speaker"
   * @param {HRTF} hrtf - hrtf @todo to be defined
   * @param {EqPreset} eqPreset - dialog gain @todo to be defined
   * @param {number} offsetGain - gain @todo value to be defined
   * @param {number} listeningAxis - angle? @todo value to be defined
   */

  function ObjectSpatialiserAndMixer(audioContext) {
    var audioStreamDescriptionCollection = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
    var outputType = arguments.length <= 2 || arguments[2] === undefined ? 'headphone' : arguments[2];
    var hrtf = arguments[3];
    var eqPreset = arguments[4];
    var offsetGain = arguments[5];
    var listeningAxis = arguments[6];

    _classCallCheck(this, ObjectSpatialiserAndMixer);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ObjectSpatialiserAndMixer).call(this, audioContext, audioStreamDescriptionCollection, outputType, hrtf, eqPreset, offsetGain, listeningAxis));
  }
  /**
   * Set the position of the sound
   * @todo only for a unique mono stream
   * @param {number} azimuth - azimuth @todo values to be defined
   * @param {number} elevation - elevation @todo values to be defined
   * @param {number} distance - distance @todo values to be defined
   */

  _createClass(ObjectSpatialiserAndMixer, [{
    key: 'setPosition',
    value: function setPosition(azimuth, elevation, distance) {
      this._azimuth = azimuth;
      this._elevation = elevation;
      this._distance = distance;
    }
    /**
     * Get the position of the sound
     * @todo return an array? better I think for setPosition/getPosition homogeneity
     * @return {array}
     */

  }, {
    key: 'getPosition',
    value: function getPosition() {
      //return {'azimuth': this._azimuth, 'elevation': this._elevation, 'distance': this._distance};
      return [this._azimuth, this._elevation, this._distance];
    }
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
},{"../multichannel-spatialiser/index.js":9}],12:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _utils = require('../core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SmartFader = function (_AbstractNode) {
    _inherits(SmartFader, _AbstractNode);

    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection
     * @param {number} dB - dB value for the SmartFader.
     * @todo give range of accepted values
     */

    function SmartFader(audioContext) {
        var audioStreamDescriptionCollection = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
        var dB = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];

        _classCallCheck(this, SmartFader);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SmartFader).call(this, audioContext, audioStreamDescriptionCollection));

        _this._dB = undefined;

        // AudioGraph connect
        // @todo: DynamicsCompressorNode accept n channels input
        _this._gainNode = audioContext.createGain();
        _this._dynamicCompressorNode = audioContext.createDynamicsCompressor();

        _this.input.connect(_this._gainNode);
        _this._gainNode.connect(_this._dynamicCompressorNode);
        _this._dynamicCompressorNode.connect(_this._output);

        _this.dB = dB;

        _this._updateCompressorSettings();
        return _this;
    }

    /**
     * Set the dB value
     * @type {number}
     */

    _createClass(SmartFader, [{
        key: 'activeStreamsChanged',

        /**
         * Notification when the active stream(s) changes
         */
        value: function activeStreamsChanged() {
            this._updateCompressorSettings();
        }
    }, {
        key: '_updateCompressorSettings',
        value: function _updateCompressorSettings() {

            /// retrieves the AudioStreamDescriptionCollection
            var asdc = this._audioStreamDescriptionCollection;

            if (asdc.hasActiveStream === false) {
                //console.log( "no active streams !!");
                return;
            }

            ///@todo : que faire si plusieurs streams sont actifs ??

            /// retrieves the active AudioStreamDescription(s)
            var asd = asdc.actives;

            /// sanity check
            if (asd.length <= 0) {
                throw new Error("Y'a un bug qq part...");
            }

            /// use the first active stream (???)
            var activeStream = asd[0];

            /**
            Le reglage du volume doit se comporter de la facon suivante :
            - attenuation classique du volume sonore entre le niveau nominal (gain = 0) et en deca
            - augmentation classique du volume sonore entre le niveau nominal et le niveau max (niveau max = niveau nominal + I MaxTruePeak I)
            - limiteur/compresseur multicanal au dela du niveau max
            */

            /// retrieves the MaxTruePeak (ITU­R BS.1770­3) of the active AudioStreamDescription
            /// (expressed in dBTP)
            var maxTruePeak = activeStream.maxTruePeak;

            /// integrated loudness (in LUFS)
            var nominal = activeStream.loudness;

            /// sanity check
            if (nominal >= 0.0) {
                throw new Error("Ca parait pas bon...");
            }

            var threshold = nominal + Math.abs(maxTruePeak);

            /// representing the decibel value above which the compression will start taking effect
            this._dynamicCompressorNode.threshold.value = threshold;

            /// representing the amount of change, in dB, needed in the input for a 1 dB change in the output
            this._dynamicCompressorNode.ratio.value = 3;

            /// representing the amount of time, in seconds, required to reduce the gain by 10 dB
            this._dynamicCompressorNode.attack.value = 0.1;

            /// representing the amount of time, in seconds, required to increase the gain by 10 dB
            this._dynamicCompressorNode.release.value = 0.25;
        }
    }, {
        key: '_update',
        value: function _update() {

            //console.log( "_update" );

            /// the current fader value, in dB
            var fader = this._dB;

            if (typeof fader === "undefined" || isNaN(fader) === true) {
                /// this can happen during the construction...
                return;
            }

            var lin = _utils2.default.dB2lin(fader);

            this._gainNode.gain.value = lin;
        }
    }, {
        key: 'dB',
        set: function set(value) {
            this._dB = SmartFader.clampdB(value);
            this._update();
        }

        /**
         * Clips a value within the proper dB range
         * @type {number} value the value to be clipped
         */
        ,

        /**
         * Get the dB value
         * @type {number}
         */
        get: function get() {
            return this._dB;
        }

        /**
         * Get the dB range
         * @type {array}
         * @details +8 dB suffisent, pour passer du -23 au -15 LUFS (iTunes), c'est l'idée.
         */

    }, {
        key: 'dynamicCompressionState',

        /**
         * Returns the dynamic compression state
         * @type {boolean}
         */
        get: function get() {

            /// representing the amount of gain reduction currently applied by the compressor to the signal.

            /**
            Intended for metering purposes, it returns a value in dB, or 0 (no gain reduction) if no signal is fed
            into the DynamicsCompressorNode. The range of this value is between -20 and 0 (in dB).
            */

            var reduction = this._dynamicCompressorNode.reduction.value;

            var state = reduction < -0.5 ? true : false;

            return state;
        }
    }], [{
        key: 'clampdB',
        value: function clampdB(value) {
            var _SmartFader$dBRange = _slicedToArray(SmartFader.dBRange, 2);

            var minValue = _SmartFader$dBRange[0];
            var maxValue = _SmartFader$dBRange[1];

            return _utils2.default.clamp(value, minValue, maxValue);
        }
    }, {
        key: 'dBRange',
        get: function get() {
            return [-60, 8];
        }

        /**
         * Returns the default value (in dB)
         * @type {number}
         */

    }, {
        key: 'dBDefault',
        get: function get() {
            return 0;
        }
    }]);

    return SmartFader;
}(_index2.default);

exports.default = SmartFader;
},{"../core/index.js":2,"../core/utils.js":3}],13:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require("../core/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StreamSelector = function (_AbstractNode) {
    _inherits(StreamSelector, _AbstractNode);

    //==============================================================================
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

        /// sanity check
        /// mainAudio (2) + extendedAmbience (6) + extendedComments (1) + extendedDialogs (1) = 10
        if (totalNumberOfChannels_ != 10) {
            throw new Error("Ca parait pas bon...");
        }

        _this._splitterNode = audioContext.createChannelSplitter(totalNumberOfChannels_);

        _this._mergerNode = audioContext.createChannelMerger(totalNumberOfChannels_);

        /// sanity checks
        if (_this._splitterNode.numberOfInputs != 1 || _this._splitterNode.numberOfOutputs != totalNumberOfChannels_) {
            throw new Error("Pas bon");
        }

        /// sanity checks
        if (_this._mergerNode.numberOfInputs != totalNumberOfChannels_ || _this._mergerNode.numberOfOutputs != 1) {
            throw new Error("Pas bon");
        }

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
        key: "activeStreamsChanged",
        value: function activeStreamsChanged() {
            this._update();
        }

        //==============================================================================
        /**
         * Mute/unmute the streams, depending on the user selection
         * in the check boxes
         */

    }, {
        key: "_update",
        value: function _update() {

            /// retrieves the AudioStreamDescriptionCollection
            /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
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

                    /// linear gain value
                    var gainValue = isActive ? 1.0 : 0.0;

                    var numChannelsForThisStream = stream.numChannels;

                    for (var i = 0; i < numChannelsForThisStream; i++) {

                        if (channelIndex >= this._gainNode.length) {
                            throw new Error("Y'a un bug qq part...");
                        }

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
},{"../core/index.js":2}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _testbiquad = require('./testbiquad.js');

var _testbiquad2 = _interopRequireDefault(_testbiquad);

var _testcascade = require('./testcascade.js');

var _testcascade2 = _interopRequireDefault(_testcascade);

var _testsofa = require('./testsofa.js');

var _testsofa2 = _interopRequireDefault(_testsofa);

var _testbinaural = require('./testbinaural.js');

var _testbinaural2 = _interopRequireDefault(_testbinaural);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/// @n technique pour avoir un pseudo-namespace
/**
 * Some test functions
 * For debug purposes only
 */

var unittests = {
    biquadtests: _testbiquad2.default,
    cascadetests: _testcascade2.default,
    sofatests: _testsofa2.default,
    binauraltests: _testbinaural2.default
};

exports.default = unittests;
},{"./testbinaural.js":15,"./testbiquad.js":16,"./testcascade.js":17,"./testsofa.js":18}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.testBinauralNode = testBinauralNode;

var _testsofa = require('./testsofa.js');

var _testsofa2 = _interopRequireDefault(_testsofa);

var _bufferutils = require('../core/bufferutils.js');

var _bufferutils2 = _interopRequireDefault(_bufferutils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
/// This does not test anything; this just enters in debug mode, to inspect the buffers
/**
 * Some test functions
 * For debug purposes only
 */

function testBinauralNode() {

	var sampleRate = 44100;

	_testsofa2.default.getHrir(1147, sampleRate, -30, 0).then(function (hrir) {
		var leftHrir = hrir.getChannelData(0);
		var rightHrir = hrir.getChannelData(1);

		var bufferSize = 4096;
		var numChannels = 2;

		/// create an offline audio context
		var audioContext1 = new OfflineAudioContext(numChannels, bufferSize, sampleRate);

		/// create a test buffer
		var buffer = audioContext1.createBuffer(numChannels, bufferSize, sampleRate);

		/// just a precaution
		_bufferutils2.default.clearBuffer(buffer);
		_bufferutils2.default.makeImpulse(buffer, 0, 0);
		//bufferutilities.makeImpulse( buffer, 1, 10 );

		var convolver = audioContext1.createConvolver();

		/// create a buffer source
		var bufferSource = audioContext1.createBufferSource();

		/// reference the test buffer with the buffer source
		bufferSource.buffer = buffer;

		{
			convolver.normalize = false;
			convolver.buffer = hrir;
		}

		/// connect the node to the buffer source
		bufferSource.connect(convolver);

		/// connect the node to the destination of the audio context
		convolver.connect(audioContext1.destination);

		/// prepare the rendering
		var localTime = 0;
		bufferSource.start(localTime);

		/// receive notification when the rendering is completed
		audioContext1.oncomplete = function (output) {

			var buf = output.renderedBuffer;

			var bufUrl = _bufferutils2.default.writeBufferToTextFileWithMatlabFormat(buf);
			console.log("buffer URL :  " + bufUrl);

			debugger;
		};

		/// start rendering
		audioContext1.startRendering();

		debugger;
	});
}

/// @n technique pour avoir un pseudo-namespace
var binauraltests = {
	testBinauralNode: testBinauralNode
};

exports.default = binauraltests;
},{"../core/bufferutils.js":1,"./testsofa.js":18}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testBiquadNode = testBiquadNode;

var _bufferutils = require("../core/bufferutils.js");

var _bufferutils2 = _interopRequireDefault(_bufferutils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
/// This does not test anything; this just enters in debug mode, to inspect the buffers
function testBiquadNode() {

    var sampleRate = 44100;
    var bufferSize = 512;
    var numChannels = 4;

    /// create an offline audio context
    var audioContext1 = new OfflineAudioContext(numChannels, bufferSize, sampleRate);

    /// create a test buffer
    var buffer = audioContext1.createBuffer(numChannels, bufferSize, sampleRate);

    /// just a precaution
    _bufferutils2.default.clearBuffer(buffer);
    _bufferutils2.default.makeImpulse(buffer, 0, 0);
    _bufferutils2.default.makeImpulse(buffer, 1, 10);

    /// create a buffer source
    var bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    var biquadNode = audioContext1.createBiquadFilter();

    /// configure the biquad filter
    {
        biquadNode.type = "lowpass";

        /// It is expressed in dB, has a default value of 0 and can take a value in a nominal range of -40 to 40
        biquadNode.gain.value = 10;

        /// measured in hertz (Hz)
        biquadNode.frequency.value = 1000;

        /// It is a dimensionless value with a default value of 1 and a nominal range of 0.0001 to 1000.
        biquadNode.Q.value = 10;
    }

    /// connect the node to the buffer source
    bufferSource.connect(biquadNode);

    /// connect the node to the destination of the audio context
    biquadNode.connect(audioContext1.destination);

    /// prepare the rendering
    var localTime = 0;
    bufferSource.start(localTime);

    /// receive notification when the rendering is completed
    audioContext1.oncomplete = function (output) {

        var buf = output.renderedBuffer;

        var bufUrl = _bufferutils2.default.writeBufferToTextFileWithMatlabFormat(buf);
        console.log("buffer URL :  " + bufUrl);

        debugger;
    };

    /// start rendering
    audioContext1.startRendering();
}

/// @n technique pour avoir un pseudo-namespace
/**
 * Some test functions
 * For debug purposes only
 */

var biquadtests = {
    testBiquadNode: testBiquadNode
};

exports.default = biquadtests;
},{"../core/bufferutils.js":1}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testCascadeNode = testCascadeNode;

var _cascade = require('../dsp/cascade.js');

var _cascade2 = _interopRequireDefault(_cascade);

var _bufferutils = require('../core/bufferutils.js');

var _bufferutils2 = _interopRequireDefault(_bufferutils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
/**
 * Some test functions
 * For debug purposes only
 */

function testCascadeNode() {

    var sampleRate = 44100;
    var bufferSize = 512;
    var numChannels = 4;

    /// create an offline audio context
    var audioContext1 = new OfflineAudioContext(numChannels, bufferSize, sampleRate);

    /// create a test buffer
    var buffer = audioContext1.createBuffer(numChannels, bufferSize, sampleRate);

    /// just a precaution
    _bufferutils2.default.clearBuffer(buffer);
    _bufferutils2.default.makeImpulse(buffer, 0, 0);
    _bufferutils2.default.makeImpulse(buffer, 1, 10);

    /// create a buffer source
    var bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    var cascadeNode = new M4DPAudioModules.CascadeNode(audioContext1);

    /// configure the cascade filter
    {
        cascadeNode.numCascades = 2;

        cascadeNode.setType(0, "peaking");
        cascadeNode.setType(1, "peaking");

        /// It is expressed in dB, has a default value of 0 and can take a value in a nominal range of -40 to 40
        cascadeNode.setGain(0, 6);
        cascadeNode.setGain(1, 6);

        /// measured in hertz (Hz)
        cascadeNode.setFrequency(0, 1000);
        cascadeNode.setFrequency(1, 8000);

        /// It is a dimensionless value with a default value of 1 and a nominal range of 0.0001 to 1000.
        cascadeNode.setQ(0, 10);
        cascadeNode.setQ(1, 10);
    }

    /// connect the node to the buffer source
    bufferSource.connect(cascadeNode.input);

    /// connect the node to the destination of the audio context
    cascadeNode._output.connect(audioContext1.destination);

    cascadeNode.bypass = true;

    /// prepare the rendering
    var localTime = 0;
    bufferSource.start(localTime);

    /// receive notification when the rendering is completed
    audioContext1.oncomplete = function (output) {

        var buf = output.renderedBuffer;

        var bufUrl = _bufferutils2.default.writeBufferToTextFileWithMatlabFormat(buf);
        console.log("buffer URL :  " + bufUrl);

        debugger;
    };

    /// start rendering
    audioContext1.startRendering();
}

/// @n technique pour avoir un pseudo-namespace
var cascadetests = {
    testCascadeNode: testCascadeNode
};

exports.default = cascadetests;
},{"../core/bufferutils.js":1,"../dsp/cascade.js":5}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getHrir = getHrir;
exports.testHrtfFromSofaServer = testHrtfFromSofaServer;

var _utils = require('../core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

var _binaural = require('binaural');

var _binaural2 = _interopRequireDefault(_binaural);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// IRC_1147, COMPENSATED, 44.1 kHz
// left ear, navigation = [-30 , 0]
/**
 * Some test functions for SOFA
 * For debug purposes only
 */

function getLeftTestBuffer() {

	var l_hrir_1 = [1.4132325e-05, -0.00028193564, 0.00067406708, -0.0015438328, 0.002343185, -0.0042546899, 0.0056989877, -0.008909386, 0.013256035, -0.023441048, 0.087901132, 0.11658128, -0.35129103, 0.19038613, -0.2640219, 0.10525886, 0.57169504, -0.092018661, 0.42129788, -0.065709863, -0.07198246, -0.12831281, -0.020194215, -0.086181897, 0.062725271, -0.064106033, -0.01786496, 0.005976978, 0.028849113, -0.078114624, 0.026099128, -0.087937849, 0.0065339186, 0.05093279, 0.030594884, 0.039333248, 0.01397383, 0.015451287, -0.0063663534, -0.031407839, -0.047616841, -0.05624593, -0.076982806, -0.045545539, -0.027926149, 0.0096117733, -0.019553812, -0.0053279059, -0.00072523411, -0.0042109865, 0.007578094, 0.00087990009, -0.0090000561, -0.0025798772, -0.012783602, -0.01307241, -0.008798917, -0.0022054303, -0.0012807811, -0.011876543, -0.0065112824, -0.0027094041, -0.00077164441, 0.0047712326, -0.0091772907, -0.00011162587, -0.0087647848, -0.0019659258, -0.0077792026, 0.0019471927, -0.011084985, -0.0031365027, -0.0081186278, -0.0040242879, 0.018169449, -0.017944612, -0.02320988, 0.025028598, -0.01209448, 0.0140731, 0.025226283, -0.0044313805, -0.02983553, -0.028062748, 0.02292914, -0.0073565672, -0.062286153, -0.016325469, -0.021853672, -0.025748605, 0.039503251, -0.0071338104, -0.012957448, 0.0027250638, 0.00057076822, 0.0088403969, 0.0070754822, 0.0017877444, -0.011529959, -0.0060916068, 0.00039970116, -0.004718351, 0.0021941501, 0.0073960195, 0.0078633152, -0.0037722073, -0.0020280923, 0.0024727472, 0.0040769741, -0.0088956118, -0.013589519, -0.015253273, -0.016183901, -0.014050537, -0.00077704794, -0.010080476, -0.0081755161, -0.00013398205, -0.0011617567, -0.0032983648, 0.001784743, -0.001853997, 0.00086518345, -0.00080255618, -0.0032587134, -0.006735632, -0.0039407294, -0.0023791482, -0.0023593784, -0.004234867, -0.0021589755, -0.0020311512, 0.0028884383, 0.0036012488, 0.0014631257, 0.0018751034, 0.0017227931, 0.00051738804, 0.0021896845, 0.00049943606, 1.0966705e-05, 0.00037674853, -0.00035357145, -0.00014751668, 0.00028273055, 0.0015553956, 0.0014225591, 0.00027374144, 6.608697e-05, 0.00088551602, -0.00023514595, 0.0010984583, -0.00060469367, -0.00070795743, -0.00031130607, -0.00060267295, 0.00023590805, 6.9737479e-05, 0.00020767466, 0.0008352928, 0.00079262047, 0.00097429446, 0.00080321626, 0.00070339281, 0.0015355398, 0.001640927, 0.0018574026, 0.0025194618, 0.0022518159, 0.002439559, 0.0025438101, 0.0025306775, 0.0012282241, 0.00076979102, 0.0016917955, 0.00020163211, 0.0013003565, 0.0011392531, 0.00034046515, 0.00092837517, 0.0013007193, 0.0025138302, 0.00225188, 0.00037036302, 0.0012363485, 0.001418706, -0.00033464148, -0.0011334823, -0.0023804675, -0.00084712007, 0.00047495138, -0.00088687785, -0.0008213348, -0.0015033938, -0.00034491047, 0.0028352889, 0.0015820507, -0.00045588497, 0.0019047109, 0.0016433937, 0.0023967951, 0.0030677286, 0.0016212255, 0.00067536607, 0.00056772145, 0.0023526029, 0.0023253294, 0.001265578, 0.0018626356, 0.0025865504, 0.0019152023, 0.0027284475, 0.0031230506, 0.0026063655, 0.0022076346, 0.0031534104, 0.0022533534, 0.002360121, 0.0023081289, 0.0015604217, 0.00028087266, 0.0012829569, 0.0025858152, 0.0024347331, 0.0024768574, 0.0019402217, 0.0019329428, 0.0017125467, 0.0021164292, 0.0023189209, 0.0022441678, 0.002281207, 0.0019270001, 0.0019101536, 0.0019457384, 0.0020941367, 0.0021620486, 0.0022751852, 0.002181841, 0.0021200512, 0.0021993275, 0.0022301065, 0.0022912639, 0.0023209664, 0.0023138248, 0.0022012276, 0.0022802624, 0.0023726213, 0.0023012339, 0.0023521343, 0.0023377394, 0.002329234, 0.0023337045, 0.0023899119, 0.0023956238, 0.0023943337, 0.0024504968, 0.0024591743, 0.002379553, 0.0023931324, 0.0024138623, 0.0024429628, 0.0024506776, 0.0024294081, 0.0025010581, 0.0024492333, 0.0024117822, 0.0025161464, 0.0024681916, 0.0024792035, 0.0025135702, 0.002509866, 0.0024992894, 0.0023943188, 0.0024773506, 0.0025059016, 0.0024466945, 0.0025561351, 0.0024834416, 0.0024270383, 0.0025362142, 0.0024925992, 0.0025092834, 0.0025545123, 0.0024576699, 0.0024201599, 0.0024324636, 0.002444449, 0.0024545475, 0.0024346217, 0.0024273692, 0.0024091401, 0.0024106196, 0.0024468292, 0.0024578748, 0.0025000462, 0.0025032307, 0.0024541375, 0.0024677904, 0.0024722175, 0.0024659798, 0.0024948565, 0.0024845532, 0.0024656299, 0.0024793853, 0.0024802626, 0.0024924863, 0.0024986545, 0.0025015132, 0.0024999871, 0.0024926892, 0.002497768, 0.0024802209, 0.0024757889, 0.0024738991, 0.0024496608, 0.0024471857, 0.0024370001, 0.0024280072, 0.0024337007, 0.0024232517, 0.0024193624, 0.0024188729, 0.0024099797, 0.0024108243, 0.0024010682, 0.0023983161, 0.0023935951, 0.0023798536, 0.0023811779, 0.0023638962, 0.0023584906, 0.0023653113, 0.0023514024, 0.0023506768, 0.002346809, 0.0023374804, 0.0023433229, 0.002335763, 0.0023318705, 0.0023264555, 0.002316075, 0.0023173819, 0.0023068362, 0.0023026365, 0.0023019171, 0.0022877156, 0.0022910339, 0.0022854109, 0.0022738959, 0.0022733597, 0.0022602595, 0.0022586726, 0.0022559675, 0.0022442002, 0.002240857, 0.0022253136, 0.0022201978, 0.0022185263, 0.0022005082, 0.0021990985, 0.0021900658, 0.0021771229, 0.0021779418, 0.0021645466, 0.0021572173, 0.0021508015, 0.0021399013, 0.0021412745, 0.0021259733, 0.002116817, 0.002115298, 0.0021022752, 0.0021016962, 0.0020932519, 0.0020825594, 0.002081538, 0.0020692666, 0.0020663853, 0.0020613294, 0.0020515068, 0.0020524276, 0.0020412507, 0.0020334773, 0.0020275079, 0.0020184131, 0.0020162555, 0.0020037346, 0.0019976744, 0.0019928761, 0.0019750451, 0.0019736669, 0.0019652988, 0.0019522491, 0.0019495258, 0.0019341785, 0.0019279217, 0.0019206054, 0.0019060989, 0.0019051637, 0.0018904792, 0.0018807618, 0.0018779237, 0.0018601919, 0.0018578088, 0.0018488808, 0.0018353839, 0.0018325771, 0.0018178601, 0.0018132888, 0.0018066897, 0.0017923985, 0.001791381, 0.0017780474, 0.0017700043, 0.0017673612, 0.0017524239, 0.0017501613, 0.0017394455, 0.0017276664, 0.0017270026, 0.0017126261, 0.0017079723, 0.0017010197, 0.0016870315, 0.0016859443, 0.0016727244, 0.0016656708, 0.001661932, 0.0016466513, 0.0016445389, 0.0016333183, 0.0016223732, 0.0016213635, 0.0016064604, 0.0016017837, 0.0015940824, 0.001580486, 0.0015792676, 0.0015656264, 0.0015588572, 0.0015541604, 0.0015389375, 0.0015372586, 0.001525836, 0.0015157399, 0.0015137158, 0.0014985183, 0.0014950168, 0.001486801, 0.0014739018, 0.0014729755, 0.001458909, 0.0014526821, 0.0014479139, 0.0014332436, 0.0014318913, 0.0014202454, 0.0014109932, 0.0014086943, 0.0013935839, 0.0013909494, 0.0013824579, 0.0013702119, 0.0013694038, 0.0013553578, 0.0013499712, 0.0013449543, 0.001331045, 0.0013301002, 0.0013183484, 0.0013100663, 0.0013074225, 0.0012931439, 0.0012909019, 0.0012825466, 0.0012704581, 0.0012711589, 0.0012547963, 0.0012541793, 0.0012432118, 0.001260351, 0.0012651742, 0.0011898277, 0.0012121985, 0.0011467912, 0.001190836, 0.0012960485, 0.0012957851, 0.00137487, 0.0013533976, 0.0013261806, 0.0012895107, 0.0012720223, 0.0012509781, 0.0012517398, 0.0012316866, 0.0012200168, 0.0012147902, 0.0012115598, 0.0011884508, 0.0011828257, 0.0011572048, 0.001152301, 0.0011577943, 0.0011595037, 0.0011610896, 0.0011592228, 0.0011544405, 0.001145801, 0.0011302032, 0.0011103414, 0.0010884807, 0.0010624005, 0.0010437097, 0.0010316636, 0.0010250325, 0.0010146388, 0.0010063865, 0.00099888219, 0.00099232371, 0.00098659229, 0.00098013715, 0.00097178101, 0.00096331966, 0.00095429316, 0.00094382654, 0.0009352253, 0.000928641, 0.00092058906, 0.00091184622, 0.00090372161, 0.00089591584, 0.00089065344, 0.00088376279, 0.00087615295, 0.00086932036, 0.0008604701, 0.00085405582, 0.00084575095, 0.00083930525, 0.00083122509, 0.00082305679, 0.00081547156, 0.00080905689, 0.00080592979, 0.00079543327, 0.00078491522, 0.00078376031, 0.0007756691, 0.00077368799, 0.00077327282, 0.00076556101, 0.00075145489, 0.00074082488, 0.00073907934, 0.00072966698, 0.00070942925, 0.00069919749, 0.0006867929, 0.00067751247, 0.00067955473, 0.00067219669, 0.00066383089, 0.00065863181, 0.00065346753, 0.00065020049, 0.00064618855, 0.00064087363, 0.00063238562, 0.00062573618, 0.00061997955, 0.00061362004, 0.00060894745, 0.00060553288, 0.00060170954, 0.00059567854, 0.00058975548, 0.00058542346, 0.00058062076, 0.00057298977, 0.00056428224, 0.00055498824, 0.00054558277, 0.00053744366, 0.00053149546, 0.00052403183, 0.00051707499, 0.00051189146, 0.00050656558, 0.00050090136, 0.00049627311, 0.00049104949, 0.00048623429, 0.00048118162, 0.00047532785, 0.00046889154, 0.00046317813, 0.00045773227, 0.00045237058, 0.0004466226, 0.00044135139, 0.00043641006, 0.00043250529, 0.00042879763, 0.00042465621, 0.00042055884, 0.00041652026, 0.00041218941, 0.00040826413, 0.00040395274, 0.00039951655, 0.00039525394, 0.00039078628, 0.00038639563, 0.00038227564, 0.00037828917, 0.00037441069, 0.00037022621, 0.00036604239, 0.00036207505, 0.0003578722, 0.00035394471, 0.00034969687, 0.00034539505, 0.0003412672, 0.00033708113, 0.00033309664, 0.00032914256, 0.00032521773, 0.00032150832, 0.00031779163, 0.00031413383, 0.00031048266, 0.00030680773, 0.00030341003, 0.00030003638, 0.00029674968, 0.00029367275, 0.00029049759, 0.00028744553, 0.00028444402, 0.00028136304, 0.00027806757, 0.00027467924, 0.00027143576, 0.00026800854, 0.00026475314, 0.00026150194, 0.00025813242, 0.00025484846, 0.00025180255, 0.00024899565, 0.00024608272, 0.00024285408, 0.00023978163, 0.00023673459, 0.00023331418, 0.00022963275, 0.0002257992, 0.00022234468, 0.00021914099, 0.00021570684, 0.00021224273, 0.00020869845, 0.00020556199, 0.00020309383, 0.00020029842, 0.00019717804, 0.00019456944, 0.00019195216, 0.00018957534, 0.00018729103, 0.00018468716, 0.00018187886, 0.00017913337, 0.0001767945, 0.00017444766, 0.00017188919, 0.00016952782, 0.00016730299, 0.00016499683, 0.00016290001, 0.00016089583, 0.0001587657, 0.00015662962, 0.00015466079, 0.0001525357, 0.00015044904, 0.00014833481, 0.00014602587, 0.00014348439, 0.0001412355, 0.00013927063, 0.00013732575, 0.00013536514, 0.00013331278, 0.00013127103, 0.00012920522, 0.00012725748, 0.00012537265, 0.00012348115, 0.00012161244, 0.00011968064, 0.00011775736, 0.00011587425, 0.00011402996, 0.00011222746, 0.00011047156, 0.00010869748, 0.00010694134, 0.00010521547, 0.00010350794, 0.00010184013, 0.00010019222, 9.8557534e-05, 9.6916422e-05, 9.5311094e-05, 9.3737256e-05, 9.2167319e-05, 9.0626551e-05, 8.9097008e-05, 8.7580795e-05, 8.6084446e-05, 8.4610097e-05, 8.3161151e-05, 8.1725966e-05, 8.0316477e-05, 7.892995e-05, 7.7528984e-05, 7.6151177e-05, 7.4799664e-05, 7.3461694e-05, 7.2146308e-05, 7.0841689e-05, 6.9558749e-05, 6.82868e-05, 6.7019597e-05, 6.5789212e-05, 6.4566799e-05, 6.3354135e-05, 6.216748e-05, 6.0995697e-05, 5.9826548e-05, 5.8656867e-05, 5.7517682e-05, 5.6391344e-05, 5.5275024e-05, 5.4191468e-05, 5.3104781e-05, 5.202328e-05, 5.097535e-05, 4.9930884e-05, 4.8906517e-05, 4.7901965e-05, 4.6887109e-05, 4.5878057e-05, 4.488247e-05, 4.3901135e-05, 4.2938161e-05, 4.1980499e-05, 4.1033143e-05, 4.0097034e-05, 3.916836e-05, 3.8263505e-05, 3.7376392e-05, 3.6508509e-05, 3.5654459e-05, 3.4799873e-05, 3.3958385e-05, 3.3132592e-05, 3.2315845e-05, 3.1518549e-05, 3.0730051e-05, 2.9946272e-05, 2.9178726e-05, 2.8422964e-05, 2.7681325e-05, 2.6953193e-05, 2.62361e-05, 2.5528081e-05, 2.4829963e-05, 2.4143857e-05, 2.3464886e-05, 2.2794801e-05, 2.2134406e-05, 2.1477402e-05, 2.0830966e-05, 2.019298e-05, 1.9562312e-05, 1.8944459e-05, 1.8332188e-05, 1.7728731e-05, 1.7137224e-05, 1.655181e-05, 1.5977265e-05, 1.5410854e-05, 1.4850332e-05, 1.4300358e-05, 1.3756461e-05, 1.3221478e-05, 1.2693428e-05, 1.2171671e-05, 1.1660745e-05, 1.115659e-05, 1.0660526e-05, 1.0173886e-05, 9.6936033e-06, 9.2226845e-06, 8.7595274e-06, 8.3036173e-06, 7.8561784e-06, 7.414669e-06, 6.9817113e-06, 6.5547767e-06, 6.1347073e-06, 5.7237002e-06, 5.3179345e-06, 4.9207513e-06, 4.5308335e-06, 4.1452405e-06, 3.7681377e-06, 3.3965984e-06, 3.0319377e-06, 2.6755198e-06, 2.322879e-06, 1.9769963e-06, 1.6361625e-06, 1.3011104e-06, 9.7374029e-07, 6.4954342e-07, 3.3154137e-07, 1.9555108e-08, -2.8850005e-07, -5.8860957e-07, -8.8453573e-07, -1.1758724e-06, -1.4609756e-06, -1.7420382e-06, -2.0155012e-06, -2.2851187e-06, -2.5506943e-06, -2.8093978e-06, -3.0646216e-06, -3.3135098e-06, -3.5566563e-06, -3.7963791e-06, -4.0294944e-06, -4.2588645e-06, -4.48314e-06, -4.7011579e-06, -4.9152947e-06, -5.1229738e-06, -5.3266195e-06, -5.5266958e-06, -5.7215527e-06, -5.9119823e-06, -6.097324e-06, -6.2789952e-06, -6.4566069e-06, -6.6295672e-06, -6.8005867e-06, -6.9661368e-06, -7.1275151e-06, -7.2866647e-06, -7.4406839e-06, -7.5927009e-06, -7.7408537e-06, -7.8845557e-06, -8.0264568e-06, -8.1632978e-06, -8.2977973e-06, -8.4301417e-06, -8.5568669e-06, -8.6824851e-06, -8.8041358e-06, -8.9217352e-06, -9.0381256e-06, -9.150212e-06, -9.2597435e-06, -9.3660792e-06, -9.4686523e-06, -9.5693644e-06, -9.6663171e-06, -9.7606456e-06, -9.852218e-06, -9.9398596e-06, -1.0025643e-05, -1.0107832e-05, -1.0188117e-05, -1.0265668e-05, -1.0339241e-05, -1.0411657e-05, -1.0480168e-05, -1.0546331e-05, -1.0611318e-05, -1.0671897e-05, -1.0731203e-05, -1.0787938e-05, -1.0840991e-05, -1.089383e-05, -1.0942747e-05, -1.098984e-05, -1.1035688e-05, -1.1077302e-05, -1.111831e-05, -1.1157191e-05, -1.1192876e-05, -1.122799e-05, -1.126004e-05, -1.1290234e-05, -1.1318981e-05, -1.1345133e-05, -1.1370284e-05, -1.139272e-05, -1.1413761e-05, -1.1433097e-05, -1.1450233e-05, -1.1466382e-05, -1.1479952e-05, -1.1492275e-05, -1.1503153e-05, -1.1511377e-05, -1.1519723e-05, -1.1525182e-05, -1.1528944e-05, -1.1532651e-05, -1.153272e-05, -1.1532863e-05, -1.153163e-05, -1.1527603e-05, -1.1528536e-05, -1.152206e-05, -1.1511412e-05, -1.1510731e-05, -1.1484279e-05, -1.1502042e-05, -1.1444652e-05, -1.1496561e-05, -1.1401e-05, -1.1300933e-05];

	return l_hrir_1;
}

// IRC_1147, COMPENSATED, 44.1 kHz
// right ear, navigation = [-30 , 0]
function getRightTestBuffer() {

	var r_hrir_1 = [0.00012968447, -4.4833788e-05, 8.5615178e-05, 5.2901694e-05, -6.6440116e-06, 0.00023888806, -2.8313273e-05, -4.2645389e-06, 0.00012126938, -2.1980022e-05, -2.1957093e-06, 0.00011809272, 2.6500596e-05, 7.0864197e-05, 0.00011691406, -0.00026727003, 0.00038585979, -0.00087029932, 0.0010163673, -0.0016523712, 0.0023054694, -0.0029419215, 0.02964541, 0.0060411226, -0.06344479, 0.027112967, -0.0080826665, -0.019840752, 0.11743281, 0.042333728, 0.034297803, 0.094531388, 0.037250009, -0.0037743261, -0.0094662558, 0.0074441826, -0.002948507, -0.036766379, -0.0034563663, 0.016807154, -0.014027366, 0.0035911231, 0.0018989791, 0.013578715, 0.014343985, 0.010805275, 0.0017550988, 0.0074502748, 0.0035782603, -0.006502539, 0.0055554395, -0.0051867008, -0.0077680597, -0.00063252901, -0.0098461853, -0.011175415, -0.0053015536, -0.0081243965, -0.012826758, -0.021176968, -0.020040944, -0.008780459, -0.007149576, -0.0023101265, -0.0079937236, -0.0048443179, -0.0068382159, -0.0078493971, -0.0023994799, -0.0061057738, -0.0073136081, -0.0023773567, -0.0059973386, -0.0054297321, -0.001735636, -0.0052404751, -0.00048804818, -0.0022025927, -0.00099874898, 0.0064416961, -0.013730736, -0.0047333692, 0.0062401785, -0.0058429281, 0.0010514925, -0.002056349, -0.0030489554, -0.011757925, -0.0052199476, -0.0095679235, 0.0071277114, -0.019357755, -0.022061019, -0.0017161931, -0.0093587057, -0.0079322517, 0.009942682, -0.01321086, -0.0052761264, 0.00072435802, -0.0027481885, -7.5230251e-05, -0.00022060311, -0.014667933, -0.0030626816, -0.0026752634, -0.012888399, -0.018657888, -0.011077874, -0.016408245, -0.0095450282, -0.0046633224, -0.0055801768, -0.0083926211, -0.0031749941, -0.0054011488, -0.0030097948, -0.0023267575, 7.9327681e-05, -0.0015963236, -0.00097387318, 6.2268467e-05, -0.00040731921, 0.00036794444, 0.0016603111, 0.00086353469, -0.0005586378, -0.0033754013, -0.0021049967, -0.00073923132, 0.0012426978, 0.00048173329, -0.0013443229, -0.0032725884, -0.0019374721, 0.00055878145, 0.00010709605, -0.0023751592, -0.0031964437, -0.003138411, -0.003779512, -0.0023188085, -0.0027534361, -0.0032227256, -0.0027060221, -0.0009767624, -0.00029449009, -0.0015156205, -0.0016212052, -0.00083772424, -0.00051142355, -0.00087454151, -0.00082778176, -0.00087696032, -0.0005240417, -0.0010908106, -0.00060439314, 0.00049582734, -0.00022234685, -0.001076809, -0.0011043286, 0.00010021065, 0.0003510776, 0.00054787386, -0.00015454513, -0.00027695372, 0.00059145676, -0.00092269794, 0.00038142433, 0.0026431155, 0.0017825192, -0.0016865821, 0.00040997076, 0.00031288566, 0.0011209374, -0.00056213687, -0.0021413163, -0.00048407112, 0.0015524018, 0.00099149104, -0.0015391124, 2.3607917e-05, 0.00063025081, 0.0020399874, 0.0011285819, -0.00023675074, -0.0013372991, 0.0011111901, 0.00058305655, -0.00095981433, -0.0024444119, -0.0022328691, -0.0020971316, -0.0020945863, -0.0012388034, -0.0005692108, -0.0014941334, -0.0013966204, 0.00038663071, -6.5744303e-05, -0.0002194957, 0.00036541771, -0.00078601483, -0.00069451153, 0.0003469499, 0.00075997592, 7.4945015e-05, 0.00098961018, 0.001622136, 0.0011897596, 0.0016066994, 0.0018443016, 0.0010589289, 0.00090713392, 0.00090913781, 0.00099631402, 0.00069363213, 0.0007172969, 0.00069799042, 0.00065530833, 0.00044603324, 0.00023525355, 0.00082289652, 0.00083974303, 0.00072033696, 0.0010272059, 0.000694426, 0.00061945878, 0.00072450046, 0.00067908585, 0.00087421185, 0.00067820348, 0.00061537406, 0.00056530067, 0.00060326247, 0.00061357627, 0.00058757944, 0.00066320578, 0.00066578856, 0.0006869487, 0.00073921523, 0.00079197216, 0.00084638441, 0.00096455355, 0.00096418034, 0.00095147682, 0.0010188184, 0.0010686564, 0.0011374242, 0.0011457252, 0.0012067451, 0.0012186938, 0.0012421307, 0.0012696035, 0.0012774542, 0.0012976373, 0.0013118302, 0.0012846557, 0.0012700042, 0.0012938418, 0.0012889062, 0.0013061971, 0.0013155606, 0.0013232455, 0.0013150025, 0.0013273987, 0.0013581082, 0.0013455696, 0.0013849935, 0.0014073932, 0.0013834305, 0.0013974272, 0.0014054978, 0.001392369, 0.0014238558, 0.0014348065, 0.0014331656, 0.0014592002, 0.001429469, 0.0014245059, 0.0014917667, 0.0014767126, 0.0014466019, 0.0014673353, 0.0014431901, 0.0014458889, 0.0014635539, 0.0014462352, 0.0014721369, 0.0014880508, 0.0014736709, 0.0014981523, 0.0015268875, 0.0015316907, 0.0015510023, 0.001574997, 0.0015802422, 0.0015923924, 0.0016238457, 0.0016247143, 0.0016264677, 0.0016500061, 0.0016575305, 0.001662676, 0.0016788868, 0.0016853736, 0.0016765222, 0.0016853522, 0.0016938253, 0.0016920553, 0.0016955402, 0.0016963586, 0.0016859962, 0.0016794113, 0.0016723978, 0.0016749097, 0.0016734549, 0.0016646565, 0.0016590366, 0.0016597643, 0.0016601148, 0.0016602048, 0.0016601534, 0.0016631011, 0.001663515, 0.0016633881, 0.0016665934, 0.001669197, 0.0016774124, 0.0016837142, 0.0016842757, 0.0016877638, 0.0016939821, 0.0016994184, 0.001704174, 0.0017107124, 0.0017185124, 0.0017214578, 0.0017231655, 0.0017248615, 0.0017275463, 0.0017321063, 0.0017319864, 0.001728176, 0.0017290723, 0.001726488, 0.001726774, 0.0017281492, 0.0017259034, 0.0017235558, 0.0017225531, 0.0017206711, 0.0017192281, 0.0017192947, 0.0017164425, 0.0017155723, 0.0017187522, 0.0017162077, 0.0017077174, 0.0017105726, 0.0017124353, 0.0017108461, 0.0017082778, 0.0017029993, 0.001701386, 0.0017012992, 0.0016966711, 0.001694226, 0.0016932734, 0.001689505, 0.0016867262, 0.001684639, 0.0016828094, 0.0016824862, 0.0016824416, 0.0016792258, 0.0016755921, 0.0016750747, 0.0016737919, 0.0016706676, 0.0016711408, 0.001671641, 0.001669541, 0.0016663534, 0.0016652009, 0.0016671451, 0.0016648808, 0.0016614346, 0.0016610357, 0.0016564142, 0.0016528732, 0.0016520689, 0.0016475924, 0.0016431885, 0.0016403089, 0.0016362902, 0.0016310136, 0.0016278932, 0.0016257612, 0.0016203349, 0.0016152911, 0.0016118715, 0.0016073313, 0.0016030659, 0.0015986747, 0.0015933165, 0.0015895632, 0.001584777, 0.0015796373, 0.0015765975, 0.0015718899, 0.0015669377, 0.0015633044, 0.0015585903, 0.001554603, 0.0015505579, 0.0015465482, 0.0015428877, 0.0015381819, 0.0015346206, 0.001530824, 0.0015269124, 0.0015239447, 0.0015195987, 0.0015159148, 0.0015124543, 0.0015083753, 0.0015050984, 0.0015010558, 0.0014971819, 0.001493347, 0.0014887044, 0.001484724, 0.0014803579, 0.0014760734, 0.0014717858, 0.0014666051, 0.0014623749, 0.0014575611, 0.0014525443, 0.0014484185, 0.0014431992, 0.0014385824, 0.0014340053, 0.0014286917, 0.0014243781, 0.0014194645, 0.0014146681, 0.0014103174, 0.0014051177, 0.0014007867, 0.0013960355, 0.0013911306, 0.0013871143, 0.0013820917, 0.0013777034, 0.0013732681, 0.0013682012, 0.0013641619, 0.0013593904, 0.0013547699, 0.0013505959, 0.0013456026, 0.0013413429, 0.0013367484, 0.0013320703, 0.0013279857, 0.0013232181, 0.0013190107, 0.001314463, 0.0013097356, 0.0013058519, 0.0013010446, 0.0012967476, 0.0012925999, 0.0012876908, 0.0012837795, 0.0012791685, 0.0012746597, 0.0012708011, 0.0012658884, 0.0012617699, 0.0012575065, 0.0012527556, 0.0012488655, 0.0012441726, 0.0012397652, 0.0012356095, 0.0012307267, 0.001226769, 0.0012220057, 0.0012176242, 0.001213742, 0.0012124143, 0.0012074452, 0.0011971156, 0.0011951736, 0.001189256, 0.0011852494, 0.0011937217, 0.0011946776, 0.001195935, 0.001202345, 0.001202101, 0.0011973804, 0.0011921972, 0.0011886733, 0.0011833686, 0.001175074, 0.0011707554, 0.001167823, 0.0011622943, 0.0011582985, 0.0011544876, 0.0011518865, 0.0011493143, 0.0011462351, 0.0011422655, 0.0011387751, 0.0011347149, 0.0011297663, 0.0011258477, 0.0011207866, 0.0011155495, 0.0011108386, 0.0011051477, 0.0010993477, 0.0010942124, 0.001088599, 0.0010823677, 0.0010752187, 0.0010683608, 0.0010626757, 0.0010574017, 0.0010524184, 0.0010469693, 0.0010418095, 0.0010363114, 0.001030947, 0.0010260291, 0.0010206907, 0.0010153807, 0.0010104217, 0.001005132, 0.0010000609, 0.0009951667, 0.00099010484, 0.00098554187, 0.00098062861, 0.00097624493, 0.00097210414, 0.00096603669, 0.00096123183, 0.00095712158, 0.00095211179, 0.00094763708, 0.000942872, 0.00093784114, 0.00093202446, 0.00092668947, 0.00092138784, 0.00091725714, 0.00091029231, 0.00090345699, 0.00089853564, 0.00089283046, 0.00088775093, 0.00088399884, 0.00087807413, 0.00087303247, 0.00086855006, 0.00086375685, 0.00085936393, 0.00085453323, 0.00084852814, 0.00084367115, 0.00083871297, 0.00083252788, 0.0008259946, 0.00081998583, 0.00081365626, 0.00080813276, 0.00080309055, 0.00079792392, 0.00079265161, 0.00078779632, 0.00078283065, 0.00077811576, 0.00077350782, 0.00076919383, 0.00076470019, 0.00076030412, 0.00075604884, 0.00075171767, 0.00074753595, 0.00074352061, 0.00073937133, 0.00073505314, 0.00073048249, 0.00072601349, 0.00072178833, 0.00071778192, 0.00071366474, 0.00070934348, 0.00070483403, 0.00070050811, 0.0006964801, 0.00069237485, 0.00068798633, 0.00068355492, 0.00067907319, 0.00067457917, 0.00067028375, 0.00066589849, 0.00066150117, 0.00065722842, 0.0006530973, 0.00064908157, 0.00064495545, 0.0006408145, 0.00063680572, 0.00063281742, 0.00062879181, 0.00062482539, 0.00062084226, 0.00061691144, 0.00061295354, 0.00060904914, 0.00060527795, 0.00060145801, 0.00059752487, 0.00059364015, 0.00058991089, 0.00058618791, 0.00058252286, 0.00057879214, 0.0005750773, 0.00057143506, 0.00056767413, 0.00056408052, 0.00056077747, 0.00055729632, 0.00055352011, 0.00054997564, 0.00054641851, 0.00054295684, 0.00053931331, 0.00053551895, 0.00053195492, 0.00052863606, 0.00052517081, 0.00052153565, 0.00051806077, 0.00051469329, 0.00051148616, 0.00050816332, 0.00050466961, 0.00050115617, 0.00049787153, 0.00049453044, 0.00049103215, 0.0004873464, 0.00048372139, 0.00048013208, 0.00047655406, 0.00047310396, 0.00046973281, 0.0004662385, 0.00046284334, 0.00045962747, 0.00045637374, 0.0004531491, 0.00044995436, 0.00044665298, 0.00044342175, 0.00044029465, 0.00043722386, 0.00043412649, 0.00043111871, 0.00042820065, 0.00042527698, 0.0004223964, 0.0004195497, 0.00041663902, 0.00041369662, 0.0004107952, 0.00040790928, 0.00040499581, 0.0004021129, 0.00039922476, 0.00039633879, 0.00039346665, 0.00039057125, 0.00038775961, 0.00038497593, 0.0003821672, 0.00037941674, 0.00037665518, 0.00037388251, 0.00037114418, 0.00036842017, 0.00036570402, 0.00036300561, 0.00036030492, 0.00035760887, 0.00035494213, 0.00035227235, 0.00034961568, 0.00034700292, 0.00034437986, 0.0003417836, 0.00033921813, 0.00033664253, 0.00033410688, 0.00033160594, 0.0003291026, 0.00032662405, 0.00032416444, 0.0003217087, 0.00031929489, 0.00031688918, 0.00031450056, 0.00031213764, 0.00030977467, 0.00030742997, 0.00030512027, 0.00030280236, 0.00030050895, 0.00029823527, 0.00029594522, 0.0002936886, 0.00029145057, 0.00028921501, 0.00028700329, 0.00028480171, 0.00028259936, 0.00028043082, 0.00027826905, 0.00027611871, 0.00027399472, 0.00027186925, 0.00026975794, 0.00026767713, 0.00026558941, 0.00026352268, 0.00026148016, 0.00025942513, 0.00025740035, 0.00025539348, 0.00025338586, 0.00025139981, 0.00024942823, 0.00024745722, 0.00024551216, 0.00024357175, 0.00024164119, 0.00023973128, 0.00023781952, 0.00023592309, 0.00023405476, 0.00023218314, 0.00023033034, 0.00022849847, 0.00022666017, 0.00022484975, 0.00022305538, 0.00022126774, 0.00021949982, 0.00021774036, 0.00021598884, 0.00021426317, 0.00021254069, 0.00021083331, 0.00020914501, 0.00020745475, 0.00020578273, 0.00020413285, 0.00020247995, 0.00020084592, 0.00019922805, 0.00019760386, 0.00019600417, 0.00019441597, 0.00019283158, 0.00019126355, 0.00018970019, 0.00018814285, 0.00018660839, 0.00018507457, 0.00018355261, 0.00018204726, 0.00018053906, 0.000179047, 0.00017757352, 0.00017609967, 0.00017464214, 0.0001731975, 0.00017174969, 0.00017032394, 0.00016890892, 0.00016750044, 0.00016610763, 0.00016471978, 0.00016333948, 0.00016198053, 0.0001606235, 0.0001592795, 0.00015795133, 0.00015662102, 0.00015530638, 0.00015400796, 0.00015271057, 0.00015142833, 0.00015015699, 0.00014888377, 0.00014762993, 0.00014638409, 0.00014514453, 0.00014391918, 0.0001426972, 0.00014148229, 0.00014028576, 0.00013908976, 0.00013790545, 0.00013673453, 0.00013556092, 0.00013440209, 0.00013325716, 0.00013211343, 0.00013098211, 0.00012986029, 0.00012873877, 0.00012763427, 0.00012653632, 0.00012544427, 0.00012436466, 0.00012328797, 0.00012221837, 0.00012116492, 0.00012011182, 0.00011906946, 0.00011803888, 0.00011700592, 0.00011598665, 0.00011497902, 0.00011397367, 0.00011297976, 0.00011199329, 0.00011100798, 0.00011003781, 0.00010907316, 0.00010811505, 0.00010716834, 0.00010622381, 0.0001052866, 0.00010436392, 0.00010344163, 0.00010252967, 0.00010162818, 0.00010072465, 9.9833587e-05, 9.8952038e-05, 9.8073177e-05, 9.720437e-05, 9.6341608e-05, 9.5480631e-05, 9.4632666e-05, 9.3788986e-05, 9.2951352e-05, 9.2123497e-05, 9.1297042e-05, 9.0477523e-05, 8.9670463e-05, 8.8862948e-05, 8.8064769e-05, 8.7275711e-05, 8.6484342e-05, 8.5704505e-05, 8.4932515e-05, 8.4163072e-05, 8.3402678e-05, 8.2647239e-05, 8.1893933e-05, 8.1152152e-05, 8.0413887e-05, 7.9681333e-05, 7.8957317e-05, 7.823448e-05, 7.7518487e-05, 7.6812958e-05, 7.6107688e-05, 7.541077e-05, 7.4721987e-05, 7.4031368e-05, 7.33513e-05, 7.2677937e-05, 7.2007493e-05, 7.1344966e-05, 7.0686699e-05, 7.0031075e-05, 6.9385528e-05, 6.8742952e-05, 6.8105745e-05, 6.7476069e-05, 6.6847278e-05, 6.6224915e-05, 6.5611424e-05, 6.4998486e-05, 6.4392835e-05, 6.3793885e-05, 6.3193822e-05, 6.2602985e-05, 6.2017607e-05, 6.1435065e-05, 6.0859425e-05, 6.0287094e-05, 5.9717572e-05, 5.9156751e-05, 5.8598236e-05, 5.8044791e-05, 5.7497848e-05, 5.6951554e-05, 5.641125e-05, 5.587837e-05, 5.5346481e-05, 5.4820933e-05, 5.4301001e-05, 5.3780738e-05, 5.3268445e-05, 5.2760811e-05, 5.2256002e-05, 5.1776413e-05, 5.1280016e-05, 5.0775267e-05, 5.031772e-05, 4.9771142e-05, 4.9407774e-05, 4.8752217e-05, 4.8548765e-05, 4.7756157e-05, 4.6932342e-05];

	return r_hrir_1;
}

//==============================================================================
/**
 * Returns the name of the database for a given IRCAM subject
 * @param {int} subjectNumber
 */
function getDatabaseFromSubjectId(subjectNumber) {

	if (1002 <= subjectNumber && subjectNumber <= 1059) {
		return "LISTEN";
	} else if (1062 <= subjectNumber && subjectNumber <= 1089) {
		return "CROSSMOD";
	} else if (1100 <= subjectNumber && subjectNumber <= 1157) {
		return "BILI";
	} else {
		throw new Error("Not a valid IRCAM human subject id " + subjectNumber);
	}
}

//==============================================================================
/**
 * Returns an audio buffer containing left/right HRIR
 * @param {int} subjectNumber
 * @param {float} samplerate
 * @param {float} azimuth : expressed with navigational (Spat4) convention
 * @param {float} elevation : expressed with navigational (Spat4) convention
 */
function getHrir(subjectNumber, samplerate, azimuth, elevation) {

	var subjectAsString = subjectNumber.toString();

	var positionsType = 'sofaSpherical';

	/// position expressed with Spat navigation system
	/// distance is not relevant; just use 1 meter
	var navigation = [azimuth, elevation, 1];

	/// convert Spat navigation to Sofa coordinates (spherical)
	var sofaCoordinates = [-1 * azimuth, elevation, 1];

	/// create an offline audio context
	var audioContext = new OfflineAudioContext(1, 512, samplerate);

	var hrtfSet = new _binaural2.default.sofa.HrtfSet({
		audioContext: audioContext,
		filterPositions: [sofaCoordinates],
		positionsType: positionsType
	});

	var serverDataBase = new _binaural2.default.sofa.ServerDataBase();

	return serverDataBase.loadCatalogue().then(function () {

		var urls = serverDataBase.getUrls({
			convention: 'HRIR',
			dataBase: 'BILI',
			equalisation: 'COMPENSATED',
			sampleRate: samplerate,
			freePattern: subjectAsString
		});

		return urls;
	}).then(function (urls) {

		if (urls.length <= 0) {
			throw new Error("no url");
		}

		return hrtfSet.load(urls[0]);
	}).then(function () {

		return hrtfSet.nearestFir(sofaCoordinates);
	});
}

//==============================================================================
function testHrtfFromSofaServer() {

	getHrir(1147, 44100, -30, 0).then(function (hrir) {
		var leftHrir = hrir.getChannelData(0);
		var rightHrir = hrir.getChannelData(1);

		var leftExpected = getLeftTestBuffer();
		var rightExpected = getRightTestBuffer();

		var tolerance = 1e-6;

		var leftAreEqual = _utils2.default.arrayAlmostEqual(leftHrir, leftExpected, tolerance);
		if (leftAreEqual === false) {
			new Error("test failed");
		}

		var rightAreEqual = _utils2.default.arrayAlmostEqual(rightHrir, rightExpected, tolerance);
		if (rightAreEqual === false) {
			new Error("test failed");
		}

		debugger;
	});
}

/// @n technique pour avoir un pseudo-namespace
var sofatests = {
	getHrir: getHrir,
	testHrtfFromSofaServer: testHrtfFromSofaServer
};

exports.default = sofatests;
},{"../core/utils.js":3,"binaural":29}],19:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileOverview Multi-source binaural panner.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Jean-Philippe.Lambert@ircam.fr
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @copyright 2016 IRCAM, Paris, France
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @license CECILL-2.1
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BinauralPanner = undefined;

var _Source = require('./Source');

var _Source2 = _interopRequireDefault(_Source);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BinauralPanner = exports.BinauralPanner = function () {
  function BinauralPanner() {
    _classCallCheck(this, BinauralPanner);
  }

  _createClass(BinauralPanner, [{
    key: 'contructor',
    value: function contructor() {
      var _this = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this._audioContext = options.audioContext;
      this._hrtfSet = options.hrtfSet;

      this._sources = options.sourcesPosition.map(function (position) {
        return new _Source2.default({
          audioContext: _this._audioContext,
          hrtfSet: _this._hrtfSet,
          position: position
        });
      });
    }
  }]);

  return BinauralPanner;
}();

exports.default = BinauralPanner;
},{"./Source":20}],20:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileOverview Source for binaural processing.
 * @author Jean-Philippe.Lambert@ircam.fr
 * @copyright 2016 IRCAM, Paris, France
 * @license CECILL-2.1
 */

var Source = exports.Source = function () {
  function Source() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Source);

    this._audioContext = options.audioContext;
    this._hrtfSet = options.hrtfSet;

    this._convolver = this._audioContext.createConvolver();
    this._convolver.normalize = false;

    if (typeof options.position !== 'undefined') {
      this.position = options.position;
    }
  }

  _createClass(Source, [{
    key: 'inputConnect',
    value: function inputConnect(nodesToConnect, output, input) {
      var _this = this;

      var nodes = typeof nodesToConnect[0] === 'undefined' ? [nodesToConnect] // single
      : nodesToConnect; // array
      nodes.forEach(function (node) {
        node.connect(_this._convolver, output, input);
      });

      return this;
    }
  }, {
    key: 'inputDisconnect',
    value: function inputDisconnect(nodesToDisconnect) {
      var _this2 = this;

      var nodes = typeof nodesToDisconnect[0] === 'undefined' ? [nodesToDisconnect] // single
      : nodesToDisconnect; // array

      nodes.forEach(function (node) {
        node.disconnect(_this2._convolver);
      });

      return this;
    }
  }, {
    key: 'outputConnect',
    value: function outputConnect(nodesToConnect, output, input) {
      var _this3 = this;

      var nodes = typeof nodesToConnect[0] === 'undefined' ? [nodesToConnect] // single
      : nodesToConnect; // array

      nodes.forEach(function (node) {
        _this3._convolver.connect(node, output, input);
      });

      return this;
    }
  }, {
    key: 'outputDisconnect',
    value: function outputDisconnect(nodesToDisconnect) {
      var _this4 = this;

      if (typeof nodesToDisconnect === 'undefined') {
        // disconnect all
        this._convolver.disconnect();
      } else {
        var nodes = typeof nodesToDisconnect[0] === 'undefined' ? [nodesToDisconnect] // single
        : nodesToDisconnect; // array

        nodes.forEach(function (node) {
          _this4._convolver.disconnect(node);
        });
      }

      return this;
    }
  }, {
    key: 'position',
    set: function set(positionRequest) {
      this._convolver.buffer = this._hrtfSet.nearestFir(positionRequest);
    }
  }]);

  return Source;
}();

exports.default = Source;
},{}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BinauralPanner = require('./BinauralPanner');

var _BinauralPanner2 = _interopRequireDefault(_BinauralPanner);

var _utilities = require('./utilities');

var _utilities2 = _interopRequireDefault(_utilities);

var _Source = require('./Source');

var _Source2 = _interopRequireDefault(_Source);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  BinauralPanner: _BinauralPanner2.default,
  Source: _Source2.default,
  utilities: _utilities2.default
};
},{"./BinauralPanner":19,"./Source":20,"./utilities":22}],22:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dBToLin = dBToLin;
exports.createNoiseBuffer = createNoiseBuffer;
exports.resampleFloat32Array = resampleFloat32Array;
/**
 * @fileOverview Audio utilities
 * @author Jean-Philippe.Lambert@ircam.fr
 * @copyright 2016 IRCAM, Paris, France
 * @license CECILL-2.1
 */

function dBToLin(dBValue) {
  var factor = 1 / 20;
  return Math.pow(10, dBValue * factor);
}

function createNoiseBuffer() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var context = options.audioContext;
  var duration = typeof options.duration !== 'undefined' ? options.duration : 5;

  var gain = typeof options.gain !== 'undefined' ? options.gain : -30; // dB

  var channelCount = _typeof(options.channelCount) ? options.channelCount : context.destination.channelCount;

  var length = duration * context.sampleRate;
  var amplitude = dBToLin(gain);
  var buffer = context.createBuffer(channelCount, length, context.sampleRate);
  for (var c = 0; c < channelCount; ++c) {
    var data = buffer.getChannelData(c);
    for (var i = 0; i < length; ++i) {
      data[i] = amplitude * (Math.random() * 2 - 1);
    }
  }
  return buffer;
}

function resampleFloat32Array() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var promise = new Promise(function (resolve, reject) {
    var inputSamples = options.inputSamples;
    var inputSampleRate = options.inputSampleRate;

    var outputSampleRate = typeof options.outputSampleRate !== 'undefined' ? options.outputSampleRate : inputSampleRate;

    if (inputSampleRate === outputSampleRate) {
      resolve(new Float32Array(inputSamples));
    } else {
      try {
        var outputSamplesNb = Math.ceil(inputSamples.length * outputSampleRate / inputSampleRate);

        var context = new window.OfflineAudioContext(1, outputSamplesNb, outputSampleRate);

        var inputBuffer = context.createBuffer(1, inputSamples.length, inputSampleRate);

        inputBuffer.getChannelData(0).set(inputSamples);

        var source = context.createBufferSource();
        source.buffer = inputBuffer;
        source.connect(context.destination);

        source.start(); // will start with offline context

        context.oncomplete = function (event) {
          var outputSamples = event.renderedBuffer.getChannelData(0);
          resolve(outputSamples);
        };

        context.startRendering();
      } catch (error) {
        reject(new Error('Unable to re-sample Float32Array. ' + error.message));
      }
    }
  });

  return promise;
}

exports.default = {
  dBToLin: dBToLin,
  createNoiseBuffer: createNoiseBuffer,
  resampleFloat32Array: resampleFloat32Array
};
},{}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tree = undefined;
exports.distanceSquared = distanceSquared;
exports.distance = distance;

var _kd = require('kd.tree');

var _kd2 = _interopRequireDefault(_kd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.tree = _kd2.default; /**
                              * @fileOverview Helpers for k-d tree.
                              * @author Jean-Philippe.Lambert@ircam.fr
                              * @copyright 2015-2016 IRCAM, Paris, France
                              * @license CECILL-2.1
                              */

function distanceSquared(a, b) {
  var x = b.x - a.x;
  var y = b.y - a.y;
  var z = b.z - a.z;
  return x * x + y * y + z * z;
}

function distance(a, b) {
  return Math.sqrt(this.distanceSquared(a, b));
}

exports.default = {
  distance: distance,
  distanceSquared: distanceSquared,
  tree: _kd2.default
};
},{"kd.tree":46}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _KdTree = require('./KdTree');

var _KdTree2 = _interopRequireDefault(_KdTree);

var _utilities = require('./utilities');

var _utilities2 = _interopRequireDefault(_utilities);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  KdTree: _KdTree2.default,
  utilities: _utilities2.default
};
},{"./KdTree":23,"./utilities":25}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.almostEquals = almostEquals;
exports.almostEqualsModulo = almostEqualsModulo;
/**
 * @fileOverview Common utilities
 * @author Jean-Philippe.Lambert@ircam.fr
 * @copyright 2015-2016 IRCAM, Paris, France
 * @license CECILL-2.1
 */

function almostEquals(value, reference) {
  var tolerance = arguments.length <= 2 || arguments[2] === undefined ? Number.EPSILON : arguments[2];

  return Math.abs(value - reference) <= tolerance;
}

function almostEqualsModulo(value, reference, modulo) {
  var tolerance = arguments.length <= 3 || arguments[3] === undefined ? Number.EPSILON : arguments[3];

  return Math.abs(value - reference) % modulo <= tolerance;
}

exports.default = {
  almostEquals: almostEquals,
  almostEqualsModulo: almostEqualsModulo
};
},{}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toRadian = toRadian;
exports.fromRadian = fromRadian;
exports.cos = cos;
exports.sin = sin;
exports.atan2 = atan2;
/**
 * @fileOverview Convert to and from degree
 * @author Jean-Philippe.Lambert@ircam.fr
 * @copyright 2015-2016 IRCAM, Paris, France
 * @license CECILL-2.1
 */

var toRadianFactor = exports.toRadianFactor = Math.PI / 180;
var fromRadianFactor = exports.fromRadianFactor = 1 / toRadianFactor;

function toRadian(angle) {
  return angle * toRadianFactor;
}

function fromRadian(angle) {
  return angle * fromRadianFactor;
}

function cos(angle) {
  return Math.cos(angle * toRadianFactor);
}

function sin(angle) {
  return Math.sin(angle * toRadianFactor);
}

function atan2(y, x) {
  return Math.atan2(y, x) * fromRadianFactor;
}

exports.default = {
  atan2: atan2,
  cos: cos,
  fromRadian: fromRadian,
  fromRadianFactor: fromRadianFactor,
  sin: sin,
  toRadian: toRadian,
  toRadianFactor: toRadianFactor
};
},{}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _degree = require('./degree');

var _degree2 = _interopRequireDefault(_degree);

var _sofa = require('./sofa');

var _sofa2 = _interopRequireDefault(_sofa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  degree: _degree2.default,
  sofa: _sofa2.default
};
},{"./degree":26,"./sofa":28}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cartesianToGl = cartesianToGl;
exports.glToCartesian = glToCartesian;
exports.cartesianToSpherical = cartesianToSpherical;
exports.sphericalToCartesian = sphericalToCartesian;
exports.sphericalToGl = sphericalToGl;
exports.glToSpherical = glToSpherical;
exports.typedToCartesian = typedToCartesian;
exports.typedToGl = typedToGl;
exports.glToTyped = glToTyped;

var _degree = require('./degree');

var _degree2 = _interopRequireDefault(_degree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cartesianToGl(out, a) {
  // copy to handle in-place
  var x = a[0];
  var y = a[1];
  var z = a[2];

  out[0] = -y;
  out[1] = z;
  out[2] = -x;

  return out;
} /**
   * @fileOverview SOFA convention to and from openGL convention.
   *
   * SOFA distances are in metres, angles in degrees.
   *
   * <pre>
   *
   * SOFA          +z  +x             openGL    +y
   *                | /                          |
   *                |/                           |
   *         +y ----o                            o---- +x
   *                                            /
   *                                           /
   *                                          +z
   *
   * SOFA.x = -openGL.z               openGL.x = -SOFA.y
   * SOFA.y = -openGL.x               openGL.y =  SOFA.z
   * SOFA.z =  openGL.y               openGL.z = -SOFA.x
   *
   * SOFA.azimuth = atan2(SOFA.y, SOFA.x)
   * SOFA.elevation = atan2(SOFA.z, sqrt(SOFA.x * SOFA.x + SOFA.y * SOFA.y) );
   * SOFA.distance = sqrt(SOFA.x * SOFA.x + SOFA.y * SOFA.y + SOFA.z * SOFA.z)
   *
   * </pre>
   *
   * @author Jean-Philippe.Lambert@ircam.fr
   * @copyright 2015-2016 IRCAM, Paris, France
   * @license CECILL-2.1
   */

function glToCartesian(out, a) {
  // copy to handle in-place
  var x = a[0];
  var y = a[1];
  var z = a[2];

  out[0] = -z;
  out[1] = -x;
  out[2] = y;

  return out;
}

function cartesianToSpherical(out, a) {
  // copy to handle in-place
  var x = a[0];
  var y = a[1];
  var z = a[2];

  var x2y2 = x * x + y * y;

  // from [-180, 180] to [0, 360);
  out[0] = (_degree2.default.atan2(y, x) + 360) % 360;

  out[1] = _degree2.default.atan2(z, Math.sqrt(x2y2));
  out[2] = Math.sqrt(x2y2 + z * z);

  return out;
}

function sphericalToCartesian(out, a) {
  // copy to handle in-place
  var azimuth = a[0];
  var elevation = a[1];
  var distance = a[2];

  var cosE = _degree2.default.cos(elevation);
  out[0] = distance * cosE * _degree2.default.cos(azimuth); // SOFA.x
  out[1] = distance * cosE * _degree2.default.sin(azimuth); // SOFA.y
  out[2] = distance * _degree2.default.sin(elevation); // SOFA.z

  return out;
}

/**
 * Convert spherical coordinates in SOFA convention, to cartesian in openGL
 * convention.
 *
 * @param {vec3} out as an array of [x, y, z]. In-place if out === a
 * @param {vec3} a as an array of [azimuth, elevation, distance]
 * @returns {vec3} out
 */
function sphericalToGl(out, a) {
  // copy to handle in-place
  var azimuth = a[0];
  var elevation = a[1];
  var distance = a[2];

  var cosE = _degree2.default.cos(elevation);
  out[0] = -distance * cosE * _degree2.default.sin(azimuth); // -SOFA.y
  out[1] = distance * _degree2.default.sin(elevation); // SOFA.z
  out[2] = -distance * cosE * _degree2.default.cos(azimuth); // -SOFA.x

  return out;
}

function glToSpherical(out, a) {
  // copy to handle in-place
  // difference to avoid generating -0 out of 0
  var x = 0 - a[2]; // -openGL.z
  var y = 0 - a[0]; // -openGL.x
  var z = a[1]; // openGL.y

  var x2y2 = x * x + y * y;

  // from [-180, 180] to [0, 360);
  out[0] = (_degree2.default.atan2(y, x) + 360) % 360;

  out[1] = _degree2.default.atan2(z, Math.sqrt(x2y2));
  out[2] = Math.sqrt(x2y2 + z * z);

  return out;
}

function typedToCartesian(out, a, type) {
  switch (type) {
    case 'cartesian':
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      break;

    case 'spherical':
      sphericalToCartesian(out, a);
      break;

    default:
      throw new Error('Bad SOFA type');
  }
  return out;
}

function typedToGl(out, a, type) {
  switch (type) {
    case 'gl':
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      break;

    case 'sofaCartesian':
      cartesianToGl(out, a);
      break;

    case 'sofaSpherical':
      sphericalToGl(out, a);
      break;

    default:
      throw new Error('Bad SOFA type');
  }
  return out;
}

function glToTyped(out, a, type) {
  switch (type) {
    case 'gl':
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      break;

    case 'sofaCartesian':
      glToCartesian(out, a);
      break;

    case 'sofaSpherical':
      glToSpherical(out, a);
      break;

    default:
      throw new Error('Bad SOFA type');
  }
  return out;
}

exports.default = {
  cartesianToGl: cartesianToGl,
  cartesianToSpherical: cartesianToSpherical,
  glToCartesian: glToCartesian,
  glToSpherical: glToSpherical,
  glToTyped: glToTyped,
  sphericalToCartesian: sphericalToCartesian,
  sphericalToGl: sphericalToGl,
  typedToCartesian: typedToCartesian,
  typedToGl: typedToGl
};
},{"./degree":26}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _audio = require('./audio');

var _audio2 = _interopRequireDefault(_audio);

var _common = require('./common');

var _common2 = _interopRequireDefault(_common);

var _geometry = require('./geometry');

var _geometry2 = _interopRequireDefault(_geometry);

var _sofa = require('./sofa');

var _sofa2 = _interopRequireDefault(_sofa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  audio: _audio2.default,
  common: _common2.default,
  geometry: _geometry2.default,
  sofa: _sofa2.default
};
},{"./audio":21,"./common":24,"./geometry":27,"./sofa":33}],30:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileOverview Container for HRTF set.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Jean-Philippe.Lambert@ircam.fr
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @copyright 2015-2016 IRCAM, Paris, France
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @license CECILL-2.1
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HrtfSet = undefined;

var _glMatrix = require('gl-matrix');

var _glMatrix2 = _interopRequireDefault(_glMatrix);

var _dataSetParse = require('./dataSetParse');

var _sofaParse = require('./sofaParse');

var _sofa = require('../geometry/sofa');

var _sofa2 = _interopRequireDefault(_sofa);

var _KdTree = require('../common/KdTree');

var _KdTree2 = _interopRequireDefault(_KdTree);

var _utilities = require('../audio/utilities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Container for HRTF set.
 */

var HrtfSet = exports.HrtfSet = function () {
  function HrtfSet() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, HrtfSet);

    this.audioContext = options.audioContext;

    this.positionsType = options.positionsType;

    this.filterPositionsType = options.filterPositionsType;
    this.filterPositions = options.filterPositions;

    this.filterPost = options.filterPost;
  }

  // ------------ accessors

  _createClass(HrtfSet, [{
    key: 'applyFilterPositions',

    // ------------- public methods

    value: function applyFilterPositions() {
      var _this = this;

      // do not use getter for gl positions
      var filteredPositions = this._filterPositions.map(function (current) {
        return _this.kdt.nearest({ x: current[0], y: current[1], z: current[2] }, 1).pop()[0]; // nearest data
      });

      // filter out duplicates
      filteredPositions = [].concat(_toConsumableArray(new Set(filteredPositions)));

      this.kdt = _KdTree2.default.tree.createKdTree(filteredPositions, _KdTree2.default.distanceSquared, ['x', 'y', 'z']);
    }
  }, {
    key: 'load',
    value: function load(sourceUrl) {
      var _this2 = this;

      var extension = sourceUrl.split('.').pop();

      var url = extension === 'sofa' ? sourceUrl + '.json' : sourceUrl;

      var promise = undefined;

      // need a server for partial downloading ("sofa" extension may be naive)
      var preFilter = typeof this._filterPositions !== 'undefined' && !this.filterPost && extension === 'sofa';
      if (preFilter) {
        promise = Promise.all([this._loadMetaAndPositions(sourceUrl), this._loadDataSet(sourceUrl)]).then(function (indicesAndDataSet) {
          var indices = indicesAndDataSet[0];
          var dataSet = indicesAndDataSet[1];
          return _this2._loadSofaPartial(sourceUrl, indices, dataSet);
        }).catch(function () {
          // when pre-fitering fails, for any reason, try to post-filter
          // console.log(`Error while partial loading of ${sourceUrl}. `
          //             + `${error.message}. `
          //             + `Load full and post-filtering, instead.`);
          return _this2._loadSofa(url).then(function () {
            _this2.applyFilterPositions();
            return _this2; // final resolve
          });
        });
      } else {
          promise = this._loadSofa(url).then(function () {
            if (typeof _this2._filterPositions !== 'undefined' && _this2.filterPost) {
              _this2.applyFilterPositions();
            }
            return _this2; // final resolve
          });
        }

      return promise;
    }
  }, {
    key: 'nearest',
    value: function nearest(positionRequest) {
      var position = _sofa2.default.typedToGl([], positionRequest, this.positionsType);
      var nearest = this.kdt.nearest({
        x: position[0],
        y: position[1],
        z: position[2]
      }, 1).pop(); // nearest only
      var data = nearest[0];
      _sofa2.default.glToTyped(position, [data.x, data.y, data.z], this.positionsType);
      return {
        distance: nearest[1],
        fir: data.fir,
        index: data.index,
        position: position
      };
    }
  }, {
    key: 'nearestFir',
    value: function nearestFir(positionRequest) {
      return this.nearest(positionRequest).fir;
    }

    // ----------- private methods

  }, {
    key: '_createKdTree',
    value: function _createKdTree(indicesPositionsFirs) {
      var _this3 = this;

      var positions = indicesPositionsFirs.map(function (value) {
        var impulseResponses = value[2];
        var fir = _this3.audioContext.createBuffer(impulseResponses.length, impulseResponses[0].length, _this3.audioContext.sampleRate);
        impulseResponses.forEach(function (samples, channel) {
          // do not use copyToChannel because of Safari <= 9
          fir.getChannelData(channel).set(samples);
        });

        return {
          index: value[0],
          x: value[1][0],
          y: value[1][1],
          z: value[1][2],
          fir: fir
        };
      });

      this.kdt = _KdTree2.default.tree.createKdTree(positions, _KdTree2.default.distanceSquared, ['x', 'y', 'z']);
      return;
    }

    // asynchronously create Float32Arrays (may re-sample on the fly)

  }, {
    key: '_generateIndicesPositionsFirs',
    value: function _generateIndicesPositionsFirs(indices, positions, firs) {
      var _this4 = this;

      var sofaFirsPromises = firs.map(function (sofaFirChannels, index) {
        var sofaFirsChannelsPromises = sofaFirChannels.map(function (fir) {
          return (0, _utilities.resampleFloat32Array)({
            inputSamples: fir,
            inputSampleRate: _this4.sofaSampleRate,
            outputSampleRate: _this4.audioContext.sampleRate
          });
        });
        return Promise.all(sofaFirsChannelsPromises).then(function (firChannels) {
          return [indices[index], positions[index], firChannels];
        }).catch(function (error) {
          // re-throw
          throw new Error('Unable to re-sample impulse response ' + index + '. ' + error.message);
        });
      });
      return Promise.all(sofaFirsPromises);
    }
  }, {
    key: '_loadDataSet',
    value: function _loadDataSet(sourceUrl) {
      var promise = new Promise(function (resolve, reject) {
        var ddsUrl = sourceUrl + '.dds';
        var request = new window.XMLHttpRequest();
        request.open('GET', ddsUrl);
        request.onerror = function () {
          reject(new Error('Unable to GET ' + ddsUrl + ', status ' + request.status + ' ' + ('' + request.responseText)));
        };

        request.onload = function () {
          if (request.status < 200 || request.status >= 300) {
            request.onerror();
            return;
          }

          try {
            var dds = (0, _dataSetParse.dataSetParse)(request.response);
            resolve(dds);
          } catch (error) {
            // re-throw
            reject(new Error('Unable to parse ' + ddsUrl + '. ' + error.message));
          }
        }; // request.onload

        request.send();
      });

      return promise;
    }
  }, {
    key: '_loadMetaAndPositions',
    value: function _loadMetaAndPositions(sourceUrl) {
      var _this5 = this;

      var promise = new Promise(function (resolve, reject) {
        var positionsUrl = sourceUrl + '.json?' + 'ListenerPosition,ListenerUp,ListenerView,SourcePosition,' + 'Data.Delay,Data.SamplingRate,' + 'EmitterPosition,ReceiverPosition,RoomVolume'; // meta

        var request = new window.XMLHttpRequest();
        request.open('GET', positionsUrl);
        request.onerror = function () {
          reject(new Error('Unable to GET ' + positionsUrl + ', status ' + request.status + ' ' + ('' + request.responseText)));
        };

        request.onload = function () {
          if (request.status < 200 || request.status >= 300) {
            request.onerror();
            return;
          }

          try {
            (function () {
              var data = (0, _sofaParse.sofaParse)(request.response);
              _this5._setMetaData(data);

              var sourcePositions = _this5._sourcePositionsToGl(data);
              var hrtfPositions = sourcePositions.map(function (position, index) {
                return {
                  x: position[0],
                  y: position[1],
                  z: position[2],
                  index: index
                };
              });

              var kdt = _KdTree2.default.tree.createKdTree(hrtfPositions, _KdTree2.default.distanceSquared, ['x', 'y', 'z']);

              var nearestIndices = _this5._filterPositions.map(function (current) {
                return kdt.nearest({ x: current[0], y: current[1], z: current[2] }, 1).pop()[0] // nearest data
                .index;
              });

              // filter out duplicates
              nearestIndices = [].concat(_toConsumableArray(new Set(nearestIndices)));

              _this5.sofaUrl = sourceUrl;
              resolve(nearestIndices);
            })();
          } catch (error) {
            // re-throw
            reject(new Error('Unable to parse ' + positionsUrl + '. ' + error.message));
          }
        }; // request.onload

        request.send();
      });

      return promise;
    }
  }, {
    key: '_loadSofa',
    value: function _loadSofa(url) {
      var _this6 = this;

      var promise = new Promise(function (resolve, reject) {
        var request = new window.XMLHttpRequest();
        request.open('GET', url);
        request.onerror = function () {
          reject(new Error('Unable to GET ' + url + ', status ' + request.status + ' ' + ('' + request.responseText)));
        };

        request.onload = function () {
          if (request.status < 200 || request.status >= 300) {
            request.onerror();
            return;
          }

          try {
            var data = (0, _sofaParse.sofaParse)(request.response);
            _this6._setMetaData(data);
            var sourcePositions = _this6._sourcePositionsToGl(data);
            _this6._generateIndicesPositionsFirs(sourcePositions.map(function (position, index) {
              return index;
            }), // full
            sourcePositions, data['Data.IR'].data).then(function (indicesPositionsFirs) {
              _this6._createKdTree(indicesPositionsFirs);
              _this6.sofaUrl = url;
              resolve();
            });
          } catch (error) {
            // re-throw
            reject(new Error('Unable to parse ' + url + '. ' + error.message));
          }
        }; // request.onload

        request.send();
      });

      return promise;
    }
  }, {
    key: '_loadSofaPartial',
    value: function _loadSofaPartial(sourceUrl, indices, dataSet) {
      var _this7 = this;

      var urlPromises = indices.map(function (index) {
        var urlPromise = new Promise(function (resolve, reject) {
          var positionUrl = sourceUrl + '.json?' + ('SourcePosition[' + index + '][0:1:' + (dataSet.SourcePosition.C - 1) + '],') + ('Data.IR[' + index + '][0:1:' + (dataSet['Data.IR'].R - 1) + ']') + ('[0:1:' + (dataSet['Data.IR'].N - 1) + ']');

          var request = new window.XMLHttpRequest();
          request.open('GET', positionUrl);
          request.onerror = function () {
            reject(new Error('Unable to GET ' + positionUrl + ', status ' + request.status + ' ' + ('' + request.responseText)));
          };

          request.onload = function () {
            if (request.status < 200 || request.status >= 300) {
              request.onerror();
            }

            try {
              var data = (0, _sofaParse.sofaParse)(request.response);
              // (meta-data is already loaded)

              var sourcePositions = _this7._sourcePositionsToGl(data);
              _this7._generateIndicesPositionsFirs([index], sourcePositions, data['Data.IR'].data).then(function (indicesPositionsFirs) {
                // One position per URL here
                // Array made of multiple promises, later
                resolve(indicesPositionsFirs[0]);
              });
            } catch (error) {
              // re-throw
              reject(new Error('Unable to parse ' + positionUrl + '. ' + error.message));
            }
          }; // request.onload

          request.send();
        });

        return urlPromise;
      });

      return Promise.all(urlPromises).then(function (indicesPositionsFirs) {
        _this7._createKdTree(indicesPositionsFirs);
        return _this7; // final resolve
      });
    }
  }, {
    key: '_setMetaData',
    value: function _setMetaData(data) {
      this.sofaMetaData = data.metaData;
      this.sofaSampleRate = data['Data.SamplingRate'].data[0];

      // Convert listener position, up, and view to SOFA cartesian,
      // to generate a SOFA-to-GL look-at mat4.
      // Default SOFA type is 'cartesian' (see table D.4A).

      var listenerPosition = _sofa2.default.typedToCartesian([], data.ListenerPosition.data[0], data.ListenerPosition.Type || 'cartesian');

      var listenerView = _sofa2.default.typedToCartesian([], data.ListenerView.data[0], data.ListenerView.Type || 'cartesian');

      var listenerUp = _sofa2.default.typedToCartesian([], data.ListenerUp.data[0], data.ListenerUp.Type || 'cartesian');

      this._sofaToGl = _glMatrix2.default.mat4.lookAt([], listenerPosition, listenerView, listenerUp);
    }

    // convert to cartesian, in-place

  }, {
    key: '_sourcePositionsToGl',
    value: function _sourcePositionsToGl(data) {
      var _this8 = this;

      var sourcePositions = data.SourcePosition.data; // reference
      var sourcePositionsType = typeof data.SourcePosition.Type !== 'undefined' ? data.SourcePosition.Type : 'spherical'; // default (SOFA Table D.4C)
      switch (sourcePositionsType) {
        case 'cartesian':
          sourcePositions.forEach(function (position) {
            _glMatrix2.default.vec3.transformMat4(position, position, _this8._sofaToGl);
          });
          break;

        case 'spherical':
          sourcePositions.forEach(function (position) {
            _sofa2.default.sphericalToCartesian(position, position); // in-place
            _glMatrix2.default.vec3.transformMat4(position, position, _this8._sofaToGl);
          });
          break;

        default:
          throw new Error('Bad source position type');
      }

      return sourcePositions;
    }
  }, {
    key: 'positionsType',
    set: function set(type) {
      this._positionsType = typeof type !== 'undefined' ? type : 'gl';
    },
    get: function get() {
      return this._positionsType;
    }
  }, {
    key: 'filterPositionsType',
    set: function set(type) {
      this._filterPositionsType = typeof type !== 'undefined' ? type : this.positionsType;
    },
    get: function get() {
      return this._filterPositionsType;
    }
  }, {
    key: 'filterPositions',
    set: function set(positions) {
      if (typeof positions === 'undefined') {
        this._filterPositions = undefined;
      } else {
        switch (this.filterPositionsType) {
          case 'gl':
            this._filterPositions = positions.map(function (current) {
              return current.slice(0); // copy
            });
            break;

          case 'sofaCartesian':
            this._filterPositions = positions.map(function (current) {
              return _sofa2.default.cartesianToGl([], current);
            });
            break;

          case 'sofaSpherical':
            this._filterPositions = positions.map(function (current) {
              return _sofa2.default.sphericalToGl([], current);
            });
            break;

          default:
            throw new Error('Bad filter type');
        }
      }
    },
    get: function get() {
      var positions = undefined;
      if (typeof this._filterPositions !== 'undefined') {
        switch (this.filterPositionsType) {
          case 'gl':
            positions = this._filterPositions.map(function (current) {
              return current.slice(0); // copy
            });
            break;

          case 'sofaCartesian':
            positions = this._filterPositions.forEach(function (current) {
              return _sofa2.default.glToCartesian([], current);
            });
            break;

          case 'sofaSpherical':
            positions = this._filterPositions.forEach(function (current) {
              return _sofa2.default.glToSpherical([], current);
            });
            break;

          default:
            throw new Error('Bad filter type');
        }
      }
      return positions;
    }
  }, {
    key: 'filterPost',
    set: function set(post) {
      this._filterPost = typeof post !== 'undefined' ? post : false;
    },
    get: function get() {
      return this._filterPost;
    }
  }]);

  return HrtfSet;
}();

exports.default = HrtfSet;
},{"../audio/utilities":22,"../common/KdTree":23,"../geometry/sofa":28,"./dataSetParse":32,"./sofaParse":34,"gl-matrix":36}],31:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileOverview Access a remote data-base from a SOFA server.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Jean-Philippe.Lambert@ircam.fr
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @copyright 2015-2016 IRCAM, Paris, France
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @license CECILL-2.1
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ServerDataBase = undefined;

var _xmlParse = require('./xmlParse');

var _xmlParse2 = _interopRequireDefault(_xmlParse);

var _dataSetParse = require('./dataSetParse');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * SOFA remote data-base.
 */

var ServerDataBase = exports.ServerDataBase = function () {
  /**
   * This is only a constructor, it does not load any thing.
   *
   * @see loadCatalogue
   *
   * @param {Object} [options]
   * @param {String} [options.serverUrl] base URL of server, including
   * protocol, eg. 'http://bili2.ircam.fr'.
   */

  function ServerDataBase() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ServerDataBase);

    this._server = typeof options.serverUrl !== 'undefined' ? options.serverUrl : 'http://bili2.ircam.fr';

    this._catalogue = {};
    this._urls = [];
  }

  /**
   * Asynchronously load complete catalogue from the server, including the
   * catalogue links found in any partial catalogue.
   *
   * @param {String} [sourceUrl] URL of the root catalogue, including the
   * server, like 'http://bili2.ircam.fr/catalog.xml'.
   *  Default is 'catalog.xml' at serverURL supplied at
   * {@link constructor}.
   * @param {Object} [destination] Catalogue to update. Default is
   * internal.
   * @returns {Promise.<(String | Error)>} The promise will resolve (with
   * sourceUrl) when every sub-catalogue will successfully load, or will
   * reject (with an error) as soon as one transfer fails.
   */

  _createClass(ServerDataBase, [{
    key: 'loadCatalogue',
    value: function loadCatalogue() {
      var _this = this;

      var sourceUrl = arguments.length <= 0 || arguments[0] === undefined ? this._server + '/catalog.xml' : arguments[0];
      var destination = arguments.length <= 1 || arguments[1] === undefined ? this._catalogue : arguments[1];

      var promise = new Promise(function (resolve, reject) {
        var request = new window.XMLHttpRequest();
        request.open('GET', sourceUrl);
        request.onerror = function () {
          reject(new Error('Unable to GET ' + sourceUrl + ', status ' + request.status + ' ' + ('' + request.responseText)));
        };

        request.onload = function () {
          if (request.status < 200 || request.status >= 300) {
            request.onerror();
            return;
          }

          var xml = (0, _xmlParse2.default)(request.response);
          var dataSet = xml.querySelector('dataset');

          // recursive catalogues
          var catalogueReferences = xml.querySelectorAll('dataset > catalogRef');

          if (catalogueReferences.length === 0) {
            // end of recursion
            destination.urls = [];
            var urls = xml.querySelectorAll('dataset > dataset');
            for (var ref = 0; ref < urls.length; ++ref) {
              // data set name already contains a leading slash
              var url = _this._server + dataSet.getAttribute('name') + '/' + urls[ref].getAttribute('name');
              _this._urls.push(url);
              destination.urls.push(url);
            }

            resolve(sourceUrl);
          } else {
            // recursion
            var promises = [];
            for (var ref = 0; ref < catalogueReferences.length; ++ref) {
              var name = catalogueReferences[ref].getAttribute('name');
              var recursiveUrl = _this._server + dataSet.getAttribute('name') + '/' + catalogueReferences[ref].getAttribute('xlink:href');
              destination[name] = {};
              promises.push(_this.loadCatalogue(recursiveUrl, destination[name]));
            }

            Promise.all(promises).then(function () {
              _this._urls.sort();
              resolve(sourceUrl);
            }).catch(function (error) {
              reject(error);
            });
          }
        }; // request.onload

        request.send();
      });

      return promise;
    }

    /**
     * Get URLs, possibly filtered.
     *
     * Any filter can be partial, and is case-insensitive. The result must
     * match every supplied filter. Undefined filters are not applied.
     *
     * @param {Object} [options] optional filters
     * @param {String} [options.convention] 'HRIR' or 'SOS'
     * @param {String} [options.dataBase] 'LISTEN', 'BILI', etc.
     * @param {String} [options.equalisation] 'RAW','COMPENSATED'
     * @param {String} [options.sampleRate] in Hertz
     * @param {String} [options.sosOrder] '12order' or '24order'
     * @param {String} [options.freePattern] any pattern matched
     * globally. Use separators (spaces, tabs, etc.) to combine multiple
     * patterns: '44100 listen' will restrict on URLs matching '44100' and
     * 'listen'
     * @returns {Array.<String>} URLs that match every filter.
     */

  }, {
    key: 'getUrls',
    value: function getUrls() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      // the number and the order of the filters in the following array must
      // match the URL sub-directories
      var filters = [options.convention, options.dataBase, options.equalisation, options.sampleRate, options.sosOrder];

      // any where in URL
      // in file name
      var freePattern = options.freePattern;

      var pattern = filters.reduce(function (global, local) {
        // partial filter inside slashes
        return global + '/' + (typeof local !== 'undefined' ? '[^/]*' + local + '[^/]*' : '[^/]*');
      }, '');

      var regExp = new RegExp(pattern, 'i');

      var urls = this._urls.filter(function (url) {
        return regExp.test(url);
      });

      if (typeof freePattern !== 'undefined') {
        // split patterns with separators
        var patterns = freePattern.split(/\s+/);
        patterns.forEach(function (current) {
          regExp = new RegExp(current, 'i');

          urls = urls.filter(function (url) {
            return regExp.test(url);
          });
        });
      }

      return urls;
    }

    /**
     * Get all source positions of a given URL.
     *
     * @param {String} sourceUrl is the complete SOFA URL, with the
     * server, like
     * 'http://bili2.ircam.fr/SimpleFreeFieldHRIR/BILI/COMPENSATED/44100/IRC_1100_C_HRIR.sofa'
     *
     * @returns {Promise.<(Object | String)>} The promise will resolve after
     * successfully loading, with definitions as * `{definition: {key: values}}`
     * objects; the promise will reject is the transfer fails, with an error.
     */

  }, {
    key: 'getDataSetDefinitions',
    value: function getDataSetDefinitions(sourceUrl) {
      var promise = new Promise(function (resolve, reject) {
        var url = sourceUrl + '.dds';
        var request = new window.XMLHttpRequest();
        request.open('GET', url);
        request.onerror = function () {
          reject(new Error('Unable to GET ' + url + ', status ' + request.status + ' ' + ('' + request.responseText)));
        };

        request.onload = function () {
          if (request.status < 200 || request.status >= 300) {
            request.onerror();
            return;
          }
          resolve((0, _dataSetParse.dataSetParse)(request.response));
        }; // request.onload

        request.send();
      });

      return promise;
    }

    /**
     * Get all source positions of a given URL.
     *
     * @param {String} sourceUrl is the complete SOFA URL, with the
     * server, like
     * 'http://bili2.ircam.fr/SimpleFreeFieldHRIR/BILI/COMPENSATED/44100/IRC_1100_C_HRIR.sofa'
     *
     * @returns {Promise.<(Array<Array.<Number>> | String)>} The promise will resolve
     * after successfully loading, with an array of positions (which are
     * arrays of 3 numbers); the promise will reject is the transfer fails,
     * with an error.
     */

  }, {
    key: 'getSourcePositions',
    value: function getSourcePositions(sourceUrl) {
      var promise = new Promise(function (resolve, reject) {
        var url = sourceUrl + '.json?SourcePosition';

        var request = new window.XMLHttpRequest();
        request.open('GET', url);
        request.onerror = function () {
          reject(new Error('Unable to GET ' + url + ', status ' + request.status + ' ' + ('' + request.responseText)));
        };

        request.onload = function () {
          if (request.status < 200 || request.status >= 300) {
            request.onerror();
            return;
          }

          try {
            var response = JSON.parse(request.response);
            if (response.leaves[0].name !== 'SourcePosition') {
              throw new Error('SourcePosition not found');
            }

            resolve(response.leaves[0].data);
          } catch (error) {
            // re-throw
            reject(new Error('Unable to parse response from ' + url + '. ' + error.message));
          }
        }; // request.onload

        request.send();
      });

      return promise;
    }
  }]);

  return ServerDataBase;
}();

exports.default = ServerDataBase;
},{"./dataSetParse":32,"./xmlParse":35}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._dimensionParse = _dimensionParse;
exports._definitionParse = _definitionParse;
exports.dataSetParse = dataSetParse;
/**
 * @fileOverview Parser for DDS files
 * @author Jean-Philippe.Lambert@ircam.fr
 * @copyright 2015-2016 IRCAM, Paris, France
 * @license CECILL-2.1
 */

// '[R = 2]'
var _dimensionPattern = '\\[\\s*(\\w+)\\s*=\\s*(\\d+)\\s*\\]';
var _dimensionMatch = new RegExp(_dimensionPattern, 'g');
var _dimensionSplit = new RegExp(_dimensionPattern);

// 'Float64 ReceiverPosition[R = 2][C = 3][I = 1];'
//
// do not re-use dimension pattern (for grouping)
var _definitionPattern = '\\s*(\\w+)\\s*([\\w.]+)\\s*' + '((?:\\[[^\\]]+\\]\\s*)+)' + ';\\s*';
var _definitionMatch = new RegExp(_definitionPattern, 'g');
var _definitionSplit = new RegExp(_definitionPattern);

// `Dataset {
//   Float64 ListenerPosition[I = 1][C = 3];
//   Float64 ListenerUp[I = 1][C = 3];
//   Float64 ListenerView[I = 1][C = 3];
//   Float64 ReceiverPosition[R = 2][C = 3][I = 1];
//   Float64 SourcePosition[M = 1680][C = 3];
//   Float64 EmitterPosition[E = 1][C = 3][I = 1];
//   Float64 Data.SamplingRate[I = 1];
//   Float64 Data.Delay[I = 1][R = 2];
//   Float64 Data.IR[M = 1680][R = 2][N = 941];
//   Float64 RoomVolume[I = 1];
// } IRC_1100_C_HRIR.sofa;`
//
// do not re-use definition pattern (for grouping)
var _dataSetPattern = '\\s*Dataset\\s*\\{\\s*' + '((?:[^;]+;\\s*)*)' + '\\s*\\}\\s*[\\w.]+\\s*;\\s*';
var _dataSetSplit = new RegExp(_dataSetPattern);

/**
 * Parses dimension strings into an array of [key, value] pairs.
 *
 * @private
 * @param {String} input is single or multiple dimension
 * @returns {Array.<Array.<String>>} object [key, value] pairs
 *
 * @example
 * dimensionParse('[R = 2]');
 * // [ [ 'R', 2 ] ]
 *
 * dimensionParse('[R = 2][C = 3][I = 1]');
 * // [ [ 'R', 2 ], [ 'C', 3 ], [ 'I', 1 ] ]
 */
function _dimensionParse(input) {
  var parse = [];
  var inputs = input.match(_dimensionMatch);
  if (inputs !== null) {
    inputs.forEach(function (inputSingle) {
      var parts = _dimensionSplit.exec(inputSingle);
      if (parts !== null && parts.length > 2) {
        parse.push([parts[1], Number(parts[2])]);
      }
    });
  }
  return parse;
}

/**
 * Parse definition strings into an array of [key, {values}] pairs.
 *
 * @param {String} input is single or multiple definition
 * @returns {Array.<Array<String,Object>>} [key, {values}] pairs
 *
 * @private
 * @example
 * definitionParse('Float64 ReceiverPosition[R = 2][C = 3][I = 1];');
 * // [ [ 'ReceiverPosition',
 * //     { type: 'Float64', R: 2, C: 3, I: 1 } ] ]
 *
 * definitionParse(
 * `    Float64 ReceiverPosition[R = 2][C = 3][I = 1];
 *      Float64 SourcePosition[M = 1680][C = 3];
 *      Float64 EmitterPosition[E = 1][C = 3][I = 1];`);
 * // [ [ 'ReceiverPosition',
 * //      { type: 'Float64', R: 2, C: 3, I: 1 } ],
 * //   [ 'SourcePosition', { type: 'Float64', M: 1680, C: 3 } ],
 * //   [ 'EmitterPosition',
 * //     { type: 'Float64', E: 1, C: 3, I: 1 } ] ]
 */
function _definitionParse(input) {
  var parse = [];
  var inputs = input.match(_definitionMatch);
  if (inputs !== null) {
    inputs.forEach(function (inputSingle) {
      var parts = _definitionSplit.exec(inputSingle);
      if (parts !== null && parts.length > 3) {
        (function () {
          var current = [];
          current[0] = parts[2];
          current[1] = {};
          current[1].type = parts[1];
          _dimensionParse(parts[3]).forEach(function (dimension) {
            current[1][dimension[0]] = dimension[1];
          });
          parse.push(current);
        })();
      }
    });
  }
  return parse;
}

/**
 * Parse data set meta data into an object of `{definition: {key: values}}` objects.
 *
 * @param {String} input data set DDS-like.
 * @returns {Object} definitions as `{definition: {key: values}}` objects.
 *
 * @example
 * definitionParse(
 * `Dataset {
 *      Float64 ReceiverPosition[R = 2][C = 3][I = 1];
 *      Float64 SourcePosition[M = 1680][C = 3];
 *      Float64 EmitterPosition[E = 1][C = 3][I = 1];
 *      Float64 Data.SamplingRate[I = 1];
 * } IRC_1100_C_HRIR.sofa;`);
 * //  { ReceiverPosition: { type: 'Float64', R: 2, C: 3, I: 1 },
 * //    SourcePosition: { type: 'Float64', M: 1680, C: 3 },
 * //    EmitterPosition: { type: 'Float64', E: 1, C: 3, I: 1 }
 * //    'Data.SamplingRate': { type: 'Float64', I: 1 } }
 */
function dataSetParse(input) {
  var parse = {};
  var definitions = _dataSetSplit.exec(input);
  if (definitions !== null && definitions.length > 1) {
    _definitionParse(definitions[1]).forEach(function (definition) {
      parse[definition[0]] = definition[1];
    });
  }
  return parse;
}

exports.default = dataSetParse;
},{}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _HrtfSet = require('./HrtfSet');

var _HrtfSet2 = _interopRequireDefault(_HrtfSet);

var _ServerDataBase = require('./ServerDataBase');

var _ServerDataBase2 = _interopRequireDefault(_ServerDataBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileOverview Utility classes to handle the loading of HRTF files form a
 * SOFA server.
 * @author Jean-Philippe.Lambert@ircam.fr
 * @copyright 2015-2016 IRCAM, Paris, France
 * @license CECILL-2.1
 */

exports.default = {
  HrtfSet: _HrtfSet2.default,
  ServerDataBase: _ServerDataBase2.default
};
},{"./HrtfSet":30,"./ServerDataBase":31}],34:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sofaParse = sofaParse;
/**
 * @fileOverview Parser for SOFA files
 * @author Jean-Philippe.Lambert@ircam.fr
 * @copyright 2015 IRCAM, Paris, France
 * @license CECILL-2.1
 */

function sofaParse(sofaString) {
  try {
    var _ret = function () {
      var sofa = JSON.parse(sofaString);
      var hrtf = {};

      hrtf.name = sofa.name;

      if (typeof sofa.attributes !== 'undefined') {
        hrtf.metaData = {};
        var metaData = sofa.attributes.find(function (e) {
          return e.name === 'NC_GLOBAL';
        });
        if (typeof metaData !== 'undefined') {
          metaData.attributes.forEach(function (e) {
            hrtf.metaData[e.name] = e.value[0];
          });
        }
      }

      if (typeof sofa.leaves !== 'undefined') {
        var data = sofa.leaves;
        data.forEach(function (d) {
          hrtf[d.name] = {};
          d.attributes.forEach(function (a) {
            hrtf[d.name][a.name] = a.value[0];
          });
          hrtf[d.name].shape = d.shape;
          hrtf[d.name].data = d.data;
        });
      }

      return {
        v: hrtf
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } catch (error) {
    throw new Error('Unable to parse SOFA string. ' + error.message);
  }
}
},{}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @fileOverview Simple XML parser, as a DOM parser.
 * @author Jean-Philippe.Lambert@ircam.fr
 * @copyright 2015-2016 IRCAM, Paris, France
 * @license CECILL-2.1
 */

/**
 * Parse an XML string into an XMLDocument object, using native browser DOM
 * parser.
 *
 * It requires a browser environment.
 *
 * @function xmlParse
 * @param {String} xmlStr full valid XML data.
 * @returns {Object} XMLDocument, DOM-like. (Use any selector.)
 *
 * @example
 * const request = new window.XMLHttpRequest();
 * request.open('GET', 'http://bili2.ircam.fr/catalog.xml');
 * request.onerror =  () => {
 *    throw new Error(`Unable to GET: ${request.status}`);
 * };
 * request.onload = () => {
 *   const xml = xmlParse(request.response);
 *   const catalogueReferences = xml.querySelector('dataset > catalogRef');
 *   console.log(catalogueReferences);
 * }
 * request.send();
 */
var xmlParse = exports.xmlParse = undefined;

if (typeof window.DOMParser !== 'undefined') {
  exports.xmlParse = xmlParse = function xmlParseDOM(xmlStr) {
    return new window.DOMParser().parseFromString(xmlStr, 'text/xml');
  };
} else if (typeof window.ActiveXObject !== 'undefined' && new window.ActiveXObject('Microsoft.XMLDOM')) {
  exports.xmlParse = xmlParse = function xmlParseActiveX(xmlStr) {
    var xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
    xmlDoc.async = 'false';
    xmlDoc.loadXML(xmlStr);
    return xmlDoc;
  };
} else {
  throw new Error('No XML parser found');
}

exports.default = xmlParse;
},{}],36:[function(require,module,exports){
/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.3.0
 */

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */
// END HEADER

exports.glMatrix = require("./gl-matrix/common.js");
exports.mat2 = require("./gl-matrix/mat2.js");
exports.mat2d = require("./gl-matrix/mat2d.js");
exports.mat3 = require("./gl-matrix/mat3.js");
exports.mat4 = require("./gl-matrix/mat4.js");
exports.quat = require("./gl-matrix/quat.js");
exports.vec2 = require("./gl-matrix/vec2.js");
exports.vec3 = require("./gl-matrix/vec3.js");
exports.vec4 = require("./gl-matrix/vec4.js");
},{"./gl-matrix/common.js":37,"./gl-matrix/mat2.js":38,"./gl-matrix/mat2d.js":39,"./gl-matrix/mat3.js":40,"./gl-matrix/mat4.js":41,"./gl-matrix/quat.js":42,"./gl-matrix/vec2.js":43,"./gl-matrix/vec3.js":44,"./gl-matrix/vec4.js":45}],37:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

/**
 * @class Common utilities
 * @name glMatrix
 */
var glMatrix = {};

// Constants
glMatrix.EPSILON = 0.000001;
glMatrix.ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
glMatrix.RANDOM = Math.random;

/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
glMatrix.setMatrixArrayType = function(type) {
    GLMAT_ARRAY_TYPE = type;
}

var degree = Math.PI / 180;

/**
* Convert Degree To Radian
*
* @param {Number} Angle in Degrees
*/
glMatrix.toRadian = function(a){
     return a * degree;
}

module.exports = glMatrix;

},{}],38:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 2x2 Matrix
 * @name mat2
 */
var mat2 = {};

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */
mat2.create = function() {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {mat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */
mat2.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */
mat2.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a1 = a[1];
        out[1] = a[2];
        out[2] = a1;
    } else {
        out[0] = a[0];
        out[1] = a[2];
        out[2] = a[1];
        out[3] = a[3];
    }
    
    return out;
};

/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],

        // Calculate the determinant
        det = a0 * a3 - a2 * a1;

    if (!det) {
        return null;
    }
    det = 1.0 / det;
    
    out[0] =  a3 * det;
    out[1] = -a1 * det;
    out[2] = -a2 * det;
    out[3] =  a0 * det;

    return out;
};

/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.adjoint = function(out, a) {
    // Caching this value is nessecary if out == a
    var a0 = a[0];
    out[0] =  a[3];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] =  a0;

    return out;
};

/**
 * Calculates the determinant of a mat2
 *
 * @param {mat2} a the source matrix
 * @returns {Number} determinant of a
 */
mat2.determinant = function (a) {
    return a[0] * a[3] - a[2] * a[1];
};

/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    return out;
};

/**
 * Alias for {@link mat2.multiply}
 * @function
 */
mat2.mul = mat2.multiply;

/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    return out;
};

/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/
mat2.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    return out;
};

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.rotate(dest, dest, rad);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.fromRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = -s;
    out[3] = c;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.scale(dest, dest, vec);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat2} out
 */
mat2.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = v[1];
    return out;
}

/**
 * Returns a string representation of a mat2
 *
 * @param {mat2} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2.str = function (a) {
    return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

/**
 * Returns Frobenius norm of a mat2
 *
 * @param {mat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)))
};

/**
 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
 * @param {mat2} L the lower triangular matrix 
 * @param {mat2} D the diagonal matrix 
 * @param {mat2} U the upper triangular matrix 
 * @param {mat2} a the input matrix to factorize
 */

mat2.LDU = function (L, D, U, a) { 
    L[2] = a[2]/a[0]; 
    U[0] = a[0]; 
    U[1] = a[1]; 
    U[3] = a[3] - L[2] * U[1]; 
    return [L, D, U];       
}; 


module.exports = mat2;

},{"./common.js":37}],39:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 2x3 Matrix
 * @name mat2d
 * 
 * @description 
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */
var mat2d = {};

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.create = function() {
    var out = new glMatrix.ARRAY_TYPE(6);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {mat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(6);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */
mat2d.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.invert = function(out, a) {
    var aa = a[0], ab = a[1], ac = a[2], ad = a[3],
        atx = a[4], aty = a[5];

    var det = aa * ad - ab * ac;
    if(!det){
        return null;
    }
    det = 1.0 / det;

    out[0] = ad * det;
    out[1] = -ab * det;
    out[2] = -ac * det;
    out[3] = aa * det;
    out[4] = (ac * aty - ad * atx) * det;
    out[5] = (ab * atx - aa * aty) * det;
    return out;
};

/**
 * Calculates the determinant of a mat2d
 *
 * @param {mat2d} a the source matrix
 * @returns {Number} determinant of a
 */
mat2d.determinant = function (a) {
    return a[0] * a[3] - a[1] * a[2];
};

/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    out[4] = a0 * b4 + a2 * b5 + a4;
    out[5] = a1 * b4 + a3 * b5 + a5;
    return out;
};

/**
 * Alias for {@link mat2d.multiply}
 * @function
 */
mat2d.mul = mat2d.multiply;

/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
mat2d.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/
mat2d.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/
mat2d.translate = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0;
    out[1] = a1;
    out[2] = a2;
    out[3] = a3;
    out[4] = a0 * v0 + a2 * v1 + a4;
    out[5] = a1 * v0 + a3 * v1 + a5;
    return out;
};

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.rotate(dest, dest, rad);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
mat2d.fromRotation = function(out, rad) {
    var s = Math.sin(rad), c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = -s;
    out[3] = c;
    out[4] = 0;
    out[5] = 0;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.scale(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat2d} out
 */
mat2d.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = v[1];
    out[4] = 0;
    out[5] = 0;
    return out;
}

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.translate(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat2d} out
 */
mat2d.fromTranslation = function(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = v[0];
    out[5] = v[1];
    return out;
}

/**
 * Returns a string representation of a mat2d
 *
 * @param {mat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2d.str = function (a) {
    return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ')';
};

/**
 * Returns Frobenius norm of a mat2d
 *
 * @param {mat2d} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2d.frob = function (a) { 
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1))
}; 

module.exports = mat2d;

},{"./common.js":37}],40:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 3x3 Matrix
 * @name mat3
 */
var mat3 = {};

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
mat3.create = function() {
    var out = new glMatrix.ARRAY_TYPE(9);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
mat3.fromMat4 = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
};

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
mat3.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(9);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
mat3.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a12 = a[5];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a01;
        out[5] = a[7];
        out[6] = a02;
        out[7] = a12;
    } else {
        out[0] = a[0];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a[1];
        out[4] = a[4];
        out[5] = a[7];
        out[6] = a[2];
        out[7] = a[5];
        out[8] = a[8];
    }
    
    return out;
};

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,

        // Calculate the determinant
        det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
};

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    out[0] = (a11 * a22 - a12 * a21);
    out[1] = (a02 * a21 - a01 * a22);
    out[2] = (a01 * a12 - a02 * a11);
    out[3] = (a12 * a20 - a10 * a22);
    out[4] = (a00 * a22 - a02 * a20);
    out[5] = (a02 * a10 - a00 * a12);
    out[6] = (a10 * a21 - a11 * a20);
    out[7] = (a01 * a20 - a00 * a21);
    out[8] = (a00 * a11 - a01 * a10);
    return out;
};

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
mat3.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
};

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b00 = b[0], b01 = b[1], b02 = b[2],
        b10 = b[3], b11 = b[4], b12 = b[5],
        b20 = b[6], b21 = b[7], b22 = b[8];

    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;

    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;

    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
};

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
mat3.mul = mat3.multiply;

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
mat3.translate = function(out, a, v) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],
        x = v[0], y = v[1];

    out[0] = a00;
    out[1] = a01;
    out[2] = a02;

    out[3] = a10;
    out[4] = a11;
    out[5] = a12;

    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
};

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.rotate = function (out, a, rad) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        s = Math.sin(rad),
        c = Math.cos(rad);

    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;

    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;

    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
};

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
mat3.scale = function(out, a, v) {
    var x = v[0], y = v[1];

    out[0] = x * a[0];
    out[1] = x * a[1];
    out[2] = x * a[2];

    out[3] = y * a[3];
    out[4] = y * a[4];
    out[5] = y * a[5];

    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.translate(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat3} out
 */
mat3.fromTranslation = function(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = v[0];
    out[7] = v[1];
    out[8] = 1;
    return out;
}

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.rotate(dest, dest, rad);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.fromRotation = function(out, rad) {
    var s = Math.sin(rad), c = Math.cos(rad);

    out[0] = c;
    out[1] = s;
    out[2] = 0;

    out[3] = -s;
    out[4] = c;
    out[5] = 0;

    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.scale(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat3} out
 */
mat3.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;

    out[3] = 0;
    out[4] = v[1];
    out[5] = 0;

    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
}

/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/
mat3.fromMat2d = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = 0;

    out[3] = a[2];
    out[4] = a[3];
    out[5] = 0;

    out[6] = a[4];
    out[7] = a[5];
    out[8] = 1;
    return out;
};

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
mat3.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[3] = yx - wz;
    out[6] = zx + wy;

    out[1] = yx + wz;
    out[4] = 1 - xx - zz;
    out[7] = zy - wx;

    out[2] = zx - wy;
    out[5] = zy + wx;
    out[8] = 1 - xx - yy;

    return out;
};

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
mat3.normalFromMat4 = function (out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

    return out;
};

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat3.str = function (a) {
    return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + 
                    a[6] + ', ' + a[7] + ', ' + a[8] + ')';
};

/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat3.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)))
};


module.exports = mat3;

},{"./common.js":37}],41:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 4x4 Matrix
 * @name mat4
 */
var mat4 = {};

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
mat4.create = function() {
    var out = new glMatrix.ARRAY_TYPE(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
mat4.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
mat4.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3],
            a12 = a[6], a13 = a[7],
            a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }
    
    return out;
};

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
};

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
mat4.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};

/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
mat4.mul = mat4.multiply;

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.translate = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};

/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.scale = function(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.rotate = function (out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < glMatrix.EPSILON) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateX = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[0]  = a[0];
        out[1]  = a[1];
        out[2]  = a[2];
        out[3]  = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateY = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateZ = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromTranslation = function(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Scaling vector
 * @returns {mat4} out
 */
mat4.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = v[1];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = v[2];
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.fromRotation = function(out, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t;
    
    if (Math.abs(len) < glMatrix.EPSILON) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    
    // Perform rotation-specific matrix multiplication
    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.fromXRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);
    
    // Perform axis-specific matrix multiplication
    out[0]  = 1;
    out[1]  = 0;
    out[2]  = 0;
    out[3]  = 0;
    out[4] = 0;
    out[5] = c;
    out[6] = s;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.fromYRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);
    
    // Perform axis-specific matrix multiplication
    out[0]  = c;
    out[1]  = 0;
    out[2]  = -s;
    out[3]  = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s;
    out[9] = 0;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.fromZRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);
    
    // Perform axis-specific matrix multiplication
    out[0]  = c;
    out[1]  = s;
    out[2]  = 0;
    out[3]  = 0;
    out[4] = -s;
    out[5] = c;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslation = function (out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    
    return out;
};

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslationScale = function (out, q, v, s) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2,
        sx = s[0],
        sy = s[1],
        sz = s[2];

    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    
    return out;
};

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @param {vec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */
mat4.fromRotationTranslationScaleOrigin = function (out, q, v, s, o) {
  // Quaternion math
  var x = q[0], y = q[1], z = q[2], w = q[3],
      x2 = x + x,
      y2 = y + y,
      z2 = z + z,

      xx = x * x2,
      xy = x * y2,
      xz = x * z2,
      yy = y * y2,
      yz = y * z2,
      zz = z * z2,
      wx = w * x2,
      wy = w * y2,
      wz = w * z2,
      
      sx = s[0],
      sy = s[1],
      sz = s[2],

      ox = o[0],
      oy = o[1],
      oz = o[2];
      
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0] + ox - (out[0] * ox + out[4] * oy + out[8] * oz);
  out[13] = v[1] + oy - (out[1] * ox + out[5] * oy + out[9] * oz);
  out[14] = v[2] + oz - (out[2] * ox + out[6] * oy + out[10] * oz);
  out[15] = 1;
        
  return out;
};

mat4.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;

    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;

    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
};

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.frustum = function (out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspectiveFromFieldOfView = function (out, fov, near, far) {
    var upTan = Math.tan(fov.upDegrees * Math.PI/180.0),
        downTan = Math.tan(fov.downDegrees * Math.PI/180.0),
        leftTan = Math.tan(fov.leftDegrees * Math.PI/180.0),
        rightTan = Math.tan(fov.rightDegrees * Math.PI/180.0),
        xScale = 2.0 / (leftTan + rightTan),
        yScale = 2.0 / (upTan + downTan);

    out[0] = xScale;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = yScale;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = ((upTan - downTan) * yScale * 0.5);
    out[10] = far / (near - far);
    out[11] = -1.0;
    out[12] = 0.0;
    out[13] = 0.0;
    out[14] = (far * near) / (near - far);
    out[15] = 0.0;
    return out;
}

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.ortho = function (out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
mat4.lookAt = function (out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < glMatrix.EPSILON &&
        Math.abs(eyey - centery) < glMatrix.EPSILON &&
        Math.abs(eyez - centerz) < glMatrix.EPSILON) {
        return mat4.identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat4.str = function (a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};

/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat4.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2) ))
};


module.exports = mat4;

},{"./common.js":37}],42:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");
var mat3 = require("./mat3.js");
var vec3 = require("./vec3.js");
var vec4 = require("./vec4.js");

/**
 * @class Quaternion
 * @name quat
 */
var quat = {};

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
quat.create = function() {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
quat.rotationTo = (function() {
    var tmpvec3 = vec3.create();
    var xUnitVec3 = vec3.fromValues(1,0,0);
    var yUnitVec3 = vec3.fromValues(0,1,0);

    return function(out, a, b) {
        var dot = vec3.dot(a, b);
        if (dot < -0.999999) {
            vec3.cross(tmpvec3, xUnitVec3, a);
            if (vec3.length(tmpvec3) < 0.000001)
                vec3.cross(tmpvec3, yUnitVec3, a);
            vec3.normalize(tmpvec3, tmpvec3);
            quat.setAxisAngle(out, tmpvec3, Math.PI);
            return out;
        } else if (dot > 0.999999) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        } else {
            vec3.cross(tmpvec3, a, b);
            out[0] = tmpvec3[0];
            out[1] = tmpvec3[1];
            out[2] = tmpvec3[2];
            out[3] = 1 + dot;
            return quat.normalize(out, out);
        }
    };
})();

/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
quat.setAxes = (function() {
    var matr = mat3.create();

    return function(out, view, right, up) {
        matr[0] = right[0];
        matr[3] = right[1];
        matr[6] = right[2];

        matr[1] = up[0];
        matr[4] = up[1];
        matr[7] = up[2];

        matr[2] = -view[0];
        matr[5] = -view[1];
        matr[8] = -view[2];

        return quat.normalize(out, quat.fromMat3(out, matr));
    };
})();

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
quat.clone = vec4.clone;

/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
quat.fromValues = vec4.fromValues;

/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
quat.copy = vec4.copy;

/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
quat.set = vec4.set;

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
quat.identity = function(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
quat.setAxisAngle = function(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
};

/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */
quat.add = vec4.add;

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
quat.multiply = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
};

/**
 * Alias for {@link quat.multiply}
 * @function
 */
quat.mul = quat.multiply;

/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
quat.scale = vec4.scale;

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateX = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateY = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        by = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateZ = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bz = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
};

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
quat.calculateW = function (out, a) {
    var x = a[0], y = a[1], z = a[2];

    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return out;
};

/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
quat.dot = vec4.dot;

/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */
quat.lerp = vec4.lerp;

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
quat.slerp = function (out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    var        omega, cosom, sinom, scale0, scale1;

    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if ( cosom < 0.0 ) {
        cosom = -cosom;
        bx = - bx;
        by = - by;
        bz = - bz;
        bw = - bw;
    }
    // calculate coefficients
    if ( (1.0 - cosom) > 0.000001 ) {
        // standard case (slerp)
        omega  = Math.acos(cosom);
        sinom  = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
    } else {        
        // "from" and "to" quaternions are very close 
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - t;
        scale1 = t;
    }
    // calculate final values
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    
    return out;
};

/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {quat} c the third operand
 * @param {quat} d the fourth operand
 * @param {Number} t interpolation amount
 * @returns {quat} out
 */
quat.sqlerp = (function () {
  var temp1 = quat.create();
  var temp2 = quat.create();
  
  return function (out, a, b, c, d, t) {
    quat.slerp(temp1, a, d, t);
    quat.slerp(temp2, b, c, t);
    quat.slerp(out, temp1, temp2, 2 * t * (1 - t));
    
    return out;
  };
}());

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
quat.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        dot = a0*a0 + a1*a1 + a2*a2 + a3*a3,
        invDot = dot ? 1.0/dot : 0;
    
    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

    out[0] = -a0*invDot;
    out[1] = -a1*invDot;
    out[2] = -a2*invDot;
    out[3] = a3*invDot;
    return out;
};

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
quat.conjugate = function (out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
};

/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 * @function
 */
quat.length = vec4.length;

/**
 * Alias for {@link quat.length}
 * @function
 */
quat.len = quat.length;

/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
quat.squaredLength = vec4.squaredLength;

/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
quat.sqrLen = quat.squaredLength;

/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
quat.normalize = vec4.normalize;

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
quat.fromMat3 = function(out, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;

    if ( fTrace > 0.0 ) {
        // |w| > 1/2, may as well choose w > 1/2
        fRoot = Math.sqrt(fTrace + 1.0);  // 2w
        out[3] = 0.5 * fRoot;
        fRoot = 0.5/fRoot;  // 1/(4w)
        out[0] = (m[5]-m[7])*fRoot;
        out[1] = (m[6]-m[2])*fRoot;
        out[2] = (m[1]-m[3])*fRoot;
    } else {
        // |w| <= 1/2
        var i = 0;
        if ( m[4] > m[0] )
          i = 1;
        if ( m[8] > m[i*3+i] )
          i = 2;
        var j = (i+1)%3;
        var k = (i+2)%3;
        
        fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
        out[i] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot;
        out[3] = (m[j*3+k] - m[k*3+j]) * fRoot;
        out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
        out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
    }
    
    return out;
};

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
quat.str = function (a) {
    return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

module.exports = quat;

},{"./common.js":37,"./mat3.js":40,"./vec3.js":44,"./vec4.js":45}],43:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 2 Dimensional Vector
 * @name vec2
 */
var vec2 = {};

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
vec2.create = function() {
    var out = new glMatrix.ARRAY_TYPE(2);
    out[0] = 0;
    out[1] = 0;
    return out;
};

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */
vec2.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(2);
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
vec2.fromValues = function(x, y) {
    var out = new glMatrix.ARRAY_TYPE(2);
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
vec2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
vec2.set = function(out, x, y) {
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
};

/**
 * Alias for {@link vec2.subtract}
 * @function
 */
vec2.sub = vec2.subtract;

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
};

/**
 * Alias for {@link vec2.multiply}
 * @function
 */
vec2.mul = vec2.multiply;

/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
};

/**
 * Alias for {@link vec2.divide}
 * @function
 */
vec2.div = vec2.divide;

/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    return out;
};

/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    return out;
};

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
vec2.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
};

/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */
vec2.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
vec2.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.distance}
 * @function
 */
vec2.dist = vec2.distance;

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec2.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */
vec2.sqrDist = vec2.squaredDistance;

/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
vec2.length = function (a) {
    var x = a[0],
        y = a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.length}
 * @function
 */
vec2.len = vec2.length;

/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec2.squaredLength = function (a) {
    var x = a[0],
        y = a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */
vec2.sqrLen = vec2.squaredLength;

/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */
vec2.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
};

/**
 * Returns the inverse of the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to invert
 * @returns {vec2} out
 */
vec2.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  return out;
};

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
vec2.normalize = function(out, a) {
    var x = a[0],
        y = a[1];
    var len = x*x + y*y;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
vec2.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1];
};

/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */
vec2.cross = function(out, a, b) {
    var z = a[0] * b[1] - a[1] * b[0];
    out[0] = out[1] = 0;
    out[2] = z;
    return out;
};

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */
vec2.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */
vec2.random = function (out, scale) {
    scale = scale || 1.0;
    var r = glMatrix.RANDOM() * 2.0 * Math.PI;
    out[0] = Math.cos(r) * scale;
    out[1] = Math.sin(r) * scale;
    return out;
};

/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    return out;
};

/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2d = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
};

/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat3 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[3] * y + m[6];
    out[1] = m[1] * x + m[4] * y + m[7];
    return out;
};

/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat4 = function(out, a, m) {
    var x = a[0], 
        y = a[1];
    out[0] = m[0] * x + m[4] * y + m[12];
    out[1] = m[1] * x + m[5] * y + m[13];
    return out;
};

/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec2.forEach = (function() {
    var vec = vec2.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 2;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec2} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec2.str = function (a) {
    return 'vec2(' + a[0] + ', ' + a[1] + ')';
};

module.exports = vec2;

},{"./common.js":37}],44:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 3 Dimensional Vector
 * @name vec3
 */
var vec3 = {};

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
vec3.create = function() {
    var out = new glMatrix.ARRAY_TYPE(3);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
};

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
vec3.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
vec3.fromValues = function(x, y, z) {
    var out = new glMatrix.ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
vec3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
vec3.set = function(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
};

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
vec3.sub = vec3.subtract;

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
};

/**
 * Alias for {@link vec3.multiply}
 * @function
 */
vec3.mul = vec3.multiply;

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
};

/**
 * Alias for {@link vec3.divide}
 * @function
 */
vec3.div = vec3.divide;

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
};

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
};

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
vec3.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
};

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
vec3.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
vec3.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.distance}
 * @function
 */
vec3.dist = vec3.distance;

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec3.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
vec3.sqrDist = vec3.squaredDistance;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
vec3.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.length}
 * @function
 */
vec3.len = vec3.length;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec3.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
vec3.sqrLen = vec3.squaredLength;

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
vec3.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
};

/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */
vec3.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
};

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
vec3.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x*x + y*y + z*z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
vec3.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.cross = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
};

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
};

/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.hermite = function (out, a, b, c, d, t) {
  var factorTimes2 = t * t,
      factor1 = factorTimes2 * (2 * t - 3) + 1,
      factor2 = factorTimes2 * (t - 2) + t,
      factor3 = factorTimes2 * (t - 1),
      factor4 = factorTimes2 * (3 - 2 * t);
  
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  
  return out;
};

/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.bezier = function (out, a, b, c, d, t) {
  var inverseFactor = 1 - t,
      inverseFactorTimesTwo = inverseFactor * inverseFactor,
      factorTimes2 = t * t,
      factor1 = inverseFactorTimesTwo * inverseFactor,
      factor2 = 3 * t * inverseFactorTimesTwo,
      factor3 = 3 * factorTimes2 * inverseFactor,
      factor4 = factorTimes2 * t;
  
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  
  return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
vec3.random = function (out, scale) {
    scale = scale || 1.0;

    var r = glMatrix.RANDOM() * 2.0 * Math.PI;
    var z = (glMatrix.RANDOM() * 2.0) - 1.0;
    var zScale = Math.sqrt(1.0-z*z) * scale;

    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale;
    return out;
};

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2],
        w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1.0;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
};

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat3 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
};

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
vec3.transformQuat = function(out, a, q) {
    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateX = function(out, a, b, c){
   var p = [], r=[];
	  //Translate point to the origin
	  p[0] = a[0] - b[0];
	  p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];

	  //perform rotation
	  r[0] = p[0];
	  r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c);
	  r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c);

	  //translate to correct position
	  out[0] = r[0] + b[0];
	  out[1] = r[1] + b[1];
	  out[2] = r[2] + b[2];

  	return out;
};

/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateY = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c);
  	r[1] = p[1];
  	r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c);
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateZ = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c);
  	r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c);
  	r[2] = p[2];
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec3.forEach = (function() {
    var vec = vec3.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 3;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
        }
        
        return a;
    };
})();

/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */
vec3.angle = function(a, b) {
   
    var tempA = vec3.fromValues(a[0], a[1], a[2]);
    var tempB = vec3.fromValues(b[0], b[1], b[2]);
 
    vec3.normalize(tempA, tempA);
    vec3.normalize(tempB, tempB);
 
    var cosine = vec3.dot(tempA, tempB);

    if(cosine > 1.0){
        return 0;
    } else {
        return Math.acos(cosine);
    }     
};

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec3.str = function (a) {
    return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
};

module.exports = vec3;

},{"./common.js":37}],45:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 4 Dimensional Vector
 * @name vec4
 */
var vec4 = {};

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
vec4.create = function() {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
};

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
vec4.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
vec4.fromValues = function(x, y, z, w) {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
vec4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
vec4.set = function(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
};

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
vec4.sub = vec4.subtract;

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];
    return out;
};

/**
 * Alias for {@link vec4.multiply}
 * @function
 */
vec4.mul = vec4.multiply;

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    out[3] = a[3] / b[3];
    return out;
};

/**
 * Alias for {@link vec4.divide}
 * @function
 */
vec4.div = vec4.divide;

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    out[3] = Math.min(a[3], b[3]);
    return out;
};

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    out[3] = Math.max(a[3], b[3]);
    return out;
};

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
vec4.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
};

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
vec4.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
vec4.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.distance}
 * @function
 */
vec4.dist = vec4.distance;

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec4.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
vec4.sqrDist = vec4.squaredDistance;

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
vec4.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.length}
 * @function
 */
vec4.len = vec4.length;

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec4.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
vec4.sqrLen = vec4.squaredLength;

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
vec4.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = -a[3];
    return out;
};

/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to invert
 * @returns {vec4} out
 */
vec4.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  out[3] = 1.0 / a[3];
  return out;
};

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
vec4.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    var len = x*x + y*y + z*z + w*w;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = x * len;
        out[1] = y * len;
        out[2] = z * len;
        out[3] = w * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
vec4.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */
vec4.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */
vec4.random = function (out, scale) {
    scale = scale || 1.0;

    //TODO: This is a pretty awful way of doing this. Find something better.
    out[0] = glMatrix.RANDOM();
    out[1] = glMatrix.RANDOM();
    out[2] = glMatrix.RANDOM();
    out[3] = glMatrix.RANDOM();
    vec4.normalize(out, out);
    vec4.scale(out, out, scale);
    return out;
};

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
vec4.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
};

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
vec4.transformQuat = function(out, a, q) {
    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    out[3] = a[3];
    return out;
};

/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec4.forEach = (function() {
    var vec = vec4.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 4;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec4.str = function (a) {
    return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

module.exports = vec4;

},{"./common.js":37}],46:[function(require,module,exports){
/**
 * AUTHOR OF INITIAL JS LIBRARY
 * k-d Tree JavaScript - V 1.0
 *
 * https://github.com/ubilabs/kd-tree-javascript
 *
 * @author Mircea Pricop <pricop@ubilabs.net>, 2012
 * @author Martin Kleppe <kleppe@ubilabs.net>, 2012
 * @author Ubilabs http://ubilabs.net, 2012
 * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
 */


function Node(obj, dimension, parent) {
  this.obj = obj;
  this.left = null;
  this.right = null;
  this.parent = parent;
  this.dimension = dimension;
}

function KdTree(points, metric, dimensions) {

  var self = this;
  
  function buildTree(points, depth, parent) {
    var dim = depth % dimensions.length,
      median,
      node;

    if (points.length === 0) {
      return null;
    }
    if (points.length === 1) {
      return new Node(points[0], dim, parent);
    }

    points.sort(function (a, b) {
      return a[dimensions[dim]] - b[dimensions[dim]];
    });

    median = Math.floor(points.length / 2);
    node = new Node(points[median], dim, parent);
    node.left = buildTree(points.slice(0, median), depth + 1, node);
    node.right = buildTree(points.slice(median + 1), depth + 1, node);

    return node;
  }

  this.root = buildTree(points, 0, null);

  this.insert = function (point) {
    function innerSearch(node, parent) {

      if (node === null) {
        return parent;
      }

      var dimension = dimensions[node.dimension];
      if (point[dimension] < node.obj[dimension]) {
        return innerSearch(node.left, node);
      } else {
        return innerSearch(node.right, node);
      }
    }

    var insertPosition = innerSearch(this.root, null),
      newNode,
      dimension;

    if (insertPosition === null) {
      this.root = new Node(point, 0, null);
      return;
    }

    newNode = new Node(point, (insertPosition.dimension + 1) % dimensions.length, insertPosition);
    dimension = dimensions[insertPosition.dimension];

    if (point[dimension] < insertPosition.obj[dimension]) {
      insertPosition.left = newNode;
    } else {
      insertPosition.right = newNode;
    }
  };

  this.remove = function (point) {
    var node;

    function nodeSearch(node) {
      if (node === null) {
        return null;
      }

      if (node.obj === point) {
        return node;
      }

      var dimension = dimensions[node.dimension];

      if (point[dimension] < node.obj[dimension]) {
        return nodeSearch(node.left, node);
      } else {
        return nodeSearch(node.right, node);
      }
    }

    function removeNode(node) {
      var nextNode,
        nextObj,
        pDimension;

      function findMax(node, dim) {
        var dimension,
          own,
          left,
          right,
          max;

        if (node === null) {
          return null;
        }

        dimension = dimensions[dim];
        if (node.dimension === dim) {
          if (node.right !== null) {
            return findMax(node.right, dim);
          }
          return node;
        }

        own = node.obj[dimension];
        left = findMax(node.left, dim);
        right = findMax(node.right, dim);
        max = node;

        if (left !== null && left.obj[dimension] > own) {
          max = left;
        }

        if (right !== null && right.obj[dimension] > max.obj[dimension]) {
          max = right;
        }
        return max;
      }

      function findMin(node, dim) {
        var dimension,
          own,
          left,
          right,
          min;

        if (node === null) {
          return null;
        }

        dimension = dimensions[dim];

        if (node.dimension === dim) {
          if (node.left !== null) {
            return findMin(node.left, dim);
          }
          return node;
        }

        own = node.obj[dimension];
        left = findMin(node.left, dim);
        right = findMin(node.right, dim);
        min = node;

        if (left !== null && left.obj[dimension] < own) {
          min = left;
        }
        if (right !== null && right.obj[dimension] < min.obj[dimension]) {
          min = right;
        }
        return min;
      }

      if (node.left === null && node.right === null) {
        if (node.parent === null) {
          self.root = null;
          return;
        }

        pDimension = dimensions[node.parent.dimension];

        if (node.obj[pDimension] < node.parent.obj[pDimension]) {
          node.parent.left = null;
        } else {
          node.parent.right = null;
        }
        return;
      }

      if (node.left !== null) {
        nextNode = findMax(node.left, node.dimension);
      } else {
        nextNode = findMin(node.right, node.dimension);
      }

      nextObj = nextNode.obj;
      removeNode(nextNode);
      node.obj = nextObj;

    }

    node = nodeSearch(self.root);

    if (node === null) { return; }

    removeNode(node);
  };

  this.nearest = function (point, maxNodes, maxDistance) {
    var i,
      result,
      bestNodes;

    bestNodes = new BinaryHeap(
      function (e) { return -e[1]; }
    );

    function nearestSearch(node) {
      if(!self.root){
        return [];
      }
      var bestChild,
        dimension = dimensions[node.dimension],
        ownDistance = metric(point, node.obj),
        linearPoint = {},
        linearDistance,
        otherChild,
        i;

      function saveNode(node, distance) {
        bestNodes.push([node, distance]);
        if (bestNodes.size() > maxNodes) {
          bestNodes.pop();
        }
      }

      for (i = 0; i < dimensions.length; i += 1) {
        if (i === node.dimension) {
          linearPoint[dimensions[i]] = point[dimensions[i]];
        } else {
          linearPoint[dimensions[i]] = node.obj[dimensions[i]];
        }
      }

      linearDistance = metric(linearPoint, node.obj);

      if (node.right === null && node.left === null) {
        if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[1]) {
          saveNode(node, ownDistance);
        }
        return;
      }

      if (node.right === null) {
        bestChild = node.left;
      } else if (node.left === null) {
        bestChild = node.right;
      } else {
        if (point[dimension] < node.obj[dimension]) {
          bestChild = node.left;
        } else {
          bestChild = node.right;
        }
      }

      nearestSearch(bestChild);

      if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[1]) {
        saveNode(node, ownDistance);
      }

      if (bestNodes.size() < maxNodes || Math.abs(linearDistance) < bestNodes.peek()[1]) {
        if (bestChild === node.left) {
          otherChild = node.right;
        } else {
          otherChild = node.left;
        }
        if (otherChild !== null) {
          nearestSearch(otherChild);
        }
      }
    }

    if (maxDistance) {
      for (i = 0; i < maxNodes; i += 1) {
        bestNodes.push([null, maxDistance]);
      }
    }

    nearestSearch(self.root);

    result = [];

    for (i = 0; i < maxNodes && i < bestNodes.content.length; i += 1) {
      if (bestNodes.content[i][0]) {
        result.push([bestNodes.content[i][0].obj, bestNodes.content[i][1]]);
      }
    }
    return result;
  };

  this.balanceFactor = function () {
    function height(node) {
      if (node === null) {
        return 0;
      }
      return Math.max(height(node.left), height(node.right)) + 1;
    }

    function count(node) {
      if (node === null) {
        return 0;
      }
      return count(node.left) + count(node.right) + 1;
    }

    return height(self.root) / (Math.log(count(self.root)) / Math.log(2));
  };
}

// Binary heap implementation from:
// http://eloquentjavascript.net/appendix2.html

function BinaryHeap(scoreFunction){
  this.content = [];
  this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
  push: function(element) {
    // Add the new element to the end of the array.
    this.content.push(element);
    // Allow it to bubble up.
    this.bubbleUp(this.content.length - 1);
  },

  pop: function() {
    // Store the first element so we can return it later.
    var result = this.content[0];
    // Get the element at the end of the array.
    var end = this.content.pop();
    // If there are any elements left, put the end element at the
    // start, and let it sink down.
    if (this.content.length > 0) {
      this.content[0] = end;
      this.sinkDown(0);
    }
    return result;
  },

  peek: function() {
    return this.content[0];
  },

  remove: function(node) {
    var len = this.content.length;
    // To remove a value, we must search through the array to find
    // it.
    for (var i = 0; i < len; i++) {
      if (this.content[i] == node) {
        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        var end = this.content.pop();
        if (i != len - 1) {
          this.content[i] = end;
          if (this.scoreFunction(end) < this.scoreFunction(node))
            this.bubbleUp(i);
          else
            this.sinkDown(i);
        }
        return;
      }
    }
    throw new Error("Node not found.");
  },

  size: function() {
    return this.content.length;
  },

  bubbleUp: function(n) {
    // Fetch the element that has to be moved.
    var element = this.content[n];
    // When at 0, an element can not go up any further.
    while (n > 0) {
      // Compute the parent element's index, and fetch it.
      var parentN = Math.floor((n + 1) / 2) - 1,
          parent = this.content[parentN];
      // Swap the elements if the parent is greater.
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        // Update 'n' to continue at the new position.
        n = parentN;
      }
      // Found a parent that is less, no need to move it further.
      else {
        break;
      }
    }
  },

  sinkDown: function(n) {
    // Look up the target element and its score.
    var length = this.content.length,
        element = this.content[n],
        elemScore = this.scoreFunction(element);

    while(true) {
      // Compute the indices of the child elements.
      var child2N = (n + 1) * 2, child1N = child2N - 1;
      // This is used to store the new position of the element,
      // if any.
      var swap = null;
      // If the first child exists (is inside the array)...
      if (child1N < length) {
        // Look it up and compute its score.
        var child1 = this.content[child1N],
            child1Score = this.scoreFunction(child1);
        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore)
          swap = child1N;
      }
      // Do the same checks for the other child.
      if (child2N < length) {
        var child2 = this.content[child2N],
            child2Score = this.scoreFunction(child2);
        if (child2Score < (swap == null ? elemScore : child1Score)){
          swap = child2N;
        }
      }

      // If the element needs to be moved, swap it, and continue.
      if (swap != null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }
      // Otherwise, we are done.
      else {
        break;
      }
    }
  }
};

module.exports = {
  createKdTree: function (points, metric, dimensions) {
    return new KdTree(points, metric, dimensions)
  }
}

},{}]},{},[8])(8)
});