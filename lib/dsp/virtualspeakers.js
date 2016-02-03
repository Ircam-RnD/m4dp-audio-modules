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
     */
    constructor( audioContext, audioStreamDescriptionCollection ){
        super( audioContext, audioStreamDescriptionCollection );
        this._splitterNode = undefined;
        this._binauralPanner = undefined;
        this._hrtfSet = undefined;

        /// retrieves the positions of all streams 
        const sofaPositions = this._getSofaPositions();

        /// instanciate an empty hrtf set
        this._hrtfSet = new binaural.sofa.HrtfSet({
                 audioContext: audioContext,
                 positionsType: 'gl', // mandatory for BinauralPanner
                 filterPositions: sofaPositions,
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

        /// split the input streams into 10 independent channels
        this.input.connect( this._splitterNode );

        /// the binaural panner is not yet created;
        /// it will be instanciated and connected to the audio graph as soon as an SOFA URL is loaded
        
        const url = 'http://bili2.ircam.fr/SimpleFreeFieldHRIR/BILI/COMPENSATED/44100/IRC_1100_C_HRIR.sofa';
        this.loadHrtfSet( url );
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

                    /// connect the inputs
                    for( let i = 0; i < totalNumberOfChannels_; i++ ){
                        this._binauralPanner.connectInputByIndex( i, this._splitterNode, i, 0 );
                    }
                                    
                    /// connect the outputs
                    this._binauralPanner.connectOutputs( this._output );
               }
        );
        

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
