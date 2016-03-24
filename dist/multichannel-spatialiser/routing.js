"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require("../core/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      This class takes the 10 audio streams and produces a 5.1 output stream (discrete routing)
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var StreamRouting = function (_AbstractNode) {
    _inherits(StreamRouting, _AbstractNode);

    //==============================================================================
    /**
     * @brief This class takes the 10 audio streams and produces a 5.1 output stream (discrete routing)
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection
     *
     * @details With the WebAudioAPI specifications, the 5.1 output stream is arranged as : 
     *
     *   0: L: left
     *   1: R: right
     *   2: C: center
     *   3: LFE: subwoofer
     *   4: SL: surround left
     *   5: SR: surround right
     *
     */

    function StreamRouting(audioContext) {
        var audioStreamDescriptionCollection = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

        _classCallCheck(this, StreamRouting);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StreamRouting).call(this, audioContext, audioStreamDescriptionCollection));

        _this._splitterNode = undefined;
        _this._mergerNode = undefined;

        if (typeof audioStreamDescriptionCollection === "undefined") {
            throw new Error("the audioStreamDescriptionCollection must be defined !");
        }

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        var totalNumberOfChannels_ = _this._audioStreamDescriptionCollection.totalNumberOfChannels;

        /// sanity check
        /// mainAudio (2) + extendedAmbience (6) + extendedComments (1) + extendedDialogs (1) = 10
        if (totalNumberOfChannels_ != 10) {
            throw new Error("Ca parait pas bon...");
        }

        _this._splitterNode = audioContext.createChannelSplitter(totalNumberOfChannels_);

        var numOutputChannels = 6; /// 5.1

        _this._mergerNode = audioContext.createChannelMerger(numOutputChannels);

        /// sanity checks
        if (_this._splitterNode.numberOfInputs != 1 || _this._splitterNode.numberOfOutputs != totalNumberOfChannels_) {
            throw new Error("Pas bon");
        }

        /// split the input streams into 10 independent channels
        _this._input.connect(_this._splitterNode);

        /// index of the destination channels, according to the WAA specifications
        var outputIndexL = 0;
        var outputIndexR = 1;
        var outputIndexC = 2;
        var outputIndexLFE = 3;
        var outputIndexLS = 4;
        var outputIndexRS = 5;

        /// hard-coded version
        /*
        {
            //==============================================================================
            /// main video L
            this._splitterNode.connect( this._mergerNode, 0, outputIndexL );
             /// main video R
            this._splitterNode.connect( this._mergerNode, 1, outputIndexR );
             //==============================================================================
            /// extended ambience L
            this._splitterNode.connect( this._mergerNode, 2, outputIndexL );
             /// extended ambience R
            this._splitterNode.connect( this._mergerNode, 3, outputIndexR );
             /// extended ambience C
            this._splitterNode.connect( this._mergerNode, 4, outputIndexC );
             /// extended ambience LS
            this._splitterNode.connect( this._mergerNode, 5, outputIndexLS );
             /// extended ambience RS
            this._splitterNode.connect( this._mergerNode, 6, outputIndexRS );
             /// extended ambience LFE
            this._splitterNode.connect( this._mergerNode, 7, outputIndexLFE );
             //==============================================================================
            /// extended audio comments (mono)
            this._splitterNode.connect( this._mergerNode, 8, outputIndexC );
             //==============================================================================
            /// extended audio dialogs (mono)
            this._splitterNode.connect( this._mergerNode, 9, outputIndexC );
        }
        */

        /// flexible version
        {
            /// retrieves the AudioStreamDescriptionCollection
            /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
            var asdc = _this._audioStreamDescriptionCollection.streams;

            /// input channel index (in the splitter node)
            var channelIndex = 0;

            /// go through all the streams
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = asdc[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var stream = _step.value;


                    var numChannelsForThisStream = stream.numChannels;

                    for (var k = 0; k < numChannelsForThisStream; k++) {

                        /// destination index (in the merger node)
                        var destinationIndex = undefined;

                        if (stream.channelIsLeft(k) === true) {
                            destinationIndex = outputIndexL;
                        } else if (stream.channelIsRight(k) === true) {
                            destinationIndex = outputIndexR;
                        } else if (stream.channelIsCenter(k) === true) {
                            destinationIndex = outputIndexC;
                        } else if (stream.channelIsLfe(k) === true) {
                            destinationIndex = outputIndexLFE;
                        } else if (stream.channelIsLeftSurround(k) === true) {
                            destinationIndex = outputIndexLS;
                        } else if (stream.channelIsRightSurround(k) === true) {
                            destinationIndex = outputIndexRS;
                        } else {
                            throw new Error("Pas bon...");
                        }

                        _this._splitterNode.connect(_this._mergerNode, channelIndex, destinationIndex);

                        channelIndex++;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        /// connect the merger node to the output
        _this._mergerNode.connect(_this._output);
        return _this;
    }

    return StreamRouting;
}(_index2.default);

exports.default = StreamRouting;