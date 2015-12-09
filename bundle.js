(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"babel-runtime/core-js/get-iterator":8,"babel-runtime/core-js/object/define-property":10,"babel-runtime/helpers/class-call-check":13,"babel-runtime/helpers/create-class":14}],2:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
    value: true
});

var _coreIndexJs = require('../core/index.js');

var _coreIndexJs2 = _interopRequireDefault(_coreIndexJs);

var DialogEnhancement = (function (_AbstractNode) {
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
     * @param {number} mode - mode
     * @param {number} dialogGain - dialog gain
     */

    function DialogEnhancement(audioContext, audioStreamDescriptionCollection, mode, dialogGain) {
        _classCallCheck(this, DialogEnhancement);

        _get(Object.getPrototypeOf(DialogEnhancement.prototype), 'constructor', this).call(this, audioContext, audioStreamDescriptionCollection);
        this._mode = mode;
    }

    _inherits(DialogEnhancement, _AbstractNode);

    _createClass(DialogEnhancement, [{
        key: 'mode',

        /**
         * Set Mode - value is 1, 2 or 3
         * @type {number}
         */
        set: function (value) {
            // @todo error in some mode: eg. mode 1 and no dialog => "impossible"
            // error mode 2 et pas de 5.0 ou 5.1
            // error mode 3 et pas de stéréo
            this._mode = value;
        },

        /**
         * Get Mode - value is 1, 2 or 3
         * @type {number}
         */
        get: function () {
            return this._mode;
        }
    }, {
        key: 'audioStreamDescriptionCollection',

        /**
         * Set audioStreamDescriptionCollection
         * @type {AudioStreamDescriptionCollection}
         */
        set: function (value) {
            this._audioStreamDescriptionCollection = value;
        },

        /**
         * Get audioStreamDescriptionCollection
         * @type {AudioStreamDescriptionCollection}
         */
        get: function () {
            return this._audioStreamDescriptionCollection;
        }
    }, {
        key: 'dialogGain',

        /**
         * Set dialogGain
         * @type {number}
         * @todo give range of accepted values
         */
        set: function (value) {
            this._dialogGain = value;
        },

        /**
         * Get dialogGain
         * @type {number}
         * @todo give range of accepted values
         */
        get: function () {
            return this._dialogGain;
        }
    }]);

    return DialogEnhancement;
})(_coreIndexJs2['default']);

exports['default'] = DialogEnhancement;
module.exports = exports['default'];

},{"../core/index.js":1,"babel-runtime/core-js/object/define-property":10,"babel-runtime/helpers/class-call-check":13,"babel-runtime/helpers/create-class":14,"babel-runtime/helpers/get":15,"babel-runtime/helpers/inherits":16,"babel-runtime/helpers/interop-require-default":17}],3:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _dialogEnhancementIndexJs = require('./dialog-enhancement/index.js');

var _dialogEnhancementIndexJs2 = _interopRequireDefault(_dialogEnhancementIndexJs);

var _multichannelSpatialiserIndexJs = require('./multichannel-spatialiser/index.js');

var _multichannelSpatialiserIndexJs2 = _interopRequireDefault(_multichannelSpatialiserIndexJs);

var _noiseAdaptationIndexJs = require('./noise-adaptation/index.js');

var _noiseAdaptationIndexJs2 = _interopRequireDefault(_noiseAdaptationIndexJs);

var _objectSpatialiserAndMixerIndexJs = require('./object-spatialiser-and-mixer/index.js');

var _objectSpatialiserAndMixerIndexJs2 = _interopRequireDefault(_objectSpatialiserAndMixerIndexJs);

var _smartFaderIndexJs = require('./smart-fader/index.js');

var _smartFaderIndexJs2 = _interopRequireDefault(_smartFaderIndexJs);

var _coreIndexJs = require('./core/index.js');

var M4DPAudioModules = {
    'DialogEnhancement': _dialogEnhancementIndexJs2['default'],
    'MultichannelSpatialiser': _multichannelSpatialiserIndexJs2['default'],
    'NoiseAdaptation': _noiseAdaptationIndexJs2['default'],
    'ObjectSpatialiserAndMixer': _objectSpatialiserAndMixerIndexJs2['default'],
    'SmartFader': _smartFaderIndexJs2['default'],
    'AudioStreamDescriptionCollection': _coreIndexJs.AudioStreamDescriptionCollection,
    'AudioStreamDescription': _coreIndexJs.AudioStreamDescription
};

// @fix, Extra ugly, should use export default M4DPAudioModules;
window.M4DPAudioModules = M4DPAudioModules;

},{"./core/index.js":1,"./dialog-enhancement/index.js":2,"./multichannel-spatialiser/index.js":4,"./noise-adaptation/index.js":5,"./object-spatialiser-and-mixer/index.js":6,"./smart-fader/index.js":7,"babel-runtime/helpers/interop-require-default":17}],4:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _coreIndexJs = require('../core/index.js');

var _coreIndexJs2 = _interopRequireDefault(_coreIndexJs);

var MultichannelSpatialiser = (function (_AbstractNode) {
  /**
   * @param {AudioContext} audioContext - audioContext instance.
   * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
   * @param {string} outputType - output type "headphone" or "speaker"
   * @param {HRTF} hrtf - hrtf @todo to be defined
   * @param {EqPreset} eqPreset - dialog gain @todo to be defined
   * @param {number} offsetGain - gain @todo value to be defined
   * @param {number} listeningAxis - angle? @todo value to be defined
   */

  function MultichannelSpatialiser(audioContext, _x, _x2, hrtf, eqPreset, offsetGain, listeningAxis) {
    var audioStreamDescriptionCollection = arguments[1] === undefined ? undefined : arguments[1];
    var outputType = arguments[2] === undefined ? 'headphone' : arguments[2];

    _classCallCheck(this, MultichannelSpatialiser);

    _get(Object.getPrototypeOf(MultichannelSpatialiser.prototype), 'constructor', this).call(this, audioContext, audioStreamDescriptionCollection);
    this._outputType = outputType;
    this._hrtf = hrtf;
    this._eqPreset = eqPreset;
    this._offsetGain = offsetGain;
    this._listeningAxis = listeningAxis;
  }

  _inherits(MultichannelSpatialiser, _AbstractNode);

  _createClass(MultichannelSpatialiser, [{
    key: 'outputType',

    /**
     * Set outputType: 'headphone' or 'speaker', 'multicanal'
     * @todo: automatic for 'multicanal' even if nb of speaker 'wrong'
     * @type {string}
     */
    set: function (value) {
      this._outputType = value;
    },

    /**
     * Get outputType: 'headphone' or 'speaker'
     * @type {string}
     */
    get: function () {
      return this._outputType;
    }
  }, {
    key: 'audioStreamDescriptionCollection',

    /**
     * Set audio streams description (json)
     * @type {AudioStreamDescriptionCollection}
     */
    set: function (value) {},

    /**
     * Get audio streams description
     * @type {AudioStreamDescriptionCollection}
     */
    get: function () {
      return _audioStreamDescriptionCollection;
    }
  }, {
    key: 'hrtf',

    /**
     * Set hrtf
     * @type {HRTF}
     * @todo: which kind of value, json?
     */
    set: function (value) {
      this._hrtf = value;
    },

    /**
     * Get hrtf
     * @type {HRTF}
     */
    get: function () {
      return this._hrtf;
    }
  }, {
    key: 'eqPreset',

    /**
     * Set eqPreset
     * @todo: which kind of value, json?
     * @todo: set it to none to not appy any eq?
     * @type {EqPreset}
     */
    set: function (value) {
      this._eqPreset = value;
    },

    /**
     * Get eqPreset
     * @type {EqPreset}
     */
    get: function () {
      return this._eqPreset;
    }
  }, {
    key: 'offsetGain',

    /**
     * Set offsetGain
     * @todo range
     * @type {number}
     */
    set: function (value) {
      this._offsetGain = value;
    },

    /**
     * Get offsetGain
     * @todo range
     * @type {number}
     */
    get: function () {
      return this._offsetGain;
    }
  }, {
    key: 'listeningAxis',

    /**
     * Set listeningAxis
     * @todo value type? angle?
     * @type {number}
     */
    set: function (value) {
      this._listeningAxis = value;
    },

    /**
     * Get listeningAxis
     * @type {number}
     */
    get: function () {
      return this._listeningAxis;
    }
  }]);

  return MultichannelSpatialiser;
})(_coreIndexJs2['default']);

exports['default'] = MultichannelSpatialiser;
module.exports = exports['default'];

},{"../core/index.js":1,"babel-runtime/core-js/object/define-property":10,"babel-runtime/helpers/class-call-check":13,"babel-runtime/helpers/create-class":14,"babel-runtime/helpers/get":15,"babel-runtime/helpers/inherits":16,"babel-runtime/helpers/interop-require-default":17}],5:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _coreIndexJs = require('../core/index.js');

var _coreIndexJs2 = _interopRequireDefault(_coreIndexJs);

var NoiseAdaptation = (function (_AbstractNode) {
  /**
   * @param {AudioContext} audioContext - audioContext instance.
   * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
   * @param {boolean} headphone - true is headphone, else, false.
   */

  function NoiseAdaptation(audioContext, audioStreamDescriptionCollection) {
    var headphone = arguments[2] === undefined ? false : arguments[2];

    _classCallCheck(this, NoiseAdaptation);

    _get(Object.getPrototypeOf(NoiseAdaptation.prototype), 'constructor', this).call(this, audioContext, audioStreamDescriptionCollection);
    this._headphone = headphone;
  }

  _inherits(NoiseAdaptation, _AbstractNode);

  _createClass(NoiseAdaptation, [{
    key: '_process',

    /**
     * Process:
     * @todo: track noise, add compression, improve voice if no headphone
     */
    value: function _process() {}
  }, {
    key: 'headphone',

    /**
     * Set headphone - true is headphone, else, false.
     * @type {boolean}
     */
    set: function (value) {
      this._headphone = value;
    },

    /**
     * Get headphone, return True if headphone is connected, else, false
     * @type {boolean}
     */
    get: function () {
      return this._headphone;
    }
  }]);

  return NoiseAdaptation;
})(_coreIndexJs2['default']);

exports['default'] = NoiseAdaptation;
module.exports = exports['default'];

},{"../core/index.js":1,"babel-runtime/core-js/object/define-property":10,"babel-runtime/helpers/class-call-check":13,"babel-runtime/helpers/create-class":14,"babel-runtime/helpers/get":15,"babel-runtime/helpers/inherits":16,"babel-runtime/helpers/interop-require-default":17}],6:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _multichannelSpatialiserIndexJs = require('../multichannel-spatialiser/index.js');

var _multichannelSpatialiserIndexJs2 = _interopRequireDefault(_multichannelSpatialiserIndexJs);

var ObjectSpatialiserAndMixer = (function (_MultichannelSpatialiser) {
  /**
   * @param {AudioContext} audioContext - audioContext instance.
   * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
   * @param {string} outputType - output type "headphone" or "speaker"
   * @param {HRTF} hrtf - hrtf @todo to be defined
   * @param {EqPreset} eqPreset - dialog gain @todo to be defined
   * @param {number} offsetGain - gain @todo value to be defined
   * @param {number} listeningAxis - angle? @todo value to be defined
   */

  function ObjectSpatialiserAndMixer(audioContext, _x, _x2, hrtf, eqPreset, offsetGain, listeningAxis) {
    var audioStreamDescriptionCollection = arguments[1] === undefined ? undefined : arguments[1];
    var outputType = arguments[2] === undefined ? 'headphone' : arguments[2];

    _classCallCheck(this, ObjectSpatialiserAndMixer);

    _get(Object.getPrototypeOf(ObjectSpatialiserAndMixer.prototype), 'constructor', this).call(this, audioContext, audioStreamDescriptionCollection, outputType, hrtf, eqPreset, offsetGain, listeningAxis);
  }

  _inherits(ObjectSpatialiserAndMixer, _MultichannelSpatialiser);

  _createClass(ObjectSpatialiserAndMixer, [{
    key: 'setPosition',

    /**
     * Set the position of the sound
     * @todo only for a unique mono stream
     * @param {number} azimuth - azimuth @todo values to be defined
     * @param {number} elevation - elevation @todo values to be defined
     * @param {number} distance - distance @todo values to be defined
     */
    value: function setPosition(azimuth, elevation, distance) {
      this._azimuth = azimuth;
      this._elevation = elevation;
      this._distance = distance;
    }
  }, {
    key: 'getPosition',

    /**
     * Get the position of the sound
     * @todo return an array? better I think for setPosition/getPosition homogeneity
     * @return {array}
     */
    value: function getPosition() {
      //return {'azimuth': this._azimuth, 'elevation': this._elevation, 'distance': this._distance};
      return [this._azimuth, this._elevation, this._distance];
    }
  }, {
    key: '_process',

    /**
     * Process: "position" + "gain"
     * @todo: how to automatically set the gain, how to have RMS from "the other signal" here
     */
    value: function _process() {}
  }]);

  return ObjectSpatialiserAndMixer;
})(_multichannelSpatialiserIndexJs2['default']);

exports['default'] = ObjectSpatialiserAndMixer;
module.exports = exports['default'];

},{"../multichannel-spatialiser/index.js":4,"babel-runtime/core-js/object/define-property":10,"babel-runtime/helpers/class-call-check":13,"babel-runtime/helpers/create-class":14,"babel-runtime/helpers/get":15,"babel-runtime/helpers/inherits":16,"babel-runtime/helpers/interop-require-default":17}],7:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
    value: true
});

var _coreIndexJs = require('../core/index.js');

var _coreIndexJs2 = _interopRequireDefault(_coreIndexJs);

var SmartFader = (function (_AbstractNode) {
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection
     * @param {number} dB - dB value for the SmartFader.
     * @todo give range of accepted values
     */

    function SmartFader(audioContext) {
        var audioStreamDescriptionCollection = arguments[1] === undefined ? undefined : arguments[1];
        var dB = arguments[2] === undefined ? undefined : arguments[2];

        _classCallCheck(this, SmartFader);

        _get(Object.getPrototypeOf(SmartFader.prototype), 'constructor', this).call(this, audioContext, audioStreamDescriptionCollection);
        this._dB = dB;

        // AudioGraph connect
        // @todo: DynamicsCompressorNode accept n channels input
        this._dynamicCompressorNode = audioContext.createDynamicsCompressor();
        this.input.connect(this._dynamicCompressorNode);
        this._dynamicCompressorNode.connect(this._output);
    }

    _inherits(SmartFader, _AbstractNode);

    _createClass(SmartFader, [{
        key: 'dB',

        /**
         * Set the dB value
         * @todo give range of accepted values
         * @type {number}
         */
        set: function (value) {
            // @todo clip value
            this._dB = value;
            this._update();
        },

        /**
         * Get the dB value
         * @type {number}
         */
        get: function () {
            return this._dB;
        }
    }, {
        key: 'dynamicCompressionState',

        /**
         * Get the dynamic compression state
         * @type {boolean}
         */
        get: function () {
            if (this._dynamicCompressorNode.reduction > 0) {
                return true;
            } else {
                return false;
            }
        }
    }, {
        key: '_update',
        value: function _update() {}
    }], [{
        key: 'dBRange',

        // @todo Mathieu -80dB => +20dB
        /**
         * Get the dB range
         * @type {array}
         */
        get: function () {
            return [-80, 20];
        }
    }, {
        key: 'dBDefault',
        get: function () {
            return 0;
        }
    }]);

    return SmartFader;
})(_coreIndexJs2['default']);

exports['default'] = SmartFader;
module.exports = exports['default'];

// @todo éclaircir régles d'activation avec Matthieu
// this._dynamicCompressorNode.threshold
// this._dynamicCompressorNode.knee
// this._dynamicCompressorNode.ratio
// this._dynamicCompressorNode.attack
// this._dynamicCompressorNode.release

},{"../core/index.js":1,"babel-runtime/core-js/object/define-property":10,"babel-runtime/helpers/class-call-check":13,"babel-runtime/helpers/create-class":14,"babel-runtime/helpers/get":15,"babel-runtime/helpers/inherits":16,"babel-runtime/helpers/interop-require-default":17}],8:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":18}],9:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":19}],10:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":20}],11:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-own-property-descriptor"), __esModule: true };
},{"core-js/library/fn/object/get-own-property-descriptor":21}],12:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":22}],13:[function(require,module,exports){
"use strict";

exports["default"] = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

exports.__esModule = true;
},{}],14:[function(require,module,exports){
"use strict";

var _Object$defineProperty = require("babel-runtime/core-js/object/define-property")["default"];

exports["default"] = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;

      _Object$defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

exports.__esModule = true;
},{"babel-runtime/core-js/object/define-property":10}],15:[function(require,module,exports){
"use strict";

var _Object$getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor")["default"];

exports["default"] = function get(_x, _x2, _x3) {
  var _again = true;

  _function: while (_again) {
    var object = _x,
        property = _x2,
        receiver = _x3;
    desc = parent = getter = undefined;
    _again = false;
    if (object === null) object = Function.prototype;

    var desc = _Object$getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        _x = parent;
        _x2 = property;
        _x3 = receiver;
        _again = true;
        continue _function;
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  }
};

exports.__esModule = true;
},{"babel-runtime/core-js/object/get-own-property-descriptor":11}],16:[function(require,module,exports){
"use strict";

var _Object$create = require("babel-runtime/core-js/object/create")["default"];

var _Object$setPrototypeOf = require("babel-runtime/core-js/object/set-prototype-of")["default"];

exports["default"] = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = _Object$create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _Object$setPrototypeOf ? _Object$setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

exports.__esModule = true;
},{"babel-runtime/core-js/object/create":9,"babel-runtime/core-js/object/set-prototype-of":12}],17:[function(require,module,exports){
"use strict";

exports["default"] = function (obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
};

exports.__esModule = true;
},{}],18:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.get-iterator');
},{"../modules/core.get-iterator":57,"../modules/es6.string.iterator":61,"../modules/web.dom.iterable":62}],19:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function create(P, D){
  return $.create(P, D);
};
},{"../../modules/$":41}],20:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function defineProperty(it, key, desc){
  return $.setDesc(it, key, desc);
};
},{"../../modules/$":41}],21:[function(require,module,exports){
var $ = require('../../modules/$');
require('../../modules/es6.object.get-own-property-descriptor');
module.exports = function getOwnPropertyDescriptor(it, key){
  return $.getDesc(it, key);
};
},{"../../modules/$":41,"../../modules/es6.object.get-own-property-descriptor":59}],22:[function(require,module,exports){
require('../../modules/es6.object.set-prototype-of');
module.exports = require('../../modules/$.core').Object.setPrototypeOf;
},{"../../modules/$.core":27,"../../modules/es6.object.set-prototype-of":60}],23:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],24:[function(require,module,exports){
var isObject = require('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":36}],25:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./$.cof')
  , TAG = require('./$.wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./$.cof":26,"./$.wks":55}],26:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],27:[function(require,module,exports){
var core = module.exports = {version: '1.2.3'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],28:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./$.a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./$.a-function":23}],29:[function(require,module,exports){
var global    = require('./$.global')
  , core      = require('./$.core')
  , PROTOTYPE = 'prototype';
var ctx = function(fn, that){
  return function(){
    return fn.apply(that, arguments);
  };
};
var $def = function(type, name, source){
  var key, own, out, exp
    , isGlobal = type & $def.G
    , isProto  = type & $def.P
    , target   = isGlobal ? global : type & $def.S
        ? global[name] : (global[name] || {})[PROTOTYPE]
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // contains in native
    own = !(type & $def.F) && target && key in target;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    if(isGlobal && typeof target[key] != 'function')exp = source[key];
    // bind timers to global for call from export context
    else if(type & $def.B && own)exp = ctx(out, global);
    // wrap global constructors for prevent change them in library
    else if(type & $def.W && target[key] == out)!function(C){
      exp = function(param){
        return this instanceof C ? new C(param) : C(param);
      };
      exp[PROTOTYPE] = C[PROTOTYPE];
    }(out);
    else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export
    exports[key] = exp;
    if(isProto)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
// type bitmap
$def.F = 1;  // forced
$def.G = 2;  // global
$def.S = 4;  // static
$def.P = 8;  // proto
$def.B = 16; // bind
$def.W = 32; // wrap
module.exports = $def;
},{"./$.core":27,"./$.global":32}],30:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],31:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],32:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],33:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],34:[function(require,module,exports){
var $          = require('./$')
  , createDesc = require('./$.property-desc');
module.exports = require('./$.support-desc') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":41,"./$.property-desc":44,"./$.support-desc":49}],35:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./$.cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":26}],36:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],37:[function(require,module,exports){
'use strict';
var $ = require('./$')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./$.hide')(IteratorPrototype, require('./$.wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: require('./$.property-desc')(1,next)});
  require('./$.tag')(Constructor, NAME + ' Iterator');
};
},{"./$":41,"./$.hide":34,"./$.property-desc":44,"./$.tag":50,"./$.wks":55}],38:[function(require,module,exports){
'use strict';
var LIBRARY         = require('./$.library')
  , $def            = require('./$.def')
  , $redef          = require('./$.redef')
  , hide            = require('./$.hide')
  , has             = require('./$.has')
  , SYMBOL_ITERATOR = require('./$.wks')('iterator')
  , Iterators       = require('./$.iterators')
  , BUGGY           = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR     = '@@iterator'
  , KEYS            = 'keys'
  , VALUES          = 'values';
var returnThis = function(){ return this; };
module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
  require('./$.iter-create')(Constructor, NAME, next);
  var createMethod = function(kind){
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG      = NAME + ' Iterator'
    , proto    = Base.prototype
    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , _default = _native || createMethod(DEFAULT)
    , methods, key;
  // Fix native
  if(_native){
    var IteratorPrototype = require('./$').getProto(_default.call(new Base));
    // Set @@toStringTag to native iterators
    require('./$.tag')(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, SYMBOL_ITERATOR, returnThis);
  }
  // Define iterator
  if(!LIBRARY || FORCE)hide(proto, SYMBOL_ITERATOR, _default);
  // Plug for library
  Iterators[NAME] = _default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEFAULT == VALUES ? _default : createMethod(VALUES),
      keys:    IS_SET            ? _default : createMethod(KEYS),
      entries: DEFAULT != VALUES ? _default : createMethod('entries')
    };
    if(FORCE)for(key in methods){
      if(!(key in proto))$redef(proto, key, methods[key]);
    } else $def($def.P + $def.F * BUGGY, NAME, methods);
  }
};
},{"./$":41,"./$.def":29,"./$.has":33,"./$.hide":34,"./$.iter-create":37,"./$.iterators":40,"./$.library":42,"./$.redef":45,"./$.tag":50,"./$.wks":55}],39:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],40:[function(require,module,exports){
module.exports = {};
},{}],41:[function(require,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],42:[function(require,module,exports){
module.exports = true;
},{}],43:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
module.exports = function(KEY, exec){
  var $def = require('./$.def')
    , fn   = (require('./$.core').Object || {})[KEY] || Object[KEY]
    , exp  = {};
  exp[KEY] = exec(fn);
  $def($def.S + $def.F * require('./$.fails')(function(){ fn(1); }), 'Object', exp);
};
},{"./$.core":27,"./$.def":29,"./$.fails":31}],44:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],45:[function(require,module,exports){
module.exports = require('./$.hide');
},{"./$.hide":34}],46:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = require('./$').getDesc
  , isObject = require('./$.is-object')
  , anObject = require('./$.an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./$.ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./$":41,"./$.an-object":24,"./$.ctx":28,"./$.is-object":36}],47:[function(require,module,exports){
var global = require('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":32}],48:[function(require,module,exports){
// true  -> String#at
// false -> String#codePointAt
var toInteger = require('./$.to-integer')
  , defined   = require('./$.defined');
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l
      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
        ? TO_STRING ? s.charAt(i) : a
        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./$.defined":30,"./$.to-integer":51}],49:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":31}],50:[function(require,module,exports){
var def = require('./$').setDesc
  , has = require('./$.has')
  , TAG = require('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./$":41,"./$.has":33,"./$.wks":55}],51:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],52:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./$.iobject')
  , defined = require('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":30,"./$.iobject":35}],53:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],54:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],55:[function(require,module,exports){
var store  = require('./$.shared')('wks')
  , Symbol = require('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || require('./$.uid'))('Symbol.' + name));
};
},{"./$.global":32,"./$.shared":47,"./$.uid":53}],56:[function(require,module,exports){
var classof   = require('./$.classof')
  , ITERATOR  = require('./$.wks')('iterator')
  , Iterators = require('./$.iterators');
module.exports = require('./$.core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./$.classof":25,"./$.core":27,"./$.iterators":40,"./$.wks":55}],57:[function(require,module,exports){
var anObject = require('./$.an-object')
  , get      = require('./core.get-iterator-method');
module.exports = require('./$.core').getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};
},{"./$.an-object":24,"./$.core":27,"./core.get-iterator-method":56}],58:[function(require,module,exports){
'use strict';
var setUnscope = require('./$.unscope')
  , step       = require('./$.iter-step')
  , Iterators  = require('./$.iterators')
  , toIObject  = require('./$.to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
require('./$.iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

setUnscope('keys');
setUnscope('values');
setUnscope('entries');
},{"./$.iter-define":38,"./$.iter-step":39,"./$.iterators":40,"./$.to-iobject":52,"./$.unscope":54}],59:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./$.to-iobject');

require('./$.object-sap')('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./$.object-sap":43,"./$.to-iobject":52}],60:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $def = require('./$.def');
$def($def.S, 'Object', {setPrototypeOf: require('./$.set-proto').set});
},{"./$.def":29,"./$.set-proto":46}],61:[function(require,module,exports){
'use strict';
var $at  = require('./$.string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./$.iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./$.iter-define":38,"./$.string-at":48}],62:[function(require,module,exports){
require('./es6.array.iterator');
var Iterators = require('./$.iterators');
Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
},{"./$.iterators":40,"./es6.array.iterator":58}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2NvcmUvbGliL3NtYXJ0LWZhZGVyL2luZGV4LmpzIiwiZGlzdC9kaWFsb2ctZW5oYW5jZW1lbnQvbGliL3NtYXJ0LWZhZGVyL2luZGV4LmpzIiwiZGlzdC9saWIvc21hcnQtZmFkZXIvaW5kZXguanMiLCJkaXN0L211bHRpY2hhbm5lbC1zcGF0aWFsaXNlci9saWIvc21hcnQtZmFkZXIvaW5kZXguanMiLCJkaXN0L25vaXNlLWFkYXB0YXRpb24vbGliL3NtYXJ0LWZhZGVyL2luZGV4LmpzIiwiZGlzdC9vYmplY3Qtc3BhdGlhbGlzZXItYW5kLW1peGVyL2xpYi9zbWFydC1mYWRlci9pbmRleC5qcyIsImRpc3Qvc21hcnQtZmFkZXIvbGliL3NtYXJ0LWZhZGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9nZXQtaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzcy1jYWxsLWNoZWNrLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGUtY2xhc3MuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2dldC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2ludGVyb3AtcmVxdWlyZS1kZWZhdWx0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9nZXQtaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuYS1mdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmFuLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmNsYXNzb2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jb2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jb3JlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY3R4LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZGVmLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZGVmaW5lZC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmZhaWxzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaGFzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaGlkZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmlvYmplY3QuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLml0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlci1zdGVwLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlcmF0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQub2JqZWN0LXNhcC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnByb3BlcnR5LWRlc2MuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5yZWRlZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnNldC1wcm90by5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnNoYXJlZC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnN0cmluZy1hdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnN1cHBvcnQtZGVzYy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnRhZy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnRvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC50by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudWlkLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudW5zY29wZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLndrcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LmFycmF5Lml0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUNHcUIsWUFBWTs7Ozs7OztBQU1sQixhQU5NLFlBQVksQ0FNakIsWUFBWSxFQUErQztZQUE3QyxnQ0FBZ0MsZ0NBQUcsU0FBUzs7OEJBTnJELFlBQVk7O0FBT3pCLFlBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO0FBQ2xDLFlBQUksQ0FBQyxpQ0FBaUMsR0FBRyxnQ0FBZ0MsQ0FBQzs7OztBQUkxRSxZQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDN0MsWUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQ2xEOztpQkFkZ0IsWUFBWTs7Ozs7OztlQW1CdEIsaUJBQUMsSUFBSSxFQUFDO0FBQ1QsZ0JBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQzdCOzs7Ozs7OztlQUtTLG9CQUFDLElBQUksRUFBQztBQUNaLGdCQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUNoQzs7O1dBNUJnQixZQUFZOzs7cUJBQVosWUFBWTs7Ozs7O0lBbUNwQixnQ0FBZ0M7Ozs7OztBQUs5QixhQUxGLGdDQUFnQyxDQUs3QixPQUFPLEVBQUM7OEJBTFgsZ0NBQWdDOztBQU1yQyxZQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztLQUMzQjs7aUJBUFEsZ0NBQWdDOzs7Ozs7O2FBWTlCLFVBQUMsT0FBTyxFQUFDO0FBQ2hCLGdCQUFJLENBQUMs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QUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7O0FDRkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogVGVtcGxhdGUgZm9yIG90aGVyIGF1ZGlvIG5vZGVzOiBzZXQgdGhlIGF1ZGlvQ29udGV4dCByZWZlcmVuY2UgYW5kIHByb3ZpZGUgY29ubmVjdC9kaXNjb25uZWN0IG1ldGhvZHMgZm9yIHRoZSBhdWRpbyBub2RlLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBYnN0cmFjdE5vZGUge1xuICAgIC8qKlxuICAgICAqIEFic3RyYWN0Tm9kZSBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7QXVkaW9Db250ZXh0fSBhdWRpb0NvbnRleHQgLSBhdWRpb0NvbnRleHQgaW5zdGFuY2UuXG4gICAgICogQHBhcmFtIHtBdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbn0gYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24gLSBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbiBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihhdWRpb0NvbnRleHQsIGF1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9uID0gdW5kZWZpbmVkKXtcbiAgICAgICAgdGhpcy5fYXVkaW9Db250ZXh0ID0gYXVkaW9Db250ZXh0O1xuICAgICAgICB0aGlzLl9hdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbiA9IGF1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9uO1xuICAgICAgICAvKipcbiAgICAgICAgICogQHR5cGUge0F1ZGlvTm9kZX1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuaW5wdXQgPSB0aGlzLl9hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgICAgICB0aGlzLl9vdXRwdXQgPSB0aGlzLl9hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb25uZWN0IHRoZSBhdWRpbyBub2RlXG4gICAgICogQHBhcmFtIHtBdWRpb05vZGV9IG5vZGUgLSBhbiBBdWRpb05vZGUgdG8gY29ubmVjdCB0by5cbiAgICAgKi9cbiAgICBjb25uZWN0KG5vZGUpe1xuICAgICAgICB0aGlzLl9vdXRwdXQuY29ubmVjdChub2RlKVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBEaXNjb25uZWN0IHRoZSBhdWRpbyBub2RlXG4gICAgICogQHBhcmFtIHtBdWRpb05vZGV9IG5vZGUgLSBhbiBBdWRpb05vZGUgdG8gZGlzY29ubmVjdCB0by5cbiAgICAgKi9cbiAgICBkaXNjb25uZWN0KG5vZGUpe1xuICAgICAgICB0aGlzLl9vdXRwdXQuZGlzY29ubmVjdChub2RlKVxuICAgIH1cbn1cblxuXG4vKipcbiAqIENvbnRhaW5lciBmb3IgQXVkaW9TdHJlYW1EZXNjcmlwdGlvblxuICovXG5leHBvcnQgY2xhc3MgQXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24ge1xuICAgIC8qKlxuICAgICAqIEF1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9uIGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtBdWRpb1N0cmVhbURlc2NyaXB0aW9uW119IHN0cmVhbXMgLSBhcnJheSBvZiBBdWRpb1N0cmVhbURlc2NyaXB0aW9uXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc3RyZWFtcyl7XG4gICAgICAgIHRoaXMuX3N0cmVhbXMgPSBzdHJlYW1zO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIHN0cmVhbSBkZXNjcmlwdGlvbiBjb2xsZWN0aW9uXG4gICAgICogQHR5cGUge0F1ZGlvU3RyZWFtRGVzY3JpcHRpb25bXX1cbiAgICAgKi9cbiAgICBzZXQgc3RyZWFtcyhzdHJlYW1zKXtcbiAgICAgICAgdGhpcy5fc3RyZWFtcyA9IHN0cmVhbXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgc3RyZWFtIGRlc2NyaXB0aW9uIGNvbGxlY3Rpb25cbiAgICAgKiBAdHlwZSB7QXVkaW9TdHJlYW1EZXNjcmlwdGlvbltdfVxuICAgICAqL1xuICAgIGdldCBzdHJlYW1zKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdHJlYW1zO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGN1cnJlbnQgYWN0aXZlIGF1ZGlvIHN0cmVhbSBkZXNjcmlwdGlvbnMgb2YgdGhlIGNvbGxlY3Rpb25cbiAgICAgKiBAdHlwZSB7QXVkaW9TdHJlYW1EZXNjcmlwdGlvbltdfVxuICAgICAqL1xuICAgIGdldCBhY3RpdmVzKCl7XG4gICAgICAgIGxldCBhY3RpdmVzID0gW11cbiAgICAgICAgZm9yIChsZXQgc3RyZWFtIG9mIHRoaXMuX3N0cmVhbXMpe1xuICAgICAgICAgICAgaWYoc3RyZWFtLmFjdGl2ZSl7XG4gICAgICAgICAgICAgICAgYWN0aXZlcy5wdXNoKHN0cmVhbSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWN0aXZlcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBjdXJyZW50IGRpYWxvZyBhdWRpbyBzdHJlYW0gZGVzY3JpcHRpb24gb2YgdGhlIGNvbGxlY3Rpb25cbiAgICAgKiBAdHlwZSB7QXVkaW9TdHJlYW1EZXNjcmlwdGlvbn1cbiAgICAgKi9cbiAgICBnZXQgZGlhbG9nKCl7XG4gICAgICAgIGZvciAobGV0IHN0cmVhbSBvZiB0aGlzLl9zdHJlYW1zKXtcbiAgICAgICAgICAgIGlmKHN0cmVhbS5kaWFsb2cpe1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHJlYW07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cbn1cblxuXG4vKipcbiAqIEF1ZGlvU3RyZWFtRGVzY3JpcHRpb24gZGVzY3JpYmVzIGEgc3RyZWFtLlxuICovXG5leHBvcnQgY2xhc3MgQXVkaW9TdHJlYW1EZXNjcmlwdGlvbiB7XG4gICAgLyoqXG4gICAgICogQXVkaW9TdHJlYW1EZXNjcmlwdGlvbiBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0gdHlwZS5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGFjdGl2ZSAtIGFjdGl2ZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG91ZG5lc3MgLSBsb3VkbmVzcy5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4VHJ1ZVBlYWsgLSBtYXhUcnVlUGVhay5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGRpYWxvZyAtIGRpYWxvZy5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGFtYmlhbmNlIC0gYW1iaWFuY2UuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IodHlwZSwgYWN0aXZlID0gZmFsc2UsIGxvdWRuZXNzID0gdW5kZWZpbmVkLCBtYXhUcnVlUGVhayA9IHVuZGVmaW5lZCwgZGlhbG9nID0gZmFsc2UsIGFtYmlhbmNlID0gZmFsc2UsIGNvbW1lbnRhcnkgPSBmYWxzZSl7XG4gICAgICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLl9hY3RpdmUgPSBhY3RpdmU7XG4gICAgICAgIHRoaXMuX2xvdWRuZXNzID0gbG91ZG5lc3M7XG4gICAgICAgIHRoaXMuX21heFRydWVQZWFrID0gbWF4VHJ1ZVBlYWs7XG4gICAgICAgIHRoaXMuX2RpYWxvZyA9IGRpYWxvZztcbiAgICAgICAgdGhpcy5fYW1iaWFuY2UgPSBhbWJpYW5jZTtcbiAgICAgICAgdGhpcy5fY29tbWVudGFyeSA9IGNvbW1lbnRhcnk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCBjaGFubmVsIHBvc2l0aW9uIGJhc2VkIG9uIGF1ZGlvIHN0cmVhbSB0eXBlXG4gICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAqL1xuICAgIGdldCBjaGFubmVsUG9zaXRpb25zKCl7XG4gICAgICAgIHN3aXRjaCh0aGlzLl90eXBlKXtcbiAgICAgICAgICAgIGNhc2UgXCJNb25vXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFswXTtcbiAgICAgICAgICAgIGNhc2UgXCJTdGVyZW9cIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gWy0zMCwgKzMwXTtcbiAgICAgICAgICAgIGNhc2UgXCJNdWx0aVdpdGhvdXRMRkVcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gWy0zMCwgKzMwLCAwLCAtMTEwLCArMTEwXVxuICAgICAgICAgICAgY2FzZSBcIk11bHRpV2l0aExGRVwiOlxuICAgICAgICAgICAgICAgIC8vIEBuIExGRSBwb3NpdGlvbiBpcyBpcnJlbGV2YW50IFxuICAgICAgICAgICAgICAgIC8vIGJ1dCBwcm92aWRlZCBzbyB0aGF0IHRoZSBhcnJheSBoYXMgYSBsZW5ndGggb2YgNlxuICAgICAgICAgICAgICAgIHJldHVybiBbLTMwLCArMzAsIDAsIC0xMTAsICsxMTAsIDBdXG4gICAgICAgICAgICBjYXNlIFwiRWlnaHRDaGFubmVsXCI6XG4gICAgICAgICAgICAgICAgLy8gQHRvZG8gc2V0IGNvcnJlY3QgcG9zaXRpb25zXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4XVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCBhY3RpdmUsIGlmIHN0cmVhbSBpcyBjdXJyZW50bHkgcGxheWluZyBvciBub3RcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBzZXQgYWN0aXZlKHZhbHVlKXtcbiAgICAgICAgdGhpcy5fYWN0aXZlID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCBhY3RpdmUsIGlmIHN0cmVhbSBpcyBjdXJyZW50bHkgcGxheWluZyBvciBub3RcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBnZXQgYWN0aXZlKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9hY3RpdmU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgbG91ZG5lc3MgdmFsdWUgb2YgYXVkaW8gc3RyZWFtXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBzZXQgbG91ZG5lc3ModmFsdWUpe1xuICAgICAgICB0aGlzLl9sb3VkbmVzcyA9IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGxvdWRuZXNzIG9mIGF1ZGlvIHN0cmVhbVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0IGxvdWRuZXNzKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb3VkbmVzc1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIG1heFRydWVQZWFrIG9mIGF1ZGlvIHN0cmVhbVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgc2V0IG1heFRydWVQZWFrKHZhbHVlKXtcbiAgICAgICAgdGhpcy5fbWF4VHJ1ZVBlYWsgPSB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBtYXhUcnVlUGVhayBvZiBhdWRpbyBzdHJlYW1cbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldCBtYXhUcnVlUGVhaygpe1xuICAgICAgICByZXR1cm4gdGhpcy5fbWF4VHJ1ZVBlYWtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IGRpYWxvZywgaWYgc3RyZWFtIGlzIGN1cnJlbnRseSBhIGRpYWxvZyBvciBub3RcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBzZXQgZGlhbG9nKHZhbHVlKXtcbiAgICAgICAgdGhpcy5fZGlhbG9nID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCBkaWFsb2csIGlmIHN0cmVhbSBpcyBjdXJyZW50bHkgYSBkaWFsb2cgb3Igbm90XG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgZ2V0IGRpYWxvZygpe1xuICAgICAgICByZXR1cm4gdGhpcy5fZGlhbG9nXG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCBhbWJpYW5jZSwgaWYgc3RyZWFtIGlzIGN1cnJlbnRseSBhbiBhbWJpYW5jZSBvciBub3RcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBzZXQgYW1iaWFuY2UodmFsdWUpe1xuICAgICAgICB0aGlzLl9hbWJpYW5jZSA9IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgYW1iaWFuY2UsIGlmIHN0cmVhbSBpcyBjdXJyZW50bHkgYW4gYW1iaWFuY2Ugb3Igbm90XG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgZ2V0IGFtYmlhbmNlKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9hbWJpYW5jZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IGNvbW1lbnRhcnksIGlmIHN0cmVhbSBpcyBjdXJyZW50bHkgYSBjb21tZW50YXJ5IChhdWRpbyBkZXNjcmlwdGlvbikgb3Igbm90XG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgc2V0IGNvbW1lbnRhcnkodmFsdWUpe1xuICAgICAgICB0aGlzLl9jb21tZW50YXJ5ID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCBjb21tZW50YXJ5LCBpZiBzdHJlYW0gaXMgY3VycmVudGx5IGEgY29tbWVudGFyeSAoYXVkaW8gZGVzY3JpcHRpb24pIG9yIG5vdFxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIGdldCBjb21tZW50YXJ5KCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb21tZW50YXJ5O1xuICAgIH1cbn1cblxuXG4vKipcbiAqIEhSVEZcbiAqIEB0b2RvOiB0byBiZSBkZWZpbmVkXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBIUlRGXG4gKi9cblxuLyoqXG4gKiBFcVByZXNldFxuICogQHRvZG86IHRvIGJlIGRlZmluZWRcbiAqIEB0eXBlZGVmIHtPYmplY3R9IEVxUHJlc2V0XG4gKi9cblxuIC8qKlxuICogQGV4dGVybmFsIHtBdWRpb0NvbnRleHR9IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2ZyL2RvY3MvV2ViL0FQSS9BdWRpb0NvbnRleHRcbiAqL1xuIiwiaW1wb3J0IEFic3RyYWN0Tm9kZSBmcm9tICcuLi9jb3JlL2luZGV4LmpzJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaWFsb2dFbmhhbmNlbWVudCBleHRlbmRzIEFic3RyYWN0Tm9kZSB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IGF1ZGlvQ29udGV4dCAtIGF1ZGlvQ29udGV4dCBpbnN0YW5jZS5cbiAgICAgKiBAcGFyYW0ge0F1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9ufSBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbiAtIGF1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9uLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtb2RlIC0gbW9kZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkaWFsb2dHYWluIC0gZGlhbG9nIGdhaW5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihhdWRpb0NvbnRleHQsIGF1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9uLCBtb2RlLCBkaWFsb2dHYWluKXtcbiAgICAgICAgc3VwZXIoYXVkaW9Db250ZXh0LCBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbik7XG4gICAgICAgIHRoaXMuX21vZGUgPSBtb2RlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgTW9kZSAtIHZhbHVlIGlzIDEsIDIgb3IgM1xuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgc2V0IG1vZGUodmFsdWUpe1xuICAgICAgICAvLyBAdG9kbyBlcnJvciBpbiBzb21lIG1vZGU6IGVnLiBtb2RlIDEgYW5kIG5vIGRpYWxvZyA9PiBcImltcG9zc2libGVcIlxuICAgICAgICAvLyBlcnJvciBtb2RlIDIgZXQgcGFzIGRlIDUuMCBvdSA1LjFcbiAgICAgICAgLy8gZXJyb3IgbW9kZSAzIGV0IHBhcyBkZSBzdMOpcsOpb1xuICAgICAgICB0aGlzLl9tb2RlID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCBNb2RlIC0gdmFsdWUgaXMgMSwgMiBvciAzXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBnZXQgbW9kZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fbW9kZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IGF1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9uXG4gICAgICogQHR5cGUge0F1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9ufVxuICAgICAqL1xuICAgIHNldCBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbih2YWx1ZSl7XG4gICAgICAgIHRoaXMuX2F1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9uID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvblxuICAgICAqIEB0eXBlIHtBdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbn1cbiAgICAgKi9cbiAgICBnZXQgYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9uO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgZGlhbG9nR2FpblxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQHRvZG8gZ2l2ZSByYW5nZSBvZiBhY2NlcHRlZCB2YWx1ZXNcbiAgICAgKi9cbiAgICBzZXQgZGlhbG9nR2Fpbih2YWx1ZSl7XG4gICAgICAgIHRoaXMuX2RpYWxvZ0dhaW4gPSB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IGRpYWxvZ0dhaW5cbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEB0b2RvIGdpdmUgcmFuZ2Ugb2YgYWNjZXB0ZWQgdmFsdWVzXG4gICAgICovXG4gICAgZ2V0IGRpYWxvZ0dhaW4oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RpYWxvZ0dhaW47XG4gICAgfVxufVxuXG4iLCJpbXBvcnQgRGlhbG9nRW5oYW5jZW1lbnQgZnJvbSAnLi9kaWFsb2ctZW5oYW5jZW1lbnQvaW5kZXguanMnO1xuaW1wb3J0IE11bHRpY2hhbm5lbFNwYXRpYWxpc2VyIGZyb20gJy4vbXVsdGljaGFubmVsLXNwYXRpYWxpc2VyL2luZGV4LmpzJztcbmltcG9ydCBOb2lzZUFkYXB0YXRpb24gZnJvbSAnLi9ub2lzZS1hZGFwdGF0aW9uL2luZGV4LmpzJztcbmltcG9ydCBPYmplY3RTcGF0aWFsaXNlckFuZE1peGVyIGZyb20gJy4vb2JqZWN0LXNwYXRpYWxpc2VyLWFuZC1taXhlci9pbmRleC5qcyc7XG5pbXBvcnQgU21hcnRGYWRlciBmcm9tICcuL3NtYXJ0LWZhZGVyL2luZGV4LmpzJztcbmltcG9ydCB7QXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24sIEF1ZGlvU3RyZWFtRGVzY3JpcHRpb259IGZyb20gJy4vY29yZS9pbmRleC5qcyc7XG5cblxuY29uc3QgTTREUEF1ZGlvTW9kdWxlcyA9IHtcbiAgICBcIkRpYWxvZ0VuaGFuY2VtZW50XCI6IERpYWxvZ0VuaGFuY2VtZW50LFxuICAgIFwiTXVsdGljaGFubmVsU3BhdGlhbGlzZXJcIjogTXVsdGljaGFubmVsU3BhdGlhbGlzZXIsXG4gICAgXCJOb2lzZUFkYXB0YXRpb25cIjogTm9pc2VBZGFwdGF0aW9uLFxuICAgIFwiT2JqZWN0U3BhdGlhbGlzZXJBbmRNaXhlclwiOiBPYmplY3RTcGF0aWFsaXNlckFuZE1peGVyLFxuICAgIFwiU21hcnRGYWRlclwiOiBTbWFydEZhZGVyLFxuICAgIFwiQXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb25cIjogQXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24sXG4gICAgXCJBdWRpb1N0cmVhbURlc2NyaXB0aW9uXCI6IEF1ZGlvU3RyZWFtRGVzY3JpcHRpb25cbn07XG5cbi8vIEBmaXgsIEV4dHJhIHVnbHksIHNob3VsZCB1c2UgZXhwb3J0IGRlZmF1bHQgTTREUEF1ZGlvTW9kdWxlcztcbndpbmRvdy5NNERQQXVkaW9Nb2R1bGVzID0gTTREUEF1ZGlvTW9kdWxlcztcbiIsImltcG9ydCBBYnN0cmFjdE5vZGUgZnJvbSAnLi4vY29yZS9pbmRleC5qcyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXVsdGljaGFubmVsU3BhdGlhbGlzZXIgZXh0ZW5kcyBBYnN0cmFjdE5vZGUge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7QXVkaW9Db250ZXh0fSBhdWRpb0NvbnRleHQgLSBhdWRpb0NvbnRleHQgaW5zdGFuY2UuXG4gICAgICogQHBhcmFtIHtBdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbn0gYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24gLSBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbi5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gb3V0cHV0VHlwZSAtIG91dHB1dCB0eXBlIFwiaGVhZHBob25lXCIgb3IgXCJzcGVha2VyXCJcbiAgICAgKiBAcGFyYW0ge0hSVEZ9IGhydGYgLSBocnRmIEB0b2RvIHRvIGJlIGRlZmluZWRcbiAgICAgKiBAcGFyYW0ge0VxUHJlc2V0fSBlcVByZXNldCAtIGRpYWxvZyBnYWluIEB0b2RvIHRvIGJlIGRlZmluZWRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb2Zmc2V0R2FpbiAtIGdhaW4gQHRvZG8gdmFsdWUgdG8gYmUgZGVmaW5lZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsaXN0ZW5pbmdBeGlzIC0gYW5nbGU/IEB0b2RvIHZhbHVlIHRvIGJlIGRlZmluZWRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihhdWRpb0NvbnRleHQsIGF1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9uID0gdW5kZWZpbmVkLCBvdXRwdXRUeXBlID0gJ2hlYWRwaG9uZScsIGhydGYsIGVxUHJlc2V0LCBvZmZzZXRHYWluLCBsaXN0ZW5pbmdBeGlzKXtcbiAgICAgICAgc3VwZXIoYXVkaW9Db250ZXh0LCBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbik7XG4gICAgICAgIHRoaXMuX291dHB1dFR5cGUgPSBvdXRwdXRUeXBlO1xuICAgICAgICB0aGlzLl9ocnRmID0gaHJ0ZjtcbiAgICAgICAgdGhpcy5fZXFQcmVzZXQgPSBlcVByZXNldDtcbiAgICAgICAgdGhpcy5fb2Zmc2V0R2FpbiA9IG9mZnNldEdhaW47XG4gICAgICAgIHRoaXMuX2xpc3RlbmluZ0F4aXMgPSBsaXN0ZW5pbmdBeGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgb3V0cHV0VHlwZTogJ2hlYWRwaG9uZScgb3IgJ3NwZWFrZXInLCAnbXVsdGljYW5hbCdcbiAgICAgKiBAdG9kbzogYXV0b21hdGljIGZvciAnbXVsdGljYW5hbCcgZXZlbiBpZiBuYiBvZiBzcGVha2VyICd3cm9uZydcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHNldCBvdXRwdXRUeXBlKHZhbHVlKXtcbiAgICAgICAgdGhpcy5fb3V0cHV0VHlwZSA9IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgb3V0cHV0VHlwZTogJ2hlYWRwaG9uZScgb3IgJ3NwZWFrZXInXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXQgb3V0cHV0VHlwZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fb3V0cHV0VHlwZVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgYXVkaW8gc3RyZWFtcyBkZXNjcmlwdGlvbiAoanNvbilcbiAgICAgKiBAdHlwZSB7QXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb259XG4gICAgICovXG4gICAgc2V0IGF1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9uKHZhbHVlKXtcblxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgYXVkaW8gc3RyZWFtcyBkZXNjcmlwdGlvblxuICAgICAqIEB0eXBlIHtBdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbn1cbiAgICAgKi9cbiAgICBnZXQgYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIF9hdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IGhydGZcbiAgICAgKiBAdHlwZSB7SFJURn1cbiAgICAgKiBAdG9kbzogd2hpY2gga2luZCBvZiB2YWx1ZSwganNvbj9cbiAgICAgKi9cbiAgICBzZXQgaHJ0Zih2YWx1ZSl7XG4gICAgICAgIHRoaXMuX2hydGYgPSB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IGhydGZcbiAgICAgKiBAdHlwZSB7SFJURn1cbiAgICAgKi9cbiAgICBnZXQgaHJ0Zigpe1xuICAgICAgICByZXR1cm4gdGhpcy5faHJ0ZjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IGVxUHJlc2V0XG4gICAgICogQHRvZG86IHdoaWNoIGtpbmQgb2YgdmFsdWUsIGpzb24/XG4gICAgICogQHRvZG86IHNldCBpdCB0byBub25lIHRvIG5vdCBhcHB5IGFueSBlcT9cbiAgICAgKiBAdHlwZSB7RXFQcmVzZXR9XG4gICAgICovXG4gICAgc2V0IGVxUHJlc2V0KHZhbHVlKXtcbiAgICAgICAgdGhpcy5fZXFQcmVzZXQgPSB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IGVxUHJlc2V0XG4gICAgICogQHR5cGUge0VxUHJlc2V0fVxuICAgICAqL1xuICAgIGdldCBlcVByZXNldCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fZXFQcmVzZXQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCBvZmZzZXRHYWluXG4gICAgICogQHRvZG8gcmFuZ2VcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHNldCBvZmZzZXRHYWluKHZhbHVlKXtcbiAgICAgICAgdGhpcy5fb2Zmc2V0R2FpbiA9IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgb2Zmc2V0R2FpblxuICAgICAqIEB0b2RvIHJhbmdlXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBnZXQgb2Zmc2V0R2Fpbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fb2Zmc2V0R2FpbjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IGxpc3RlbmluZ0F4aXNcbiAgICAgKiBAdG9kbyB2YWx1ZSB0eXBlPyBhbmdsZT9cbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHNldCBsaXN0ZW5pbmdBeGlzKHZhbHVlKXtcbiAgICAgICAgdGhpcy5fbGlzdGVuaW5nQXhpcyA9IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgbGlzdGVuaW5nQXhpc1xuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0IGxpc3RlbmluZ0F4aXMoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3RlbmluZ0F4aXM7XG4gICAgfVxufVxuIiwiaW1wb3J0IEFic3RyYWN0Tm9kZSBmcm9tICcuLi9jb3JlL2luZGV4LmpzJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb2lzZUFkYXB0YXRpb24gZXh0ZW5kcyBBYnN0cmFjdE5vZGUge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7QXVkaW9Db250ZXh0fSBhdWRpb0NvbnRleHQgLSBhdWRpb0NvbnRleHQgaW5zdGFuY2UuXG4gICAgICogQHBhcmFtIHtBdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbn0gYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24gLSBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbi5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGhlYWRwaG9uZSAtIHRydWUgaXMgaGVhZHBob25lLCBlbHNlLCBmYWxzZS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihhdWRpb0NvbnRleHQsIGF1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9uLCBoZWFkcGhvbmUgPSBmYWxzZSl7XG4gICAgICAgIHN1cGVyKGF1ZGlvQ29udGV4dCwgYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24pO1xuICAgICAgICB0aGlzLl9oZWFkcGhvbmUgPSBoZWFkcGhvbmU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFByb2Nlc3M6XG4gICAgICogQHRvZG86IHRyYWNrIG5vaXNlLCBhZGQgY29tcHJlc3Npb24sIGltcHJvdmUgdm9pY2UgaWYgbm8gaGVhZHBob25lXG4gICAgICovXG4gICAgX3Byb2Nlc3MoKXtcblxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgaGVhZHBob25lIC0gdHJ1ZSBpcyBoZWFkcGhvbmUsIGVsc2UsIGZhbHNlLlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIHNldCBoZWFkcGhvbmUodmFsdWUpe1xuICAgICAgICB0aGlzLl9oZWFkcGhvbmUgPSB2YWx1ZVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgaGVhZHBob25lLCByZXR1cm4gVHJ1ZSBpZiBoZWFkcGhvbmUgaXMgY29ubmVjdGVkLCBlbHNlLCBmYWxzZVxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIGdldCBoZWFkcGhvbmUoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hlYWRwaG9uZTtcbiAgICB9XG59XG4iLCJpbXBvcnQgTXVsdGljaGFubmVsU3BhdGlhbGlzZXIgZnJvbSAnLi4vbXVsdGljaGFubmVsLXNwYXRpYWxpc2VyL2luZGV4LmpzJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPYmplY3RTcGF0aWFsaXNlckFuZE1peGVyIGV4dGVuZHMgTXVsdGljaGFubmVsU3BhdGlhbGlzZXIge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7QXVkaW9Db250ZXh0fSBhdWRpb0NvbnRleHQgLSBhdWRpb0NvbnRleHQgaW5zdGFuY2UuXG4gICAgICogQHBhcmFtIHtBdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbn0gYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24gLSBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbi5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gb3V0cHV0VHlwZSAtIG91dHB1dCB0eXBlIFwiaGVhZHBob25lXCIgb3IgXCJzcGVha2VyXCJcbiAgICAgKiBAcGFyYW0ge0hSVEZ9IGhydGYgLSBocnRmIEB0b2RvIHRvIGJlIGRlZmluZWRcbiAgICAgKiBAcGFyYW0ge0VxUHJlc2V0fSBlcVByZXNldCAtIGRpYWxvZyBnYWluIEB0b2RvIHRvIGJlIGRlZmluZWRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb2Zmc2V0R2FpbiAtIGdhaW4gQHRvZG8gdmFsdWUgdG8gYmUgZGVmaW5lZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsaXN0ZW5pbmdBeGlzIC0gYW5nbGU/IEB0b2RvIHZhbHVlIHRvIGJlIGRlZmluZWRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihhdWRpb0NvbnRleHQsIGF1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9uID0gdW5kZWZpbmVkLCBvdXRwdXRUeXBlID0gJ2hlYWRwaG9uZScsIGhydGYsIGVxUHJlc2V0LCBvZmZzZXRHYWluLCBsaXN0ZW5pbmdBeGlzKXtcbiAgICAgICAgc3VwZXIoYXVkaW9Db250ZXh0LCBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbiwgb3V0cHV0VHlwZSwgaHJ0ZiwgZXFQcmVzZXQsIG9mZnNldEdhaW4sIGxpc3RlbmluZ0F4aXMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBzb3VuZFxuICAgICAqIEB0b2RvIG9ubHkgZm9yIGEgdW5pcXVlIG1vbm8gc3RyZWFtXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGF6aW11dGggLSBhemltdXRoIEB0b2RvIHZhbHVlcyB0byBiZSBkZWZpbmVkXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGVsZXZhdGlvbiAtIGVsZXZhdGlvbiBAdG9kbyB2YWx1ZXMgdG8gYmUgZGVmaW5lZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkaXN0YW5jZSAtIGRpc3RhbmNlIEB0b2RvIHZhbHVlcyB0byBiZSBkZWZpbmVkXG4gICAgICovXG4gICAgc2V0UG9zaXRpb24oYXppbXV0aCwgZWxldmF0aW9uLCBkaXN0YW5jZSl7XG4gICAgICAgIHRoaXMuX2F6aW11dGggPSBhemltdXRoO1xuICAgICAgICB0aGlzLl9lbGV2YXRpb24gPSBlbGV2YXRpb247XG4gICAgICAgIHRoaXMuX2Rpc3RhbmNlID0gZGlzdGFuY2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgcG9zaXRpb24gb2YgdGhlIHNvdW5kXG4gICAgICogQHRvZG8gcmV0dXJuIGFuIGFycmF5PyBiZXR0ZXIgSSB0aGluayBmb3Igc2V0UG9zaXRpb24vZ2V0UG9zaXRpb24gaG9tb2dlbmVpdHlcbiAgICAgKiBAcmV0dXJuIHthcnJheX1cbiAgICAgKi9cbiAgICBnZXRQb3NpdGlvbigpe1xuICAgICAgICAvL3JldHVybiB7J2F6aW11dGgnOiB0aGlzLl9hemltdXRoLCAnZWxldmF0aW9uJzogdGhpcy5fZWxldmF0aW9uLCAnZGlzdGFuY2UnOiB0aGlzLl9kaXN0YW5jZX07XG4gICAgICAgIHJldHVybiBbdGhpcy5fYXppbXV0aCwgdGhpcy5fZWxldmF0aW9uLCB0aGlzLl9kaXN0YW5jZV07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFByb2Nlc3M6IFwicG9zaXRpb25cIiArIFwiZ2FpblwiXG4gICAgICogQHRvZG86IGhvdyB0byBhdXRvbWF0aWNhbGx5IHNldCB0aGUgZ2FpbiwgaG93IHRvIGhhdmUgUk1TIGZyb20gXCJ0aGUgb3RoZXIgc2lnbmFsXCIgaGVyZVxuICAgICAqL1xuICAgICBfcHJvY2Vzcygpe1xuICAgICB9XG59XG4iLCJpbXBvcnQgQWJzdHJhY3ROb2RlIGZyb20gJy4uL2NvcmUvaW5kZXguanMnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNtYXJ0RmFkZXIgZXh0ZW5kcyBBYnN0cmFjdE5vZGUge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7QXVkaW9Db250ZXh0fSBhdWRpb0NvbnRleHQgLSBhdWRpb0NvbnRleHQgaW5zdGFuY2UuXG4gICAgICogQHBhcmFtIHtBdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbn0gYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24gLSBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkQiAtIGRCIHZhbHVlIGZvciB0aGUgU21hcnRGYWRlci5cbiAgICAgKiBAdG9kbyBnaXZlIHJhbmdlIG9mIGFjY2VwdGVkIHZhbHVlc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGF1ZGlvQ29udGV4dCwgYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24gPSB1bmRlZmluZWQsIGRCID0gdW5kZWZpbmVkKXtcbiAgICAgICAgc3VwZXIoYXVkaW9Db250ZXh0LCBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbik7XG4gICAgICAgIHRoaXMuX2RCID0gZEI7XG5cbiAgICAgICAgLy8gQXVkaW9HcmFwaCBjb25uZWN0XG4gICAgICAgIC8vIEB0b2RvOiBEeW5hbWljc0NvbXByZXNzb3JOb2RlIGFjY2VwdCBuIGNoYW5uZWxzIGlucHV0XG4gICAgICAgIHRoaXMuX2R5bmFtaWNDb21wcmVzc29yTm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVEeW5hbWljc0NvbXByZXNzb3IoKTtcbiAgICAgICAgdGhpcy5pbnB1dC5jb25uZWN0KHRoaXMuX2R5bmFtaWNDb21wcmVzc29yTm9kZSlcbiAgICAgICAgdGhpcy5fZHluYW1pY0NvbXByZXNzb3JOb2RlLmNvbm5lY3QodGhpcy5fb3V0cHV0KVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIGRCIHZhbHVlXG4gICAgICogQHRvZG8gZ2l2ZSByYW5nZSBvZiBhY2NlcHRlZCB2YWx1ZXNcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHNldCBkQih2YWx1ZSl7XG4gICAgICAgIC8vIEB0b2RvIGNsaXAgdmFsdWVcbiAgICAgICAgdGhpcy5fZEIgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5fdXBkYXRlKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgZEIgdmFsdWVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldCBkQigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fZEI7XG4gICAgfVxuICAgIC8vIEB0b2RvIE1hdGhpZXUgLTgwZEIgPT4gKzIwZEJcbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGRCIHJhbmdlXG4gICAgICogQHR5cGUge2FycmF5fVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgZEJSYW5nZSgpe1xuICAgICAgICByZXR1cm4gWy04MCwgMjBdXG4gICAgfVxuICAgIHN0YXRpYyBnZXQgZEJEZWZhdWx0KCl7XG4gICAgICAgIHJldHVybiAwXG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgZHluYW1pYyBjb21wcmVzc2lvbiBzdGF0ZVxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIGdldCBkeW5hbWljQ29tcHJlc3Npb25TdGF0ZSgpe1xuICAgICAgICBpZih0aGlzLl9keW5hbWljQ29tcHJlc3Nvck5vZGUucmVkdWN0aW9uID4gMCl7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICB9XG4gICAgX3VwZGF0ZSgpe1xuICAgICAgICAvLyBAdG9kbyDDqWNsYWlyY2lyIHLDqWdsZXMgZCdhY3RpdmF0aW9uIGF2ZWMgTWF0dGhpZXVcbiAgICAgICAgLy8gdGhpcy5fZHluYW1pY0NvbXByZXNzb3JOb2RlLnRocmVzaG9sZFxuICAgICAgICAvLyB0aGlzLl9keW5hbWljQ29tcHJlc3Nvck5vZGUua25lZVxuICAgICAgICAvLyB0aGlzLl9keW5hbWljQ29tcHJlc3Nvck5vZGUucmF0aW9cbiAgICAgICAgLy8gdGhpcy5fZHluYW1pY0NvbXByZXNzb3JOb2RlLmF0dGFja1xuICAgICAgICAvLyB0aGlzLl9keW5hbWljQ29tcHJlc3Nvck5vZGUucmVsZWFzZVxuICAgIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9nZXQtaXRlcmF0b3JcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2NyZWF0ZVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvZGVmaW5lLXByb3BlcnR5XCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L3NldC1wcm90b3R5cGUtb2ZcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9PYmplY3QkZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9kZWZpbmUtcHJvcGVydHlcIilbXCJkZWZhdWx0XCJdO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IChmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuXG4gICAgICBfT2JqZWN0JGRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gIH07XG59KSgpO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX09iamVjdCRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JcIilbXCJkZWZhdWx0XCJdO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uIGdldChfeCwgX3gyLCBfeDMpIHtcbiAgdmFyIF9hZ2FpbiA9IHRydWU7XG5cbiAgX2Z1bmN0aW9uOiB3aGlsZSAoX2FnYWluKSB7XG4gICAgdmFyIG9iamVjdCA9IF94LFxuICAgICAgICBwcm9wZXJ0eSA9IF94MixcbiAgICAgICAgcmVjZWl2ZXIgPSBfeDM7XG4gICAgZGVzYyA9IHBhcmVudCA9IGdldHRlciA9IHVuZGVmaW5lZDtcbiAgICBfYWdhaW4gPSBmYWxzZTtcbiAgICBpZiAob2JqZWN0ID09PSBudWxsKSBvYmplY3QgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbiAgICB2YXIgZGVzYyA9IF9PYmplY3QkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHkpO1xuXG4gICAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfeCA9IHBhcmVudDtcbiAgICAgICAgX3gyID0gcHJvcGVydHk7XG4gICAgICAgIF94MyA9IHJlY2VpdmVyO1xuICAgICAgICBfYWdhaW4gPSB0cnVlO1xuICAgICAgICBjb250aW51ZSBfZnVuY3Rpb247XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcInZhbHVlXCIgaW4gZGVzYykge1xuICAgICAgcmV0dXJuIGRlc2MudmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBnZXR0ZXIgPSBkZXNjLmdldDtcblxuICAgICAgaWYgKGdldHRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBnZXR0ZXIuY2FsbChyZWNlaXZlcik7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX09iamVjdCRjcmVhdGUgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9jcmVhdGVcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX09iamVjdCRzZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L3NldC1wcm90b3R5cGUtb2ZcIilbXCJkZWZhdWx0XCJdO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uIChzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7XG4gIH1cblxuICBzdWJDbGFzcy5wcm90b3R5cGUgPSBfT2JqZWN0JGNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xuICBpZiAoc3VwZXJDbGFzcykgX09iamVjdCRzZXRQcm90b3R5cGVPZiA/IF9PYmplY3Qkc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzcztcbn07XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDoge1xuICAgIFwiZGVmYXVsdFwiOiBvYmpcbiAgfTtcbn07XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwicmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvcicpOyIsInZhciAkID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZShQLCBEKXtcbiAgcmV0dXJuICQuY3JlYXRlKFAsIEQpO1xufTsiLCJ2YXIgJCA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvJCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBkZXNjKXtcbiAgcmV0dXJuICQuc2V0RGVzYyhpdCwga2V5LCBkZXNjKTtcbn07IiwidmFyICQgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzLyQnKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpe1xuICByZXR1cm4gJC5nZXREZXNjKGl0LCBrZXkpO1xufTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzLyQuY29yZScpLk9iamVjdC5zZXRQcm90b3R5cGVPZjsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoIWlzT2JqZWN0KGl0KSl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07IiwiLy8gZ2V0dGluZyB0YWcgZnJvbSAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjb2YgPSByZXF1aXJlKCcuLyQuY29mJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuLyQud2tzJykoJ3RvU3RyaW5nVGFnJylcbiAgLy8gRVMzIHdyb25nIGhlcmVcbiAgLCBBUkcgPSBjb2YoZnVuY3Rpb24oKXsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBPLCBULCBCO1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAoVCA9IChPID0gT2JqZWN0KGl0KSlbVEFHXSkgPT0gJ3N0cmluZycgPyBUXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBBUkcgPyBjb2YoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAoQiA9IGNvZihPKSkgPT0gJ09iamVjdCcgJiYgdHlwZW9mIE8uY2FsbGVlID09ICdmdW5jdGlvbicgPyAnQXJndW1lbnRzJyA6IEI7XG59OyIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07IiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHt2ZXJzaW9uOiAnMS4yLjMnfTtcbmlmKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsIi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vJC5hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aGF0LCBsZW5ndGgpe1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZih0aGF0ID09PSB1bmRlZmluZWQpcmV0dXJuIGZuO1xuICBzd2l0Y2gobGVuZ3RoKXtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYil7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59OyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgPSByZXF1aXJlKCcuLyQuY29yZScpXG4gICwgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG52YXIgY3R4ID0gZnVuY3Rpb24oZm4sIHRoYXQpe1xuICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG52YXIgJGRlZiA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG4gIHZhciBrZXksIG93biwgb3V0LCBleHBcbiAgICAsIGlzR2xvYmFsID0gdHlwZSAmICRkZWYuR1xuICAgICwgaXNQcm90byAgPSB0eXBlICYgJGRlZi5QXG4gICAgLCB0YXJnZXQgICA9IGlzR2xvYmFsID8gZ2xvYmFsIDogdHlwZSAmICRkZWYuU1xuICAgICAgICA/IGdsb2JhbFtuYW1lXSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV1cbiAgICAsIGV4cG9ydHMgID0gaXNHbG9iYWwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KTtcbiAgaWYoaXNHbG9iYWwpc291cmNlID0gbmFtZTtcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICEodHlwZSAmICRkZWYuRikgJiYgdGFyZ2V0ICYmIGtleSBpbiB0YXJnZXQ7XG4gICAgaWYob3duICYmIGtleSBpbiBleHBvcnRzKWNvbnRpbnVlO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gb3duID8gdGFyZ2V0W2tleV0gOiBzb3VyY2Vba2V5XTtcbiAgICAvLyBwcmV2ZW50IGdsb2JhbCBwb2xsdXRpb24gZm9yIG5hbWVzcGFjZXNcbiAgICBpZihpc0dsb2JhbCAmJiB0eXBlb2YgdGFyZ2V0W2tleV0gIT0gJ2Z1bmN0aW9uJylleHAgPSBzb3VyY2Vba2V5XTtcbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIGVsc2UgaWYodHlwZSAmICRkZWYuQiAmJiBvd24pZXhwID0gY3R4KG91dCwgZ2xvYmFsKTtcbiAgICAvLyB3cmFwIGdsb2JhbCBjb25zdHJ1Y3RvcnMgZm9yIHByZXZlbnQgY2hhbmdlIHRoZW0gaW4gbGlicmFyeVxuICAgIGVsc2UgaWYodHlwZSAmICRkZWYuVyAmJiB0YXJnZXRba2V5XSA9PSBvdXQpIWZ1bmN0aW9uKEMpe1xuICAgICAgZXhwID0gZnVuY3Rpb24ocGFyYW0pe1xuICAgICAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIEMgPyBuZXcgQyhwYXJhbSkgOiBDKHBhcmFtKTtcbiAgICAgIH07XG4gICAgICBleHBbUFJPVE9UWVBFXSA9IENbUFJPVE9UWVBFXTtcbiAgICB9KG91dCk7XG4gICAgZWxzZSBleHAgPSBpc1Byb3RvICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4cG9ydFxuICAgIGV4cG9ydHNba2V5XSA9IGV4cDtcbiAgICBpZihpc1Byb3RvKShleHBvcnRzW1BST1RPVFlQRV0gfHwgKGV4cG9ydHNbUFJPVE9UWVBFXSA9IHt9KSlba2V5XSA9IG91dDtcbiAgfVxufTtcbi8vIHR5cGUgYml0bWFwXG4kZGVmLkYgPSAxOyAgLy8gZm9yY2VkXG4kZGVmLkcgPSAyOyAgLy8gZ2xvYmFsXG4kZGVmLlMgPSA0OyAgLy8gc3RhdGljXG4kZGVmLlAgPSA4OyAgLy8gcHJvdG9cbiRkZWYuQiA9IDE2OyAvLyBiaW5kXG4kZGVmLlcgPSAzMjsgLy8gd3JhcFxubW9kdWxlLmV4cG9ydHMgPSAkZGVmOyIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07IiwidmFyICQgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuLyQucHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuc3VwcG9ydC1kZXNjJykgPyBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICByZXR1cm4gJC5zZXREZXNjKG9iamVjdCwga2V5LCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07IiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuLyQuY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4vJCcpXG4gICwgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vJC5oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKSwgZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KXtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gJC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHtuZXh0OiByZXF1aXJlKCcuLyQucHJvcGVydHktZGVzYycpKDEsbmV4dCl9KTtcbiAgcmVxdWlyZSgnLi8kLnRhZycpKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSAgICAgICAgID0gcmVxdWlyZSgnLi8kLmxpYnJhcnknKVxuICAsICRkZWYgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsICRyZWRlZiAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5yZWRlZicpXG4gICwgaGlkZSAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmhpZGUnKVxuICAsIGhhcyAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5oYXMnKVxuICAsIFNZTUJPTF9JVEVSQVRPUiA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxuICAsIEl0ZXJhdG9ycyAgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyYXRvcnMnKVxuICAsIEJVR0dZICAgICAgICAgICA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKSAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG4gICwgRkZfSVRFUkFUT1IgICAgID0gJ0BAaXRlcmF0b3InXG4gICwgS0VZUyAgICAgICAgICAgID0gJ2tleXMnXG4gICwgVkFMVUVTICAgICAgICAgID0gJ3ZhbHVlcyc7XG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRSl7XG4gIHJlcXVpcmUoJy4vJC5pdGVyLWNyZWF0ZScpKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uKGtpbmQpe1xuICAgIHN3aXRjaChraW5kKXtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHICAgICAgPSBOQU1FICsgJyBJdGVyYXRvcidcbiAgICAsIHByb3RvICAgID0gQmFzZS5wcm90b3R5cGVcbiAgICAsIF9uYXRpdmUgID0gcHJvdG9bU1lNQk9MX0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXVxuICAgICwgX2RlZmF1bHQgPSBfbmF0aXZlIHx8IGNyZWF0ZU1ldGhvZChERUZBVUxUKVxuICAgICwgbWV0aG9kcywga2V5O1xuICAvLyBGaXggbmF0aXZlXG4gIGlmKF9uYXRpdmUpe1xuICAgIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHJlcXVpcmUoJy4vJCcpLmdldFByb3RvKF9kZWZhdWx0LmNhbGwobmV3IEJhc2UpKTtcbiAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgcmVxdWlyZSgnLi8kLnRhZycpKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgIC8vIEZGIGZpeFxuICAgIGlmKCFMSUJSQVJZICYmIGhhcyhwcm90bywgRkZfSVRFUkFUT1IpKWhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIFNZTUJPTF9JVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmKCFMSUJSQVJZIHx8IEZPUkNFKWhpZGUocHJvdG8sIFNZTUJPTF9JVEVSQVRPUiwgX2RlZmF1bHQpO1xuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9IF9kZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSAgPSByZXR1cm5UaGlzO1xuICBpZihERUZBVUxUKXtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiAgREVGQVVMVCA9PSBWQUxVRVMgPyBfZGVmYXVsdCA6IGNyZWF0ZU1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogICAgSVNfU0VUICAgICAgICAgICAgPyBfZGVmYXVsdCA6IGNyZWF0ZU1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6IERFRkFVTFQgIT0gVkFMVUVTID8gX2RlZmF1bHQgOiBjcmVhdGVNZXRob2QoJ2VudHJpZXMnKVxuICAgIH07XG4gICAgaWYoRk9SQ0UpZm9yKGtleSBpbiBtZXRob2RzKXtcbiAgICAgIGlmKCEoa2V5IGluIHByb3RvKSkkcmVkZWYocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGRlZigkZGVmLlAgKyAkZGVmLkYgKiBCVUdHWSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkb25lLCB2YWx1ZSl7XG4gIHJldHVybiB7dmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmV9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHt9OyIsInZhciAkT2JqZWN0ID0gT2JqZWN0O1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZTogICAgICRPYmplY3QuY3JlYXRlLFxuICBnZXRQcm90bzogICAkT2JqZWN0LmdldFByb3RvdHlwZU9mLFxuICBpc0VudW06ICAgICB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZSxcbiAgZ2V0RGVzYzogICAgJE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIHNldERlc2M6ICAgICRPYmplY3QuZGVmaW5lUHJvcGVydHksXG4gIHNldERlc2NzOiAgICRPYmplY3QuZGVmaW5lUHJvcGVydGllcyxcbiAgZ2V0S2V5czogICAgJE9iamVjdC5rZXlzLFxuICBnZXROYW1lczogICAkT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMsXG4gIGdldFN5bWJvbHM6ICRPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzLFxuICBlYWNoOiAgICAgICBbXS5mb3JFYWNoXG59OyIsIm1vZHVsZS5leHBvcnRzID0gdHJ1ZTsiLCIvLyBtb3N0IE9iamVjdCBtZXRob2RzIGJ5IEVTNiBzaG91bGQgYWNjZXB0IHByaW1pdGl2ZXNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oS0VZLCBleGVjKXtcbiAgdmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgICAsIGZuICAgPSAocmVxdWlyZSgnLi8kLmNvcmUnKS5PYmplY3QgfHwge30pW0tFWV0gfHwgT2JqZWN0W0tFWV1cbiAgICAsIGV4cCAgPSB7fTtcbiAgZXhwW0tFWV0gPSBleGVjKGZuKTtcbiAgJGRlZigkZGVmLlMgKyAkZGVmLkYgKiByZXF1aXJlKCcuLyQuZmFpbHMnKShmdW5jdGlvbigpeyBmbigxKTsgfSksICdPYmplY3QnLCBleHApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGJpdG1hcCwgdmFsdWUpe1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGUgIDogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGUgICAgOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlICAgICAgIDogdmFsdWVcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuaGlkZScpOyIsIi8vIFdvcmtzIHdpdGggX19wcm90b19fIG9ubHkuIE9sZCB2OCBjYW4ndCB3b3JrIHdpdGggbnVsbCBwcm90byBvYmplY3RzLlxuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cbnZhciBnZXREZXNjICA9IHJlcXVpcmUoJy4vJCcpLmdldERlc2NcbiAgLCBpc09iamVjdCA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKVxuICAsIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpO1xudmFyIGNoZWNrID0gZnVuY3Rpb24oTywgcHJvdG8pe1xuICBhbk9iamVjdChPKTtcbiAgaWYoIWlzT2JqZWN0KHByb3RvKSAmJiBwcm90byAhPT0gbnVsbCl0aHJvdyBUeXBlRXJyb3IocHJvdG8gKyBcIjogY2FuJ3Qgc2V0IGFzIHByb3RvdHlwZSFcIik7XG59O1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8ICgnX19wcm90b19fJyBpbiB7fSA/IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICBmdW5jdGlvbih0ZXN0LCBidWdneSwgc2V0KXtcbiAgICAgIHRyeSB7XG4gICAgICAgIHNldCA9IHJlcXVpcmUoJy4vJC5jdHgnKShGdW5jdGlvbi5jYWxsLCBnZXREZXNjKE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nKS5zZXQsIDIpO1xuICAgICAgICBzZXQodGVzdCwgW10pO1xuICAgICAgICBidWdneSA9ICEodGVzdCBpbnN0YW5jZW9mIEFycmF5KTtcbiAgICAgIH0gY2F0Y2goZSl7IGJ1Z2d5ID0gdHJ1ZTsgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKE8sIHByb3RvKXtcbiAgICAgICAgY2hlY2soTywgcHJvdG8pO1xuICAgICAgICBpZihidWdneSlPLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgICAgICBlbHNlIHNldChPLCBwcm90byk7XG4gICAgICAgIHJldHVybiBPO1xuICAgICAgfTtcbiAgICB9KHt9LCBmYWxzZSkgOiB1bmRlZmluZWQpLFxuICBjaGVjazogY2hlY2tcbn07IiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKVxuICAsIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nXG4gICwgc3RvcmUgID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcbn07IiwiLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuLyQudG8taW50ZWdlcicpXG4gICwgZGVmaW5lZCAgID0gcmVxdWlyZSgnLi8kLmRlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVE9fU1RSSU5HKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRoYXQsIHBvcyl7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSlcbiAgICAgICwgaSA9IHRvSW50ZWdlcihwb3MpXG4gICAgICAsIGwgPSBzLmxlbmd0aFxuICAgICAgLCBhLCBiO1xuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsXG4gICAgICB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59OyIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vJC5mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTsiLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi8kJykuc2V0RGVzY1xuICAsIGhhcyA9IHJlcXVpcmUoJy4vJC5oYXMnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vJC53a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgdGFnLCBzdGF0KXtcbiAgaWYoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSlkZWYoaXQsIFRBRywge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZ30pO1xufTsiLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsICA9IE1hdGguY2VpbFxuICAsIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07IiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vJC5pb2JqZWN0JylcbiAgLCBkZWZpbmVkID0gcmVxdWlyZSgnLi8kLmRlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gSU9iamVjdChkZWZpbmVkKGl0KSk7XG59OyIsInZhciBpZCA9IDBcbiAgLCBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK2lkICsgcHgpLnRvU3RyaW5nKDM2KSk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfTsiLCJ2YXIgc3RvcmUgID0gcmVxdWlyZSgnLi8kLnNoYXJlZCcpKCd3a3MnKVxuICAsIFN5bWJvbCA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKS5TeW1ib2w7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBTeW1ib2wgJiYgU3ltYm9sW25hbWVdIHx8IChTeW1ib2wgfHwgcmVxdWlyZSgnLi8kLnVpZCcpKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59OyIsInZhciBjbGFzc29mICAgPSByZXF1aXJlKCcuLyQuY2xhc3NvZicpXG4gICwgSVRFUkFUT1IgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXG4gICwgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCAhPSB1bmRlZmluZWQpcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTsiLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLyQuYW4tb2JqZWN0JylcbiAgLCBnZXQgICAgICA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5jb3JlJykuZ2V0SXRlcmF0b3IgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBpdGVyRm4gPSBnZXQoaXQpO1xuICBpZih0eXBlb2YgaXRlckZuICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgaXRlcmFibGUhJyk7XG4gIHJldHVybiBhbk9iamVjdChpdGVyRm4uY2FsbChpdCkpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgc2V0VW5zY29wZSA9IHJlcXVpcmUoJy4vJC51bnNjb3BlJylcbiAgLCBzdGVwICAgICAgID0gcmVxdWlyZSgnLi8kLml0ZXItc3RlcCcpXG4gICwgSXRlcmF0b3JzICA9IHJlcXVpcmUoJy4vJC5pdGVyYXRvcnMnKVxuICAsIHRvSU9iamVjdCAgPSByZXF1aXJlKCcuLyQudG8taW9iamVjdCcpO1xuXG4vLyAyMi4xLjMuNCBBcnJheS5wcm90b3R5cGUuZW50cmllcygpXG4vLyAyMi4xLjMuMTMgQXJyYXkucHJvdG90eXBlLmtleXMoKVxuLy8gMjIuMS4zLjI5IEFycmF5LnByb3RvdHlwZS52YWx1ZXMoKVxuLy8gMjIuMS4zLjMwIEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuLyQuaXRlci1kZWZpbmUnKShBcnJheSwgJ0FycmF5JywgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICB0aGlzLl90ID0gdG9JT2JqZWN0KGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4gIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAvLyBraW5kXG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGtpbmQgID0gdGhpcy5fa1xuICAgICwgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKXtcbiAgICB0aGlzLl90ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiBzdGVwKDEpO1xuICB9XG4gIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgaW5kZXgpO1xuICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcbiAgcmV0dXJuIHN0ZXAoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xufSwgJ3ZhbHVlcycpO1xuXG4vLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xuXG5zZXRVbnNjb3BlKCdrZXlzJyk7XG5zZXRVbnNjb3BlKCd2YWx1ZXMnKTtcbnNldFVuc2NvcGUoJ2VudHJpZXMnKTsiLCIvLyAxOS4xLjIuNiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi8kLnRvLWlvYmplY3QnKTtcblxucmVxdWlyZSgnLi8kLm9iamVjdC1zYXAnKSgnZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJywgZnVuY3Rpb24oJGdldE93blByb3BlcnR5RGVzY3JpcHRvcil7XG4gIHJldHVybiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSl7XG4gICAgcmV0dXJuICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodG9JT2JqZWN0KGl0KSwga2V5KTtcbiAgfTtcbn0pOyIsIi8vIDE5LjEuMy4xOSBPYmplY3Quc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pXG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcbiRkZWYoJGRlZi5TLCAnT2JqZWN0Jywge3NldFByb3RvdHlwZU9mOiByZXF1aXJlKCcuLyQuc2V0LXByb3RvJykuc2V0fSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCAgPSByZXF1aXJlKCcuLyQuc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vJC5pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uKGl0ZXJhdGVkKXtcbiAgdGhpcy5fdCA9IFN0cmluZyhpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwgaW5kZXggPSB0aGlzLl9pXG4gICAgLCBwb2ludDtcbiAgaWYoaW5kZXggPj0gTy5sZW5ndGgpcmV0dXJuIHt2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHt2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlfTtcbn0pOyIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpO1xuSXRlcmF0b3JzLk5vZGVMaXN0ID0gSXRlcmF0b3JzLkhUTUxDb2xsZWN0aW9uID0gSXRlcmF0b3JzLkFycmF5OyJdfQ==
