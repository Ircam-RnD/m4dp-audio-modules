'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NewSmartFader = exports.OldSmartFader = undefined;

var _oldsmartfader = require('./oldsmartfader.js');

var _oldsmartfader2 = _interopRequireDefault(_oldsmartfader);

var _newsmartfader = require('./newsmartfader.js');

var _newsmartfader2 = _interopRequireDefault(_newsmartfader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      Exports the SmartFader modules
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

exports.OldSmartFader = _oldsmartfader2.default;
exports.NewSmartFader = _newsmartfader2.default;