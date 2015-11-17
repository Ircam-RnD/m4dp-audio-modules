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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9zbWFydC1mYWRlci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQXlCLGtCQUFrQjs7OztJQUd0QixpQkFBaUI7Ozs7Ozs7O0FBT3ZCLGFBUE0saUJBQWlCLENBT3RCLFlBQVksRUFBRSxnQ0FBZ0MsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFDOzhCQVA1RCxpQkFBaUI7O0FBUTlCLG1DQVJhLGlCQUFpQiw2Q0FReEIsWUFBWSxFQUFFLGdDQUFnQyxFQUFFO0FBQ3RELFlBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0tBQ3JCOztjQVZnQixpQkFBaUI7O2lCQUFqQixpQkFBaUI7Ozs7Ozs7YUFlMUIsVUFBQyxLQUFLLEVBQUM7Ozs7QUFJWCxnQkFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7U0FDdEI7Ozs7OzthQUtPLFlBQUU7QUFDTixtQkFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQ3JCOzs7Ozs7OzthQUttQyxVQUFDLEtBQUssRUFBQztBQUN2QyxnQkFBSSxDQUFDLGlDQUFpQyxHQUFHLEtBQUssQ0FBQztTQUNsRDs7Ozs7O2FBS21DLFlBQUU7QUFDbEMsbUJBQU8sSUFBSSxDQUFDLGlDQUFpQyxDQUFDO1NBQ2pEOzs7Ozs7Ozs7YUFNYSxVQUFDLEtBQUssRUFBQztBQUNqQixnQkFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7U0FDNUI7Ozs7Ozs7YUFNYSxZQUFFO0FBQ1osbUJBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztTQUMzQjs7O1dBekRnQixpQkFBaUI7OztxQkFBakIsaUJBQWlCIiwiZmlsZSI6ImxpYi9zbWFydC1mYWRlci9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdE5vZGUgZnJvbSAnLi4vY29yZS9pbmRleC5qcyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlhbG9nRW5oYW5jZW1lbnQgZXh0ZW5kcyBBYnN0cmFjdE5vZGUge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7QXVkaW9Db250ZXh0fSBhdWRpb0NvbnRleHQgLSBhdWRpb0NvbnRleHQgaW5zdGFuY2UuXG4gICAgICogQHBhcmFtIHtBdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbn0gYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24gLSBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbi5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbW9kZSAtIG1vZGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZGlhbG9nR2FpbiAtIGRpYWxvZyBnYWluXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoYXVkaW9Db250ZXh0LCBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbiwgbW9kZSwgZGlhbG9nR2Fpbil7XG4gICAgICAgIHN1cGVyKGF1ZGlvQ29udGV4dCwgYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24pO1xuICAgICAgICB0aGlzLl9tb2RlID0gbW9kZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IE1vZGUgLSB2YWx1ZSBpcyAxLCAyIG9yIDNcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHNldCBtb2RlKHZhbHVlKXtcbiAgICAgICAgLy8gQHRvZG8gZXJyb3IgaW4gc29tZSBtb2RlOiBlZy4gbW9kZSAxIGFuZCBubyBkaWFsb2cgPT4gXCJpbXBvc3NpYmxlXCJcbiAgICAgICAgLy8gZXJyb3IgbW9kZSAyIGV0IHBhcyBkZSA1LjAgb3UgNS4xXG4gICAgICAgIC8vIGVycm9yIG1vZGUgMyBldCBwYXMgZGUgc3TDqXLDqW9cbiAgICAgICAgdGhpcy5fbW9kZSA9IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgTW9kZSAtIHZhbHVlIGlzIDEsIDIgb3IgM1xuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0IG1vZGUoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21vZGU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCBhdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvblxuICAgICAqIEB0eXBlIHtBdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbn1cbiAgICAgKi9cbiAgICBzZXQgYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb24odmFsdWUpe1xuICAgICAgICB0aGlzLl9hdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbiA9IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgYXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb25cbiAgICAgKiBAdHlwZSB7QXVkaW9TdHJlYW1EZXNjcmlwdGlvbkNvbGxlY3Rpb259XG4gICAgICovXG4gICAgZ2V0IGF1ZGlvU3RyZWFtRGVzY3JpcHRpb25Db2xsZWN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9hdWRpb1N0cmVhbURlc2NyaXB0aW9uQ29sbGVjdGlvbjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IGRpYWxvZ0dhaW5cbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEB0b2RvIGdpdmUgcmFuZ2Ugb2YgYWNjZXB0ZWQgdmFsdWVzXG4gICAgICovXG4gICAgc2V0IGRpYWxvZ0dhaW4odmFsdWUpe1xuICAgICAgICB0aGlzLl9kaWFsb2dHYWluID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCBkaWFsb2dHYWluXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAdG9kbyBnaXZlIHJhbmdlIG9mIGFjY2VwdGVkIHZhbHVlc1xuICAgICAqL1xuICAgIGdldCBkaWFsb2dHYWluKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9kaWFsb2dHYWluO1xuICAgIH1cbn1cblxuIl19