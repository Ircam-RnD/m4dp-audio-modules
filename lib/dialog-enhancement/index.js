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
//import utilities from '../core/utils.js';
import {clamp, scale} from '../core/utils.js';

export default class DialogEnhancement extends AbstractNode {
    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.     
     */
    constructor( audioContext, audioStreamDescriptionCollection ){
        super( audioContext, audioStreamDescriptionCollection );
        this._mode = 1;
        this._balance = 100.0;
        this._isBypass = false;
        this._processor1 = new DialogEnhancementProcessorMode1( audioContext, audioStreamDescriptionCollection );

        this._updateAudioGraph();
    }

    //==============================================================================
    getTotalNumberOfChannels(){
        return this._audioStreamDescriptionCollection.totalNumberOfChannels;
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
     * Sets the balance (in 0 - 100 %) between dialogs and ambiance
     *      
     */
    set balance( value ){

        this._balance = value;

        this._update();
    }

    /**
     * Returns the balance (in 0 - 100 %) between dialogs and ambiance
     * @type {number}     
     */
    get balance(){
        return this._balance;
    }

    setBalanceFromGui( theSlider ){
        /// the value of the fader
        const valueFader = parseFloat( theSlider.value );

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const minValue = 0;
        const maxValue = 100;

        /// scale from GUI to DSP
        const value = scale( valueFader, minFader, maxFader, minValue, maxValue );

        this.balance = value;

        return value;
    }

    getBalanceFromGui( theSlider ){

        // get the bounds of the fader (GUI)
        const minFader = parseFloat( theSlider.min );
        const maxFader = parseFloat( theSlider.max );

        // get the actual bounds for this parameter
        const minValue = 0;
        const maxValue = 100;

        const actualValue = this.balance;

        /// scale from DSP to GUI
        const value = M4DPAudioModules.utilities.scale( actualValue, minValue, maxValue, minFader, maxFader );

        return value;
    }

    //==============================================================================
    _update(){

        this._processor1.balance = this.balance;

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
        this._processor1.disconnect();

        if( this.bypass === true || this._canProcessCurrentMode() === false ){

            this._input.connect( this._output );

        }
        else{

            const mode = this.mode;

            if( mode === 1 ){

                this._input.connect( this._processor1._input );
                this._processor1.connect( this._output );

            }

        }

        this._update();
    }
}


class DialogEnhancementProcessorMode1 extends AbstractNode {
    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.     
     */
    constructor( audioContext, audioStreamDescriptionCollection ){
        super( audioContext, audioStreamDescriptionCollection );
        this._balance = 100;

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        const totalNumberOfChannels_ = this.getTotalNumberOfChannels();

        this._gainsNode = new MultichannelGainNode( audioContext, totalNumberOfChannels_ );

        this._updateAudioGraph();
    }

    //==============================================================================
    getTotalNumberOfChannels(){
        return this._audioStreamDescriptionCollection.totalNumberOfChannels;
    }

    //==============================================================================
    /**
     * Returns the current number of channels
     */
    getNumChannels(){
        return this._gainsNode.getNumChannels();
    }

    //==============================================================================        
    /**
     * Sets the balance (in 0 - 100 %) between dialogs and ambiance
     *      
     */
    set balance( value ){

        /// 100% --> only the dialogs
        /// 0% --> only the ambiance

        const percent = clamp( value, 0., 100. );

        this._balance = percent;

        this._update();
    }

    get balance(){
        return this._balance;
    }

    //==============================================================================
    /**
     * Returns true if this channel index corresponds to the extended dialog
     *      
     */
    isChannelForExtendedDialog( channelIndex ){

        return this._audioStreamDescriptionCollection.isChannelForExtendedDialog( channelIndex );
    }

    //==============================================================================
    /**
     * Returns true if this channel index corresponds to the extended ambiance
     *      
     */
    isChannelForExtendedAmbiance( channelIndex ){
        return this._audioStreamDescriptionCollection.isChannelForExtendedAmbiance( channelIndex );
    }

    //==============================================================================
    /**
     * Updates the gains for each channel
     *      
     */
    _update(){

        const gainForDialogs  = scale( this.balance, 0., 100., 0., 1. );
        const gainForAmbiance = 1.0 - gainForDialogs;

        for( let k = 0; k < this.getNumChannels(); k++ ){

            if( this.isChannelForExtendedDialog(k) === true ){
                this._gainsNode.setGain( k, gainForDialogs );
            }
            else if( this.isChannelForExtendedAmbiance(k) === true ){
                this._gainsNode.setGain( k, gainForAmbiance );   
            }
            else{
                this._gainsNode.setGain( k, 1.0 );      
            }

        }
    }

    //==============================================================================
    /**
     * Updates the connections of the audio graph
     */
    _updateAudioGraph(){

        /// first of all, disconnect everything
        this._input.disconnect();
        this._gainsNode.disconnect();

        this._input.connect( this._gainsNode._input );
        this._gainsNode.connect( this._output );

        this._update();
    }
}


