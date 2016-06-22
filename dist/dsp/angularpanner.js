'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _utils = require('../core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       vbap.js
 *   @brief      This class implements pairwise amplitude panning for stereo or 5.1 setups
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

var AngularPannerNode = function (_AbstractNode) {
	_inherits(AngularPannerNode, _AbstractNode);

	//==============================================================================
	/**
  * @brief This class implements pairwise amplitude panning for stereo or 5.1 setups
  *
  * @param {AudioContext} audioContext - audioContext instance.
  * @param {string} mode - either 'stereo' or 'multichannel' (for 5.1)
  *
  * The class takes one input signal (one source) and produces 2 or 6 outputs
  * for either stereo or 5.1 reproduction
  *
  * For stereo, the channel arrangment is L/R
  * For 5.1, it is L R C LFE Ls Rs
  */

	function AngularPannerNode(audioContext) {
		var mode = arguments.length <= 1 || arguments[1] === undefined ? 'stereo' : arguments[1];

		_classCallCheck(this, AngularPannerNode);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AngularPannerNode).call(this, audioContext));

		_this._mode = mode;
		_this._gainNodes = [];
		_this._sourceAzim = 0.0; /// source azimuth expressed with spat4 navigation coordinates

		var numInputs = 1;
		var numOutputs = mode === 'stereo' ? 2 : 6;
		return _this;
	}

	//==============================================================================
	/**
  * Set the source azimuth
  * @type {number} azimuth angle in degrees, expressed with spat4 navigation coordinates
  */


	_createClass(AngularPannerNode, [{
		key: '_computeGains',


		//==============================================================================
		/**
   * Quick and dirty way to compute the speakers gains
   */
		value: function _computeGains() {
			if (this._mode === 'stereo') {
				/// azimuth in radians (trigo)
				var azimuth = _utils2.default.nav2trig(this._sourceAzim);

				var _leftaz = _utils2.default.nav2trig(-30);
				var _rightaz = _utils2.default.nav2trig(+30);

				var normangle = 1.57079632679 * (azimuth - _leftaz) / (_rightaz - _leftaz);

				var gainL = Math.cos(normangle);
				var gainR = Math.sin(normangle);

				/// gains for L R
				var gains = [gainL, gainR];

				return gains;
			} else {
				/// source azimuth expressed in [-180 180]
				var az = this._sourceAzim;

				var L = -30;
				var R = +30;
				var C = 0;
				var Ls = -110;
				var Rs = +110;

				var indexL = 0;
				var indexR = 1;
				var indexC = 2;
				var indexLFE = 3;
				var indexLs = 4;
				var indexRs = 5;

				/// determine which pair of speakers is active
				var leftaz = undefined;
				var rightaz = undefined;
				var leftIndex = undefined;
				var rightIndex = undefined;

				/// quick and dirty calculation of the gains
				if (L <= az && az <= C) {
					leftaz = L;
					rightaz = C;
					leftIndex = indexL;
					rightIndex = indexC;
				} else if (C <= az && az <= R) {
					leftaz = C;
					rightaz = R;
					leftIndex = indexC;
					rightIndex = indexR;
				} else if (R <= az && az <= Rs) {
					leftaz = R;
					rightaz = Rs;
					leftIndex = indexR;
					rightIndex = indexRs;
				} else if (Ls <= az && az <= L) {
					leftaz = Ls;
					rightaz = L;
					leftIndex = indexLs;
					rightIndex = indexL;
				} else {
					leftaz = Ls;
					rightaz = Rs;
					leftIndex = indexLs;
					rightIndex = indexRs;
				}

				leftaz = _utils2.default.nav2trig(leftaz);
				rightaz = _utils2.default.nav2trig(rightaz);

				var _azimuth = _utils2.default.nav2trig(az);

				var _normangle = 1.57079632679 * (_azimuth - leftaz) / (rightaz - leftaz);

				/// gains for L R C Lfe Ls Rs
				var gains = [0, 0, 0, 0, 0, 0];

				gains[leftIndex] = Math.cos(_normangle);
				gains[rightIndex] = Math.sin(_normangle);

				return gains;
			}
		}
	}, {
		key: '_updateGains',
		value: function _updateGains() {
			var gains = this._computeGains();
		}
	}, {
		key: 'sourceAzimuth',
		set: function set(value) {
			/// make sure the azim angle is expressed in [-180 180]
			this._sourceAzim = _utils2.default.trig2nav(_utils2.default.nav2trig(value));

			if (this._sourceAzim > 180 || this._sourceAzim < -180) {
				throw new Error("something is wrong");
			}

			this._updateGains();
		}

		/**
      * Returns the source azimuth
      * @type {number} azimuth angle in degrees, expressed with spat4 navigation coordinates
      */
		,
		get: function get() {
			return this._sourceAzim;
		}
	}]);

	return AngularPannerNode;
}(_index2.default);

exports.default = AngularPannerNode;