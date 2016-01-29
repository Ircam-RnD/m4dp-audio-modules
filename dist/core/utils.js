"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.clamp = clamp;
exports.scale = scale;
exports.lin2dB = lin2dB;
exports.dB2lin = dB2lin;
exports.arrayAlmostEqual = arrayAlmostEqual;
/************************************************************************************/
/*!
 *   @file       utils.js
 *   @brief      Misc utility functions
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/
/**
 * Clips a value within a given range
 * @type {number} value the value to be clipped
 * @type {number} min the lower bound
 * @type {number} max the upper bound
 *
 */
function clamp(value, min, max) {

    if (max < min) {
        throw new Error("pas bon");
    }

    return Math.max(min, Math.min(value, max));
}

/**
 * linear rescaling bases on input and output domains
 *
 */
function scale(value, minIn, maxIn, minOut, maxOut) {

    if (maxIn === minIn) {
        throw new Error("pas bon");
    }

    var normalized = (value - minIn) / (maxIn - minIn);

    return minOut + normalized * (maxOut - minOut);
}

/**
 * linear gain to decibel conversion
 *
 */
function lin2dB(value) {

    if (value <= 0) {
        throw new Error("pas bon");
    }

    return 20 * Math.log10(value);
}

/**
 * amplitude decibel to linear gain conversion
 *
 */
function dB2lin(value) {
    return Math.pow(10, value / 20);
}

/**
 * Compares two array. Returns true if they are (almost) equal
 *
 */
function arrayAlmostEqual(array1, array2) {
    var tolerance = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

    if (tolerance < 0.0) {
        throw new Error("pas bon");
    }

    if (array1.length != array2.length) {
        return false;
    }

    var size = array1.length;

    for (var i = 0; i < size; i++) {
        var val1 = array1[i];
        var val2 = array2[i];
        var diff = Math.abs(val1 - val2);

        if (diff > tolerance) {
            return false;
        }
    }

    return true;
}

//==============================================================================
var utilities = {
    clamp: clamp,
    scale: scale,
    lin2dB: lin2dB,
    dB2lin: dB2lin,
    arrayAlmostEqual: arrayAlmostEqual
};

exports.default = utilities;