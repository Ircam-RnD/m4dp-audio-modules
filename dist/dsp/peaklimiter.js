'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _utils = require('../core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       peaklimiter.js
 *   @brief      This class implements a peak limiter
 *   @author     Marc Emerit, adapted by Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

var PeakLimiterNode = function (_AbstractNode) {
    _inherits(PeakLimiterNode, _AbstractNode);

    /************************************************************************************/
    /*!
     *  @brief          Class constructor
     *  @param[in]      audioContext
     *
     */
    /************************************************************************************/

    function PeakLimiterNode(audioContext, numChannels) {
        _classCallCheck(this, PeakLimiterNode);

        /// sanity checks
        if (numChannels <= 0) {
            throw new Error("Pas bon");
        }

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PeakLimiterNode).call(this, audioContext));

        _this.maxBufferIndex = 0;
        _this.delayBufferIndex = 0;
        _this.maxBufferSlowIndex = 0;
        _this.maxBufferSectiontionIndex = 0;
        _this.maxBufferSectiontionControl = 0;

        _this.attackMs = 0;
        _this.maxAttackMs = 0;
        _this.attackConst = 0;
        _this.releaseConst = 0;
        _this.threshold = 0;
        _this.channels = 0;
        _this.maxChannels = 0;
        _this.sampleRate = 0;
        _this.maxSampleRate = 0;

        _this.cor = 1.0;
        _this.smoothState = 1.0;
        _this.minGain = 1.0;

        _this.maxBuffer = null;
        _this.delayBuffer = null;
        _this.maxBufferSlow = null;

        /// additions:

        _this.maxSampleRate = 192000;

        _this.sampleRate = _utils2.default.clamp(audioContext.sampleRate, 22050, 192000);

        _this.init(5, 80, _utils2.default.dB2lin(-25), numChannels, 192000);

        _this.setSampleRate(_this.sampleRate);

        _this.reset();

        _this.setNChannels(numChannels);

        /// the script processor part
        {
            var bufferSize = 0;
            /*
             The buffer size in units of sample-frames. If specified, the bufferSize must be one of the following values:
             256, 512, 1024, 2048, 4096, 8192, 16384. If it's not passed in, or if the value is 0,
             then the implementation will choose the best buffer size for the given environment,
             which will be a constant power of 2 throughout the lifetime of the node.
             */
            var numberOfInputChannels = numChannels;
            var numberOfOutputChannels = numChannels;
            _this._scriptNode = audioContext.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);

            var processor = _this;

            _this._scriptNode.onaudioprocess = function (audioProcessingEvent) {
                var inputBuffer = audioProcessingEvent.inputBuffer;
                var outputBuffer = audioProcessingEvent.outputBuffer;

                var numChannels = outputBuffer.numberOfChannels;

                if (inputBuffer.numberOfChannels != numChannels) {
                    throw new Error("Pas bon");
                }
                if (numChannels != processor.channels) {
                    throw new Error("Pas bon");
                }

                for (var j = 0; j < numChannels; j++) {
                    processor.input[j] = inputBuffer.getChannelData(j);
                    processor.output[j] = outputBuffer.getChannelData(j);
                }

                var numSamples = inputBuffer.length;

                var tmp, gain;
                var maximum, sectionMaximum;

                for (var i = 0; i < numSamples; i++) {

                    /* get maximum absolute sample value of all channels */
                    tmp = processor.threshold;
                    for (var _j = 0; _j < processor.channels; _j++) {
                        tmp = Math.max(tmp, Math.abs(processor.input[_j][i]));
                    }

                    /* running maximum over attack+1 samples */
                    processor.maxBuffer[processor.maxBufferIndex] = tmp;

                    /* search section of maxBuffer */
                    sectionMaximum = processor.maxBuffer[processor.maxBufferSectiontionIndex];
                    for (var _j2 = 1; _j2 < processor.secLen; _j2++) {
                        if (processor.maxBuffer[processor.maxBufferSectiontionIndex + _j2] > sectionMaximum) {
                            sectionMaximum = processor.maxBuffer[processor.maxBufferSectiontionIndex + _j2];
                        }
                    }

                    /* find maximum of slow (downsampled) max Bufferfer */
                    maximum = sectionMaximum;
                    for (var _j3 = 0; _j3 < processor.nMaxBufferSection; _j3++) {
                        if (processor.maxBufferSlow[_j3] > maximum) {
                            maximum = processor.maxBufferSlow[_j3];
                        }
                    }

                    processor.maxBufferIndex++;
                    processor.maxBufferSectiontionControl++;

                    /* if maxBuffer section is finished, or end of maxBuffer is reached,*/
                    /*   store the maximum of this section and open up a new one */
                    if (processor.maxBufferSectiontionControl >= processor.secLen || processor.maxBufferIndex >= processor.attack + 1) {
                        processor.maxBufferSectiontionControl = 0;

                        processor.maxBufferSlow[processor.maxBufferSlowIndex] = sectionMaximum;
                        processor.maxBufferSlowIndex++;
                        if (processor.maxBufferSlowIndex >= processor.nMaxBufferSection) {
                            processor.maxBufferSlowIndex = 0;
                        }
                        processor.maxBufferSlow[processor.maxBufferSlowIndex] = 0.0; /* zero out the value representing the new section */

                        processor.maxBufferSectiontionIndex += processor.secLen;
                    }

                    if (processor.maxBufferIndex >= processor.attack + 1) {
                        processor.maxBufferIndex = 0;
                        processor.maxBufferSectiontionIndex = 0;
                    }

                    /* calc gain */
                    if (maximum > processor.threshold) {
                        gain = processor.threshold / maximum;
                    } else {
                        gain = 1;
                    }

                    /* gain smoothing */
                    /* first order IIR filter with attack correction to avoid overshoots */

                    /* correct the 'aiming' value of the exponential attack to avoid the remaining overshoot */
                    if (gain < processor.smoothState) {
                        processor.cor = Math.min(processor.cor, (gain - 0.1 * processor.smoothState) * 1.11111111);
                    } else {
                        processor.cor = gain;
                    }

                    /* smoothing filter */
                    if (processor.cor < processor.smoothState) {
                        processor.smoothState = processor.attackConst * (processor.smoothState - processor.cor) + processor.cor; /* attack */
                        processor.smoothState = Math.max(processor.smoothState, gain); /* avoid overshooting target */
                    } else {
                            processor.smoothState = processor.releaseConst * (processor.smoothState - processor.cor) + processor.cor; /* release */
                        }

                    gain = processor.smoothState;

                    /* lookahead delay, apply gain */
                    for (var _j4 = 0; _j4 < processor.channels; _j4++) {
                        tmp = processor.delayBuffer[processor.delayBufferIndex * processor.channels + _j4];
                        processor.delayBuffer[processor.delayBufferIndex * processor.channels + _j4] = processor.input[_j4][i];

                        tmp *= gain;
                        if (tmp > processor.threshold) {
                            tmp = processor.threshold;
                        }
                        if (tmp < -processor.threshold) {
                            tmp = -processor.threshold;
                        }

                        processor.output[_j4][i] = tmp;
                    }

                    processor.delayBufferIndex++;
                    if (processor.delayBufferIndex >= processor.attack) {
                        processor.delayBufferIndex = 0;
                    }

                    /* save minimum gain factor */
                    //if( gain < processor.minGain )
                    {
                        processor.minGain = gain;
                    }
                }
            };
        }

        _this._input.connect(_this._scriptNode);
        _this._scriptNode.connect(_this._output);

        return _this;
    }

    /************************************************************************************/
    /*!
     *  @brief          init(maxAttackMsIn, releaseMsIn, thresholdIn, maxChannelsIn, maxSampleRateIn) : Must be called to initialized the class
     *  @param          maxAttackMsIn : maximum value for the attack time. It is the time to reach to correct attenutation to avoid clipping.
     *                  this parameter defines the amount of memory used by the class. It is a float or integer value
     *  @param          releaseMsIn : defines the time to release the gain. It is the time for the gain to go 
     *                  back to its nominal value after an attenaution to avoid clipping
     *                  It is a float or integer value
     *  @param          thresholdIn : maximum value fro absolutie value. It is a float value
     *  @param          maxChannelsIn : maximum value of the number of channel that can be used. Number of channels value can be changed after class creation
     *                  but the value must be lower than maxChannelsIn. The gain between channels are inked.
     *  @param          maxSampleRateIn : maximum value of the sample rate that can be used. Sample rate value can be changed after class creation
     *                  but the value must be lower than maxSampleRateIn.
     *
     */
    /************************************************************************************/


    _createClass(PeakLimiterNode, [{
        key: 'init',
        value: function init(maxAttackMsIn, releaseMsIn, thresholdIn, maxChannelsIn, maxSampleRateIn) {

            this.attack = Math.floor(maxAttackMsIn * maxSampleRateIn / 1000);
            if (this.attack < 1) {
                /* attack time is too short */
                this.attack = 1;
            }

            /* length of maxBuffer sections */
            this.secLen = Math.floor(Math.sqrt(this.attack + 1));
            /* sqrt(attack+1) leads to the minimum
             of the number of maximum operators:
             nMaxOp = secLen + (attack+1)/secLen */

            /* alloc limiter struct */

            this.nMaxBufferSection = Math.floor((this.attack + 1) / this.secLen);
            if (this.nMaxBufferSection * this.secLen < this.attack + 1) {
                this.nMaxBufferSection++; /* create a full section for the last samples */
            }

            /* alloc maximum and delay Bufferfers */
            this.maxBuffer = new Float32Array(this.nMaxBufferSection * this.secLen);
            this.delayBuffer = new Float32Array(this.attack * maxChannelsIn);
            this.maxBufferSlow = new Float32Array(this.nMaxBufferSection);

            this.input = new Array(maxChannelsIn);
            this.output = new Array(maxChannelsIn);
            for (var j = 0; j < maxChannelsIn; j++) {
                this.input[j] = null;
                this.output[j] = null;
            }

            if (typeof this.maxBuffer == 'undefined' || typeof this.delayBuffer == 'undefined' || typeof this.maxBufferSlow == 'undefined') {
                this.destroy();
                return;
            }
            this.reset();

            /* init parameters & states */
            this.maxBufferIndex = 0;
            this.delayBufferIndex = 0;
            this.maxBufferSlowIndex = 0;
            this.maxBufferSectiontionIndex = 0;
            this.maxBufferSectiontionControl = 0;

            this.attackMs = maxAttackMsIn;
            this.maxAttackMs = maxAttackMsIn;
            this.attackConst = Math.pow(0.1, 1.0 / (this.attack + 1));
            this.releaseConst = Math.pow(0.1, 1.0 / (releaseMsIn * maxSampleRateIn / 1000 + 1));
            this.threshold = thresholdIn;
            this.channels = maxChannelsIn;
            this.maxChannels = maxChannelsIn;
            this.sampleRate = maxSampleRateIn;
            this.maxSampleRate = maxSampleRateIn;

            this.cor = 1.0;
            this.smoothState = 1.0;
            this.minGain = 1.0;
        }

        /************************************************************************************/
        /*!
         *  @brief          release the memory allocated by the object. Memory is allocated when init fucntion is called
         *
         */
        /************************************************************************************/

    }, {
        key: 'destroy',
        value: function destroy() {
            delete this.maxBuffer;
            delete this.delayBuffer;
            delete this.maxBufferSlow;
        }

        /************************************************************************************/
        /*!
         *  @brief          get delay in samples
         *
         */
        /************************************************************************************/

    }, {
        key: 'getDelay',
        value: function getDelay() {
            return this.attack;
        }

        /************************************************************************************/
        /*!
         *  @brief          get attack in msec
         *
         */
        /************************************************************************************/

    }, {
        key: 'getAttack',
        value: function getAttack() {
            return this.attackMs;
        }
    }, {
        key: 'getSampleRate',
        value: function getSampleRate() {
            return this.sampleRate;
        }
    }, {
        key: 'getRelease',
        value: function getRelease() {
            return this.releaseMs;
        }

        /************************************************************************************/
        /*!
         *  @brief          get maximum gain reduction of last processed block
         *
         */
        /************************************************************************************/

    }, {
        key: 'getMaxGainReduction',
        value: function getMaxGainReduction() {
            return -20 * Math.log(this.minGain) / Math.LN10;
        }
    }, {
        key: 'setNChannels',
        value: function setNChannels(nChannelsIn) {
            if (nChannelsIn == this.maxChannels) return true;
            if (nChannelsIn > this.maxChannels) return false;

            this.channels = nChannelsIn;
            this.reset();

            return true;
        }
    }, {
        key: 'setInput',
        value: function setInput(nChannelsInNum, input) {
            if (nChannelsInNum >= this.channels) {
                return false;
            }

            return true;
        }
    }, {
        key: 'setOutput',
        value: function setOutput(nChannelsOutNum, output) {
            if (nChannelsOutNum >= this.channels) {
                return false;
            }

            return true;
        }
    }, {
        key: 'setSampleRate',
        value: function setSampleRate(sampleRateIn) {

            if (sampleRateIn == this.maxSampleRate) return true;
            if (sampleRateIn > this.maxSampleRate) return false;

            /* update attack/release constants */
            this.attack = Math.floor(this.attackMs * sampleRateIn / 1000);

            if (this.attack < 1) /* attack time is too short */
                this.attack = 1;

            /* length of maxBuffer sections */
            this.secLen = Math.floor(Math.sqrt(this.attack + 1));

            this.nMaxBufferSection = Math.floor((this.attack + 1) / this.secLen);
            if (this.nMaxBufferSection * this.secLen < this.attack + 1) this.nMaxBufferSection++;
            this.attackConst = Math.pow(0.1, 1.0 / (this.attack + 1));
            this.releaseConst = Math.pow(0.1, 1.0 / (this.releaseMs * sampleRateIn / 1000 + 1));
            this.sampleRate = sampleRateIn;

            /*reset */
            this.reset();

            return true;
        }
    }, {
        key: 'setAttack',
        value: function setAttack(attackMsIn) {

            if (attackMsIn == this.attackMs) return true;
            if (attackMsIn > this.maxAttackMs) return false;

            /* calculate attack time in samples */
            this.attack = Math.floor(attackMsIn * this.sampleRate / 1000);

            if (this.attack < 1) /* attack time is too short */
                this.attack = 1;

            /* length of maxBuffer sections */
            this.secLen = Math.floor(Math.sqrt(this.attack + 1));

            this.nMaxBufferSection = Math.floor((this.attack + 1) / this.secLen);
            if (this.nMaxBufferSection * this.secLen < this.attack + 1) this.nMaxBufferSection++;
            this.attackConst = Math.pow(0.1, 1.0 / (this.attack + 1));
            this.attackMs = attackMsIn;

            /* reset */
            this.reset();

            return true;
        }
    }, {
        key: 'setRelease',
        value: function setRelease(releaseMsIn) {
            if (releaseMsIn == this.releaseMs) return true;
            this.releaseConst = Math.pow(0.1, 1.0 / (releaseMsIn * this.sampleRate / 1000 + 1));
            this.releaseMs = releaseMsIn;

            return true;
        }
    }, {
        key: 'setThreshold',
        value: function setThreshold(thresholdIn) {
            this.threshold = thresholdIn;

            return true;
        }
    }, {
        key: 'getThreshold',
        value: function getThreshold() {
            return this.threshold;
        }
    }, {
        key: 'reset',
        value: function reset() {

            this.maxBufferIndex = 0;
            this.delayBufferIndex = 0;
            this.maxBufferSlowIndex = 0;
            this.maxBufferSectiontionIndex = 0;
            this.maxBufferSectiontionControl = 0;
            this.cor = 1.0;
            this.smoothState = 1.0;
            this.minGain = 1.0;

            for (var i = 0; i < this.attack + 1; i++) {
                this.maxBuffer[i] = 0;
            }
            for (var i = 0; i < this.attack * this.channels; i++) {
                this.delayBuffer[i] = 0;
            }
            for (var i = 0; i < this.nMaxBufferSection; i++) {
                this.maxBufferSlow[i] = 0;
            }

            return true;
        }
    }]);

    return PeakLimiterNode;
}(_index2.default);

exports.default = PeakLimiterNode;