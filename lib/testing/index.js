/**
 * Some test functions
 * For debug purposes only
 */


import biquadtests from './testbiquad.js'
import cascadetests from './testcascade.js'
import sofatests from './testsofa.js'
import binauraltests from './testbinaural.js'


/// @n technique pour avoir un pseudo-namespace
const unittests = {
    biquadtests,
    cascadetests,  
    sofatests,
    binauraltests,
};

export default unittests;
