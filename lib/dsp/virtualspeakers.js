/************************************************************************************/
/*!
 *   @file       virtualspeakers.js
 *   @brief      This class implements the 5.1 to binaural virtual speakers
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';
import binaural from 'binaural';

export default class VirtualSpeakersNode extends AbstractNode
{
    //==============================================================================
    /**
     * @brief This class implements the 5.1 to binaural virtual speakers
     *
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
     */
    constructor( audioContext, audioStreamDescriptionCollection )
    {
        super( audioContext, audioStreamDescriptionCollection );
        this._splitterNode = undefined;
        this._gainNodes = [];

        /// retrieves the positions of all streams
        const horizontalPositions = this._getHorizontalPlane();

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        const totalNumberOfChannels_ = this._audioStreamDescriptionCollection.totalNumberOfChannels;

        /// retrieves the positions of all streams 
        const sofaPositions = this._getSofaPositions();

        /// at the moment, we load the whole HRTF file
        this._binauralPanner = new binaural.audio.BinauralPanner({
            audioContext: audioContext,
            coordinateSystem: 'sofaSpherical',
            //filterPositions: horizontalPositions,
            //filterPositionsType : 'sofaSpherical',
            crossfadeDuration: 0.01,
            sourceCount: totalNumberOfChannels_,
            sourcePositions: sofaPositions,
        });

        /// connect the outputs
        this._binauralPanner.connectOutputs( this._output );

        this._splitterNode = audioContext.createChannelSplitter( totalNumberOfChannels_ );
        
        /// create one gain Node for each virtual speaker
        /// i.e. each virtual speaker has an independent gain setting
        for( let i = 0; i < totalNumberOfChannels_; i++ )
        {
            const newGainNode = audioContext.createGain();
            this._gainNodes.push( newGainNode );

            /// also initialize the gain to 1.0
            this._gainNodes[i].gain.value = 1.0;
        }

        /// connect the output of the splitter to the respective gain nodes
        for( let i = 0; i < totalNumberOfChannels_; i++ )
        {
            this._splitterNode.connect( this._gainNodes[i], i );
        }

        /// connect the output of the gain nodes to the respective binaural source
        for( let i = 0; i < totalNumberOfChannels_; i++ )
        {
            this._binauralPanner.connectInputByIndex( i, this._gainNodes[i], 0, 0 );
        }

        /// sanity checks
        if( this._splitterNode.numberOfInputs != 1 
            || this._splitterNode.numberOfOutputs != totalNumberOfChannels_ )
        {
            throw new Error("Pas bon");
        }

        /// split the input streams into 10 independent channels
        this._input.connect( this._splitterNode );

        /// an HRTF set is loaded upon initialization of the application...

        this._listenerYaw = 0.0;
    }

    //==============================================================================
    getNumChannels()
    {
        return this._gainNodes.length;
    }

    //==============================================================================
    setGainForVirtualSource( sourceIndex, linearGain )
    {
        const numChannels = this.getNumChannels();

        if( sourceIndex < 0 || sourceIndex >= numChannels ){
            throw new Error( "Invalid source index : " + sourceIndex );
        }

        this._gainNodes[ sourceIndex ].gain.value = linearGain;
    }

    //==============================================================================
    /**
     * Set listenerYaw
     * @type {number} yaw angle in degrees
     */
    set listenerYaw(value)
    {
        this._listenerYaw = value;


        /// the view vector must be expressed in sofaSpherical
        const viewPos = [ -1. * this._listenerYaw, 0., 1. ];

        /*
        /// making the listener yaw rotation 'a la mano'
        {
            const sofaPositions = this._getSofaPositions();
            var relativePositions = [];

            for( let i = 0; i < sofaPositions.length; i++ )
            {
                /// relative position in sofa spherical coordinates
                const az = sofaPositions[i][0] + this._listenerYaw;
                const el = sofaPositions[i][1];
                const di = sofaPositions[i][2];

                const pos = [az, el, di];

                relativePositions.push( pos );
            }

            this._binauralPanner.sourcePositions = relativePositions;
            this._binauralPanner.update();
        }
        */
        
        {
            this._binauralPanner.listenerView = viewPos;
            this._binauralPanner.update();
        }
        
    }

    /**
     * Get listenerYaw
     * @type {number} yaw angle in degrees
     */
    get listenerYaw()
    {
        return this._listenerYaw;   
    }

    //==============================================================================
    /**
     * Returns a fallabck url in case bili2 is not accessible
     * @type {string} url
     */
    getFallbackUrls()
    {
        const sampleRate = this._audioContext.sampleRate;

        /*
        const sofaUrl = './hrtf/IRC_1147_C_HRIR_M_' + sampleRate + '.sofa.json';

        return sofaUrl;
        */

        var sofaUrl = [];

        sofaUrl.push( './hrtf/IRC_1147_C_HRIR_M_' + sampleRate + '.sofa.json' );
        sofaUrl.push( './hrtf/OLPS_2042_C_HRIR_M_' + sampleRate + '.sofa.json' );
        sofaUrl.push( './hrtf/OLPS_2044_C_HRIR_M_' + sampleRate + '.sofa.json' );

        return sofaUrl;
    }

    //==============================================================================
    /**
     * Load a new HRTF from a given URL
     * @type {string} url
     */
    loadHrtfSet( url )
    {

        return this._binauralPanner.loadHrtfSet( url )
               .then( () =>
                {
                    if( typeof this._binauralPanner.filterPositions !== 'undefined' )
                    {
                        console.log( 'loaded hrtf from ' + url + ' with ' + this._binauralPanner.filterPositions.length + ' positions' );
                    }
                    else
                    {
                        console.log( 'loaded hrtf from ' + url );   
                    }

                   /// update the listener yaw
                   this.listenerYaw = this._listenerYaw;
                }
                )
                .catch( () => 
                {
                    console.log('could not access bili2.ircam.fr...');                
                    /// using default data instead                    

                    const sampleRate = this._audioContext.sampleRate;

                    const sofaUrl = this.getFallbackUrl();
                    console.log('using ' + sofaUrl + ' instead');

                    return this._binauralPanner.loadHrtfSet( sofaUrl )
                    .then( () => 
                    {
                        if( typeof this._binauralPanner.filterPositions !== 'undefined' )
                        {
                            console.log( 'loaded hrtf from ' + sofaUrl + ' with ' + this._binauralPanner.filterPositions.length + ' positions' );
                        }
                        else
                        {
                            console.log( 'loaded hrtf from ' + sofaUrl );   
                        }

                        this.listenerYaw = this._listenerYaw;
                    });                    
                });        

    }

    //==============================================================================
    /// Returns an array of positions in the horizontal plane only.
    _getHorizontalPlane(){

        var sofaPositions = [];

        for( let i = -180; i <= 180; i += 1 )
        {
            /// positions expressed with Spat4 navigation coordinate
            const azimuth = i;

            /// convert to SOFA spherical coordinate
            const sofaAzim = -1. * azimuth;
            const sofaElev = 0.;
            const sofaDist = 1.;

            const sofaPos = [ sofaAzim, sofaElev, sofaDist ];

            sofaPositions.push( sofaPos );
        }

        return sofaPositions;
    }

    //==============================================================================
    /// returns all the source positions, with the SOFA spherical coordinate
    _getSofaPositions()
    {
        /// retrieves the AudioStreamDescriptionCollection
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        const asdc = this._audioStreamDescriptionCollection.streams;
        
        var channelIndex = 0;

        var sofaPositions = [];

        /// go through all the streams and mute/unmute according to their 'active' flag
        for( let stream of asdc)
        {
            /// positions expressed with Spat4 navigation coordinate
            const azimuths = stream.channelPositions;

            const numChannelsForThisStream = stream.numChannels;

            for( let i = 0; i < numChannelsForThisStream; i++ )
            {
                /// positions expressed with Spat4 navigation coordinate
                const azimuth = azimuths[i];

                /// convert to SOFA spherical coordinate
                const sofaAzim = -1. * azimuth;
                const sofaElev = 0.;
                const sofaDist = 1.;

                const sofaPos = [ sofaAzim, sofaElev, sofaDist ];

                sofaPositions.push( sofaPos );
            }
        }

        return sofaPositions;
    }
}
