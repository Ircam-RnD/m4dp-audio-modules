(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.M4DPAudioModules = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
         * Get the current active audio stream descriptions of the collection
         * @type {AudioStreamDescription[]}
         */

    }, {
        key: "actives",
        get: function get() {
            var actives = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._streams[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return actives;
        }
        /**
         * Get the current dialog audio stream description of the collection
         * @type {AudioStreamDescription}
         */

    }, {
        key: "dialog",
        get: function get() {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this._streams[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
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
}();

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
},{}],2:[function(require,module,exports){
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
},{"../core/index.js":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AudioStreamDescription = exports.AudioStreamDescriptionCollection = exports.SmartFader = exports.ObjectSpatialiserAndMixer = exports.NoiseAdaptation = exports.MultichannelSpatialiser = exports.DialogEnhancement = undefined;

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.DialogEnhancement = _index2.default;
exports.MultichannelSpatialiser = _index4.default;
exports.NoiseAdaptation = _index6.default;
exports.ObjectSpatialiserAndMixer = _index8.default;
exports.SmartFader = _index10.default;
exports.AudioStreamDescriptionCollection = _index11.AudioStreamDescriptionCollection;
exports.AudioStreamDescription = _index11.AudioStreamDescription;
},{"./core/index.js":1,"./dialog-enhancement/index.js":2,"./multichannel-spatialiser/index.js":4,"./noise-adaptation/index.js":5,"./object-spatialiser-and-mixer/index.js":6,"./smart-fader/index.js":7}],4:[function(require,module,exports){
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
},{"../core/index.js":1}],5:[function(require,module,exports){
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
},{"../core/index.js":1}],6:[function(require,module,exports){
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
},{"../multichannel-spatialiser/index.js":4}],7:[function(require,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
        _this._dynamicCompressorNode = audioContext.createDynamicsCompressor();
        _this.input.connect(_this._dynamicCompressorNode);
        _this._dynamicCompressorNode.connect(_this._output);

        _this.dB = dB;
        return _this;
    }

    /**
     * Set the dB value
     * @type {number}
     */

    _createClass(SmartFader, [{
        key: "_update",
        value: function _update() {

            /// retrieves the AudioStreamDescriptionCollection
            var asdc = this._audioStreamDescriptionCollection;

            /// retrieves the active AudioStreamDescription(s)
            var asd = asdc.actives;

            /// retrieves the MaxTruePeak (ITU­R BS.1770­3) of the active AudioStreamDescription
            var maxTruePeak = asd.maxTruePeak;

            /**
            Le reglage du volume doit se comporter de la facon suivante :
            - attenuation classique du volume sonore entre le niveau nominal (gain = 0) et en deca
            - augmentation classique du volume sonore entre le niveau nominal et le niveau max (niveau max = niveau nominal + I MaxTruePeak I)
            - limiteur/compresseur multicanal au dela du niveau max
             NB : la donnee de loudness integree n'est pas utilisee
            */

            // @todo éclaircir régles d'activation avec Matthieu
            // this._dynamicCompressorNode.threshold
            // this._dynamicCompressorNode.knee
            // this._dynamicCompressorNode.ratio
            // this._dynamicCompressorNode.attack
            // this._dynamicCompressorNode.release
        }
    }, {
        key: "dB",
        set: function set(value) {
            this._dB = SmartFader.clampdB(value);
            this._update();
        }

        /**
         * Clips a value within a given range
         * @type {number} value the value to be clipped
         * @type {number} min the lower bound
         * @type {number} max the upper bound
         *
         * @todo move this function into a common file
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
        key: "dynamicCompressionState",

        /**
         * Returns the dynamic compression state
         * @type {boolean}
         */
        get: function get() {
            if (this._dynamicCompressorNode.reduction > 0) {
                return true;
            } else {
                return false;
            }
        }
    }], [{
        key: "clamp",
        value: function clamp(value, min, max) {

            if (max < min) {
                throw new Error("pas bon");
            }

            return Math.max(min, Math.min(value, max));
        }

        /**
         * Clips a value within the proper dB range
         * @type {number} value the value to be clipped
         */

    }, {
        key: "clampdB",
        value: function clampdB(value) {
            var _SmartFader$dBRange = _slicedToArray(SmartFader.dBRange, 2);

            var minValue = _SmartFader$dBRange[0];
            var maxValue = _SmartFader$dBRange[1];

            return SmartFader.clamp(value, minValue, maxValue);
        }
    }, {
        key: "dBRange",
        get: function get() {
            return [0, 8];
        }

        /**
         * Returns the default value (in dB)
         * @type {number}
         */

    }, {
        key: "dBDefault",
        get: function get() {
            return 0;
        }
    }]);

    return SmartFader;
}(_index2.default);

exports.default = SmartFader;
},{"../core/index.js":1}]},{},[3])(3)
});