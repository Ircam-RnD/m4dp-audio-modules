'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testSumDiffNode = testSumDiffNode;

var _sumdiff = require('../dsp/sumdiff.js');

var _sumdiff2 = _interopRequireDefault(_sumdiff);

var _bufferutils = require('../core/bufferutils.js');

var _bufferutils2 = _interopRequireDefault(_bufferutils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
/************************************************************************************/
/*!
 *   @file       testcascade.js
 *   @brief      Misc test functions for M4DPAudioModules.SumDiffNode
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

function testSumDiffNode() {

    var sampleRate = 44100;
    var bufferSize = 512;
    var numChannels = 2;

    /// create an offline audio context
    var audioContext1 = new OfflineAudioContext(numChannels, bufferSize, sampleRate);

    /// create a test buffer
    var buffer = audioContext1.createBuffer(numChannels, bufferSize, sampleRate);

    /// just a precaution
    _bufferutils2.default.clearBuffer(buffer);
    _bufferutils2.default.fillChannel(buffer, 0, 0.2);
    _bufferutils2.default.fillChannel(buffer, 1, 0.7);

    /// create a buffer source
    var bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    var sumDiffNode_ = new M4DPAudioModules.SumDiffNode(audioContext1);

    /// connect the node to the buffer source
    bufferSource.connect(sumDiffNode_.input);

    /// connect the node to the destination of the audio context
    sumDiffNode_._output.connect(audioContext1.destination);

    /// prepare the rendering
    var localTime = 0;
    bufferSource.start(localTime);

    /// receive notification when the rendering is completed
    audioContext1.oncomplete = function (output) {

        var buf = output.renderedBuffer;

        var bufUrl = _bufferutils2.default.writeBufferToTextFileWithMatlabFormat(buf);
        console.log("buffer URL :  " + bufUrl);

        debugger;
    };

    /// start rendering
    audioContext1.startRendering();
}

//==============================================================================
var sumdifftests = {
    testSumDiffNode: testSumDiffNode
};

exports.default = sumdifftests;