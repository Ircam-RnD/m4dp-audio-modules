"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("../core/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       cascade.js
 *   @brief      This class implements a cascade of BiquadFilterNodes
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var CascadeNode = function (_AbstractNode) {
    _inherits(CascadeNode, _AbstractNode);

    //==============================================================================
    /**
     * @brief This class implements a cascade of BiquadFilterNodes
     *        The filtering affects all channel similarly
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */

    function CascadeNode(audioContext) {
        _classCallCheck(this, CascadeNode);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CascadeNode).call(this, audioContext));

        _this._isBypass = false;
        _this._biquadNodes = [];

        /// by default, 0 cascades.
        /// this will also update the audio graph
        _this.numCascades = 0;
        return _this;
    }

    //==============================================================================
    /**
     * Enable or bypass the processor
     * @type {boolean}
     */


    _createClass(CascadeNode, [{
        key: "setFrequency",


        //==============================================================================
        /**
         * Sets the frequency of the i-th biquad in the cascade
         * @param {int} biquadIndex
         * @param {float} value
         */
        value: function setFrequency(biquadIndex, value) {
            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            this._biquadNodes[biquadIndex].frequency.value = value;
        }

        /**
         * Returns the frequency of the i-th biquad in the cascade
         * @param {int} biquadIndex
         */

    }, {
        key: "getFrequency",
        value: function getFrequency(biquadIndex) {
            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            return this._biquadNodes[biquadIndex].frequency;
        }

        //==============================================================================
        /**
         * Sets the Q of the i-th biquad in the cascade
         * @param {int} biquadIndex
         * @param {float} value
         */

    }, {
        key: "setQ",
        value: function setQ(biquadIndex, value) {
            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            this._biquadNodes[biquadIndex].Q.value = value;
        }

        /**
         * Returns the Q of the i-th biquad in the cascade
         * @param {int} biquadIndex
         */

    }, {
        key: "getQ",
        value: function getQ(biquadIndex) {
            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            return this._biquadNodes[biquadIndex].Q;
        }

        //==============================================================================
        /**
         * Sets the gain of the i-th biquad in the cascade
         * @param {int} biquadIndex
         * @param {float} value
         */

    }, {
        key: "setGain",
        value: function setGain(biquadIndex, value) {
            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            this._biquadNodes[biquadIndex].gain.value = value;
        }

        /**
         * Returns the gain of the i-th biquad in the cascade
         * @param {int} biquadIndex
         */

    }, {
        key: "getGain",
        value: function getGain(biquadIndex) {
            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            return this._biquadNodes[biquadIndex].gain;
        }

        //==============================================================================
        /**
         * Sets the type of the i-th biquad in the cascade
         * @param {int} biquadIndex
         * @param {string} value
         */

    }, {
        key: "setType",
        value: function setType(biquadIndex, value) {
            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            this._biquadNodes[biquadIndex].type = value;
        }

        /**
         * Returns the type of the i-th biquad in the cascade
         * @param {int} biquadIndex
         */

    }, {
        key: "getType",
        value: function getType(biquadIndex) {
            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            return this._biquadNodes[biquadIndex].type;
        }

        //==============================================================================
        /**
         * Resets one biquad to its default
         * @param {int} biquadIndex
         */

    }, {
        key: "resetBiquad",
        value: function resetBiquad(biquadIndex) {
            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            this.setType(biquadIndex, "lowpass");
            this.setGain(biquadIndex, 0.0);
            this.setFrequency(biquadIndex, 350);
            this.setQ(biquadIndex, 1);
        }

        /**
         * Resets all biquads
         */

    }, {
        key: "resetAllBiquads",
        value: function resetAllBiquads() {
            var numCascades = this.numCascades;

            for (var i = 0; i < numCascades; i++) {
                this.resetBiquad(i);
            }
        }

        //==============================================================================
        /**
         * Returns the number of biquads in the cascade
         */

    }, {
        key: "_updateAudioGraph",


        //==============================================================================
        /**
         * Updates the connections of the audio graph
         */
        value: function _updateAudioGraph() {
            var numCascades_ = this.numCascades;

            /// first of all, disconnect everything
            this._input.disconnect();
            for (var i = 0; i < numCascades_; i++) {
                this._biquadNodes[i].disconnect();
            }

            if (this.bypass === true || numCascades_ === 0) {
                this._input.connect(this._output);
            } else {
                /// connect the last element to the output
                this._biquadNodes[numCascades_ - 1].connect(this._output);

                /// connect the cascades
                for (var _i = numCascades_ - 1; _i > 0; _i--) {
                    this._biquadNodes[_i - 1].connect(this._biquadNodes[_i]);
                }

                /// connect the 1st biquad to the input
                this._input.connect(this._biquadNodes[0]);
            }
        }
    }, {
        key: "bypass",
        set: function set(value) {
            if (value !== this._isBypass) {
                this._isBypass = value;
                this._updateAudioGraph();
            }
        }

        /**
         * Returns true if the processor is bypassed
         */
        ,
        get: function get() {
            return this._isBypass;
        }
    }, {
        key: "numCascades",
        get: function get() {
            return this._biquadNodes.length;
        }

        /**
         * Sets the number of cascades
         */
        ,
        set: function set(newNumCascades) {
            var currentNumCascades = this.numCascades;

            if (newNumCascades > currentNumCascades) {
                for (var i = currentNumCascades; i < newNumCascades; i++) {
                    var newBiquadNode = this._audioContext.createBiquadFilter();

                    this._biquadNodes.push(newBiquadNode);
                }
            } else if (newNumCascades < currentNumCascades) {
                this._biquadNodes.length = newNumCascades;
            }

            /// now update the audio connections
            this._updateAudioGraph();
        }
    }]);

    return CascadeNode;
}(_index2.default);

exports.default = CascadeNode;