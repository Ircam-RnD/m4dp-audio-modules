/************************************************************************************/
/*!
 *   @file       
 *   @brief      Implements the DialogEnhancement of M4DP
 *   @author     Thibaut Carpentier / Ircam CNRS UMR9912
 *   @date       01/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';
import MultichannelGainNode from '../dsp/multichannelgain.js'
import {clamp, scale, dB2lin} from '../core/utils.js';
import CenterEnhancementNode from '../dsp/centerenhancement.js'

export default class DialogEnhancement extends AbstractNode
{
    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.     
     */
    constructor( audioContext, audioStreamDescriptionCollection )
    {
        super( audioContext, audioStreamDescriptionCollection );
        this._mode = 0;
        this._balance = 100.0;
        this._isBypass = false;
        this._processor1 = new DialogEnhancementProcessorMode1( audioContext, audioStreamDescriptionCollection );
        this._processor2 = new DialogEnhancementProcessorMode2( audioContext, audioStreamDescriptionCollection );
        this._processor3 = new DialogEnhancementProcessorMode3( audioContext, audioStreamDescriptionCollection );

        this._updateAudioGraph();
    }

    //==============================================================================
    getTotalNumberOfChannels()
    {
        return this._audioStreamDescriptionCollection.totalNumberOfChannels;
    }

    //==============================================================================
    /**
     * Enable or bypass the processor
     * @type {boolean}
     */
    set bypass( value )
    {
        if( value !== this._isBypass )
        {
            this._isBypass = value;
            this._updateAudioGraph();
        }
    }

    /**
     * Returns true if the processor is bypassed
     */
    get bypass()
    {
        return this._isBypass;
    }

    //==============================================================================
    /**
     * Notification when the active stream(s) changes
     */
    activeStreamsChanged()
    {
        this._chooseAppropriateMode();

        this._updateAudioGraph();
    }

    //==============================================================================
    get hasActiveExtendedDialog()
    {
        return this._audioStreamDescriptionCollection.hasActiveExtendedDialog;
    }

    get channelIndexForExtendedDialog()
    {
        return this._audioStreamDescriptionCollection.channelIndexForExtendedDialog;
    }

    get hasActiveExtendedAmbiance()
    {
        return this._audioStreamDescriptionCollection.hasActiveExtendedAmbiance;
    }

    get hasActiveMultiWithDialog()
    {
        return this._audioStreamDescriptionCollection.hasActiveMultiWithDialog;
    }

    get hasActiveStereoWithDialog()
    {
        return this._audioStreamDescriptionCollection.hasActiveStereoWithDialog;
    }


    //==============================================================================
    _chooseAppropriateMode()
    {
        var mode = 0;   ///< 0 corresponds to bypass

        if( this.hasActiveExtendedDialog === true && this.hasActiveExtendedAmbiance === true )
        {
            mode = 1;
        }
        else if( this.hasActiveMultiWithDialog === true )
        {
            mode = 2;
        }
        else if( this.hasActiveStereoWithDialog === true )
        {
            mode = 3;
        }

        /// mode 0 ==> bypass
        /// mode 1 ==> balance entre le Extended dialog et le Extended Ambiance
        /// le flux main est inchange
        /// mode 2 ==> on agit sur la voie centrale du Main, s'il s'agit d'un 5.1 ou 5.0
        /// mode 3 ==> lorsqu'on a juste un flux stereo

        this.mode = mode;
    }

    //==============================================================================
    /**
     * Set Mode - value is 1, 2 or 3
     * @type {number}
     */
    set mode( value )
    {
        console.log( 'DialogEnhancement to mode ' + value );

        if( value < 0 || value > 3 )
        {
            throw new Error( "Invalid mode " + value );
        }

        if( value != this._mode )
        {
            this._mode = value;
            this._updateAudioGraph();
        }
    }

    setModeFromString( value )
    {
        if( value == 'Mode 1')
        {
            this.mode = 1;
        }
        else if( value == 'Mode 2')
        {
            this.mode = 2;
        }
        else if( value == 'Mode 3')
        {
            this.mode = 3;
        }
        else
        {
            throw new Error( "Invalid mode " + value );
        }
    }

    /**
     * Get Mode - value is 0, 1, 2 or 3
     * @type {number}
     */
    get mode()
    {
        return this._mode;
    }

    //==============================================================================        
    /**
     * Sets the balance (in 0 - 100 %) between dialogs and ambiance
     *      
     */
    set balance( value )
    {
        this._balance = value;
        this._update();
    }

    /**
     * Returns the balance (in 0 - 100 %) between dialogs and ambiance
     * @type {number}     
     */
    get balance()
    {
        return this._balance;
    }

    setBalanceFromGui( theSlider )
    {
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

    getBalanceFromGui( theSlider )
    {

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
    _update()
    {
        this._processor1.balance = this.balance;
        this._processor2.balance = this.balance;
        this._processor3.balance = this.balance;
    }


    //==============================================================================
    /**
     * Updates the connections of the audio graph
     */
    _updateAudioGraph()
    {

        /// first of all, disconnect everything
        this._input.disconnect();
        this._processor1.disconnect();
        this._processor2.disconnect();

        const mode = this.mode;

        if( this.bypass === true || mode === 0 )
        {
            this._input.connect( this._output );
        }
        else
        {

            if( mode === 1 )
            {
                this._input.connect( this._processor1._input );
                this._processor1.connect( this._output );
            }
            else if( mode === 2 )
            {
                this._input.connect( this._processor2._input );
                this._processor2.connect( this._output );
            }
            else if( mode === 3 )
            {
                this._input.connect( this._processor3._input );
                this._processor3.connect( this._output );
            }

        }

        this._update();
    }
}


class DialogEnhancementProcessorMode1 extends AbstractNode
{
    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.     
     */
    constructor( audioContext, audioStreamDescriptionCollection )
    {
        super( audioContext, audioStreamDescriptionCollection );
        this._balance = 100;

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        const totalNumberOfChannels_ = this.getTotalNumberOfChannels();

        this._gainsNode = new MultichannelGainNode( audioContext, totalNumberOfChannels_ );

        this._updateAudioGraph();
    }

    //==============================================================================
    getTotalNumberOfChannels()
    {
        return this._audioStreamDescriptionCollection.totalNumberOfChannels;
    }

    //==============================================================================
    /**
     * Returns the current number of channels
     */
    getNumChannels()
    {
        return this._gainsNode.getNumChannels();
    }

    //==============================================================================        
    /**
     * Sets the balance (in 0 - 100 %) between dialogs and ambiance
     *      
     */
    set balance( value )
    {
        /// 100% --> only the dialogs
        /// 0% --> only the ambiance

        const percent = clamp( value, 0., 100. );

        this._balance = percent;

        this._update();
    }

    get balance()
    {
        return this._balance;
    }

    //==============================================================================
    /**
     * Returns true if this channel index corresponds to the extended dialog
     *      
     */
    isChannelForExtendedDialog( channelIndex )
    {
        return this._audioStreamDescriptionCollection.isChannelForExtendedDialog( channelIndex );
    }

    //==============================================================================
    /**
     * Returns true if this channel index corresponds to the extended ambiance
     *      
     */
    isChannelForExtendedAmbiance( channelIndex )
    {
        return this._audioStreamDescriptionCollection.isChannelForExtendedAmbiance( channelIndex );
    }

    //==============================================================================
    /**
     * Updates the gains for each channel
     *      
     */
    _update()
    {

        const gainForDialogs  = scale( this.balance, 0., 100., 0., 1. );
        const gainForAmbiance = 1.0 - gainForDialogs;

        for( let k = 0; k < this.getNumChannels(); k++ )
        {
            if( this.isChannelForExtendedDialog(k) === true )
            {
                this._gainsNode.setGain( k, gainForDialogs );
            }
            else if( this.isChannelForExtendedAmbiance(k) === true )
            {
                this._gainsNode.setGain( k, gainForAmbiance );   
            }
            else
            {
                this._gainsNode.setGain( k, 1.0 );      
            }

        }
    }

    //==============================================================================
    /**
     * Updates the connections of the audio graph
     */
    _updateAudioGraph()
    {

        /// first of all, disconnect everything
        this._input.disconnect();
        this._gainsNode.disconnect();

        this._input.connect( this._gainsNode._input );
        this._gainsNode.connect( this._output );

        this._update();
    }
}




class DialogEnhancementProcessorMode2 extends AbstractNode
{
    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.     
     */
    constructor( audioContext, audioStreamDescriptionCollection )
    {
        super( audioContext, audioStreamDescriptionCollection );
        this._balance = 100;

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        const totalNumberOfChannels_ = this.getTotalNumberOfChannels();

        this._gainsNode = new MultichannelGainNode( audioContext, totalNumberOfChannels_ );

        this._updateAudioGraph();
    }

    //==============================================================================
    getTotalNumberOfChannels()
    {
        return this._audioStreamDescriptionCollection.totalNumberOfChannels;
    }

    //==============================================================================
    /**
     * Returns the current number of channels
     */
    getNumChannels()
    {
        return this._gainsNode.getNumChannels();
    }

    //==============================================================================        
    /**
     * Sets the balance (in 0 - 100 %) between dialogs and ambiance
     *      
     */
    set balance( value )
    {
        /// 100% --> +6 dB for the dialog
        /// 0% --> -6 dB for the dialog

        const percent = clamp( value, 0., 100. );

        this._balance = percent;

        this._update();
    }

    get balance()
    {
        return this._balance;
    }

    //==============================================================================
    /**
     * Returns true if this channel index corresponds to a center channel (of 5.0 or 5.1 stream)
     *      
     */
    isChannelCenter( channelIndex )
    {
        return this._audioStreamDescriptionCollection.isChannelCenter( channelIndex );
    }

    //==============================================================================
    /**
     * Updates the gains for each channel
     *      
     */
    _update()
    {

        const balanceIndB = scale( this.balance, 0., 100., -6., 6. );

        const gainForDialogs  = dB2lin( balanceIndB );
        
        for( let k = 0; k < this.getNumChannels(); k++ )
        {
            if( this.isChannelCenter(k) === true )
            {
                this._gainsNode.setGain( k, gainForDialogs );
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
    _updateAudioGraph()
    {

        /// first of all, disconnect everything
        this._input.disconnect();
        this._gainsNode.disconnect();

        this._input.connect( this._gainsNode._input );
        this._gainsNode.connect( this._output );

        this._update();
    }
}




class DialogEnhancementProcessorMode3 extends AbstractNode
{
    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.     
     */
    constructor( audioContext, audioStreamDescriptionCollection )
    {
        super( audioContext, audioStreamDescriptionCollection );
        this._balance = 100;

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        const totalNumberOfChannels_ = this.getTotalNumberOfChannels();

        this._channelSplitterNode = this._audioContext.createChannelSplitter( totalNumberOfChannels_ );
        this._channelMergerNode   = this._audioContext.createChannelMerger( totalNumberOfChannels_ );

        this._input.connect( this._channelSplitterNode );

        this._channelSplitter2 = this._audioContext.createChannelSplitter( 2 );
        this._channelMerger2   = this._audioContext.createChannelMerger( 2 );

        /// 
        this._centerEnhancement = new CenterEnhancementNode( audioContext );
        
        {
            this._channelSplitterNode.connect( this._channelMerger2, 0, 0 );
            this._channelSplitterNode.connect( this._channelMerger2, 1, 1 );

            this._channelMerger2.connect( this._centerEnhancement._input );
            this._centerEnhancement.connect( this._channelSplitter2 );

            this._channelSplitter2.connect( this._channelMergerNode, 0, 0 );
            this._channelSplitter2.connect( this._channelMergerNode, 1, 1 );
        }

        for( let k = 2; k < totalNumberOfChannels_; k++ )
        {
            this._channelSplitterNode.connect( this._channelMergerNode, k, k );
        }

        this._channelMergerNode.connect( this._output );

    }

    //==============================================================================
    getTotalNumberOfChannels()
    {
        return this._audioStreamDescriptionCollection.totalNumberOfChannels;
    }

    //==============================================================================        
    /**
     * Sets the balance (in 0 - 100 %) between dialogs and ambiance
     *      
     */
    set balance( value )
    {
        /// 100% --> +6 dB for the dialog
        /// 0% --> -6 dB for the dialog

        const percent = clamp( value, 0., 100. );

        this._balance = percent;

        this._update();
    }

    get balance()
    {
        return this._balance;
    }

    //==============================================================================
    /**
     * Updates the gains for each channel
     *      
     */
    _update()
    {
        const balanceIndB = scale( this.balance, 0., 100., 0., 12. );
        
        this._centerEnhancement.gain = balanceIndB;    
    }

}

