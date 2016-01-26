'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _utils = require('../core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StreamSelector = function (_AbstractNode) {
    _inherits(StreamSelector, _AbstractNode);

    /**
     * @brief This class mutes/unmutes the incoming streams according to the checkbox selections
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection
     */

    function StreamSelector(audioContext) {
        var audioStreamDescriptionCollection = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

        _classCallCheck(this, StreamSelector);

        ///@todo : everything is hard-coded here !
        /// make it nicer

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StreamSelector).call(this, audioContext, audioStreamDescriptionCollection));

        _this._splitterNode = audioContext.createChannelSplitter(10);

        _this._mergerNode = audioContext.createChannelMerger(10);

        _this._gainNode0 = audioContext.createGain();
        _this._gainNode1 = audioContext.createGain();
        _this._gainNode2 = audioContext.createGain();
        _this._gainNode3 = audioContext.createGain();
        _this._gainNode4 = audioContext.createGain();
        _this._gainNode5 = audioContext.createGain();
        _this._gainNode6 = audioContext.createGain();
        _this._gainNode7 = audioContext.createGain();
        _this._gainNode8 = audioContext.createGain();
        _this._gainNode9 = audioContext.createGain();

        _this.input.connect(_this._splitterNode);

        _this._splitterNode.connect(_this._gainNode0, 0);
        _this._splitterNode.connect(_this._gainNode1, 1);
        _this._splitterNode.connect(_this._gainNode2, 2);
        _this._splitterNode.connect(_this._gainNode3, 3);
        _this._splitterNode.connect(_this._gainNode4, 4);
        _this._splitterNode.connect(_this._gainNode5, 5);
        _this._splitterNode.connect(_this._gainNode6, 6);
        _this._splitterNode.connect(_this._gainNode7, 7);
        _this._splitterNode.connect(_this._gainNode8, 8);
        _this._splitterNode.connect(_this._gainNode9, 9);

        /*
        this._gainNode0.connect( this._mergerNode, 0, 0 );
        this._gainNode1.connect( this._mergerNode, 0, 1 );
        this._gainNode2.connect( this._mergerNode, 0, 2 );
        this._gainNode3.connect( this._mergerNode, 0, 3 );
        this._gainNode4.connect( this._mergerNode, 0, 4 );
        this._gainNode5.connect( this._mergerNode, 0, 5 );
        this._gainNode6.connect( this._mergerNode, 0, 6 );
        this._gainNode7.connect( this._mergerNode, 0, 7 );
        this._gainNode8.connect( this._mergerNode, 0, 8 );
        this._gainNode9.connect( this._mergerNode, 0, 9 );
        */

        // hard downmixing to stereo L/R, for now...
        _this._gainNode0.connect(_this._mergerNode, 0, 0);
        _this._gainNode1.connect(_this._mergerNode, 0, 1);
        _this._gainNode2.connect(_this._mergerNode, 0, 1);
        _this._gainNode3.connect(_this._mergerNode, 0, 2);
        _this._gainNode4.connect(_this._mergerNode, 0, 1);
        _this._gainNode5.connect(_this._mergerNode, 0, 2);
        _this._gainNode6.connect(_this._mergerNode, 0, 1);
        _this._gainNode7.connect(_this._mergerNode, 0, 2);
        _this._gainNode8.connect(_this._mergerNode, 0, 1);
        _this._gainNode9.connect(_this._mergerNode, 0, 2);

        _this._mergerNode.connect(_this._output);
        return _this;
    }

    /**
     * Notification when the active stream(s) changes
     */

    _createClass(StreamSelector, [{
        key: 'activeStreamsChanged',
        value: function activeStreamsChanged() {
            this._update();
        }
    }, {
        key: '_update',
        value: function _update() {
            /// retrieves the AudioStreamDescriptionCollection
            var asdc = this._audioStreamDescriptionCollection.streams;

            var mainAudio = asdc[0];
            var extendedAmbience = asdc[1];
            var extendedComments = asdc[2];
            var extendedDialogs = asdc[3];

            if (mainAudio.active === true) {
                this._gainNode0.gain.value = 1;
                this._gainNode1.gain.value = 1;
            } else {
                this._gainNode0.gain.value = 0;
                this._gainNode1.gain.value = 0;
            }

            if (extendedAmbience.active === true) {
                this._gainNode2.gain.value = 1;
                this._gainNode3.gain.value = 1;
                this._gainNode4.gain.value = 1;
                this._gainNode5.gain.value = 1;
                this._gainNode6.gain.value = 1;
                this._gainNode7.gain.value = 1;
            } else {
                this._gainNode2.gain.value = 0;
                this._gainNode3.gain.value = 0;
                this._gainNode4.gain.value = 0;
                this._gainNode5.gain.value = 0;
                this._gainNode6.gain.value = 0;
                this._gainNode7.gain.value = 0;
            }

            if (extendedComments.active === true) {
                this._gainNode8.gain.value = 1;
            } else {
                this._gainNode8.gain.value = 0;
            }

            if (extendedDialogs.active === true) {
                this._gainNode9.gain.value = 1;
            } else {
                this._gainNode9.gain.value = 0;
            }
        }
    }]);

    return StreamSelector;
}(_index2.default);

exports.default = StreamSelector;