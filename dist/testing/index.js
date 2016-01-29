'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testBiquadNode = testBiquadNode;
exports.testCascadeNode = testCascadeNode;
exports.testBinaural = testBinaural;

var _index = require('../index.js');

var _index2 = _interopRequireDefault(_index);

var _binaural = require('binaural');

var _binaural2 = _interopRequireDefault(_binaural);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
/**
 * Writes some text into a file.
 * The file can later be downloaded
 * The function returns the download URL
 */
/**
 * Some test functions
 * For debug purposes only
 */

function writeTextDataToFile(text) {
    var textFile = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    var data = new Blob([text], { type: 'text/plain' });

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return textFile;
};

//==============================================================================
/**
 * Writes a buffer to a text file and returns the URL of the downloadable file
 * The text file is formatted so that it can be easily copy/paste into Matlab
 * 
 * @type {AudioBuffer} buffer
 */
function writeBufferToTextFileWithMatlabFormat(buffer) {

    var numChannels = buffer.numberOfChannels;
    var numSamples = buffer.length;

    var text = "";

    text += "printing buffer :" + "\n";
    text += "numChannels = " + numChannels + "\n";
    text += "numSamples  = " + numSamples + "\n";

    var numDecimals = 9;

    for (var i = 0; i < numChannels; i++) {

        var channel_ = buffer.getChannelData(i);

        text += "channel(" + (i + 1) + ", 1:" + numSamples + ") = ";
        text += "...\n";

        text += "[ ";

        for (var j = 0; j < numSamples; j++) {
            var value = channel_[j];

            var valueAsString = value.toFixed(numDecimals);

            text += valueAsString;
            text += " ";
        }
        text += " ];";

        text += "\n";
    }

    return writeTextDataToFile(text);
}

/**
 * Writes a buffer to a text file and returns the URL of the downloadable file
 * @type {AudioBuffer} buffer
 */
function writeBufferToTextFile(buffer) {

    var numChannels = buffer.numberOfChannels;
    var numSamples = buffer.length;

    var text = "";

    text += "printing buffer :" + "\n";
    text += "numChannels = " + numChannels + "\n";
    text += "numSamples  = " + numSamples + "\n";

    var numDecimals = 9;

    for (var i = 0; i < numChannels; i++) {

        var channel_ = buffer.getChannelData(i);

        text += "channel[" + i + "] = ";
        text += "\n";

        for (var j = 0; j < numSamples; j++) {
            var value = channel_[j];

            var valueAsString = value.toFixed(numDecimals);

            text += valueAsString;
            text += " ";
        }
        text += "\n";
    }

    return writeTextDataToFile(text);
}

//==============================================================================
/**
 * Fills one channel of a buffer with 0
 * @type {AudioBuffer} buffer
 */
function clearBufferChannel(buffer, channelIndex) {

    var numChannels = buffer.numberOfChannels;
    var numSamples = buffer.length;

    /// boundary check
    if (channelIndex < 0 || channelIndex >= numChannels) {
        throw new Error("Invalid channelIndex");
    }

    var channel_ = buffer.getChannelData(channelIndex);

    for (var j = 0; j < numSamples; j++) {
        channel_[j] = 0.0;
    }
}

/**
 * Fills all channel of a buffer with 0
 * @type {AudioBuffer} buffer
 */
function clearBuffer(buffer) {

    var numChannels = buffer.numberOfChannels;

    for (var i = 0; i < numChannels; i++) {

        clearBufferChannel(buffer, i);
    }
}

/**
 * Creates a Dirac in one given channel of the AudioBuffer
 * @type {AudioBuffer} buffer
 * @type {int} channelIndex
 * @type {int} sampleIndex
 */
function makeImpulse(buffer) {
    var channelIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    var sampleIndex = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

    var numChannels = buffer.numberOfChannels;
    var numSamples = buffer.length;

    /// boundary check
    if (channelIndex < 0 || channelIndex >= numChannels) {
        throw new Error("Invalid channelIndex");
    }

    /// boundary check
    if (sampleIndex < 0 || sampleIndex >= numSamples) {
        throw new Error("Invalid sampleIndex");
    }

    /// first clear the channel
    clearBufferChannel(buffer, channelIndex);

    /// then create a Dirac
    var channel_ = buffer.getChannelData(channelIndex);
    channel_[sampleIndex] = 1.0;
}

//==============================================================================
function testBiquadNode() {

    var sampleRate = 44100;
    var bufferSize = 512;
    var numChannels = 4;

    /// create an offline audio context
    var audioContext1 = new OfflineAudioContext(numChannels, bufferSize, sampleRate);

    /// create a test buffer
    var buffer = audioContext1.createBuffer(numChannels, bufferSize, sampleRate);

    /// just a precaution
    clearBuffer(buffer);
    makeImpulse(buffer, 0, 0);
    makeImpulse(buffer, 1, 10);

    /// create a buffer source
    var bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    var biquadNode = audioContext1.createBiquadFilter();

    /// configure the biquad filter
    {
        biquadNode.type = "lowpass";

        /// It is expressed in dB, has a default value of 0 and can take a value in a nominal range of -40 to 40
        biquadNode.gain.value = 10;

        /// measured in hertz (Hz)
        biquadNode.frequency.value = 1000;

        /// It is a dimensionless value with a default value of 1 and a nominal range of 0.0001 to 1000.
        biquadNode.Q.value = 10;
    }

    /// connect the node to the buffer source
    bufferSource.connect(biquadNode);

    /// connect the node to the destination of the audio context
    biquadNode.connect(audioContext1.destination);

    /// prepare the rendering
    var localTime = 0;
    bufferSource.start(localTime);

    /// receive notification when the rendering is completed
    audioContext1.oncomplete = function (output) {

        var buf = output.renderedBuffer;

        var bufUrl = writeBufferToTextFileWithMatlabFormat(buf);
        console.log("buffer URL :  " + bufUrl);

        debugger;
    };

    /// start rendering
    audioContext1.startRendering();
}

//==============================================================================
function testCascadeNode() {

    var sampleRate = 44100;
    var bufferSize = 512;
    var numChannels = 4;

    /// create an offline audio context
    var audioContext1 = new OfflineAudioContext(numChannels, bufferSize, sampleRate);

    /// create a test buffer
    var buffer = audioContext1.createBuffer(numChannels, bufferSize, sampleRate);

    /// just a precaution
    clearBuffer(buffer);
    makeImpulse(buffer, 0, 0);
    makeImpulse(buffer, 1, 10);

    /// create a buffer source
    var bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    var cascadeNode = new M4DPAudioModules.CascadeNode(audioContext1);

    /// configure the cascade filter
    {
        cascadeNode.numCascades = 2;

        cascadeNode.setType(0, "peaking");
        cascadeNode.setType(1, "peaking");

        /// It is expressed in dB, has a default value of 0 and can take a value in a nominal range of -40 to 40
        cascadeNode.setGain(0, 6);
        cascadeNode.setGain(1, 6);

        /// measured in hertz (Hz)
        cascadeNode.setFrequency(0, 1000);
        cascadeNode.setFrequency(1, 8000);

        /// It is a dimensionless value with a default value of 1 and a nominal range of 0.0001 to 1000.
        cascadeNode.setQ(0, 10);
        cascadeNode.setQ(1, 10);
    }

    /// connect the node to the buffer source
    bufferSource.connect(cascadeNode.input);

    /// connect the node to the destination of the audio context
    cascadeNode._output.connect(audioContext1.destination);

    cascadeNode.bypass = true;

    /// prepare the rendering
    var localTime = 0;
    bufferSource.start(localTime);

    /// receive notification when the rendering is completed
    audioContext1.oncomplete = function (output) {

        var buf = output.renderedBuffer;

        var bufUrl = writeBufferToTextFileWithMatlabFormat(buf);
        console.log("buffer URL :  " + bufUrl);

        debugger;
    };

    /// start rendering
    audioContext1.startRendering();
}

//==============================================================================
function testBinaural() {

    var audio = _binaural2.default.audio.utilities;
    var Source = _binaural2.default.audio.Source;
    var HrtfSet = _binaural2.default.sofa.HrtfSet;
    var ServerDataBase = _binaural2.default.sofa.ServerDataBase;

    var audioContext = new window.AudioContext();

    var noiseBuffer = audio.createNoiseBuffer({
        audioContext: audioContext,
        channelCount: 1,
        duration: 5,
        gain: -20
    });

    var positionsType = 'sofaSpherical';
    var testPositions = [[30, 0, 2], // front-left
    [0, 0, 2], // centre
    [-30, 0, 2]];

    // front-right
    var testPositionsName = ['front-left', 'centre', 'front-right'];

    var hrtfSet = new HrtfSet({
        audioContext: audioContext,
        filterPositions: testPositions,
        positionsType: positionsType
    });

    console.log('accessing server');
    var serverDataBase = new ServerDataBase();

    serverDataBase.loadCatalogue().then(function () {

        return serverDataBase.getUrls({
            convention: 'HRIR',
            dataBase: 'BILI',
            equalisation: 'COMPENSATED',
            sampleRate: audioContext.sampleRate,
            freePattern: '1147'
        });
    }).then(function (urls) {
        console.log('loading HRTF set');
        return hrtfSet.load(urls[0]);
    }).then(function () {
        console.log('activate audio');
        return new Promise(function (resolve, reject) {
            var now = audioContext.currentTime;
            if (now === 0) {
                console.log('manually start audio context');
                if (window.confirm('Start Audio?')) {
                    var gain = audioContext.createGain();
                    gain.gain.value = 0;
                    gain.connect(audioContext.destination);

                    var noiseBufferSource = audioContext.createBufferSource();
                    noiseBufferSource.buffer = noiseBuffer;
                    noiseBufferSource.loop = true;

                    noiseBufferSource.connect(gain);
                    noiseBufferSource.start(now);
                    noiseBufferSource.stop(now + 0.3);
                    resolve();
                } else {
                    reject(new Error('Audio not started'));
                }
            } else {
                resolve();
            }
        });
    }).then(function () {
        console.log('testing sources');
        testPositions.forEach(function (position, index) {
            var positionName = testPositionsName[index];
            console.log('Test for source on the ' + positionName);
            return new Promise(function (resolve) {
                var source = new Source({
                    audioContext: audioContext,
                    hrtfSet: hrtfSet,
                    position: position
                });

                var noiseBufferSource = audioContext.createBufferSource();
                noiseBufferSource.buffer = noiseBuffer;
                noiseBufferSource.loop = true;

                source.inputConnect(noiseBufferSource);
                noiseBufferSource.start(0);

                source.outputConnect(audioContext.destination);

                if (window.confirm('Is sound on the ' + positionName + '?')) {
                    resolve(noiseBufferSource);
                } else {
                    // resolve any way to stop sound
                    resolve(noiseBufferSource);
                }
            }).then(function (noiseBufferSource) {
                noiseBufferSource.stop(0);
            });
        });
    }); // for each position
}

/// @n technique pour avoir un pseudo-namespace
var unittests = {
    testBiquadNode: testBiquadNode,
    testCascadeNode: testCascadeNode,
    testBinaural: testBinaural
};

exports.default = unittests;