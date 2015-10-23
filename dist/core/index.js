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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9zbWFydC1mYWRlci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBcUIsWUFBWTs7Ozs7OztBQU1sQixhQU5NLFlBQVksQ0FNakIsWUFBWSxFQUFDOzhCQU5SLFlBQVk7O0FBT3pCLFlBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO0FBQ2xDLFlBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUM3QyxZQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDakQ7O2lCQVZnQixZQUFZOzs7Ozs7ZUFjdEIsaUJBQUMsSUFBSSxFQUFDO0FBQ1QsZ0JBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQzVCOzs7Ozs7O2VBSVMsb0JBQUMsSUFBSSxFQUFDO0FBQ1osZ0JBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQy9COzs7V0F0QmdCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6ImxpYi9zbWFydC1mYWRlci9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIEFic3RyYWN0Tm9kZSB7XG4gICAgLyoqXG4gICAgICogQWJzdHJhY3ROb2RlIGNvbnN0cnVjdG9yXG4gICAgICogVGVtcGxhdGUgZm9yIHRoZSBwcm9qZXQgYXVkaW8gbm9kZXM6IGF1ZGlvQ29udGV4dCByZWZlcmVuY2UsIGNvbm5lY3QgYW5kIGRpc2Nvbm5lY3QgbWV0aG9kc1xuICAgICAqIEBwYXJhbSB7QXVkaW9Db250ZXh0fSBhdWRpb0NvbnRleHQgLSBhdWRpb0NvbnRleHQgaW5zdGFuY2UuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoYXVkaW9Db250ZXh0KXtcbiAgICAgICAgdGhpcy5fYXVkaW9Db250ZXh0ID0gYXVkaW9Db250ZXh0O1xuICAgICAgICB0aGlzLmlucHV0ID0gdGhpcy5fYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICAgICAgdGhpcy5fb3VwdXQgPSB0aGlzLl9hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb25uZWN0IHRoZSBhdWRpbyBub2RlXG4gICAgICovXG4gICAgY29ubmVjdChub2RlKXtcbiAgICAgICAgdGhpcy5fb3VwdXQuY29ubmVjdChub2RlKVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBEaXNjb25uZWN0IHRoZSBhdWRpbyBub2RlXG4gICAgICovXG4gICAgZGlzY29ubmVjdChub2RlKXtcbiAgICAgICAgdGhpcy5fb3VwdXQuZGlzY29ubmVjdChub2RlKVxuICAgIH1cbn1cbiJdfQ==