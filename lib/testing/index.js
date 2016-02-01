/************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      Export test modules
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

import biquadtests from './testbiquad.js'
import cascadetests from './testcascade.js'
import sofatests from './testsofa.js'
import binauraltests from './testbinaural.js'
import sumdifftests from './testsumdiff.js'
import transauraltests from './testtransaural.js'

//==============================================================================
const unittests = {
    biquadtests,
    cascadetests,  
    sofatests,
    binauraltests,
    sumdifftests,
    transauraltests,
};

export default unittests;
