'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testPhoneNode = testPhoneNode;

var _phone = require('../dsp/phone.js');

var _phone2 = _interopRequireDefault(_phone);

var _bufferutils = require('../core/bufferutils.js');

var _bufferutils2 = _interopRequireDefault(_bufferutils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
/************************************************************************************/
/*!
 *   @file       testphone.js
 *   @brief      Misc test functions for M4DPAudioModules.PhoneNode
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

function testPhoneNode() {

    var sampleRate = 44100;
    var bufferSize = 512;
    var numChannels = 4;

    /// create an offline audio context
    var audioContext1 = new OfflineAudioContext(numChannels, bufferSize, sampleRate);

    /// create a test buffer
    var buffer = audioContext1.createBuffer(numChannels, bufferSize, sampleRate);

    /// just a precaution
    _bufferutils2.default.clearBuffer(buffer);
    _bufferutils2.default.makeImpulse(buffer, 0, 0);
    _bufferutils2.default.makeImpulse(buffer, 1, 10);
    _bufferutils2.default.makeNoise(buffer, 2, 0);
    _bufferutils2.default.makeNoise(buffer, 3, -6);

    /// create a buffer source
    var bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    var phoneNode = new _phone2.default(audioContext1);

    /// configure the phone filter
    {
        phoneNode.gain = 6; // NOT default, default is 0

        phoneNode.frequency = 1200; // default
        phoneNode.q = 1; // default
    }

    /// connect the node to the buffer source
    bufferSource.connect(phoneNode._input);

    /// connect the node to the destination of the audio context
    phoneNode._output.connect(audioContext1.destination);

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
var phonetests = {
    testPhoneNode: testPhoneNode
};

exports.default = phonetests;