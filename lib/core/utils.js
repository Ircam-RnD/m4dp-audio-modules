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
/**
 * degrees to radians conversion
 */
export function deg2rad( value ){
    return value * 0.017453292520;
}

/**
 * radians to degrees conversion
 */
export function rad2deg( value ){
    return value * 57.295779513082;
}

//==============================================================================
/**
 * modulo (%) binary operator returning positive results
 */
export function modulo( x, modu ){

    var y = x;
    while( y < 0.0 )
    {
        y += modu;
    }
    
    while( y >= modu )
    {
        y -= modu;
    }
    
    return y;
}

//==============================================================================
/**
 *  @brief          navigationnal to trigonometric conversion
 *
 *  @details        navigationnal is expressed in degrees, clock-wise with 0 deg at (x,y)=(0,1)
 *                  trigonometric is expressed in radians, anticlock-wise with 0 deg at (x,y)=(1,0)
 */
export function nav2trig( x ){
    return deg2rad( modulo( 270.0 - x , 360.0 ) - 180.0 );
}

/**
 *  @brief          trigonometric to navigationnal conversion
 *
 *  @details        navigationnal is expressed in degrees, clock-wise with 0 deg at (x,y)=(0,1)
 *                  trigonometric is expressed in radians, anticlock-wise with 0 deg at (x,y)=(1,0)
 */
export function trig2nav( x ){
    return modulo( 270.0 - rad2deg(x), 360.0 ) - 180.0;
}

//==============================================================================
/**
 * msec -> seconds
 */
export function ms2sec( ms ){
    return ms / 1000.;
}

//==============================================================================
const utilities = {
    clamp,
    scale,
    lin2dB,
    dB2lin,
    deg2rad,
    rad2deg,
    modulo,
    nav2trig,
    trig2nav,
    ms2sec,
    arrayAlmostEqual,
};

export default utilities;
