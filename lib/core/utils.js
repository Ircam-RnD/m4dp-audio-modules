/************************************************************************************/
/*!
 *   @file       utils.js
 *   @brief      Misc utility functions
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

/************************************************************************************/
/*!
 *  @brief          template ternary minimum function
 *  @return         minimum of a, b and c
 *
 */
/************************************************************************************/
export function smin( x, y, z )
{
    return Math.min( Math.min( x, y ), z );
}

export function mean( array )
{
    if( array.length === 0 )
    {
        throw new Error("pas bon");
    }

    var total = 0;
    for( var i = 0; i < array.length; i++ )
    {
        total += array[i];
    }
    const avg = total / array.length

    return avg;
}

/************************************************************************************/
/*!
 *  @brief          ensure x is within range [min,max] with saturation (out of place)
 *
 */
/************************************************************************************/
export function clamp( value, min, max )
{
	if( max < min )
    {
		throw new Error("pas bon");
	}

	return Math.max( min, Math.min( value, max ) );
}

/**
 * linear rescaling bases on input and output domains
 *
 */
export function scale( value, minIn, maxIn, minOut, maxOut )
{
    if( maxIn === minIn )
    {
        throw new Error("pas bon");
    }

    const normalized = ( value - minIn ) / ( maxIn - minIn );

    return minOut + normalized * ( maxOut - minOut );
}

/************************************************************************************/
/*!
 *  @brief          linear gain to decibel conversion
 *  @param[in]      lin : linear value
 *
 *  @details        y = 20 * log10( x )
 *	@n				similar to Max/MSP atodb
 */
/************************************************************************************/
export function lin2dB( value )
{
    if( value <= 0 )
    {
        throw new Error("pas bon");
    }

    return 20 * Math.log10( value );
}

/************************************************************************************/
/*!
 *  @brief          linear gain to power decibel conversion
 *  @param[in]      lin : linear value
 *
 *  @details        y = 10 * log10( x )
 */
/************************************************************************************/
export function lin2powdB( value )
{
    if( value <= 0 )
    {
        throw new Error("pas bon");
    }
    
    return 10. * Math.log10( value );
}

/************************************************************************************/
/*!
 *  @brief          "safe" version of lin2dB()
 *  @param[in]      x : linear value
 *  @param[in]      eps : safety margin
 *
 *  @details        y = 20 * log10( x )
 *	@n				similar to Max/MSP atodb
 */
/************************************************************************************/
export function lin2dBsafe( value )
{
    return 20 * Math.log10( Math.max( value, 1e-9) );
}

/************************************************************************************/
/*!
 *  @brief          amplitude decibel to linear gain conversion
 *  @param[in]      dB : value in decibels
 *
 *  @details        y = 10^( x / 20 )
 */
/************************************************************************************/
export function dB2lin( value )
{
    return Math.pow( 10 , value / 20 );
}

/**
 * Compares two array. Returns true if they are (almost) equal
 */
export function arrayAlmostEqual( array1, array2, tolerance = 0 )
{
    if( tolerance < 0.0 )
    {
        throw new Error("pas bon");
    }

    if( array1.length != array2.length )
    {
        return false;
    }

    const size = array1.length;

    for( let i = 0; i < size; i++ )
    {
        const val1 = array1[i];
        const val2 = array2[i];
        const diff = Math.abs( val1 - val2 );

        if( diff > tolerance )
        {
            return false;
        }
    }

    return true;
}

/************************************************************************************/
/*!
 *  @brief          degrees to radians conversion
 *  @param[in]      degrees : angle expressed in degrees
 *
 */
/************************************************************************************/
export function deg2rad( value )
{
    return value * 0.017453292520;
}

/************************************************************************************/
/*!
 *  @brief          radians to degrees conversion
 *  @param[in]      radians : angle expressed in radians
 *
 */
/************************************************************************************/
export function rad2deg( value )
{
    return value * 57.295779513082;
}

/************************************************************************************/
/*!
 *  @brief          modulo (%) binary operator returning positive results
 *  @param[in]      x
 *  @param[in]      modulo
 *
 */
/************************************************************************************/
export function modulo( x, modu )
{
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

/************************************************************************************/
/*!
 *  @brief          navigationnal to trigonometric conversion
 *
 *  @details        navigationnal is expressed in degrees, clock-wise with 0 deg at (x,y)=(0,1)
 *                  trigonometric is expressed in radians, anticlock-wise with 0 deg at (x,y)=(1,0)
 */
/************************************************************************************/
export function nav2trig( x )
{
    return deg2rad( modulo( 270.0 - x , 360.0 ) - 180.0 );
}

/************************************************************************************/
/*!
 *  @brief          trigonometric to navigationnal conversion
 *
 *  @details        navigationnal is expressed in degrees, clock-wise with 0 deg at (x,y)=(0,1)
 *                  trigonometric is expressed in radians, anticlock-wise with 0 deg at (x,y)=(1,0)
 */
/************************************************************************************/
export function trig2nav( x )
{
    return modulo( 270.0 - rad2deg(x), 360.0 ) - 180.0;
}

//==============================================================================
/**
 * msec -> seconds
 */
export function ms2sec( ms )
{
    return ms / 1000.;
}

export function sec2ms( sec )
{
    return sec * 1000;
}

//==============================================================================
const utilities = {
    smin,
    mean,
    clamp,
    scale,
    lin2dB,
    lin2dBsafe,
    lin2powdB,
    dB2lin,
    deg2rad,
    rad2deg,
    modulo,
    nav2trig,
    trig2nav,
    ms2sec,
    sec2ms,
    arrayAlmostEqual,
};

export default utilities;
