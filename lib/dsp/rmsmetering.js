/************************************************************************************/
/*!
 *   @file       rmsmetering.js
 *   @brief      RMS metering
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       06/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';
import utilities from '../core/utils.js';

/************************************************************************************/
/*!
 *  @class          RMSMetering
 *  @brief          RMS metering using an averaging filter
 *                  (first order low pass filter with smoothing factor)
 *                  a.k.a Exponentially Weighted Moving Average a.k.a exponential smoothing
 *  @ingroup        dsp
 *
 */
/************************************************************************************/
export default class RmsMetering extends AbstractNode
{
    
    /************************************************************************************/
    /*!
     *  @brief          Class constructor
     *
     */
    /************************************************************************************/
    constructor( audioContext )
    {
        super( audioContext );
        
        // default values
        this._samplerate = utilities.clamp( audioContext.sampleRate, 22050, 192000 );
        this._value = 0.0;
        this._tau = 20.0;   /// msec
        this._a = 0.0;
        this._b = 0.0;
        this._mem = 0.0;
        
        this.SetTimeConstant( this._tau );
        
        /// the script processor part
        {
            const bufferSize = 0;
            /*
             The buffer size in units of sample-frames. If specified, the bufferSize must be one of the following values:
             256, 512, 1024, 2048, 4096, 8192, 16384. If it's not passed in, or if the value is 0,
             then the implementation will choose the best buffer size for the given environment,
             which will be a constant power of 2 throughout the lifetime of the node.
             */
            const numberOfInputChannels  = 1;
            const numberOfOutputChannels = 0;
            this._scriptNode = audioContext.createScriptProcessor( bufferSize,
                                                                   numberOfInputChannels,
                                                                   numberOfOutputChannels );
            
            
            var metering = this;
            
            this._scriptNode.onaudioprocess = function( audioProcessingEvent )
            {
                var inputBuffer  = audioProcessingEvent.inputBuffer;
                
                if( inputBuffer.numberOfChannels != 1 )
                {
                    throw new Error("Pas bon");
                }
                
                const numSamples = inputBuffer.length;
                
                var tmp = 0.0;
                
                for( let i = 0; i < numSamples; i++ )
                {
                    const input = inputData[i];
                    
                    const x = metering._b * input * input;
                    tmp = x + metering._a * metering._mem;
                    metering._mem = tmp;
                }
                
                metering._value = tmp;
            }
        }
        
        
        this._input.connect( this._scriptNode );
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Returns the current RMS value, in dB
     *
     */
    /************************************************************************************/
    GetValuedB()
    {
        return utilities.lin2powdB( this._value + 1e-12 );
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Returns the current RMS value, linear
     *
     */
    /************************************************************************************/
    GetValue()
    {
        return this._value;
    }
    
    SetTimeConstant( valueInMilliseconds )
    {
        this._samplerate = utilities.clamp( this._samplerate, 22050, 192000 );
        
        const sr = this._samplerate;
        
        this._tau = utilities.clamp( valueInMilliseconds, 5.0, 500.0 );
        
        const tauInSeconds = this._tau / 1000;
        
        const dt = 1.0 / sr;
        
        var alpha = 1.0 - Math.exp( -dt / tauInSeconds );
        
        alpha = utilities.clamp( alpha, 0.001, 0.999 );
        
        this._a = 1. - alpha;
        this._b = 1. - this._a;
    }
        
    /************************************************************************************/
    /*!
     *  @brief          Clears the internal state of the object
     *
     */
    /************************************************************************************/
    clearState()
    {
        this._mem = 0.0;
        this._rms = 0.0;
    }

}



/************************************************************************************/
/*!
 *  @class          MultiRMSMetering
 *  @brief          multi-channel version of RMSMetering
 *  @ingroup        dsp
 *
 */
/************************************************************************************/
export class MultiRMSMetering extends AbstractNode
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
        super( audioContext );
        this._meterNodes = [];
        this._splitterNode = undefined;
        
        /// sanity checks
        if( numChannels <= 0 )
        {
            throw new Error("Pas bon");
        }
        
        this._splitterNode = audioContext.createChannelSplitter( numChannels );
        
        /// sanity checks
        if( this._splitterNode.numberOfInputs != 1
           || this._splitterNode.numberOfOutputs != numChannels )
        {
            throw new Error("Pas bon");
        }
        
        /// create N compressorNodes
        for( let i = 0; i < numChannels; i++ )
        {
            const newCompressorNode = new RmsMetering( audioContext );
            this._meterNodes.push( newCompressorNode );
        }
        
        /// create the audio graph
        this._updateAudioGraph();
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Returns the current number of channels
     *
     */
    /************************************************************************************/
    getNumChannels()
    {
        return this._meterNodes.length;
    }
    
    SetTimeConstant( valueInMilliseconds )
    {
        const numChannels = this.getNumChannels();
        
        for( let i = 0; i < numChannels; i++ )
        {
            this._meterNodes[ i ].SetTimeConstant( valueInMilliseconds );
        }
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Returns the current RMS value, in dB
     *
     */
    /************************************************************************************/
    GetValuedB( channelIndex )
    {
        /// boundary check
        if( channelIndex < 0 || channelIndex >= this.numChannels )
        {
            throw new Error("Invalid channel index");
        }
        
        return this._meterNodes[ channelIndex ].GetValuedB();
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Returns the current RMS value, linear
     *
     */
    /************************************************************************************/
    GetValue( channelIndex )
    {
        /// boundary check
        if( channelIndex < 0 || channelIndex >= this.numChannels )
        {
            throw new Error("Invalid channel index");
        }
        
        return this._meterNodes[ channelIndex ].GetValue();
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Returns the current RMS value, in dB, averaged for all channels
     *
     */
    /************************************************************************************/
    GetAverageForAllChannels()
    {
        var rms = [];
        
        /// average rms among all channels
        
        for( let i = 0; i < this.numChannels; i++ )
        {
            const lin = this.GetValue(i);
            
            rms.push( lin );
        }
        
        const avg = utilities.mean( rms );
        
        return utilities.lin2powdB( avg + 1e-12 );
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Updates the connections of the audio graph
     *
     */
    /************************************************************************************/
    _updateAudioGraph()
    {
        const numChannels = this.getNumChannels();
        
        /// first of all, disconnect everything
        this._input.disconnect();
        this._splitterNode.disconnect();
        for( let i = 0; i < numChannels; i++ )
        {
            this._meterNodes[ i ].disconnect();
        }
        
        /// split the input streams into N independent channels
        this._input.connect( this._splitterNode );
        
        /// connect a compressorNode to each channel
        for( let i = 0; i < numChannels; i++ )
        {
            this._splitterNode.connect( this._meterNodes[i]._input, i );
        }
    }
}



