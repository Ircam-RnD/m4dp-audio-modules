/************************************************************************************/
/*!
 *   @file       peaklimiter.js
 *   @brief      This class implements a peak limiter
 *   @author     Marc Emerit, adapted by Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';
import utilities from '../core/utils.js';

export default class PeakLimiterNode extends AbstractNode
{
    /************************************************************************************/
    /*!
     *  @brief          Class constructor
     *  @param[in]      audioContext
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
        
        this.maxBufferIndex = 0;
        this.delayBufferIndex = 0;
        this.maxBufferSlowIndex = 0;
        this.maxBufferSectiontionIndex = 0;
        this.maxBufferSectiontionControl = 0;
        
        this.attackMs = 0;
        this.maxAttackMs = 0;
        this.attackConst = 0;
        this.releaseConst = 0;
        this.threshold = 0;
        this.channels = 0;
        this.maxChannels = 0;
        this.sampleRate = 0;
        this.maxSampleRate = 0;
        
        this.cor = 1.0;
        this.smoothState = 1.0;
        this.minGain = 1.0;
        
        this.maxBuffer = null;
        this.delayBuffer = null;
        this.maxBufferSlow = null;
        
        
        /// additions:
        
        
        this.maxSampleRate = 192000;
        
        this.sampleRate = utilities.clamp( audioContext.sampleRate, 22050, 192000 );
        
        this.init( 5, 80, utilities.dB2lin( -25 ), numChannels, 192000 );
        
        this.setSampleRate( this.sampleRate );
        
        this.reset();
        
        this.setNChannels( numChannels );
        
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
            
            
            var processor = this;
            
            this._scriptNode.onaudioprocess = function( audioProcessingEvent )
            {
                var inputBuffer  = audioProcessingEvent.inputBuffer;
                var outputBuffer = audioProcessingEvent.outputBuffer;
                
                const numChannels = outputBuffer.numberOfChannels;
                
                if( inputBuffer.numberOfChannels != numChannels )
                {
                    throw new Error("Pas bon");
                }
                if( numChannels != processor.channels )
                {
                    throw new Error("Pas bon");
                }
                
                for( let j = 0; j < numChannels; j++ )
                {
                    processor.input[j]  = inputBuffer.getChannelData(j);
                    processor.output[j] = outputBuffer.getChannelData(j);
                }
                
                const numSamples = inputBuffer.length;
                
                var tmp, gain;
                var maximum, sectionMaximum;
                
                for( let i = 0; i < numSamples; i++ )
                {
                    
                    /* get maximum absolute sample value of all channels */
                    tmp = processor.threshold;
                    for( let j = 0; j < processor.channels; j++ )
                    {
                        tmp = Math.max( tmp, Math.abs( processor.input[j][i] ) );
                    }
                    
                    /* running maximum over attack+1 samples */
                    processor.maxBuffer[processor.maxBufferIndex] = tmp;
                    
                    /* search section of maxBuffer */
                    sectionMaximum = processor.maxBuffer[processor.maxBufferSectiontionIndex];
                    for( let j = 1; j < processor.secLen; j++ )
                    {
                        if( processor.maxBuffer[processor.maxBufferSectiontionIndex + j] > sectionMaximum )
                        {
                            sectionMaximum = processor.maxBuffer[processor.maxBufferSectiontionIndex + j];
                        }
                    }
                    
                    /* find maximum of slow (downsampled) max Bufferfer */
                    maximum = sectionMaximum;
                    for( let j = 0; j < processor.nMaxBufferSection; j++ )
                    {
                        if( processor.maxBufferSlow[j] > maximum )
                        {
                            maximum = processor.maxBufferSlow[j];
                        }
                    }
                    
                    processor.maxBufferIndex++;
                    processor.maxBufferSectiontionControl++;
                    
                    /* if maxBuffer section is finished, or end of maxBuffer is reached,*/
                    /*   store the maximum of this section and open up a new one */
                    if( (processor.maxBufferSectiontionControl >= processor.secLen) || (processor.maxBufferIndex >= processor.attack + 1))
                    {
                        processor.maxBufferSectiontionControl = 0;
                        
                        processor.maxBufferSlow[processor.maxBufferSlowIndex] = sectionMaximum;
                        processor.maxBufferSlowIndex++;
                        if( processor.maxBufferSlowIndex >= processor.nMaxBufferSection)
                        {
                            processor.maxBufferSlowIndex = 0;
                        }
                        processor.maxBufferSlow[processor.maxBufferSlowIndex] = 0.0;  /* zero out the value representing the new section */
                        
                        processor.maxBufferSectiontionIndex += processor.secLen;
                    }
                    
                    if( processor.maxBufferIndex >= (processor.attack + 1))
                    {
                        processor.maxBufferIndex = 0;
                        processor.maxBufferSectiontionIndex = 0;
                    }
                    
                    /* calc gain */
                    if( maximum > processor.threshold )
                    {
                        gain = processor.threshold / maximum;
                    }
                    else
                    {
                        gain = 1;
                    }
                    
                    /* gain smoothing */
                    /* first order IIR filter with attack correction to avoid overshoots */
                    
                    /* correct the 'aiming' value of the exponential attack to avoid the remaining overshoot */
                    if( gain < processor.smoothState)
                    {
                        processor.cor = Math.min(processor.cor, (gain - 0.1 * processor.smoothState) * 1.11111111);
                    }
                    else
                    {
                        processor.cor = gain;
                    }
                    
                    /* smoothing filter */
                    if( processor.cor < processor.smoothState )
                    {
                        processor.smoothState = processor.attackConst * (processor.smoothState - processor.cor) + processor.cor;  /* attack */
                        processor.smoothState = Math.max(processor.smoothState, gain); /* avoid overshooting target */
                    }
                    else
                    {
                        processor.smoothState = processor.releaseConst * (processor.smoothState - processor.cor) + processor.cor; /* release */
                    }
                    
                    gain = processor.smoothState;
                    
                    /* lookahead delay, apply gain */
                    for( let j = 0; j < processor.channels; j++ )
                    {
                        tmp = processor.delayBuffer[processor.delayBufferIndex * processor.channels + j];
                        processor.delayBuffer[processor.delayBufferIndex * processor.channels + j] = processor.input[j][i];
                        
                        tmp *= gain;
                        if( tmp > processor.threshold)
                        {
                            tmp = processor.threshold;
                        }
                        if( tmp < -processor.threshold)
                        {
                            tmp = -processor.threshold;
                        }
                        
                        processor.output[j][i] = tmp;
                    }
                    
                    processor.delayBufferIndex++;
                    if( processor.delayBufferIndex >= processor.attack )
                    {
                        processor.delayBufferIndex = 0;
                    }
                    
                    /* save minimum gain factor */
                    //if( gain < processor.minGain )
                    {
                        processor.minGain = gain;
                    }
                }
            }
        }
        
        
        this._input.connect( this._scriptNode );
        this._scriptNode.connect( this._output );
        
    }
    
    
    /************************************************************************************/
    /*!
     *  @brief          init(maxAttackMsIn, releaseMsIn, thresholdIn, maxChannelsIn, maxSampleRateIn) : Must be called to initialized the class
     *  @param          maxAttackMsIn : maximum value for the attack time. It is the time to reach to correct attenutation to avoid clipping.
     *                  this parameter defines the amount of memory used by the class. It is a float or integer value
     *  @param          releaseMsIn : defines the time to release the gain. It is the time for the gain to go 
     *                  back to its nominal value after an attenaution to avoid clipping
     *                  It is a float or integer value
     *  @param          thresholdIn : maximum value fro absolutie value. It is a float value
     *  @param          maxChannelsIn : maximum value of the number of channel that can be used. Number of channels value can be changed after class creation
     *                  but the value must be lower than maxChannelsIn. The gain between channels are inked.
     *  @param          maxSampleRateIn : maximum value of the sample rate that can be used. Sample rate value can be changed after class creation
     *                  but the value must be lower than maxSampleRateIn.
     *
     */
    /************************************************************************************/
    init( maxAttackMsIn, releaseMsIn, thresholdIn, maxChannelsIn, maxSampleRateIn)
    {
        
        this.attack = Math.floor(maxAttackMsIn * maxSampleRateIn / 1000);
        if( this.attack < 1)
        {
            /* attack time is too short */
            this.attack = 1;
        }
        
        /* length of maxBuffer sections */
        this.secLen = Math.floor(Math.sqrt(this.attack + 1));
        /* sqrt(attack+1) leads to the minimum
         of the number of maximum operators:
         nMaxOp = secLen + (attack+1)/secLen */
        
        /* alloc limiter struct */
        
        this.nMaxBufferSection = Math.floor((this.attack + 1) / this.secLen);
        if( this.nMaxBufferSection * this.secLen < (this.attack + 1))
        {
            this.nMaxBufferSection++; /* create a full section for the last samples */
        }
        
        /* alloc maximum and delay Bufferfers */
        this.maxBuffer = new Float32Array(this.nMaxBufferSection * this.secLen);
        this.delayBuffer = new Float32Array(this.attack * maxChannelsIn);
        this.maxBufferSlow = new Float32Array(this.nMaxBufferSection);
        
        this.input = new Array(maxChannelsIn);
        this.output = new Array(maxChannelsIn);
        for (var j = 0; j < maxChannelsIn; j++)
        {
            this.input[j] = null;
            this.output[j] = null;
        }
        
        if( (typeof this.maxBuffer == 'undefined') || (typeof this.delayBuffer == 'undefined') || (typeof this.maxBufferSlow == 'undefined'))
        {
            this.destroy();
            return;
        }
        this.reset();
        
        /* init parameters & states */
        this.maxBufferIndex = 0;
        this.delayBufferIndex = 0;
        this.maxBufferSlowIndex = 0;
        this.maxBufferSectiontionIndex = 0;
        this.maxBufferSectiontionControl = 0;
        
        this.attackMs = maxAttackMsIn;
        this.maxAttackMs = maxAttackMsIn;
        this.attackConst = Math.pow(0.1, 1.0 / (this.attack + 1));
        this.releaseConst = Math.pow(0.1, 1.0 / (releaseMsIn * maxSampleRateIn / 1000 + 1));
        this.threshold = thresholdIn;
        this.channels = maxChannelsIn;
        this.maxChannels = maxChannelsIn;
        this.sampleRate = maxSampleRateIn;
        this.maxSampleRate = maxSampleRateIn;
        
        this.cor = 1.0;
        this.smoothState = 1.0;
        this.minGain = 1.0;
    }
    
    /************************************************************************************/
    /*!
     *  @brief          release the memory allocated by the object. Memory is allocated when init fucntion is called
     *
     */
    /************************************************************************************/
    destroy()
    {
        delete this.maxBuffer;
        delete this.delayBuffer;
        delete this.maxBufferSlow;
    }
    
    /************************************************************************************/
    /*!
     *  @brief          get delay in samples
     *
     */
    /************************************************************************************/
    getDelay()
    {
        return this.attack;
    }
    
    /************************************************************************************/
    /*!
     *  @brief          get attack in msec
     *
     */
    /************************************************************************************/
    getAttack()
    {
        return this.attackMs;
    }
    
    getSampleRate()
    {
        return this.sampleRate;
    }
    
    getRelease()
    {
        return this.releaseMs;
    }
    
    /************************************************************************************/
    /*!
     *  @brief          get maximum gain reduction of last processed block
     *
     */
    /************************************************************************************/
    getMaxGainReduction()
    {
        return -20 * Math.log( this.minGain ) / Math.LN10;
    }
    
    setNChannels( nChannelsIn )
    {
        if( nChannelsIn == this.maxChannels) return true;
        if( nChannelsIn > this.maxChannels) return false;
        
        this.channels = nChannelsIn;
        this.reset();
        
        return true;
    }
    
    setInput( nChannelsInNum, input )
    {
        if( nChannelsInNum >= this.channels )
        {
            return false;
        }
        
        return true;
    }
    
    setOutput( nChannelsOutNum, output )
    {
        if( nChannelsOutNum >= this.channels )
        {
            return false;
        }
        
        return true;
    }
    
    setSampleRate( sampleRateIn )
    {
        
        if( sampleRateIn == this.maxSampleRate) return true;
        if( sampleRateIn > this.maxSampleRate) return false;
        
        /* update attack/release constants */
        this.attack = Math.floor(this.attackMs * sampleRateIn / 1000);
        
        if( this.attack < 1) /* attack time is too short */
            this.attack = 1;
        
        /* length of maxBuffer sections */
        this.secLen = Math.floor(Math.sqrt(this.attack + 1));
        
        this.nMaxBufferSection = Math.floor((this.attack + 1) / this.secLen);
        if( this.nMaxBufferSection * this.secLen < (this.attack + 1))
            this.nMaxBufferSection++;
        this.attackConst = Math.pow(0.1, 1.0 / (this.attack + 1));
        this.releaseConst = Math.pow(0.1, 1.0 / (this.releaseMs * sampleRateIn / 1000 + 1));
        this.sampleRate = sampleRateIn;
        
        /*reset */
        this.reset();
        
        return true;
    }
    
    setAttack( attackMsIn )
    {
        
        if( attackMsIn == this.attackMs) return true;
        if( attackMsIn > this.maxAttackMs) return false;
        
        /* calculate attack time in samples */
        this.attack = Math.floor(attackMsIn * this.sampleRate / 1000);
        
        if( this.attack < 1) /* attack time is too short */
            this.attack = 1;
        
        /* length of maxBuffer sections */
        this.secLen = Math.floor(Math.sqrt(this.attack + 1));
        
        this.nMaxBufferSection = Math.floor((this.attack + 1) / this.secLen);
        if( this.nMaxBufferSection * this.secLen < (this.attack + 1))
            this.nMaxBufferSection++;
        this.attackConst = Math.pow(0.1, 1.0 / (this.attack + 1));
        this.attackMs = attackMsIn;
        
        /* reset */
        this.reset();
        
        return true;
    }
    
    setRelease( releaseMsIn )
    {
        if( releaseMsIn == this.releaseMs) return true;
        this.releaseConst = Math.pow(0.1, 1.0 / (releaseMsIn * this.sampleRate / 1000 + 1));
        this.releaseMs = releaseMsIn;
        
        return true;
    }
    
    setThreshold( thresholdIn )
    {
        this.threshold = thresholdIn;
        
        return true;
    }
    
    getThreshold()
    {
        return this.threshold;
    }
    
    reset()
    {
        
        this.maxBufferIndex = 0;
        this.delayBufferIndex = 0;
        this.maxBufferSlowIndex = 0;
        this.maxBufferSectiontionIndex = 0;
        this.maxBufferSectiontionControl = 0;
        this.cor = 1.0;
        this.smoothState = 1.0;
        this.minGain = 1.0;
        
        for( var i = 0; i < this.attack + 1; i++)
        {
            this.maxBuffer[i] = 0;
        }
        for( var i = 0; i < this.attack * this.channels; i++)
        {
            this.delayBuffer[i] = 0;
        }
        for( var i = 0; i < this.nMaxBufferSection; i++)
        {
            this.maxBufferSlow[i] = 0;
        }
        
        return true;
    }
}

