'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testTransauralShuffler = testTransauralShuffler;

var _transaural = require('../dsp/transaural.js');

var _bufferutils = require('../core/bufferutils.js');

var _bufferutils2 = _interopRequireDefault(_bufferutils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
/************************************************************************************/
/*!
 *   @file       testtransaural.js
 *   @brief      Misc test functions for M4DPAudioModules.TransauralShufflerNode
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

function testTransauralShuffler() {

    var sampleRate = 44100;
    var bufferSize = 512;
    var numChannels = 2;

    /// create an offline audio context
    var audioContext1 = new OfflineAudioContext(numChannels, bufferSize, sampleRate);

    /// create a test buffer
    var buffer = audioContext1.createBuffer(numChannels, bufferSize, sampleRate);

    /// just a precaution
    _bufferutils2.default.clearBuffer(buffer);
    _bufferutils2.default.makeImpulse(buffer, 1, 0);

    /// create a buffer source
    var bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    var transauralNode_ = new _transaural.TransauralShufflerNode(audioContext1);

    /// connect the node to the buffer source
    bufferSource.connect(transauralNode_.input);

    /// connect the node to the destination of the audio context
    transauralNode_._output.connect(audioContext1.destination);

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
var transauraltests = {
    testTransauralShuffler: testTransauralShuffler
};

exports.default = transauraltests;