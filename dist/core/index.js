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

var AudioStreamDescriptionCollection = (function () {
    function AudioStreamDescriptionCollection(streams) {
        _classCallCheck(this, AudioStreamDescriptionCollection);

        this._streams = streams;
    }

    _createClass(AudioStreamDescriptionCollection, [{
        key: "streams",
        set: function (streams) {
            this._streams = streams;
        },
        get: function () {
            return this._streams;
        }
    }, {
        key: "actives",
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

var AudioStreamDescription = (function () {
    function AudioStreamDescription(type) {
        var active = arguments[1] === undefined ? false : arguments[1];
        var loudness = arguments[2] === undefined ? undefined : arguments[2];
        var maxTruePeak = arguments[3] === undefined ? undefined : arguments[3];
        var dialog = arguments[4] === undefined ? false : arguments[4];
        var ambiance = arguments[5] === undefined ? false : arguments[5];

        _classCallCheck(this, AudioStreamDescription);

        this._type = type;
        this._active = active;
        this._loudness = loudness;
        this._maxTruePeak = maxTruePeak;
        this._dialog = dialog;
        this._ambiance = ambiance;
    }

    _createClass(AudioStreamDescription, [{
        key: "channelPositions",

        /**
         * @todo better name?
         */
        get: function () {
            switch (this._type) {
                case "Mono":
                    return [0];
                case "Stereo":
                    return [-30, 30];
                case "MultiWithoutLFE":
                    return [-30, 0, +30, -110, +110];
                case "MultiWithLFE":
                    // @todo set correct LFE position
                    return [-30, 0, +30, -110, +110, 0];
                case "EightChannel":
                    // @todo set correct positions
                    return [1, 2, 3, 4, 5, 6, 7, 8];
            }
        }
    }, {
        key: "active",
        set: function (value) {
            this._active = value;
        },
        get: function () {
            return this._active;
        }
    }, {
        key: "loudness",
        set: function (value) {
            this._loudness = value;
        },
        get: function () {
            return this._loudness;
        }
    }, {
        key: "maxTruePeak",
        set: function (value) {
            this._maxTruePeak = value;
        },
        get: function () {
            return this._maxTruePeak;
        }
    }, {
        key: "dialog",
        set: function (value) {
            this._dialog = value;
        },
        get: function () {
            return this._dialog;
        }
    }, {
        key: "ambiance",
        set: function (value) {
            this._ambiance = value;
        },
        get: function () {
            return this._ambiance;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9zbWFydC1mYWRlci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFHcUIsWUFBWTs7Ozs7OztBQU1sQixhQU5NLFlBQVksQ0FNakIsWUFBWSxFQUErQztZQUE3QyxnQ0FBZ0MsZ0NBQUcsU0FBUzs7OEJBTnJELFlBQVk7O0FBT3pCLFlBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO0FBQ2xDLFlBQUksQ0FBQyxpQ0FBaUMsR0FBRyxnQ0FBZ0MsQ0FBQzs7OztBQUkxRSxZQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDN0MsWUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQ2xEOztpQkFkZ0IsWUFBWTs7Ozs7OztlQW1CdEIsaUJBQUMsSUFBSSxFQUFDO0FBQ1QsZ0JBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQzdCOzs7Ozs7OztlQUtTLG9CQUFDLElBQUksRUFBQztBQUNaLGdCQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUNoQzs7O1dBNUJnQixZQUFZOzs7cUJBQVosWUFBWTs7SUFnQ3BCLGdDQUFnQztBQUM5QixhQURGLGdDQUFnQyxDQUM3QixPQUFPLEVBQUM7OEJBRFgsZ0NBQWdDOztBQUVyQyxZQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztLQUMzQjs7aUJBSFEsZ0NBQWdDOzthQUk5QixVQUFDLE9BQU8sRUFBQztBQUNoQixnQkFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7U0FDM0I7YUFDVSxZQUFFO0FBQ1QsbUJBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUN4Qjs7O2FBQ1UsWUFBRTtBQUNULGdCQUFJLE9BQU8sR0FBRyxFQUFFLENBQUE7Ozs7OztBQUNoQixrREFBbUIsSUFBSSxDQUFD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RyxLQUFLLENBQUM7U0FDMUI7YUFDVyxZQUFFO0FBQ1YsbUJBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQTtTQUN4Qjs7O1dBekRRLHNCQUFzQjs7O1FBQXRCLHNCQUFzQixHQUF0QixzQkFBc0IiLCJmaWxlIjoibGliL3NtYXJ0LWZhZGVyL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZW1wbGF0ZSBmb3Igb3RoZXIgYXVkaW8gbm9kZXM6IHNldCB0aGUgYXVkaW9Db250ZXh0IHJlZmVyZW5jZSBhbmQgcHJvdmlkZSBjb25uZWN0L2Rpc2Nvbm5lY3QgbWV0aG9kcyBmb3IgdGhlIGF1ZGlvIG5vZGUuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFic3RyYWN0Tm9kZSB7XG4gICAgLyoqXG4gICAgICogQWJzdHJhY3ROb2RlIGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IGF1ZGlvQ29udGV4dCAtIGF1ZGlvQ29udGV4dCBpbnN0YW5jZS5cbiAgICAgKiBAcGFyYW0ge0F1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9ufSBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbiAtIGF1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9uIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGF1ZGlvQ29udGV4dCwgYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24gPSB1bmRlZmluZWQpe1xuICAgICAgICB0aGlzLl9hdWRpb0NvbnRleHQgPSBhdWRpb0NvbnRleHQ7XG4gICAgICAgIHRoaXMuX2F1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9uID0gYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb247XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSB7QXVkaW9Ob2RlfVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5pbnB1dCA9IHRoaXMuX2F1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gICAgICAgIHRoaXMuX291dHB1dCA9IHRoaXMuX2F1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbm5lY3QgdGhlIGF1ZGlvIG5vZGVcbiAgICAgKiBAcGFyYW0ge0F1ZGlvTm9kZX0gbm9kZSAtIGFuIEF1ZGlvTm9kZSB0byBjb25uZWN0IHRvLlxuICAgICAqL1xuICAgIGNvbm5lY3Qobm9kZSl7XG4gICAgICAgIHRoaXMuX291dHB1dC5jb25uZWN0KG5vZGUpXG4gICAgfVxuICAgIC8qKlxuICAgICAqIERpc2Nvbm5lY3QgdGhlIGF1ZGlvIG5vZGVcbiAgICAgKiBAcGFyYW0ge0F1ZGlvTm9kZX0gbm9kZSAtIGFuIEF1ZGlvTm9kZSB0byBkaXNjb25uZWN0IHRvLlxuICAgICAqL1xuICAgIGRpc2Nvbm5lY3Qobm9kZSl7XG4gICAgICAgIHRoaXMuX291dHB1dC5kaXNjb25uZWN0KG5vZGUpXG4gICAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBBdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbiB7XG4gICAgY29uc3RydWN0b3Ioc3RyZWFtcyl7XG4gICAgICAgIHRoaXMuX3N0cmVhbXMgPSBzdHJlYW1zO1xuICAgIH1cbiAgICBzZXQgc3RyZWFtcyhzdHJlYW1zKXtcbiAgICAgICAgdGhpcy5fc3RyZWFtcyA9IHN0cmVhbXM7XG4gICAgfVxuICAgIGdldCBzdHJlYW1zKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdHJlYW1zO1xuICAgIH1cbiAgICBnZXQgYWN0aXZlcygpe1xuICAgICAgICBsZXQgYWN0aXZlcyA9IFtdXG4gICAgICAgIGZvciAobGV0IHN0cmVhbSBvZiB0aGlzLl9zdHJlYW1zKXtcbiAgICAgICAgICAgIGlmKHN0cmVhbS5hY3RpdmUpe1xuICAgICAgICAgICAgICAgIGFjdGl2ZXMucHVzaChzdHJlYW0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjdGl2ZXM7XG4gICAgfVxuICAgIGdldCBkaWFsb2coKXtcbiAgICAgICAgZm9yIChsZXQgc3RyZWFtIG9mIHRoaXMuX3N0cmVhbXMpe1xuICAgICAgICAgICAgaWYoc3RyZWFtLmRpYWxvZyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0cmVhbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBBdWRpb1N0cmVhbURlc2NyaXB0aW9uIHtcbiAgICBjb25zdHJ1Y3Rvcih0eXBlLCBhY3RpdmUgPSBmYWxzZSwgbG91ZG5lc3MgPSB1bmRlZmluZWQsIG1heFRydWVQZWFrID0gdW5kZWZpbmVkLCBkaWFsb2cgPSBmYWxzZSwgYW1iaWFuY2UgPSBmYWxzZSl7XG4gICAgICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLl9hY3RpdmUgPSBhY3RpdmU7XG4gICAgICAgIHRoaXMuX2xvdWRuZXNzID0gbG91ZG5lc3M7XG4gICAgICAgIHRoaXMuX21heFRydWVQZWFrID0gbWF4VHJ1ZVBlYWs7XG4gICAgICAgIHRoaXMuX2RpYWxvZyA9IGRpYWxvZztcbiAgICAgICAgdGhpcy5fYW1iaWFuY2UgPSBhbWJpYW5jZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHRvZG8gYmV0dGVyIG5hbWU/XG4gICAgICovXG4gICAgZ2V0IGNoYW5uZWxQb3NpdGlvbnMoKXtcbiAgICAgICAgc3dpdGNoKHRoaXMuX3R5cGUpe1xuICAgICAgICAgICAgY2FzZSBcIk1vbm9cIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gWzBdO1xuICAgICAgICAgICAgY2FzZSBcIlN0ZXJlb1wiOlxuICAgICAgICAgICAgICAgIHJldHVybiBbLTMwLCAzMF07XG4gICAgICAgICAgICBjYXNlIFwiTXVsdGlXaXRob3V0TEZFXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFstMzAsIDAsICszMCwgLTExMCwgKzExMF1cbiAgICAgICAgICAgIGNhc2UgXCJNdWx0aVdpdGhMRkVcIjpcbiAgICAgICAgICAgICAgICAvLyBAdG9kbyBzZXQgY29ycmVjdCBMRkUgcG9zaXRpb25cbiAgICAgICAgICAgICAgICByZXR1cm4gWy0zMCwgMCwgKzMwLCAtMTEwLCArMTEwLCAwXVxuICAgICAgICAgICAgY2FzZSBcIkVpZ2h0Q2hhbm5lbFwiOlxuICAgICAgICAgICAgICAgIC8vIEB0b2RvIHNldCBjb3JyZWN0IHBvc2l0aW9uc1xuICAgICAgICAgICAgICAgIHJldHVybiBbMSwgMiwgMywgNCwgNSwgNiwgNywgOF1cbiAgICAgICAgfVxuICAgIH1cbiAgICBzZXQgYWN0aXZlKHZhbHVlKXtcbiAgICAgICAgdGhpcy5fYWN0aXZlID0gdmFsdWU7XG4gICAgfVxuICAgIGdldCBhY3RpdmUoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2ZTtcbiAgICB9XG4gICAgc2V0IGxvdWRuZXNzKHZhbHVlKXtcbiAgICAgICAgdGhpcy5fbG91ZG5lc3MgPSB2YWx1ZTtcbiAgICB9XG4gICAgZ2V0IGxvdWRuZXNzKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb3VkbmVzc1xuICAgIH1cbiAgICBzZXQgbWF4VHJ1ZVBlYWsodmFsdWUpe1xuICAgICAgICB0aGlzLl9tYXhUcnVlUGVhayA9IHZhbHVlO1xuICAgIH1cbiAgICBnZXQgbWF4VHJ1ZVBlYWsoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21heFRydWVQZWFrXG4gICAgfVxuICAgIHNldCBkaWFsb2codmFsdWUpe1xuICAgICAgICB0aGlzLl9kaWFsb2cgPSB2YWx1ZTtcbiAgICB9XG4gICAgZ2V0IGRpYWxvZygpe1xuICAgICAgICByZXR1cm4gdGhpcy5fZGlhbG9nXG4gICAgfVxuICAgIHNldCBhbWJpYW5jZSh2YWx1ZSl7XG4gICAgICAgIHRoaXMuX2FtYmlhbmNlID0gdmFsdWU7XG4gICAgfVxuICAgIGdldCBhbWJpYW5jZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fYW1iaWFuY2VcbiAgICB9XG59XG5cblxuLyoqXG4gKiBIUlRGXG4gKiBAdG9kbzogdG8gYmUgZGVmaW5lZFxuICogQHR5cGVkZWYge09iamVjdH0gSFJURlxuICovXG5cbi8qKlxuICogRXFQcmVzZXRcbiAqIEB0b2RvOiB0byBiZSBkZWZpbmVkXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBFcVByZXNldFxuICovXG5cbiAvKipcbiAqIEBleHRlcm5hbCB7QXVkaW9Db250ZXh0fSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9mci9kb2NzL1dlYi9BUEkvQXVkaW9Db250ZXh0XG4gKi9cbiJdfQ==