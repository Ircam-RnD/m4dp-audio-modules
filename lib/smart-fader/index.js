/************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      This class implements the so-called SmartFader module of M4DP
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/
import AbstractNode from '../core/index.js';
import utilities from '../core/utils.js';
import MultichannelCompressorNode from '../dsp/compressor.js'

export default class SmartFader extends AbstractNode {
    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection
     * @param {number} dB - dB value for the SmartFader.
     */
    constructor(audioContext, 
                audioStreamDescriptionCollection = undefined, 
                dB = 0.0){
        super( audioContext, audioStreamDescriptionCollection );
        this._dB = undefined;

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        const totalNumberOfChannels_ = this._audioStreamDescriptionCollection.totalNumberOfChannels;

        ///@n the gain and dynamic compression are applied similarly to all channels
        this._gainNode = audioContext.createGain();
        this._dynamicCompressorNode = new MultichannelCompressorNode( audioContext, totalNumberOfChannels_ );

        /// connect the audio nodes
        {
            this.input.connect( this._gainNode );
            this._gainNode.connect( this._dynamicCompressorNode.input );
            this._dynamicCompressorNode.connect( this._output );
        }

        /// initialization
        {
            this.dB = dB;
            this._updateCompressorSettings();
        }
    }

    //==============================================================================
    /**
     * Set the dB value
     * @type {number}
     */
    set dB(value){

        /// clamp the incoming value
        this._dB = SmartFader.clampdB( value );

        /// update the DSP processor
        this._update();
    }

    /**
     * Get the dB value
     * @type {number}
     */
    get dB(){
        return this._dB;
    }

    /**
     * Clips a value within the proper dB range
     * @type {number} value the value to be clipped
     */
    static clampdB(value){
        const [minValue, maxValue] = SmartFader.dBRange;

        return utilities.clamp( value, minValue, maxValue );
    }

    
    /**
     * Get the dB range
     * @type {array}
     * @details +8 dB suffisent, pour passer du -23 au -15 LUFS (iTunes), c'est l'idée.
     */
    static get dBRange(){
        return [-60, 8];
    }

    /**
     * Returns the default value (in dB)
     * @type {number}
     */
    static get dBDefault(){
        return 0;
    }

    /**
     * Returns the dynamic compression state
     * @type {boolean}
     */
    get dynamicCompressionState(){

        /// representing the amount of gain reduction currently applied by the compressor to the signal.

        /**
        Intended for metering purposes, it returns a value in dB, or 0 (no gain reduction) if no signal is fed
        into the DynamicsCompressorNode. The range of this value is between -20 and 0 (in dB).
        */

        const reduction = this._dynamicCompressorNode.getReduction();

        const state = ( reduction < -0.5 ? true : false );

        return state;
    }

    /**
     * Notification when the active stream(s) changes
     */
    activeStreamsChanged(){
        this._updateCompressorSettings();
    }

    _updateCompressorSettings(){

        return;

        /// retrieves the AudioStreamDescriptionCollection
        const asdc = this._audioStreamDescriptionCollection;
        
        if( asdc.hasActiveStream === false ){
            //console.log( "no active streams !!");
            return;
        }
        
        ///@todo : que faire si plusieurs streams sont actifs ??

        /// retrieves the active AudioStreamDescription(s)
        const asd = asdc.actives;

        /// sanity check
        if( asd.length <= 0 ){
            throw new Error("Y'a un bug qq part...");
        }
        
        /// use the first active stream (???)
        const activeStream = asd[0];

        /**
        Le reglage du volume doit se comporter de la facon suivante :
        - attenuation classique du volume sonore entre le niveau nominal (gain = 0) et en deca
        - augmentation classique du volume sonore entre le niveau nominal et le niveau max (niveau max = niveau nominal + I MaxTruePeak I)
        - limiteur/compresseur multicanal au dela du niveau max
        */

        /// retrieves the MaxTruePeak (ITU­R BS.1770­3) of the active AudioStreamDescription
        /// (expressed in dBTP)
        const maxTruePeak = activeStream.maxTruePeak;

        /// integrated loudness (in LUFS)
        const nominal = activeStream.loudness;

        /// sanity check
        if( nominal >= 0.0 ){
            throw new Error("Ca parait pas bon...");
        }

        const threshold = nominal + Math.abs( maxTruePeak );

        /**
        Matthieu :
        Dans mon papier sur le sujet j'avais défini les ordres de grandeur d'une matrice pour expliciter
        la progression de la compression en fonction du niveau d'entrée. 
        Ça donne un ratio de 2:1 sur les premiers 6 dB de dépassement puis 3:1 au delà. 
        Est-ce plus simple pour vous d'user de cette matrice ou d'appeler un compresseur multicanal 
        et lui passer des paramètres classiques ?

        On aurait alors :
        Threshold à -18 dBFS
        Ratio à 2:1
        Attack à 20 ms
        Release à 200 ms
        */

        
        /// representing the decibel value above which the compression will start taking effect
        this._dynamicCompressorNode.setThreshold( threshold );

        /// representing the amount of change, in dB, needed in the input for a 1 dB change in the output
        this._dynamicCompressorNode.setRatio( 2 );  

        /// representing the amount of time, in seconds, required to reduce the gain by 10 dB
        this._dynamicCompressorNode.setAttack( 0.02 );  

        /// representing the amount of time, in seconds, required to increase the gain by 10 dB
        this._dynamicCompressorNode.setRelease( 0.2 );
        
    }

    _update(){

        //console.log( "_update" );

        /// the current fader value, in dB
        const fader = this._dB;

        if( typeof fader === "undefined" || isNaN( fader ) === true ) {
            /// this can happen during the construction...
            return;
        }

        const lin = utilities.dB2lin( fader );

        this._gainNode.gain.value = lin;
    }
}
