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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9zbWFydC1mYWRlci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQXlCLGtCQUFrQjs7OztJQUd0QixVQUFVOzs7Ozs7OztBQU9oQixhQVBNLFVBQVUsQ0FPZixZQUFZLEVBQStEO1lBQTdELGdDQUFnQyxnQ0FBRyxTQUFTO1lBQUUsRUFBRSxnQ0FBRyxTQUFTOzs4QkFQckUsVUFBVTs7QUFRdkIsbUNBUmEsVUFBVSw2Q0FRakIsWUFBWSxFQUFFLGdDQUFnQyxFQUFFO0FBQ3RELFlBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDOzs7O0FBSWQsWUFBSSxDQUFDLHNCQUFzQixHQUFHLFlBQVksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO0FBQ3RFLFlBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO0FBQy9DLFlBQUksQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0tBQ3BEOztjQWhCZ0IsVUFBVTs7aUJBQVYsVUFBVTs7Ozs7Ozs7YUFzQnJCLFVBQUMsS0FBSyxFQUFDOztBQUVULGdCQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQztBQUNqQixnQkFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2xCOzs7Ozs7YUFLSyxZQUFFO0FBQ0osbUJBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUNuQjs7Ozs7Ozs7YUFnQjBCLFlBQUU7QUFDekIsZ0JBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUM7QUFDekMsdUJBQU8sSUFBSSxDQUFBO2FBQ2QsTUFBTTtBQUNILHVCQUFPLEtBQUssQ0FBQTthQUNmO1NBQ0o7OztlQUNNLG1CQUFFLEVBT1I7Ozs7Ozs7OzthQXhCaUIsWUFBRTtBQUNoQixtQkFBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO1NBQ25COzs7YUFDbUIsWUFBRTtBQUNsQixtQkFBTyxDQUFDLENBQUE7U0FDWDs7O1dBNUNnQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiJsaWIvc21hcnQtZmFkZXIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3ROb2RlIGZyb20gJy4uL2NvcmUvaW5kZXguanMnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNtYXJ0RmFkZXIgZXh0ZW5kcyBBYnN0cmFjdE5vZGUge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7QXVkaW9Db250ZXh0fSBhdWRpb0NvbnRleHQgLSBhdWRpb0NvbnRleHQgaW5zdGFuY2UuXG4gICAgICogQHBhcmFtIHtBdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbn0gYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24gLSBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkQiAtIGRCIHZhbHVlIGZvciB0aGUgU21hcnRGYWRlci5cbiAgICAgKiBAdG9kbyBnaXZlIHJhbmdlIG9mIGFjY2VwdGVkIHZhbHVlc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGF1ZGlvQ29udGV4dCwgYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24gPSB1bmRlZmluZWQsIGRCID0gdW5kZWZpbmVkKXtcbiAgICAgICAgc3VwZXIoYXVkaW9Db250ZXh0LCBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbik7XG4gICAgICAgIHRoaXMuX2RCID0gZEI7XG5cbiAgICAgICAgLy8gQXVkaW9HcmFwaCBjb25uZWN0XG4gICAgICAgIC8vIEB0b2RvOiBEeW5hbWljc0NvbXByZXNzb3JOb2RlIGFjY2VwdCBuIGNoYW5uZWxzIGlucHV0XG4gICAgICAgIHRoaXMuX2R5bmFtaWNDb21wcmVzc29yTm9kZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVEeW5hbWljc0NvbXByZXNzb3IoKTtcbiAgICAgICAgdGhpcy5pbnB1dC5jb25uZWN0KHRoaXMuX2R5bmFtaWNDb21wcmVzc29yTm9kZSlcbiAgICAgICAgdGhpcy5fZHluYW1pY0NvbXByZXNzb3JOb2RlLmNvbm5lY3QodGhpcy5fb3V0cHV0KVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIGRCIHZhbHVlXG4gICAgICogQHRvZG8gZ2l2ZSByYW5nZSBvZiBhY2NlcHRlZCB2YWx1ZXNcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHNldCBkQih2YWx1ZSl7XG4gICAgICAgIC8vIEB0b2RvIGNsaXAgdmFsdWVcbiAgICAgICAgdGhpcy5fZEIgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5fdXBkYXRlKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgZEIgdmFsdWVcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldCBkQigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fZEI7XG4gICAgfVxuICAgIC8vIEB0b2RvIE1hdGhpZXUgLTgwZEIgPT4gKzIwZEJcbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGRCIHJhbmdlXG4gICAgICogQHR5cGUge2FycmF5fVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgZEJSYW5nZSgpe1xuICAgICAgICByZXR1cm4gWy04MCwgMjBdXG4gICAgfVxuICAgIHN0YXRpYyBnZXQgZEJEZWZhdWx0KCl7XG4gICAgICAgIHJldHVybiAwXG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgZHluYW1pYyBjb21wcmVzc2lvbiBzdGF0ZVxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIGdldCBkeW5hbWljQ29tcHJlc3Npb25TdGF0ZSgpe1xuICAgICAgICBpZih0aGlzLl9keW5hbWljQ29tcHJlc3Nvck5vZGUucmVkdWN0aW9uID4gMCl7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICB9XG4gICAgX3VwZGF0ZSgpe1xuICAgICAgICAvLyBAdG9kbyDDqWNsYWlyY2lyIHLDqWdsZXMgZCdhY3RpdmF0aW9uIGF2ZWMgTWF0dGhpZXVcbiAgICAgICAgLy8gdGhpcy5fZHluYW1pY0NvbXByZXNzb3JOb2RlLnRocmVzaG9sZFxuICAgICAgICAvLyB0aGlzLl9keW5hbWljQ29tcHJlc3Nvck5vZGUua25lZVxuICAgICAgICAvLyB0aGlzLl9keW5hbWljQ29tcHJlc3Nvck5vZGUucmF0aW9cbiAgICAgICAgLy8gdGhpcy5fZHluYW1pY0NvbXByZXNzb3JOb2RlLmF0dGFja1xuICAgICAgICAvLyB0aGlzLl9keW5hbWljQ29tcHJlc3Nvck5vZGUucmVsZWFzZVxuICAgIH1cbn1cbiJdfQ==