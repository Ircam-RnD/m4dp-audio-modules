(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _Object$defineProperty = require("babel-runtime/core-js/object/define-property")["default"];

_Object$defineProperty(exports, "__esModule", {
    value: true
});

var AbstractNode = (function () {
    /**
     * AbstractNode constructor
     * Template for the projet audio nodes: audioContext reference, connect and disconnect methods
     * @param {AudioContext} audioContext - audioContext instance.
     */

    function AbstractNode(audioContext) {
        _classCallCheck(this, AbstractNode);

        this._audioContext = audioContext;
        this.input = this._audioContext.createGain();
        this._ouput = this._audioContext.createGain();
    }

    _createClass(AbstractNode, [{
        key: "connect",

        /**
         * Connect the audio node
         */
        value: function connect(node) {
            this._ouput.connect(node);
        }
    }, {
        key: "disconnect",

        /**
         * Disconnect the audio node
         */
        value: function disconnect(node) {
            this._ouput.disconnect(node);
        }
    }]);

    return AbstractNode;
})();

exports["default"] = AbstractNode;
module.exports = exports["default"];

},{"babel-runtime/core-js/object/define-property":9,"babel-runtime/helpers/class-call-check":12,"babel-runtime/helpers/create-class":13}],2:[function(require,module,exports){
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
     * Constructor
     * audioContext, audioStreamsDescription, mode, dialogGain
     */

    function DialogEnhancement(audioContext, audioStreamsDescription, mode, dialogGain) {
        _classCallCheck(this, DialogEnhancement);

        _get(Object.getPrototypeOf(DialogEnhancement.prototype), 'constructor', this).call(this, audioContext);
        this._mode = mode;
        this._audioStreamsDescription = audioStreamsDescription;
    }

    _inherits(DialogEnhancement, _AbstractNode);

    _createClass(DialogEnhancement, [{
        key: 'mode',

        /**
         * Set Mode
         * @param {number} value - 1, 2 or 3
         */
        set: function (value) {
            this._mode = value;
        },

        /**
         * Get Mode
         */
        get: function () {
            return this._mode;
        }
    }, {
        key: 'audioStreamsDescription',

        /**
         * Set audioStreamsDescription
         */
        set: function (value) {
            this._audioStreamsDescription = value;
        },

        /**
         * Get audioStreamsDescription
         */
        get: function () {
            return this._audioStreamsDescription;
        }
    }, {
        key: 'dialogGain',

        /**
         * Set dialogGain
         */
        set: function (value) {
            this._dialogGain = value;
        },

        /**
         * Get dialogGain
         */
        get: function () {
            return this._dialogGain;
        }
    }]);

    return DialogEnhancement;
})(_coreIndexJs2['default']);

exports['default'] = DialogEnhancement;
module.exports = exports['default'];

},{"../core/index.js":1,"babel-runtime/core-js/object/define-property":9,"babel-runtime/helpers/class-call-check":12,"babel-runtime/helpers/create-class":13,"babel-runtime/helpers/get":14,"babel-runtime/helpers/inherits":15,"babel-runtime/helpers/interop-require-default":16}],3:[function(require,module,exports){
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

var M4DPAudioModules = {
    'DialogEnhancement': _dialogEnhancementIndexJs2['default'],
    'MultichannelSpatialiser': _multichannelSpatialiserIndexJs2['default'],
    'NoiseAdaptation': _noiseAdaptationIndexJs2['default'],
    'ObjectSpatialiserAndMixer': _objectSpatialiserAndMixerIndexJs2['default'],
    'SmartFader': _smartFaderIndexJs2['default']
};

// @fix, Extra ugly, should use export default M4DPAudioModules;
window.M4DPAudioModules = M4DPAudioModules;

},{"./dialog-enhancement/index.js":2,"./multichannel-spatialiser/index.js":4,"./noise-adaptation/index.js":5,"./object-spatialiser-and-mixer/index.js":6,"./smart-fader/index.js":7,"babel-runtime/helpers/interop-require-default":16}],4:[function(require,module,exports){
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
    function MultichannelSpatialiser(audioContext, _x, _x2, hrtf, eqPreset, offsetGain, listeningAxis) {
        var outputType = arguments[1] === undefined ? 'headphone' : arguments[1];
        var audioStreamsDescription = arguments[2] === undefined ? {} : arguments[2];

        _classCallCheck(this, MultichannelSpatialiser);

        _get(Object.getPrototypeOf(MultichannelSpatialiser.prototype), 'constructor', this).call(this, audioContext);
        this._outputType = outputType;
        this._audioStreamsDescription = audioStreamsDescription;
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
         */
        set: function (value) {
            this._outputType = value;
        },

        /**
         * Get outputType: 'headphone' or 'speaker'
         */
        get: function () {
            return this._outputType;
        }
    }, {
        key: 'audioStreamsDescription',

        /**
         * Set audio streams description (json)
         */
        set: function (value) {},

        /**
         * Get audio streams description
         */
        get: function () {
            return _audioStreamsDescription;
        }
    }, {
        key: 'hrtf',

        /**
         * Set hrtf
         * @todo: which kind of value, json?
         */
        set: function (value) {
            this._hrtf = value;
        },

        /**
         * Get hrtf
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
         */
        set: function (value) {
            this._eqPreset = value;
        },

        /**
         * Get eqPreset
         */
        get: function () {
            return this._eqPreset;
        }
    }, {
        key: 'offsetGain',

        /**
         * Set offsetGain
         */
        set: function (value) {
            this._offsetGain = value;
        },

        /**
         * Get offsetGain
         */
        get: function () {
            return this._offsetGain;
        }
    }, {
        key: 'listeningAxis',

        /**
         * Set listeningAxis
         */
        set: function (value) {
            this._listeningAxis = value;
        },

        /**
         * Get listeningAxis
         */
        get: function () {
            return this._listeningAxis;
        }
    }]);

    return MultichannelSpatialiser;
})(_coreIndexJs2['default']);

exports['default'] = MultichannelSpatialiser;
module.exports = exports['default'];

},{"../core/index.js":1,"babel-runtime/core-js/object/define-property":9,"babel-runtime/helpers/class-call-check":12,"babel-runtime/helpers/create-class":13,"babel-runtime/helpers/get":14,"babel-runtime/helpers/inherits":15,"babel-runtime/helpers/interop-require-default":16}],5:[function(require,module,exports){
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
    function NoiseAdaptation(audioContext) {
        var headphone = arguments[1] === undefined ? false : arguments[1];

        _classCallCheck(this, NoiseAdaptation);

        _get(Object.getPrototypeOf(NoiseAdaptation.prototype), 'constructor', this).call(this, audioContext);
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
         * Set headphone
         * @param {boolean} value - true is headphone, else, false.
         */
        set: function (value) {
            this._headphone = value;
        },

        /**
         * Get headphone, return True if headphone is connected, else, false
         */
        get: function () {
            return this._headphone;
        }
    }]);

    return NoiseAdaptation;
})(_coreIndexJs2['default']);

exports['default'] = NoiseAdaptation;
module.exports = exports['default'];

},{"../core/index.js":1,"babel-runtime/core-js/object/define-property":9,"babel-runtime/helpers/class-call-check":12,"babel-runtime/helpers/create-class":13,"babel-runtime/helpers/get":14,"babel-runtime/helpers/inherits":15,"babel-runtime/helpers/interop-require-default":16}],6:[function(require,module,exports){
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
    function ObjectSpatialiserAndMixer(audioContext, _x, _x2, hrtf, eqPreset, offsetGain, listeningAxis) {
        var outputType = arguments[1] === undefined ? 'headphone' : arguments[1];
        var audioStreamsDescription = arguments[2] === undefined ? {} : arguments[2];

        _classCallCheck(this, ObjectSpatialiserAndMixer);

        _get(Object.getPrototypeOf(ObjectSpatialiserAndMixer.prototype), 'constructor', this).call(this, audioContext, outputType, audioStreamsDescription, hrtf, eqPreset, offsetGain, listeningAxis);
    }

    _inherits(ObjectSpatialiserAndMixer, _MultichannelSpatialiser);

    _createClass(ObjectSpatialiserAndMixer, [{
        key: 'setPosition',

        /*
         * Set the position of the sound
         */
        value: function setPosition(azimuth, elevation, distance) {
            this._azimuth = azimuth;
            this._elevation = elevation;
            this._distance = distance;
        }
    }, {
        key: 'getPosition',

        /*
         * Get the position of the sound
         */
        value: function getPosition() {
            return { 'azimuth': this._azimuth, 'elevation': this._elevation, 'distance': this._distance };
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

},{"../multichannel-spatialiser/index.js":4,"babel-runtime/core-js/object/define-property":9,"babel-runtime/helpers/class-call-check":12,"babel-runtime/helpers/create-class":13,"babel-runtime/helpers/get":14,"babel-runtime/helpers/inherits":15,"babel-runtime/helpers/interop-require-default":16}],7:[function(require,module,exports){
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
     * SmartFade constructor
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {number} db - db value for the SmartFader.
     * @param {number} loudness - loudness value.
     * @param {number} maxTruePeak - maxTruePeak value.
     */

    function SmartFader(audioContext) {
        var db = arguments[1] === undefined ? undefined : arguments[1];
        var loudness = arguments[2] === undefined ? undefined : arguments[2];
        var maxTruePeak = arguments[3] === undefined ? undefined : arguments[3];

        _classCallCheck(this, SmartFader);

        _get(Object.getPrototypeOf(SmartFader.prototype), 'constructor', this).call(this, audioContext);
        this._db = db;
        this._loudness = loudness;
        this._maxTruePeak = maxTruePeak;
        this._dynamicCompressionState = undefined;
    }

    _inherits(SmartFader, _AbstractNode);

    _createClass(SmartFader, [{
        key: 'db',

        /**
         * Set the db value
         */
        set: function (value) {
            this._db = value;
        },

        /**
         * Get the db value
         */
        get: function () {
            return this._db;
        }
    }, {
        key: 'loudness',

        /**
         * Set the loudness value
         */
        set: function (value) {
            this._loudness = value;
        },

        /**
         * Get the loudness value
         */
        get: function () {
            return this._loudness;
        }
    }, {
        key: 'maxTruePeak',

        /**
         * Set the MaxTruePeak value
         */
        set: function (value) {
            this._maxTruePeak = value;
        },

        /**
         * Get the MaxTruePeak value
         */
        get: function () {
            return this._maxTruePeak;
        }
    }, {
        key: 'dynamicCompressionState',

        /**
         * Get the dynamic compression state
         */
        get: function () {
            return this._dynamicCompressionState;
        }
    }, {
        key: '_process',
        value: function _process() {}
    }]);

    return SmartFader;
})(_coreIndexJs2['default']);

exports['default'] = SmartFader;
module.exports = exports['default'];

},{"../core/index.js":1,"babel-runtime/core-js/object/define-property":9,"babel-runtime/helpers/class-call-check":12,"babel-runtime/helpers/create-class":13,"babel-runtime/helpers/get":14,"babel-runtime/helpers/inherits":15,"babel-runtime/helpers/interop-require-default":16}],8:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":17}],9:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":18}],10:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-own-property-descriptor"), __esModule: true };
},{"core-js/library/fn/object/get-own-property-descriptor":19}],11:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":20}],12:[function(require,module,exports){
"use strict";

exports["default"] = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

exports.__esModule = true;
},{}],13:[function(require,module,exports){
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
},{"babel-runtime/core-js/object/define-property":9}],14:[function(require,module,exports){
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
},{"babel-runtime/core-js/object/get-own-property-descriptor":10}],15:[function(require,module,exports){
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
},{"babel-runtime/core-js/object/create":8,"babel-runtime/core-js/object/set-prototype-of":11}],16:[function(require,module,exports){
"use strict";

exports["default"] = function (obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
};

exports.__esModule = true;
},{}],17:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function create(P, D){
  return $.create(P, D);
};
},{"../../modules/$":32}],18:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function defineProperty(it, key, desc){
  return $.setDesc(it, key, desc);
};
},{"../../modules/$":32}],19:[function(require,module,exports){
var $ = require('../../modules/$');
require('../../modules/es6.object.get-own-property-descriptor');
module.exports = function getOwnPropertyDescriptor(it, key){
  return $.getDesc(it, key);
};
},{"../../modules/$":32,"../../modules/es6.object.get-own-property-descriptor":36}],20:[function(require,module,exports){
require('../../modules/es6.object.set-prototype-of');
module.exports = require('../../modules/$.core').Object.setPrototypeOf;
},{"../../modules/$.core":24,"../../modules/es6.object.set-prototype-of":37}],21:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],22:[function(require,module,exports){
var isObject = require('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":31}],23:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],24:[function(require,module,exports){
var core = module.exports = {version: '1.2.3'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],25:[function(require,module,exports){
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
},{"./$.a-function":21}],26:[function(require,module,exports){
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
},{"./$.core":24,"./$.global":29}],27:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],28:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],29:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],30:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./$.cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":23}],31:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],32:[function(require,module,exports){
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
},{}],33:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
module.exports = function(KEY, exec){
  var $def = require('./$.def')
    , fn   = (require('./$.core').Object || {})[KEY] || Object[KEY]
    , exp  = {};
  exp[KEY] = exec(fn);
  $def($def.S + $def.F * require('./$.fails')(function(){ fn(1); }), 'Object', exp);
};
},{"./$.core":24,"./$.def":26,"./$.fails":28}],34:[function(require,module,exports){
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
},{"./$":32,"./$.an-object":22,"./$.ctx":25,"./$.is-object":31}],35:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./$.iobject')
  , defined = require('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":27,"./$.iobject":30}],36:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./$.to-iobject');

require('./$.object-sap')('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./$.object-sap":33,"./$.to-iobject":35}],37:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $def = require('./$.def');
$def($def.S, 'Object', {setPrototypeOf: require('./$.set-proto').set});
},{"./$.def":26,"./$.set-proto":34}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2NvcmUvbGliL3NtYXJ0LWZhZGVyL2luZGV4LmpzIiwiZGlzdC9kaWFsb2ctZW5oYW5jZW1lbnQvbGliL3NtYXJ0LWZhZGVyL2luZGV4LmpzIiwiZGlzdC9saWIvc21hcnQtZmFkZXIvaW5kZXguanMiLCJkaXN0L211bHRpY2hhbm5lbC1zcGF0aWFsaXNlci9saWIvc21hcnQtZmFkZXIvaW5kZXguanMiLCJkaXN0L25vaXNlLWFkYXB0YXRpb24vbGliL3NtYXJ0LWZhZGVyL2luZGV4LmpzIiwiZGlzdC9vYmplY3Qtc3BhdGlhbGlzZXItYW5kLW1peGVyL2xpYi9zbWFydC1mYWRlci9pbmRleC5qcyIsImRpc3Qvc21hcnQtZmFkZXIvbGliL3NtYXJ0LWZhZGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZGVmaW5lLXByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3Qvc2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3MtY2FsbC1jaGVjay5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlLWNsYXNzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9nZXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2luaGVyaXRzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbnRlcm9wLXJlcXVpcmUtZGVmYXVsdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2NyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2dldC1vd24tcHJvcGVydHktZGVzY3JpcHRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L3NldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY29mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmN0eC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmRlZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmRlZmluZWQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5mYWlscy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmdsb2JhbC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmlvYmplY3QuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLm9iamVjdC1zYXAuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zZXQtcHJvdG8uanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC50by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFB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QUE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEFic3RyYWN0Tm9kZSB7XG4gICAgLyoqXG4gICAgICogQWJzdHJhY3ROb2RlIGNvbnN0cnVjdG9yXG4gICAgICogVGVtcGxhdGUgZm9yIHRoZSBwcm9qZXQgYXVkaW8gbm9kZXM6IGF1ZGlvQ29udGV4dCByZWZlcmVuY2UsIGNvbm5lY3QgYW5kIGRpc2Nvbm5lY3QgbWV0aG9kc1xuICAgICAqIEBwYXJhbSB7QXVkaW9Db250ZXh0fSBhdWRpb0NvbnRleHQgLSBhdWRpb0NvbnRleHQgaW5zdGFuY2UuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoYXVkaW9Db250ZXh0KXtcbiAgICAgICAgdGhpcy5fYXVkaW9Db250ZXh0ID0gYXVkaW9Db250ZXh0O1xuICAgICAgICB0aGlzLmlucHV0ID0gdGhpcy5fYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICAgICAgdGhpcy5fb3VwdXQgPSB0aGlzLl9hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb25uZWN0IHRoZSBhdWRpbyBub2RlXG4gICAgICovXG4gICAgY29ubmVjdChub2RlKXtcbiAgICAgICAgdGhpcy5fb3VwdXQuY29ubmVjdChub2RlKVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBEaXNjb25uZWN0IHRoZSBhdWRpbyBub2RlXG4gICAgICovXG4gICAgZGlzY29ubmVjdChub2RlKXtcbiAgICAgICAgdGhpcy5fb3VwdXQuZGlzY29ubmVjdChub2RlKVxuICAgIH1cbn1cbiIsImltcG9ydCBBYnN0cmFjdE5vZGUgZnJvbSAnLi4vY29yZS9pbmRleC5qcyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlhbG9nRW5oYW5jZW1lbnQgZXh0ZW5kcyBBYnN0cmFjdE5vZGUge1xuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yXG4gICAgICogYXVkaW9Db250ZXh0LCBhdWRpb1N0cmVhbXNEZXNjcmlwdGlvbiwgbW9kZSwgZGlhbG9nR2FpblxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGF1ZGlvQ29udGV4dCwgYXVkaW9TdHJlYW1zRGVzY3JpcHRpb24sIG1vZGUsIGRpYWxvZ0dhaW4pe1xuICAgICAgICBzdXBlcihhdWRpb0NvbnRleHQpO1xuICAgICAgICB0aGlzLl9tb2RlID0gbW9kZTtcbiAgICAgICAgdGhpcy5fYXVkaW9TdHJlYW1zRGVzY3JpcHRpb24gPSBhdWRpb1N0cmVhbXNEZXNjcmlwdGlvbjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IE1vZGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSAxLCAyIG9yIDNcbiAgICAgKi9cbiAgICBzZXQgbW9kZSh2YWx1ZSl7XG4gICAgICAgIHRoaXMuX21vZGUgPSB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IE1vZGVcbiAgICAgKi9cbiAgICBnZXQgbW9kZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fbW9kZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IGF1ZGlvU3RyZWFtc0Rlc2NyaXB0aW9uXG4gICAgICovXG4gICAgc2V0IGF1ZGlvU3RyZWFtc0Rlc2NyaXB0aW9uKHZhbHVlKXtcbiAgICAgICAgdGhpcy5fYXVkaW9TdHJlYW1zRGVzY3JpcHRpb24gPSB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IGF1ZGlvU3RyZWFtc0Rlc2NyaXB0aW9uXG4gICAgICovXG4gICAgZ2V0IGF1ZGlvU3RyZWFtc0Rlc2NyaXB0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9hdWRpb1N0cmVhbXNEZXNjcmlwdGlvbjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IGRpYWxvZ0dhaW5cbiAgICAgKi9cbiAgICBzZXQgZGlhbG9nR2Fpbih2YWx1ZSl7XG4gICAgICAgIHRoaXMuX2RpYWxvZ0dhaW4gPSB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IGRpYWxvZ0dhaW5cbiAgICAgKi9cbiAgICBnZXQgZGlhbG9nR2Fpbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fZGlhbG9nR2FpbjtcbiAgICB9XG59XG4iLCJpbXBvcnQgRGlhbG9nRW5oYW5jZW1lbnQgZnJvbSAnLi9kaWFsb2ctZW5oYW5jZW1lbnQvaW5kZXguanMnO1xuaW1wb3J0IE11bHRpY2hhbm5lbFNwYXRpYWxpc2VyIGZyb20gJy4vbXVsdGljaGFubmVsLXNwYXRpYWxpc2VyL2luZGV4LmpzJztcbmltcG9ydCBOb2lzZUFkYXB0YXRpb24gZnJvbSAnLi9ub2lzZS1hZGFwdGF0aW9uL2luZGV4LmpzJztcbmltcG9ydCBPYmplY3RTcGF0aWFsaXNlckFuZE1peGVyIGZyb20gJy4vb2JqZWN0LXNwYXRpYWxpc2VyLWFuZC1taXhlci9pbmRleC5qcyc7XG5pbXBvcnQgU21hcnRGYWRlciBmcm9tICcuL3NtYXJ0LWZhZGVyL2luZGV4LmpzJztcblxuXG5jb25zdCBNNERQQXVkaW9Nb2R1bGVzID0ge1xuICAgIFwiRGlhbG9nRW5oYW5jZW1lbnRcIjogRGlhbG9nRW5oYW5jZW1lbnQsXG4gICAgXCJNdWx0aWNoYW5uZWxTcGF0aWFsaXNlclwiOiBNdWx0aWNoYW5uZWxTcGF0aWFsaXNlcixcbiAgICBcIk5vaXNlQWRhcHRhdGlvblwiOiBOb2lzZUFkYXB0YXRpb24sXG4gICAgXCJPYmplY3RTcGF0aWFsaXNlckFuZE1peGVyXCI6IE9iamVjdFNwYXRpYWxpc2VyQW5kTWl4ZXIsXG4gICAgXCJTbWFydEZhZGVyXCI6IFNtYXJ0RmFkZXJcbn07XG5cbi8vIEBmaXgsIEV4dHJhIHVnbHksIHNob3VsZCB1c2UgZXhwb3J0IGRlZmF1bHQgTTREUEF1ZGlvTW9kdWxlcztcbndpbmRvdy5NNERQQXVkaW9Nb2R1bGVzID0gTTREUEF1ZGlvTW9kdWxlcztcblxuXG5cbiIsImltcG9ydCBBYnN0cmFjdE5vZGUgZnJvbSAnLi4vY29yZS9pbmRleC5qcyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXVsdGljaGFubmVsU3BhdGlhbGlzZXIgZXh0ZW5kcyBBYnN0cmFjdE5vZGUge1xuICAgIGNvbnN0cnVjdG9yKGF1ZGlvQ29udGV4dCwgb3V0cHV0VHlwZSA9ICdoZWFkcGhvbmUnLCBhdWRpb1N0cmVhbXNEZXNjcmlwdGlvbiA9IHt9LCBocnRmLCBlcVByZXNldCwgb2Zmc2V0R2FpbiwgbGlzdGVuaW5nQXhpcyl7XG4gICAgICAgIHN1cGVyKGF1ZGlvQ29udGV4dCk7XG4gICAgICAgIHRoaXMuX291dHB1dFR5cGUgPSBvdXRwdXRUeXBlO1xuICAgICAgICB0aGlzLl9hdWRpb1N0cmVhbXNEZXNjcmlwdGlvbiA9IGF1ZGlvU3RyZWFtc0Rlc2NyaXB0aW9uO1xuICAgICAgICB0aGlzLl9ocnRmID0gaHJ0ZjtcbiAgICAgICAgdGhpcy5fZXFQcmVzZXQgPSBlcVByZXNldDtcbiAgICAgICAgdGhpcy5fb2Zmc2V0R2FpbiA9IG9mZnNldEdhaW47XG4gICAgICAgIHRoaXMuX2xpc3RlbmluZ0F4aXMgPSBsaXN0ZW5pbmdBeGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgb3V0cHV0VHlwZTogJ2hlYWRwaG9uZScgb3IgJ3NwZWFrZXInLCAnbXVsdGljYW5hbCdcbiAgICAgKiBAdG9kbzogYXV0b21hdGljIGZvciAnbXVsdGljYW5hbCcgZXZlbiBpZiBuYiBvZiBzcGVha2VyICd3cm9uZydcbiAgICAgKi9cbiAgICBzZXQgb3V0cHV0VHlwZSh2YWx1ZSl7XG4gICAgICAgIHRoaXMuX291dHB1dFR5cGUgPSB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IG91dHB1dFR5cGU6ICdoZWFkcGhvbmUnIG9yICdzcGVha2VyJ1xuICAgICAqL1xuICAgIGdldCBvdXRwdXRUeXBlKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9vdXRwdXRUeXBlXG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCBhdWRpbyBzdHJlYW1zIGRlc2NyaXB0aW9uIChqc29uKVxuICAgICAqL1xuICAgIHNldCBhdWRpb1N0cmVhbXNEZXNjcmlwdGlvbih2YWx1ZSl7XG5cbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IGF1ZGlvIHN0cmVhbXMgZGVzY3JpcHRpb25cbiAgICAgKi9cbiAgICBnZXQgYXVkaW9TdHJlYW1zRGVzY3JpcHRpb24oKXtcbiAgICAgICAgcmV0dXJuIF9hdWRpb1N0cmVhbXNEZXNjcmlwdGlvbjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IGhydGZcbiAgICAgKiBAdG9kbzogd2hpY2gga2luZCBvZiB2YWx1ZSwganNvbj9cbiAgICAgKi9cbiAgICBzZXQgaHJ0Zih2YWx1ZSl7XG4gICAgICAgIHRoaXMuX2hydGYgPSB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IGhydGZcbiAgICAgKi9cbiAgICBnZXQgaHJ0Zigpe1xuICAgICAgICByZXR1cm4gdGhpcy5faHJ0ZjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IGVxUHJlc2V0XG4gICAgICogQHRvZG86IHdoaWNoIGtpbmQgb2YgdmFsdWUsIGpzb24/XG4gICAgICogQHRvZG86IHNldCBpdCB0byBub25lIHRvIG5vdCBhcHB5IGFueSBlcT9cbiAgICAgKi9cbiAgICBzZXQgZXFQcmVzZXQodmFsdWUpe1xuICAgICAgICB0aGlzLl9lcVByZXNldCA9IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgZXFQcmVzZXRcbiAgICAgKi9cbiAgICBnZXQgZXFQcmVzZXQoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VxUHJlc2V0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgb2Zmc2V0R2FpblxuICAgICAqL1xuICAgIHNldCBvZmZzZXRHYWluKHZhbHVlKXtcbiAgICAgICAgdGhpcy5fb2Zmc2V0R2FpbiA9IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgb2Zmc2V0R2FpblxuICAgICAqL1xuICAgIGdldCBvZmZzZXRHYWluKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9vZmZzZXRHYWluO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgbGlzdGVuaW5nQXhpc1xuICAgICAqL1xuICAgIHNldCBsaXN0ZW5pbmdBeGlzKHZhbHVlKXtcbiAgICAgICAgdGhpcy5fbGlzdGVuaW5nQXhpcyA9IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgbGlzdGVuaW5nQXhpc1xuICAgICAqL1xuICAgIGdldCBsaXN0ZW5pbmdBeGlzKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0ZW5pbmdBeGlzO1xuICAgIH1cbn1cbiIsImltcG9ydCBBYnN0cmFjdE5vZGUgZnJvbSAnLi4vY29yZS9pbmRleC5qcyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm9pc2VBZGFwdGF0aW9uIGV4dGVuZHMgQWJzdHJhY3ROb2RlIHtcbiAgICBjb25zdHJ1Y3RvcihhdWRpb0NvbnRleHQsIGhlYWRwaG9uZSA9IGZhbHNlKXtcbiAgICAgICAgc3VwZXIoYXVkaW9Db250ZXh0KTtcbiAgICAgICAgdGhpcy5faGVhZHBob25lID0gaGVhZHBob25lO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQcm9jZXNzOlxuICAgICAqIEB0b2RvOiB0cmFjayBub2lzZSwgYWRkIGNvbXByZXNzaW9uLCBpbXByb3ZlIHZvaWNlIGlmIG5vIGhlYWRwaG9uZVxuICAgICAqL1xuICAgIF9wcm9jZXNzKCl7XG5cbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IGhlYWRwaG9uZVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gdmFsdWUgLSB0cnVlIGlzIGhlYWRwaG9uZSwgZWxzZSwgZmFsc2UuXG4gICAgICovXG4gICAgc2V0IGhlYWRwaG9uZSh2YWx1ZSl7XG4gICAgICAgIHRoaXMuX2hlYWRwaG9uZSA9IHZhbHVlXG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCBoZWFkcGhvbmUsIHJldHVybiBUcnVlIGlmIGhlYWRwaG9uZSBpcyBjb25uZWN0ZWQsIGVsc2UsIGZhbHNlXG4gICAgICovXG4gICAgZ2V0IGhlYWRwaG9uZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5faGVhZHBob25lO1xuICAgIH1cbn1cbiIsImltcG9ydCBNdWx0aWNoYW5uZWxTcGF0aWFsaXNlciBmcm9tICcuLi9tdWx0aWNoYW5uZWwtc3BhdGlhbGlzZXIvaW5kZXguanMnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9iamVjdFNwYXRpYWxpc2VyQW5kTWl4ZXIgZXh0ZW5kcyBNdWx0aWNoYW5uZWxTcGF0aWFsaXNlciB7XG4gICAgY29uc3RydWN0b3IoYXVkaW9Db250ZXh0LCBvdXRwdXRUeXBlID0gJ2hlYWRwaG9uZScsIGF1ZGlvU3RyZWFtc0Rlc2NyaXB0aW9uID0ge30sIGhydGYsIGVxUHJlc2V0LCBvZmZzZXRHYWluLCBsaXN0ZW5pbmdBeGlzKXtcbiAgICAgICAgc3VwZXIoYXVkaW9Db250ZXh0LCBvdXRwdXRUeXBlLCBhdWRpb1N0cmVhbXNEZXNjcmlwdGlvbiwgaHJ0ZiwgZXFQcmVzZXQsIG9mZnNldEdhaW4sIGxpc3RlbmluZ0F4aXMpO1xuICAgIH1cbiAgICAvKlxuICAgICAqIFNldCB0aGUgcG9zaXRpb24gb2YgdGhlIHNvdW5kXG4gICAgICovXG4gICAgc2V0UG9zaXRpb24oYXppbXV0aCwgZWxldmF0aW9uLCBkaXN0YW5jZSl7XG4gICAgICAgIHRoaXMuX2F6aW11dGggPSBhemltdXRoO1xuICAgICAgICB0aGlzLl9lbGV2YXRpb24gPSBlbGV2YXRpb247XG4gICAgICAgIHRoaXMuX2Rpc3RhbmNlID0gZGlzdGFuY2U7XG4gICAgfVxuICAgIC8qXG4gICAgICogR2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgc291bmRcbiAgICAgKi9cbiAgICBnZXRQb3NpdGlvbigpe1xuICAgICAgICByZXR1cm4geydhemltdXRoJzogdGhpcy5fYXppbXV0aCwgJ2VsZXZhdGlvbic6IHRoaXMuX2VsZXZhdGlvbiwgJ2Rpc3RhbmNlJzogdGhpcy5fZGlzdGFuY2V9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQcm9jZXNzOiBcInBvc2l0aW9uXCIgKyBcImdhaW5cIlxuICAgICAqIEB0b2RvOiBob3cgdG8gYXV0b21hdGljYWxseSBzZXQgdGhlIGdhaW4sIGhvdyB0byBoYXZlIFJNUyBmcm9tIFwidGhlIG90aGVyIHNpZ25hbFwiIGhlcmVcbiAgICAgKi9cbiAgICAgX3Byb2Nlc3MoKXtcbiAgICAgfVxufVxuIiwiaW1wb3J0IEFic3RyYWN0Tm9kZSBmcm9tICcuLi9jb3JlL2luZGV4LmpzJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTbWFydEZhZGVyIGV4dGVuZHMgQWJzdHJhY3ROb2RlIHtcbiAgICAvKipcbiAgICAgKiBTbWFydEZhZGUgY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge0F1ZGlvQ29udGV4dH0gYXVkaW9Db250ZXh0IC0gYXVkaW9Db250ZXh0IGluc3RhbmNlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkYiAtIGRiIHZhbHVlIGZvciB0aGUgU21hcnRGYWRlci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG91ZG5lc3MgLSBsb3VkbmVzcyB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4VHJ1ZVBlYWsgLSBtYXhUcnVlUGVhayB2YWx1ZS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihhdWRpb0NvbnRleHQsIGRiID0gdW5kZWZpbmVkLCBsb3VkbmVzcyA9IHVuZGVmaW5lZCwgbWF4VHJ1ZVBlYWsgPSB1bmRlZmluZWQpe1xuICAgICAgICBzdXBlcihhdWRpb0NvbnRleHQpO1xuICAgICAgICB0aGlzLl9kYiA9IGRiO1xuICAgICAgICB0aGlzLl9sb3VkbmVzcyA9IGxvdWRuZXNzO1xuICAgICAgICB0aGlzLl9tYXhUcnVlUGVhayA9IG1heFRydWVQZWFrO1xuICAgICAgICB0aGlzLl9keW5hbWljQ29tcHJlc3Npb25TdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBkYiB2YWx1ZVxuICAgICAqL1xuICAgIHNldCBkYih2YWx1ZSl7XG4gICAgICAgIHRoaXMuX2RiID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgZGIgdmFsdWVcbiAgICAgKi9cbiAgICBnZXQgZGIoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RiO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIGxvdWRuZXNzIHZhbHVlXG4gICAgICovXG4gICAgc2V0IGxvdWRuZXNzKHZhbHVlKXtcbiAgICAgICAgdGhpcy5fbG91ZG5lc3MgPSB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBsb3VkbmVzcyB2YWx1ZVxuICAgICAqL1xuICAgIGdldCBsb3VkbmVzcygpe1xuICAgICAgICByZXR1cm4gdGhpcy5fbG91ZG5lc3NcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBNYXhUcnVlUGVhayB2YWx1ZVxuICAgICAqL1xuICAgIHNldCBtYXhUcnVlUGVhayh2YWx1ZSl7XG4gICAgICAgIHRoaXMuX21heFRydWVQZWFrID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgTWF4VHJ1ZVBlYWsgdmFsdWVcbiAgICAgKi9cbiAgICBnZXQgbWF4VHJ1ZVBlYWsoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21heFRydWVQZWFrO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGR5bmFtaWMgY29tcHJlc3Npb24gc3RhdGVcbiAgICAgKi9cbiAgICBnZXQgZHluYW1pY0NvbXByZXNzaW9uU3RhdGUoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2R5bmFtaWNDb21wcmVzc2lvblN0YXRlO1xuICAgIH1cbiAgICBfcHJvY2Vzcygpe1xuXG4gICAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9jcmVhdGVcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9zZXQtcHJvdG90eXBlLW9mXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn07XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfT2JqZWN0JGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZGVmaW5lLXByb3BlcnR5XCIpW1wiZGVmYXVsdFwiXTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSAoZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcblxuICAgICAgX09iamVjdCRkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9O1xufSkoKTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9PYmplY3QkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yXCIpW1wiZGVmYXVsdFwiXTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBmdW5jdGlvbiBnZXQoX3gsIF94MiwgX3gzKSB7XG4gIHZhciBfYWdhaW4gPSB0cnVlO1xuXG4gIF9mdW5jdGlvbjogd2hpbGUgKF9hZ2Fpbikge1xuICAgIHZhciBvYmplY3QgPSBfeCxcbiAgICAgICAgcHJvcGVydHkgPSBfeDIsXG4gICAgICAgIHJlY2VpdmVyID0gX3gzO1xuICAgIGRlc2MgPSBwYXJlbnQgPSBnZXR0ZXIgPSB1bmRlZmluZWQ7XG4gICAgX2FnYWluID0gZmFsc2U7XG4gICAgaWYgKG9iamVjdCA9PT0gbnVsbCkgb2JqZWN0ID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4gICAgdmFyIGRlc2MgPSBfT2JqZWN0JGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTtcblxuICAgIGlmIChkZXNjID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBwYXJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3ggPSBwYXJlbnQ7XG4gICAgICAgIF94MiA9IHByb3BlcnR5O1xuICAgICAgICBfeDMgPSByZWNlaXZlcjtcbiAgICAgICAgX2FnYWluID0gdHJ1ZTtcbiAgICAgICAgY29udGludWUgX2Z1bmN0aW9uO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MpIHtcbiAgICAgIHJldHVybiBkZXNjLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7XG5cbiAgICAgIGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9PYmplY3QkY3JlYXRlID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvY3JlYXRlXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9PYmplY3Qkc2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9zZXQtcHJvdG90eXBlLW9mXCIpW1wiZGVmYXVsdFwiXTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBmdW5jdGlvbiAoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpO1xuICB9XG5cbiAgc3ViQ2xhc3MucHJvdG90eXBlID0gX09iamVjdCRjcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIF9PYmplY3Qkc2V0UHJvdG90eXBlT2YgPyBfT2JqZWN0JHNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG59O1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICBcImRlZmF1bHRcIjogb2JqXG4gIH07XG59O1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsInZhciAkID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZShQLCBEKXtcbiAgcmV0dXJuICQuY3JlYXRlKFAsIEQpO1xufTsiLCJ2YXIgJCA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvJCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBkZXNjKXtcbiAgcmV0dXJuICQuc2V0RGVzYyhpdCwga2V5LCBkZXNjKTtcbn07IiwidmFyICQgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzLyQnKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpe1xuICByZXR1cm4gJC5nZXREZXNjKGl0LCBrZXkpO1xufTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzLyQuY29yZScpLk9iamVjdC5zZXRQcm90b3R5cGVPZjsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoIWlzT2JqZWN0KGl0KSl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07IiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTsiLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0ge3ZlcnNpb246ICcxLjIuMyd9O1xuaWYodHlwZW9mIF9fZSA9PSAnbnVtYmVyJylfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi8kLmEtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRoYXQsIGxlbmd0aCl7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmKHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XG4gIHN3aXRjaChsZW5ndGgpe1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07IiwidmFyIGdsb2JhbCAgICA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKVxuICAsIGNvcmUgICAgICA9IHJlcXVpcmUoJy4vJC5jb3JlJylcbiAgLCBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcbnZhciBjdHggPSBmdW5jdGlvbihmbiwgdGhhdCl7XG4gIHJldHVybiBmdW5jdGlvbigpe1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufTtcbnZhciAkZGVmID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgc291cmNlKXtcbiAgdmFyIGtleSwgb3duLCBvdXQsIGV4cFxuICAgICwgaXNHbG9iYWwgPSB0eXBlICYgJGRlZi5HXG4gICAgLCBpc1Byb3RvICA9IHR5cGUgJiAkZGVmLlBcbiAgICAsIHRhcmdldCAgID0gaXNHbG9iYWwgPyBnbG9iYWwgOiB0eXBlICYgJGRlZi5TXG4gICAgICAgID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXVxuICAgICwgZXhwb3J0cyAgPSBpc0dsb2JhbCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xuICBpZihpc0dsb2JhbClzb3VyY2UgPSBuYW1lO1xuICBmb3Ioa2V5IGluIHNvdXJjZSl7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gISh0eXBlICYgJGRlZi5GKSAmJiB0YXJnZXQgJiYga2V5IGluIHRhcmdldDtcbiAgICBpZihvd24gJiYga2V5IGluIGV4cG9ydHMpY29udGludWU7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSBvd24gPyB0YXJnZXRba2V5XSA6IHNvdXJjZVtrZXldO1xuICAgIC8vIHByZXZlbnQgZ2xvYmFsIHBvbGx1dGlvbiBmb3IgbmFtZXNwYWNlc1xuICAgIGlmKGlzR2xvYmFsICYmIHR5cGVvZiB0YXJnZXRba2V5XSAhPSAnZnVuY3Rpb24nKWV4cCA9IHNvdXJjZVtrZXldO1xuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgZWxzZSBpZih0eXBlICYgJGRlZi5CICYmIG93billeHAgPSBjdHgob3V0LCBnbG9iYWwpO1xuICAgIC8vIHdyYXAgZ2xvYmFsIGNvbnN0cnVjdG9ycyBmb3IgcHJldmVudCBjaGFuZ2UgdGhlbSBpbiBsaWJyYXJ5XG4gICAgZWxzZSBpZih0eXBlICYgJGRlZi5XICYmIHRhcmdldFtrZXldID09IG91dCkhZnVuY3Rpb24oQyl7XG4gICAgICBleHAgPSBmdW5jdGlvbihwYXJhbSl7XG4gICAgICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgQyA/IG5ldyBDKHBhcmFtKSA6IEMocGFyYW0pO1xuICAgICAgfTtcbiAgICAgIGV4cFtQUk9UT1RZUEVdID0gQ1tQUk9UT1RZUEVdO1xuICAgIH0ob3V0KTtcbiAgICBlbHNlIGV4cCA9IGlzUHJvdG8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXhwb3J0XG4gICAgZXhwb3J0c1trZXldID0gZXhwO1xuICAgIGlmKGlzUHJvdG8pKGV4cG9ydHNbUFJPVE9UWVBFXSB8fCAoZXhwb3J0c1tQUk9UT1RZUEVdID0ge30pKVtrZXldID0gb3V0O1xuICB9XG59O1xuLy8gdHlwZSBiaXRtYXBcbiRkZWYuRiA9IDE7ICAvLyBmb3JjZWRcbiRkZWYuRyA9IDI7ICAvLyBnbG9iYWxcbiRkZWYuUyA9IDQ7ICAvLyBzdGF0aWNcbiRkZWYuUCA9IDg7ICAvLyBwcm90b1xuJGRlZi5CID0gMTY7IC8vIGJpbmRcbiRkZWYuVyA9IDMyOyAvLyB3cmFwXG5tb2R1bGUuZXhwb3J0cyA9ICRkZWY7IiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59OyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGYgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYodHlwZW9mIF9fZyA9PSAnbnVtYmVyJylfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vJC5jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59OyIsInZhciAkT2JqZWN0ID0gT2JqZWN0O1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZTogICAgICRPYmplY3QuY3JlYXRlLFxuICBnZXRQcm90bzogICAkT2JqZWN0LmdldFByb3RvdHlwZU9mLFxuICBpc0VudW06ICAgICB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZSxcbiAgZ2V0RGVzYzogICAgJE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIHNldERlc2M6ICAgICRPYmplY3QuZGVmaW5lUHJvcGVydHksXG4gIHNldERlc2NzOiAgICRPYmplY3QuZGVmaW5lUHJvcGVydGllcyxcbiAgZ2V0S2V5czogICAgJE9iamVjdC5rZXlzLFxuICBnZXROYW1lczogICAkT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMsXG4gIGdldFN5bWJvbHM6ICRPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzLFxuICBlYWNoOiAgICAgICBbXS5mb3JFYWNoXG59OyIsIi8vIG1vc3QgT2JqZWN0IG1ldGhvZHMgYnkgRVM2IHNob3VsZCBhY2NlcHQgcHJpbWl0aXZlc1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihLRVksIGV4ZWMpe1xuICB2YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAgICwgZm4gICA9IChyZXF1aXJlKCcuLyQuY29yZScpLk9iamVjdCB8fCB7fSlbS0VZXSB8fCBPYmplY3RbS0VZXVxuICAgICwgZXhwICA9IHt9O1xuICBleHBbS0VZXSA9IGV4ZWMoZm4pO1xuICAkZGVmKCRkZWYuUyArICRkZWYuRiAqIHJlcXVpcmUoJy4vJC5mYWlscycpKGZ1bmN0aW9uKCl7IGZuKDEpOyB9KSwgJ09iamVjdCcsIGV4cCk7XG59OyIsIi8vIFdvcmtzIHdpdGggX19wcm90b19fIG9ubHkuIE9sZCB2OCBjYW4ndCB3b3JrIHdpdGggbnVsbCBwcm90byBvYmplY3RzLlxuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cbnZhciBnZXREZXNjICA9IHJlcXVpcmUoJy4vJCcpLmdldERlc2NcbiAgLCBpc09iamVjdCA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKVxuICAsIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpO1xudmFyIGNoZWNrID0gZnVuY3Rpb24oTywgcHJvdG8pe1xuICBhbk9iamVjdChPKTtcbiAgaWYoIWlzT2JqZWN0KHByb3RvKSAmJiBwcm90byAhPT0gbnVsbCl0aHJvdyBUeXBlRXJyb3IocHJvdG8gKyBcIjogY2FuJ3Qgc2V0IGFzIHByb3RvdHlwZSFcIik7XG59O1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8ICgnX19wcm90b19fJyBpbiB7fSA/IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICBmdW5jdGlvbih0ZXN0LCBidWdneSwgc2V0KXtcbiAgICAgIHRyeSB7XG4gICAgICAgIHNldCA9IHJlcXVpcmUoJy4vJC5jdHgnKShGdW5jdGlvbi5jYWxsLCBnZXREZXNjKE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nKS5zZXQsIDIpO1xuICAgICAgICBzZXQodGVzdCwgW10pO1xuICAgICAgICBidWdneSA9ICEodGVzdCBpbnN0YW5jZW9mIEFycmF5KTtcbiAgICAgIH0gY2F0Y2goZSl7IGJ1Z2d5ID0gdHJ1ZTsgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKE8sIHByb3RvKXtcbiAgICAgICAgY2hlY2soTywgcHJvdG8pO1xuICAgICAgICBpZihidWdneSlPLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgICAgICBlbHNlIHNldChPLCBwcm90byk7XG4gICAgICAgIHJldHVybiBPO1xuICAgICAgfTtcbiAgICB9KHt9LCBmYWxzZSkgOiB1bmRlZmluZWQpLFxuICBjaGVjazogY2hlY2tcbn07IiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vJC5pb2JqZWN0JylcbiAgLCBkZWZpbmVkID0gcmVxdWlyZSgnLi8kLmRlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gSU9iamVjdChkZWZpbmVkKGl0KSk7XG59OyIsIi8vIDE5LjEuMi42IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuLyQudG8taW9iamVjdCcpO1xuXG5yZXF1aXJlKCcuLyQub2JqZWN0LXNhcCcpKCdnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3InLCBmdW5jdGlvbigkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKXtcbiAgcmV0dXJuIGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KXtcbiAgICByZXR1cm4gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0b0lPYmplY3QoaXQpLCBrZXkpO1xuICB9O1xufSk7IiwiLy8gMTkuMS4zLjE5IE9iamVjdC5zZXRQcm90b3R5cGVPZihPLCBwcm90bylcbnZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xuJGRlZigkZGVmLlMsICdPYmplY3QnLCB7c2V0UHJvdG90eXBlT2Y6IHJlcXVpcmUoJy4vJC5zZXQtcHJvdG8nKS5zZXR9KTsiXX0=
