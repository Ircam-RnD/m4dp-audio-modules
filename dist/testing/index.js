'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _testbiquad = require('./testbiquad.js');

var _testbiquad2 = _interopRequireDefault(_testbiquad);

var _testcascade = require('./testcascade.js');

var _testcascade2 = _interopRequireDefault(_testcascade);

var _testsofa = require('./testsofa.js');

var _testsofa2 = _interopRequireDefault(_testsofa);

var _testbinaural = require('./testbinaural.js');

var _testbinaural2 = _interopRequireDefault(_testbinaural);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
/************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      Export test modules
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var unittests = {
  biquadtests: _testbiquad2.default,
  cascadetests: _testcascade2.default,
  sofatests: _testsofa2.default,
  binauraltests: _testbinaural2.default
};

exports.default = unittests;