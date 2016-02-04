/************************************************************************************/
/*!
 *   @file       vbap.js
 *   @brief      This class implements pairwise amplitude panning for stereo or 5.1 setups
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';
import utilities from '../core/utils.js';

export default class AngularPannerNode extends AbstractNode {
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
    constructor( audioContext,
     			 mode = 'stereo' ){
        super( audioContext );
        this._mode = mode;
    	this._gainNodes = [];
    	this._sourceAzim = 0.0;	/// source azimuth expressed with spat4 navigation coordinates

    	const numInputs = 1;
    	const numOutputs = ( mode === 'stereo' ? 2 : 6 );


	}

    //==============================================================================
    /**
     * Set the source azimuth
     * @type {number} azimuth angle in degrees, expressed with spat4 navigation coordinates
     */
	set sourceAzimuth( value ){

		/// make sure the azim angle is expressed in [-180 180]
		this._sourceAzim = utilities.trig2nav( utilities.nav2trig( value ) );

		if( this._sourceAzim > 180 || this._sourceAzim < -180 ){
			throw new Error( "something is wrong" );
		}

		this._updateGains();
	}

	/**
     * Returns the source azimuth
     * @type {number} azimuth angle in degrees, expressed with spat4 navigation coordinates
     */
	get sourceAzimuth(){
		return this._sourceAzim;
	}

    //==============================================================================
    /**
     * Quick and dirty way to compute the speakers gains
     */
	_computeGains(){
		
		if( this._mode === 'stereo' ){

			/// azimuth in radians (trigo)
			const azimuth = utilities.nav2trig( this._sourceAzim );

			const leftaz  = utilities.nav2trig( -30 );
			const rightaz = utilities.nav2trig( +30 );

			const normangle = 1.57079632679 * ( azimuth - leftaz ) / ( rightaz - leftaz );

			const gainL = Math.cos( normangle );
			const gainR = Math.sin( normangle );

			/// gains for L R
			var gains = [gainL, gainR];

			return gains;
		}
		else{

			/// source azimuth expressed in [-180 180]
			const az = this._sourceAzim;

			const L  = -30;
			const R  = +30;
			const C  = 0;
			const Ls = -110;
			const Rs = +110;

			const indexL = 0;
			const indexR = 1;
			const indexC = 2;
			const indexLFE = 3;
			const indexLs = 4;
			const indexRs = 5;

			/// determine which pair of speakers is active
			var leftaz  = undefined;
			var rightaz = undefined;
			var leftIndex  = undefined;
			var rightIndex = undefined;

			/// quick and dirty calculation of the gains
			if( L <= az && az <= C )
			{
				leftaz  = L;
				rightaz = C;
				leftIndex  = indexL;
    			rightIndex = indexC;
			}
			else if( C <= az && az <= R ){
				leftaz  = C;
				rightaz = R;
				leftIndex  = indexC;
    			rightIndex = indexR;
			}
			else if( R <= az && az <= Rs ){
				leftaz  = R;
				rightaz = Rs;
				leftIndex  = indexR;
    			rightIndex = indexRs;
			}
			else if( Ls <= az && az <= L ){
				leftaz  = Ls;
				rightaz = L;
				leftIndex  = indexLs;
    			rightIndex = indexL;
			}
			else{
				leftaz  = Ls;
				rightaz = Rs;
				leftIndex  = indexLs;
    			rightIndex = indexRs;
			}

			leftaz  = utilities.nav2trig( leftaz );
			rightaz = utilities.nav2trig( rightaz );

			const azimuth = utilities.nav2trig( az );

			const normangle = 1.57079632679 * ( azimuth - leftaz ) / ( rightaz - leftaz );

			/// gains for L R C Lfe Ls Rs
			var gains = [0, 0, 0, 0, 0, 0];

			gains[ leftIndex ]  = Math.cos( normangle );
			gains[ rightIndex ] = Math.sin( normangle );

			return gains;
		}
	}

	_updateGains(){

		const gains = this._computeGains();


	}
}
