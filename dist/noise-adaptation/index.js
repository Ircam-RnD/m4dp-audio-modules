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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9zbWFydC1mYWRlci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQXlCLGtCQUFrQjs7OztJQUd0QixlQUFlO0FBQ3JCLGFBRE0sZUFBZSxDQUNwQixZQUFZLEVBQW9CO1lBQWxCLFNBQVMsZ0NBQUcsS0FBSzs7OEJBRDFCLGVBQWU7O0FBRTVCLG1DQUZhLGVBQWUsNkNBRXRCLFlBQVksRUFBRTtBQUNwQixZQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztLQUMvQjs7Y0FKZ0IsZUFBZTs7aUJBQWYsZUFBZTs7Ozs7OztlQVN4QixvQkFBRSxFQUVUOzs7Ozs7OzthQUtZLFVBQUMsS0FBSyxFQUFDO0FBQ2hCLGdCQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQTtTQUMxQjs7Ozs7YUFJWSxZQUFFO0FBQ1gsbUJBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztTQUMxQjs7O1dBeEJnQixlQUFlOzs7cUJBQWYsZUFBZSIsImZpbGUiOiJsaWIvc21hcnQtZmFkZXIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3ROb2RlIGZyb20gJy4uL2NvcmUvaW5kZXguanMnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vaXNlQWRhcHRhdGlvbiBleHRlbmRzIEFic3RyYWN0Tm9kZSB7XG4gICAgY29uc3RydWN0b3IoYXVkaW9Db250ZXh0LCBoZWFkcGhvbmUgPSBmYWxzZSl7XG4gICAgICAgIHN1cGVyKGF1ZGlvQ29udGV4dCk7XG4gICAgICAgIHRoaXMuX2hlYWRwaG9uZSA9IGhlYWRwaG9uZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUHJvY2VzczpcbiAgICAgKiBAdG9kbzogdHJhY2sgbm9pc2UsIGFkZCBjb21wcmVzc2lvbiwgaW1wcm92ZSB2b2ljZSBpZiBubyBoZWFkcGhvbmVcbiAgICAgKi9cbiAgICBfcHJvY2Vzcygpe1xuXG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCBoZWFkcGhvbmVcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHZhbHVlIC0gdHJ1ZSBpcyBoZWFkcGhvbmUsIGVsc2UsIGZhbHNlLlxuICAgICAqL1xuICAgIHNldCBoZWFkcGhvbmUodmFsdWUpe1xuICAgICAgICB0aGlzLl9oZWFkcGhvbmUgPSB2YWx1ZVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgaGVhZHBob25lLCByZXR1cm4gVHJ1ZSBpZiBoZWFkcGhvbmUgaXMgY29ubmVjdGVkLCBlbHNlLCBmYWxzZVxuICAgICAqL1xuICAgIGdldCBoZWFkcGhvbmUoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hlYWRwaG9uZTtcbiAgICB9XG59XG4iXX0=