/************************************************************************************/
/*!
 *   @file       compressorexpander.js
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
 *  @class          CompressorExpanderNode
 *  @brief          Compressor/Expander
 *  @details        The processor does not include the lookahead of the C++ version
 *  @details        mono version
 *
 */
/************************************************************************************/
export default class CompressorExpanderNode extends AbstractNode
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
			const numberOfInputChannels = 1;
			const numberOfOutputChannels = 1;
			this._scriptNode = audioContext.createScriptProcessor( bufferSize,
																   numberOfInputChannels,
																   numberOfOutputChannels );


            var compressor = this;
            
			this._scriptNode.onaudioprocess = function( audioProcessingEvent )
			{
			  	var inputBuffer = audioProcessingEvent.inputBuffer;
			  	var outputBuffer = audioProcessingEvent.outputBuffer;

			  	const inputIndex = 0;
			  	const outputIndex = 0;

				var inputData = inputBuffer.getChannelData( inputIndex );
    			var outputData = outputBuffer.getChannelData( outputIndex );

    			const numSamples = inputBuffer.length;

				const one_minus_tav = 1. - compressor._tav;

                const CT = compressor._compressorThreshold;
                const ET = compressor._expanderThreshold;

                for( let i = 0; i < numSamples; i++ )
                {
                    const x = inputData[i];

                    compressor._rms = one_minus_tav * compressor._rms + compressor._tav * x * x;

                    const X = ( compressor._rms < 1e-12 ) ? ( -120. ) : ( utilities.lin2powdB( compressor._rms ) );

                    const G = utilities.smin( 0.0, CS * ( CT - X ), ES * ( ET - X ) );

                    const f = utilities.dB2lin( G );
                    
                    const coeff = ( f < compressor._g ) ? ( compressor._at ) : ( compressor._rt );
                    
                    compressor._g = compressor._g + coeff * ( f - compressor._g );
                    
                    outputData[i] = x * compressor._g * compressor._makeup;
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

	//==============================================================================
    /**
     * @brief Set attack time
     *
     */
	setAttack( valueInMsec )
    {
		const MinAttack = 0.1;	/// msec
		const MaxAttack = 3000; /// msec

		this._attack = utilities.clamp( valueInMsec, MinAttack, MaxAttack );

		this._updateParameters();
	}

	//==============================================================================
    /**
     * @brief Set release time
     *
     */
	setRelease( valueInMsec )
    {
		const MinRelease = 0.1;	/// msec
		const MaxRelease = 5000; /// msec

		this._release = utilities.clamp( valueInMsec, MinRelease, MaxRelease );

		this._updateParameters();
	}

	setCompressorThreshold( valueIndB )
    {
		const MinCompressorThreshold = -120;	/// dB
		const MaxCompressorThreshold = 20;		/// dB

		this._compressorThreshold = utilities.clamp( valueIndB, MinCompressorThreshold, MaxCompressorThreshold );

		this._updateParameters();
	}

	setExpanderThreshold( valueIndB )
    {
        const MinExpanderThreshold = -120;	/// dB
		const MaxExpanderThreshold = 20;		/// dB

		this._expanderThreshold = utilities.clamp( valueIndB, MinExpanderThreshold, MaxExpanderThreshold );

		this._updateParameters();
	}

	setCompressorRatio( value )
    {
        const MinCompressorRatio = 1;
		const MaxCompressorRatio = 30;

		this._compressorRatio = utilities.clamp( value, MinCompressorRatio, MaxCompressorRatio );

		this._updateParameters();
	}

	setExpanderRatio( value )
    {
        const MinExpanderRatio = 0.1;
		const MaxExpanderRatio = 1;

		this._expanderRatio = utilities.clamp( value, MinExpanderRatio, MaxExpanderRatio );

		this._updateParameters();
	}

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

	//==============================================================================
    /**
     * @brief Update local values
     *
     */
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


/************************************************************************************/
/*!
 *  @class          MultiCompressorExpanderNode
 *  @brief          multichannel version of CompressorExpanderNode
 *                  each channel is an independent compressor/expander
 *
 */
/************************************************************************************/
export class MultiCompressorExpanderNode extends AbstractNode
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
        this._compressorNodes = [];
        this._splitterNode = undefined;
        this._mergerNode = undefined;
        this._isBypass = false;
        
        /// sanity checks
        if( numChannels <= 0 )
        {
            throw new Error("Pas bon");
        }
        
        this._splitterNode = audioContext.createChannelSplitter( numChannels );
        
        this._mergerNode = audioContext.createChannelMerger( numChannels );
        
        /// sanity checks
        if( this._splitterNode.numberOfInputs != 1
           || this._splitterNode.numberOfOutputs != numChannels )
        {
            throw new Error("Pas bon");
        }
        
        /// sanity checks
        if( this._mergerNode.numberOfInputs != numChannels
           || this._mergerNode.numberOfOutputs != 1 )
        {
            throw new Error("Pas bon");
        }
        
        /// create N compressorNodes
        for( let i = 0; i < numChannels; i++ )
        {
            const newCompressorNode = new CompressorExpanderNode( audioContext );
            this._compressorNodes.push( newCompressorNode );
        }
        
        /// create the audio graph
        this._updateAudioGraph();
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Enable or bypass the processor
     *
     */
    /************************************************************************************/
    set bypass( value )
    {
        if( value !== this._isBypass )
        {
            this._isBypass = value;
            this._updateAudioGraph();
        }
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Returns true if the processor is bypassed
     *
     */
    /************************************************************************************/
    get bypass()
    {
        return this._isBypass;
    }
    
    /************************************************************************************/
    /*!
     *  @brief          Returns the current number of channels
     *
     */
    /************************************************************************************/
    getNumChannels()
    {
        return this._compressorNodes.length;
    }
    
    setAttack( valueInMsec )
    {
        const MinAttack = 0.1;	/// msec
        const MaxAttack = 3000; /// msec
        
        this._attack = utilities.clamp( valueInMsec, MinAttack, MaxAttack );
        
        this._updateParameters();
    }
    
    //==============================================================================
    setRelease( valueInMsec )
    {
        const numChannels = this.getNumChannels();
        
        for( let i = 0; i < numChannels; i++ )
        {
            this._compressorNodes[ i ].setRelease( valueInMsec );
        }
    }
    
    setCompressorThreshold( valueIndB )
    {
        const numChannels = this.getNumChannels();
        
        for( let i = 0; i < numChannels; i++ )
        {
            this._compressorNodes[ i ].setCompressorThreshold( valueIndB );
        }
    }
    
    setExpanderThreshold( valueIndB )
    {
        const numChannels = this.getNumChannels();
        
        for( let i = 0; i < numChannels; i++ )
        {
            this._compressorNodes[ i ].setExpanderThreshold( valueIndB );
        }
    }
    
    setCompressorRatio( value )
    {
        const numChannels = this.getNumChannels();
        
        for( let i = 0; i < numChannels; i++ )
        {
            this._compressorNodes[ i ].setCompressorRatio( value );
        }
    }
    
    setExpanderRatio( value )
    {
        const numChannels = this.getNumChannels();
        
        for( let i = 0; i < numChannels; i++ )
        {
            this._compressorNodes[ i ].setExpanderRatio( value );
        }
    }
    
    setMakeUpGain( valueIndB )
    {
        const numChannels = this.getNumChannels();
        
        for( let i = 0; i < numChannels; i++ )
        {
            this._compressorNodes[ i ].setMakeUpGain( valueIndB );
        }
    }
    
    setRMSAveragingTime( timeInMilliseconds )
    {
        const numChannels = this.getNumChannels();
        
        for( let i = 0; i < numChannels; i++ )
        {
            this._compressorNodes[ i ].setRMSAveragingTime( timeInMilliseconds );
        }
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
        this._mergerNode.disconnect();
        for( let i = 0; i < numChannels; i++ )
        {
            this._compressorNodes[ i ].disconnect();
        }
        
        if( this.bypass === true || numChannels === 0 )
        {
            this._input.connect( this._output );
        }
        else
        {
            /// split the input streams into N independent channels
            this._input.connect( this._splitterNode );
            
            /// connect a compressorNode to each channel
            for( let i = 0; i < numChannels; i++ )
            {
                this._splitterNode.connect( this._compressorNodes[i]._input, i );
            }
            
            /// then merge the output of the N compressorNodes
            for( let i = 0; i < numChannels; i++ )
            {
                this._compressorNodes[i].connect( this._mergerNode, 0, i );
            }
            
            this._mergerNode.connect( this._output );
        }
        
    }
}

