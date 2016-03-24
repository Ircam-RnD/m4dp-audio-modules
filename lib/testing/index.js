/************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      Export test modules
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

import biquadtests from './testbiquad.js';
import cascadetests from './testcascade.js';
import analysistests from './testanalysis.js';
import phonetests from './testphone.js';
import sofatests from './testsofa.js';
import binauraltests from './testbinaural.js';
import sumdifftests from './testsumdiff.js';
import transauraltests from './testtransaural.js';
import multichanneltests from './testmultichannel.js';
import routingtests from './testrouting.js';

//==============================================================================
const unittests = {
    biquadtests,
    cascadetests, 
    analysistests,
    phonetests,
    sofatests,
    binauraltests,
    sumdifftests,
    transauraltests,
    multichanneltests,
    routingtests,
};

export default unittests;
