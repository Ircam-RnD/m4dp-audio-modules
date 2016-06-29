'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _utils = require('../core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

var _compressorexpander = require('../dsp/compressorexpander.js');

var _compressorexpander2 = _interopRequireDefault(_compressorexpander);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       compressorwithdrywet.js
 *   @brief      This class implements a mono compressor/expander, with optional dry/wet control
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       06/2016
 *
 */
/************************************************************************************/

/************************************************************************************/
/*!
 *  @class          CompressorWithDryWet
 *  @brief          Compressor/Expander
 *  @details        This class implements a mono compressor/expander, with optional dry/wet control
 *  @details        mono version
 *
 */
/************************************************************************************/

var CompressorWithDryWet = function (_AbstractNode) {
    _inherits(CompressorWithDryWet, _AbstractNode);

    /************************************************************************************/
    /*!
     *  @brief          Class constructor
     *  @param[in]      audioContext
     *
     */
    /************************************************************************************/

    function CompressorWithDryWet(audioContext) {
        _classCallCheck(this, CompressorWithDryWet);

        /// 100 = totally wet i.e. being compressed
        /// 0 = totally dry, not being compressed

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CompressorWithDryWet).call(this, audioContext));

        _this._drywet = 100;

        /// create the nodes
        {
            _this._compressorNode = new _compressorexpander2.default(_this._audioContext);
            _this._gainDry = _this._audioContext.createGain();
            _this._gainWet = _this._audioContext.createGain();
        }

        /// connect the nodes
        {
            _this._input.connect(_this._gainDry);
            _this._input.connect(_this._compressorNode._input);

            _this._compressorNode.connect(_this._gainWet);

            _this._gainDry.connect(_this._output);
            _this._gainWet.connect(_this._output);
        }

        /// sanity checks
        if (_this._input.numberOfInputs != 1 || _this._input.numberOfOutputs != 1) {
            throw new Error("Pas bon");
        }

        /// sanity checks
        if (_this._output.numberOfInputs != 1 || _this._output.numberOfOutputs != 1) {
            throw new Error("Pas bon");
        }
        return _this;
    }

    /************************************************************************************/
    /*!
     *  @brief          Returns the dry/wet ratio  in [0 - 100]
     *
     */
    /************************************************************************************/


    _createClass(CompressorWithDryWet, [{
        key: 'getDryWet',
        value: function getDryWet() {
            return this._gainWet.gain.value * 100.;
        }

        /************************************************************************************/
        /*!
         *  @brief          Set the dry/wet ratio  in [0 - 100]
         *  @details        100 = totally wet i.e. being compressed
         *                  0 = totally dry, not being compressed
         *
         */
        /************************************************************************************/

    }, {
        key: 'setDryWet',
        value: function setDryWet(ratio, rampTimeInMilliseconds) {
            /// sanity check
            if (rampTimeInMilliseconds < 0) {
                throw new Error("Ca parait pas bon...");
            }

            /// 100% --> totally wet
            /// 0% --> totally dry

            var percent = _utils2.default.clamp(ratio, 0, 100);

            this._drywet = percent;

            var wet = percent;
            var dry = 100 - percent;

            /*
            this._gainDry.gain.value = dry / 100.;
            this._gainWet.gain.value = wet / 100.;
             */

            var nextTime = this._audioContext.currentTime + rampTimeInMilliseconds / 1000.;

            this._gainDry.gain.linearRampToValueAtTime(dry / 100., nextTime);
            this._gainWet.gain.linearRampToValueAtTime(wet / 100., nextTime);
        }

        //==============================================================================

    }, {
        key: 'setAttack',
        value: function setAttack(valueInMsec) {
            this._compressorNode.setAttack(valueInMsec);
        }
    }, {
        key: 'setRelease',
        value: function setRelease(valueInMsec) {
            this._compressorNode.setRelease(valueInMsec);
        }
    }, {
        key: 'setCompressorThreshold',
        value: function setCompressorThreshold(valueIndB) {
            this._compressorNode.setCompressorThreshold(valueIndB);
        }
    }, {
        key: 'setExpanderThreshold',
        value: function setExpanderThreshold(valueIndB) {
            this._compressorNode.setExpanderThreshold(valueIndB);
        }
    }, {
        key: 'setCompressorRatio',
        value: function setCompressorRatio(value) {
            this._compressorNode.setCompressorRatio(value);
        }
    }, {
        key: 'setExpanderRatio',
        value: function setExpanderRatio(value) {
            this._compressorNode.setExpanderRatio(value);
        }
    }, {
        key: 'setMakeUpGain',
        value: function setMakeUpGain(valueIndB) {
            this._compressorNode.setMakeUpGain(valueIndB);
        }
    }, {
        key: 'setRMSAveragingTime',
        value: function setRMSAveragingTime(timeInMilliseconds) {
            this._compressorNode.setRMSAveragingTime(timeInMilliseconds);
        }

        /************************************************************************************/
        /*!
         *  @brief          Returns the attack time in msec
         *
         */
        /************************************************************************************/

    }, {
        key: 'getAttack',
        value: function getAttack() {
            return this._compressorNode._attack;
        }

        /************************************************************************************/
        /*!
         *  @brief          Returns the release time in msec
         *
         */
        /************************************************************************************/

    }, {
        key: 'getRelease',
        value: function getRelease() {
            return this._compressorNode._release;
        }

        /************************************************************************************/
        /*!
         *  @brief          Returns the compressor threshold, in dB
         *
         */
        /************************************************************************************/

    }, {
        key: 'getCompressorThreshold',
        value: function getCompressorThreshold() {
            return this._compressorNode._compressorThreshold;
        }

        /************************************************************************************/
        /*!
         *  @brief          Returns the compressor ratio
         *
         */
        /************************************************************************************/

    }, {
        key: 'getCompressorRatio',
        value: function getCompressorRatio() {
            return this._compressorNode._compressorRatio;
        }
    }]);

    return CompressorWithDryWet;
}(_index2.default);

exports.default = CompressorWithDryWet;