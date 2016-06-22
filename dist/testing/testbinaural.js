'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.testBinauralNode = testBinauralNode;

var _testsofa = require('./testsofa.js');

var _testsofa2 = _interopRequireDefault(_testsofa);

var _bufferutils = require('../core/bufferutils.js');

var _bufferutils2 = _interopRequireDefault(_bufferutils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
/// This does not test anything; this just enters in debug mode, to inspect the buffers
/************************************************************************************/
/*!
 *   @file       testbinaural.js
 *   @brief      Misc test function for binaural
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

function testBinauralNode() {

	var sampleRate = 44100;

	_testsofa2.default.getHrir(1147, sampleRate, -30, 0).then(function (hrir) {
		var leftHrir = hrir.getChannelData(0);
		var rightHrir = hrir.getChannelData(1);

		var bufferSize = 4096;
		var numChannels = 2;

		/// create an offline audio context
		var audioContext1 = new OfflineAudioContext(2, bufferSize, sampleRate);

		/// create a test buffer
		var buffer = audioContext1.createBuffer(1, bufferSize, sampleRate);

		/// just a precaution
		_bufferutils2.default.clearBuffer(buffer);
		_bufferutils2.default.makeImpulse(buffer, 0, 0);

		var convolver = audioContext1.createConvolver();

		/// create a buffer source
		var bufferSource = audioContext1.createBufferSource();

		/// reference the test buffer with the buffer source
		bufferSource.buffer = buffer;

		{
			convolver.normalize = false;
			convolver.buffer = hrir;
		}

		/// connect the node to the buffer source
		bufferSource.connect(convolver);

		/// connect the node to the destination of the audio context
		convolver.connect(audioContext1.destination);

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

		debugger;
	});
}

//==============================================================================
var binauraltests = {
	testBinauralNode: testBinauralNode
};

exports.default = binauraltests;