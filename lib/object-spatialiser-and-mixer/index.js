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
import utilities from '../core/utils.js';

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

        this._DialogDistance = 1;
        this._CommentaryDistance = 1;
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
        this._CommentaryAzimuth   = azimuth;
        this._CommentaryElevation = elevation;
        this._CommentaryDistance  = distance;

        this._updateCommentaryPosition();
    }

    setCommentaryAzimuth( azim ){
        this.setCommentaryPosition( azim, this._CommentaryElevation, this._CommentaryDistance );
    }

    setCommentaryElevation( elev ){
        this.setCommentaryPosition( this._CommentaryAzimuth, elev, this._CommentaryDistance );
    }    

    setCommentaryDistance( dist ){
        this.setCommentaryPosition( this._CommentaryAzimuth, this._CommentaryElevation, dist );
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

    setCommentaryDistanceFromGui( theSlider ){
        /// the value of the fader
        const valueFader = parseFloat( theSlider.value );

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = [0.5, 10];

        /// scale from GUI to DSP
        const value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );

        this.setCommentaryDistance( value );

        return value
    }

    /**
     * Returns the position of the additionnal mono commentary     
     * @return {array}
     *
     * @details The values are expressed with Spat4 navigational coordinates
     */
    getCommentaryPosition(){
        return [this._CommentaryAzimuth, this._CommentaryElevation, this._CommentaryDistance];
    }

    //==============================================================================
    _updateCommentaryPosition(){

        const channelIndex = this._getChannelIndexForExtendedCommentary();

        if( channelIndex >= 0 ){

            /// convert to SOFA spherical coordinate
            const sofaAzim = -1. * this._CommentaryAzimuth;
            const sofaElev = this._CommentaryElevation;
            const sofaDist = 1.;        /// fow now, the distance is not take into account

            const sofaPos = [ sofaAzim, sofaElev, sofaDist ];

            if( typeof this._virtualSpeakers._binauralPanner !== 'undefined' ){
                this._virtualSpeakers._binauralPanner.setSourcePositionByIndex( channelIndex, sofaPos );
                this._virtualSpeakers._binauralPanner.update();    

                /// now, apply a simple gain to attenuate according to distance
                const drop = ObjectSpatialiserAndMixer.distanceToDrop( this._CommentaryDistance );
                const dropLin = utilities.dB2lin( drop );

                this._virtualSpeakers.setGainForVirtualSource( channelIndex, dropLin );
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
    _getChannelIndexForExtendedCommentary(){

        /// retrieves the AudioStreamDescriptionCollection
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        const asdc = this._audioStreamDescriptionCollection;
        
        return asdc.channelIndexForExtendedCommentary;
    }


    //==============================================================================
    /**
     * Set the position of the additionnal mono dialog     
     * @param {number} azimuth - azimuth @todo values to be defined
     * @param {number} elevation - elevation @todo values to be defined
     * @param {number} distance - distance @todo values to be defined
     *
     * @details The values are expressed with Spat4 navigational coordinates
     */
    setDialogPosition(azimuth, elevation, distance){
        this._DialogAzimuth   = azimuth;
        this._DialogElevation = elevation;
        this._DialogDistance  = distance;

        this._updateDialogPosition();
    }

    setDialogAzimuth( azim ){
        this.setDialogPosition( azim, this._DialogElevation, this._DialogDistance );
    }

    setDialogElevation( elev ){
        this.setDialogPosition( this._DialogAzimuth, elev, this._DialogDistance );
    }  

    setDialogDistance( dist ){
        this.setDialogPosition( this._DialogAzimuth, this._DialogElevation, dist );
    }   

    setDialogAzimuthFromGui( theSlider ){
        
        /// the value of the fader
        const valueFader = parseFloat( theSlider.value );

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = [-180, 180];

        /// scale from GUI to DSP
        const value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );

        this.setDialogAzimuth( value );

        return Math.round( value );
    }

    setDialogElevationFromGui( theSlider ){
        /// the value of the fader
        const valueFader = parseFloat( theSlider.value );

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = [-40, 90];

        /// scale from GUI to DSP
        const value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );

        this.setDialogElevation( value );

        return Math.round( value );
    }   

    setDialogDistanceFromGui( theSlider ){
        /// the value of the fader
        const valueFader = parseFloat( theSlider.value );

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const [minValue, maxValue] = [0.5, 10];

        /// scale from GUI to DSP
        const value = M4DPAudioModules.utilities.scale( valueFader, minFader, maxFader, minValue, maxValue );

        this.setDialogDistance( value );

        return value;
    }   


    /**
     * Returns the position of the additionnal mono dialog     
     * @return {array}
     *
     * @details The values are expressed with Spat4 navigational coordinates
     */
    getDialogPosition(){
        return [this._DialogAzimuth, this._DialogElevation, this._DialogDistance];
    }

    //==============================================================================
    _updateDialogPosition(){

        const channelIndex = this._getChannelIndexForExtendedDialog();

        if( channelIndex >= 0 ){

            /// convert to SOFA spherical coordinate
            const sofaAzim = -1. * this._DialogAzimuth;
            const sofaElev = this._DialogElevation;
            const sofaDist = 1.;        /// fow now, the distance is not take into account

            const sofaPos = [ sofaAzim, sofaElev, sofaDist ];

            if( typeof this._virtualSpeakers._binauralPanner !== 'undefined' ){
                this._virtualSpeakers._binauralPanner.setSourcePositionByIndex( channelIndex, sofaPos );
                this._virtualSpeakers._binauralPanner.update();    

                /// now, apply a simple gain to attenuate according to distance
                const drop = ObjectSpatialiserAndMixer.distanceToDrop( this._DialogDistance );
                const dropLin = utilities.dB2lin( drop );

                this._virtualSpeakers.setGainForVirtualSource( channelIndex, dropLin );
            }
        }
        else{
            /// there is no dialog stream
        }        
    }

    //==============================================================================
    /**
     * The binaural processor handles up to 10 sources, considering all the streams.
     * This function returns the index of the source which corresponds to the dialog
     * (that needs to be spatialized)
     * Returns -1 if there is no dialog
     */
    _getChannelIndexForExtendedDialog(){

        /// retrieves the AudioStreamDescriptionCollection
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        const asdc = this._audioStreamDescriptionCollection;
        
        return asdc.channelIndexForExtendedDialog;
    }

    /**
     * Computes a drop in dB, according to distance
     * @type {number} value : the distance in meters
     */
    static distanceToDrop(value){
        
        const clampDist = utilities.clamp( value, 0.5, 10.0 );
        const refDist   = 1.0;

        /// 6dB each time the distance is x2

        const drop = -6.0 * Math.log2( clampDist / refDist );

        return drop;
    }

    //==============================================================================
    /**
     * Process: "position" + "gain"
     * @todo: how to automatically set the gain, how to have RMS from "the other signal" here
     */
     _process(){
     }
}
