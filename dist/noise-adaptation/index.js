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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9zbWFydC1mYWRlci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQXlCLGtCQUFrQjs7OztJQUd0QixlQUFlOzs7Ozs7O0FBTXJCLFdBTk0sZUFBZSxDQU1wQixZQUFZLEVBQUUsZ0NBQWdDLEVBQW9CO1FBQWxCLFNBQVMsZ0NBQUcsS0FBSzs7MEJBTjVELGVBQWU7O0FBTzVCLCtCQVBhLGVBQWUsNkNBT3RCLFlBQVksRUFBRSxnQ0FBZ0MsRUFBRTtBQUN0RCxRQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztHQUMvQjs7WUFUZ0IsZUFBZTs7ZUFBZixlQUFlOzs7Ozs7O1dBY3hCLG9CQUFFLEVBRVQ7Ozs7Ozs7O1NBS1ksVUFBQyxLQUFLLEVBQUM7QUFDaEIsVUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUE7S0FDMUI7Ozs7OztTQUtZLFlBQUU7QUFDWCxhQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7S0FDMUI7OztTQTlCZ0IsZUFBZTs7O3FCQUFmLGVBQWUiLCJmaWxlIjoibGliL3NtYXJ0LWZhZGVyL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0Tm9kZSBmcm9tICcuLi9jb3JlL2luZGV4LmpzJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb2lzZUFkYXB0YXRpb24gZXh0ZW5kcyBBYnN0cmFjdE5vZGUge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7QXVkaW9Db250ZXh0fSBhdWRpb0NvbnRleHQgLSBhdWRpb0NvbnRleHQgaW5zdGFuY2UuXG4gICAgICogQHBhcmFtIHtBdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbn0gYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24gLSBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbi5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGhlYWRwaG9uZSAtIHRydWUgaXMgaGVhZHBob25lLCBlbHNlLCBmYWxzZS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihhdWRpb0NvbnRleHQsIGF1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9uLCBoZWFkcGhvbmUgPSBmYWxzZSl7XG4gICAgICAgIHN1cGVyKGF1ZGlvQ29udGV4dCwgYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24pO1xuICAgICAgICB0aGlzLl9oZWFkcGhvbmUgPSBoZWFkcGhvbmU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFByb2Nlc3M6XG4gICAgICogQHRvZG86IHRyYWNrIG5vaXNlLCBhZGQgY29tcHJlc3Npb24sIGltcHJvdmUgdm9pY2UgaWYgbm8gaGVhZHBob25lXG4gICAgICovXG4gICAgX3Byb2Nlc3MoKXtcblxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgaGVhZHBob25lIC0gdHJ1ZSBpcyBoZWFkcGhvbmUsIGVsc2UsIGZhbHNlLlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIHNldCBoZWFkcGhvbmUodmFsdWUpe1xuICAgICAgICB0aGlzLl9oZWFkcGhvbmUgPSB2YWx1ZVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgaGVhZHBob25lLCByZXR1cm4gVHJ1ZSBpZiBoZWFkcGhvbmUgaXMgY29ubmVjdGVkLCBlbHNlLCBmYWxzZVxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIGdldCBoZWFkcGhvbmUoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hlYWRwaG9uZTtcbiAgICB9XG59XG4iXX0=