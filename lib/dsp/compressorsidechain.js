/************************************************************************************/
/*!
 *   @file       compressorsidechain.js
 *   @brief      This class implements a mono compressor/expander, ported from C++ to javascript
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       06/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';
import utilities from '../core/utils.js';

/************************************************************************************/
/*!
 *  @class          CompressorWithSideChain
 *  @brief          Compressor/Expander with side chain
 *  @details        The processor has N channels.
 *                  One of these N channels is being used as the side chain (and thus is not affected by compression)
 *
 */
/************************************************************************************/
export default class CompressorWithSideChain extends AbstractNode
{
    
    /************************************************************************************/
    /*!
     *  @brief          Class constructor
     *
     */
    /************************************************************************************/
    constructor( audioContext,
                 numChannels )
    {
        /// sanity checks
        if( numChannels <= 0 )
        {
            throw new Error("Pas bon");
        }
        
        super( audioContext );
        
        // default values
        this._averagingTime = 30;	/// msec
        this._attack = 10; /// msec
        this._release = 30; /// msec
        this._compressorThreshold = -30;	/// msec
        this._expanderThreshold = -60;	/// msec
        this._compressorRatio = 1;
        this._expanderRatio = 1;
        this._makeupIndB = 0;	/// dB
        this._samplerate = utilities.clamp( audioContext.sampleRate, 22050, 192000 );
        
        this._bypass = false;
        
        /// local variables
        this._makeup = undefined;
        this._tav = undefined;
        this._rms = 0.0;
        this._at = undefined;
        this._rt = undefined;
        this._CS = undefined;
        this._ES = undefined;
        this._g = 1.0;
        
        this._numChannels = numChannels;
        this._sideChainIndex = 0;           ///< index of the channel that is used for side chain
        this._buffer = new Array( 1024 );   /// buffer holding the gain values
        
        if( this._sideChainIndex < 0 || this._sideChainIndex >= this._numChannels )
        {
            throw new Error("Pas bon");
        }
        
        this._updateParameters();
        
        /// the script processor part
        {
            const bufferSize = 0;
            /*
             The buffer size in units of sample-frames. If specified, the bufferSize must be one of the following values:
             256, 512, 1024, 2048, 4096, 8192, 16384. If it's not passed in, or if the value is 0,
             then the implementation will choose the best buffer size for the given environment,
             which will be a constant power of 2 throughout the lifetime of the node.
             */
            const numberOfInputChannels  = numChannels;
            const numberOfOutputChannels = numChannels;
            this._scriptNode = audioContext.createScriptProcessor( bufferSize,
                                                                   numberOfInputChannels,
                                                                   numberOfOutputChannels );
            
            
            var compressor = this;
            
            this._scriptNode.onaudioprocess = function( audioProcessingEvent )
            {
                var inputBuffer  = audioProcessingEvent.inputBuffer;
                var outputBuffer = audioProcessingEvent.outputBuffer;
                
                const numChannels = outputBuffer.numberOfChannels;
                
                if( inputBuffer.numberOfChannels != numChannels )
                {
                    throw new Error("Pas bon");
                }
                if( numChannels != compressor._numChannels )
                {
                    throw new Error("Pas bon");
                }
                
                const numSamples = inputBuffer.length;
                
                if( compressor._buffer.length < numSamples )
                {
                    /// make sure the array is large enough
                    compressor._buffer.length = numSamples;
                }
                
                const one_minus_tav = 1. - compressor._tav;
                
                const sideChainIndex = compressor._sideChainIndex;
                
                if( sideChainIndex < 0 || sideChainIndex >= numChannels )
                {
                    throw new Error("Pas bon");
                }
                
                /// first : analyze the side chain signal
                {
                    var inputData  = inputBuffer.getChannelData( sideChainIndex );
                    
                    for( let i = 0; i < numSamples; i++ )
                    {
                        const x = inputData[i];
                        
                        compressor._rms = one_minus_tav * compressor._rms + compressor._tav * x * x;
                        
                        const X = ( compressor._rms < 1e-12 ) ? ( -120. ) : ( utilities.lin2powdB( compressor._rms ) );
                        
                        var G = 0.0;
                        if( X > compressor._compressorThreshold )
                        {
                            G = compressor._CS * ( compressor._compressorThreshold - X );
                        }
                        else if( X < compressor._expanderThreshold )
                        {
                            G = compressor._ES * ( X - compressor._expanderThreshold );
                        }
                        
                        const f = utilities.dB2lin( G );
                        
                        const coeff = ( f < compressor._g ) ? ( compressor._at ) : ( compressor._rt );
                        
                        compressor._g = ( 1.0 - coeff ) * compressor._g + coeff * f;
                        
                        /// store the resulting (compressed) gain
                        compressor._buffer[i] = compressor._g * compressor._makeup;
                    }
                }
                
                /// then apply the compression gain to the signals
                for( let k = 0; k < numChannels; k++ )
                {
                    var inputData  = inputBuffer.getChannelData( k );
                    var outputData = outputBuffer.getChannelData( k );
                    
                    if( k != sideChainIndex )
                    {
                        /// do not compress the side chain channel
                        
                        for( let i = 0; i < numSamples; i++ )
                        {
                            outputData[i] = inputData[i] * compressor._buffer[i];
                        }
                    }
                    else
                    {
                        /// the side-chain channel is pass-through, unchanged
                        for( let i = 0; i < numSamples; i++ )
                        {
                            outputData[i] = inputData[i];
                        }
                    }
                }
                
            }
        }
        
        if( this._bypass === true )
        {
            this._input.connect( this._output );
        }
        else
        {
            this._input.connect( this._scriptNode );
            this._scriptNode.connect( this._output );
        }
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Determine which of the input channels should be considered the side-chain
     *
     */
    /************************************************************************************/
    setSideChainChannel( channelIndex )
    {
        if( channelIndex < 0 || channelIndex >= this._numChannels )
        {
            throw new Error("Pas bon");
        }
        
        this._sideChainIndex = channelIndex;
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Returns the index of the current side-chain channel
     *
     */
    /************************************************************************************/
    getSideChainChannel()
    {
        return this._sideChainIndex;
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Set attack time
     *
     */
    /************************************************************************************/
    setAttack( valueInMsec )
    {
        const MinAttack = 0.1;	/// msec
        const MaxAttack = 3000; /// msec
        
        this._attack = utilities.clamp( valueInMsec, MinAttack, MaxAttack );
        
        this._updateParameters();
    }

    /************************************************************************************/
    /*!
     *  @brief          Set release time
     *
     */
    /************************************************************************************/
    setRelease( valueInMsec )
    {
        const MinRelease = 0.1;	/// msec
        const MaxRelease = 5000; /// msec
        
        this._release = utilities.clamp( valueInMsec, MinRelease, MaxRelease );
        
        this._updateParameters();
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Set the compressor threshold
     *
     */
    /************************************************************************************/
    setCompressorThreshold( valueIndB )
    {
        const MinCompressorThreshold = -120;	/// dB
        const MaxCompressorThreshold = 20;		/// dB
        
        this._compressorThreshold = utilities.clamp( valueIndB, MinCompressorThreshold, MaxCompressorThreshold );
        
        this._updateParameters();
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Set the expander threshold
     *
     */
    /************************************************************************************/
    setExpanderThreshold( valueIndB )
    {
        const MinExpanderThreshold = -120;	/// dB
        const MaxExpanderThreshold = 20;		/// dB
        
        this._expanderThreshold = utilities.clamp( valueIndB, MinExpanderThreshold, MaxExpanderThreshold );
        
        this._updateParameters();
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Set the compressor ratio
     *
     */
    /************************************************************************************/
    setCompressorRatio( value )
    {
        const MinCompressorRatio = 1;
        const MaxCompressorRatio = 30;
        
        this._compressorRatio = utilities.clamp( value, MinCompressorRatio, MaxCompressorRatio );
        
        this._updateParameters();
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Set the expander ratio
     *
     */
    /************************************************************************************/
    setExpanderRatio( value )
    {
        const MinExpanderRatio = 0.1;
        const MaxExpanderRatio = 1;
        
        this._expanderRatio = utilities.clamp( value, MinExpanderRatio, MaxExpanderRatio );
        
        this._updateParameters();
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Set the make up gain
     *
     */
    /************************************************************************************/
    setMakeUpGain( valueIndB )
    {
        const MinMakeUpGain = -40; /// dB
        const MaxMakeUpGain = 40;
        
        this._makeupIndB = utilities.clamp( value, MinMakeUpGain, MaxMakeUpGain );
        
        this._updateParameters();
    }
    
    setRMSAveragingTime( timeInMilliseconds )
    {
        const MinRmsAveragingTime = 5;	/// msec
        const MaxRmsAveragingTime = 130;
        
        this._averagingTime = utilities.clamp( timeInMilliseconds, MinRmsAveragingTime, MaxRmsAveragingTime );
        
        this._updateParameters();
    }
    
    ms2param( valueInMilliseconds, sr )
    {
        const inv_sr = 1.0 / sr;
        
        return 1.0 - Math.exp( -2.2 * inv_sr * 1000. / valueInMilliseconds );
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Update local values
     *
     */
    /************************************************************************************/
    _updateParameters()
    {
        if( typeof this._samplerate === "undefined" )
        {
            this._samplerate == 48000;
        }
        
        this._samplerate = utilities.clamp( this._samplerate, 22050, 192000 );
        
        const sr = this._samplerate;
        
        this._tav = this.ms2param( this._averagingTime, sr );
        this._at = this.ms2param( this._attack, sr );
        this._rt = this.ms2param( this._release, sr );
        
        this._makeup = utilities.dB2lin( this._makeupIndB );
        
        this._CS = 1. - 1. / this._compressorRatio;
        this._ES = 1. - 1. / this._expanderRatio;
        
        this._rms = 0.0;
        this._g = 1.0;
    }
    
}
