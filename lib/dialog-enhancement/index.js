/************************************************************************************/
/*!
 *   @file       
 *   @brief      Implements the DialogEnhancement of M4DP
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';
import MultichannelGainNode from '../dsp/multichannelgain.js'

export default class DialogEnhancement extends AbstractNode {
    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.     
     */
    constructor( audioContext, audioStreamDescriptionCollection ){
        super( audioContext, audioStreamDescriptionCollection );
        this._mode = 1;
        this._dialogGain = 0.0;
        this._isBypass = true;

        this._updateAudioGraph();
    }

    //==============================================================================
    /**
     * Enable or bypass the processor
     * @type {boolean}
     */
    set bypass( value ){

        if( value !== this._isBypass ){
            this._isBypass = value;
            this._updateAudioGraph();
        }
    }

    /**
     * Returns true if the processor is bypassed
     */
    get bypass(){
        return this._isBypass;
    }

    //==============================================================================
    /**
     * Notification when the active stream(s) changes
     */
    activeStreamsChanged(){
        this._updateAudioGraph();
    }

    //==============================================================================
    get hasActiveExtendedDialog(){
        return this._audioStreamDescriptionCollection.hasActiveExtendedDialog;
    }

    get channelIndexForExtendedDialog(){
        return this._audioStreamDescriptionCollection.channelIndexForExtendedDialog;
    }

    get hasActiveExtendedAmbiance(){
        return this._audioStreamDescriptionCollection.hasActiveExtendedAmbiance;
    }



    //==============================================================================
    /**
     * Set Mode - value is 1, 2 or 3
     * @type {number}
     */
    set mode( value ){

        if( value < 1 || value > 3 ){
            throw new Error( "Invalid mode " + value );
        }

        if( value != this._mode ){

            // @todo error in some mode: eg. mode 1 and no dialog => "impossible"
            // error mode 2 et pas de 5.0 ou 5.1
            // error mode 3 et pas de stéréo
            this._mode = value;

            this._updateAudioGraph();
        }
    }

    setModeFromString( value ){

        if( value == 'Mode 1'){
            this.mode = 1;
        }
        else if( value == 'Mode 2'){
            this.mode = 2;
        }
        else if( value == 'Mode 3'){
            this.mode = 3;
        }
        else{
            throw new Error( "Invalid mode " + value );
        }
    }

    /**
     * Get Mode - value is 1, 2 or 3
     * @type {number}
     */
    get mode(){
        return this._mode;
    }

    //==============================================================================
    /**
     * Set dialogGain
     * @type {number}
     * @todo give range of accepted values
     */
    set dialogGain( value ){

        this._dialogGain = value;

        this._update();
    }
    /**
     * Get dialogGain
     * @type {number}
     * @todo give range of accepted values
     */
    get dialogGain(){
        return this._dialogGain;
    }

    //==============================================================================
    _update(){

    }

    //==============================================================================
    /**
     * Returns true if the streams are available for the current mode
     */
    _canProcessCurrentMode(){

        const mode = this.mode;

        if( mode === 1 ){

            /// ajustement total du niveau des dialogues en cas de fourniture séparée
            /// des éléments “dialogues seuls” et “ambiances, musiques et effets”
            if( this.hasActiveExtendedDialog === true 
             && this.hasActiveExtendedAmbiance === true ){
                return true;
            }
            else{
                return false;
            }

        }
        else if( mode === 2 ){
            /// not yet implemented
            return true;
        }
        else if( mode === 3 ){
            /// not yet implemented
            return true;
        }
        else{
            throw new Error( "Invalid mode " + value );
        }

    }

    //==============================================================================
    /**
     * Updates the connections of the audio graph
     */
    _updateAudioGraph(){

        /// first of all, disconnect everything
        this._input.disconnect();

        if( this.bypass === true || this._canProcessCurrentMode() === false ){

            this._input.connect( this._output );

        }
        else{

            

        }

        this._update();
    }
}

