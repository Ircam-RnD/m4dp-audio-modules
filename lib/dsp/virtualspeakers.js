/************************************************************************************/
/*!
 *   @file       virtualspeakers.js
 *   @brief      This class implements the 5.1 to binaural virtual speakers
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';
import binaural from 'binaural'

export default class VirtualSpeakersNode extends AbstractNode {
    //==============================================================================
    /**
     * @brief This class implements the 5.1 to binaural virtual speakers
     *
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
     */
    constructor( audioContext, audioStreamDescriptionCollection ){
        super( audioContext, audioStreamDescriptionCollection );
        this._splitterNode = undefined;
        this._binauralPanner = undefined;
        this._hrtfSet = undefined;
        this._listenerYaw = 0.0;

        /// retrieves the positions of all streams 
        const horizontalPositions = this._getHorizontalPlane();

        /// instanciate an empty hrtf set
        this._hrtfSet = new binaural.sofa.HrtfSet({
                 audioContext: audioContext,
                 positionsType: 'gl', // mandatory for BinauralPanner
                 filterPositions: horizontalPositions,
                 filterPositionsType: 'sofaSpherical',
         });

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        const totalNumberOfChannels_ = this._audioStreamDescriptionCollection.totalNumberOfChannels;

        this._splitterNode = audioContext.createChannelSplitter( totalNumberOfChannels_ );

        /// sanity checks
        if( this._splitterNode.numberOfInputs != 1 
            || this._splitterNode.numberOfOutputs != totalNumberOfChannels_ ){
            throw new Error("Pas bon");
        }

        /*
        if( sofaPositions.length != totalNumberOfChannels_ ){
            throw new Error("Pas bon");
        }
        */

        /// split the input streams into 10 independent channels
        this._input.connect( this._splitterNode );

        /// the binaural panner is not yet created;
        /// it will be instanciated and connected to the audio graph as soon as an SOFA URL is loaded
        
        const url = 'http://bili2.ircam.fr/SimpleFreeFieldHRIR/BILI/COMPENSATED/44100/IRC_1100_C_HRIR.sofa';
        this.loadHrtfSet( url );
    }

    //==============================================================================
    /**
     * Set listenerYaw
     * @type {number} yaw angle in degrees
     */
    set listenerYaw(value){
        this._listenerYaw = value;

        /// the view vector must be expressed in sofaSpherical
        const viewPos = [ -1. * this._listenerYaw, 0., 1. ];

        if( typeof this._binauralPanner !== 'undefined' ){
            this._binauralPanner.listenerView = viewPos;
            this._binauralPanner.update();
        }
    }

    /**
     * Get listenerYaw
     * @type {number} yaw angle in degrees
     */
    get listenerYaw(){
        return this._listenerYaw;   
    }

    //==============================================================================
    /**
     * Load a new HRTF from a given URL
     * @type {string} url
     */
    loadHrtfSet( url ){

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        const totalNumberOfChannels_ = this._audioStreamDescriptionCollection.totalNumberOfChannels;

        /// retrieves the positions of all streams 
        const sofaPositions = this._getSofaPositions();

        return this._hrtfSet.load( url )
               .then( () =>
                {
                   console.log( "loaded hrtf from " + url );

                    this._binauralPanner = new binaural.audio.BinauralPanner({
                            audioContext: this._audioContext,
                            hrtfSet: this._hrtfSet,
                            crossfadeDuration: 0.01,
                            positionsType: 'sofaSpherical',
                            sourceCount: totalNumberOfChannels_,
                            sourcePositions: sofaPositions,
                    });

                    this._splitterNode.disconnect();

                    /// connect the inputs
                    for( let i = 0; i < totalNumberOfChannels_; i++ ){
                        this._binauralPanner.connectInputByIndex( i, this._splitterNode, i, 0 );
                    }
                                    
                    /// connect the outputs
                    this._binauralPanner.connectOutputs( this._output );
               }
        );

    }

    _getHorizontalPlane(){

        var sofaPositions = [];

        for( let i = -180; i <= 180; i += 1 ){

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
    _getSofaPositions(){
        
        /// retrieves the AudioStreamDescriptionCollection
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        const asdc = this._audioStreamDescriptionCollection.streams;
        
        var channelIndex = 0;

        var sofaPositions = [];

        /// go through all the streams and mute/unmute according to their 'active' flag
        for (let stream of asdc){

            /// positions expressed with Spat4 navigation coordinate
            const azimuths = stream.channelPositions;

            const numChannelsForThisStream = stream.numChannels;

            for( let i = 0; i < numChannelsForThisStream; i++ ){

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
