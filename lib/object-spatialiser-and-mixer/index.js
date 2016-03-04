/************************************************************************************/
/*!
 *   @file       
 *   @brief      Implements the ObjectSpatialiserAndMixer of M4DP
 *   @author     Thibaut Carpentier, Samuel Goldszmidt
 *   @date       01/2016
 *
 */
/************************************************************************************/
import MultichannelSpatialiser from '../multichannel-spatialiser/index.js';

export default class ObjectSpatialiserAndMixer extends MultichannelSpatialiser {
    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
     * @param {string} outputType - output type 'binaural' or 'transaural' or 'multichannel'     
     * @param {string} headphoneEqPresetName - the name of the headphone equalization preset (they are hard-coded) 
     * @param {number} offsetGain - the offset gain (expressed in dB)
     * @param {number} listenerYaw - yaw angle in degrees
     */
    constructor(audioContext,
                audioStreamDescriptionCollection = undefined,
                outputType = 'binaural',
                headphoneEqPresetName = 'none',
                offsetGain = 0.0,
                listenerYaw = 0.0){
        super(audioContext, audioStreamDescriptionCollection, outputType, headphoneEqPresetName, offsetGain, listenerYaw);

        this._distance = 1;
    }

    //==============================================================================
    /**
     * Set the position of the additionnal mono commentary     
     * @param {number} azimuth - azimuth @todo values to be defined
     * @param {number} elevation - elevation @todo values to be defined
     * @param {number} distance - distance @todo values to be defined
     *
     * @details The values are expressed with Spat4 navigational coordinates
     */
    setCommentaryPosition(azimuth, elevation, distance){
        this._azimuth   = azimuth;
        this._elevation = elevation;
        this._distance  = distance;

        this._updateCommentaryPosition();
    }

    setCommentaryAzimuth( azim ){
        this.setCommentaryPosition( azim, this._elevation, this._distance );
    }

    setCommentaryElevation( elev ){
        this.setCommentaryPosition( this._azimuth, elev, this._distance );
    }    

    setCommentaryAzimuthFromGui( theSlider ){
        
        /// the value of the fader
        const valueFader = parseFloat( theSlider.value );

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = [-180, 180];

        /// scale from GUI to DSP
        const value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );

        this.setCommentaryAzimuth( value );

        return Math.round( value );
    }

    setCommentaryElevationFromGui( theSlider ){
        /// the value of the fader
        const valueFader = parseFloat( theSlider.value );

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = [-40, 90];

        /// scale from GUI to DSP
        const value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );

        this.setCommentaryElevation( value );

        return Math.round( value );
    }   

    /**
     * Returns the position of the additionnal mono commentary     
     * @return {array}
     *
     * @details The values are expressed with Spat4 navigational coordinates
     */
    getCommentaryPosition(){
        return [this._azimuth, this._elevation, this._distance];
    }

    //==============================================================================
    _updateCommentaryPosition(){

        const sourceIndex = this._getSourceIndexForCommentary();

        if( sourceIndex >= 0 ){

            /// convert to SOFA spherical coordinate
            const sofaAzim = -1. * this._azimuth;
            const sofaElev = this._elevation;
            const sofaDist = 1.;        /// fow now, the distance is not take into account

            const sofaPos = [ sofaAzim, sofaElev, sofaDist ];

            if( typeof this._virtualSpeakers._binauralPanner !== 'undefined' ){
                this._virtualSpeakers._binauralPanner.setSourcePositionByIndex( sourceIndex, sofaPos );
                this._virtualSpeakers._binauralPanner.update();    
            }
        }
        else{
            /// there is no commentary stream
        }        
    }

    //==============================================================================
    /**
     * The binaural processor handles up to 10 sources, considering all the streams.
     * This function returns the index of the source which corresponds to the commentary
     * (that needs to be spatialized)
     * Returns -1 if there is no commentary
     */
    _getSourceIndexForCommentary(){

        /// retrieves the AudioStreamDescriptionCollection
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        const asdc = this._audioStreamDescriptionCollection.streams;
        
        var sourceIndex = 0;

        /// go through all the streams and mute/unmute according to their 'active' flag
        for (let stream of asdc){
            
            if( stream.commentary === true ){

                if( stream.type !== "Mono" ){
                    throw new Error( "The commentary must be mono!" );
                } 

                return sourceIndex;
            }
            else{
                const numChannelsForThisStream = stream.numChannels;

                sourceIndex += numChannelsForThisStream;
            }
        }

        return -1;
    }

    //==============================================================================
    /**
     * Process: "position" + "gain"
     * @todo: how to automatically set the gain, how to have RMS from "the other signal" here
     */
     _process(){
     }
}
