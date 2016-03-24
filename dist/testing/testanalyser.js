'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testAnalysisNode = testAnalysisNode;

var _analysis = require('../dsp/analysis.js');

var _analysis2 = _interopRequireDefault(_analysis);

var _phone = require('../dsp/phone.js');

var _phone2 = _interopRequireDefault(_phone);

var _bufferutils = require('../core/bufferutils.js');

var _bufferutils2 = _interopRequireDefault(_bufferutils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
function testAnalysisNode() {

    var sampleRate = 44100;
    var bufferSize = 512;
    var numChannels = 4;

    /// create an online audio context, for the analyser node
    var audioContext1 = new AudioContext(numChannels, bufferSize, sampleRate);

    /// create a test buffer
    var buffer = audioContext1.createBuffer(numChannels, bufferSize, sampleRate);

    _bufferutils2.default.makeNoise(buffer, 1, 0);
    _bufferutils2.default.makeNoise(buffer, 2, -6);

    /// create a buffer source
    var bufferSource = audioContext1.createBufferSource();
    bufferSource.loop = true;

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    var analysisNode = new _analysis2.default(audioContext1);

    /// configure the analysis node
    {
        // default values
        analysisNode._analyser.ftSize = 128;
        analysisNode._analyser.minDecibels = -150;
        analysisNode._analyser.maxDecibels = 0;
        analysisNode._analyser.smoothingTimeConstant = 0.2;
        analysisNode._voiceMinFrequency = 300;
        analysisNode._voiceMaxFrequency = 4000;
    }

    /// connect the node to the buffer source
    var phoneNode = new _phone2.default();
    phoneNode.gain = 6;

    bufferSource.connect(phoneNode._input);

    phoneNode._output.connect(analysisNode._input, 1);

    /// connect the node to the destination of the audio context
    analysisNode._output.connect(audioContext1.destination);

    /// start the rendering
    bufferSource.start(0);

    window.setInterval(function () {
        var rms = analysisNode.getRMS();
        console.log('RMS: ' + rms);

        var emergence = analysisNode.getVoiceEmergence();
        console.log('Voice emergence: ' + emergence);
    }, 1000);
}

//==============================================================================
/************************************************************************************/
/*!
 *   @file       testanalyser.js
 *   @brief      Misc test functions for M4DPAudioModules.PhoneNode
 *   @author     Thibaut Carpentier, Jean-Philippe Lambert
 *   @date       04/2016
 *
 */
/************************************************************************************/

var analysistests = {
    testAnalysisNode: testAnalysisNode
};

exports.default = analysistests;