"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clamp = clamp;
exports.scale = scale;
exports.lin2dB = lin2dB;
exports.dB2lin = dB2lin;
/**
 * Utilities functions
 */

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

/// @n technique pour avoir un pseudo-namespace
var utilities = {
  clamp: clamp,
  scale: scale,
  lin2dB: lin2dB,
  dB2lin: dB2lin
};

exports.default = utilities;