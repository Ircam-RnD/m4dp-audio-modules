'use strict';

Object.defineProperty(exports, "__esModule", {
      value: true
});
exports.binaural = exports.unittests = exports.utilities = exports.AudioStreamDescription = exports.AudioStreamDescriptionCollection = exports.SmartFader = exports.ObjectSpatialiserAndMixer = exports.NoiseAdaptation = exports.MultichannelSpatialiser = exports.DialogEnhancement = exports.NewReceiverMix = exports.OldReceiverMix = exports.StreamSelector = exports.MultiRMSMetering = exports.RmsMetering = exports.CompressorWithSideChain = exports.MultiCompressorExpanderNode = exports.CompressorExpanderNode = exports.HeadphonesEqualization = exports.CenterEnhancementNode = exports.LRMSNode = exports.SumDiffNode = exports.CascadeNode = undefined;

var _index = require('./dialog-enhancement/index.js');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./multichannel-spatialiser/index.js');

var _index4 = _interopRequireDefault(_index3);

var _index5 = require('./noise-adaptation/index.js');

var _index6 = _interopRequireDefault(_index5);

var _index7 = require('./object-spatialiser-and-mixer/index.js');

var _index8 = _interopRequireDefault(_index7);

var _index9 = require('./smart-fader/index.js');

var _index10 = _interopRequireDefault(_index9);

var _index11 = require('./core/index.js');

var _index12 = require('./stream-selector/index.js');

var _index13 = _interopRequireDefault(_index12);

var _index14 = require('./receiver-mix/index.js');

var _index15 = require('./dsp/index.js');

var _utils = require('./core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

var _index16 = require('./testing/index.js');

var _index17 = _interopRequireDefault(_index16);

var _binaural = require('binaural');

var _binaural2 = _interopRequireDefault(_binaural);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      Exports the M4DP modules
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

exports.CascadeNode = _index15.CascadeNode;
exports.SumDiffNode = _index15.SumDiffNode;
exports.LRMSNode = _index15.LRMSNode;
exports.CenterEnhancementNode = _index15.CenterEnhancementNode;
exports.HeadphonesEqualization = _index15.HeadphonesEqualization;
exports.CompressorExpanderNode = _index15.CompressorExpanderNode;
exports.MultiCompressorExpanderNode = _index15.MultiCompressorExpanderNode;
exports.CompressorWithSideChain = _index15.CompressorWithSideChain;
exports.RmsMetering = _index15.RmsMetering;
exports.MultiRMSMetering = _index15.MultiRMSMetering;
exports.StreamSelector = _index13.default;
exports.OldReceiverMix = _index14.OldReceiverMix;
exports.NewReceiverMix = _index14.NewReceiverMix;
exports.DialogEnhancement = _index2.default;
exports.MultichannelSpatialiser = _index4.default;
exports.NoiseAdaptation = _index6.default;
exports.ObjectSpatialiserAndMixer = _index8.default;
exports.SmartFader = _index10.default;
exports.AudioStreamDescriptionCollection = _index11.AudioStreamDescriptionCollection;
exports.AudioStreamDescription = _index11.AudioStreamDescription;
exports.utilities = _utils2.default;
exports.unittests = _index17.default;
exports.binaural = _binaural2.default;