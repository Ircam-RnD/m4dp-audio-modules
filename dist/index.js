'use strict';

Object.defineProperty(exports, "__esModule", {
      value: true
});
exports.binaural = exports.unittests = exports.utilities = exports.AudioStreamDescription = exports.AudioStreamDescriptionCollection = exports.NewSmartFader = exports.OldSmartFader = exports.ObjectSpatialiserAndMixer = exports.NoiseAdaptation = exports.MultichannelSpatialiser = exports.DialogEnhancement = exports.NewReceiverMix = exports.OldReceiverMix = exports.StreamSelector = exports.PeakLimiterNode = exports.MultiRMSMetering = exports.RmsMetering = exports.CompressorWithSideChain = exports.MultiCompressorExpanderNode = exports.CompressorExpanderNode = exports.HeadphonesEqualization = exports.CenterEnhancementNode = exports.LRMSNode = exports.SumDiffNode = exports.CascadeNode = undefined;

var _index = require('./dialog-enhancement/index.js');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./multichannel-spatialiser/index.js');

var _index4 = _interopRequireDefault(_index3);

var _index5 = require('./noise-adaptation/index.js');

var _index6 = _interopRequireDefault(_index5);

var _index7 = require('./object-spatialiser-and-mixer/index.js');

var _index8 = _interopRequireDefault(_index7);

var _index9 = require('./smart-fader/index.js');

var _index10 = require('./core/index.js');

var _index11 = require('./stream-selector/index.js');

var _index12 = _interopRequireDefault(_index11);

var _index13 = require('./receiver-mix/index.js');

var _index14 = require('./dsp/index.js');

var _utils = require('./core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

var _index15 = require('./testing/index.js');

var _index16 = _interopRequireDefault(_index15);

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

exports.CascadeNode = _index14.CascadeNode;
exports.SumDiffNode = _index14.SumDiffNode;
exports.LRMSNode = _index14.LRMSNode;
exports.CenterEnhancementNode = _index14.CenterEnhancementNode;
exports.HeadphonesEqualization = _index14.HeadphonesEqualization;
exports.CompressorExpanderNode = _index14.CompressorExpanderNode;
exports.MultiCompressorExpanderNode = _index14.MultiCompressorExpanderNode;
exports.CompressorWithSideChain = _index14.CompressorWithSideChain;
exports.RmsMetering = _index14.RmsMetering;
exports.MultiRMSMetering = _index14.MultiRMSMetering;
exports.PeakLimiterNode = _index14.PeakLimiterNode;
exports.StreamSelector = _index12.default;
exports.OldReceiverMix = _index13.OldReceiverMix;
exports.NewReceiverMix = _index13.NewReceiverMix;
exports.DialogEnhancement = _index2.default;
exports.MultichannelSpatialiser = _index4.default;
exports.NoiseAdaptation = _index6.default;
exports.ObjectSpatialiserAndMixer = _index8.default;
exports.OldSmartFader = _index9.OldSmartFader;
exports.NewSmartFader = _index9.NewSmartFader;
exports.AudioStreamDescriptionCollection = _index10.AudioStreamDescriptionCollection;
exports.AudioStreamDescription = _index10.AudioStreamDescription;
exports.utilities = _utils2.default;
exports.unittests = _index16.default;
exports.binaural = _binaural2.default;