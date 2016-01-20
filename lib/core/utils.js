/**
 * Utilities functions
 */

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

/// @n technique pour avoir un pseudo-namespace
const utilities = {
    clamp,
    scale,
    lin2dB,
    dB2lin,
};

export default utilities;
