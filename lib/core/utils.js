/************************************************************************************/
/*!
 *   @file       utils.js
 *   @brief      Misc utility functions
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/
/**
 * Clips a value within a given range
 * @type {number} value the value to be clipped
 * @type {number} min the lower bound
 * @type {number} max the upper bound
 *
 */
export function clamp(value, min, max){

	if( max < min ){
		throw new Error("pas bon");
	}

	return Math.max(min, Math.min(value, max));
}

/**
 * linear rescaling bases on input and output domains
 *
 */
export function scale(value, minIn, maxIn, minOut, maxOut){

    if( maxIn === minIn ){
        throw new Error("pas bon");
    }

    const normalized = ( value - minIn ) / ( maxIn - minIn );

    return minOut + normalized * ( maxOut - minOut );
}

/**
 * linear gain to decibel conversion
 *
 */
export function lin2dB(value){

    if( value <= 0){
        throw new Error("pas bon");
    }

    return 20 * Math.log10( value );
}

/**
 * amplitude decibel to linear gain conversion
 *
 */
export function dB2lin(value){
    return Math.pow( 10 , value / 20 );
}

/**
 * Compares two array. Returns true if they are (almost) equal
 *
 */
export function arrayAlmostEqual( array1, array2, tolerance = 0 ){

    if( tolerance < 0.0 ){
        throw new Error("pas bon");
    }

    if( array1.length != array2.length ){
        return false;
    }

    const size = array1.length;

    for( let i = 0; i < size; i++ )
    {
        const val1 = array1[i];
        const val2 = array2[i];
        const diff = Math.abs( val1 - val2 );

        if( diff > tolerance ){
            return false;
        }
    }

    return true;
}

//==============================================================================
const utilities = {
    clamp,
    scale,
    lin2dB,
    dB2lin,
    arrayAlmostEqual,
};

export default utilities;
