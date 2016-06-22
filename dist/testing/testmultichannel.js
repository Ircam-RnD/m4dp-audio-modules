"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testMultiChannel = testMultiChannel;

var _bufferutils = require("../core/bufferutils.js");

var _bufferutils2 = _interopRequireDefault(_bufferutils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
function testMultiChannel() {

    var sampleRate = 44100;
    var bufferSize = 512;
    var numChannels = 6; /// 5.1

    /// create an offline audio context
    var audioContext1 = new OfflineAudioContext(numChannels, bufferSize, sampleRate);

    /// create a test buffer
    var buffer = audioContext1.createBuffer(numChannels, bufferSize, sampleRate);

    /// just a precaution
    _bufferutils2.default.clearBuffer(buffer);
    _bufferutils2.default.fillChannel(buffer, 0, 0.1);
    _bufferutils2.default.fillChannel(buffer, 1, 0.2);
    _bufferutils2.default.fillChannel(buffer, 2, 0.3);
    _bufferutils2.default.fillChannel(buffer, 3, 0.4);
    _bufferutils2.default.fillChannel(buffer, 4, 0.5);
    _bufferutils2.default.fillChannel(buffer, 5, 0.6);

    /// create a buffer source
    var bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    bufferSource.connect(audioContext1.destination);

    /// prepare the rendering
    var localTime = 0;
    bufferSource.start(localTime);

    /// receive notification when the rendering is completed
    audioContext1.oncomplete = function (output) {

        var buf = output.renderedBuffer;

        var bufUrl = _bufferutils2.default.writeBufferToTextFileWithMatlabFormat(buf);
        console.log("buffer URL :  " + bufUrl);

        ///@n it seems that the audioContext1.destination has only 2 channels
        /// as long as no multichannel audio device is plugged ?

        debugger;
    };

    /// start rendering
    audioContext1.startRendering();
}

//==============================================================================
/************************************************************************************/
/*!
 *   @file       testmultichannel.js
 *   @brief      Misc test functions for 5.1
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

var multichanneltests = {
    testMultiChannel: testMultiChannel
};

exports.default = multichanneltests;