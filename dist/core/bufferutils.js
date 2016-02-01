"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.writeBufferToTextFileWithMatlabFormat = writeBufferToTextFileWithMatlabFormat;
exports.writeBufferToTextFile = writeBufferToTextFile;
exports.fillChannel = fillChannel;
exports.clearBufferChannel = clearBufferChannel;
exports.clearBuffer = clearBuffer;
exports.makeImpulse = makeImpulse;
/************************************************************************************/
/*!
 *   @file       bufferutils.js
 *   @brief      Misc utility functions for AudioBuffer manipulation
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

//==============================================================================
/**
 * Writes some text into a file.
 * The file can later be downloaded
 * The function returns the download URL
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
 * Fills one channel of an AudioBuffer
 * @type {AudioBuffer} buffer
 * @type {int} channelIndex
 * @type {number} value
 */
function fillChannel(buffer) {
    var channelIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    var value = arguments.length <= 2 || arguments[2] === undefined ? 0.0 : arguments[2];

    var numChannels = buffer.numberOfChannels;
    var numSamples = buffer.length;

    /// boundary check
    if (channelIndex < 0 || channelIndex >= numChannels) {
        throw new Error("Invalid channelIndex");
    }

    var channel_ = buffer.getChannelData(channelIndex);

    for (var j = 0; j < numSamples; j++) {
        channel_[j] = value;
    }
}

//==============================================================================
/**
 * Fills one channel of a buffer with 0
 * @type {AudioBuffer} buffer
 * @type {int} channelIndex
 */
function clearBufferChannel(buffer, channelIndex) {

    fillChannel(buffer, channelIndex, 0.0);
}

//==============================================================================
/**
 * Fills all channels of a buffer with 0
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
var bufferutilities = {
    writeBufferToTextFileWithMatlabFormat: writeBufferToTextFileWithMatlabFormat,
    writeBufferToTextFile: writeBufferToTextFile,
    clearBufferChannel: clearBufferChannel,
    clearBuffer: clearBuffer,
    makeImpulse: makeImpulse,
    fillChannel: fillChannel
};

exports.default = bufferutilities;