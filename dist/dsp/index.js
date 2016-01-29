'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransauralFeedforwardNode = exports.TransauralNode = exports.HeadphonesEqualization = exports.CascadeNode = undefined;

var _cascade = require('./cascade.js');

var _cascade2 = _interopRequireDefault(_cascade);

var _headphoneequalization = require('./headphoneequalization.js');

var _headphoneequalization2 = _interopRequireDefault(_headphoneequalization);

var _transaural = require('./transaural.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.CascadeNode = _cascade2.default;
exports.HeadphonesEqualization = _headphoneequalization2.default;
exports.TransauralNode = _transaural.TransauralNode;
exports.TransauralFeedforwardNode = _transaural.TransauralFeedforwardNode; /************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      Exports the dsp modules
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/