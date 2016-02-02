'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testRouting = testRouting;

var _bufferutils = require('../core/bufferutils.js');

var _bufferutils2 = _interopRequireDefault(_bufferutils);

var _routing = require('../multichannel-spatialiser/routing.js');

var _routing2 = _interopRequireDefault(_routing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
/************************************************************************************/
/*!
 *   @file       testrouting.js
 *   @brief      Misc test functions for 5.1
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

function testRouting() {

    var sampleRate = 44100;
    var bufferSize = 512;
    var numInputs = 10;
    var numOutputs = 6; /// 5.1

    /// create an offline audio context
    var audioContext1 = new OfflineAudioContext(numOutputs, bufferSize, sampleRate);

    /// create a test buffer
    var buffer = audioContext1.createBuffer(numInputs, bufferSize, sampleRate);

    /// just a precaution
    _bufferutils2.default.clearBuffer(buffer);
    for (var i = 0; i < numInputs; i++) {
        _bufferutils2.default.fillChannel(buffer, i, (i + 1) * 0.1);
    }

    /// create a buffer source
    var bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    var routingNode = new _routing2.default(audioContext1);

    /// connect the node to the buffer source
    bufferSource.connect(routingNode.input);

    routingNode.connect(audioContext1.destination);

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
var routingtests = {
    testRouting: testRouting
};

exports.default = routingtests;