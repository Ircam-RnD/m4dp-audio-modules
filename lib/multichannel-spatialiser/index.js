/************************************************************************************/
/*!
 *   @file       
 *   @brief      Implements the MultichannelSpatialiser of M4DP
 *   @author     Thibaut Carpentier, Samuel Goldszmidt
 *   @date       01/2016
 *
 */
/************************************************************************************/

import AbstractNode from '../core/index.js';

import HeadphonesEqualization from '../dsp/headphoneequalization.js'

import utilities from '../core/utils.js';

import {TransauralShufflerNode} from '../dsp/transaural.js'


export default class MultichannelSpatialiser extends AbstractNode {
    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
     * @param {string} outputType - output type 'binaural' or 'transaural' or 'multichannel'
     * @param {binaural.HrtfSet} : HRTF set to load
     * @param {string} headphoneEqPresetName - the name of the headphone equalization preset (they are hard-coded) 
     * @param {number} offsetGain - the offset gain (expressed in dB)
     * @param {number} listeningAxis - angle? @todo value to be defined
     */
    constructor(audioContext,
                audioStreamDescriptionCollection = undefined,
                outputType = 'binaural',
                hrtf = undefined,
                headphoneEqPresetName = 'none',
                offsetGain = 0.0,
                listeningAxis = undefined ){
        super( audioContext, audioStreamDescriptionCollection );        
        this._hrtf = hrtf;
        this._headphonesEqualizationNode = new HeadphonesEqualization( audioContext );
        
        this._listeningAxis = listeningAxis;

        /// creates a gain Node. This node is used to process the so-called 'offset gain'
        this._gainNode = audioContext.createGain();

        ///@todo : connect the gainNode where it should be

        /// set the offset gain
        this.offsetGain = offsetGain;

        /// loads the proper headphone equalization preset
        this.eqPreset = headphoneEqPresetName;

        /// set the output type
        this.outputType = outputType;
    }

    //==============================================================================
    /**
     * Set outputType: 'binaural' or 'transaural' or 'multichannel'
     * @type {string}
     */
    set outputType( value ){

        if( value === 'binaural' || value === 'transaural' || value === 'multichannel' ){
            
            this._outputType = value;

            this._updateAudioGraph();
        }
        else
        {
            throw new Error( "Invalid output type " + value );
        }
        
    }
    /**
     * Returns the current output type: 'binaural' or 'transaural' or 'multichannel'
     * @type {string}
     */
    get outputType(){
        return this._outputType;
    }

    //==============================================================================
    /**
     * Updates the connections of the audio graph
     */
    _updateAudioGraph(){

        this._updateGainOffset();

        if( this.isInBinauralMode() === true ){

        }
        else if( this.isInTransauralMode() === true ){

        }
        else if( this.isInMultichannelMode() === true ){

        }
        else{
            throw new Error( "Pas normal!" );
        }

        ///@todo a completer
    }

    //==============================================================================
    /**
     * Updates the gainNode which actually process the so-called 'offset gain'
     */
    _updateGainOffset(){
        
        /// the so-called 'offset gain' is only applied for transaural or binaural
        if( this.isInBinauralMode() === true || this.isInTransauralMode() === true ){
            const gainIndB   = this.offsetGain();
            const gainLinear = utilities.dB2lin( gainIndB );

            this._gainNode.gain.value = gainLinear;
        }
        else{
            /// this is the multichannel mode; no gain offset applied
            this._gainNode.gain.value = 1.0;
        }
    }

    //==============================================================================
    /**
     * Returns true if we are currently in binaural mode
     */
    isInBinauralMode(){
        return ( this.outputType === 'binaural' ? true : false );
    }

    /**
     * Returns true if we are currently in transaural mode
     */
    isInTransauralMode(){
        return ( this.outputType === 'transaural' ? true : false );
    }

    /**
     * Returns true if we are currently in multichannel mode
     */
    isInMultichannelMode(){
        return ( this.outputType === 'multichannel' ? true : false );
    }

    //==============================================================================
    /**
     * Set audio streams description (json)
     * @type {AudioStreamDescriptionCollection}
     */
    set audioStreamDescriptionCollection(value){

    }
    /**
     * Get audio streams description
     * @type {AudioStreamDescriptionCollection}
     */
    get audioStreamDescriptionCollection(){
        return _audioStreamDescriptionCollection;
    }

    //==============================================================================
    /**
     * Loads a set of HRTF
     * @type {binaural.HrtfSet} : cf the binaural module
     */
    set hrtf( value ){
        this._hrtf = value;
    }

    ///@todo simplified function loadHrtfFrom( subjectNumber )
    /// using the current sampling rate
    /// --> creates a new HrtfSet and load it

    /**
     * Returns the current hrtf
     * @type {HRTF}
     */
    get hrtf(){
        return this._hrtf;
    }

    //==============================================================================
    /**
     * Loads a new headphones equalization preset
     * @type {string} presetName : the name of the preset (they are hard-coded) 
     */
    set eqPreset( presetName ){
        this._headphonesEqualizationNode.eqPreset = presetName;
    }

    /**
     * Returns the name of the current headphones equalization preset
     * @type {string}
     */
    get eqPreset(){
        return this._headphonesEqualizationNode.eqPreset;
    }

    //==============================================================================
    /**
     * Set the offset gain (expressed in dB)
     * (un gain d’offset afin de maintenir un niveau subjectif après l’enclenchement du process de spatialisation)
     * @todo range
     * @type {number} value
     */
    set offsetGain( value ){

        /// precaution : the value in clipped in the [-12 +12] dB range
        this._offsetGain = utilities.clamp( value, -12, 12 );

        /// update the DSP processor
        this._updateGainOffset();
    }

    /**
     * Returns the offset gain (expressed in dB)
     * @type {number}
     */
    get offsetGain(){
        return this._offsetGain;
    }

    //==============================================================================
    /**
     * Set listeningAxis
     * @todo value type? angle?
     * @type {number}
     */
    set listeningAxis(value){
        this._listeningAxis = value;
    }
    /**
     * Get listeningAxis
     * @type {number}
     */
    get listeningAxis(){
        return this._listeningAxis;
    }
}
