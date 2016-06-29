/************************************************************************************/
/*!
 *   @file       compressorwithdrywet.js
 *   @brief      This class implements a mono compressor/expander, with optional dry/wet control
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       06/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';
import utilities from '../core/utils.js';
import CompressorExpanderNode from '../dsp/compressorexpander.js';


/************************************************************************************/
/*!
 *  @class          CompressorWithDryWet
 *  @brief          Compressor/Expander
 *  @details        This class implements a mono compressor/expander, with optional dry/wet control
 *  @details        mono version
 *
 */
/************************************************************************************/
export default class CompressorWithDryWet extends AbstractNode
{
    /************************************************************************************/
    /*!
     *  @brief          Class constructor
     *  @param[in]      audioContext
     *
     */
    /************************************************************************************/
    constructor( audioContext )
    {
        super( audioContext );
        
        /// 100 = totally wet i.e. being compressed
        /// 0 = totally dry, not being compressed
        this._drywet = 100;
        
        /// create the nodes
        {
            this._compressorNode = new CompressorExpanderNode( this._audioContext );
            this._gainDry        = this._audioContext.createGain();
            this._gainWet        = this._audioContext.createGain();
        }
     
        /// connect the nodes
        {
            this._input.connect( this._gainDry );
            this._input.connect( this._compressorNode._input );
            
            this._compressorNode.connect( this._gainWet );
            
            this._gainDry.connect( this._output );
            this._gainWet.connect( this._output );
        }
        
        
        /// sanity checks
        if( this._input.numberOfInputs != 1
           || this._input.numberOfOutputs != 1 )
        {
            throw new Error("Pas bon");
        }
        
        /// sanity checks
        if( this._output.numberOfInputs != 1
           || this._output.numberOfOutputs != 1 )
        {
            throw new Error("Pas bon");
        }
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Returns the dry/wet ratio  in [0 - 100]
     *
     */
    /************************************************************************************/
    getDryWet()
    {
        return this._gainWet.gain.value * 100.;
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Set the dry/wet ratio  in [0 - 100]
     *  @details        100 = totally wet i.e. being compressed
     *                  0 = totally dry, not being compressed
     *
     */
    /************************************************************************************/
    setDryWet( ratio, rampTimeInMilliseconds )
    {
        /// sanity check
        if( rampTimeInMilliseconds < 0 )
        {
            throw new Error("Ca parait pas bon...");
        }
        
        /// 100% --> totally wet
        /// 0% --> totally dry
        
        const percent = utilities.clamp( ratio, 0, 100 );
        
        this._drywet = percent;
        
        const wet = percent;
        const dry = 100 - percent;
        
        /*
        this._gainDry.gain.value = dry / 100.;
        this._gainWet.gain.value = wet / 100.;
         */
        
        const nextTime = this._audioContext.currentTime + rampTimeInMilliseconds / 1000.;
        
        this._gainDry.gain.linearRampToValueAtTime( dry / 100., nextTime );
        this._gainWet.gain.linearRampToValueAtTime( wet / 100., nextTime );
    }
    
    //==============================================================================
    setAttack( valueInMsec )
    {
        this._compressorNode.setAttack( valueInMsec );
    }
    
    setRelease( valueInMsec )
    {
        this._compressorNode.setRelease( valueInMsec );
    }
    
    setCompressorThreshold( valueIndB )
    {
        this._compressorNode.setCompressorThreshold( valueIndB );
    }
    
    setExpanderThreshold( valueIndB )
    {
        this._compressorNode.setExpanderThreshold( valueIndB );
    }
    
    setCompressorRatio( value )
    {
        this._compressorNode.setCompressorRatio( value );
    }
    
    setExpanderRatio( value )
    {
        this._compressorNode.setExpanderRatio( value );
    }
    
    setMakeUpGain( valueIndB )
    {
        this._compressorNode.setMakeUpGain( valueIndB );
    }
    
    setRMSAveragingTime( timeInMilliseconds )
    {
        this._compressorNode.setRMSAveragingTime( timeInMilliseconds );
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Returns the attack time in msec
     *
     */
    /************************************************************************************/
    getAttack()
    {
        return this._compressorNode._attack;
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Returns the release time in msec
     *
     */
    /************************************************************************************/
    getRelease()
    {
        return this._compressorNode._release;
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Returns the compressor threshold, in dB
     *
     */
    /************************************************************************************/
    getCompressorThreshold()
    {
        return this._compressorNode._compressorThreshold;
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Returns the compressor ratio
     *
     */
    /************************************************************************************/
    getCompressorRatio()
    {
        return this._compressorNode._compressorRatio;
    }
}

