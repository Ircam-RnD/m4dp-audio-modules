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

    var numChannels = 4;

    /// create an online audio context, for the analyser node
    var audioContext1 = new AudioContext();

    /// create a test buffer
    var sampleRate = audioContext1.sampleRate;
    var bufferSize = 3 * sampleRate; // 3 seconds
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

    // global references for testing
    window.test = typeof window.test !== 'undefined' ? window.test : {};

    window.test.analysisNode = analysisNode;

    /// configure the analysis node
    {
        // default values
        analysisNode.analyserFftSize = 2048;
        analysisNode.analyserMinDecibels = -100;
        analysisNode.analyserMaxDecibels = -30;
        analysisNode.analyserSmoothingTimeConstant = 0.85;
        analysisNode.voiceMinFrequency = 300;
        analysisNode.voiceMaxFrequency = 4000;
    }

    /// connect the node to the buffer source
    var phoneNode = new _phone2.default(audioContext1);
    window.test.phoneNode = phoneNode;

    phoneNode.gain = 6;

    bufferSource.connect(phoneNode._input);

    var splitterNode = audioContext1.createChannelSplitter(4);

    phoneNode._output.connect(splitterNode);

    splitterNode.connect(analysisNode._input, 1, 0);

    /// connect the node to the destination of the audio context
    analysisNode._output.connect(audioContext1.destination);

    /// start the rendering
    bufferSource.start(0);

    window.setInterval(function () {
        var rms = analysisNode.getRMS();
        console.log('RMS: ' + rms);

        var emergence = analysisNode.getVoiceEmergence();
        console.log('Voice emergence: ' + emergence);
    }, 100);
}

//==============================================================================
/************************************************************************************/
/*!
 *   @file       testanalyser.js
 *   @brief      Misc test functions for M4DPAudioModules.PhoneNode
 *   @author     Thibaut Carpentier, Jean-Philippe Lambert / Ircam CNRS UMR9912
 *   @date       04/2016
 *
 */
/************************************************************************************/

var analysistests = {
    testAnalysisNode: testAnalysisNode
};

exports.default = analysistests;