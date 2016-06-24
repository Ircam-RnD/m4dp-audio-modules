'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NewReceiverMix = exports.OldReceiverMix = undefined;

var _oldreceivermix = require('./oldreceivermix.js');

var _oldreceivermix2 = _interopRequireDefault(_oldreceivermix);

var _newreceivermix = require('./newreceivermix.js');

var _newreceivermix2 = _interopRequireDefault(_newreceivermix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      Exports the ReceiverMix modules
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

exports.OldReceiverMix = _oldreceivermix2.default;
exports.NewReceiverMix = _newreceivermix2.default;