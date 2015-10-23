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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9zbWFydC1mYWRlci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQXlCLGtCQUFrQjs7OztJQUd0QixpQkFBaUI7Ozs7OztBQUt2QixhQUxNLGlCQUFpQixDQUt0QixZQUFZLEVBQUUsdUJBQXVCLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBQzs4QkFMbkQsaUJBQWlCOztBQU05QixtQ0FOYSxpQkFBaUIsNkNBTXhCLFlBQVksRUFBRTtBQUNwQixZQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixZQUFJLENBQUMsd0JBQXdCLEdBQUcsdUJBQXVCLENBQUM7S0FDM0Q7O2NBVGdCLGlCQUFpQjs7aUJBQWpCLGlCQUFpQjs7Ozs7OzthQWMxQixVQUFDLEtBQUssRUFBQztBQUNYLGdCQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztTQUN0Qjs7Ozs7YUFJTyxZQUFFO0FBQ04sbUJBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztTQUNyQjs7Ozs7OzthQUkwQixVQUFDLEtBQUssRUFBQztBQUM5QixnQkFBSSxDQUFDLHdCQUF3QixHQUFHLEtBQUssQ0FBQztTQUN6Qzs7Ozs7YUFJMEIsWUFBRTtBQUN6QixtQkFBTyxJQUFJLENBQUMsd0JBQXdCLENBQUM7U0FDeEM7Ozs7Ozs7YUFJYSxVQUFDLEtBQUssRUFBQztBQUNqQixnQkFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7U0FDNUI7Ozs7O2FBSWEsWUFBRTtBQUNaLG1CQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7U0FDM0I7OztXQTlDZ0IsaUJBQWlCOzs7cUJBQWpCLGlCQUFpQiIsImZpbGUiOiJsaWIvc21hcnQtZmFkZXIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3ROb2RlIGZyb20gJy4uL2NvcmUvaW5kZXguanMnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpYWxvZ0VuaGFuY2VtZW50IGV4dGVuZHMgQWJzdHJhY3ROb2RlIHtcbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RvclxuICAgICAqIGF1ZGlvQ29udGV4dCwgYXVkaW9TdHJlYW1zRGVzY3JpcHRpb24sIG1vZGUsIGRpYWxvZ0dhaW5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihhdWRpb0NvbnRleHQsIGF1ZGlvU3RyZWFtc0Rlc2NyaXB0aW9uLCBtb2RlLCBkaWFsb2dHYWluKXtcbiAgICAgICAgc3VwZXIoYXVkaW9Db250ZXh0KTtcbiAgICAgICAgdGhpcy5fbW9kZSA9IG1vZGU7XG4gICAgICAgIHRoaXMuX2F1ZGlvU3RyZWFtc0Rlc2NyaXB0aW9uID0gYXVkaW9TdHJlYW1zRGVzY3JpcHRpb247XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCBNb2RlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gMSwgMiBvciAzXG4gICAgICovXG4gICAgc2V0IG1vZGUodmFsdWUpe1xuICAgICAgICB0aGlzLl9tb2RlID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCBNb2RlXG4gICAgICovXG4gICAgZ2V0IG1vZGUoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21vZGU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCBhdWRpb1N0cmVhbXNEZXNjcmlwdGlvblxuICAgICAqL1xuICAgIHNldCBhdWRpb1N0cmVhbXNEZXNjcmlwdGlvbih2YWx1ZSl7XG4gICAgICAgIHRoaXMuX2F1ZGlvU3RyZWFtc0Rlc2NyaXB0aW9uID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCBhdWRpb1N0cmVhbXNEZXNjcmlwdGlvblxuICAgICAqL1xuICAgIGdldCBhdWRpb1N0cmVhbXNEZXNjcmlwdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fYXVkaW9TdHJlYW1zRGVzY3JpcHRpb247XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCBkaWFsb2dHYWluXG4gICAgICovXG4gICAgc2V0IGRpYWxvZ0dhaW4odmFsdWUpe1xuICAgICAgICB0aGlzLl9kaWFsb2dHYWluID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCBkaWFsb2dHYWluXG4gICAgICovXG4gICAgZ2V0IGRpYWxvZ0dhaW4oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RpYWxvZ0dhaW47XG4gICAgfVxufVxuIl19