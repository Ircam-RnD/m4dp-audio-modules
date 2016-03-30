'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.MultichannelGainNode = exports.VirtualSpeakersNode = exports.TransauralShufflerNode = exports.TransauralFeedforwardNode = exports.TransauralNode = exports.SumDiffNode = exports.HeadphonesEqualization = exports.AnalysisNode = exports.CascadeNode = undefined;

var _cascade = require('./cascade.js');

var _cascade2 = _interopRequireDefault(_cascade);

var _analysis = require('./analysis.js');

var _analysis2 = _interopRequireDefault(_analysis);

var _headphoneequalization = require('./headphoneequalization.js');

var _headphoneequalization2 = _interopRequireDefault(_headphoneequalization);

var _transaural = require('./transaural.js');

var _sumdiff = require('./sumdiff.js');

var _sumdiff2 = _interopRequireDefault(_sumdiff);

var _virtualspeakers = require('./virtualspeakers.js');

var _virtualspeakers2 = _interopRequireDefault(_virtualspeakers);

var _multichannelgain = require('./multichannelgain.js');

var _multichannelgain2 = _interopRequireDefault(_multichannelgain);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.CascadeNode = _cascade2.default;
exports.AnalysisNode = _analysis2.default;
exports.HeadphonesEqualization = _headphoneequalization2.default;
exports.SumDiffNode = _sumdiff2.default;
exports.TransauralNode = _transaural.TransauralNode;
exports.TransauralFeedforwardNode = _transaural.TransauralFeedforwardNode;
exports.TransauralShufflerNode = _transaural.TransauralShufflerNode;
exports.VirtualSpeakersNode = _virtualspeakers2.default;
exports.MultichannelGainNode = _multichannelgain2.default; /************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      Exports the dsp modules
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/