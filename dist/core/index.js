"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _Object$defineProperty = require("babel-runtime/core-js/object/define-property")["default"];

var _getIterator = require("babel-runtime/core-js/get-iterator")["default"];

_Object$defineProperty(exports, "__esModule", {
    value: true
});

/**
 * Template for other audio nodes: set the audioContext reference and provide connect/disconnect methods for the audio node.
 */

var AbstractNode = (function () {
    /**
     * AbstractNode constructor
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection instance.
     */

    function AbstractNode(audioContext) {
        var audioStreamDescriptionCollection = arguments[1] === undefined ? undefined : arguments[1];

        _classCallCheck(this, AbstractNode);

        this._audioContext = audioContext;
        this._audioStreamDescriptionCollection = audioStreamDescriptionCollection;
        /**
         * @type {AudioNode}
         */
        this.input = this._audioContext.createGain();
        this._output = this._audioContext.createGain();
    }

    _createClass(AbstractNode, [{
        key: "connect",

        /**
         * Connect the audio node
         * @param {AudioNode} node - an AudioNode to connect to.
         */
        value: function connect(node) {
            this._output.connect(node);
        }
    }, {
        key: "disconnect",

        /**
         * Disconnect the audio node
         * @param {AudioNode} node - an AudioNode to disconnect to.
         */
        value: function disconnect(node) {
            this._output.disconnect(node);
        }
    }]);

    return AbstractNode;
})();

exports["default"] = AbstractNode;

/**
 * Container for AudioStreamDescription
 */

var AudioStreamDescriptionCollection = (function () {
    /**
     * AudioStreamDescriptionCollection constructor
     * @param {AudioStreamDescription[]} streams - array of AudioStreamDescription
     */

    function AudioStreamDescriptionCollection(streams) {
        _classCallCheck(this, AudioStreamDescriptionCollection);

        this._streams = streams;
    }

    _createClass(AudioStreamDescriptionCollection, [{
        key: "streams",

        /**
         * Set the stream description collection
         * @type {AudioStreamDescription[]}
         */
        set: function (streams) {
            this._streams = streams;
        },

        /**
         * Get the stream description collection
         * @type {AudioStreamDescription[]}
         */
        get: function () {
            return this._streams;
        }
    }, {
        key: "actives",

        /**
         * Get the current active audio stream descriptions of the collection
         * @type {AudioStreamDescription[]}
         */
        get: function () {
            var actives = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = _getIterator(this._streams), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var stream = _step.value;

                    if (stream.active) {
                        actives.push(stream);
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator["return"]) {
                        _iterator["return"]();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return actives;
        }
    }, {
        key: "dialog",

        /**
         * Get the current dialog audio stream description of the collection
         * @type {AudioStreamDescription}
         */
        get: function () {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = _getIterator(this._streams), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var stream = _step2.value;

                    if (stream.dialog) {
                        return stream;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                        _iterator2["return"]();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return undefined;
        }
    }]);

    return AudioStreamDescriptionCollection;
})();

exports.AudioStreamDescriptionCollection = AudioStreamDescriptionCollection;

/**
 * AudioStreamDescription describes a stream.
 */

var AudioStreamDescription = (function () {
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
        var active = arguments[1] === undefined ? false : arguments[1];
        var loudness = arguments[2] === undefined ? undefined : arguments[2];
        var maxTruePeak = arguments[3] === undefined ? undefined : arguments[3];
        var dialog = arguments[4] === undefined ? false : arguments[4];
        var ambiance = arguments[5] === undefined ? false : arguments[5];
        var commentary = arguments[6] === undefined ? false : arguments[6];

        _classCallCheck(this, AudioStreamDescription);

        this._type = type;
        this._active = active;
        this._loudness = loudness;
        this._maxTruePeak = maxTruePeak;
        this._dialog = dialog;
        this._ambiance = ambiance;
        this._commentary = commentary;
    }

    _createClass(AudioStreamDescription, [{
        key: "channelPositions",

        /**
         * Get channel position based on audio stream type
         * @type {number[]}
         */
        get: function () {
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
    }, {
        key: "active",

        /**
         * Set active, if stream is currently playing or not
         * @type {boolean}
         */
        set: function (value) {
            this._active = value;
        },

        /**
         * Get active, if stream is currently playing or not
         * @type {boolean}
         */
        get: function () {
            return this._active;
        }
    }, {
        key: "loudness",

        /**
         * Set the loudness value of audio stream
         * @type {number}
         */
        set: function (value) {
            this._loudness = value;
        },

        /**
         * Get the loudness of audio stream
         * @type {number}
         */
        get: function () {
            return this._loudness;
        }
    }, {
        key: "maxTruePeak",

        /**
         * Set the maxTruePeak of audio stream
         * @type {number}
         */
        set: function (value) {
            this._maxTruePeak = value;
        },

        /**
         * Get the maxTruePeak of audio stream
         * @type {number}
         */
        get: function () {
            return this._maxTruePeak;
        }
    }, {
        key: "dialog",

        /**
         * Set dialog, if stream is currently a dialog or not
         * @type {boolean}
         */
        set: function (value) {
            this._dialog = value;
        },

        /**
         * Get dialog, if stream is currently a dialog or not
         * @type {boolean}
         */
        get: function () {
            return this._dialog;
        }
    }, {
        key: "ambiance",

        /**
         * Set ambiance, if stream is currently an ambiance or not
         * @type {boolean}
         */
        set: function (value) {
            this._ambiance = value;
        },

        /**
         * Get ambiance, if stream is currently an ambiance or not
         * @type {boolean}
         */
        get: function () {
            return this._ambiance;
        }
    }, {
        key: "commentary",

        /**
         * Set commentary, if stream is currently a commentary (audio description) or not
         * @type {boolean}
         */
        set: function (value) {
            this._commentary = value;
        },

        /**
         * Get commentary, if stream is currently a commentary (audio description) or not
         * @type {boolean}
         */
        get: function () {
            return this._commentary;
        }
    }]);

    return AudioStreamDescription;
})();

exports.AudioStreamDescription = AudioStreamDescription;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9zbWFydC1mYWRlci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFHcUIsWUFBWTs7Ozs7OztBQU1sQixhQU5NLFlBQVksQ0FNakIsWUFBWSxFQUErQztZQUE3QyxnQ0FBZ0MsZ0NBQUcsU0FBUzs7OEJBTnJELFlBQVk7O0FBT3pCLFlBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO0FBQ2xDLFlBQUksQ0FBQyxpQ0FBaUMsR0FBRyxnQ0FBZ0MsQ0FBQzs7OztBQUkxRSxZQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDN0MsWUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQ2xEOztpQkFkZ0IsWUFBWTs7Ozs7OztlQW1CdEIsaUJBQUMsSUFBSSxFQUFDO0FBQ1QsZ0JBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQzdCOzs7Ozs7OztlQUtTLG9CQUFDLElBQUksRUFBQztBQUNaLGdCQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUNoQzs7O1dBNUJnQixZQUFZOzs7cUJBQVosWUFBWTs7Ozs7O0lBbUNwQixnQ0FBZ0M7Ozs7OztBQUs5QixhQUxGLGdDQUFnQyxDQUs3QixPQUFPLEVBQUM7OEJBTFgsZ0NBQWdDOztBQU1yQyxZQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztLQUMzQjs7aUJBUFEsZ0NBQWdDOzs7Ozs7O2FBWTlCLFVBQUMsT0FBTyxFQUFDO0FBQ2hCLGdCQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztTQUMzQjs7Ozs7O2FBS1UsWUFBRTtBQUNULG1CQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDeEI7Ozs7Ozs7O2FBS1UsWUFBRTtBQUNULGdCQUFJLE9BQU8sR0FBRyxFQUFFLENBQUE7Ozs7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QUFLLEVBQUM7QUFDYixnQkFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7U0FDeEI7Ozs7OzthQUtTLFlBQUU7QUFDUixtQkFBTyxJQUFJLENBQUMsT0FBTyxDQUFBO1NBQ3RCOzs7Ozs7OzthQUtXLFVBQUMsS0FBSyxFQUFDO0FBQ2YsZ0JBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1NBQzFCOzs7Ozs7YUFLVyxZQUFFO0FBQ1YsbUJBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUN6Qjs7Ozs7Ozs7YUFLYSxVQUFDLEtBQUssRUFBQztBQUNqQixnQkFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7U0FDNUI7Ozs7OzthQUthLFlBQUU7QUFDWixtQkFBTyxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQzNCOzs7V0EzSFEsc0JBQXNCOzs7UUFBdEIsc0JBQXNCLEdBQXRCLHNCQUFzQiIsImZpbGUiOiJsaWIvc21hcnQtZmFkZXIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlbXBsYXRlIGZvciBvdGhlciBhdWRpbyBub2Rlczogc2V0IHRoZSBhdWRpb0NvbnRleHQgcmVmZXJlbmNlIGFuZCBwcm92aWRlIGNvbm5lY3QvZGlzY29ubmVjdCBtZXRob2RzIGZvciB0aGUgYXVkaW8gbm9kZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWJzdHJhY3ROb2RlIHtcbiAgICAvKipcbiAgICAgKiBBYnN0cmFjdE5vZGUgY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge0F1ZGlvQ29udGV4dH0gYXVkaW9Db250ZXh0IC0gYXVkaW9Db250ZXh0IGluc3RhbmNlLlxuICAgICAqIEBwYXJhbSB7QXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb259IGF1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9uIC0gYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24gaW5zdGFuY2UuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoYXVkaW9Db250ZXh0LCBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbiA9IHVuZGVmaW5lZCl7XG4gICAgICAgIHRoaXMuX2F1ZGlvQ29udGV4dCA9IGF1ZGlvQ29udGV4dDtcbiAgICAgICAgdGhpcy5fYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24gPSBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEB0eXBlIHtBdWRpb05vZGV9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmlucHV0ID0gdGhpcy5fYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICAgICAgdGhpcy5fb3V0cHV0ID0gdGhpcy5fYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29ubmVjdCB0aGUgYXVkaW8gbm9kZVxuICAgICAqIEBwYXJhbSB7QXVkaW9Ob2RlfSBub2RlIC0gYW4gQXVkaW9Ob2RlIHRvIGNvbm5lY3QgdG8uXG4gICAgICovXG4gICAgY29ubmVjdChub2RlKXtcbiAgICAgICAgdGhpcy5fb3V0cHV0LmNvbm5lY3Qobm9kZSlcbiAgICB9XG4gICAgLyoqXG4gICAgICogRGlzY29ubmVjdCB0aGUgYXVkaW8gbm9kZVxuICAgICAqIEBwYXJhbSB7QXVkaW9Ob2RlfSBub2RlIC0gYW4gQXVkaW9Ob2RlIHRvIGRpc2Nvbm5lY3QgdG8uXG4gICAgICovXG4gICAgZGlzY29ubmVjdChub2RlKXtcbiAgICAgICAgdGhpcy5fb3V0cHV0LmRpc2Nvbm5lY3Qobm9kZSlcbiAgICB9XG59XG5cblxuLyoqXG4gKiBDb250YWluZXIgZm9yIEF1ZGlvU3RyZWFtRGVzY3JpcHRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIEF1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9uIHtcbiAgICAvKipcbiAgICAgKiBBdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbiBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7QXVkaW9TdHJlYW1EZXNjcmlwdGlvbltdfSBzdHJlYW1zIC0gYXJyYXkgb2YgQXVkaW9TdHJlYW1EZXNjcmlwdGlvblxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHN0cmVhbXMpe1xuICAgICAgICB0aGlzLl9zdHJlYW1zID0gc3RyZWFtcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBzdHJlYW0gZGVzY3JpcHRpb24gY29sbGVjdGlvblxuICAgICAqIEB0eXBlIHtBdWRpb1N0cmVhbURlc2NyaXB0aW9uW119XG4gICAgICovXG4gICAgc2V0IHN0cmVhbXMoc3RyZWFtcyl7XG4gICAgICAgIHRoaXMuX3N0cmVhbXMgPSBzdHJlYW1zO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIHN0cmVhbSBkZXNjcmlwdGlvbiBjb2xsZWN0aW9uXG4gICAgICogQHR5cGUge0F1ZGlvU3RyZWFtRGVzY3JpcHRpb25bXX1cbiAgICAgKi9cbiAgICBnZXQgc3RyZWFtcygpe1xuICAgICAgICByZXR1cm4gdGhpcy5fc3RyZWFtcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBjdXJyZW50IGFjdGl2ZSBhdWRpbyBzdHJlYW0gZGVzY3JpcHRpb25zIG9mIHRoZSBjb2xsZWN0aW9uXG4gICAgICogQHR5cGUge0F1ZGlvU3RyZWFtRGVzY3JpcHRpb25bXX1cbiAgICAgKi9cbiAgICBnZXQgYWN0aXZlcygpe1xuICAgICAgICBsZXQgYWN0aXZlcyA9IFtdXG4gICAgICAgIGZvciAobGV0IHN0cmVhbSBvZiB0aGlzLl9zdHJlYW1zKXtcbiAgICAgICAgICAgIGlmKHN0cmVhbS5hY3RpdmUpe1xuICAgICAgICAgICAgICAgIGFjdGl2ZXMucHVzaChzdHJlYW0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjdGl2ZXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgY3VycmVudCBkaWFsb2cgYXVkaW8gc3RyZWFtIGRlc2NyaXB0aW9uIG9mIHRoZSBjb2xsZWN0aW9uXG4gICAgICogQHR5cGUge0F1ZGlvU3RyZWFtRGVzY3JpcHRpb259XG4gICAgICovXG4gICAgZ2V0IGRpYWxvZygpe1xuICAgICAgICBmb3IgKGxldCBzdHJlYW0gb2YgdGhpcy5fc3RyZWFtcyl7XG4gICAgICAgICAgICBpZihzdHJlYW0uZGlhbG9nKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyZWFtO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG59XG5cblxuLyoqXG4gKiBBdWRpb1N0cmVhbURlc2NyaXB0aW9uIGRlc2NyaWJlcyBhIHN0cmVhbS5cbiAqL1xuZXhwb3J0IGNsYXNzIEF1ZGlvU3RyZWFtRGVzY3JpcHRpb24ge1xuICAgIC8qKlxuICAgICAqIEF1ZGlvU3RyZWFtRGVzY3JpcHRpb24gY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIHR5cGUuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBhY3RpdmUgLSBhY3RpdmUuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvdWRuZXNzIC0gbG91ZG5lc3MuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heFRydWVQZWFrIC0gbWF4VHJ1ZVBlYWsuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBkaWFsb2cgLSBkaWFsb2cuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBhbWJpYW5jZSAtIGFtYmlhbmNlLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHR5cGUsIGFjdGl2ZSA9IGZhbHNlLCBsb3VkbmVzcyA9IHVuZGVmaW5lZCwgbWF4VHJ1ZVBlYWsgPSB1bmRlZmluZWQsIGRpYWxvZyA9IGZhbHNlLCBhbWJpYW5jZSA9IGZhbHNlLCBjb21tZW50YXJ5ID0gZmFsc2Upe1xuICAgICAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5fYWN0aXZlID0gYWN0aXZlO1xuICAgICAgICB0aGlzLl9sb3VkbmVzcyA9IGxvdWRuZXNzO1xuICAgICAgICB0aGlzLl9tYXhUcnVlUGVhayA9IG1heFRydWVQZWFrO1xuICAgICAgICB0aGlzLl9kaWFsb2cgPSBkaWFsb2c7XG4gICAgICAgIHRoaXMuX2FtYmlhbmNlID0gYW1iaWFuY2U7XG4gICAgICAgIHRoaXMuX2NvbW1lbnRhcnkgPSBjb21tZW50YXJ5O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgY2hhbm5lbCBwb3NpdGlvbiBiYXNlZCBvbiBhdWRpbyBzdHJlYW0gdHlwZVxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKi9cbiAgICBnZXQgY2hhbm5lbFBvc2l0aW9ucygpe1xuICAgICAgICBzd2l0Y2godGhpcy5fdHlwZSl7XG4gICAgICAgICAgICBjYXNlIFwiTW9ub1wiOlxuICAgICAgICAgICAgICAgIHJldHVybiBbMF07XG4gICAgICAgICAgICBjYXNlIFwiU3RlcmVvXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFstMzAsICszMF07XG4gICAgICAgICAgICBjYXNlIFwiTXVsdGlXaXRob3V0TEZFXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFstMzAsICszMCwgMCwgLTExMCwgKzExMF1cbiAgICAgICAgICAgIGNhc2UgXCJNdWx0aVdpdGhMRkVcIjpcbiAgICAgICAgICAgICAgICAvLyBAbiBMRkUgcG9zaXRpb24gaXMgaXJyZWxldmFudCBcbiAgICAgICAgICAgICAgICAvLyBidXQgcHJvdmlkZWQgc28gdGhhdCB0aGUgYXJyYXkgaGFzIGEgbGVuZ3RoIG9mIDZcbiAgICAgICAgICAgICAgICByZXR1cm4gWy0zMCwgKzMwLCAwLCAtMTEwLCArMTEwLCAwXVxuICAgICAgICAgICAgY2FzZSBcIkVpZ2h0Q2hhbm5lbFwiOlxuICAgICAgICAgICAgICAgIC8vIEB0b2RvIHNldCBjb3JyZWN0IHBvc2l0aW9uc1xuICAgICAgICAgICAgICAgIHJldHVybiBbMSwgMiwgMywgNCwgNSwgNiwgNywgOF1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgYWN0aXZlLCBpZiBzdHJlYW0gaXMgY3VycmVudGx5IHBsYXlpbmcgb3Igbm90XG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgc2V0IGFjdGl2ZSh2YWx1ZSl7XG4gICAgICAgIHRoaXMuX2FjdGl2ZSA9IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgYWN0aXZlLCBpZiBzdHJlYW0gaXMgY3VycmVudGx5IHBsYXlpbmcgb3Igbm90XG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgZ2V0IGFjdGl2ZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fYWN0aXZlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIGxvdWRuZXNzIHZhbHVlIG9mIGF1ZGlvIHN0cmVhbVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgc2V0IGxvdWRuZXNzKHZhbHVlKXtcbiAgICAgICAgdGhpcy5fbG91ZG5lc3MgPSB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBsb3VkbmVzcyBvZiBhdWRpbyBzdHJlYW1cbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldCBsb3VkbmVzcygpe1xuICAgICAgICByZXR1cm4gdGhpcy5fbG91ZG5lc3NcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBtYXhUcnVlUGVhayBvZiBhdWRpbyBzdHJlYW1cbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHNldCBtYXhUcnVlUGVhayh2YWx1ZSl7XG4gICAgICAgIHRoaXMuX21heFRydWVQZWFrID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgbWF4VHJ1ZVBlYWsgb2YgYXVkaW8gc3RyZWFtXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBnZXQgbWF4VHJ1ZVBlYWsoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21heFRydWVQZWFrXG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCBkaWFsb2csIGlmIHN0cmVhbSBpcyBjdXJyZW50bHkgYSBkaWFsb2cgb3Igbm90XG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgc2V0IGRpYWxvZyh2YWx1ZSl7XG4gICAgICAgIHRoaXMuX2RpYWxvZyA9IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgZGlhbG9nLCBpZiBzdHJlYW0gaXMgY3VycmVudGx5IGEgZGlhbG9nIG9yIG5vdFxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIGdldCBkaWFsb2coKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RpYWxvZ1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgYW1iaWFuY2UsIGlmIHN0cmVhbSBpcyBjdXJyZW50bHkgYW4gYW1iaWFuY2Ugb3Igbm90XG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgc2V0IGFtYmlhbmNlKHZhbHVlKXtcbiAgICAgICAgdGhpcy5fYW1iaWFuY2UgPSB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IGFtYmlhbmNlLCBpZiBzdHJlYW0gaXMgY3VycmVudGx5IGFuIGFtYmlhbmNlIG9yIG5vdFxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIGdldCBhbWJpYW5jZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fYW1iaWFuY2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCBjb21tZW50YXJ5LCBpZiBzdHJlYW0gaXMgY3VycmVudGx5IGEgY29tbWVudGFyeSAoYXVkaW8gZGVzY3JpcHRpb24pIG9yIG5vdFxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIHNldCBjb21tZW50YXJ5KHZhbHVlKXtcbiAgICAgICAgdGhpcy5fY29tbWVudGFyeSA9IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgY29tbWVudGFyeSwgaWYgc3RyZWFtIGlzIGN1cnJlbnRseSBhIGNvbW1lbnRhcnkgKGF1ZGlvIGRlc2NyaXB0aW9uKSBvciBub3RcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBnZXQgY29tbWVudGFyeSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fY29tbWVudGFyeTtcbiAgICB9XG59XG5cblxuLyoqXG4gKiBIUlRGXG4gKiBAdG9kbzogdG8gYmUgZGVmaW5lZFxuICogQHR5cGVkZWYge09iamVjdH0gSFJURlxuICovXG5cbi8qKlxuICogRXFQcmVzZXRcbiAqIEB0b2RvOiB0byBiZSBkZWZpbmVkXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBFcVByZXNldFxuICovXG5cbiAvKipcbiAqIEBleHRlcm5hbCB7QXVkaW9Db250ZXh0fSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9mci9kb2NzL1dlYi9BUEkvQXVkaW9Db250ZXh0XG4gKi9cbiJdfQ==