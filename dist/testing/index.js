'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _testbiquad = require('./testbiquad.js');

var _testbiquad2 = _interopRequireDefault(_testbiquad);

var _testcascade = require('./testcascade.js');

var _testcascade2 = _interopRequireDefault(_testcascade);

var _testanalysis = require('./testanalysis.js');

var _testanalysis2 = _interopRequireDefault(_testanalysis);

var _testphone = require('./testphone.js');

var _testphone2 = _interopRequireDefault(_testphone);

var _testsofa = require('./testsofa.js');

var _testsofa2 = _interopRequireDefault(_testsofa);

var _testbinaural = require('./testbinaural.js');

var _testbinaural2 = _interopRequireDefault(_testbinaural);

var _testsumdiff = require('./testsumdiff.js');

var _testsumdiff2 = _interopRequireDefault(_testsumdiff);

var _testtransaural = require('./testtransaural.js');

var _testtransaural2 = _interopRequireDefault(_testtransaural);

var _testmultichannel = require('./testmultichannel.js');

var _testmultichannel2 = _interopRequireDefault(_testmultichannel);

var _testrouting = require('./testrouting.js');

var _testrouting2 = _interopRequireDefault(_testrouting);

var _testcompressorexpander = require('./testcompressorexpander.js');

var _testcompressorexpander2 = _interopRequireDefault(_testcompressorexpander);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
var unittests = {
    biquadtests: _testbiquad2.default,
    cascadetests: _testcascade2.default,
    analysistests: _testanalysis2.default,
    phonetests: _testphone2.default,
    sofatests: _testsofa2.default,
    binauraltests: _testbinaural2.default,
    sumdifftests: _testsumdiff2.default,
    transauraltests: _testtransaural2.default,
    multichanneltests: _testmultichannel2.default,
    routingtests: _testrouting2.default,
    compressorexpandertests: _testcompressorexpander2.default
}; /************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      Export test modules
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

exports.default = unittests;