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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9zbWFydC1mYWRlci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQXlCLGtCQUFrQjs7OztJQUd0QixVQUFVOzs7Ozs7Ozs7QUFRaEIsYUFSTSxVQUFVLENBUWYsWUFBWSxFQUFnRTtZQUE5RCxFQUFFLGdDQUFHLFNBQVM7WUFBRSxRQUFRLGdDQUFHLFNBQVM7WUFBRSxXQUFXLGdDQUFHLFNBQVM7OzhCQVJ0RSxVQUFVOztBQVN2QixtQ0FUYSxVQUFVLDZDQVNqQixZQUFZLEVBQUU7QUFDcEIsWUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDZCxZQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztBQUMxQixZQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztBQUNoQyxZQUFJLENBQUMsd0JBQXdCLEdBQUcsU0FBUyxDQUFDO0tBQzdDOztjQWRnQixVQUFVOztpQkFBVixVQUFVOzs7Ozs7YUFrQnJCLFVBQUMsS0FBSyxFQUFDO0FBQ1QsZ0JBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO1NBQ3BCOzs7OzthQUlLLFlBQUU7QUFDSixtQkFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO1NBQ25COzs7Ozs7O2FBSVcsVUFBQyxLQUFLLEVBQUM7QUFDZixnQkFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7U0FDMUI7Ozs7O2FBSVcsWUFBRTtBQUNWLG1CQUFPLElBQUksQ0FBQyxTQUFTLENBQUE7U0FDeEI7Ozs7Ozs7YUFJYyxVQUFDLEtBQUssRUFBQztBQUNsQixnQkFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7U0FDN0I7Ozs7O2FBSWMsWUFBRTtBQUNiLG1CQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7U0FDNUI7Ozs7Ozs7YUFJMEIsWUFBRTtBQUN6QixtQkFBTyxJQUFJLENBQUMsd0JBQXdCLENBQUM7U0FDeEM7OztlQUNPLG9CQUFFLEVBRVQ7OztXQTNEZ0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoibGliL3NtYXJ0LWZhZGVyL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0Tm9kZSBmcm9tICcuLi9jb3JlL2luZGV4LmpzJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTbWFydEZhZGVyIGV4dGVuZHMgQWJzdHJhY3ROb2RlIHtcbiAgICAvKipcbiAgICAgKiBTbWFydEZhZGUgY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge0F1ZGlvQ29udGV4dH0gYXVkaW9Db250ZXh0IC0gYXVkaW9Db250ZXh0IGluc3RhbmNlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkYiAtIGRiIHZhbHVlIGZvciB0aGUgU21hcnRGYWRlci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG91ZG5lc3MgLSBsb3VkbmVzcyB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4VHJ1ZVBlYWsgLSBtYXhUcnVlUGVhayB2YWx1ZS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihhdWRpb0NvbnRleHQsIGRiID0gdW5kZWZpbmVkLCBsb3VkbmVzcyA9IHVuZGVmaW5lZCwgbWF4VHJ1ZVBlYWsgPSB1bmRlZmluZWQpe1xuICAgICAgICBzdXBlcihhdWRpb0NvbnRleHQpO1xuICAgICAgICB0aGlzLl9kYiA9IGRiO1xuICAgICAgICB0aGlzLl9sb3VkbmVzcyA9IGxvdWRuZXNzO1xuICAgICAgICB0aGlzLl9tYXhUcnVlUGVhayA9IG1heFRydWVQZWFrO1xuICAgICAgICB0aGlzLl9keW5hbWljQ29tcHJlc3Npb25TdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBkYiB2YWx1ZVxuICAgICAqL1xuICAgIHNldCBkYih2YWx1ZSl7XG4gICAgICAgIHRoaXMuX2RiID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgZGIgdmFsdWVcbiAgICAgKi9cbiAgICBnZXQgZGIoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RiO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIGxvdWRuZXNzIHZhbHVlXG4gICAgICovXG4gICAgc2V0IGxvdWRuZXNzKHZhbHVlKXtcbiAgICAgICAgdGhpcy5fbG91ZG5lc3MgPSB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBsb3VkbmVzcyB2YWx1ZVxuICAgICAqL1xuICAgIGdldCBsb3VkbmVzcygpe1xuICAgICAgICByZXR1cm4gdGhpcy5fbG91ZG5lc3NcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBNYXhUcnVlUGVhayB2YWx1ZVxuICAgICAqL1xuICAgIHNldCBtYXhUcnVlUGVhayh2YWx1ZSl7XG4gICAgICAgIHRoaXMuX21heFRydWVQZWFrID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgTWF4VHJ1ZVBlYWsgdmFsdWVcbiAgICAgKi9cbiAgICBnZXQgbWF4VHJ1ZVBlYWsoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21heFRydWVQZWFrO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGR5bmFtaWMgY29tcHJlc3Npb24gc3RhdGVcbiAgICAgKi9cbiAgICBnZXQgZHluYW1pY0NvbXByZXNzaW9uU3RhdGUoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2R5bmFtaWNDb21wcmVzc2lvblN0YXRlO1xuICAgIH1cbiAgICBfcHJvY2Vzcygpe1xuXG4gICAgfVxufVxuIl19