"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.smin = smin;
exports.mean = mean;
exports.clamp = clamp;
exports.scale = scale;
exports.lin2dB = lin2dB;
exports.lin2powdB = lin2powdB;
exports.lin2dBsafe = lin2dBsafe;
exports.dB2lin = dB2lin;
exports.arrayAlmostEqual = arrayAlmostEqual;
exports.deg2rad = deg2rad;
exports.rad2deg = rad2deg;
exports.modulo = modulo;
exports.nav2trig = nav2trig;
exports.trig2nav = trig2nav;
exports.ms2sec = ms2sec;
exports.sec2ms = sec2ms;
/************************************************************************************/
/*!
 *   @file       utils.js
 *   @brief      Misc utility functions
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

/************************************************************************************/
/*!
 *  @brief          template ternary minimum function
 *  @return         minimum of a, b and c
 *
 */
/************************************************************************************/
function smin(x, y, z) {
    return Math.min(Math.min(x, y), z);
}

function mean(array) {
    if (array.length === 0) {
        throw new Error("pas bon");
    }

    var total = 0;
    for (var i = 0; i < array.length; i++) {
        total += array[i];
    }
    var avg = total / array.length;

    return avg;
}

/************************************************************************************/
/*!
 *  @brief          ensure x is within range [min,max] with saturation (out of place)
 *
 */
/************************************************************************************/
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

/************************************************************************************/
/*!
 *  @brief          linear gain to decibel conversion
 *  @param[in]      lin : linear value
 *
 *  @details        y = 20 * log10( x )
 *	@n				similar to Max/MSP atodb
 */
/************************************************************************************/
function lin2dB(value) {
    if (value <= 0) {
        throw new Error("pas bon");
    }

    return 20 * Math.log10(value);
}

/************************************************************************************/
/*!
 *  @brief          linear gain to power decibel conversion
 *  @param[in]      lin : linear value
 *
 *  @details        y = 10 * log10( x )
 */
/************************************************************************************/
function lin2powdB(value) {
    if (value <= 0) {
        throw new Error("pas bon");
    }

    return 10. * Math.log10(value);
}

/************************************************************************************/
/*!
 *  @brief          "safe" version of lin2dB()
 *  @param[in]      x : linear value
 *  @param[in]      eps : safety margin
 *
 *  @details        y = 20 * log10( x )
 *	@n				similar to Max/MSP atodb
 */
/************************************************************************************/
function lin2dBsafe(value) {
    return 20 * Math.log10(Math.max(value, 1e-9));
}

/************************************************************************************/
/*!
 *  @brief          amplitude decibel to linear gain conversion
 *  @param[in]      dB : value in decibels
 *
 *  @details        y = 10^( x / 20 )
 */
/************************************************************************************/
function dB2lin(value) {
    return Math.pow(10, value / 20);
}

/**
 * Compares two array. Returns true if they are (almost) equal
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

/************************************************************************************/
/*!
 *  @brief          degrees to radians conversion
 *  @param[in]      degrees : angle expressed in degrees
 *
 */
/************************************************************************************/
function deg2rad(value) {
    return value * 0.017453292520;
}

/************************************************************************************/
/*!
 *  @brief          radians to degrees conversion
 *  @param[in]      radians : angle expressed in radians
 *
 */
/************************************************************************************/
function rad2deg(value) {
    return value * 57.295779513082;
}

/************************************************************************************/
/*!
 *  @brief          modulo (%) binary operator returning positive results
 *  @param[in]      x
 *  @param[in]      modulo
 *
 */
/************************************************************************************/
function modulo(x, modu) {
    var y = x;
    while (y < 0.0) {
        y += modu;
    }

    while (y >= modu) {
        y -= modu;
    }

    return y;
}

/************************************************************************************/
/*!
 *  @brief          navigationnal to trigonometric conversion
 *
 *  @details        navigationnal is expressed in degrees, clock-wise with 0 deg at (x,y)=(0,1)
 *                  trigonometric is expressed in radians, anticlock-wise with 0 deg at (x,y)=(1,0)
 */
/************************************************************************************/
function nav2trig(x) {
    return deg2rad(modulo(270.0 - x, 360.0) - 180.0);
}

/************************************************************************************/
/*!
 *  @brief          trigonometric to navigationnal conversion
 *
 *  @details        navigationnal is expressed in degrees, clock-wise with 0 deg at (x,y)=(0,1)
 *                  trigonometric is expressed in radians, anticlock-wise with 0 deg at (x,y)=(1,0)
 */
/************************************************************************************/
function trig2nav(x) {
    return modulo(270.0 - rad2deg(x), 360.0) - 180.0;
}

//==============================================================================
/**
 * msec -> seconds
 */
function ms2sec(ms) {
    return ms / 1000.;
}

function sec2ms(sec) {
    return sec * 1000;
}

//==============================================================================
var utilities = {
    smin: smin,
    mean: mean,
    clamp: clamp,
    scale: scale,
    lin2dB: lin2dB,
    lin2dBsafe: lin2dBsafe,
    lin2powdB: lin2powdB,
    dB2lin: dB2lin,
    deg2rad: deg2rad,
    rad2deg: rad2deg,
    modulo: modulo,
    nav2trig: nav2trig,
    trig2nav: trig2nav,
    ms2sec: ms2sec,
    sec2ms: sec2ms,
    arrayAlmostEqual: arrayAlmostEqual
};

exports.default = utilities;