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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9zbWFydC1mYWRlci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQXlCLGtCQUFrQjs7OztJQUd0Qix1QkFBdUI7Ozs7Ozs7Ozs7O0FBVTdCLFdBVk0sdUJBQXVCLENBVTVCLFlBQVksV0FBMEUsSUFBSSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFDO1FBQWxILGdDQUFnQyxnQ0FBRyxTQUFTO1FBQUUsVUFBVSxnQ0FBRyxXQUFXOzswQkFWL0UsdUJBQXVCOztBQVdwQywrQkFYYSx1QkFBdUIsNkNBVzlCLFlBQVksRUFBRSxnQ0FBZ0MsRUFBRTtBQUN0RCxRQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztBQUM5QixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixRQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztBQUMxQixRQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztBQUM5QixRQUFJLENBQUMsY0FBYyxHQUFHLGFBQWEsQ0FBQztHQUN2Qzs7WUFqQmdCLHVCQUF1Qjs7ZUFBdkIsdUJBQXVCOzs7Ozs7OztTQXVCMUIsVUFBQyxLQUFLLEVBQUM7QUFDakIsVUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7S0FDNUI7Ozs7OztTQUthLFlBQUU7QUFDWixhQUFPLElBQUksQ0FBQyxXQUFXLENBQUE7S0FDMUI7Ozs7Ozs7O1NBS21DLFVBQUMsS0FBSyxFQUFDLEVBRTFDOzs7Ozs7U0FLbUMsWUFBRTtBQUNsQyxhQUFPLGlDQUFpQyxDQUFDO0tBQzVDOzs7Ozs7Ozs7U0FNTyxVQUFDLEtBQUssRUFBQztBQUNYLFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0tBQ3RCOzs7Ozs7U0FLTyxZQUFFO0FBQ04sYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0tBQ3JCOzs7Ozs7Ozs7O1NBT1csVUFBQyxLQUFLLEVBQUM7QUFDZixVQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztLQUMxQjs7Ozs7O1NBS1csWUFBRTtBQUNWLGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztLQUN6Qjs7Ozs7Ozs7O1NBTWEsVUFBQyxLQUFLLEVBQUM7QUFDakIsVUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7S0FDNUI7Ozs7Ozs7U0FNYSxZQUFFO0FBQ1osYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0tBQzNCOzs7Ozs7Ozs7U0FNZ0IsVUFBQyxLQUFLLEVBQUM7QUFDcEIsVUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7S0FDL0I7Ozs7OztTQUtnQixZQUFFO0FBQ2YsYUFBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0tBQzlCOzs7U0E1R2dCLHVCQUF1Qjs7O3FCQUF2Qix1QkFBdUIiLCJmaWxlIjoibGliL3NtYXJ0LWZhZGVyL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0Tm9kZSBmcm9tICcuLi9jb3JlL2luZGV4LmpzJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNdWx0aWNoYW5uZWxTcGF0aWFsaXNlciBleHRlbmRzIEFic3RyYWN0Tm9kZSB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IGF1ZGlvQ29udGV4dCAtIGF1ZGlvQ29udGV4dCBpbnN0YW5jZS5cbiAgICAgKiBAcGFyYW0ge0F1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9ufSBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbiAtIGF1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9uLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBvdXRwdXRUeXBlIC0gb3V0cHV0IHR5cGUgXCJoZWFkcGhvbmVcIiBvciBcInNwZWFrZXJcIlxuICAgICAqIEBwYXJhbSB7SFJURn0gaHJ0ZiAtIGhydGYgQHRvZG8gdG8gYmUgZGVmaW5lZFxuICAgICAqIEBwYXJhbSB7RXFQcmVzZXR9IGVxUHJlc2V0IC0gZGlhbG9nIGdhaW4gQHRvZG8gdG8gYmUgZGVmaW5lZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBvZmZzZXRHYWluIC0gZ2FpbiBAdG9kbyB2YWx1ZSB0byBiZSBkZWZpbmVkXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxpc3RlbmluZ0F4aXMgLSBhbmdsZT8gQHRvZG8gdmFsdWUgdG8gYmUgZGVmaW5lZFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGF1ZGlvQ29udGV4dCwgYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24gPSB1bmRlZmluZWQsIG91dHB1dFR5cGUgPSAnaGVhZHBob25lJywgaHJ0ZiwgZXFQcmVzZXQsIG9mZnNldEdhaW4sIGxpc3RlbmluZ0F4aXMpe1xuICAgICAgICBzdXBlcihhdWRpb0NvbnRleHQsIGF1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9uKTtcbiAgICAgICAgdGhpcy5fb3V0cHV0VHlwZSA9IG91dHB1dFR5cGU7XG4gICAgICAgIHRoaXMuX2hydGYgPSBocnRmO1xuICAgICAgICB0aGlzLl9lcVByZXNldCA9IGVxUHJlc2V0O1xuICAgICAgICB0aGlzLl9vZmZzZXRHYWluID0gb2Zmc2V0R2FpbjtcbiAgICAgICAgdGhpcy5fbGlzdGVuaW5nQXhpcyA9IGxpc3RlbmluZ0F4aXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCBvdXRwdXRUeXBlOiAnaGVhZHBob25lJyBvciAnc3BlYWtlcicsICdtdWx0aWNhbmFsJ1xuICAgICAqIEB0b2RvOiBhdXRvbWF0aWMgZm9yICdtdWx0aWNhbmFsJyBldmVuIGlmIG5iIG9mIHNwZWFrZXIgJ3dyb25nJ1xuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgc2V0IG91dHB1dFR5cGUodmFsdWUpe1xuICAgICAgICB0aGlzLl9vdXRwdXRUeXBlID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCBvdXRwdXRUeXBlOiAnaGVhZHBob25lJyBvciAnc3BlYWtlcidcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldCBvdXRwdXRUeXBlKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9vdXRwdXRUeXBlXG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCBhdWRpbyBzdHJlYW1zIGRlc2NyaXB0aW9uIChqc29uKVxuICAgICAqIEB0eXBlIHtBdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbn1cbiAgICAgKi9cbiAgICBzZXQgYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24odmFsdWUpe1xuXG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCBhdWRpbyBzdHJlYW1zIGRlc2NyaXB0aW9uXG4gICAgICogQHR5cGUge0F1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9ufVxuICAgICAqL1xuICAgIGdldCBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbigpe1xuICAgICAgICByZXR1cm4gX2F1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9uO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgaHJ0ZlxuICAgICAqIEB0eXBlIHtIUlRGfVxuICAgICAqIEB0b2RvOiB3aGljaCBraW5kIG9mIHZhbHVlLCBqc29uP1xuICAgICAqL1xuICAgIHNldCBocnRmKHZhbHVlKXtcbiAgICAgICAgdGhpcy5faHJ0ZiA9IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgaHJ0ZlxuICAgICAqIEB0eXBlIHtIUlRGfVxuICAgICAqL1xuICAgIGdldCBocnRmKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9ocnRmO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgZXFQcmVzZXRcbiAgICAgKiBAdG9kbzogd2hpY2gga2luZCBvZiB2YWx1ZSwganNvbj9cbiAgICAgKiBAdG9kbzogc2V0IGl0IHRvIG5vbmUgdG8gbm90IGFwcHkgYW55IGVxP1xuICAgICAqIEB0eXBlIHtFcVByZXNldH1cbiAgICAgKi9cbiAgICBzZXQgZXFQcmVzZXQodmFsdWUpe1xuICAgICAgICB0aGlzLl9lcVByZXNldCA9IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgZXFQcmVzZXRcbiAgICAgKiBAdHlwZSB7RXFQcmVzZXR9XG4gICAgICovXG4gICAgZ2V0IGVxUHJlc2V0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9lcVByZXNldDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IG9mZnNldEdhaW5cbiAgICAgKiBAdG9kbyByYW5nZVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgc2V0IG9mZnNldEdhaW4odmFsdWUpe1xuICAgICAgICB0aGlzLl9vZmZzZXRHYWluID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCBvZmZzZXRHYWluXG4gICAgICogQHRvZG8gcmFuZ2VcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldCBvZmZzZXRHYWluKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9vZmZzZXRHYWluO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgbGlzdGVuaW5nQXhpc1xuICAgICAqIEB0b2RvIHZhbHVlIHR5cGU/IGFuZ2xlP1xuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgc2V0IGxpc3RlbmluZ0F4aXModmFsdWUpe1xuICAgICAgICB0aGlzLl9saXN0ZW5pbmdBeGlzID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCBsaXN0ZW5pbmdBeGlzXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBnZXQgbGlzdGVuaW5nQXhpcygpe1xuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdGVuaW5nQXhpcztcbiAgICB9XG59XG4iXX0=